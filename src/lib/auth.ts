import { redirect } from "next/navigation";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { logActivity } from "@/lib/activity";
import type { Profile } from "@/lib/types";

export type SessionContext = {
  supabase: Awaited<ReturnType<typeof createClient>>;
  user: { id: string; email: string | null };
  profile: Profile;
};

/** Returns the profile for a user id, or null if it does not exist. */
export async function getProfileForUser(
  supabase: SupabaseClient,
  userId: string
): Promise<Profile | null> {
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();
  return (data as Profile | null) ?? null;
}

/**
 * Session info for the navbar and layout: null when signed out, a profile
 * when signed in. Never redirects.
 */
export async function getSessionProfile(): Promise<Profile | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const profile = await getProfileForUser(supabase, user.id);
  if (!profile || !profile.is_active) return null;
  return profile;
}

/**
 * Guard for content pages: signed-in users only. Guests are sent to /login.
 * Disabled accounts are treated as signed out.
 */
export async function requireUser(): Promise<SessionContext> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const profile = await getProfileForUser(supabase, user.id);
  if (!profile || !profile.is_active) redirect("/login");

  return { supabase, user: { id: user.id, email: user.email ?? null }, profile };
}

/**
 * Guard for admin pages and admin APIs. Students who try to reach admin
 * areas are flagged and sent back to the content area.
 */
export async function requireAdmin(): Promise<SessionContext> {
  const ctx = await requireUser();
  if (ctx.profile.role !== "admin") {
    await logActivity(ctx.supabase, ctx.user.id, "unauthorized_admin_attempt", {
      path: "/admin",
    });
    redirect("/chapters");
  }
  return ctx;
}