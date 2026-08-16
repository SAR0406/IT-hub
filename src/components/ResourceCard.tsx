import Link from "next/link";
import { DownloadIcon, OpenIcon } from "@/components/icons";
import { formatBytes, formatDate } from "@/lib/format";
import type { ResourceWithLabels } from "@/lib/types";

const TYPE_STYLES: Record<string, string> = {
  Notes: "bg-indigo-50 text-indigo-700",
  Practical: "bg-emerald-50 text-emerald-700",
  "Question Paper": "bg-amber-50 text-amber-700",
  Worksheet: "bg-sky-50 text-sky-700",
  PDF: "bg-rose-50 text-rose-700",
  Other: "bg-zinc-100 text-zinc-600",
};

export function ResourceCard({ resource }: { resource: ResourceWithLabels }) {
  const typeStyle = TYPE_STYLES[resource.resource_type] ?? TYPE_STYLES.Other;
  const isDemo = resource.title.toLowerCase().startsWith("demo");

  return (
    <article className="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-5 transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="mb-1.5 flex flex-wrap items-center gap-2">
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${typeStyle}`}
            >
              {resource.resource_type}
            </span>
            {isDemo && (
              <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-500">
                Demo
              </span>
            )}
          </div>
          <h3 className="text-base font-semibold leading-snug text-zinc-900">
            {resource.title}
          </h3>
        </div>
      </div>

      <p className="text-xs text-zinc-500">
        Uploaded {formatDate(resource.created_at)} · {formatBytes(resource.file_size)}
        {resource.topic_name ? ` · ${resource.topic_name}` : ""}
      </p>

      <div className="mt-auto flex gap-2">
        <Link
          href={`/api/files/${resource.id}/download`}
          className="flex h-10 flex-1 items-center justify-center gap-2 rounded-lg bg-zinc-900 px-4 text-sm font-semibold text-white transition-colors hover:bg-zinc-700"
        >
          <DownloadIcon width={16} height={16} />
          Download
        </Link>
        <Link
          href={`/api/files/${resource.id}/open`}
          className="flex h-10 flex-1 items-center justify-center gap-2 rounded-lg border border-zinc-300 bg-white px-4 text-sm font-semibold text-zinc-800 transition-colors hover:border-accent hover:text-accent"
        >
          <OpenIcon width={16} height={16} />
          Open
        </Link>
      </div>
    </article>
  );
}