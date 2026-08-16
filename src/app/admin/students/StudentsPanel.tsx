"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Profile } from "@/lib/types";

type FormState = { status: "idle" } | { status: "busy" } | { status: "error"; message: string };

type RowState = { status: "idle" } | { status: "busy" } | { status: "error"; message: string };

async function api<T>(url: string, init?: RequestInit): Promise<{ ok: true; data: T } | { ok: false; error: string }> {
  try {
    const response = await fetch(url, init);
    const data = (await response.json().catch(() => null)) as { error?: string } | null;
    if (!response.ok) return { ok: false, error: data?.error ?? "Something went wrong. Please try again." };
    return { ok: true, data: data as T };
  } catch {
    return { ok: false, error: "Network error. Please check your connection." };
  }
}

function fieldClasses() {
  return "h-11 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm text-ink placeholder:text-slate-400 focus:border-brand focus:outline-none";
}

export function StudentsPanel({ initial }: { initial: Profile[] }) {
  const router = useRouter();
  const [students, setStudents] = useState(initial);
  const [form, setForm] = useState({ fullName: "", email: "", password: "", className: "", studentId: "" });
  const [formState, setFormState] = useState<FormState>({ status: "idle" });
  const [rowStates, setRowStates] = useState<Record<string, RowState>>({});
  const [resetTargets, setResetTargets] = useState<Record<string, string>>({});

  // Sync the list when the server re-renders (router.refresh) — the official
  // render-phase adjustment pattern, not an effect.
  const [prevInitial, setPrevInitial] = useState(initial);
  if (prevInitial !== initial) {
    setPrevInitial(initial);
    setStudents(initial);
  }

  function setRowState(id: string, state: RowState) {
    setRowStates((prev) => ({ ...prev, [id]: state }));
  }

  async function handleCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormState({ status: "busy" });
    const result = await api("/api/admin/students", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: form.fullName,
        email: form.email,
        password: form.password,
        className: form.className || null,
        studentId: form.studentId || null,
      }),
    });
    if (!result.ok) {
      setFormState({ status: "error", message: result.error });
      return;
    }
    setForm({ fullName: "", email: "", password: "", className: "", studentId: "" });
    setFormState({ status: "idle" });
    router.refresh();
  }

  async function handleToggleActive(student: Profile) {
    setRowState(student.id, { status: "busy" });
    const result = await api(`/api/admin/students/${student.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !student.is_active }),
    });
    if (!result.ok) {
      setRowState(student.id, { status: "error", message: result.error });
      return;
    }
    setRowState(student.id, { status: "idle" });
    router.refresh();
  }

  async function handleResetPassword(student: Profile) {
    const password = resetTargets[student.id] ?? "";
    if (password.length < 8) {
      setRowState(student.id, { status: "error", message: "New password must be at least 8 characters." });
      return;
    }
    setRowState(student.id, { status: "busy" });
    const result = await api(`/api/admin/students/${student.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resetPassword: password }),
    });
    if (!result.ok) {
      setRowState(student.id, { status: "error", message: result.error });
      return;
    }
    setResetTargets((prev) => ({ ...prev, [student.id]: "" }));
    setRowState(student.id, { status: "idle" });
    router.refresh();
  }

  async function handleDelete(student: Profile) {
    if (!window.confirm(`Delete ${student.full_name}'s account? This cannot be undone.`)) return;
    setRowState(student.id, { status: "busy" });
    const result = await api(`/api/admin/students/${student.id}`, { method: "DELETE" });
    if (!result.ok) {
      setRowState(student.id, { status: "error", message: result.error });
      return;
    }
    setRowState(student.id, { status: "idle" });
    router.refresh();
  }

  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.6fr]">
      {/* Add student */}
      <form
        onSubmit={handleCreate}
        className="h-fit rounded-2xl border border-zinc-200 bg-white p-6"
      >
        <h2 className="font-mono text-xs font-bold uppercase tracking-widest text-slate-400">
          Add a student
        </h2>
        <div className="mt-4 space-y-3">
          <div>
            <label htmlFor="full-name" className="mb-1 block text-sm font-medium text-zinc-700">
              Full name
            </label>
            <input
              id="full-name"
              type="text"
              required
              maxLength={60}
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              placeholder="e.g. Aarav Sharma"
              className={fieldClasses()}
            />
          </div>
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-zinc-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="name@ithub11.in"
              className={fieldClasses()}
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-zinc-700">
              Temporary password
            </label>
            <input
              id="password"
              type="text"
              required
              minLength={8}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="min. 8 characters"
              className={fieldClasses()}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="class-name" className="mb-1 block text-sm font-medium text-zinc-700">
                Class
              </label>
              <input
                id="class-name"
                type="text"
                value={form.className}
                onChange={(e) => setForm({ ...form, className: e.target.value })}
                placeholder="11-A"
                className={fieldClasses()}
              />
            </div>
            <div>
              <label htmlFor="student-id" className="mb-1 block text-sm font-medium text-zinc-700">
                Roll no.
              </label>
              <input
                id="student-id"
                type="text"
                value={form.studentId}
                onChange={(e) => setForm({ ...form, studentId: e.target.value })}
                placeholder="ITHUB1101"
                className={fieldClasses()}
              />
            </div>
          </div>
        </div>

        {formState.status === "error" && (
          <p role="alert" className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {formState.message}
          </p>
        )}

        <button
          type="submit"
          disabled={formState.status === "busy"}
          className="mt-5 flex h-11 w-full items-center justify-center rounded-lg bg-brand text-sm font-semibold text-white transition-colors hover:bg-brand-strong disabled:opacity-60"
        >
          {formState.status === "busy" ? "Creating…" : "Create account"}
        </button>
        <p className="mt-3 font-mono text-[11px] text-slate-400">
          &gt; students sign in with this email + password
        </p>
      </form>

      {/* Student list */}
      <div className="rounded-2xl border border-zinc-200 bg-white">
        <div className="border-b border-zinc-100 px-6 py-4">
          <h2 className="font-mono text-xs font-bold uppercase tracking-widest text-slate-400">
            {students.length} student{students.length === 1 ? "" : "s"}
          </h2>
        </div>
        {students.length === 0 ? (
          <p className="px-6 py-10 text-center font-mono text-sm text-slate-400">
            &gt; no students yet — create the first account
          </p>
        ) : (
          <ul className="divide-y divide-zinc-100">
            {students.map((student) => {
              const rowState = rowStates[student.id] ?? { status: "idle" as const };
              return (
                <li key={student.id} className="px-6 py-4">
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                    <div className="min-w-0 flex-1">
                      <p className="flex flex-wrap items-center gap-2 text-sm font-semibold text-ink">
                        {student.full_name}
                        <span
                          className={`rounded-full px-2 py-0.5 font-mono text-[10px] font-bold uppercase ${
                            student.is_active
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-zinc-100 text-zinc-500"
                          }`}
                        >
                          {student.is_active ? "Active" : "Paused"}
                        </span>
                      </p>
                      <p className="mt-0.5 font-mono text-xs text-slate-400">
                        {student.email}
                        {student.class_name ? ` · ${student.class_name}` : ""}
                        {student.student_id ? ` · ${student.student_id}` : ""}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleToggleActive(student)}
                        disabled={rowState.status === "busy"}
                        className="rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-semibold text-zinc-700 transition-colors hover:border-brand/50 hover:text-brand disabled:opacity-50"
                      >
                        {student.is_active ? "Pause" : "Activate"}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(student)}
                        disabled={rowState.status === "busy"}
                        className="rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-semibold text-zinc-700 transition-colors hover:border-red-300 hover:text-red-600 disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <input
                      type="text"
                      aria-label={`New password for ${student.full_name}`}
                      value={resetTargets[student.id] ?? ""}
                      onChange={(e) =>
                        setResetTargets((prev) => ({ ...prev, [student.id]: e.target.value }))
                      }
                      placeholder="New password (min. 8)"
                      className="h-9 w-56 rounded-lg border border-zinc-300 bg-white px-3 font-mono text-xs text-ink placeholder:text-slate-400 focus:border-brand focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleResetPassword(student)}
                      disabled={rowState.status === "busy" || !(resetTargets[student.id] ?? "").trim()}
                      className="rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-semibold text-zinc-700 transition-colors hover:border-brand/50 hover:text-brand disabled:opacity-50"
                    >
                      Reset password
                    </button>
                  </div>

                  {rowState.status === "error" && (
                    <p role="alert" className="mt-2 rounded-lg bg-red-50 px-3 py-1.5 text-xs text-red-700">
                      {rowState.message}
                    </p>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}