import Link from "next/link";
import { ACTIVITY_ACTION_LABELS, type ActivityAction } from "@/lib/types";
import { formatDateTime } from "@/lib/format";
import { createClient } from "@/lib/supabase/server";
import { listActivityLogs } from "@/lib/activity";

export const metadata = { title: "Activity" };

export const dynamic = "force-dynamic";

const PER_PAGE = 50;

const ACTION_STYLES: Record<string, string> = {
  resource_download: "bg-indigo-50 text-indigo-700",
  resource_open: "bg-sky-50 text-sky-700",
  search: "bg-emerald-50 text-emerald-700",
  login_success: "bg-emerald-50 text-emerald-700",
  login_failed: "bg-rose-50 text-rose-700",
  page_view: "bg-zinc-100 text-zinc-600",
  resource_upload: "bg-violet-50 text-violet-700",
  resource_delete: "bg-rose-50 text-rose-700",
  admin_action: "bg-ink text-white",
  unauthorized_admin_attempt: "bg-red-50 text-red-700",
};

function detailText(action: string, details: Record<string, unknown>): string {
  switch (action) {
    case "search":
      return `query “${details.query ?? ""}”`;
    case "resource_download":
    case "resource_open":
      return String(details.title ?? "—");
    case "login_failed":
    case "login_success":
      return String(details.email ?? "—");
    case "resource_upload":
    case "resource_delete":
      return String(details.title ?? "—");
    case "unauthorized_admin_attempt":
      return `path ${details.path ?? "/admin"}`;
    case "admin_action":
      return String(details.action ?? "—");
    default:
      return "—";
  }
}

type SearchParams = Promise<{ action?: string; q?: string; page?: string }>;

export default async function AdminActivityPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const action = (params.action as ActivityAction | undefined) ?? undefined;
  const q = params.q ?? "";
  const page = Math.max(1, Number.parseInt(params.page ?? "1", 10) || 1);

  const supabase = await createClient();
  const { rows, total } = await listActivityLogs(supabase, {
    action,
    q,
    page,
    perPage: PER_PAGE,
  });

  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));
  const actions: (ActivityAction | undefined)[] = [undefined, "resource_download", "resource_open", "search", "login_success", "login_failed", "admin_action", "unauthorized_admin_attempt"];

  function href(next: { action?: string; q?: string; page?: number }) {
    const search = new URLSearchParams();
    const merged = { action, q, page, ...next };
    if (merged.action) search.set("action", merged.action);
    if (merged.q) search.set("q", merged.q);
    if (merged.page && merged.page > 1) search.set("page", String(merged.page));
    const query = search.toString();
    return query ? `/admin/activity?${query}` : "/admin/activity";
  }

  return (
    <div>
      <p className="font-mono text-xs text-brand">~/it-hub-11/admin/activity</p>
      <div className="mt-1 flex flex-wrap items-end justify-between gap-4">
        <h1 className="font-display text-3xl font-bold tracking-tight text-ink">Activity</h1>
        <p className="font-mono text-xs text-slate-400">
          {total} event{total === 1 ? "" : "s"}
          {page > 1 ? ` · page ${page} of ${totalPages}` : ""}
        </p>
      </div>
      <p className="mt-2 max-w-2xl text-sm text-slate-500">
        Every download, search, sign-in and admin action, in order.
      </p>

      {/* Filters */}
      <form method="get" action="/admin/activity" className="mt-6 flex flex-wrap items-center gap-2">
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Filter by student name or email…"
          className="h-10 w-64 rounded-lg border border-zinc-300 bg-white px-3 text-sm text-ink placeholder:text-slate-400 focus:border-brand focus:outline-none"
        />
        <button
          type="submit"
          className="h-10 rounded-lg bg-brand px-4 text-sm font-semibold text-white transition-colors hover:bg-brand-strong"
        >
          Filter
        </button>
        {(q || action) && (
          <Link href="/admin/activity" className="text-xs font-semibold text-brand hover:text-brand-strong">
            Clear filters
          </Link>
        )}
      </form>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {actions.map((item) => {
          const label = item ? ACTIVITY_ACTION_LABELS[item] : "All actions";
          const active = action === item;
          return (
            <Link
              key={label}
              href={href({ action: item, page: 1 })}
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

      {/* Table */}
      {rows.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-dashed border-zinc-300 bg-white px-6 py-12 text-center font-mono text-sm text-slate-400">
          &gt; no events match these filters
        </p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-zinc-200 bg-white">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-100 font-mono text-[10px] uppercase tracking-widest text-slate-400">
                <th className="px-4 py-3 font-bold">When</th>
                <th className="px-4 py-3 font-bold">Student</th>
                <th className="px-4 py-3 font-bold">Action</th>
                <th className="px-4 py-3 font-bold">Detail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {rows.map((row) => (
                <tr key={row.id} className="hover:bg-paper">
                  <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-slate-400">
                    {formatDateTime(row.created_at)}
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-ink">{row.student_name ?? "—"}</p>
                    <p className="font-mono text-[11px] text-slate-400">
                      {row.student_email ?? "guest"}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                        ACTION_STYLES[row.action] ?? "bg-zinc-100 text-zinc-600"
                      }`}
                    >
                      {ACTIVITY_ACTION_LABELS[row.action]}
                    </span>
                  </td>
                  <td className="max-w-[260px] truncate px-4 py-3 font-mono text-xs text-slate-500">
                    {detailText(row.action, row.details)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <nav className="mt-6 flex items-center justify-between font-mono text-sm" aria-label="Activity pages">
          <Link
            href={href({ page: page - 1 })}
            aria-disabled={page <= 1}
            className={`rounded-lg border border-zinc-300 bg-white px-3 py-2 text-xs font-semibold transition-colors ${
              page <= 1
                ? "pointer-events-none opacity-40"
                : "text-ink hover:border-brand/50 hover:text-brand"
            }`}
          >
            ← Newer
          </Link>
          <span className="text-xs text-slate-400">
            page {page} / {totalPages}
          </span>
          <Link
            href={href({ page: page + 1 })}
            aria-disabled={page >= totalPages}
            className={`rounded-lg border border-zinc-300 bg-white px-3 py-2 text-xs font-semibold transition-colors ${
              page >= totalPages
                ? "pointer-events-none opacity-40"
                : "text-ink hover:border-brand/50 hover:text-brand"
            }`}
          >
            Older →
          </Link>
        </nav>
      )}
    </div>
  );
}