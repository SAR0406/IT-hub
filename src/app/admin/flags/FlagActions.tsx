"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { FlagStatus } from "@/lib/types";

type Props = {
  flagId: number;
  status: FlagStatus;
  studentName: string;
};

type State = { status: "idle" } | { status: "busy" } | { status: "error"; message: string };

export function FlagActions({ flagId, status, studentName }: Props) {
  const router = useRouter();
  const [state, setState] = useState<State>({ status: "idle" });

  async function update(next: FlagStatus, label: string) {
    setState({ status: "busy" });
    try {
      const response = await fetch(`/api/admin/flags/${flagId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      const data = (await response.json().catch(() => null)) as { error?: string } | null;
      if (!response.ok) {
        setState({ status: "error", message: data?.error ?? "Could not update the flag." });
        return;
      }
      setState({ status: "idle" });
      router.refresh();
    } catch {
      setState({ status: "error", message: `Could not mark as ${label.toLowerCase()}.` });
    }
  }

  const buttonClass =
    "rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-semibold text-zinc-700 transition-colors hover:border-brand/50 hover:text-brand disabled:opacity-50";

  return (
    <div className="flex flex-wrap items-center gap-2">
      {status !== "reviewed" && (
        <button type="button" disabled={state.status === "busy"} onClick={() => update("reviewed", "Reviewed")} className={buttonClass}>
          Mark reviewed
        </button>
      )}
      {status !== "dismissed" && (
        <button type="button" disabled={state.status === "busy"} onClick={() => update("dismissed", "Dismissed")} className={buttonClass}>
          Dismiss
        </button>
      )}
      {status !== "open" && (
        <button type="button" disabled={state.status === "busy"} onClick={() => update("open", "Open")} className={buttonClass}>
          Reopen
        </button>
      )}
      {state.status === "error" && (
        <p role="alert" className="rounded-lg bg-red-50 px-3 py-1 text-xs text-red-700">
          {state.message}
        </p>
      )}
      <span className="font-mono text-[11px] text-slate-400">
        &gt; {studentName} is not notified — flags stay silent
      </span>
    </div>
  );
}