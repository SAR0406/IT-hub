import type { Metadata } from "next";
import { UNITS } from "@/lib/syllabus";
import "./living-textbook.css";

export const metadata: Metadata = {
  title: "Concept A — Living Textbook | IT—11",
};

type World = {
  accent: string; // static Tailwind bg-* utility (scanned from this file)
  note: string;
  caption: string;
};

// Every subject gets its own color world (§2). The palette is reused, but
// each page only ever shows one accent at a time (60/25/10/5, §19).
const WORLDS: Record<string, World> = {
  "employability-skills": {
    accent: "bg-moss",
    note: "START HERE",
    caption: "FIVE SKILL SETS / ONE PLACE",
  },
  "computer-organization": {
    accent: "bg-violet",
    note: "FIG. 02 — VON NEUMANN",
    caption: "HARDWARE / MEMORY / SOFTWARE",
  },
  "networking-internet": {
    accent: "bg-cyan",
    note: "← YOU ARE HERE",
    caption: "NODES / PACKETS / SAFETY",
  },
  "office-automation-tools": {
    accent: "bg-coral",
    note: "OFFICE HOURS",
    caption: "DOCS / SHEETS / SLIDES",
  },
  rdbms: {
    accent: "bg-moss",
    note: "DO NOT SKIP THIS",
    caption: "TABLES / KEYS / SQL",
  },
  "fundamentals-of-java": {
    accent: "bg-yellow",
    note: "THE GOOD PART",
    caption: "SYNTAX / LOGIC / OBJECTS",
  },
};

