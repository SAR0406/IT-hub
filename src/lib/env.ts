/**
 * Centralized env validation — validates once at import time.
 * Keeps `src/lib/supabase/server.ts` throw and `src/lib/supabase/middleware.ts` silent-skip consistent.
 */

function requireEnv(name: string, value: string | undefined, opts: { public?: boolean } = {}): string {
  if (!value || value.trim() === "") {
    const hint = opts.public
      ? `${name} must be set (Vercel → Environment Variables or .env.local).`
      : `${name} is missing — check Vercel → Environment Variables / .env.local (server-only, never commit).`;
    throw new Error(hint);
  }
  return value;
}

function optionalEnv(name: string, value: string | undefined): string | undefined {
  return value && value.trim() !== "" ? value : undefined;
}

export const env = {
  NEXT_PUBLIC_SUPABASE_URL: optionalEnv(
    "NEXT_PUBLIC_SUPABASE_URL",
    process.env.NEXT_PUBLIC_SUPABASE_URL
  ),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: optionalEnv(
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ),
  SUPABASE_SERVICE_ROLE_KEY: optionalEnv(
    "SUPABASE_SERVICE_ROLE_KEY",
    process.env.SUPABASE_SERVICE_ROLE_KEY
  ),
  NVIDIA_API_KEY: optionalEnv("NVIDIA_API_KEY", process.env.NVIDIA_API_KEY),
  NVIDIA_BASE_URL: optionalEnv("NVIDIA_BASE_URL", process.env.NVIDIA_BASE_URL),
  TAVILY_API_KEY: optionalEnv("TAVILY_API_KEY", process.env.TAVILY_API_KEY),
} as const;

/** Call in server contexts that cannot run without Supabase. */
export function requireSupabaseEnv(): {
  url: string;
  anonKey: string;
} {
  return {
    url: requireEnv("NEXT_PUBLIC_SUPABASE_URL", env.NEXT_PUBLIC_SUPABASE_URL, { public: true }),
    anonKey: requireEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
      public: true,
    }),
  };
}

export function hasServiceRole(): boolean {
  return Boolean(env.NEXT_PUBLIC_SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY);
}

export function hasAi(): boolean {
  return Boolean(env.NVIDIA_API_KEY);
}

export function hasWebsearch(): boolean {
  return Boolean(env.TAVILY_API_KEY);
}
