import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { logActivity } from "@/lib/activity";

function error(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(request: Request) {
  const ctx = await requireAdmin();

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return error("Invalid request body.", 400);
  }

  const { title, body: message } = (body ?? {}) as Record<string, unknown>;

  if (typeof title !== "string" || title.trim().length < 3 || title.trim().length > 120) {
    return error("Please give the announcement a title (3–120 characters).", 400);
  }
  if (typeof message !== "string" || message.trim().length < 3 || message.trim().length > 2000) {
    return error("Please write the announcement (3–2000 characters).", 400);
  }

  const { data: created, error: insertError } = await ctx.supabase
    .from("announcements")
    .insert({ title: title.trim(), body: message.trim() })
    .select()
    .single();

  if (insertError) {
    console.error("Announcement insert failed:", insertError.message);
    return error("The announcement could not be saved. Please try again.", 500);
  }

  await logActivity(ctx.supabase, ctx.user.id, "admin_action", {
    action: "create_announcement",
    title: created.title,
  });

  return NextResponse.json(created, { status: 201 });
}