export default function LivingTextbookConcept() {
  return (
    <main className="ltb bg-paper text-ink min-h-screen font-dsans">
      {/* masthead */}
      <header className="ltb-mast border-b-2 border-ink">
        <div className="mx-auto flex max-w-6xl items-baseline justify-between px-5 py-3 font-dmono text-[11px] tracking-[0.18em] uppercase">
          <span>
            IT—11 <span className="text-ink/40">/ THE LIVING TEXTBOOK</span>
          </span>
          <span className="hidden sm:inline">CLASS XI · CBSE · CODE 402 · 2026—27</span>
        </div>
      </header>

      {/* hero — editorial statement, not a logo */}
      <section className="ltb-hero relative overflow-hidden border-b-2 border-ink">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-[1.6fr_1fr] md:py-24">
          <div>
            <p className="font-dmono text-[11px] tracking-[0.25em] uppercase text-ink/60">
              Class XI / Information Technology
            </p>
            <h1 className="ltb-title mt-6 font-dserif text-[clamp(2.6rem,7vw,5.4rem)] leading-[0.98] font-normal">
              YOUR IT
              <br />
              TEXTBOOK
              <br />
              DOESN&apos;T NEED
              <br />
              TO BE <em className="ltb-em">A BOOK.</em>
            </h1>
            <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
              <a
                href="/chapters"
                className="inline-flex items-center gap-3 border-2 border-ink bg-ink px-5 py-3 font-dmono text-[12px] tracking-[0.2em] uppercase text-paper transition-colors hover:bg-transparent hover:text-ink"
              >
                OPEN CONTENTS
                <span aria-hidden>↓</span>
              </a>
              <a
                href="/login"
                className="font-dmono text-[12px] tracking-[0.2em] uppercase underline decoration-dotted underline-offset-4 hover:decoration-solid"
              >
                Student login →
              </a>
            </div>
            <p className="handnote mt-10 text-lg text-ink/80 md:text-xl">
              <span className="pencil-hl">everything you actually need.</span>
            </p>
          </div>

          {/* the "11" graphic — abstract, not an icon */}
          <div className="ltb-illu relative hidden select-none md:block" aria-hidden>
            <div className="ltb-illu-grid absolute inset-0" />
            <span className="ltb-illu-num relative z-10 font-dserif text-[15rem] leading-none text-transparent">
              11
            </span>
            <div className="ltb-illu-fig absolute bottom-6 right-0 z-20 flex items-center gap-2 font-dmono text-[10px] tracking-[0.2em] uppercase">
              <span className="h-px w-8 bg-ink" />
              FIG. 01 — SIX UNITS
            </div>
            <span className="ltb-illu-tick absolute left-0 top-10 z-20 font-dmono text-[10px] tracking-[0.2em] uppercase text-ink/50">
              ── CLASS XI
            </span>
          </div>
        </div>
      </section>

      {/* contents — the syllabus as a chapter list */}
      <section className="border-b-2 border-ink">
        <div className="mx-auto max-w-6xl px-5 py-14 md:py-20">
          <div className="flex items-baseline gap-4">
            <h2 className="font-dserif text-4xl md:text-5xl">Contents</h2>
            <span className="toc-leader" />
            <span className="font-dmono text-[10px] tracking-[0.2em] uppercase text-ink/50">
              SCANNED / 08.16.26
            </span>
          </div>

          <ol className="mt-10 space-y-4 md:mt-14 md:space-y-6">
            {UNITS.map((unit, i) => {
              const world = WORLDS[unit.slug];
              const num = String(i + 1).padStart(2, "0");
              const even = i % 2 === 1;
              return (
                <li key={unit.slug}>
                  <a
                    href="/chapters"
                    className={`ltb-row group relative block border border-ink/70 bg-paper ${
                      even ? "md:ml-[12%]" : "md:mr-[8%]"
                    }`}
                  >
                    <span
                      className={`absolute inset-y-0 left-0 w-1.5 ${world.accent}`}
                      aria-hidden
                    />
                    <div className="flex items-center gap-5 py-5 pr-5 pl-6 md:gap-8 md:py-7 md:pl-8">
                      <span
                        className={`ltb-num shrink-0 font-dserif text-[clamp(3.4rem,9vw,7rem)] leading-none ${
                          i % 3 === 0 ? "ltb-num-outline" : ""
                        }`}
                      >
                        {num}
                      </span>
                      <div className="min-w-0">
                        <p className="font-dmono text-[10px] tracking-[0.22em] uppercase text-ink/50">
                          PART {unit.part} / {unit.topics.length} TOPIC
                          {unit.topics.length === 1 ? "" : "S"} / {unit.slug}
                        </p>
                        <h3 className="mt-1 font-dserif text-2xl leading-tight md:text-4xl">
                          {unit.name}
                        </h3>
                        <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-ink/70 md:text-[15px]">
                          {unit.description}
                        </p>
                      </div>
                      <div className="ml-auto hidden shrink-0 flex-col items-end gap-1 text-right sm:flex">
                        <span className="font-dmono text-[10px] tracking-[0.2em] uppercase text-ink/50">
                          {world.caption}
                        </span>
                        <span className="ltb-note font-dmono text-[11px] tracking-[0.14em] uppercase">
                          {world.note}
                        </span>
                        <span className="mt-3 font-dmono text-[11px] text-ink/40 transition-colors group-hover:text-ink">
                          OPEN →
                        </span>
                      </div>
                    </div>
                  </a>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* the paper folds away — RDBMS lives in a terminal */}
      <section className="ltb-term bg-plum text-paper">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-14 md:grid-cols-[1.1fr_1fr] md:py-16">
          <div>
            <p className="font-dmono text-[10px] tracking-[0.25em] uppercase text-paper/50">
              UNIT 05 — THE PAPER FOLDS AWAY
            </p>
            <h2 className="mt-4 font-dserif text-3xl md:text-5xl">
              Some chapters
              <br />
              you don&apos;t read.
              <br />
              <em className="text-moss">You run.</em>
            </h2>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-paper/70">
              RDBMS gets its own environment: a dark terminal, a moss-green
              cursor, warm white text. The rest of the site stays paper.
            </p>
          </div>
          <div className="ltb-termwin self-center border border-paper/25 bg-plum-deep p-5 font-dmono text-[13px] leading-relaxed shadow-[8px_8px_0_rgba(232,201,90,0.25)]">
            <p className="mb-4 flex items-center justify-between text-[10px] tracking-[0.2em] uppercase text-paper/40">
              <span>TERMINAL / RDBMS</span>
              <span className="text-moss">● READY</span>
            </p>
            <p className="text-paper/90">
              <span className="text-moss">$</span> CREATE DATABASE school;
              <br />
              <span className="text-paper/40">Query OK, 1 row affected</span>
              <br />
              <span className="text-moss">$</span> USE school;
              <br />
              <span className="text-paper/40">Database changed</span>
              <br />
              <span className="text-moss">$</span> SELECT name FROM students
              <span className="caret" aria-hidden />
            </p>
            <p className="mt-5 flex items-center justify-between text-[10px] tracking-[0.2em] uppercase">
              <span className="text-paper/40">CLASSROOM COPY</span>
              <span className="border border-moss px-3 py-1.5 text-moss">
                RUN →
              </span>
            </p>
          </div>
        </div>
      </section>

      <footer className="border-t-2 border-ink">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-6 font-dmono text-[10px] tracking-[0.2em] uppercase text-ink/50 md:flex-row md:items-center md:justify-between">
          <span>IT—11 / THE LIVING TEXTBOOK</span>
          <span>SET IN INSTRUMENT SERIF + GEIST + IBM PLEX MONO</span>
          <span>SOURCE / CBSE CODE 402</span>
        </div>
      </footer>
    </main>
  );
}