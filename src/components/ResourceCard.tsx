import Link from "next/link";
import { DownloadIcon, OpenIcon } from "@/components/icons";
import { formatBytes, formatDate } from "@/lib/format";
import type { ResourceWithLabels } from "@/lib/types";

const TYPE_STYLES: Record<string, { tile: string; badge: string }> = {
  Notes: { tile: "bg-indigo-100 text-indigo-700", badge: "bg-indigo-50 text-indigo-700" },
  Practical: { tile: "bg-emerald-100 text-emerald-700", badge: "bg-emerald-50 text-emerald-700" },
  "Question Paper": { tile: "bg-amber-100 text-amber-700", badge: "bg-amber-50 text-amber-700" },
  Worksheet: { tile: "bg-sky-100 text-sky-700", badge: "bg-sky-50 text-sky-700" },
  PDF: { tile: "bg-rose-100 text-rose-700", badge: "bg-rose-50 text-rose-700" },
  Other: { tile: "bg-slate-200 text-slate-600", badge: "bg-slate-100 text-slate-600" },
};

function typeLetter(type: string): string {
  if (type === "Question Paper") return "Q";
  if (type === "Practical") return "P";
  return type.charAt(0).toUpperCase();
}

export function ResourceCard({ resource }: { resource: ResourceWithLabels }) {
  const styles = TYPE_STYLES[resource.resource_type] ?? TYPE_STYLES.Other;
  const isDemo = resource.title.toLowerCase().startsWith("demo");

  return (
    <article className="group flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-5 transition-all hover:border-brand/40 hover:shadow-lg hover:shadow-indigo-100/50">
      <div className="flex items-start gap-4">
        <span
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl font-mono text-base font-bold ${styles.tile}`}
          aria-hidden
        >
          {typeLetter(resource.resource_type)}
        </span>
        <div className="min-w-0">
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${styles.badge}`}
            >
              {resource.resource_type}
            </span>
            {isDemo && (
              <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-medium text-zinc-500">
                Demo
              </span>
            )}
            {resource.is_verified && (
              <span className="rounded-full bg-emerald-50 px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-700">
                STATUS / VERIFIED
              </span>
            )}
          </div>
          <h3 className="text-base font-semibold leading-snug text-ink">{resource.title}</h3>
        </div>
      </div>

      <p className="font-mono text-[11px] text-slate-400">
        {formatDate(resource.created_at)} · {formatBytes(resource.file_size)}
        {resource.topic_name ? ` · ${resource.topic_name}` : ""}
      </p>

      <div className="mt-auto flex gap-2">
        <Link
          href={`/api/files/${resource.id}/open`}
          className="flex h-10 flex-1 items-center justify-center gap-2 rounded-lg bg-brand px-4 text-sm font-semibold text-white transition-colors hover:bg-brand-strong"
        >
          <OpenIcon width={15} height={15} />
          Open
        </Link>
        <Link
          href={`/api/files/${resource.id}/download`}
          className="flex h-10 flex-1 items-center justify-center gap-2 rounded-lg border border-zinc-300 bg-white px-4 text-sm font-semibold text-ink transition-colors hover:border-brand/50 hover:text-brand"
        >
          <DownloadIcon width={15} height={15} />
          Download
        </Link>
      </div>
    </article>
  );
}