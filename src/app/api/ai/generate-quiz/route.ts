import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { logActivity } from "@/lib/activity";
import { UNITS } from "@/lib/syllabus";
import { validateQuestions, type QuizQuestion } from "@/lib/quizzes";
import {
  countAiUsageToday,
  getAiSettings,
  logAiUsage,
} from "@/lib/ai/settings";
import { runAiJson } from "@/lib/ai/gateway";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";

export const runtime = "nodejs";

const DIFFICULTIES = ["easy", "medium", "hard"] as const;
const MIN_COUNT = 3;
const MAX_COUNT = 10;
const MAX_FOCUS = 200;
const MAX_REPAIRS = 1;

function error(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

function buildPrompt(
  unitName: string,
  topics: string[],
  difficulty: string,
  count: number,
  focus: string
) {
  const difficultyGuide: Record<string, string> = {
    easy: "recall-level: definitions, terminology, simple facts. One obviously correct answer.",
    medium:
      "application-level: why something happens, which statement is right, small reasoning steps.",
    hard: "analysis-level: multi-step reasoning, comparing concepts, spotting subtle traps.",
  };
  return [
    `Generate exactly ${count} multiple-choice questions for Class 11 IT students on the unit "${unitName}".`,
    `Syllabus topics covered here: ${topics.join(", ") || "the whole unit"}.`,
    focus ? `Teacher's focus request: ${focus}` : "",
    `Difficulty: ${difficulty} — ${difficultyGuide[difficulty]}`,
    "Rules: 4 options per question, exactly one correct answer (index 0–3). Plausible distractors, no 'all of the above' or 'none of the above', no trick questions. Questions must be answerable from the syllabus — no trivia outside it.",
    'Return ONLY a JSON object in this exact shape: {"questions":[{"question":"...","options":["A","B","C","D"],"answer":0,"explanation":"..."}]}. The answer field is the index of the correct option.',
    '"explanation" is optional: 1–2 plain sentences, written for a Class 11 student, explaining why the correct option is right. No fancy words, no markdown. Omit the field only if you cannot explain confidently.',
  ]
    .filter(Boolean)
    .join("\n");
}

export async function POST(request: Request) {
  const ctx = await requireAdmin();
  if (!ctx) return error("You must be signed in.", 401);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return error("Invalid request body.", 400);
  }

  const unitSlug = (body as { unitSlug?: unknown })?.unitSlug;
  const topicSlug = (body as { topicSlug?: unknown })?.topicSlug ?? null;
  const difficulty = (body as { difficulty?: unknown })?.difficulty;
  const count = (body as { count?: unknown })?.count;
  const focusRaw = (body as { focus?: unknown })?.focus ?? "";

  if (typeof unitSlug !== "string") return error("Pick a unit.", 400);
  const unit = UNITS.find((u) => u.slug === unitSlug);
  if (!unit) return error("That unit doesn't exist.", 400);

  if (topicSlug !== null && topicSlug !== undefined) {
    if (typeof topicSlug !== "string" || !unit.topics.some((t) => t.slug === topicSlug)) {
      return error("That topic doesn't belong to the unit.", 400);
    }
  }
  if (typeof difficulty !== "string" || !DIFFICULTIES.includes(difficulty as never)) {
    return error("Pick a difficulty.", 400);
  }
  if (typeof count !== "number" || !Number.isInteger(count) || count < MIN_COUNT || count > MAX_COUNT) {
    return error(`Pick a question count between ${MIN_COUNT} and ${MAX_COUNT}.`, 400);
  }
  const focus = typeof focusRaw === "string" ? focusRaw.trim() : "";
  if (focus.length > MAX_FOCUS) {
    return error(`Focus notes are limited to ${MAX_FOCUS} characters.`, 400);
  }

  const settings = await getAiSettings(ctx.supabase);
  if (!settings.ai_enabled) {
    return error("The AI assistant is switched off right now.", 503);
  }
  if (!process.env.NVIDIA_API_KEY) {
    return error("The AI assistant isn't set up yet.", 503);
  }

  const usedToday = await countAiUsageToday(ctx.supabase, ctx.user.id, "quiz_gen");
  if (usedToday >= settings.ai_daily_cap) {
    return error(
      `You've hit today's AI limit (${settings.ai_daily_cap} generations). Try again tomorrow.`,
      429
    );
  }

  const topics = topicSlug
    ? unit.topics.filter((t) => t.slug === topicSlug).map((t) => t.name)
    : unit.topics.map((t) => t.name);

  const userPrompt = buildPrompt(unit.name, topics, difficulty, count, focus);
  const messages: ChatCompletionMessageParam[] = [
    {
      role: "system",
      content:
        "You are a careful question paper setter for a Class 11 IT classroom. You write exam-quality multiple-choice questions and always emit strict JSON.",
    },
    { role: "user", content: userPrompt },
  ];

  let questions: QuizQuestion[] = [];
  let raw: unknown = null;
  let lastValidationError = "";
  let usage = { promptTokens: 0, completionTokens: 0 };

  for (let attempt = 0; attempt <= MAX_REPAIRS; attempt++) {
    const result = await runAiJson(messages, settings.ai_model);
    usage = { promptTokens: result.promptTokens, completionTokens: result.completionTokens };

    try {
      raw = JSON.parse(result.content);
    } catch {
      lastValidationError = "The response was not valid JSON.";
      messages.push({ role: "assistant", content: result.content });
      messages.push({
        role: "user",
        content: `That was not valid JSON. Respond again with ONLY valid JSON matching the requested shape. Error: ${lastValidationError}`,
      });
      continue;
    }

    const validated = validateQuestions((raw as { questions?: unknown })?.questions);
    if (validated.ok) {
      questions = validated.questions.map((q) => ({ ...q, id: crypto.randomUUID() }));
      break;
    }
    lastValidationError = validated.error;
    messages.push({ role: "assistant", content: result.content });
    messages.push({
      role: "user",
      content: `The questions failed validation: ${validated.error}. Fix the problems and respond again with ONLY valid JSON in the same shape.`,
    });
  }

  if (questions.length === 0) {
    console.error("[ai] quiz generation failed:", lastValidationError);
    return error(
      "The AI couldn't write valid questions this time — try again with a simpler request.",
      502
    );
  }

  await logAiUsage(
    ctx.supabase,
    ctx.user.id,
    "quiz_gen",
    settings.ai_model,
    usage.promptTokens,
    usage.completionTokens
  );
  await logActivity(ctx.supabase, ctx.user.id, "admin_action", {
    action: "quiz_generated",
    unit: unitSlug,
    topic: topicSlug ?? null,
    difficulty,
    count: questions.length,
    model: settings.ai_model,
  });

  return NextResponse.json({ questions });
}