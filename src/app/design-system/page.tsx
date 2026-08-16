import type { Metadata } from "next";
import { ChapterCard } from "@/components/ds/ChapterCard";
import { ChapterTabs } from "@/components/ds/ChapterTabs";
import { FeedbackState, SkeletonBlock } from "@/components/ds/FeedbackState";
import { ProgressPanel } from "@/components/ds/ProgressPanel";
import { SqlPlayground } from "@/components/ds/SqlPlayground";
import "./premium.css";

export const metadata: Metadata = {
  title: "Design System Preview | IT Hub 11",
};

function SectionTitle({
  index,
  title,
  note,
}: {
  index: string;
  title: string;
  note: string;
}) {
  return (
    <div className="mb-5 flex items-baseline gap-3">
      <span className="font-mono text-xs text-pm-teal">{index}</span>
      <h2 className="text-xl font-semibold text-pm-ink">{title}</h2>
      <span className="hidden text-xs text-pm-mute sm:inline">— {note}</span>
    </div>
  );
}

export default function DesignSystemPreview() {
  return (
    <main className="bg-pm-surface text-pm-ink font-sans">
      <div className="mx-auto max-w-4xl px-5 py-14 md:py-20">
        <header className="border-b border-pm-line pb-8">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-pm-mute">
            IT HUB 11 / PREMIUM DESIGN SYSTEM / SPEC §1—10
          </p>
          <h1 className="mt-3 text-3xl font-bold leading-tight md:text-4xl">
            Five core components,
            <br />
            <span className="text-pm-teal">pixel-checked before features.</span>
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-pm-text2">
            Notion clarity + Linear precision + Figma restraint. Warm surface,
            near-black ink, teal accent (60-30-10). AA-corrected: secondary
            text is #52525B, not the spec&apos;s #64748B (4.2:1 fails AA).
          </p>
        </header>

        {/* 01 — Chapter Card */}
        <section className="mt-14">
          <SectionTitle
            index="01"
            title="Chapter Card"
            note="papery double shadow, micro-border, hover lift"
          />
          <div className="grid gap-6 md:grid-cols-2">
            <ChapterCard
              chapterNumber="CHAPTER 04 / PART B"
              title="SQL Basics"
              description="Learn CRUD operations, WHERE clauses, and data filtering."
              progress={60}
              updatedLabel="Updated 2 days ago"
              footer={
                <button
                  type="button"
                  className="rounded-md border border-pm-line bg-pm-surface-elevated px-4 py-2 text-sm font-medium text-pm-ink transition-colors duration-200 hover:border-pm-teal hover:text-pm-teal"
                >
                  Continue Learning
                </button>
              }
            />
            <ChapterCard
              chapterNumber="CHAPTER 05 / PART B"
              title="Database Keys"
              description="Primary, foreign, candidate and composite keys — and when each one matters."
              progress={32}
              updatedLabel="Updated today"
              footer={
                <button
                  type="button"
                  className="rounded-md bg-gradient-to-br from-pm-teal to-pm-teal2 px-4 py-2 text-sm font-medium text-white shadow-[0_4px_12px_rgba(8,145,178,0.2)] transition-all duration-200 ease-out hover:-translate-y-px hover:shadow-[0_8px_24px_rgba(8,145,178,0.3)] active:translate-y-0"
                >
                  Start Chapter
                </button>
              }
            />
          </div>
          <p className="ds-microlabel mt-6 font-mono text-xs text-pm-mute">
            Loading state — shimmer skeleton
          </p>
          <div className="mt-3 max-w-md rounded-xl border border-pm-hover bg-pm-surface-elevated p-6">
            <SkeletonBlock lines={4} />
          </div>
        </section>

        {/* 02 — Chapter Tabs */}
        <section className="mt-16">
          <SectionTitle
            index="02"
            title="Learn / Practice / Quiz"
            note="underline indicator, not a top border"
          />
          <ChapterTabs
            tabs={[
              {
                id: "learn",
                label: "Learn",
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                  </svg>
                ),
                content: (
                  <div className="rounded-lg border border-pm-hover bg-pm-surface-elevated p-5">
                    <h3 className="font-semibold">What is a primary key?</h3>
                    <p className="mt-2 text-sm leading-relaxed text-pm-text2">
                      A primary key uniquely identifies each row in a table. No
                      two rows share it, and it can never be empty. In the
                      STUDENTS table, ROLL_NO is the primary key — every
                      student has exactly one roll number.
                    </p>
                    <pre className="mt-4 overflow-x-auto rounded-md bg-pm-surface-dark p-4 font-mono text-sm text-pm-line">
                      <code>{`SELECT * FROM students WHERE roll_no = 1;`}</code>
                    </pre>
                  </div>
                ),
              },
              {
                id: "practice",
                label: "Practice",
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="3" width="20" height="14" rx="2" />
                    <path d="M8 21h8M12 17v4" />
                  </svg>
                ),
                content: (
                  <div className="rounded-lg border border-pm-hover bg-pm-surface-elevated p-5">
                    <h3 className="font-semibold">Identify the key</h3>
                    <p className="mt-2 text-sm leading-relaxed text-pm-text2">
                      The ADMISSIONS table has columns: ADM_NO, NAME, EMAIL,
                      CLASS. Which column makes the best primary key?
                    </p>
                    <div className="mt-4 space-y-2 text-sm">
                      {["NAME", "EMAIL", "ADM_NO", "CLASS"].map((option) => (
                        <label
                          key={option}
                          className="flex cursor-pointer items-center gap-3 rounded-md border border-pm-line px-3 py-2.5 transition-colors hover:border-pm-teal"
                        >
                          <input type="radio" name="key-option" className="accent-pm-teal" />
                          <span className="font-mono text-xs">{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ),
              },
              {
                id: "quiz",
                label: "Quiz",
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <path d="M9 9h6M9 13h6M9 17h3" />
                  </svg>
                ),
                content: (
                  <div className="rounded-lg border border-pm-hover bg-pm-surface-elevated p-5">
                    <h3 className="font-semibold">Quick check — 5 questions</h3>
                    <p className="mt-2 text-sm leading-relaxed text-pm-text2">
                      Feedback appears only after you submit — no mid-quiz
                      cues. Questions cover keys, normalization and SQL
                      basics.
                    </p>
                    <p className="mt-4 text-xs text-pm-mute">
                      Quiz mode is a single question per screen, timer optional
                      in exam mode (§7).
                    </p>
                  </div>
                ),
              },
            ]}
          />
        </section>

        {/* 03 — Progress */}
        <section className="mt-16">
          <SectionTitle
            index="03"
            title="Progress"
            note="gradient fill, per-unit breakdown, no gamification"
          />
          <div className="max-w-md">
            <ProgressPanel
              overall={76}
              items={[
                { label: "Computer Organization", percent: 92, detail: "2 topics left" },
                { label: "Networking & Internet", percent: 71, detail: "Review: protocols" },
                { label: "RDBMS", percent: 58, detail: "SQL practice pending" },
                { label: "Fundamentals of Java", percent: 34, detail: "Started last week" },
              ]}
            />
          </div>
        </section>

        {/* 04 — SQL Playground */}
        <section className="mt-16">
          <SectionTitle
            index="04"
            title="SQL Playground"
            note="dark editor, teal CTA, input + results side-by-side in production"
          />
          <SqlPlayground />
        </section>

        {/* 05 — Feedback */}
        <section className="mt-16">
          <SectionTitle
            index="05"
            title="Feedback States"
            note="left accent bar, slide-in on success"
          />
          <div className="space-y-3">
            <FeedbackState kind="success" title="Correct — 2 marks">
              WHERE marks &gt; 80 returned 3 rows. Your query is valid and
              uses an index-friendly comparison.
            </FeedbackState>
            <FeedbackState kind="error" title="Syntax error near line 3">
              You wrote{" "}
              <code className="rounded bg-pm-error/10 px-1 font-mono text-xs text-pm-error">
                SELECT name FROM
              </code>{" "}
              — the table name is missing. Tip: after FROM, name the table.
            </FeedbackState>
            <FeedbackState kind="warning" title="Almost — 1 of 2 marks">
              The query works, but ORDER BY is missing. Add it to sort results
              deterministically.
            </FeedbackState>
            <FeedbackState kind="info" title="Exam note">
              Primary keys are auto-indexed in MySQL. You do not need a
              separate CREATE INDEX for them.
            </FeedbackState>
          </div>
        </section>

        <footer className="mt-20 border-t border-pm-line pt-6 font-mono text-xs text-pm-mute">
          <p>
            IT HUB 11 / DESIGN SYSTEM PREVIEW — Inter + Geist Mono (Fira Code
            / JetBrains Mono swap-in at adoption) · 8px grid · WCAG 2.1 AA
          </p>
          <p className="mt-2 text-pm-text2">
            Direction conflict with /concepts is unresolved: this surface is
            the premium system; the concepts are the living-textbook system.
          </p>
        </footer>
      </div>
    </main>
  );
}