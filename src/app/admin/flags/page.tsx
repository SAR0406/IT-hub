import Link from "next/link";
import { FlagActions } from "./FlagActions";
import { createClient } from "@/lib/supabase/server";
import { listFlags } from "@/lib/flags";
import { FLAG_STATUS_LABELS, FLAG_TYPE_LABELS, type FlagStatus } from "@/lib/types";
import { formatDateTime } from "@/lib/format";

export const metadata = { title: "Flags" };

export const dynamic = "force-dynamic";

const SEVERITY_DOT: Record<string, string> = {
  low: "bg-sky-400",
  medium: "bg-amber-400",
  high: "bg-rose-500",
};

const STATUS_BADGE: Record<FlagStatus, string> = {
  open: "border-amber-200 bg-amber-50 text-amber-700",
  reviewed: "border-emerald-200 bg-emerald-50 text-emerald-700",
  dismissed: "border-zinc-200 bg-zinc-50 text-zinc-500",
};

function detailLines(type: string, details: Record<string, unknown>): string[] {
  const map: Record<string, Record<string, unknown>> = {
    banned_search: { query: details.query, "matched term": details.term },
    rapid_downloads: { count: details.count, window: details.window, file: details.title },
    failed_login: { email: details.email, count: details.count, window: details.window },
    unauthorized_admin: { path: details.path },
  };
  return Object.entries(map[type] ?? {})
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => `${key}: ${value}`);
}

type SearchParams = Promise<{ status?: string }>;

export default async function AdminFlagsPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const status = (params.status as FlagStatus | undefined) ?? undefined;

  const supabase = await createClient();
  const flags = await listFlags(supabase, { status, limit: 200 });

  const tabs: (FlagStatus | undefined)[] = [undefined, "open", "reviewed", "dismissed"];

  return (
    <div>
      <p className="font-mono text-xs text-brand">~/it-hub-11/admin/flags</p>
      <h1 className="mt-1 font-display text-3xl font-bold tracking-tight text-ink">Flags</h1>
      <p className="mt-2 max-w-2xl text-sm text-slate-500">
        Automated alerts for suspicious patterns — banned search terms, download bursts,
        repeated failed sign-ins and admin-area probes. Review, then mark resolved.
      </p>

      <div className="mt-6 flex flex-wrap gap-1.5">
        {tabs.map((item) => {
          const label = item ? FLAG_STATUS_LABELS[item] : "All flags";
          const active = status === item;
          return (
            <Link
              key={label}
              href={item ? `/admin/flags?status=${item}` : "/admin/flags"}
              aria-current={active ? "page" : undefined}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                active
                  ? "bg-ink text-white"
                  : "border border-zinc-200 bg-white text-slate-500 hover:border-brand/40 hover:text-brand"
              }`}
            >
              {label}
            </Link>
          );
        })}
      </div>

      {flags.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-dashed border-zinc-300 bg-white px-6 py-12 text-center font-mono text-sm text-slate-400">
          &gt; no flags here — all clear
        </p>
      ) : (
        <ul className="mt-6 space-y-3">
          {flags.map((flag) => (
            <li key={flag.id} className="rounded-2xl border border-zinc-200 bg-white p-5">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <span className="flex items-center gap-2">
                  <span className={`h-2.5 w-2.5 rounded-full ${SEVERITY_DOT[flag.severity]}`} />
                  <span className="font-semibold text-ink">{FLAG_TYPE_LABELS[flag.type]}</span>
                </span>
                <span
                  className={`rounded-full border px-2 py-0.5 font-mono text-[10px] font-bold uppercase ${STATUS_BADGE[flag.status]}`}
                >
                  {FLAG_STATUS_LABELS[flag.status]}
                </span>
                <span className="font-mono text-xs text-slate-400">
                  {formatDateTime(flag.created_at)}
                </span>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-1">
                <p className="text-sm text-slate-600">
                  <span className="font-semibold text-ink">{flag.student_name ?? "Unknown"}</span>
                  <span className="font-mono text-xs text-slate-400">
                    {" "}
                    · {flag.student_email ?? "—"}
                  </span>
                </p>
              </div>

              {detailLines(flag.type, flag.details).length > 0 && (
                <p className="mt-2 font-mono text-xs leading-relaxed text-slate-500">
                  {detailLines(flag.type, flag.details).map((line) => (
                    <span key={line} className="mr-4 inline-block">
                      {line}
                    </span>
                  ))}
                </p>
              )}

              {flag.reviewed_by && (
                <p className="mt-2 font-mono text-[11px] text-slate-400">
                  {flag.status === "dismissed" ? "dismissed" : "reviewed"} by {flag.reviewed_by}
                  {flag.reviewed_at ? ` · ${formatDateTime(flag.reviewed_at)}` : ""}
                </p>
              )}

              <div className="mt-4">
                <FlagActions flagId={flag.id} status={flag.status} studentName={flag.student_name ?? "Unknown"} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}