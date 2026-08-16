import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { logActivity } from "@/lib/activity";

function error(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const ctx = await requireAdmin();
  const { id } = await params;

  const { data: deleted, error: deleteError } = await ctx.supabase
    .from("announcements")
    .delete()
    .eq("id", id)
    .select()
    .single();

  if (deleteError) {
    return error("The announcement could not be removed. Please try again.", 500);
  }

  await logActivity(ctx.supabase, ctx.user.id, "admin_action", {
    action: "delete_announcement",
    title: deleted.title,
  });

  return NextResponse.json({ ok: true });
}