import { createClient } from "@/lib/supabase/server";
import type { FlagWithStudent } from "@/lib/types";
import { listFlags } from "@/lib/flags";

export type DashboardStats = {
  activeStudents: number;
  resourceCount: number;
  downloadsToday: number;
  openFlags: number;
  dailyDownloads: { day: string; count: number }[];
  topSearches: { query: string; count: number }[];
  recentFlags: FlagWithStudent[];
};

function startOfDayUtc(): Date {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = await createClient();
  const today = startOfDayUtc().toISOString();
  const weekAgo = new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString();
  const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

  const [students, resources, downloads, flags, daily, searches, recentFlags] =
    await Promise.all([
      supabase
        .from("profiles")
        .select("id", { count: "exact", head: true })
        .eq("role", "student")
        .eq("is_active", true),
      supabase.from("resources").select("id", { count: "exact", head: true }),
      supabase
        .from("activity_logs")
        .select("id", { count: "exact", head: true })
        .eq("action", "resource_download")
        .gte("created_at", today),
      supabase
        .from("misbehavior_flags")
        .select("id", { count: "exact", head: true })
        .eq("status", "open"),
      supabase
        .from("activity_logs")
        .select("created_at")
        .eq("action", "resource_download")
        .gte("created_at", weekAgo),
      supabase
        .from("activity_logs")
        .select("details")
        .eq("action", "search")
        .gte("created_at", monthAgo),
      listFlags(supabase, { status: "open", limit: 5 }),
    ]);

  const dailyBuckets: { day: string; count: number }[] = [];
  const now = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
    dailyBuckets.push({ day: d.toLocaleDateString("en-IN", { weekday: "short" }), count: 0 });
  }
  for (const row of daily.data ?? []) {
    const date = new Date(row.created_at);
    const index = 6 - Math.floor((now.getTime() - date.getTime()) / (24 * 60 * 60 * 1000));
    if (index >= 0 && index < 7) dailyBuckets[index].count++;
  }

  const searchCounts = new Map<string, number>();
  for (const row of searches.data ?? []) {
    const raw = row.details as Record<string, unknown> | null;
    const query = String(raw?.query ?? "").trim().toLowerCase();
    if (query) searchCounts.set(query, (searchCounts.get(query) ?? 0) + 1);
  }
  const topSearches = [...searchCounts.entries()]
    .map(([query, count]) => ({ query, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  return {
    activeStudents: students.count ?? 0,
    resourceCount: resources.count ?? 0,
    downloadsToday: downloads.count ?? 0,
    openFlags: flags.count ?? 0,
    dailyDownloads: dailyBuckets,
    topSearches,
    recentFlags,
  };
}