import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-zinc-200 bg-white">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-2 px-4 py-8 text-center sm:flex-row sm:justify-between sm:px-6 sm:text-left">
        <p className="text-sm text-zinc-500">
          IT Hub 11 — Class 11 Information Technology study material.
        </p>
        <nav aria-label="Footer">
          <Link href="/about" className="text-sm font-medium text-zinc-600 hover:text-accent">
            About this site
          </Link>
        </nav>
      </div>
    </footer>
  );
}