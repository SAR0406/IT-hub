import type { Json } from "@/lib/supabase/database.types";

/**
 * Quiz question shape, stored as JSONB on quizzes.questions.
 * The answer field is the index (0-3) of the correct option.
 * explanation is optional — older quizzes don't have it, and not every
 * question needs one.
 */
export type QuizQuestion = {
  id: string;
  question: string;
  options: string[];
  answer: number;
  explanation?: string;
};

export type Quiz = {
  id: string;
  title: string;
  description: string | null;
  unit_slug: string;
  questions: QuizQuestion[];
  published: boolean;
  created_at: string;
};

export const QUIZ_MAX_QUESTIONS = 25;
export const QUIZ_EXPLANATION_MAX = 600;

export function parseQuestions(raw: Json | null | undefined): QuizQuestion[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter(isQuizQuestion);
}

export function isQuizQuestion(value: unknown): value is QuizQuestion {
  if (typeof value !== "object" || value === null) return false;
  const q = value as Record<string, unknown>;
  return (
    typeof q.id === "string" &&
    typeof q.question === "string" &&
    Array.isArray(q.options) &&
    q.options.length === 4 &&
    q.options.every((o) => typeof o === "string") &&
    typeof q.answer === "number" &&
    Number.isInteger(q.answer) &&
    q.answer >= 0 &&
    q.answer <= 3 &&
    (q.explanation === undefined || typeof q.explanation === "string")
  );
}

/** Validates quiz questions from an admin form. */
export function validateQuestions(value: unknown):
  | { ok: true; questions: QuizQuestion[] }
  | { ok: false; error: string } {
  if (!Array.isArray(value) || value.length === 0) {
    return { ok: false, error: "Add at least one question." };
  }
  if (value.length > QUIZ_MAX_QUESTIONS) {
    return { ok: false, error: `A quiz can have at most ${QUIZ_MAX_QUESTIONS} questions.` };
  }

  const questions: QuizQuestion[] = [];
  for (const [index, raw] of value.entries()) {
    if (typeof raw !== "object" || raw === null) {
      return { ok: false, error: `Question ${index + 1} is invalid.` };
    }
    const q = raw as Record<string, unknown>;
    const question = typeof q.question === "string" ? q.question.trim() : "";
    if (question.length < 3 || question.length > 500) {
      return { ok: false, error: `Question ${index + 1} needs 3–500 characters.` };
    }
    if (!Array.isArray(q.options) || q.options.length !== 4) {
      return { ok: false, error: `Question ${index + 1} needs exactly 4 options.` };
    }
    const options = q.options.map((o) => (typeof o === "string" ? o.trim() : ""));
    if (options.some((o) => o.length < 1 || o.length > 300)) {
      return { ok: false, error: `Question ${index + 1} has an empty or too-long option.` };
    }
    const answer = q.answer;
    if (typeof answer !== "number" || !Number.isInteger(answer) || answer < 0 || answer > 3) {
      return { ok: false, error: `Question ${index + 1} has no correct answer selected.` };
    }
    const explanation =
      typeof q.explanation === "string" && q.explanation.trim().length > 0
        ? q.explanation.trim()
        : undefined;
    if (explanation && explanation.length > QUIZ_EXPLANATION_MAX) {
      return {
        ok: false,
        error: `Question ${index + 1}'s explanation is too long (max ${QUIZ_EXPLANATION_MAX} characters).`,
      };
    }
    questions.push({
      id: typeof q.id === "string" ? q.id : String(index + 1),
      question,
      options,
      answer,
      ...(explanation ? { explanation } : {}),
    });
  }
  return { ok: true, questions };
}

/** Scores submitted answers (array of option indexes) against a quiz. */
export function scoreQuiz(questions: QuizQuestion[], answers: unknown): number {
  if (!Array.isArray(answers) || answers.length !== questions.length) return 0;
  let score = 0;
  for (const [index, question] of questions.entries()) {
    if (answers[index] === question.answer) score += 1;
  }
  return score;
}

/* ------------------------- performance analysis ------------------------- */

/**
 * Accuracy below this is flagged as a weak area.
 * Accuracy at or above this counts as "on track".
 */
export const WEAK_ACCURACY_THRESHOLD = 0.6;
export const STRONG_ACCURACY_THRESHOLD = 0.8;

/**
 * Minimum number of answered questions per unit before an accuracy verdict
 * is trustworthy. A single 3-question quiz isn't a signal.
 */
export const MIN_ACCURACY_SAMPLE = 5;

export type QuizAttemptRow = {
  quiz_id: string;
  score: number;
  total: number;
};

export type QuizRow = {
  id: string;
  unit_slug: string;
};

export type UnitPerformanceVerdict = "weak" | "building" | "strong" | "insufficient";

/** Discriminated union — "insufficient" is the only verdict with null accuracy. */
export type UnitQuizPerformance =
  | {
      unitSlug: string;
      correct: number;
      total: number;
      accuracy: number;
      verdict: Exclude<UnitPerformanceVerdict, "insufficient">;
    }
  | {
      unitSlug: string;
      correct: number;
      total: number;
      accuracy: null;
      verdict: "insufficient";
    };

function verdictForAccuracy(accuracy: number): Exclude<UnitPerformanceVerdict, "insufficient"> {
  if (accuracy < WEAK_ACCURACY_THRESHOLD) return "weak";
  if (accuracy >= STRONG_ACCURACY_THRESHOLD) return "strong";
  return "building";
}

/**
 * Aggregates a student's quiz attempts into per-unit accuracy.
 * Attempts for quizzes that no longer exist are ignored; malformed rows
 * (non-positive totals) are skipped. Quizzes are looked up once via a map.
 */
export function analyzeUnitPerformance(
  attempts: QuizAttemptRow[],
  quizzes: QuizRow[]
): UnitQuizPerformance[] {
  const unitByQuiz = new Map(quizzes.map((quiz) => [quiz.id, quiz.unit_slug]));
  const buckets = new Map<string, { correct: number; total: number }>();

  for (const attempt of attempts) {
    const unitSlug = unitByQuiz.get(attempt.quiz_id);
    if (!unitSlug || !Number.isFinite(attempt.total) || attempt.total <= 0) continue;
    const bucket = buckets.get(unitSlug) ?? { correct: 0, total: 0 };
    bucket.correct += Math.min(attempt.score, attempt.total);
    bucket.total += attempt.total;
    buckets.set(unitSlug, bucket);
  }

  return [...buckets.entries()].map(([unitSlug, { correct, total }]) => {
    const accuracy = total >= MIN_ACCURACY_SAMPLE ? correct / total : null;
    return accuracy === null
      ? { unitSlug, correct, total, accuracy: null, verdict: "insufficient" }
      : { unitSlug, correct, total, accuracy, verdict: verdictForAccuracy(accuracy) };
  });
}