import type { Json } from "@/lib/supabase/database.types";

/**
 * Quiz question shape, stored as JSONB on quizzes.questions.
 * The answer field is the index (0-3) of the correct option.
 */
export type QuizQuestion = {
  id: string;
  question: string;
  options: string[];
  answer: number;
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
    q.answer <= 3
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
    questions.push({
      id: typeof q.id === "string" ? q.id : String(index + 1),
      question,
      options,
      answer,
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