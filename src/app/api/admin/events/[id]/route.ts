import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { logActivity } from "@/lib/activity";

function error(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const ctx = await requireAdmin();
  const { id } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return error("Invalid request body.", 400);
  }

  const { is_published: isPublished } = (body ?? {}) as Record<string, unknown>;
  if (typeof isPublished !== "boolean") {
    return error("Please provide publish state.", 400);
  }

  const { data: updated, error: updateError } = await ctx.supabase
    .from("school_events")
    .update({ is_published: isPublished })
    .eq("id", id)
    .select("*")
    .single();

  if (updateError) {
    return error("The event could not be updated. Please try again.", 500);
  }

  await logActivity(ctx.supabase, ctx.user.id, "admin_action", {
    action: isPublished ? "publish_school_event" : "unpublish_school_event",
    title: updated.title,
  });

  return NextResponse.json(updated);
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const ctx = await requireAdmin();
  const { id } = await params;

  const { data: deleted, error: deleteError } = await ctx.supabase
    .from("school_events")
    .delete()
    .eq("id", id)
    .select("title")
    .single();

  if (deleteError) {
    return error("The event could not be removed. Please try again.", 500);
  }

  await logActivity(ctx.supabase, ctx.user.id, "admin_action", {
    action: "delete_school_event",
    title: deleted.title,
  });

  return NextResponse.json({ ok: true });
}
