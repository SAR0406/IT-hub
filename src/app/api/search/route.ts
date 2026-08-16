import { NextResponse } from "next/server";
import { searchResources } from "@/lib/resources";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q")?.trim() ?? "";

  if (!q) {
    return NextResponse.json({ error: "Missing search query" }, { status: 400 });
  }

  try {
    const resources = await searchResources(q);
    return NextResponse.json(resources);
  } catch {
    return NextResponse.json(
      { error: "Something went wrong while searching. Please try again." },
      { status: 500 }
    );
  }
}