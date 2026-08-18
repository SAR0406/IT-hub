import type { Metadata } from "next";
import Link from "next/link";
import { UNITS } from "@/lib/syllabus";
import "./digital-desk.css";

export const metadata: Metadata = {
  title: "Concept B — Digital Desk | IT—11",
};

const CARD_ACCENT: Record<string, string> = {
  "employability-skills": "bg-moss",
  "computer-organization": "bg-violet",
  "networking-internet": "bg-cyan",
  "office-automation-tools": "bg-coral",
  rdbms: "bg-moss",
  "fundamentals-of-java": "bg-yellow",
};

const CARD_ROTATE = [
  "rotate-[-7deg]",
  "rotate-[-3deg]",
  "rotate-[1deg]",
  "rotate-[5deg]",
  "rotate-[9deg]",
  "rotate-[13deg]",
];

export default function DigitalDeskConcept() {
  return (
    <main className="dd bg-paper text-ink min-h-screen font-dsans">
      {/* slim real-navigation bar — the desk never hides the way out */}
      <header className="border-b-2 border-ink">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3 font-dmono text-[11px] tracking-[0.18em] uppercase">
          <span>IT—11</span>
          <span className="hidden sm:inline text-ink/50">CLASS XI / CBSE / 2026—27</span>
          <Link
            href="/chapters"
            className="border border-ink px-3 py-1 transition-colors hover:bg-ink hover:text-paper"
          >
            CHAPTERS →
          </Link>
        </div>
      </header>

      <div className="dd-surface mx-auto max-w-6xl px-5 py-10 md:py-14">
        <div className="dd-desk relative min-h-[52rem] md:min-h-[46rem]">
          {/* notebook — the hero statement sits on paper */}
          <div className="dd-notebook relative md:absolute md:left-[3%] md:top-[4%] md:w-[47%]">
            <Link href="/chapters" className="block transition-transform duration-200 hover:-translate-y-1">
              <div className="dd-tape dd-tape-yellow absolute -top-3 left-10 z-20" />
              <div className="border-2 border-ink bg-paper p-0 shadow-[8px_10px_0_rgba(23,21,18,0.14)]">
                <div className="flex items-center justify-between bg-plum px-4 py-2 font-dmono text-[10px] tracking-[0.22em] uppercase text-paper">
                  <span>Class Notes — 05 / RDBMS</span>
                  <span className="text-cyan">● OPEN</span>
                </div>
                <div className="px-5 py-7 md:px-7 md:py-9">
                  <p className="font-dmono text-[10px] tracking-[0.25em] uppercase text-ink/50">
                    THE SHORT VERSION
                  </p>
                  <h1 className="mt-4 font-dserif text-[clamp(1.9rem,4.5vw,3.4rem)] leading-[1.02]">
                    The database is just a table.
                    <br />
                    <em className="dd-em">The table is just a ledger.</em>
                  </h1>
                  <p className="mt-5 max-w-md text-sm leading-relaxed text-ink/70">
                    Everything you need for Class 11 IT — notes, worksheets,
                    question papers — sits on this desk. Open a card.
                  </p>

                  {/* ledger mini-diagram */}
                  <div className="mt-7 max-w-md border-2 border-ink font-dmono text-[11px]">
                    <div className="flex border-b-2 border-ink bg-paper-deep px-3 py-1.5 tracking-[0.18em] uppercase">
                      <span className="w-14">ROLL</span>
                      <span className="flex-1">NAME</span>
                      <span>MARKS</span>
                    </div>
                    {[
                      ["001", "AARAV", "94"],
                      ["002", "PRIYA", "87"],
                      ["003", "ROHAN", "91"],
                    ].map(([r, n, m]) => (
                      <div key={r} className="flex px-3 py-1.5 border-b border-ink/30 last:border-b-0">
                        <span className="w-14">{r}</span>
                        <span className="flex-1">{n}</span>
                        <span className="dd-mark relative">{m}</span>
                      </div>
                    ))}
                  </div>
                  <p className="handnote mt-3 text-base text-ink/70">
                    primary key = roll no. <span className="pencil-hl">never forget this.</span>
                  </p>
                </div>
              </div>
            </Link>
          </div>

          {/* the fanned stack of unit cards */}
          <div className="relative mx-auto mt-14 h-72 w-[19rem] md:absolute md:right-[2%] md:top-[5%] md:mx-0">
            {UNITS.map((unit, i) => (
              <Link
                key={unit.slug}
                href="/chapters"
                className={`dd-card absolute inset-0 ${CARD_ROTATE[i]} ${i === 5 ? "" : "md:hover:rotate-0"}`}
                style={{ zIndex: i }}
              >
                <div className={`h-full w-full border-2 border-ink bg-paper p-4 transition-all duration-200 md:hover:-translate-y-2`}>
                  <div className="flex items-start justify-between">
                    <span className="font-dmono text-[10px] tracking-[0.2em] uppercase text-ink/50">
                      UNIT {String(i + 1).padStart(2, "0")} / PART {unit.part}
                    </span>
                    <span className={`h-3 w-3 border border-ink ${CARD_ACCENT[unit.slug]}`} />
                  </div>
                  <h2 className="mt-6 font-dserif text-xl leading-tight">{unit.name}</h2>
                  <p className="mt-2 line-clamp-2 text-[11px] leading-relaxed text-ink/60">
                    {unit.description}
                  </p>
                  <p className="mt-5 font-dmono text-[10px] tracking-[0.2em] uppercase text-ink/40">
                    OPEN →
                  </p>
                </div>
              </Link>
            ))}
            <div className="dd-tape dd-tape-moss absolute -top-3 right-8 z-20 rotate-[4deg]" />
          </div>

          {/* THE DESK — the assistant, pinned to the edge */}
          <aside className="dd-deskpanel absolute right-0 top-[44%] z-30 w-[17rem] md:right-[1%] md:top-[42%]">
            <div className="border-2 border-ink bg-plum text-paper shadow-[8px_8px_0_rgba(23,21,18,0.3)]">
              <div className="flex items-center justify-between border-b border-paper/20 px-4 py-2.5 font-dmono text-[10px] tracking-[0.22em] uppercase">
                <span>THE DESK</span>
                <span className="dd-blip h-2 w-2 rounded-full bg-coral" />
              </div>
              <div className="px-4 py-4">
                <p className="font-dmono text-[10px] tracking-[0.18em] uppercase text-paper/50">
                  what are you stuck on?
                </p>
                <div className="mt-2 border border-paper/30 bg-plum-deep px-3 py-2.5 font-dmono text-[12px] text-paper/70">
                  explain primary key...
                  <span className="caret text-moss" aria-hidden />
                </div>
                <button
                  type="button"
                  disabled
                  className="mt-3 w-full border border-moss px-3 py-2 font-dmono text-[11px] tracking-[0.22em] uppercase text-moss opacity-80"
                >
                  ASK → <span className="text-[9px] text-paper/40">V2</span>
                </button>
                <p className="mt-3 text-[10px] leading-relaxed text-paper/45">
                  Answers appear as notes pinned to this desk. Arriving in
                  V2 — the layout is what we&apos;re testing.
                </p>
              </div>
            </div>
            <div className="absolute -left-5 top-6 hidden h-10 w-10 rotate-[-4deg] border-2 border-ink bg-yellow text-center font-dmono text-lg font-semibold leading-9 shadow-[4px_4px_0_rgba(23,21,18,0.25)] md:block">
              D
            </div>
          </aside>

          {/* small desk objects — usb, pencil, sticky notes */}
          <div className="dd-usb absolute bottom-[10%] left-[16%] hidden rotate-[-8deg] md:block">
            <div className="relative h-14 w-24 border-2 border-ink bg-plum">
              <div className="absolute inset-x-0 top-0 flex h-6 items-center justify-center border-b-2 border-ink bg-paper font-dmono text-[9px] tracking-[0.16em] uppercase">
                05 / RDBMS
              </div>
              <div className="absolute -right-4 top-1/2 h-5 w-5 -translate-y-1/2 rounded-sm border-2 border-ink bg-cyan" />
              <div className="absolute -left-3.5 top-1/2 h-3 w-3 -translate-y-1/2 border-2 border-ink bg-moss" />
            </div>
          </div>

          <div className="dd-pencil absolute bottom-[16%] right-[26%] hidden rotate-[-28deg] md:block">
            <div className="relative h-3.5 w-44">
              <div className="absolute inset-y-0 left-0 w-32 rounded-sm border-2 border-ink bg-yellow" />
              <div className="absolute inset-y-0 right-0 w-10 [clip-path:polygon(0_0,100%_50%,0_100%)] bg-coral" />
              <div className="absolute inset-y-0 right-[1px] w-3 [clip-path:polygon(0_0,100%_50%,0_100%)] bg-ink" />
              <span className="absolute -top-5 left-2 font-dmono text-[9px] tracking-[0.2em] uppercase text-ink/50">
                2B
              </span>
            </div>
          </div>

          <div className="dd-sticky absolute left-[54%] top-[30%] hidden rotate-[3deg] md:block">
            <div className="w-44 border-2 border-ink bg-moss px-3 py-3 shadow-[4px_4px_0_rgba(23,21,18,0.2)]">
              <p className="font-dmono text-[11px] font-semibold tracking-[0.08em] uppercase">
                don&apos;t skip rdbms
              </p>
              <p className="mt-1.5 text-[10px] leading-snug text-ink/70">
                it shows up in every exam paper
              </p>
            </div>
          </div>

          <div className="dd-sticky absolute bottom-[4%] right-[6%] hidden rotate-[-2deg] md:block">
            <div className="w-40 border-2 border-ink bg-coral px-3 py-3 shadow-[4px_4px_0_rgba(23,21,18,0.2)]">
              <p className="font-dmono text-[11px] font-semibold tracking-[0.08em] uppercase">
                ask the desk
              </p>
              <p className="mt-1.5 text-[10px] leading-snug text-ink/70">
                the assistant pins its answers here
              </p>
            </div>
          </div>
        </div>
      </div>

      <footer className="border-t-2 border-ink">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-6 font-dmono text-[10px] tracking-[0.2em] uppercase text-ink/50 md:flex-row md:justify-between">
          <span>IT—11 / CONCEPT B / THE DIGITAL DESK</span>
          <span>EVERY OBJECT HERE IS A CHAPTER — HOVER THE CARDS</span>
        </div>
      </footer>
    </main>
  );
}