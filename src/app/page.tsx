import Link from "next/link";
import { UnitCard } from "@/components/UnitCard";
import {
  BookSketch,
  CapSketch,
  CheckSketch,
  CodeSketch,
  FloatBook,
  FloatBulb,
  FloatPlant,
  HeroSketch,
  PaperSketch,
  RobotSketch,
  SparkleSketch,
  StarSketch,
  TeacherSketch,
  TestimonialAvatar,
} from "@/components/sketches";
import { getSessionProfile } from "@/lib/auth";
import { getResourceCountsByUnit } from "@/lib/resources";
import { UNITS } from "@/lib/syllabus";

const FEATURES = [
  {
    icon: BookSketch,
    chip: "bg-aqua/30",
    title: "Learn Anywhere",
    text: "Every unit in one place — notes, worksheets, practicals and question papers, sorted exactly the way the CBSE syllabus is.",
  },
  {
    icon: CodeSketch,
    chip: "bg-mint/30",
    title: "Practice & Build",
    text: "SQL, Java and networking practicals you can actually work through — download the worksheets and build the projects yourself.",
  },
  {
    icon: RobotSketch,
    chip: "bg-blush/30",
    title: "AI Help Anytime",
    text: "Your teacher sees what you're working on, and an AI tutor is planned to help you out when you get stuck at night.",
  },
];

const STEPS = [
  {
    icon: PaperSketch,
    chip: "bg-sun/30",
    title: "Create your account",
    text: "Sign up with your name and class — it takes under a minute.",
  },
  {
    icon: CheckSketch,
    chip: "bg-mint/30",
    title: "You’re in — instantly",
    text: "No approvals, no waiting. Your account works the moment you create it.",
  },
  {
    icon: BookSketch,
    chip: "bg-aqua/30",
    title: "Study anywhere",
    text: "Open chapters, search topics, download worksheets — all in one hub.",
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
                className="flex h-12 items-center justify-center rounded-xl bg-brand px-7 text-base font-semibold text-white shadow-soft transition-all hover:-translate-y-0.5 hover:bg-brand-strong hover:shadow-lift"
              >
                {primaryLabel}
              </Link>
              <Link
                href="/chapters"
                className="flex h-12 items-center justify-center rounded-xl bg-white px-7 text-base font-semibold text-ink shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift"
              >
                Explore chapters
              </Link>
            </div>

            {/* Real numbers, right under the CTAs */}
            <dl className="rise-in rise-in-4 mt-8 flex flex-wrap gap-3">
              {[
                { value: "6", label: "units — the full syllabus" },
                {
                  value: String(totalResources),
                  label: "resources live",
                },
                { value: "6", label: "formats — notes to QPs" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="flex items-baseline gap-2 rounded-xl bg-white px-4 py-2.5 shadow-soft"
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

      {/* Features */}
      <section id="features" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            Why Learn With IT Hub 11
          </h2>
          <svg viewBox="0 0 240 14" fill="none" aria-hidden className="mx-auto mt-3 h-3.5 w-48">
            <path
              d="M6 9 C 60 3, 120 13, 234 6"
              stroke="#db2777"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <path
              d="M24 12 C 90 8, 160 12, 210 8"
              stroke="#0891b2"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border-l-4 border-teal bg-white p-6 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift"
            >
              <span
                className={`flex h-11 w-11 items-center justify-center rounded-full ${feature.chip} transition-transform hover:-rotate-6`}
              >
                <feature.icon width={22} height={22} />
              </span>
              <h3 className="mt-4 font-display text-lg font-bold tracking-tight text-ink">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-mist">{feature.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Getting started */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="font-mono text-xs font-medium text-brand">three steps</p>
              <h2 className="mt-1 text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                Getting started
              </h2>
            </div>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            {STEPS.map((step, index) => (
              <div
                key={step.title}
                className="relative rounded-2xl bg-paper p-6 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift"
              >
                <span className="absolute right-5 top-4 font-mono text-xs font-semibold text-slate-400">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span
                  className={`flex h-11 w-11 items-center justify-center rounded-full ${step.chip}`}
                >
                  <step.icon width={22} height={22} />
                </span>
                <h3 className="mt-4 font-display text-lg font-bold tracking-tight text-ink">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-mist">{step.text}</p>
              </div>
            ))}
          </div>
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
            className="text-sm font-semibold text-teal transition-colors hover:text-ink"
          >
            View all chapters →
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
      <section className="relative overflow-hidden bg-sky-100">
        <SparkleSketch className="absolute left-[6%] top-10 h-6 w-6 opacity-70" />
        <SparkleSketch className="absolute bottom-10 right-[8%] h-5 w-5 opacity-60" />
        <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 sm:py-20">
          <div className="flex justify-center gap-1.5" aria-hidden>
            <StarSketch width={18} height={18} />
            <StarSketch width={18} height={18} />
            <StarSketch width={18} height={18} />
            <StarSketch width={18} height={18} />
            <StarSketch width={18} height={18} />
          </div>
          <figure className="mt-6 rounded-2xl bg-white p-8 shadow-soft sm:p-10">
            <span
              className="block leading-none text-blush"
              style={{ fontFamily: "var(--font-instrument-serif)" }}
              aria-hidden
            >
              &ldquo;
            </span>
            <blockquote className="-mt-3 text-lg leading-relaxed text-ink">
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
        </div>
      </section>

      {/* Teachers band */}
      <section className="bg-white">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2">
          <div className="order-2 lg:order-1">
            <TeacherSketch className="mx-auto w-full max-w-sm" />
          </div>
          <div className="order-1 lg:order-2">
            <p className="font-mono text-xs font-medium text-brand">~/it-hub-11/admin</p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-ink sm:text-3xl">
              For teachers: one panel to manage it all
            </h2>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-mist">
              Upload material, create or approve student accounts, and review
              activity — every download, search and sign-in is logged, with flags
              raised automatically for anything that looks off.
            </p>
            <Link
              href="/login"
              className="mt-7 inline-flex h-11 items-center justify-center rounded-xl border-2 border-brand px-6 text-sm font-semibold text-brand transition-all hover:-translate-y-0.5 hover:bg-brand hover:text-white"
            >
              Teacher sign in
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}