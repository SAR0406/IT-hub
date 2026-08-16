"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ConfirmDeleteDialog } from "@/components/ConfirmDeleteDialog";
import { TrashIcon } from "@/components/icons";
import { formatDate } from "@/lib/format";
import { parseQuestions, QUIZ_MAX_QUESTIONS, type QuizQuestion } from "@/lib/quizzes";
import { UNITS } from "@/lib/syllabus";
import type { Json } from "@/lib/supabase/database.types";
import { QuizGenerator } from "./QuizGenerator";

type QuizRow = {
  id: string;
  title: string;
  description: string | null;
  unit_slug: string;
  questions: Json;
  published: boolean;
  time_limit_minutes: number | null;
  created_at: string;
};

type Draft = {
  id: string | null;
  title: string;
  description: string;
  unitSlug: string;
  published: boolean;
  timeLimit: string;
  questions: QuizQuestion[];
};

type DeleteState = { id: string; title: string } | null;

const EMPTY_OPTIONS: string[] = ["", "", "", ""];

function toDraft(quiz: QuizRow): Draft {
  return {
    id: quiz.id,
    title: quiz.title,
    description: quiz.description ?? "",
    unitSlug: quiz.unit_slug,
    published: quiz.published,
    timeLimit: quiz.time_limit_minutes ? String(quiz.time_limit_minutes) : "",
    questions: parseQuestions(quiz.questions),
  };
}

