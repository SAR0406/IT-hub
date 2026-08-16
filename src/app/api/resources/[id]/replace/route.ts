import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { logActivity } from "@/lib/activity";
import { MAX_FILE_SIZE_BYTES, RESOURCE_TYPES } from "@/lib/types";
import { getTopic, UNITS } from "@/lib/syllabus";

function error(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

function sanitizeFileName(fileName: string): string {
  const cleaned = fileName.replace(/[^a-zA-Z0-9._-]/g, "_").replace(/_+/g, "_");
  return cleaned.length > 120 ? cleaned.slice(-120) : cleaned;
}

export async function POST(
  request: Request,
  context: RouteContext<"/api/resources/[id]/replace">
) {
  const { id } = await context.params;

  const ctx = await requireAdmin();

  // Fetch existing resource
  const { data: existing, error: fetchError } = await ctx.supabase
    .from("resources")
    .select("id, file_path, title, unit_slug, topic_slug, resource_type")
    .eq("id", id)
    .maybeSingle();

  if (fetchError || !existing) {
    return error("This resource no longer exists.", 404);
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return error("The upload could not be read. Please try again.", 400);
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return error("Please choose a file to upload.", 400);
  }
  if (file.size === 0) {
    return error("The selected file is empty. Please choose another file.", 400);
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return error("This file is larger than 25 MB. Please upload a smaller file.", 400);
  }

  // Optional metadata updates
  const title = String(formData.get("title") ?? "").trim() || existing.title;
  const resourceType = String(formData.get("resource_type") ?? "").trim() || existing.resource_type;
  if (!RESOURCE_TYPES.includes(resourceType as (typeof RESOURCE_TYPES)[number])) {
    return error("Please choose a valid resource type.", 400);
  }
  const description = String(formData.get("description") ?? "").trim() || null;
  if (description && description.length > 500) {
    return error("The description is too long (max 500 characters).", 400);
  }

  // Upload new file
  const safeName = sanitizeFileName(file.name);
  const filePath = `${existing.unit_slug}/${Date.now()}-${safeName}`;

  const { error: uploadError } = await ctx.supabase.storage
    .from("resources")
    .upload(filePath, file, {
      cacheControl: "3600",
      contentType: file.type || "application/octet-stream",
      upsert: false,
    });

  if (uploadError) {
    console.error("Storage upload failed:", uploadError.message);
    return error("The file could not be uploaded. Please try again.", 500);
  }

  // Update DB with new file info
  const { data: updated, error: updateError } = await ctx.supabase
    .from("resources")
    .update({
      title,
      file_name: file.name,
      file_path: filePath,
      file_type: file.type || "application/octet-stream",
      file_size: file.size,
      resource_type: resourceType,
      description,
    })
    .eq("id", id)
    .select()
    .single();

  if (updateError) {
    console.error("Resource replace failed:", updateError.message);
    // Clean up the newly uploaded file
    await ctx.supabase.storage.from("resources").remove([filePath]);
    return error("The resource could not be updated. Please try again.", 500);
  }

  // Delete old file from storage (best effort)
  await ctx.supabase.storage.from("resources").remove([existing.file_path]);

  await logActivity(ctx.supabase, ctx.user.id, "resource_replace", {
    title,
    old_file_path: existing.file_path,
    new_file_path: filePath,
  });

  return NextResponse.json(updated);
}