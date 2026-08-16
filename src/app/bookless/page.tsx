import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { UNITS } from "@/lib/syllabus";
import { formatBytes } from "@/lib/format";
import { DownloadIcon } from "@/components/icons";

export const metadata = {
  title: "Offline Packs — IT Hub 11",
};

export default async function BooklessPage() {
  const ctx = await requireUser();
  if (!ctx) return null;

  const { data: resources } = await ctx.supabase
    .from("resources")
    .select("unit_slug, file_size");

  const byUnit = new Map<string, { count: number; bytes: number }>();
  for (const resource of resources ?? []) {
    const entry = byUnit.get(resource.unit_slug) ?? { count: 0, bytes: 0 };
    entry.count += 1;
    entry.bytes += resource.file_size ?? 0;
    byUnit.set(resource.unit_slug, entry);
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <p className="font-mono text-xs font-medium text-brand">~/it-hub-11/bookless</p>
      <h1 className="mt-1 text-2xl font-bold tracking-tight text-ink sm:text-3xl">
        Offline Packs
      </h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-mist">
        Low on data or no internet at all? Grab a whole unit as one zip —
        download it once on Wi-Fi and study anywhere, no connection needed.
      </p>

      <ul className="mt-6 space-y-3">
        {UNITS.map((unit) => {
          const stats = byUnit.get(unit.slug);
          return (
            <li
              key={unit.slug}
              className="flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="flex items-baseline gap-2">
                  <span className="font-mono text-xs font-bold text-brand">
                    UNIT / {String(UNITS.indexOf(unit) + 1).padStart(2, "0")}
                  </span>
                  <span className="text-sm font-semibold text-ink">{unit.name}</span>
                </p>
                <p className="mt-1 font-mono text-[11px] text-slate-400">
                  {stats
                    ? `${stats.count} ${stats.count === 1 ? "file" : "files"} · ${formatBytes(stats.bytes)}`
                    : "no material yet"}
                </p>
              </div>
              {stats ? (
                <Link
                  href={`/api/units/${unit.slug}/bundle`}
                  className="flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-brand px-4 text-sm font-semibold text-white transition-colors hover:bg-brand-strong"
                >
                  <DownloadIcon width={15} height={15} />
                  Download .zip
                </Link>
              ) : (
                <span className="shrink-0 rounded-xl border border-zinc-200 px-4 py-2 text-xs font-semibold text-slate-400">
                  Nothing here yet
                </span>
              )}
            </li>
          );
        })}
      </ul>

      <p className="mt-6 font-mono text-[11px] text-slate-400">
        packs are zipped on the server from the latest uploads — every download is logged.
      </p>
    </div>
  );
}