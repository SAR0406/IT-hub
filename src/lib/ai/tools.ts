import type { SessionContext } from "@/lib/auth";
import { UNITS } from "@/lib/syllabus";
import { webSearch, webSearchEnabled } from "@/lib/ai/websearch";
import type { ChatCompletionTool } from "openai/resources/chat/completions";

export type ToolContext = SessionContext;

type FunctionTool = Extract<ChatCompletionTool, { type: "function" }>;

const WEBSEARCH_TOOL: FunctionTool = {
  type: "function",
  function: {
    name: "websearch",
    description:
      "Search the live web for up-to-date facts the archive can't answer (e.g. latest IT news, current events, definitions from the internet). Returns titles, urls and snippets.",
    parameters: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "Concise search query.",
        },
      },
      required: ["query"],
      additionalProperties: false,
    },
  },
};

/** Tools available to the AI. websearch only appears when a provider key exists. */
export function getAiTools(): FunctionTool[] {
  return webSearchEnabled() ? [...AI_TOOLS, WEBSEARCH_TOOL] : AI_TOOLS;
}

/**
 * Server-side tools the AI assistant can call. Every tool talks to the
 * Supabase database through the student's own session, so students can only
 * see what they could already see in the app.
 */
export const AI_TOOLS: FunctionTool[] = [
  {
    type: "function",
    function: {
      name: "syllabus_lookup",
      description:
        "Look up units and topics in the Class 11 IT syllabus. Use this before answering questions about the curriculum.",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "Free-text search term, e.g. 'computer organization' or 'CSS'.",
          },
        },
        required: ["query"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "search_archive",
      description:
        "Search the study archive for notes, worksheets and other study material. Always use this before pointing a student to files.",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "Search term matching titles, file names or topics.",
          },
        },
        required: ["query"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_resource",
      description:
        "Get a specific resource's details and its open/download links. The id comes from search_archive results.",
      parameters: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Resource id.",
          },
        },
        required: ["id"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_quiz_info",
      description:
        "List published quizzes and the student's best scores on them. Use this when a student asks about quizzes or practice.",
      parameters: {
        type: "object",
        properties: {},
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_student_record",
      description:
        "Teacher-only: full record for one student — activity timeline, quiz attempts, flags, downloads. Only works for admins.",
      parameters: {
        type: "object",
        properties: {
          student_id: {
            type: "string",
            description: "The student's user id.",
          },
        },
        required: ["student_id"],
        additionalProperties: false,
      },
    },
  },
];

export const AI_TOOL_NAMES = AI_TOOLS.map((t) => t.function.name);

export async function runAiTool(
  name: string,
  rawArgs: string,
  ctx: ToolContext
): Promise<string> {
  let args: Record<string, unknown> = {};
  try {
    args = JSON.parse(rawArgs) as Record<string, unknown>;
  } catch {
    return JSON.stringify({ error: "The tool received invalid arguments." });
  }

  try {
    switch (name) {
      case "syllabus_lookup":
        return syllabusLookup(String(args.query ?? ""));
      case "search_archive":
        return searchArchive(String(args.query ?? ""), ctx);
      case "get_resource":
        return getResource(String(args.id ?? ""), ctx);
      case "get_quiz_info":
        return getQuizInfo(ctx);
      case "get_student_record":
        return getStudentRecord(String(args.student_id ?? ""), ctx);
      case "websearch":
        return runWebSearch(String(args.query ?? ""));
      default:
        return JSON.stringify({ error: `Unknown tool: ${name}` });
    }
  } catch (err) {
    console.error(`[ai-tools] ${name} failed:`, err);
    return JSON.stringify({ error: "That tool hit a problem. Try rephrasing." });
  }
}

function syllabusLookup(query: string): string {
  const q = query.trim().toLowerCase();
  const results = UNITS.map((unit) => {
    const topics = q
      ? unit.topics.filter((t) => t.name.toLowerCase().includes(q))
      : unit.topics;
    return {
      unit: unit.name,
      slug: unit.slug,
      topics: (q && topics.length === 0 ? [] : topics).map((t) => t.name),
    };
  }).filter((u) => !q || u.unit.toLowerCase().includes(q) || u.topics.length > 0);

  return JSON.stringify(results.length > 0 ? results : { message: "No syllabus matches." });
}

