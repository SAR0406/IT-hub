import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { logActivity } from "@/lib/activity";
import { searchResources } from "@/lib/resources";

/**
 * GET /api/search — signed-in users only. Every query is logged and the
 * banned-search rule runs here, silently raising a flag for the admin
 * when a query contains an inappropriate term.
 */
export async function GET(request: Request) {
  const ctx = await requireUser();

  const url = new URL(request.url);
  const q = url.searchParams.get("q")?.trim() ?? "";

  if (!q) {
    return NextResponse.json({ error: "Missing search query" }, { status: 400 });
  }
  if (q.length > 100) {
    return NextResponse.json({ error: "That search is too long." }, { status: 400 });
  }

  try {
    const resources = await searchResources(q);
    await logActivity(ctx.supabase, ctx.user.id, "search", {
      query: q.slice(0, 100),
      results: resources.length,
    });
    return NextResponse.json(resources);
  } catch {
    return NextResponse.json(
      { error: "Something went wrong while searching. Please try again." },
      { status: 500 }
    );
  }
}