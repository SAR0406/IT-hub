import Link from "next/link";
import { UnitCard } from "@/components/UnitCard";
import {
  BookSketch,
  CapSketch,
  CodeSketch,
  FloatBook,
  FloatBulb,
  FloatPlant,
  HeroSketch,
  QuizSketch,
  RobotSketch,
  SparkleSketch,
  StarSketch,
  TeacherSketch,
  TestimonialAvatar,
} from "@/components/sketches";
import { getSessionProfile } from "@/lib/auth";
import { getResourceCountsByUnit } from "@/lib/resources";
import { UNITS } from "@/lib/syllabus";

/** The learning loop — every card is a real route into the product. */
const MOVES = [
  {
    icon: BookSketch,
    chip: "bg-aqua/40",
    number: "01",
    title: "Learn",
    text: "Notes, worksheets, practicals and question papers — every unit in one place, sorted by the CBSE syllabus.",
    href: "/chapters",
    cta: "Open chapters",
  },
  {
    icon: QuizSketch,
    chip: "bg-lilac/45",
    number: "02",
    title: "Practice",
    text: "Unit-wise MCQ quizzes with instant scoring, explanations and unlimited retakes to beat your best.",
    href: "/quizzes",
    cta: "Take a quiz",
  },
  {
    icon: RobotSketch,
    chip: "bg-blush/40",
    number: "03",
    title: "Ask AI",
    text: "A class chat with an AI tutor that answers from your own archive — with real file links and daily limits.",
    href: "/chat",
    cta: "Open the room",
  },
  {
    icon: CodeSketch,
    chip: "bg-mint/40",
    number: "04",
    title: "Tools",
    text: "Run SQL in your browser, calculate transfer times, check passwords — every tool tied to its chapter.",
    href: "/tools",
    cta: "Browse tools",
  },
];

