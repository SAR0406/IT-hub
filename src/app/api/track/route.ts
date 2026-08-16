import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { logActivity } from "@/lib/activity";
import { getProfileForUser } from "@/lib/auth";
import { ACTIVITY_ACTION_LABELS, type ActivityAction } from "@/lib/types";
import type { Json } from "@/lib/supabase/database.types";

/**
 * POST /api/track — records an action for the signed-in user and runs the
 * misbehavior rules. Guests may only record login_failed (so failed sign-ins
 * are captured before a session exists); everything else requires a session.
 */

const CLIENT_ACTIONS: ActivityAction[] = [
  "page_view",
  "login_success",
  "login_failed",
];

function error(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return error("Invalid request body.", 400);
  }
  const action = (body as { action?: unknown })?.action;
  if (typeof action !== "string" || !CLIENT_ACTIONS.includes(action as ActivityAction)) {
    return error("Unknown action.", 400);
  }

  const details = (body as { details?: unknown })?.details ?? {};
  if (typeof details !== "object" || details === null || Array.isArray(details)) {
    return error("Invalid details.", 400);
  }
  const cleanDetails: Record<string, Json> = {};
  for (const [key, value] of Object.entries(details)) {
    if (key.length > 40) continue;
    if (
      (typeof value === "string" && value.length <= 200) ||
      (typeof value === "number" && Number.isFinite(value)) ||
      typeof value === "boolean"
    ) {
      cleanDetails[key] = value;
    }
  }
  if (JSON.stringify(cleanDetails).length > 2000) {
    return error("Details too large.", 400);
  }

  const isGuestAction = action === "login_failed" && !user;
  if (!user && !isGuestAction) {
    return error("You must be signed in.", 401);
  }

  const profile = user ? await getProfileForUser(supabase, user.id) : null;

  await logActivity(
    supabase,
    user?.id ?? null,
    action as ActivityAction,
    cleanDetails,
    { skipRules: profile?.role === "admin" }
  );

  if (!user) return NextResponse.json({ ok: true });

  return NextResponse.json({ ok: true, label: ACTIVITY_ACTION_LABELS[action as ActivityAction] });
}