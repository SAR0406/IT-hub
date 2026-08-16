import { NextResponse } from "next/server";
import JSZip from "jszip";
import { requireUser } from "@/lib/auth";
import { logActivity } from "@/lib/activity";
import { getUnit } from "@/lib/syllabus";

export const runtime = "nodejs";

const MAX_BUNDLE_BYTES = 150 * 1024 * 1024; // 150 MB — serverless memory guard

/**
 * GET /api/units/[unit]/bundle — zips every file of a unit into one
 * "bookless" pack for offline / low-internet use. Files stream through the
 * student's session (storage SELECT policy), so no service key is needed.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ unit: string }> }
) {
  const ctx = await requireUser();
  if (!ctx) return NextResponse.json({ error: "You must be signed in." }, { status: 401 });

  const { unit } = await params;
  const unitInfo = getUnit(unit);
  if (!unitInfo) {
    return NextResponse.json({ error: "That unit doesn't exist." }, { status: 404 });
  }

  const { data: resources, error: fetchError } = await ctx.supabase
    .from("resources")
    .select("id, title, file_name, file_path, file_size")
    .eq("unit_slug", unit)
    .order("created_at", { ascending: false });

  if (fetchError) {
    console.error("[bundle] fetch failed:", fetchError.message);
    return NextResponse.json({ error: "The pack could not be prepared." }, { status: 500 });
  }
  if (!resources || resources.length === 0) {
    return NextResponse.json({ error: "This unit has no material yet." }, { status: 404 });
  }

  const totalBytes = resources.reduce((sum, r) => sum + (r.file_size ?? 0), 0);
  if (totalBytes > MAX_BUNDLE_BYTES) {
    return NextResponse.json(
      { error: "This unit's pack is too large to download at once. Download files individually." },
      { status: 413 }
    );
  }

  const zip = new JSZip();
  const folder = zip.folder("it-hub-11")!;

  for (const resource of resources) {
    const { data: blob, error: downloadError } = await ctx.supabase.storage
      .from("resources")
      .download(resource.file_path);
    if (downloadError || !blob) {
      console.error(`[bundle] download failed for ${resource.file_path}:`, downloadError?.message);
      continue;
    }
    folder.file(resource.file_name, blob);
  }

  const buffer = await zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" });
  const bytes = buffer.buffer.slice(
    buffer.byteOffset,
    buffer.byteOffset + buffer.byteLength
  ) as ArrayBuffer;

  await logActivity(ctx.supabase, ctx.user.id, "resource_download", {
    title: `Offline pack: ${unitInfo.name}`,
    bundle: true,
  });

  return new NextResponse(bytes, {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="it-hub-11-${unit}.zip"`,
      "Content-Length": String(buffer.byteLength),
      "Cache-Control": "private, no-store",
    },
  });
}