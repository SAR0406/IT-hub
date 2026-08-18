import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { BANNED_TERMS, raiseFlag } from "@/lib/activity";
import { UNITS } from "@/lib/syllabus";
import type { ChatRoomSlug } from "@/lib/chat";

export const runtime = "nodejs";

export const CHAT_ROOMS: { slug: ChatRoomSlug; label: string }[] = [
  { slug: "general", label: "General" },
  ...UNITS.map((unit) => ({ slug: unit.slug as ChatRoomSlug, label: unit.name })),
];

const MAX_LENGTH = 500;

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

  const room = (body as { room?: unknown })?.room;
  const content = (body as { content?: unknown })?.content;
  if (typeof room !== "string" || !CHAT_ROOMS.some((r) => r.slug === room)) {
    return error("That room doesn't exist.", 400);
  }
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
      room,
      content: cleanContent.slice(0, 200),
      term: banned,
    });
    return error("That message can't be sent here.", 400);
  }

  const { data: recent } = await ctx.supabase
    .from("chat_messages")
    .select("id")
    .eq("user_id", ctx.user.id)
    .eq("room", room)
    .gt("created_at", new Date(Date.now() - 5000).toISOString())
    .limit(1);
  if ((recent ?? []).length > 0) {
    return error("You're sending messages too fast — take a breath.", 429);
  }

  const { data: message, error: insertError } = await ctx.supabase
    .from("chat_messages")
    .insert({
      room,
      user_id: ctx.user.id,
      sender_name: ctx.profile.full_name,
      content: cleanContent,
    })
    .select("id, room, user_id, sender_name, content, created_at")
    .single();
  if (insertError || !message) {
    console.error("[chat] insert failed:", insertError?.message);
    return error("Your message couldn't be sent.", 500);
  }

  return NextResponse.json({ message });
}