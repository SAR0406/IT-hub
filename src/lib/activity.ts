import type { SupabaseClient } from "@supabase/supabase-js";
import type { ActivityAction, ActivityLog, FlagSeverity, FlagType } from "@/lib/types";

/**
 * Central place where every meaningful action is recorded and where the
 * misbehavior rules live. If a rule trips, a flag is raised for the admin —
 * silently, so students are never told they are being watched.
 *
 * Rules (all server-side, deterministic, with a 5-minute cooldown per
 * student+rule so a burst raises one flag, not a flood):
 *   banned_search          — search query contains a banned word
 *   rapid_downloads        — 8+ downloads within 60 seconds
 *   failed_login           — 3+ failed sign-ins within 10 minutes (by email)
 *   unauthorized_admin     — student reached an admin-only area
 */

const BANNED_TERMS = [
  "idiot",
  "stupid",
  "dumb",
  "dummy",
  "moron",
  "boring",
  "hate",
  "cheat",
  "cheating",
  "hack",
  "kill",
];

const RAPID_DOWNLOAD_LIMIT = 8;
const RAPID_DOWNLOAD_WINDOW = "60 seconds";
const FAILED_LOGIN_LIMIT = 3;
const FAILED_LOGIN_WINDOW = "10 minutes";
const FLAG_COOLDOWN = "5 minutes";

export type TrackDetails = Record<string, unknown>;

export type ActivityLogWithStudent = ActivityLog & {
  student_name: string | null;
  student_email: string | null;
};

export async function listActivityLogs(
  supabase: SupabaseClient,
  opts: { action?: ActivityAction; q?: string; page?: number; perPage?: number } = {}
): Promise<{ rows: ActivityLogWithStudent[]; total: number }> {
  const { action, q, page = 1, perPage = 50 } = opts;
  const offset = (page - 1) * perPage;

  let base = supabase
    .from("activity_logs")
    .select("*, student:profiles!activity_logs_user_id_fkey(full_name, email)", {
      count: "exact",
    });

  if (action) base = base.eq("action", action);
  if (q) {
    const query = q.trim();
    if (query) {
      base = base.or(`student.full_name.ilike.%${query}%,student.email.ilike.%${query}%`);
    }
  }

  base = base.order("created_at", { ascending: false });

  const { data, error, count } = await base.range(offset, offset + perPage - 1);
  if (error) throw new Error("Failed to load activity");

  const rows = (data ?? []).map((row) => ({
    ...row,
    student_name: row.student?.full_name ?? null,
    student_email: row.student?.email ?? null,
  })) as ActivityLogWithStudent[];

  return { rows, total: count ?? 0 };
}

function findBannedTerm(query: string | undefined): string | null {
  if (!query) return null;
  const lower = query.toLowerCase();
  return BANNED_TERMS.find((term) => lower.includes(term)) ?? null;
}

async function flagExists(
  supabase: SupabaseClient,
  userId: string | null,
  type: FlagType
): Promise<boolean> {
  if (!userId) return false;
  const { data } = await supabase.rpc("recent_flag_exists", {
    p_user_id: userId,
    p_type: type,
    p_window: FLAG_COOLDOWN,
  });
  return data === true;
}

async function raiseFlag(
  supabase: SupabaseClient,
  userId: string | null,
  type: FlagType,
  severity: FlagSeverity,
  details: TrackDetails
): Promise<void> {
  if (await flagExists(supabase, userId, type)) return;
  await supabase
    .from("misbehavior_flags")
    .insert({ user_id: userId, type, severity, details });
}

/**
 * Records an action in the audit log and evaluates the misbehavior rules.
 * Never throws: tracking must not break the request it runs in.
 */
export async function logActivity(
  supabase: SupabaseClient,
  userId: string | null,
  action: ActivityAction,
  details: TrackDetails = {},
  opts: { skipRules?: boolean } = {}
): Promise<void> {
  try {
    const { error } = await supabase
      .from("activity_logs")
      .insert({ user_id: userId, action, details });
    if (error) {
      console.error(`[activity] insert failed (${action}):`, error.message);
      return;
    }
    if (opts.skipRules) return;
    await runRules(supabase, userId, action, details);
  } catch (err) {
    console.error("[activity] tracking failed:", err);
  }
}

async function runRules(
  supabase: SupabaseClient,
  userId: string | null,
  action: ActivityAction,
  details: TrackDetails
): Promise<void> {
  switch (action) {
    case "search": {
      const term = findBannedTerm(String(details.query ?? ""));
      if (term) {
        await raiseFlag(supabase, userId, "banned_search", "medium", {
          query: details.query,
          term,
        });
      }
      break;
    }
    case "resource_download": {
      if (!userId) break;
      const { data: count } = await supabase.rpc("count_recent_actions", {
        p_user_id: userId,
        p_action: "resource_download",
        p_window: RAPID_DOWNLOAD_WINDOW,
      });
      if (Number(count ?? 0) >= RAPID_DOWNLOAD_LIMIT) {
        await raiseFlag(supabase, userId, "rapid_downloads", "medium", {
          count: Number(count),
          window: "60s",
          ...(typeof details.title === "string" ? { title: details.title } : {}),
        });
      }
      break;
    }
    case "login_failed": {
      const email = String(details.email ?? "").toLowerCase();
      if (!email) break;
      const { data: count } = await supabase.rpc("count_recent_failed_logins", {
        p_email: email,
        p_window: FAILED_LOGIN_WINDOW,
      });
      if (Number(count ?? 0) >= FAILED_LOGIN_LIMIT) {
        await supabase.rpc("flag_failed_logins", { p_email: email });
      }
      break;
    }
    case "unauthorized_admin_attempt": {
      await raiseFlag(supabase, userId, "unauthorized_admin", "high", {
        path: details.path ?? "/admin",
      });
      break;
    }
    default:
      break;
  }
}