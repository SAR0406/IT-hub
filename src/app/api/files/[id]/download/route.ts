import { NextRequest } from "next/server";
import { streamResourceFile } from "@/lib/fileStream";

export async function GET(
  request: NextRequest,
  context: RouteContext<"/api/files/[id]/download">
) {
  const { id } = await context.params;
  return streamResourceFile(request, id, "download");
}