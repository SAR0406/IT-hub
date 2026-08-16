import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { logActivity } from "@/lib/activity";

function error(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export async function DELETE(
  _request: Request,
  context: RouteContext<"/api/resources/[id]">
) {
  const { id } = await context.params;

  // Admins only; students who try this are flagged.
  const ctx = await requireAdmin();

  const { data: resource, error: fetchError } = await ctx.supabase
    .from("resources")
    .select("id, file_path, title")
    .eq("id", id)
    .maybeSingle();

  if (fetchError || !resource) {
    return error("This resource no longer exists.", 404);
  }

  // Delete the file from storage first. If the object is already gone,
  // treat it as success so the DB row can still be cleaned up.
  const { error: storageError } = await ctx.supabase.storage
    .from("resources")
    .remove([resource.file_path]);

  if (storageError && !storageError.message.includes("not found")) {
    console.error("Storage delete failed:", storageError.message);
    return error("The file could not be deleted. Please try again.", 500);
  }

  const { error: deleteError } = await ctx.supabase
    .from("resources")
    .delete()
    .eq("id", id);

  if (deleteError) {
    console.error("Resource delete failed:", deleteError.message);
    return error("The resource could not be deleted. Please try again.", 500);
  }

  await logActivity(ctx.supabase, ctx.user.id, "resource_delete", {
    title: resource.title,
  });

  return NextResponse.json({ ok: true });
}