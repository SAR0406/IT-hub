import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/lib/supabase/database.types";
import { EventsManager } from "./EventsManager";

export const metadata = { title: "Events" };

export default async function AdminEventsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("school_events")
    .select("*")
    .order("display_order", { ascending: true })
    .order("event_date", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });

  return (
    <div>
      <p className="font-mono text-xs text-brand">~/it-hub-11/admin/events</p>
      <h1 className="mt-1 font-display text-3xl font-bold tracking-tight text-ink">Events</h1>
      <p className="mt-2 max-w-2xl text-sm text-slate-500">
        Manage school memory cards shown on the Chapters page. Add event photos, emojis, dates,
        and control what students can see.
      </p>

      <div className="mt-6">
        <EventsManager initial={(data ?? []) as Tables<"school_events">[]} />
      </div>
    </div>
  );
}
