import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { BANNED_TERMS, raiseFlag } from "@/lib/activity";
import { AI_BOT_ID } from "@/lib/chat";
import {
  countAiUsageToday,
  getAiSettings,
  logAiUsage,
} from "@/lib/ai/settings";
import { runAiChat, AiUnavailableError } from "@/lib/ai/gateway";

export const runtime = "nodejs";

export const AI_ROOM = "ai";

const MAX_LENGTH = 1000;
const RATE_LIMIT_MS = 10_000;

function error(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(request: Request) {
  const ctx = await requireUser();
  if (!ctx) return error("You must be signed in.", 401);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return error("Invalid request body.", 400);
  }

  const content = (body as { content?: unknown })?.content;
  if (typeof content !== "string" || content.trim().length === 0) {
    return error("Message can't be empty.", 400);
  }
  const cleanContent = content.trim();
  if (cleanContent.length > MAX_LENGTH) {
    return error(`Messages are limited to ${MAX_LENGTH} characters.`, 400);
  }

  const banned = BANNED_TERMS.find((term) => cleanContent.toLowerCase().includes(term));
  if (banned) {
    await raiseFlag(ctx.supabase, ctx.user.id, "chat_inappropriate", "medium", {
      room: AI_ROOM,
      content: cleanContent.slice(0, 200),
      term: banned,
    });
    return error("That message can't be sent here.", 400);
  }

  const settings = await getAiSettings(ctx.supabase);
  if (!settings.ai_enabled) {
    return error("The AI assistant is switched off right now — ask your teacher.", 503);
  }
  if (!process.env.NVIDIA_API_KEY) {
    return error("The AI assistant isn't set up yet.", 503);
  }

  const { data: recent } = await ctx.supabase
    .from("chat_messages")
    .select("id")
    .eq("user_id", ctx.user.id)
    .eq("room", AI_ROOM)
    .gt("created_at", new Date(Date.now() - RATE_LIMIT_MS).toISOString())
    .limit(1);
  if ((recent ?? []).length > 0) {
    return error("The AI is still thinking about your last question — give it a moment.", 429);
  }

  const usedToday = await countAiUsageToday(ctx.supabase, ctx.user.id, "chat");
  if (usedToday >= settings.ai_daily_cap) {
    return error(
      `You've hit today's AI limit (${settings.ai_daily_cap} questions). Try again tomorrow.`,
      429
    );
  }

  let result;
  try {
    result = await runAiChat(ctx, cleanContent, settings.ai_model);
  } catch (err) {
    console.error("[ai] chat failed:", err);
    if (err instanceof AiUnavailableError) {
      return error("The AI assistant isn't set up yet.", 503);
    }
    return error("The AI assistant had a problem — try again in a minute.", 502);
  }

  const { error: studentInsertError } = await ctx.supabase
    .from("chat_messages")
    .insert({
      room: AI_ROOM,
      user_id: ctx.user.id,
      sender_name: ctx.profile.full_name,
      content: cleanContent,
    });
  if (studentInsertError) {
    console.error("[ai] student message insert failed:", studentInsertError.message);
    return error("Your message couldn't be saved.", 500);
  }

  const { data: botMessage, error: botInsertError } = await ctx.supabase.rpc(
    "insert_ai_message",
    { p_room: AI_ROOM, p_content: result.content, p_bot_id: AI_BOT_ID }
  );
  if (botInsertError) {
    console.error("[ai] bot message insert failed:", botInsertError.message);
    return error("The answer came back but couldn't be saved — try again.", 500);
  }

  await logAiUsage(
    ctx.supabase,
    ctx.user.id,
    "chat",
    result.model,
    result.promptTokens,
    result.completionTokens
  );

  return NextResponse.json({ ok: true, message: botMessage });
}