export default async function HomePage() {
  const profile = await getSessionProfile();
  const counts = await getResourceCountsByUnit();
  const totalResources = Object.values(counts).reduce((sum, n) => sum + n, 0);

  const primaryHref = profile ? "/chapters" : "/login";
  const primaryLabel = profile ? "Continue learning" : "Start Learning";

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-paper">
        <SparkleSketch className="float-y absolute left-[3%] top-20 h-6 w-6 opacity-80" />
        <FloatBulb className="float-y float-y-1 absolute right-[4%] top-28 hidden h-8 w-8 opacity-70 lg:block" />
        <FloatPlant className="float-y float-y-2 absolute bottom-10 right-[6%] hidden h-9 w-9 opacity-60 lg:block" />

        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
          <div>
            <p className="rise-in rise-in-1 font-mono text-[13px] font-medium text-brand">
              cbse · class 11 · information technology (402)
            </p>
            <h1 className="rise-in rise-in-2 mt-5 text-4xl font-bold leading-[1.12] tracking-tight text-ink sm:text-5xl">
              Learn India&rsquo;s CBSE Class 11 IT Online
            </h1>
            <p className="rise-in rise-in-3 mt-5 max-w-md text-base leading-relaxed text-mist">
              Master SQL, Java, Networking &amp; More — study material organized by
              the official syllabus, updated by your teacher, ready when you are.
            </p>
            <div className="rise-in rise-in-4 mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href={primaryHref}
                className="btn-primary flex h-12 items-center justify-center rounded-xl px-7 text-base font-semibold"
              >
                {primaryLabel}
              </Link>
              <Link
                href="/chapters"
                className="btn-secondary flex h-12 items-center justify-center rounded-xl px-7 text-base font-semibold"
              >
                Explore chapters
              </Link>
            </div>

            <dl className="rise-in rise-in-4 mt-8 flex flex-wrap gap-3">
              {[
                { value: "6", label: "units — the full syllabus" },
                { value: String(totalResources), label: "resources live" },
                { value: "6", label: "formats — notes to QPs" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="flex items-baseline gap-2 rounded-xl border border-line bg-white px-4 py-2.5"
                >
                  <dt className="sr-only">{stat.label}</dt>
                  <dd className="font-mono text-lg font-bold text-ink">{stat.value}</dd>
                  <dd className="text-xs text-mist">{stat.label}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="rise-in rise-in-3 relative hidden lg:block">
            <CapSketch className="float-y float-y-1 absolute -top-4 right-8 h-9 w-9" />
            <FloatBook className="float-y absolute -left-2 top-4 h-10 w-10" />
            <HeroSketch className="mx-auto w-full max-w-md" />
          </div>
        </div>
      </section>

      {/* The learning loop */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-xs font-medium text-brand">the loop</p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-ink sm:text-3xl">
              One path, four moves
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-mist">
            Read, practise, ask and experiment — each step feeds the next.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {MOVES.map((move) => (
            <Link
              key={move.number}
              href={move.href}
              className="group flex flex-col gap-4 rounded-2xl border border-line bg-white p-6 transition-all hover:-translate-y-1 hover:border-brand/40 hover:shadow-soft"
            >
              <div className="flex items-center justify-between gap-3">
                <span
                  className={`flex h-11 w-11 items-center justify-center rounded-full ${move.chip} transition-transform group-hover:-rotate-6`}
                >
                  <move.icon width={22} height={22} />
                </span>
                <span className="font-mono text-xs font-bold text-slate-400">{move.number}</span>
              </div>
              <div>
                <h3 className="font-display text-lg font-bold tracking-tight text-ink">
                  {move.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-mist">{move.text}</p>
              </div>
              <span className="mt-auto text-sm font-semibold text-brand transition-colors group-hover:text-brand-strong">
                {move.cta} →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Chapters showcase */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-xs font-medium text-brand">
              {totalResources > 0
                ? `${totalResources} ${totalResources === 1 ? "resource" : "resources"} live`
                : "material being prepared"}
            </p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-ink sm:text-3xl">
              Your Learning Path
            </h2>
          </div>
          <Link
            href="/chapters"
            className="text-sm font-semibold text-brand transition-colors hover:text-brand-strong"
          >
            View all chapters →
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {UNITS.map((unit, index) => (
            <UnitCard
              key={unit.slug}
              unit={unit}
              index={index + 1}
              resourceCount={counts[unit.slug] ?? 0}
              topicCount={unit.topics.length}
            />
          ))}
        </div>
      </section>

      {/* Testimonial */}
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <div className="flex justify-center gap-1.5" aria-hidden>
          <StarSketch width={18} height={18} />
          <StarSketch width={18} height={18} />
          <StarSketch width={18} height={18} />
          <StarSketch width={18} height={18} />
          <StarSketch width={18} height={18} />
        </div>
        <figure className="mt-6 rounded-3xl border border-line bg-white p-8 text-center sm:p-10">
          <span
            className="block text-4xl leading-none text-blush"
            style={{ fontFamily: "var(--font-instrument-serif)" }}
            aria-hidden
          >
            &ldquo;
          </span>
          <blockquote className="mt-2 text-lg leading-relaxed text-ink">
            Everything for IT 402 in one place — notes, worksheets and practicals.
            No more hunting across class groups when an exam is coming.
          </blockquote>
          <figcaption className="mt-6 flex items-center justify-center gap-3">
            <TestimonialAvatar width={44} height={44} />
            <span className="text-left">
              <span className="block text-sm font-bold text-ink">A Class 11 student</span>
              <span className="block text-xs text-mist">Information Technology (402)</span>
            </span>
          </figcaption>
        </figure>
      </section>

      {/* Teachers band */}
      <section className="border-y border-line bg-white">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2">
          <div className="order-2 lg:order-1">
            <TeacherSketch className="mx-auto w-full max-w-sm" />
          </div>
          <div className="order-1 lg:order-2">
            <p className="font-mono text-xs font-medium text-brand">~/it-hub-11/admin</p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-ink sm:text-3xl">
              For teachers: one panel to manage it all
            </h2>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-mist">
              Upload material, create quizzes, review student records and read the
              activity log — every download, search and sign-in tracked, with flags
              raised automatically for anything that looks off.
            </p>
            <Link
              href="/login"
              className="btn-secondary mt-7 inline-flex h-11 items-center justify-center rounded-xl px-6 text-sm font-semibold"
            >
              Teacher sign in
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}