import type { SupabaseClient } from "@supabase/supabase-js";
import type { FlagStatus, FlagWithStudent } from "@/lib/types";

/** Admin reads of the misbehavior flags. RLS limits these to admins. */

export async function listFlags(
  supabase: SupabaseClient,
  opts: { status?: FlagStatus; limit?: number } = {}
): Promise<FlagWithStudent[]> {
  const { status, limit = 100 } = opts;
  let query = supabase
    .from("misbehavior_flags")
    .select("*, student:profiles!misbehavior_flags_user_id_fkey(full_name, email)")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (status) query = query.eq("status", status);

  const { data, error } = await query;
  if (error) throw new Error("Failed to load flags");
  return (data ?? []).map((row) => ({
    ...row,
    student_name: row.student?.full_name ?? null,
    student_email: row.student?.email ?? null,
  })) as FlagWithStudent[];
}

export async function getFlagCounts(
  supabase: SupabaseClient
): Promise<Record<FlagStatus, number>> {
  const { data, error } = await supabase
    .from("misbehavior_flags")
    .select("status");
  if (error) return { open: 0, reviewed: 0, dismissed: 0 };

  const counts: Record<FlagStatus, number> = { open: 0, reviewed: 0, dismissed: 0 };
  for (const row of data ?? []) {
    const status = row.status as FlagStatus;
    if (status in counts) counts[status]++;
  }
  return counts;
}

export async function setFlagStatus(
  supabase: SupabaseClient,
  flagId: number,
  status: FlagStatus,
  reviewedBy: string
): Promise<{ ok: boolean; error?: string }> {
  const { error } = await supabase
    .from("misbehavior_flags")
    .update({
      status,
      reviewed_by: reviewedBy,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", flagId);

  if (error) return { ok: false, error: "The flag could not be updated." };
  return { ok: true };
}