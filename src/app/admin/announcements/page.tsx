import { AnnouncementsManager } from "./AnnouncementsManager";
import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/lib/supabase/database.types";

export const metadata = { title: "Announcements" };

export default async function AdminAnnouncementsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("announcements")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <p className="font-mono text-xs text-brand">~/it-hub-11/admin/announcements</p>
      <h1 className="mt-1 font-display text-3xl font-bold tracking-tight text-ink">
        Announcements
      </h1>
      <p className="mt-2 max-w-2xl text-sm text-slate-500">
        Post notices for your students — exam updates, schedule changes, reminders.
        They appear at the top of each student&rsquo;s dashboard.
      </p>

      <div className="mt-6">
        <AnnouncementsManager initial={(data ?? []) as Tables<"announcements">[]} />
      </div>
    </div>
  );
}