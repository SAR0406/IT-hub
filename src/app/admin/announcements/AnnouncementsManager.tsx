"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ConfirmDeleteDialog } from "@/components/ConfirmDeleteDialog";
import { TrashIcon } from "@/components/icons";
import { formatDate } from "@/lib/format";

type Announcement = {
  id: string;
  title: string;
  body: string;
  created_at: string;
};

type DeleteState = { id: string; title: string } | null;

export function AnnouncementsManager({ initial }: { initial: Announcement[] }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<DeleteState>(null);
  const [deleting, setDeleting] = useState(false);

  async function handleCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSaving(true);

    try {
      const response = await fetch("/api/admin/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, body }),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(data.error ?? "The announcement could not be saved.");
      }
      setTitle("");
      setBody("");
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete() {
    if (!pendingDelete) return;
    setDeleting(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/announcements/${pendingDelete.id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error ?? "The announcement could not be removed.");
      }
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setDeleting(false);
      setPendingDelete(null);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
      {/* Create */}
      <section className="h-fit rounded-2xl border border-zinc-200 bg-white p-6">
        <h2 className="font-display text-lg font-bold tracking-tight text-ink">
          New announcement
        </h2>
        <p className="mt-1 text-sm text-mist">
          Shown at the top of every student&rsquo;s dashboard.
        </p>

        <form onSubmit={handleCreate} className="mt-5 space-y-4">
          <div>
            <label htmlFor="annTitle" className="mb-1.5 block text-sm font-semibold text-ink">
              Title
            </label>
            <input
              id="annTitle"
              type="text"
              required
              maxLength={120}
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="h-11 w-full rounded-lg border border-zinc-300 bg-white px-3.5 text-base text-ink placeholder:text-slate-400 focus:border-brand focus:outline-none"
              placeholder="e.g. Pre-board practicals next week"
            />
          </div>
          <div>
            <label htmlFor="annBody" className="mb-1.5 block text-sm font-semibold text-ink">
              Message
            </label>
            <textarea
              id="annBody"
              required
              maxLength={2000}
              rows={5}
              value={body}
              onChange={(event) => setBody(event.target.value)}
              className="w-full resize-none rounded-lg border border-zinc-300 bg-white px-3.5 py-3 text-base text-ink placeholder:text-slate-400 focus:border-brand focus:outline-none"
              placeholder="Details students need to know…"
            />
          </div>

          {error && (
            <p role="alert" className="rounded-lg bg-red-50 px-3.5 py-2.5 text-sm text-red-700">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={saving}
            className="flex h-11 w-full items-center justify-center rounded-lg bg-brand text-sm font-semibold text-white transition-colors hover:bg-brand-strong disabled:opacity-60"
          >
            {saving ? "Posting…" : "Post announcement"}
          </button>
        </form>
      </section>

      {/* List */}
      <section className="rounded-2xl border border-zinc-200 bg-white">
        {error && pendingDelete === null && (
          <p role="alert" className="border-b border-red-100 bg-red-50 px-5 py-3 text-sm text-red-700">
            {error}
          </p>
        )}
        {initial.length === 0 ? (
          <p className="px-6 py-12 text-center text-sm text-zinc-500">
            No announcements yet — post the first one and it lands on every
            student&rsquo;s dashboard.
          </p>
        ) : (
          <ul className="divide-y divide-zinc-100">
            {initial.map((announcement) => (
              <li
                key={announcement.id}
                className="flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-start sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="flex flex-wrap items-center gap-2 text-sm font-semibold text-zinc-900">
                    {announcement.title}
                    <span className="font-mono text-[11px] font-normal text-slate-400">
                      {formatDate(announcement.created_at)}
                    </span>
                  </p>
                  <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-mist">
                    {announcement.body}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setPendingDelete({ id: announcement.id, title: announcement.title })
                  }
                  className="flex h-9 shrink-0 items-center gap-1.5 self-start rounded-lg border border-red-200 px-3 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50"
                  aria-label={`Delete ${announcement.title}`}
                >
                  <TrashIcon width={14} height={14} />
                  Delete
                </button>
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
      </section>
    </div>
  );
}