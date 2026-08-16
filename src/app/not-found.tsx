import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center px-4 py-24 text-center sm:px-6">
      <p className="font-mono text-sm text-brand">~/it-hub-11 — 404</p>
      <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-ink">
        Page not found
      </h1>
      <p className="mt-3 max-w-md font-mono text-sm text-slate-500">
        &gt; ls: cannot access this path: no such file or directory
      </p>
      <p className="mt-3 max-w-md text-slate-500">
        This page does not exist. It may have been moved or the link may be wrong.
      </p>
      <Link
        href="/"
        className="mt-8 flex h-11 items-center justify-center rounded-xl bg-brand px-6 text-sm font-semibold text-white transition-colors hover:bg-brand-strong"
      >
        Back to home
      </Link>
    </div>
  );
}