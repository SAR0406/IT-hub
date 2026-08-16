import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "What IT Hub 11 is, who it is for and how to use it.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900">About</h1>

      <div className="mt-8 space-y-8">
        <section>
          <h2 className="text-lg font-bold text-zinc-900">What is IT Hub 11?</h2>
          <p className="mt-2 leading-relaxed text-zinc-600">
            IT Hub 11 is a single, reliable place for Class 11 students to find and download
            their Information Technology study material — notes, worksheets, question papers
            and practical files — organised exactly like the CBSE syllabus.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-zinc-900">Who is it for?</h2>
          <p className="mt-2 leading-relaxed text-zinc-600">
            Students who want their material on their phone without hunting through shared
            folders, and the teacher who uploads the material once and never has to resend it.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-zinc-900">How to use it</h2>
          <ol className="mt-2 list-decimal space-y-1 pl-5 text-zinc-600">
            <li>Open the site and pick a unit from <strong>Chapters</strong>.</li>
            <li>Open a topic (Part A) or go straight to the unit’s resources.</li>
            <li><strong>Open</strong> a file to view it, or <strong>Download</strong> to save it.</li>
            <li>Use <strong>Search</strong> to jump straight to a topic or keyword.</li>
          </ol>
        </section>

        <section>
          <h2 className="text-lg font-bold text-zinc-900">What’s on the roadmap</h2>
          <p className="mt-2 leading-relaxed text-zinc-600">
            This is version 1 — it deliberately does one thing: getting study material to
            students reliably. Later versions will add an AI tutor grounded in the uploaded
            notes, full-text PDF search, browser-based SQL and Java practice, and progress
            tools for teachers.
          </p>
        </section>
      </div>
    </div>
  );
}