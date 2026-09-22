import { NextRequest } from "next/server";
import { streamResourceFile } from "@/lib/fileStream";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  return streamResourceFile(request, id, "open");
}