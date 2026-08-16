import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getResourceById } from "@/lib/resources";
import { logActivity } from "@/lib/activity";
import { getProfileForUser } from "@/lib/auth";
import { missingFileHtml } from "@/lib/files";

/**
 * Streams a stored file to the authenticated student or admin.
 *
 * The bucket is private, so every download goes through here: the session
 * is verified, the action is logged, and the misbehavior rules run
 * (e.g. the download-burst flag).
 *
 * Guests are redirected to /login; missing files get a readable HTML 404.
 */
export async function streamResourceFile(
  request: NextRequest,
  resourceId: string,
  mode: "open" | "download"
): Promise<Response> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const resource = await getResourceById(resourceId);
  if (!resource) return missingFileHtml();

  const { data: blob, error } = await supabase.storage
    .from("resources")
    .download(resource.file_path);
  if (error || !blob) return missingFileHtml();

  const profile = await getProfileForUser(supabase, user.id);

  await logActivity(
    supabase,
    user.id,
    mode === "download" ? "resource_download" : "resource_open",
    { title: resource.title, unit: resource.unit_slug },
    { skipRules: profile?.role === "admin" }
  );

  const disposition = mode === "download" ? "attachment" : "inline";
  const encodedName = encodeURIComponent(resource.file_name);
  return new Response(blob, {
    headers: {
      "Content-Type": resource.file_type || "application/octet-stream",
      "Content-Disposition": `${disposition}; filename="${encodedName}"; filename*=UTF-8''${encodedName}`,
      "Cache-Control": "private, no-store",
      "Content-Length": String(blob.size),
    },
  });
}