async function searchArchive(query: string, ctx: ToolContext): Promise<string> {
  const q = query.trim();
  if (!q) return JSON.stringify({ error: "Empty search query." });

  const { data, error } = await ctx.supabase
    .from("resources")
    .select("id, title, file_name, resource_type, unit_slug, is_verified")
    .or(
      [
        `title.ilike.%${q}%`,
        `file_name.ilike.%${q}%`,
        `resource_type.ilike.%${q}%`,
        `unit_slug.ilike.%${q}%`,
        `topic_slug.ilike.%${q}%`,
      ].join(",")
    )
    .order("created_at", { ascending: false })
    .limit(8);

  if (error) throw new Error("search failed");
  const results = (data ?? []).map((r) => ({
    id: r.id,
    title: r.title,
    unit: r.unit_slug,
    type: r.resource_type,
    verified: r.is_verified,
    link: `/api/files/${r.id}/open`,
  }));
  return JSON.stringify(results.length > 0 ? results : { message: "No archive matches." });
}

async function getResource(id: string, ctx: ToolContext): Promise<string> {
  const { data, error } = await ctx.supabase
    .from("resources")
    .select("id, title, description, file_name, file_type, file_size, unit_slug, is_verified")
    .eq("id", id)
    .maybeSingle();
  if (error || !data) return JSON.stringify({ error: "Resource not found." });
  return JSON.stringify({
    ...data,
    link: `/api/files/${data.id}/open`,
    download_link: `/api/files/${data.id}/download`,
  });
}

async function getQuizInfo(ctx: ToolContext): Promise<string> {
  const { data: quizzes, error } = await ctx.supabase
    .from("quizzes")
    .select("id, title, description, unit_slug, time_limit_minutes")
    .eq("published", true)
    .order("created_at", { ascending: false });

  if (error) throw new Error("quiz list failed");

  const { data: attempts } = await ctx.supabase
    .from("quiz_attempts")
    .select("quiz_id, score, total")
    .eq("user_id", ctx.user.id);

  const best = new Map<string, { score: number; total: number }>();
  for (const a of attempts ?? []) {
    const current = best.get(a.quiz_id);
    if (!current || a.score > current.score) best.set(a.quiz_id, { score: a.score, total: a.total });
  }

  const results = (quizzes ?? []).map((q) => ({
    id: q.id,
    title: q.title,
    unit: q.unit_slug,
    time_limit_minutes: q.time_limit_minutes,
    my_best: best.get(q.id) ?? null,
    link: `/quizzes/${q.id}`,
  }));
  return JSON.stringify(results.length > 0 ? results : { message: "No published quizzes yet." });
}

async function runWebSearch(query: string): Promise<string> {
  if (!webSearchEnabled()) {
    return JSON.stringify({ error: "Web search is not configured." });
  }
  const results = await webSearch(query, 5);
  if (results.length === 0) {
    return JSON.stringify({ message: "No web results for that query." });
  }
  return JSON.stringify(
    results.map((r) => ({ title: r.title, url: r.url, snippet: r.content }))
  );
}

async function getStudentRecord(studentId: string, ctx: ToolContext): Promise<string> {
  if (ctx.profile.role !== "admin") {
    return JSON.stringify({ error: "Only teachers can view student records." });
  }
  if (!studentId) return JSON.stringify({ error: "student_id is required." });

  const [profileRes, activityRes, attemptsRes, flagsRes, downloadsRes] = await Promise.all([
    ctx.supabase
      .from("profiles")
      .select("id, email, full_name, class_name, student_id, created_at, is_active")
      .eq("id", studentId)
      .maybeSingle(),
    ctx.supabase
      .from("activity_logs")
      .select("action, details, created_at")
      .eq("user_id", studentId)
      .order("created_at", { ascending: false })
      .limit(30),
    ctx.supabase
      .from("quiz_attempts")
      .select("quiz_id, score, total, created_at")
      .eq("user_id", studentId)
      .order("created_at", { ascending: false })
      .limit(20),
    ctx.supabase
      .from("misbehavior_flags")
      .select("type, severity, status, created_at")
      .eq("user_id", studentId)
      .order("created_at", { ascending: false })
      .limit(20),
    ctx.supabase
      .from("activity_logs")
      .select("id", { count: "exact", head: true })
      .eq("user_id", studentId)
      .eq("action", "resource_download"),
  ]);

  if (!profileRes.data) return JSON.stringify({ error: "Student not found." });

  return JSON.stringify({
    student: profileRes.data,
    downloads: downloadsRes.count ?? 0,
    recent_activity: activityRes.data ?? [],
    quiz_attempts: attemptsRes.data ?? [],
    flags: flagsRes.data ?? [],
  });
}