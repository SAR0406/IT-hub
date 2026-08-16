import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center px-4 py-24 text-center sm:px-6">
      <p className="text-sm font-bold uppercase tracking-widest text-accent">404</p>
      <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-zinc-900">
        Page not found
      </h1>
      <p className="mt-3 max-w-md text-zinc-500">
        This page does not exist. It may have been moved or the link may be wrong.
      </p>
      <Link
        href="/"
        className="mt-8 flex h-11 items-center justify-center rounded-xl bg-accent px-6 text-sm font-semibold text-accent-foreground transition-colors hover:bg-indigo-700"
      >
        Back to home
      </Link>
    </div>
  );
}