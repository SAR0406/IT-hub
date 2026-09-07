import { createClient } from "@/lib/supabase/server";
import type { SchoolEvent } from "@/lib/types";

type SchoolEventRow = Omit<SchoolEvent, "created_at"> & { created_at: string | null };

function toSchoolEvent(row: SchoolEventRow): SchoolEvent {
  return {
    ...row,
    created_at: row.created_at ?? "",
  };
}

export async function getPublishedSchoolEvents(limit = 6): Promise<SchoolEvent[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return [];
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("school_events")
    .select("*")
    .eq("is_published", true)
    .order("display_order", { ascending: true })
    .order("event_date", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw new Error("Failed to load school events");
  return (data ?? []).map(toSchoolEvent);
}
