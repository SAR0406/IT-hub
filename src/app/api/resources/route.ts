import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { logActivity } from "@/lib/activity";
import { getTopic, UNITS } from "@/lib/syllabus";
import { MAX_FILE_SIZE_BYTES, RESOURCE_TYPES } from "@/lib/types";

function error(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

function sanitizeFileName(fileName: string): string {
  const cleaned = fileName.replace(/[^a-zA-Z0-9._-]/g, "_").replace(/_+/g, "_");
  return cleaned.length > 120 ? cleaned.slice(-120) : cleaned;
}

export async function POST(request: Request) {
  // Admins only; students who try this are flagged.
  const ctx = await requireAdmin();

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

  const title = String(formData.get("title") ?? "").trim();
  if (!title) {
    return error("Please enter a title for the resource.", 400);
  }

  const unitSlug = String(formData.get("unit_slug") ?? "").trim();
  const unit = UNITS.find((u) => u.slug === unitSlug);
  if (!unit) {
    return error("Please choose a valid unit.", 400);
  }

  const topicSlugRaw = String(formData.get("topic_slug") ?? "").trim();
  const topicSlug = topicSlugRaw || null;
  if (topicSlug && !getTopic(unitSlug, topicSlug)) {
    return error("Please choose a valid topic for the selected unit.", 400);
  }

  const resourceType = String(formData.get("resource_type") ?? "").trim();
  if (!RESOURCE_TYPES.includes(resourceType as (typeof RESOURCE_TYPES)[number])) {
    return error("Please choose a valid resource type.", 400);
  }

  const description = String(formData.get("description") ?? "").trim() || null;
  if (description && description.length > 500) {
    return error("The description is too long (max 500 characters).", 400);
  }

  const safeName = sanitizeFileName(file.name);
  const filePath = `${unitSlug}/${Date.now()}-${safeName}`;

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

  const { data: inserted, error: insertError } = await ctx.supabase
    .from("resources")
    .insert({
      title,
      file_name: file.name,
      file_path: filePath,
      file_type: file.type || "application/octet-stream",
      file_size: file.size,
      unit_slug: unitSlug,
      topic_slug: topicSlug,
      resource_type: resourceType,
      description,
    })
    .select()
    .single();

  if (insertError) {
    console.error("Resource insert failed:", insertError.message);
    // Roll back the stored file so no orphaned objects are left behind.
    await ctx.supabase.storage.from("resources").remove([filePath]);
    return error("The resource could not be saved. Please try again.", 500);
  }

  await logActivity(ctx.supabase, ctx.user.id, "resource_upload", {
    title,
    unit: unitSlug,
  });

  return NextResponse.json(inserted, { status: 201 });
}