export function QuizManager({
  initial,
  attemptCounts,
}: {
  initial: QuizRow[];
  attemptCounts: Record<string, number>;
}) {
  const router = useRouter();
  const [editing, setEditing] = useState<Draft | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<DeleteState>(null);
  const [deleting, setDeleting] = useState(false);
  const [generating, setGenerating] = useState(false);

  function addQuestion() {
    setEditing((draft) => {
      if (!draft || draft.questions.length >= QUIZ_MAX_QUESTIONS) return draft;
      return {
        ...draft,
        questions: [
          ...draft.questions,
          { id: crypto.randomUUID(), question: "", options: [...EMPTY_OPTIONS], answer: 0 },
        ],
      };
    });
  }

  function updateQuestion(index: number, patch: Partial<QuizQuestion>) {
    setEditing((draft) => {
      if (!draft) return draft;
      const questions = draft.questions.map((question, i) =>
        i === index ? { ...question, ...patch } : question
      );
      return { ...draft, questions };
    });
  }

  function removeQuestion(index: number) {
    setEditing((draft) => {
      if (!draft || draft.questions.length <= 1) return draft;
      return { ...draft, questions: draft.questions.filter((_, i) => i !== index) };
    });
  }

  async function handleSave() {
    if (!editing) return;
    setError(null);

    if (editing.title.trim().length < 3) {
      setError("Give the quiz a title (at least 3 characters).");
      return;
    }
    if (editing.questions.some((q) => q.question.trim().length < 3)) {
      setError("Every question needs text (at least 3 characters).");
      return;
    }
    if (editing.questions.some((q) => q.options.some((option) => option.trim().length === 0))) {
      setError("Every question needs 4 options — none can be empty.");
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(
        editing.id ? `/api/admin/quizzes/${editing.id}` : "/api/admin/quizzes",
        {
          method: editing.id ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: editing.title,
            description: editing.description.trim() || null,
            unitSlug: editing.unitSlug,
            published: editing.published,
            timeLimitMinutes: editing.timeLimit.trim() === "" ? null : Number(editing.timeLimit),
            questions: editing.questions,
          }),
        }
      );
      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(data.error ?? "The quiz could not be saved.");
      }
      setEditing(null);
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  async function togglePublish(quiz: QuizRow) {
    setError(null);
    try {
      const response = await fetch(`/api/admin/quizzes/${quiz.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !quiz.published }),
      });
      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error ?? "The quiz could not be updated.");
      }
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
    }
  }

  async function confirmDelete() {
    if (!pendingDelete) return;
    setDeleting(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/quizzes/${pendingDelete.id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error ?? "The quiz could not be removed.");
      }
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setDeleting(false);
      setPendingDelete(null);
    }
  }

  /* ------------------------------ editor ------------------------------ */

  if (editing) {
    const answeredCount = editing.questions.length;
    return (
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="space-y-5">
          {error && (
            <p role="alert" className="rounded-lg bg-red-50 px-3.5 py-2.5 text-sm text-red-700">
              {error}
            </p>
          )}

          <section className="rounded-2xl border border-zinc-200 bg-white p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-display text-lg font-bold tracking-tight text-ink">
                {editing.id ? "Edit quiz" : "New quiz"}
              </h2>
              <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-ink">
                <input
                  type="checkbox"
                  checked={editing.published}
                  onChange={(event) =>
                    setEditing({ ...editing, published: event.target.checked })
                  }
                  className="h-4 w-4 accent-brand"
                />
                Published
              </label>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-[1fr_220px]">
              <div>
                <label htmlFor="quizTitle" className="mb-1.5 block text-sm font-semibold text-ink">
                  Title
                </label>
                <input
                  id="quizTitle"
                  type="text"
                  required
                  maxLength={120}
                  value={editing.title}
                  onChange={(event) => setEditing({ ...editing, title: event.target.value })}
                  className="h-11 w-full rounded-lg border border-zinc-300 bg-white px-3.5 text-base text-ink placeholder:text-slate-400 focus:border-brand focus:outline-none"
                  placeholder="e.g. RDBMS — Chapter 1 quiz"
                />
              </div>
              <div>
                <label htmlFor="quizUnit" className="mb-1.5 block text-sm font-semibold text-ink">
                  Unit
                </label>
                <select
                  id="quizUnit"
                  value={editing.unitSlug}
                  onChange={(event) => setEditing({ ...editing, unitSlug: event.target.value })}
                  className="h-11 w-full rounded-lg border border-zinc-300 bg-white px-3 text-base text-ink focus:border-brand focus:outline-none"
                >
                  {UNITS.map((unit) => (
                    <option key={unit.slug} value={unit.slug}>
                      {unit.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-4">
              <label htmlFor="quizDescription" className="mb-1.5 block text-sm font-semibold text-ink">
                Description <span className="font-normal text-mist">(optional)</span>
              </label>
              <textarea
                id="quizDescription"
                maxLength={500}
                rows={2}
                value={editing.description}
                onChange={(event) => setEditing({ ...editing, description: event.target.value })}
                className="w-full resize-none rounded-lg border border-zinc-300 bg-white px-3.5 py-3 text-base text-ink placeholder:text-slate-400 focus:border-brand focus:outline-none"
                placeholder="What this quiz covers…"
              />
            </div>

            <div className="mt-4 max-w-56">
              <label htmlFor="quizTimeLimit" className="mb-1.5 block text-sm font-semibold text-ink">
                Time limit <span className="font-normal text-mist">(minutes, optional)</span>
              </label>
              <input
                id="quizTimeLimit"
                type="number"
                min={1}
                max={120}
                value={editing.timeLimit}
                onChange={(event) => setEditing({ ...editing, timeLimit: event.target.value })}
                className="h-11 w-full rounded-lg border border-zinc-300 bg-white px-3.5 text-base text-ink placeholder:text-slate-400 focus:border-brand focus:outline-none"
                placeholder="e.g. 10 — empty means no timer"
              />
            </div>
          </section>

          {editing.questions.map((question, questionIndex) => (
            <section
              key={question.id}
              className="rounded-2xl border border-zinc-200 bg-white p-6"
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-slate-400">
                  Question {questionIndex + 1}
                </h3>
                <button
                  type="button"
                  onClick={() => removeQuestion(questionIndex)}
                  disabled={editing.questions.length <= 1}
                  className="text-xs font-semibold text-red-600 transition-colors hover:text-red-700 disabled:text-slate-300"
                >
                  Remove
                </button>
              </div>

              <textarea
                required
                maxLength={500}
                rows={2}
                value={question.question}
                onChange={(event) =>
                  updateQuestion(questionIndex, { question: event.target.value })
                }
                className="mt-3 w-full resize-none rounded-lg border border-zinc-300 bg-white px-3.5 py-3 text-base text-ink placeholder:text-slate-400 focus:border-brand focus:outline-none"
                placeholder="Write the question…"
              />

              <div className="mt-4 space-y-2.5">
                {question.options.map((option, optionIndex) => {
                  const isAnswer = question.answer === optionIndex;
                  return (
                    <div key={optionIndex} className="flex items-center gap-2.5">
                      <input
                        type="radio"
                        name={`answer-${question.id}`}
                        checked={isAnswer}
                        onChange={() => updateQuestion(questionIndex, { answer: optionIndex })}
                        className="h-4 w-4 shrink-0 accent-brand"
                        aria-label={`Correct option for question ${questionIndex + 1}`}
                      />
                      <span className="w-6 shrink-0 text-center font-mono text-xs font-bold text-slate-400">
                        {String.fromCharCode(65 + optionIndex)}
                      </span>
                      <input
                        type="text"
                        maxLength={300}
                        value={option}
                        onChange={(event) => {
                          const options = [...question.options];
                          options[optionIndex] = event.target.value;
                          updateQuestion(questionIndex, { options });
                        }}
                        className={`h-10 w-full rounded-lg border bg-white px-3 text-sm text-ink placeholder:text-slate-400 focus:outline-none ${
                          isAnswer
                            ? "border-emerald bg-emerald/5 focus:border-emerald"
                            : "border-zinc-300 focus:border-brand"
                        }`}
                        placeholder={`Option ${String.fromCharCode(65 + optionIndex)}`}
                      />
                    </div>
                  );
                })}
              </div>
              <p className="mt-3 font-mono text-[11px] text-slate-400">
                &gt; select the radio next to the correct option
              </p>
            </section>
          ))}

          <button
            type="button"
            onClick={addQuestion}
            disabled={editing.questions.length >= QUIZ_MAX_QUESTIONS}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-zinc-300 text-sm font-semibold text-mist transition-colors hover:border-brand/50 hover:text-brand disabled:opacity-50"
          >
            + Add question
            <span className="font-mono text-[11px] text-slate-400">
              ({editing.questions.length}/{QUIZ_MAX_QUESTIONS})
            </span>
          </button>
        </div>

        <aside className="h-fit space-y-4">
          <div className="rounded-2xl bg-ink p-6 text-white">
            <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Ready to save?
            </p>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">
              {answeredCount} {answeredCount === 1 ? "question" : "questions"} ·{" "}
              {editing.published ? "published" : "draft — students can’t see it yet"}
            </p>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="mt-4 flex h-11 w-full items-center justify-center rounded-lg bg-brand text-sm font-semibold text-white transition-colors hover:bg-brand-strong disabled:opacity-60"
            >
              {saving ? "Saving…" : editing.id ? "Save changes" : "Create quiz"}
            </button>
            <button
              type="button"
              onClick={() => {
                setEditing(null);
                setError(null);
              }}
              disabled={saving}
              className="mt-2 flex h-11 w-full items-center justify-center rounded-lg border border-white/20 text-sm font-semibold text-white transition-colors hover:bg-white/10 disabled:opacity-60"
            >
              Cancel
            </button>
          </div>
          <p className="rounded-2xl border border-zinc-200 bg-white p-4 text-xs leading-relaxed text-mist">
            Quizzes are multiple-choice with four options each. Students get their
            score instantly and can retake quizzes any number of times — attempts
            are visible in Activity.
          </p>
        </aside>
      </div>
    );
  }

  /* ------------------------------- list ------------------------------- */

  return (
    <div className="space-y-4">
      {error && (
        <p role="alert" className="rounded-lg bg-red-50 px-3.5 py-2.5 text-sm text-red-700">
          {error}
        </p>
      )}

      {generating ? (
        <QuizGenerator
          onCancel={() => setGenerating(false)}
          onDone={(questions, unitSlug) => {
            const unit = UNITS.find((u) => u.slug === unitSlug);
            setEditing({
              id: null,
              title: `${unit?.name ?? unitSlug} — practice quiz`,
              description: "",
              unitSlug,
              published: false,
              timeLimit: "",
              questions,
            });
            setGenerating(false);
          }}
        />
      ) : (
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() =>
              setEditing({
                id: null,
                title: "",
                description: "",
                unitSlug: UNITS[0]!.slug,
                published: false,
                timeLimit: "",
                questions: [
                  { id: crypto.randomUUID(), question: "", options: [...EMPTY_OPTIONS], answer: 0 },
                ],
              })
            }
            className="flex h-11 flex-1 items-center justify-center rounded-2xl border-2 border-dashed border-zinc-300 text-sm font-semibold text-mist transition-colors hover:border-brand/50 hover:text-brand"
          >
            + Create a new quiz
          </button>
          <button
            type="button"
            onClick={() => setGenerating(true)}
            className="flex h-11 flex-1 items-center justify-center rounded-2xl bg-ink text-sm font-semibold text-white transition-colors hover:bg-zinc-700"
          >
            ✦ Generate with AI
          </button>
        </div>
      )}

      {initial.length === 0 ? (
        <p className="rounded-2xl border border-zinc-200 bg-white px-6 py-12 text-center text-sm text-zinc-500">
          No quizzes yet. Create one and publish it — students can start practising
          immediately.
        </p>
      ) : (
        <ul className="space-y-3">
          {initial.map((quiz) => {
            const questionCount = parseQuestions(quiz.questions).length;
            const attempts = attemptCounts[quiz.id] ?? 0;
            const unit = UNITS.find((u) => u.slug === quiz.unit_slug);
            return (
              <li
                key={quiz.id}
                className="flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="flex flex-wrap items-center gap-2 text-sm font-semibold text-zinc-900">
                    {quiz.title}
                    <span
                      className={`rounded-full px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wide ${
                        quiz.published
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {quiz.published ? "Published" : "Draft"}
                    </span>
                  </p>
                  <p className="mt-0.5 text-xs text-zinc-500">
                    {unit?.name ?? quiz.unit_slug} · {questionCount}{" "}
                    {questionCount === 1 ? "question" : "questions"} · {attempts}{" "}
                    {attempts === 1 ? "attempt" : "attempts"}
                    {quiz.time_limit_minutes
                      ? ` · ${quiz.time_limit_minutes} min timer`
                      : ""}{" "}
                    · {formatDate(quiz.created_at)}
                  </p>
                </div>
                <div className="flex shrink-0 flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditing(toDraft(quiz))}
                    className="h-9 rounded-lg border border-zinc-300 px-3 text-xs font-semibold text-zinc-700 transition-colors hover:border-brand/50 hover:text-brand"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => togglePublish(quiz)}
                    className={`h-9 rounded-lg px-3 text-xs font-semibold transition-colors ${
                      quiz.published
                        ? "border border-amber-300 text-amber-700 hover:bg-amber-50"
                        : "bg-emerald-600 text-white hover:bg-emerald-700"
                    }`}
                  >
                    {quiz.published ? "Unpublish" : "Publish"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setPendingDelete({ id: quiz.id, title: quiz.title })}
                    className="flex h-9 items-center gap-1.5 rounded-lg border border-red-200 px-3 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50"
                    aria-label={`Delete ${quiz.title}`}
                  >
                    <TrashIcon width={14} height={14} />
                    Delete
                  </button>
                </div>
              </li>
            );
          })}
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