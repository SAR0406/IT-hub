"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ConfirmDeleteDialog } from "@/components/ConfirmDeleteDialog";
import { TrashIcon } from "@/components/icons";

type SchoolEvent = {
  id: string;
  title: string;
  description: string | null;
  photo_url: string | null;
  emoji: string;
  event_date: string | null;
  is_published: boolean;
  display_order: number;
  created_at: string;
};

type DeleteState = { id: string; title: string } | null;

function formatEventDate(value: string | null): string {
  if (!value) return "No date";
  const parsed = new Date(`${value}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export function EventsManager({ initial }: { initial: SchoolEvent[] }) {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [emoji, setEmoji] = useState("🎉");
  const [eventDate, setEventDate] = useState("");
  const [displayOrder, setDisplayOrder] = useState("0");
  const [isPublished, setIsPublished] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<DeleteState>(null);
  const [deleting, setDeleting] = useState(false);
  const [busyEventId, setBusyEventId] = useState<string | null>(null);

  async function handleCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          photo_url: photoUrl,
          emoji,
          event_date: eventDate,
          display_order: Number.parseInt(displayOrder, 10) || 0,
          is_published: isPublished,
        }),
      });
      const data = (await response.json().catch(() => null)) as { error?: string } | null;
      if (!response.ok) {
        throw new Error(data?.error ?? "The event could not be saved.");
      }

      setTitle("");
      setDescription("");
      setPhotoUrl("");
      setEmoji("🎉");
      setEventDate("");
      setDisplayOrder("0");
      setIsPublished(true);
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  async function togglePublished(eventItem: SchoolEvent) {
    setBusyEventId(eventItem.id);
    setError(null);
    try {
      const response = await fetch(`/api/admin/events/${eventItem.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_published: !eventItem.is_published }),
      });
      const data = (await response.json().catch(() => null)) as { error?: string } | null;
      if (!response.ok) {
        throw new Error(data?.error ?? "The event could not be updated.");
      }
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusyEventId(null);
    }
  }

  async function confirmDelete() {
    if (!pendingDelete) return;
    setDeleting(true);
    setError(null);
    try {
      const response = await fetch(`/api/admin/events/${pendingDelete.id}`, {
        method: "DELETE",
      });
      const data = (await response.json().catch(() => null)) as { error?: string } | null;
      if (!response.ok) {
        throw new Error(data?.error ?? "The event could not be removed.");
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
      <section className="h-fit rounded-2xl border border-zinc-200 bg-white p-6">
        <h2 className="font-display text-lg font-bold tracking-tight text-ink">New event memory</h2>
        <p className="mt-1 text-sm text-mist">
          Add a playful card with emoji + optional photo URL to show on the Chapters page.
        </p>

        <form onSubmit={handleCreate} className="mt-5 space-y-4">
          <div>
            <label htmlFor="eventTitle" className="mb-1.5 block text-sm font-semibold text-ink">
              Title
            </label>
            <input
              id="eventTitle"
              type="text"
              required
              maxLength={120}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-11 w-full rounded-lg border border-zinc-300 bg-white px-3.5 text-base text-ink placeholder:text-slate-400 focus:border-brand focus:outline-none"
              placeholder="e.g. Annual Day 2026"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="eventEmoji" className="mb-1.5 block text-sm font-semibold text-ink">
                Emoji
              </label>
              <input
                id="eventEmoji"
                type="text"
                required
                maxLength={8}
                value={emoji}
                onChange={(e) => setEmoji(e.target.value)}
                className="h-11 w-full rounded-lg border border-zinc-300 bg-white px-3.5 text-base text-ink placeholder:text-slate-400 focus:border-brand focus:outline-none"
                placeholder="🎉"
              />
            </div>
            <div>
              <label htmlFor="eventDate" className="mb-1.5 block text-sm font-semibold text-ink">
                Event date
              </label>
              <input
                id="eventDate"
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="h-11 w-full rounded-lg border border-zinc-300 bg-white px-3.5 text-base text-ink focus:border-brand focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label htmlFor="eventPhotoUrl" className="mb-1.5 block text-sm font-semibold text-ink">
              Photo URL (optional)
            </label>
            <input
              id="eventPhotoUrl"
              type="url"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              className="h-11 w-full rounded-lg border border-zinc-300 bg-white px-3.5 text-base text-ink placeholder:text-slate-400 focus:border-brand focus:outline-none"
              placeholder="https://..."
            />
          </div>

          <div>
            <label htmlFor="eventDescription" className="mb-1.5 block text-sm font-semibold text-ink">
              Description
            </label>
            <textarea
              id="eventDescription"
              rows={4}
              maxLength={500}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full resize-none rounded-lg border border-zinc-300 bg-white px-3.5 py-3 text-base text-ink placeholder:text-slate-400 focus:border-brand focus:outline-none"
              placeholder="Sports day highlights, house performance, memories..."
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="displayOrder" className="mb-1.5 block text-sm font-semibold text-ink">
                Display order
              </label>
              <input
                id="displayOrder"
                type="number"
                min={-9999}
                max={9999}
                value={displayOrder}
                onChange={(e) => setDisplayOrder(e.target.value)}
                className="h-11 w-full rounded-lg border border-zinc-300 bg-white px-3.5 text-base text-ink focus:border-brand focus:outline-none"
              />
            </div>
            <label className="flex items-end gap-2 pb-2 text-sm font-medium text-ink">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="h-4 w-4 rounded border-zinc-300"
              />
              Published (visible to students)
            </label>
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
            {saving ? "Saving…" : "Add event"}
          </button>
        </form>
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-white">
        {error && pendingDelete === null && (
          <p role="alert" className="border-b border-red-100 bg-red-50 px-5 py-3 text-sm text-red-700">
            {error}
          </p>
        )}

        {initial.length === 0 ? (
          <p className="px-6 py-12 text-center text-sm text-zinc-500">
            No events yet — add the first school memory card.
          </p>
        ) : (
          <ul className="divide-y divide-zinc-100">
            {initial.map((eventItem) => (
              <li
                key={eventItem.id}
                className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-start sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="flex flex-wrap items-center gap-2 text-sm font-semibold text-zinc-900">
                    <span>{eventItem.emoji}</span>
                    <span>{eventItem.title}</span>
                    <span className="font-mono text-[11px] font-normal text-slate-400">
                      {formatEventDate(eventItem.event_date)}
                    </span>
                  </p>
                  {eventItem.description && (
                    <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-mist">
                      {eventItem.description}
                    </p>
                  )}
                  {eventItem.photo_url && (
                    <a
                      href={eventItem.photo_url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-1 inline-block break-all text-xs text-brand hover:text-brand-strong"
                    >
                      {eventItem.photo_url}
                    </a>
                  )}
                  <p className="mt-2 font-mono text-[11px] text-slate-400">
                    order {eventItem.display_order} · {eventItem.is_published ? "published" : "hidden"}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-2 self-start">
                  <button
                    type="button"
                    onClick={() => togglePublished(eventItem)}
                    disabled={busyEventId === eventItem.id}
                    className="h-9 rounded-lg border border-zinc-300 px-3 text-xs font-semibold text-ink transition-colors hover:bg-zinc-50 disabled:opacity-60"
                  >
                    {eventItem.is_published ? "Hide" : "Publish"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setPendingDelete({ id: eventItem.id, title: eventItem.title })}
                    className="flex h-9 items-center gap-1.5 rounded-lg border border-red-200 px-3 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50"
                    aria-label={`Delete ${eventItem.title}`}
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
      </section>
    </div>
  );
}
