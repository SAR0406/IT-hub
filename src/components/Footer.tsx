import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto bg-ink text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-12 sm:px-6 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm">
          <p className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand font-mono text-xs font-bold text-white">
              11
            </span>
            <span className="font-display text-sm font-bold tracking-tight text-white">
              IT Hub <span className="text-brand">11</span>
            </span>
          </p>
          <p className="mt-3 text-sm leading-relaxed text-slate-300">
            Class 11 Information Technology study material — notes, worksheets,
            practicals and question papers, all in one place.
          </p>
        </div>
        <nav className="grid grid-cols-2 gap-x-10 gap-y-2 text-sm" aria-label="Footer">
          <Link href="/chapters" className="font-medium text-slate-300 transition-colors hover:text-blush">
            Chapters
          </Link>
          <Link href="/search" className="font-medium text-slate-300 transition-colors hover:text-blush">
            Search
          </Link>
          <Link href="/about" className="font-medium text-slate-300 transition-colors hover:text-blush">
            About this site
          </Link>
          <Link href="/login" className="font-medium text-slate-300 transition-colors hover:text-blush">
            Sign in
          </Link>
          <Link href="/register" className="font-medium text-slate-300 transition-colors hover:text-blush">
            Sign up
          </Link>
        </nav>
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto flex max-w-6xl items-center gap-2 px-4 py-4 font-mono text-[11px] text-slate-400 sm:px-6">
          <span className="text-blush">~/it-hub-11</span> — built for the classroom
        </p>
      </div>
    </footer>
  );
}