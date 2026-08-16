"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ConfirmDeleteDialog } from "@/components/ConfirmDeleteDialog";
import { TrashIcon } from "@/components/icons";
import { formatBytes, formatDate } from "@/lib/format";
import type { ResourceWithLabels } from "@/lib/types";

type DeleteState =
  | { id: string; title: string }
  | null;

export function AdminResourceTable({ initial }: { initial: ResourceWithLabels[] }) {
  const router = useRouter();
  const [deletedIds, setDeletedIds] = useState<string[]>([]);
  const [pendingDelete, setPendingDelete] = useState<DeleteState>(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resources = initial.filter((resource) => !deletedIds.includes(resource.id));

  async function confirmDelete() {
    if (!pendingDelete) return;
    setDeleting(true);
    setError(null);

    try {
      const response = await fetch(`/api/resources/${pendingDelete.id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error ?? "Delete failed.");
      }
      setDeletedIds((ids) => [...ids, pendingDelete.id]);
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setDeleting(false);
      setPendingDelete(null);
    }
  }

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white">
      {error && (
        <p role="alert" className="border-b border-red-100 bg-red-50 px-5 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {resources.length === 0 ? (
        <p className="px-6 py-12 text-center text-sm text-zinc-500">
          No resources uploaded yet. Upload the first one above.
        </p>
      ) : (
        <ul className="divide-y divide-zinc-100">
          {resources.map((resource) => (
            <li
              key={resource.id}
              className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-zinc-900">
                  {resource.title}
                </p>
                <p className="mt-0.5 text-xs text-zinc-500">
                  <Link
                    href={`/chapters/${resource.unit_slug}`}
                    className="font-medium text-brand hover:underline"
                  >
                    {resource.unit_name}
                  </Link>
                  {resource.topic_name ? ` · ${resource.topic_name}` : ""} ·{" "}
                  {resource.resource_type} · {formatBytes(resource.file_size)} ·{" "}
                  {formatDate(resource.created_at)}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <Link
                  href={`/api/files/${resource.id}/open`}
                  className="h-9 rounded-lg border border-zinc-300 px-3 text-xs font-semibold text-zinc-700 transition-colors hover:border-brand/50 hover:text-brand"
                >
                  Open
                </Link>
                <button
                  type="button"
                  onClick={() => setPendingDelete({ id: resource.id, title: resource.title })}
                  className="flex h-9 items-center gap-1.5 rounded-lg border border-red-200 px-3 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50"
                  aria-label={`Delete ${resource.title}`}
                >
                  <TrashIcon width={14} height={14} />
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {pendingDelete && (
        <ConfirmDeleteDialog
          resourceTitle={pendingDelete.title}
          onConfirm={confirmDelete}
          onCancel={() => setPendingDelete(null)}
          busy={deleting}
        />
      )}
    </div>
  );
}