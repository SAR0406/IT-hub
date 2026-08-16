"use client";

import { useState } from "react";
import type { AiSettings } from "@/lib/ai/settings";

export function AiSettingsCard({ initial }: { initial: AiSettings }) {
  const [settings, setSettings] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  async function save(patch: Partial<AiSettings>) {
    setSaving(true);
    setError(null);
    setNotice(null);
    try {
      const response = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      const data = (await response.json()) as { settings?: AiSettings; error?: string };
      if (!response.ok) {
        throw new Error(data.error ?? "Settings couldn't be saved.");
      }
      setSettings(data.settings!);
      setNotice("Saved.");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-6">
      <h2 className="font-mono text-xs font-bold uppercase tracking-widest text-slate-400">
        AI assistant
      </h2>
      <p className="mt-1 text-sm text-slate-500">
        The Ask AI chat room answers from the NVIDIA NIM gateway. Turn it off if a class is
        misbehaving; the cap limits questions per student per day.
      </p>

      <div className="mt-4 space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-ink">Assistant enabled</p>
            <p className="font-mono text-[11px] text-slate-400">{settings.ai_model}</p>
          </div>
          <button
            type="button"
            onClick={() => void save({ ai_enabled: !settings.ai_enabled })}
            disabled={saving}
            aria-pressed={settings.ai_enabled}
            className={`relative h-7 w-12 shrink-0 rounded-full transition-colors disabled:opacity-60 ${
              settings.ai_enabled ? "bg-brand" : "bg-zinc-300"
            }`}
            aria-label={settings.ai_enabled ? "Disable the AI assistant" : "Enable the AI assistant"}
          >
            <span
              className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all ${
                settings.ai_enabled ? "left-6" : "left-1"
              }`}
            />
          </button>
        </div>

        <div className="flex items-end justify-between gap-4">
          <div>
            <label htmlFor="ai-cap" className="text-sm font-semibold text-ink">
              Daily cap per student
            </label>
            <p className="font-mono text-[11px] text-slate-400">questions per day (1–500)</p>
          </div>
          <div className="flex items-center gap-2">
            <input
              id="ai-cap"
              type="number"
              min={1}
              max={500}
              value={settings.ai_daily_cap}
              onChange={(event) =>
                setSettings((current) => ({
                  ...current,
                  ai_daily_cap: Number(event.target.value) || current.ai_daily_cap,
                }))
              }
              className="h-9 w-24 rounded-lg border border-zinc-300 bg-paper px-3 text-sm tabular-nums text-ink focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/10"
            />
            <button
              type="button"
              onClick={() => void save({ ai_daily_cap: settings.ai_daily_cap })}
              disabled={saving}
              className="h-9 shrink-0 rounded-lg bg-ink px-4 text-xs font-semibold text-white transition-colors hover:bg-zinc-700 disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        </div>

        {error && (
          <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">
            {error}
          </p>
        )}
        {notice && (
          <p className="rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-700">{notice}</p>
        )}
      </div>
    </section>
  );
}