import type { Metadata } from "next";
import { UNITS } from "@/lib/syllabus";
import "./technical-scrapbook.css";

export const metadata: Metadata = {
  title: "Concept C — Technical Scrapbook | IT—11",
};

const PLATE_ACCENT: Record<string, string> = {
  "employability-skills": "bg-moss",
  "computer-organization": "bg-violet",
  "networking-internet": "bg-cyan",
  "office-automation-tools": "bg-coral",
  rdbms: "bg-moss",
  "fundamentals-of-java": "bg-yellow",
};

// Tiny per-unit circuit diagrams: node co-ordinates on a 0..100 grid.
const PLATE_CIRCUIT: Record<string, string> = {
  "employability-skills": "M10 50 H55 V20 H90",
  "computer-organization": "M10 20 H60 V80 H90",
  "networking-internet": "M10 30 H45 V50 H90 M45 50 V80 H75",
  "office-automation-tools": "M10 70 H70 V25 H90",
  rdbms: "M10 45 H35 V45 H90 M35 45 V25 H65 M35 45 V65 H65",
  "fundamentals-of-java": "M10 50 H40 V30 H90 M40 50 V70 H90",
};

// The same circuits, as explicit node lists for the endpoint dots.
const PLATE_NODES: Record<string, [number, number][]> = {
  "employability-skills": [
    [10, 50],
    [55, 50],
    [55, 20],
    [90, 20],
  ],
  "computer-organization": [
    [10, 20],
    [60, 20],
    [60, 80],
    [90, 80],
  ],
  "networking-internet": [
    [10, 30],
    [45, 30],
    [45, 50],
    [90, 50],
    [45, 80],
    [75, 80],
  ],
  "office-automation-tools": [
    [10, 70],
    [70, 70],
    [70, 25],
    [90, 25],
  ],
  rdbms: [
    [10, 45],
    [35, 45],
    [90, 45],
    [35, 25],
    [65, 25],
    [35, 65],
    [65, 65],
  ],
  "fundamentals-of-java": [
    [10, 50],
    [40, 50],
    [90, 50],
    [40, 30],
    [90, 30],
    [40, 70],
    [90, 70],
  ],
};

