import Link from "next/link";
import { UnitCard } from "@/components/UnitCard";
import {
  BookSketch,
  CodeSketch,
  FloatBook,
  FloatBulb,
  FloatPlant,
  HeroSketch,
  RobotSketch,
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
        <FloatBulb className="float-y absolute left-[4%] top-16 h-8 w-8 opacity-70" />
        <FloatPlant className="float-y float-y-1 absolute right-[3%] top-24 hidden h-9 w-9 opacity-60 lg:block" />
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
            <p className="rise-in rise-in-4 mt-6 font-mono text-xs text-mist">
              &gt; sign in required to view material — accounts come from your teacher
            </p>
          </div>

          <div className="rise-in rise-in-3 relative hidden lg:block">
            <HeroSketch className="mx-auto w-full max-w-md" />
            <FloatBook
              className="float-y absolute -top-2 left-0 h-10 w-10"
            />
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="text-center text-2xl font-bold tracking-tight text-ink sm:text-3xl">
          Why Learn With IT Hub 11
        </h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border-l-4 border-teal bg-white p-6 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift"
            >
              <span
                className={`flex h-11 w-11 items-center justify-center rounded-full ${feature.chip}`}
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

      {/* Chapters showcase */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
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
        </div>
      </section>

      {/* Testimonial */}
      <section className="bg-sky-100">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
          <figure className="rounded-2xl bg-white p-8 shadow-soft sm:p-10">
            <blockquote className="text-lg leading-relaxed text-ink">
              &ldquo;Everything for IT 402 in one place — notes, worksheets and
              practicals. No more hunting across class groups when an exam is
              coming.&rdquo;
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
    </>
  );
}