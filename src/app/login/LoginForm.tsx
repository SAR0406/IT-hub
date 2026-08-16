"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function LoginForm() {
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

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (signInError) {
      track("login_failed", { email: email.trim().toLowerCase() });
      setError("That email and password don’t match any account. Check for typos and try again.");
      setLoading(false);
      return;
    }

    // Accounts awaiting teacher approval can authenticate but not sign in.
    // Tell the student why instead of silently bouncing them back here.
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
        setError("Your account is waiting for your teacher to activate it. Try again once it’s approved.");
        setLoading(false);
        return;
      }
    }

    track("login_success");

    // Route by role: admins land on the panel, students on the content.
    try {
      const response = await fetch("/api/me");
      const { profile } = (await response.json()) as {
        profile: { role: string } | null;
      };
      router.push(profile?.role === "admin" ? "/admin" : "/chapters");
    } catch {
      router.push("/chapters");
    }
    router.refresh();
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl px-4 py-10 sm:px-6 sm:py-16">
      <div className="grid w-full overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm md:grid-cols-2">
        {/* Brand panel */}
        <div className="grid-bg relative hidden flex-col justify-between bg-ink p-10 text-white md:flex">
          <div>
            <p className="flex items-center gap-2 font-mono text-sm text-blush">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10 font-bold">
                11
              </span>
              ~/it-hub-11/auth
            </p>
            <h1 className="mt-10 font-display text-3xl font-bold leading-tight tracking-tight">
              Your study material is behind this door.
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-slate-400">
              Sign in with the account your teacher created for you. Every download and
              search is private to your teacher — this keeps the hub accountable and
              organized.
            </p>
          </div>
          <div className="font-mono text-[13px] leading-7 text-slate-500">
            <p><span className="text-emerald-400">$</span> it-hub --whoami</p>
            <p className="pl-4 text-slate-400">student · class 11</p>
            <p className="mt-3"><span className="text-emerald-400">$</span> cd chapters/rdbms</p>
            <p className="pl-4 text-slate-400">6 resources available</p>
          </div>
        </div>

        {/* Form */}
        <div className="p-8 sm:p-10">
          <div className="md:hidden">
            <p className="font-mono text-sm text-brand">~/it-hub-11/auth</p>
            <h1 className="mt-2 font-display text-2xl font-bold tracking-tight text-ink">
              Sign in to IT Hub 11
            </h1>
          </div>
          <h2 className="hidden font-display text-2xl font-bold tracking-tight text-ink md:block">
            Sign in
          </h2>
          <p className="mt-2 text-sm text-mist">
            Accounts are created by your teacher — or request one below and wait for
            approval.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-ink">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="username"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="h-11 w-full rounded-lg border border-zinc-300 bg-white px-3.5 text-base text-ink placeholder:text-slate-400 focus:border-brand focus:outline-none"
                placeholder="you@ithub11.in"
              />
            </div>
            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-semibold text-ink">
                Password
              </label>
              <input
                id="password"
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
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-mist">
            Need an account?{" "}
            <Link href="/register" className="font-semibold text-brand hover:text-brand-strong">
              Request access
            </Link>
          </p>

          <p className="mt-6 border-t border-zinc-100 pt-5 font-mono text-xs leading-6 text-slate-400">
            <span className="text-slate-500">$</span> who can access the admin panel?{" "}
            <span className="text-slate-300">teacher only</span>
          </p>
        </div>
      </div>
    </div>
  );
}