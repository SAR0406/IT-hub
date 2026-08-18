"use client";

import { useState } from "react";
import { UNITS } from "@/lib/syllabus";
import type { QuizQuestion } from "@/lib/quizzes";

const DIFFICULTIES = [
  { slug: "easy", label: "Easy" },
  { slug: "medium", label: "Medium" },
  { slug: "hard", label: "Hard" },
] as const;

const COUNTS = [3, 4, 5, 6, 7, 8, 9, 10];
const MAX_FOCUS = 200;

type QuizGeneratorProps = {
  onCancel: () => void;
  onDone: (questions: QuizQuestion[], unitSlug: string) => void;
};

export function QuizGenerator({ onCancel, onDone }: QuizGeneratorProps) {
  const [unitSlug, setUnitSlug] = useState(UNITS[0]!.slug);
  const [topicSlug, setTopicSlug] = useState("");
  const [difficulty, setDifficulty] = useState<(typeof DIFFICULTIES)[number]["slug"]>("medium");
  const [count, setCount] = useState(5);
  const [focus, setFocus] = useState("");
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[] | null>(null);

  const unit = UNITS.find((u) => u.slug === unitSlug)!;

  async function generate() {
    setError(null);
    setQuestions(null);
    setGenerating(true);
    try {
      const response = await fetch("/api/ai/generate-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          unitSlug,
          topicSlug: topicSlug || null,
          difficulty,
          count,
          focus: focus.trim() || null,
        }),
      });
      const data = (await response.json()) as { questions?: QuizQuestion[]; error?: string };
      if (!response.ok) {
        throw new Error(data.error ?? "The quiz couldn't be generated.");
      }
      setQuestions(data.questions ?? []);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setGenerating(false);
    }
  }

  function sendToEditor() {
    if (!questions || questions.length === 0) return;
    onDone(questions, unitSlug);
  }

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-lg font-bold tracking-tight text-ink">
            Generate a quiz with AI
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Pick a unit and difficulty — the AI writes the questions, you review and
            publish them.
          </p>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="text-xs font-semibold text-slate-400 transition-colors hover:text-ink"
        >
          Close
        </button>
      </div>

      {questions === null && !generating && (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label htmlFor="aiQuizUnit" className="mb-1.5 block text-sm font-semibold text-ink">
              Unit
            </label>
            <select
              id="aiQuizUnit"
              value={unitSlug}
              onChange={(event) => {
                setUnitSlug(event.target.value);
                setTopicSlug("");
              }}
              className="h-11 w-full rounded-lg border border-zinc-300 bg-white px-3 text-base text-ink focus:border-brand focus:outline-none"
            >
              {UNITS.map((u) => (
                <option key={u.slug} value={u.slug}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="aiQuizTopic" className="mb-1.5 block text-sm font-semibold text-ink">
              Topic <span className="font-normal text-mist">(optional)</span>
            </label>
            <select
              id="aiQuizTopic"
              value={topicSlug}
              onChange={(event) => setTopicSlug(event.target.value)}
              className="h-11 w-full rounded-lg border border-zinc-300 bg-white px-3 text-base text-ink focus:border-brand focus:outline-none"
            >
              <option value="">Whole unit</option>
              {unit.topics.map((t) => (
                <option key={t.slug} value={t.slug}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="aiQuizCount" className="mb-1.5 block text-sm font-semibold text-ink">
              Questions
            </label>
            <select
              id="aiQuizCount"
              value={count}
              onChange={(event) => setCount(Number(event.target.value))}
              className="h-11 w-full rounded-lg border border-zinc-300 bg-white px-3 text-base text-ink focus:border-brand focus:outline-none"
            >
              {COUNTS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <span className="mb-1.5 block text-sm font-semibold text-ink">Difficulty</span>
            <div className="flex gap-1 rounded-lg border border-zinc-300 bg-white p-1">
              {DIFFICULTIES.map((d) => (
                <button
                  key={d.slug}
                  type="button"
                  onClick={() => setDifficulty(d.slug)}
                  className={`h-9 flex-1 rounded-md text-xs font-semibold transition-colors ${
                    difficulty === d.slug
                      ? "bg-brand text-white"
                      : "text-mist hover:text-brand"
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {questions === null && !generating && (
        <div className="mt-4">
          <label htmlFor="aiQuizFocus" className="mb-1.5 block text-sm font-semibold text-ink">
            Focus notes <span className="font-normal text-mist">(optional, max {MAX_FOCUS})</span>
          </label>
          <input
            id="aiQuizFocus"
            type="text"
            maxLength={MAX_FOCUS}
            value={focus}
            onChange={(event) => setFocus(event.target.value)}
            placeholder="e.g. focus on JOIN queries and primary keys"
            className="h-11 w-full rounded-lg border border-zinc-300 bg-white px-3.5 text-base text-ink placeholder:text-slate-400 focus:border-brand focus:outline-none"
          />
          <button
            type="button"
            onClick={() => void generate()}
            className="mt-4 flex h-11 w-full items-center justify-center rounded-xl bg-brand text-sm font-semibold text-white transition-colors hover:bg-brand-strong"
          >
            Generate {count} questions
          </button>
        </div>
      )}

      {generating && (
        <div className="mt-6 rounded-xl bg-paper px-4 py-8 text-center">
          <p className="animate-pulse text-sm font-semibold text-brand">
            AI is writing questions for {unit.name}…
          </p>
          <p className="mt-1 font-mono text-xs text-slate-400">
            easy on the send button — it takes a few seconds
          </p>
        </div>
      )}

      {questions !== null && (
        <div className="mt-6">
          <p className="font-mono text-xs font-bold uppercase tracking-widest text-slate-400">
            {questions.length} questions · review before saving
          </p>
          <ul className="mt-3 space-y-4">
            {questions.map((question, index) => (
              <li key={question.id} className="rounded-xl border border-zinc-200 bg-paper p-4">
                <p className="text-sm font-semibold text-ink">
                  {index + 1}. {question.question}
                </p>
                <ul className="mt-2.5 space-y-1">
                  {question.options.map((option, optionIndex) => (
                    <li
                      key={optionIndex}
                      className={`flex items-center gap-2 rounded-lg px-3 py-1.5 font-mono text-xs ${
                        optionIndex === question.answer
                          ? "bg-emerald-100 text-emerald-800"
                          : "text-slate-600"
                      }`}
                    >
                      <span className="w-4 shrink-0 font-bold text-slate-400">
                        {String.fromCharCode(65 + optionIndex)}
                      </span>
                      {option}
                      {optionIndex === question.answer && (
                        <span className="ml-auto font-bold text-emerald-600">correct</span>
                      )}
                    </li>
                  ))}
                </ul>
                {question.explanation && (
                  <p className="mt-2.5 rounded-lg border-l-2 border-brand bg-brand-soft/50 px-3 py-2 text-xs leading-relaxed text-ink">
                    <span className="font-mono font-bold uppercase tracking-wider text-brand-strong">
                      why /{" "}
                    </span>
                    {question.explanation}
                  </p>
                )}
              </li>
            ))}
          </ul>

          <div className="mt-5 flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={sendToEditor}
              className="flex h-11 flex-1 items-center justify-center rounded-xl bg-brand text-sm font-semibold text-white transition-colors hover:bg-brand-strong"
            >
              Send to editor →
            </button>
            <button
              type="button"
              onClick={() => void generate()}
              disabled={generating}
              className="flex h-11 flex-1 items-center justify-center rounded-xl border border-zinc-300 text-sm font-semibold text-zinc-700 transition-colors hover:border-brand/50 hover:text-brand disabled:opacity-60"
            >
              {generating ? "Generating…" : "Regenerate"}
            </button>
            <button
              type="button"
              onClick={() => setQuestions(null)}
              className="flex h-11 flex-1 items-center justify-center rounded-xl border border-zinc-300 text-sm font-semibold text-zinc-700 transition-colors hover:border-brand/50 hover:text-brand"
            >
              Change settings
            </button>
          </div>
        </div>
      )}

      {error && (
        <p role="alert" className="mt-4 rounded-lg bg-red-50 px-3.5 py-2.5 text-sm text-red-700">
          {error}
        </p>
      )}
    </section>
  );
}