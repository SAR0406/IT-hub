import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { logActivity } from "@/lib/activity";
import { setFlagStatus } from "@/lib/flags";
import { FLAG_STATUS_LABELS, type FlagStatus } from "@/lib/types";

/**
 * PATCH /api/admin/flags/[id] — marks a misbehavior flag as reviewed or
 * dismissed. Only admins can change flag status (RLS enforces this too).
 */
export async function PATCH(request: Request, context: RouteContext<"/api/admin/flags/[id]">) {
  const ctx = await requireAdmin();
  const { id } = await context.params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const status = (body as { status?: unknown })?.status;
  if (status !== "reviewed" && status !== "dismissed" && status !== "open") {
    return NextResponse.json({ error: "Invalid status." }, { status: 400 });
  }

  const flagId = Number(id);
  if (!Number.isInteger(flagId)) {
    return NextResponse.json({ error: "Invalid flag id." }, { status: 400 });
  }

  const result = await setFlagStatus(ctx.supabase, flagId, status as FlagStatus, ctx.user.id);
  if (!result.ok) {
    return NextResponse.json({ error: result.error ?? "The flag could not be updated." }, { status: 500 });
  }

  await logActivity(ctx.supabase, ctx.user.id, "admin_action", {
    action: "review_flag",
    flag_id: flagId,
    status: FLAG_STATUS_LABELS[status as FlagStatus],
  });

  return NextResponse.json({ ok: true });
}