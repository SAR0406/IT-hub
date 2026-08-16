"use client";

import { useEffect, useRef } from "react";
import { TrashIcon } from "@/components/icons";

type ConfirmDeleteDialogProps = {
  resourceTitle: string;
  onConfirm: () => void;
  onCancel: () => void;
  busy?: boolean;
};

export function ConfirmDeleteDialog({
  resourceTitle,
  onConfirm,
  onCancel,
  busy = false,
}: ConfirmDeleteDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (dialog.open) return;
    dialog.showModal();
  }, []);

  return (
    <dialog
      ref={dialogRef}
      onCancel={onCancel}
      onClose={onCancel}
      aria-labelledby="delete-dialog-title"
      className="w-[calc(100%-2rem)] max-w-sm rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl backdrop:bg-zinc-900/40"
    >
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600">
          <TrashIcon width={18} height={18} />
        </span>
        <div>
          <h2 id="delete-dialog-title" className="text-lg font-bold text-zinc-900">
            Delete this resource?
          </h2>
          <p className="mt-1 text-sm text-zinc-500">
            “{resourceTitle}” and its file will be permanently removed. This cannot be undone.
          </p>
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-2">
        <button
          type="button"
          autoFocus
          onClick={onCancel}
          className="h-10 rounded-lg border border-zinc-300 px-4 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={busy}
          className="h-10 rounded-lg bg-red-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-60"
        >
          {busy ? "Deleting…" : "Delete"}
        </button>
      </div>
    </dialog>
  );
}