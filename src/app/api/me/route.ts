import { NextResponse } from "next/server";
import { getSessionProfile } from "@/lib/auth";

/**
 * GET /api/me — the signed-in user's profile, or null. Used by the login
 * page to route admins to the admin panel and students to the content.
 */
export async function GET() {
  const profile = await getSessionProfile();
  return NextResponse.json({ profile });
}