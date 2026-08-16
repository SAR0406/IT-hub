import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { logActivity } from "@/lib/activity";

function error(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export async function PATCH(request: Request) {
  const ctx = await requireAdmin();
  if (!ctx) return error("You must be signed in.", 401);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return error("Invalid request body.", 400);
  }

  const patch = (body as { ai_enabled?: unknown; ai_model?: unknown; ai_daily_cap?: unknown }) ?? {};
  const updates: Record<string, unknown> = {};

  if (patch.ai_enabled !== undefined) {
    if (typeof patch.ai_enabled !== "boolean") return error("Invalid ai_enabled value.", 400);
    updates.ai_enabled = patch.ai_enabled;
  }
  if (patch.ai_model !== undefined) {
    if (typeof patch.ai_model !== "string" || patch.ai_model.trim().length === 0) {
      return error("Invalid model name.", 400);
    }
    updates.ai_model = patch.ai_model.trim();
  }
  if (patch.ai_daily_cap !== undefined) {
    if (
      typeof patch.ai_daily_cap !== "number" ||
      !Number.isInteger(patch.ai_daily_cap) ||
      patch.ai_daily_cap < 1 ||
      patch.ai_daily_cap > 500
    ) {
      return error("Daily cap must be a whole number between 1 and 500.", 400);
    }
    updates.ai_daily_cap = patch.ai_daily_cap;
  }

  if (Object.keys(updates).length === 0) {
    return error("Nothing to update.", 400);
  }

  const { data, error: updateError } = await ctx.supabase
    .from("app_settings")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", 1)
    .select("ai_enabled, ai_model, ai_daily_cap")
    .single();

  if (updateError || !data) {
    console.error("[settings] update failed:", updateError?.message);
    return error("Settings couldn't be saved.", 500);
  }

  await logActivity(ctx.supabase, ctx.user.id, "admin_action", {
    action: "settings_updated",
    updates: Object.keys(updates),
  });

  return NextResponse.json({ settings: data });
}