import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "What IT Hub 11 is, who it is for and how to use it.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <p className="font-mono text-xs text-brand">~/it-hub-11/about</p>
      <h1 className="mt-1 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
        About
      </h1>
      <p className="mt-3 text-base text-slate-500">
        One hub for Class 11 Information Technology — built for students, run by the teacher.
      </p>

      <div className="mt-10 space-y-4">
        <section className="rounded-2xl border border-zinc-200 bg-white p-6">
          <h2 className="font-mono text-xs font-bold uppercase tracking-widest text-slate-400">
            01 — What it is
          </h2>
          <p className="mt-3 leading-relaxed text-slate-600">
            IT Hub 11 is a single, reliable place for Class 11 students to find and download
            their Information Technology study material — notes, worksheets, question papers
            and practical files — organised exactly like the CBSE syllabus.
          </p>
        </section>

        <section className="rounded-2xl border border-zinc-200 bg-white p-6">
          <h2 className="font-mono text-xs font-bold uppercase tracking-widest text-slate-400">
            02 — Who it is for
          </h2>
          <p className="mt-3 leading-relaxed text-slate-600">
            Students who want their material on their phone without hunting through shared
            folders, and the teacher who uploads the material once and never has to resend it.
          </p>
        </section>

        <section className="rounded-2xl border border-zinc-200 bg-white p-6">
          <h2 className="font-mono text-xs font-bold uppercase tracking-widest text-slate-400">
            03 — How to use it
          </h2>
          <ol className="mt-3 list-decimal space-y-1 pl-5 text-slate-600">
            <li>
              Sign in with the account your teacher created for you.
            </li>
            <li>
              Pick a unit from <strong>Chapters</strong> — open a topic or go straight to the
              unit's resources.
            </li>
            <li>
              <strong>Open</strong> a file to view it, or <strong>Download</strong> to save it.
            </li>
            <li>
              Use <strong>Search</strong> to jump straight to a topic or keyword.
            </li>
          </ol>
        </section>

        <section className="rounded-2xl border border-zinc-200 bg-white p-6">
          <h2 className="font-mono text-xs font-bold uppercase tracking-widest text-slate-400">
            04 — For teachers
          </h2>
          <p className="mt-3 leading-relaxed text-slate-600">
            The admin panel gives the teacher the full picture: upload and remove material,
            create student accounts, and review a live activity log — every download, search
            and sign-in is recorded, with flags raised automatically for suspicious patterns
            like banned search terms or rapid download bursts.
          </p>
        </section>

        <section className="rounded-2xl border border-zinc-200 bg-white p-6">
          <h2 className="font-mono text-xs font-bold uppercase tracking-widest text-slate-400">
            05 — Roadmap
          </h2>
          <p className="mt-3 leading-relaxed text-slate-600">
            Later versions will add an AI tutor grounded in the uploaded notes, full-text PDF
            search, browser-based SQL and Java practice, and progress tools for teachers.
          </p>
          <p className="mt-3 text-sm text-slate-500">
            Need an account or found a broken file?{" "}
            <Link href="/login" className="font-semibold text-brand hover:text-brand-strong">
              Ask your teacher
            </Link>
            .
          </p>
        </section>
      </div>
    </div>
  );
}