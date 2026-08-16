import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";
import { AI_BOT_ID } from "@/lib/chat";

export { AI_BOT_ID };

export type AiSettings = {
  ai_enabled: boolean;
  ai_model: string;
  ai_daily_cap: number;
};

const DEFAULTS: AiSettings = {
  ai_enabled: true,
  ai_model: "openai/gpt-oss-120b",
  ai_daily_cap: 30,
};

export async function getAiSettings(
  supabase: SupabaseClient<Database>
): Promise<AiSettings> {
  const { data } = await supabase
    .from("app_settings")
    .select("ai_enabled, ai_model, ai_daily_cap")
    .eq("id", 1)
    .maybeSingle();
  if (!data) return DEFAULTS;
  return {
    ai_enabled: data.ai_enabled,
    ai_model: data.ai_model,
    ai_daily_cap: data.ai_daily_cap,
  };
}

export async function countAiUsageToday(
  supabase: SupabaseClient<Database>,
  userId: string,
  action: "chat" | "quiz_gen"
): Promise<number> {
  const startOfDay = new Date();
  startOfDay.setUTCHours(0, 0, 0, 0);
  const { count } = await supabase
    .from("ai_usage")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("action", action)
    .gte("created_at", startOfDay.toISOString());
  return count ?? 0;
}

export async function logAiUsage(
  supabase: SupabaseClient<Database>,
  userId: string,
  action: "chat" | "quiz_gen",
  model: string,
  promptTokens: number,
  completionTokens: number
): Promise<void> {
  await supabase.from("ai_usage").insert({
    user_id: userId,
    action,
    model,
    prompt_tokens: promptTokens,
    completion_tokens: completionTokens,
  });
}