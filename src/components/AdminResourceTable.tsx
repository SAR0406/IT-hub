"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ConfirmDeleteDialog } from "@/components/ConfirmDeleteDialog";
import { TrashIcon, UploadIcon } from "@/components/icons";
import { formatBytes, formatDate } from "@/lib/format";
import type { ResourceWithLabels } from "@/lib/types";
import { RESOURCE_TYPES } from "@/lib/types";

type DeleteState =
  | { id: string; title: string }
  | null;

type ReplaceState =
  | { id: string; resource: ResourceWithLabels }
  | null;

export function AdminResourceTable({ initial }: { initial: ResourceWithLabels[] }) {
  const router = useRouter();
  const [deletedIds, setDeletedIds] = useState<string[]>([]);
  const [verifiedIds, setVerifiedIds] = useState<Record<string, boolean>>({});
  const [pendingDelete, setPendingDelete] = useState<DeleteState>(null);
  const [deleting, setDeleting] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [replacing, setReplacing] = useState<ReplaceState>(null);
  const [replaceFile, setReplaceFile] = useState<File | null>(null);
  const [replaceTitle, setReplaceTitle] = useState("");
  const [replaceType, setReplaceType] = useState<typeof RESOURCE_TYPES[0]>(RESOURCE_TYPES[0]);
  const [replaceDescription, setReplaceDescription] = useState("");
  const [replaceUploading, setReplaceUploading] = useState(false);

  const resources = initial.filter((resource) => !deletedIds.includes(resource.id));

  async function toggleVerified(resource: ResourceWithLabels) {
    const next = !(verifiedIds[resource.id] ?? resource.is_verified);
    setBusyId(resource.id);
    setError(null);
    try {
      const response = await fetch(`/api/resources/${resource.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_verified: next }),
      });
      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error ?? "Update failed.");
      }
      setVerifiedIds((ids) => ({ ...ids, [resource.id]: next }));
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusyId(null);
    }
  }

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

  function openReplace(resource: ResourceWithLabels) {
    setReplacing({ id: resource.id, resource });
    setReplaceTitle(resource.title);
    setReplaceType(resource.resource_type as typeof RESOURCE_TYPES[0]);
    setReplaceDescription(resource.description ?? "");
    setReplaceFile(null);
    setError(null);
  }

  function closeReplace() {
    setReplacing(null);
    setReplaceFile(null);
    setReplaceTitle("");
    setReplaceDescription("");
  }

  async function handleReplace(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!replacing || !replaceFile) {
      setError("Please choose a file to replace with.");
      return;
    }
    setReplaceUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", replaceFile);
      formData.append("title", replaceTitle);
      formData.append("resource_type", replaceType);
      if (replaceDescription.trim()) formData.append("description", replaceDescription.trim());

      const response = await fetch(`/api/resources/${replacing.id}/replace`, {
        method: "POST",
        body: formData,
      });
      const data = (await response.json().catch(() => null)) as { error?: string } | null;
      if (!response.ok) {
        throw new Error(data?.error ?? "The replacement failed. Please try again.");
      }
      closeReplace();
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setReplaceUploading(false);
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
                <button
                  type="button"
                  onClick={() => openReplace(resource)}
                  disabled={busyId === resource.id}
                  className="h-9 rounded-lg border border-zinc-300 px-3 text-xs font-semibold text-zinc-700 transition-colors hover:border-brand/50 hover:text-brand disabled:opacity-50"
                >
                  <UploadIcon width={12} height={12} className="inline mr-1" />
                  Replace
                </button>
                <button
                  type="button"
                  onClick={() => void toggleVerified(resource)}
                  disabled={busyId === resource.id}
                  className={`h-9 rounded-lg border px-3 text-xs font-semibold transition-colors disabled:opacity-50 ${
                    (verifiedIds[resource.id] ?? resource.is_verified)
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                      : "border-zinc-300 text-zinc-700 hover:border-brand/50 hover:text-brand"
                  }`}
                  aria-pressed={verifiedIds[resource.id] ?? resource.is_verified}
                >
                  {(verifiedIds[resource.id] ?? resource.is_verified)
                    ? "Verified ✓"
                    : "Mark verified"}
                </button>
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

      {replacing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <form onSubmit={handleReplace} className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="font-display text-lg font-bold text-ink">Replace file</h2>
            <p className="mt-1 text-sm text-slate-500">Upload a new file for “{replacing.resource.title}”</p>

            <div className="mt-4 space-y-3">
              <div>
                <label htmlFor="replace-title" className="mb-1 block text-sm font-medium text-zinc-700">
                  Title
                </label>
                <input
                  id="replace-title"
                  type="text"
                  required
                  maxLength={200}
                  value={replaceTitle}
                  onChange={(e) => setReplaceTitle(e.target.value)}
                  className="h-11 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-brand focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="replace-type" className="mb-1 block text-sm font-medium text-zinc-700">
                  Resource type
                </label>
                <select
                  id="replace-type"
                  value={replaceType}
                  onChange={(e) => setReplaceType(e.target.value as typeof replaceType)}
                  className="h-11 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm text-zinc-900 focus:border-brand focus:outline-none"
                >
                  {RESOURCE_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="replace-file" className="mb-1 block text-sm font-medium text-zinc-700">
                  New file
                </label>
                <input
                  id="replace-file"
                  type="file"
                  required
                  onChange={(e) => setReplaceFile(e.target.files?.[0] ?? null)}
                  className="block w-full cursor-pointer rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-700 file:mr-3 file:rounded-lg file:border-0 file:bg-indigo-50 file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-brand hover:file:bg-indigo-100"
                />
                {replaceFile && <p className="mt-1 text-xs text-zinc-500">{replaceFile.name}</p>}
              </div>

              <div>
                <label htmlFor="replace-desc" className="mb-1 block text-sm font-medium text-zinc-700">
                  Description <span className="font-normal text-zinc-400">(optional)</span>
                </label>
                <textarea
                  id="replace-desc"
                  rows={2}
                  maxLength={500}
                  value={replaceDescription}
                  onChange={(e) => setReplaceDescription(e.target.value)}
                  placeholder="Short note for students…"
                  className="w-full resize-none rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-brand focus:outline-none"
                />
              </div>
            </div>

            {error && (
              <p role="alert" className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </p>
            )}

            <div className="mt-5 flex gap-2">
              <button
                type="button"
                onClick={closeReplace}
                disabled={replaceUploading}
                className="flex-1 h-11 rounded-lg border border-zinc-300 text-sm font-semibold text-zinc-700 transition-colors hover:border-brand/50 hover:text-brand disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={replaceUploading || !replaceFile}
                className="flex-1 h-11 rounded-lg bg-brand text-sm font-semibold text-white transition-colors hover:bg-brand-strong disabled:opacity-60"
              >
                {replaceUploading ? "Replacing…" : "Replace file"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}