export default function TechnicalScrapbookConcept() {
  return (
    <main className="tsb bg-paper text-ink min-h-screen font-dsans">
      <div className="tsb-grid absolute inset-0" aria-hidden />

      {/* crop marks — this page is a printed sheet */}
      <span className="tsb-crop tsb-crop-tl" aria-hidden />
      <span className="tsb-crop tsb-crop-tr" aria-hidden />
      <span className="tsb-crop tsb-crop-bl" aria-hidden />
      <span className="tsb-crop tsb-crop-br" aria-hidden />

      {/* header plate */}
      <header className="relative mx-auto max-w-6xl px-5 pt-8 md:pt-12">
        <div className="flex flex-wrap items-start justify-between gap-6 border-2 border-ink bg-paper p-5 shadow-[8px_8px_0_rgba(23,21,18,0.12)] md:p-7">
          <div>
            <p className="font-dmono text-[10px] tracking-[0.3em] uppercase text-ink/50">
              SHEET 001 / CLASS XI / CBSE / CODE 402
            </p>
            <h1 className="mt-3 font-dserif text-[clamp(2.6rem,7vw,5rem)] leading-[0.95]">
              FIELD NOTES:
              <br />
              <em className="tsb-em">Information Technology</em>
            </h1>
            <div className="mt-5 flex flex-wrap items-center gap-4">
              <a
                href="/chapters"
                className="border-2 border-ink bg-ink px-5 py-2.5 font-dmono text-[12px] tracking-[0.22em] uppercase text-paper transition-colors hover:bg-transparent hover:text-ink"
              >
                ENTER ARCHIVE →
              </a>
              <a
                href="/login"
                className="font-dmono text-[12px] tracking-[0.22em] uppercase underline decoration-dotted underline-offset-4"
              >
                LOGIN
              </a>
              <span className="font-dmono text-[10px] tracking-[0.18em] uppercase text-ink/50">
                FIG. 00 — SIX UNITS
              </span>
            </div>
          </div>

          <div className="tsb-stamp tsb-stamp-draft">DRAFT v0.1</div>
          <div className="tsb-stamp tsb-stamp-appr hidden sm:block">APPROVED</div>
        </div>
        <div className="tsb-tape absolute -top-2 left-16" aria-hidden />
      </header>

      {/* cut line */}
      <div className="relative mx-auto max-w-6xl px-5 pt-10">
        <div className="tsb-cut font-dmono text-[10px] tracking-[0.25em] uppercase text-ink/40">
          ▸▸▸ CUT HERE
        </div>
      </div>

      {/* unit plates — each subject is a spec sheet */}
      <section className="relative mx-auto max-w-6xl px-5 py-6">
        <div className="space-y-6">
          {UNITS.map((unit, i) => (
            <a
              key={unit.slug}
              href="/chapters"
              className={`tsb-plate group block border-2 border-ink bg-paper transition-transform duration-150 hover:-translate-y-0.5 ${
                i % 2 === 1 ? "md:ml-[7%]" : "md:mr-[7%]"
              }`}
            >
              <div
                className={`flex items-center justify-between border-b-2 border-ink px-4 py-1.5 font-dmono text-[10px] tracking-[0.24em] uppercase ${PLATE_ACCENT[unit.slug]}`}
              >
                <span>UNIT {String(i + 1).padStart(2, "0")}</span>
                <span>PART {unit.part}</span>
                <span className="hidden sm:inline">{unit.slug}</span>
                <span>
                  {unit.topics.length} TOPIC{unit.topics.length === 1 ? "" : "S"}
                </span>
              </div>

              <div className="flex items-center gap-5 p-5 md:gap-8 md:p-6">
                <div className="min-w-0">
                  <h2 className="font-dserif text-2xl leading-tight md:text-3xl">
                    {unit.name}
                  </h2>
                  <p className="mt-1.5 max-w-lg text-[13px] leading-relaxed text-ink/65">
                    {unit.description}
                  </p>
                  <p className="mt-4 font-dmono text-[10px] tracking-[0.2em] uppercase text-ink/40 transition-colors group-hover:text-ink">
                    OPEN PLATE →
                  </p>
                </div>

                {/* per-unit circuit diagram */}
                <svg
                  viewBox="0 0 100 100"
                  className="tsb-circuit ml-auto h-20 w-20 shrink-0 md:h-28 md:w-28"
                  aria-hidden
                >
                  <path
                    d={PLATE_CIRCUIT[unit.slug]}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  {PLATE_NODES[unit.slug].map(([x, y], n) => (
                    <circle
                      key={n}
                      cx={x}
                      cy={y}
                      r="3.5"
                      fill="#f1ebdd"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  ))}
                </svg>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* cut line */}
      <div className="relative mx-auto max-w-6xl px-5 pt-4">
        <div className="tsb-cut font-dmono text-[10px] tracking-[0.25em] uppercase text-ink/40">
          ▸▸▸ CUT HERE
        </div>
      </div>

      {/* notes strip */}
      <section className="relative mx-auto max-w-6xl px-5 py-6">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="tsb-noteplate border-2 border-ink bg-paper-deep p-4">
            <p className="font-dmono text-[10px] tracking-[0.25em] uppercase text-ink/50">
              NOTE 07
            </p>
            <p className="mt-2 text-[13px] leading-relaxed">
              Every plate links to the live archive. Real resource counts and
              topic trees replace the spec text in production.
            </p>
          </div>
          <div className="tsb-noteplate border-2 border-ink bg-paper-deep p-4">
            <p className="font-dmono text-[10px] tracking-[0.25em] uppercase text-ink/50">
              NOTE 12
            </p>
            <p className="mt-2 text-[13px] leading-relaxed">
              Section pages inherit their unit&apos;s accent color — the
              scrapbook continues inside each chapter.
            </p>
          </div>
          <div className="border-2 border-dashed border-ink/60 p-4">
            <p className="font-dmono text-[10px] tracking-[0.25em] uppercase text-ink/50">
              RESERVED
            </p>
            <p className="mt-2 text-[13px] leading-relaxed text-ink/70">
              Space for the practice terminal (RDBMS) and the code notebook
              (Java) — dark pages glued in later.
            </p>
          </div>
        </div>
      </section>

      <footer className="relative mx-auto max-w-6xl px-5 pb-8">
        <div className="flex flex-col gap-2 border-t-2 border-ink pt-4 font-dmono text-[10px] tracking-[0.22em] uppercase text-ink/50 md:flex-row md:justify-between">
          <span>IT—11 / CONCEPT C / TECHNICAL SCRAPBOOK</span>
          <span>SCANNED / 08.16.26 · DO NOT BEND</span>
        </div>
      </footer>
    </main>
  );
}