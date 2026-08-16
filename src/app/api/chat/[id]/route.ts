import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { logActivity } from "@/lib/activity";

export const runtime = "nodejs";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const ctx = await requireAdmin();
  if (!ctx) return NextResponse.json({ error: "Admin access required." }, { status: 401 });

  const { id } = await params;
  const messageId = Number(id);
  if (!Number.isInteger(messageId)) {
    return NextResponse.json({ error: "Invalid message id." }, { status: 400 });
  }

  const { data: message, error: fetchError } = await ctx.supabase
    .from("chat_messages")
    .select("id, room, sender_name")
    .eq("id", messageId)
    .maybeSingle();
  if (fetchError) {
    return NextResponse.json({ error: "Failed to load message." }, { status: 500 });
  }
  if (!message) {
    return NextResponse.json({ error: "Message not found." }, { status: 404 });
  }

  const { error } = await ctx.supabase.from("chat_messages").delete().eq("id", messageId);
  if (error) {
    console.error("[chat] delete failed:", error.message);
    return NextResponse.json({ error: "Message couldn't be removed." }, { status: 500 });
  }

  await logActivity(ctx.supabase, ctx.user.id, "admin_action", {
    action: "chat_message_delete",
    message_id: messageId,
    room: message.room,
    sender: message.sender_name,
  });

  return NextResponse.json({ ok: true });
}