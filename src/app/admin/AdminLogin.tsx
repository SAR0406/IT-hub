"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

/**
 * Admin sign-in, shown by the /admin layout when nobody is signed in.
 * Teachers land straight on the panel; students are redirected away
 * by the layout before this form ever renders.
 */
export function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function track(action: "login_failed" | "login_success", details: Record<string, unknown> = {}) {
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, details }),
      keepalive: true,
    }).catch(() => {});
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    let supabase;
    try {
      supabase = createClient();
    } catch {
      setError(
        "Setup issue: the site is missing the Supabase public keys (NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY) in its environment. Add them in Vercel and redeploy."
      );
      setLoading(false);
      return;
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (signInError) {
      track("login_failed", { email: email.trim().toLowerCase() });
      setError("That email and password don’t match an admin account. Try again.");
      setLoading(false);
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const { data: profileRow } = await supabase
        .from("profiles")
        .select("role, is_active")
        .eq("id", user.id)
        .maybeSingle();
      if (profileRow && !profileRow.is_active) {
        setError("This account isn’t active. Contact the site owner.");
        setLoading(false);
        return;
      }
      if (profileRow && profileRow.role !== "admin") {
        setError("That’s a student account — use the student sign-in instead.");
        setLoading(false);
        return;
      }
    }

    track("login_success");
    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="mx-auto flex min-h-[60vh] w-full max-w-md items-center px-4 py-14 sm:px-6">
      <div className="w-full rounded-2xl bg-white p-8 shadow-soft sm:p-10">
        <p className="font-mono text-sm text-brand">~/it-hub-11/admin</p>
        <h1 className="mt-2 font-display text-2xl font-bold tracking-tight text-ink">
          Admin sign in
        </h1>
        <p className="mt-2 text-sm text-mist">
          Teachers only — this panel manages material, students and activity.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label htmlFor="adminEmail" className="mb-1.5 block text-sm font-semibold text-ink">
              Email
            </label>
            <input
              id="adminEmail"
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="h-11 w-full rounded-lg border border-zinc-300 bg-white px-3.5 text-base text-ink placeholder:text-slate-400 focus:border-brand focus:outline-none"
              placeholder="teacher@ithub11.in"
            />
          </div>
          <div>
            <label htmlFor="adminPassword" className="mb-1.5 block text-sm font-semibold text-ink">
              Password
            </label>
            <input
              id="adminPassword"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="h-11 w-full rounded-lg border border-zinc-300 bg-white px-3.5 text-base text-ink placeholder:text-slate-400 focus:border-brand focus:outline-none"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p role="alert" className="rounded-lg bg-red-50 px-3.5 py-2.5 text-sm text-red-700">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex h-11 w-full items-center justify-center rounded-lg bg-brand text-sm font-semibold text-white transition-colors hover:bg-brand-strong disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign in to admin"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-mist">
          Student?{" "}
          <Link href="/login" className="font-semibold text-brand hover:text-brand-strong">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
}