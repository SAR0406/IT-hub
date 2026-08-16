"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { passwordChecks, validatePassword } from "@/lib/password";

const PASSWORD_RULES = [
  { key: "length" as const, label: "8+ characters" },
  { key: "letter" as const, label: "a letter" },
  { key: "digit" as const, label: "a number" },
];

export function RegisterForm() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [className, setClassName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const clientError = validatePassword(password);
    if (clientError) {
      setError(clientError);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          email,
          password,
          className: className.trim() || null,
        }),
      });
      const data = (await response.json()) as { ok?: boolean; error?: string };

      if (!response.ok || !data.ok) {
        setError(typeof data.error === "string" ? data.error : "Something went wrong. Please try again.");
        setLoading(false);
        return;
      }

      // Account created — sign them straight in so it's truly "sign up and use".
      try {
        const supabase = createClient();
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (!signInError) {
          router.push("/chapters");
          router.refresh();
          return;
        }
      } catch {
        // Auth service unreachable (e.g. env not configured yet) — fall through.
      }
      setDone(true);
    } catch {
      setError("Could not reach the server. Please try again.");
    }
    setLoading(false);
  }

  if (done) {
    return (
      <div className="mx-auto flex w-full max-w-xl px-4 py-10 sm:px-6 sm:py-16">
        <div className="w-full rounded-2xl bg-white p-8 text-center shadow-soft sm:p-10">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-mint/40">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden className="h-6 w-6 text-ink">
              <path
                d="m4 12.5 5 5 11-11"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <h1 className="mt-5 font-display text-2xl font-bold tracking-tight text-ink">
            Account created
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-mist">
            You&rsquo;re all set. We couldn&rsquo;t sign you in automatically, so
            just sign in with your new details to start studying.
          </p>
          <Link
            href="/login"
            className="mt-7 inline-flex h-11 items-center justify-center rounded-lg bg-brand px-7 text-sm font-semibold text-white transition-colors hover:bg-brand-strong"
          >
            Sign in now
          </Link>
        </div>
      </div>
    );
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
              ~/it-hub-11/register
            </p>
            <h1 className="mt-10 font-display text-3xl font-bold leading-tight tracking-tight">
              Your study hub, your account.
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-slate-400">
              Create your account in under a minute — no approvals, no waiting.
              You&rsquo;re in the moment you hit the button.
            </p>
          </div>
          <div className="font-mono text-[13px] leading-7 text-slate-500">
            <p><span className="text-emerald-400">$</span> it-hub --signup</p>
            <p className="pl-4 text-emerald-400">account created — signing you in…</p>
            <p className="mt-3"><span className="text-emerald-400">$</span> cd chapters/rdbms</p>
            <p className="pl-4 text-slate-400">6 resources available</p>
          </div>
        </div>

        {/* Form */}
        <div className="p-8 sm:p-10">
          <div className="md:hidden">
            <p className="font-mono text-sm text-brand">~/it-hub-11/register</p>
            <h1 className="mt-2 font-display text-2xl font-bold tracking-tight text-ink">
              Sign up
            </h1>
          </div>
          <h2 className="hidden font-display text-2xl font-bold tracking-tight text-ink md:block">
            Sign up
          </h2>
          <p className="mt-2 text-sm text-mist">
            Create your account — it takes under a minute.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label htmlFor="fullName" className="mb-1.5 block text-sm font-semibold text-ink">
                Full name
              </label>
              <input
                id="fullName"
                type="text"
                autoComplete="name"
                required
                maxLength={80}
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                className="h-11 w-full rounded-lg border border-zinc-300 bg-white px-3.5 text-base text-ink placeholder:text-slate-400 focus:border-brand focus:outline-none"
                placeholder="e.g. Ananya Sharma"
              />
            </div>
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-ink">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="username"
                required
                maxLength={200}
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="h-11 w-full rounded-lg border border-zinc-300 bg-white px-3.5 text-base text-ink placeholder:text-slate-400 focus:border-brand focus:outline-none"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label htmlFor="className" className="mb-1.5 block text-sm font-semibold text-ink">
                Class <span className="font-normal text-mist">(optional)</span>
              </label>
              <input
                id="className"
                type="text"
                autoComplete="off"
                maxLength={40}
                value={className}
                onChange={(event) => setClassName(event.target.value)}
                className="h-11 w-full rounded-lg border border-zinc-300 bg-white px-3.5 text-base text-ink placeholder:text-slate-400 focus:border-brand focus:outline-none"
                placeholder="e.g. 11 A"
              />
            </div>
            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-semibold text-ink">
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                required
                maxLength={128}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="h-11 w-full rounded-lg border border-zinc-300 bg-white px-3.5 text-base text-ink placeholder:text-slate-400 focus:border-brand focus:outline-none"
                placeholder="At least 8 characters"
                aria-describedby="password-rules"
              />
              <ul
                id="password-rules"
                className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1"
                aria-live="polite"
              >
                {PASSWORD_RULES.map((rule) => {
                  const ok = passwordChecks(password)[rule.key];
                  const active = password.length > 0;
                  return (
                    <li
                      key={rule.key}
                      className={`flex items-center gap-1.5 font-mono text-[11px] transition-colors ${
                        active && ok ? "text-emerald-700" : active ? "text-mist" : "text-slate-400"
                      }`}
                    >
                      <span
                        className={`flex h-3.5 w-3.5 items-center justify-center rounded-full border-[1.5px] text-[9px] font-bold ${
                          active && ok
                            ? "border-emerald bg-emerald text-white"
                            : "border-slate-300 text-transparent"
                        }`}
                        aria-hidden
                      >
                        ✓
                      </span>
                      {rule.label}
                    </li>
                  );
                })}
              </ul>
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
              {loading ? "Creating your account…" : "Create account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-mist">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-brand hover:text-brand-strong">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}