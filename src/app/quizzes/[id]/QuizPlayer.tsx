"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { QuizQuestion } from "@/lib/quizzes";

type QuizPlayerProps = {
  quiz: { id: string; title: string; description: string | null };
  unitName: string;
  questions: QuizQuestion[];
  best: { score: number; total: number } | null;
  timeLimitMinutes: number | null;
};

type Result = { score: number; total: number };

function scoreMessage(score: number, total: number): { title: string; dark: string } {
  const ratio = total > 0 ? score / total : 0;
  if (ratio >= 0.8) return { title: "Excellent! You know this unit.", dark: "text-emerald-300" };
  if (ratio >= 0.6) return { title: "Good work — nearly there.", dark: "text-teal-300" };
  if (ratio >= 0.4) return { title: "Solid start. Review the notes and retake.", dark: "text-amber-300" };
  return { title: "Review this unit’s material, then try again.", dark: "text-blush" };
}

export function QuizPlayer({ quiz, unitName, questions, best, timeLimitMinutes }: QuizPlayerProps) {
  const [answers, setAnswers] = useState<(number | null)[]>(() =>
    questions.map(() => null)
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [secondsLeft, setSecondsLeft] = useState<number | null>(() =>
    timeLimitMinutes ? timeLimitMinutes * 60 : null
  );
  const answersRef = useRef(answers);
  answersRef.current = answers;
  const submitRef = useRef<(force?: boolean) => Promise<void>>(async () => {});
  const timerDoneRef = useRef(false);

  useEffect(() => {
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "quiz_start",
        details: { quiz_id: quiz.id, quiz_title: quiz.title },
      }),
      keepalive: true,
    }).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const answeredCount = useMemo(
    () => answers.filter((answer) => answer !== null).length,
    [answers]
  );
  const allAnswered = answeredCount === questions.length;

  function selectAnswer(questionIndex: number, optionIndex: number) {
    setAnswers((current) => {
      const next = [...current];
      next[questionIndex] = optionIndex;
      return next;
    });
  }

  const handleSubmit = useCallback(
    async (force = false) => {
      if ((!force && !allAnswered) || submitting || timerDoneRef.current) return;
      if (force) timerDoneRef.current = true;
      setSubmitting(true);
      setError(null);

      try {
        const response = await fetch(`/api/quizzes/${quiz.id}/attempt`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ answers: answersRef.current }),
        });
        const data = (await response.json()) as {
          score?: number;
          total?: number;
          error?: string;
        };
        if (!response.ok) {
          throw new Error(data.error ?? "Your answers could not be submitted.");
        }
        setResult({ score: data.score ?? 0, total: data.total ?? questions.length });
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setSubmitting(false);
      }
    },
    [allAnswered, submitting, quiz.id, questions.length]
  );
  submitRef.current = handleSubmit;

  useEffect(() => {
    if (secondsLeft === null || result) return;
    if (secondsLeft <= 0) {
      void submitRef.current(true);
      return;
    }
    const timer = setTimeout(() => setSecondsLeft((s) => (s === null ? null : s - 1)), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft, result]);

  function reset() {
    setAnswers(questions.map(() => null));
    setResult(null);
    setError(null);
    timerDoneRef.current = false;
    setSecondsLeft(timeLimitMinutes ? timeLimitMinutes * 60 : null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  /* ------------------------------ results ------------------------------ */

  if (result) {
    const percent = result.total > 0 ? Math.round((result.score / result.total) * 100) : 0;
    const message = scoreMessage(result.score, result.total);
    return (
      <div className="space-y-6">
        <section className="rounded-2xl bg-ink p-8 text-center text-white">
          <p className="font-mono text-xs text-slate-400">{unitName}</p>
          <h1 className="mt-1 font-display text-2xl font-bold tracking-tight">{quiz.title}</h1>

          <div className="mx-auto mt-6 flex h-28 w-28 items-center justify-center rounded-full border-4 border-brand bg-white/5">
            <p className="font-display text-3xl font-bold">
              {result.score}
              <span className="text-lg text-slate-400">/{result.total}</span>
            </p>
          </div>
          <p className={`mt-5 font-display text-lg font-bold ${message.dark}`}>
            {percent}% — {message.title}
          </p>
          {best && (
            <p className="mt-2 font-mono text-xs text-slate-400">
              your best so far: {best.score}/{best.total}
            </p>
          )}
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={reset}
              className="flex h-11 items-center justify-center rounded-xl bg-brand px-6 text-sm font-semibold text-white transition-colors hover:bg-brand-strong"
            >
              Try again
            </button>
            <Link
              href="/quizzes"
              className="flex h-11 items-center justify-center rounded-xl border border-white/25 px-6 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              All quizzes
            </Link>
          </div>
        </section>

        <section className="rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8">
          <h2 className="font-display text-lg font-bold tracking-tight text-ink">
            Review your answers
          </h2>
          <ol className="mt-5 space-y-6">
            {questions.map((question, questionIndex) => {
              const chosen = answers[questionIndex];
              const correct = chosen === question.answer;
              return (
                <li key={question.id} className="rounded-xl border border-zinc-200 p-5">
                  <p className="flex items-start gap-2.5">
                    <span
                      className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
                        correct
                          ? "bg-emerald text-white"
                          : "bg-red-500 text-white"
                      }`}
                      aria-hidden
                    >
                      {correct ? "✓" : "✕"}
                    </span>
                    <span className="font-semibold text-ink">
                      {questionIndex + 1}. {question.question}
                    </span>
                  </p>
                  <ul className="mt-3 space-y-1.5 pl-8">
                    {question.options.map((option, optionIndex) => {
                      const isChosen = chosen === optionIndex;
                      const isAnswer = optionIndex === question.answer;
                      return (
                        <li
                          key={optionIndex}
                          className={`rounded-lg px-3 py-2 text-sm ${
                            isAnswer
                              ? "bg-emerald/15 font-semibold text-emerald-800"
                              : isChosen
                                ? "bg-red-50 text-red-700"
                                : "text-mist"
                          }`}
                        >
                          <span className="mr-2 font-mono text-xs font-bold text-slate-400">
                            {String.fromCharCode(65 + optionIndex)}
                          </span>
                          {option}
                          {isAnswer && <span className="ml-2 font-mono text-[10px]">— correct</span>}
                          {isChosen && !isAnswer && (
                            <span className="ml-2 font-mono text-[10px]">— your answer</span>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </li>
              );
            })}
          </ol>
        </section>
      </div>
    );
  }

  /* ------------------------------ taking ------------------------------ */

  return (
    <div className="space-y-5">
      <section className="rounded-2xl bg-ink p-6 text-white sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="font-mono text-xs text-blush">{unitName}</p>
            <h1 className="mt-1 font-display text-2xl font-bold tracking-tight">{quiz.title}</h1>
            {quiz.description && (
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-300">
                {quiz.description}
              </p>
            )}
          </div>
          {best && (
            <span className="rounded-full bg-white/10 px-3 py-1.5 font-mono text-[11px] font-bold text-blush">
              your best: {best.score}/{best.total}
            </span>
          )}
        </div>
        {secondsLeft !== null && (
          <div
            className={`mt-5 flex items-center gap-3 ${secondsLeft <= 30 ? "text-red-400" : "text-slate-300"}`}
          >
            <span className="font-mono text-2xl font-bold tabular-nums">
              {Math.floor(secondsLeft / 60)}:{String(secondsLeft % 60).padStart(2, "0")}
            </span>
            <span className="font-mono text-[10px]">
              {secondsLeft <= 30 ? "time's almost up — submit soon!" : "left on the clock"}
            </span>
          </div>
        )}
        <div className="mt-5 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-brand transition-all"
            style={{ width: `${(answeredCount / questions.length) * 100}%` }}
          />
        </div>
        <p className="mt-2 font-mono text-[11px] text-slate-400">
          {answeredCount}/{questions.length} answered
        </p>
      </section>

      <ol className="space-y-5">
        {questions.map((question, questionIndex) => (
          <li key={question.id} className="rounded-2xl border border-zinc-200 bg-white p-6">
            <p className="flex items-start gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-soft font-mono text-xs font-bold text-brand-strong">
                {questionIndex + 1}
              </span>
              <span className="font-semibold leading-relaxed text-ink">{question.question}</span>
            </p>
            <div role="radiogroup" aria-label={`Question ${questionIndex + 1}`} className="mt-4 space-y-2.5 pl-9">
              {question.options.map((option, optionIndex) => {
                const selected = answers[questionIndex] === optionIndex;
                return (
                  <label
                    key={optionIndex}
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 px-4 py-3 transition-colors ${
                      selected
                        ? "border-brand bg-brand-soft/60"
                        : "border-zinc-200 bg-paper hover:border-brand/40"
                    }`}
                  >
                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      checked={selected}
                      onChange={() => selectAnswer(questionIndex, optionIndex)}
                      className="h-4 w-4 shrink-0 accent-brand"
                    />
                    <span className="w-5 shrink-0 text-center font-mono text-xs font-bold text-slate-400">
                      {String.fromCharCode(65 + optionIndex)}
                    </span>
                    <span className="text-sm font-medium text-ink">{option}</span>
                  </label>
                );
              })}
            </div>
          </li>
        ))}
      </ol>

      {error && (
        <p role="alert" className="rounded-lg bg-red-50 px-3.5 py-2.5 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="sticky bottom-4">
        <button
          type="button"
          onClick={() => void handleSubmit()}
          disabled={!allAnswered || submitting}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand text-base font-semibold text-white shadow-lift transition-colors hover:bg-brand-strong disabled:opacity-60"
        >
          {submitting
            ? "Submitting…"
            : allAnswered
              ? `Submit — ${answeredCount}/${questions.length} answered`
              : `Answer ${questions.length - answeredCount} more ${questions.length - answeredCount === 1 ? "question" : "questions"}`}
        </button>
      </div>
    </div>
  );
}