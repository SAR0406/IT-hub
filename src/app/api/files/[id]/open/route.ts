import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getResourceById } from "@/lib/resources";
import { missingFileHtml, publicFileUrl } from "@/lib/files";

async function handleFile(id: string, mode: "open" | "download"): Promise<Response> {
  const resource = await getResourceById(id);
  if (!resource) return missingFileHtml();

  const supabase = await createClient();
  const { data } = await supabase.storage.from("resources").info(resource.file_path);
  if (!data) return missingFileHtml();

  const url =
    mode === "download"
      ? publicFileUrl(resource.file_path, resource.file_name)
      : publicFileUrl(resource.file_path);

  return NextResponse.redirect(url, 302);
}

export async function GET(
  _request: NextRequest,
  context: RouteContext<"/api/files/[id]/open">
) {
  const { id } = await context.params;
  return handleFile(id, "open");
}