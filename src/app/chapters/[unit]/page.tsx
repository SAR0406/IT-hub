import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ChapterLadder, type ChapterLadderStep } from "@/components/ChapterLadder";
import { ResourceList } from "@/components/ResourceList";
import { ChevronRightIcon } from "@/components/icons";
import { requireUser } from "@/lib/auth";
import { getResourcesByUnit } from "@/lib/resources";
import { getUnit } from "@/lib/syllabus";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: PageProps<"/chapters/[unit]">): Promise<Metadata> {
  const { unit: unitSlug } = await params;
  const unit = getUnit(unitSlug);
  return { title: unit ? unit.name : "Unit not found" };
}

export default async function UnitPage({ params }: PageProps<"/chapters/[unit]">) {
  const { unit: unitSlug } = await params;
  const ctx = await requireUser();
  const unit = getUnit(unitSlug);

  if (!unit) notFound();

  const supabase = ctx.supabase;

  const [resources, activityRes, quizRes] = await Promise.all([
    getResourcesByUnit(unit.slug),
    supabase
      .from("activity_logs")
      .select("action")
      .eq("user_id", ctx.user.id)
      .in("action", ["resource_open", "resource_download"])
      .filter("details->>unit", "eq", unit.slug),
    supabase
      .from("quizzes")
      .select("id, title")
      .eq("unit_slug", unit.slug)
      .eq("published", true)
      .order("created_at", { ascending: false })
      .limit(1),
  ]);

  const opened = (activityRes.data ?? []).some((row) => row.action === "resource_open");
  const downloaded = (activityRes.data ?? []).some((row) => row.action === "resource_download");

  const unitQuiz = quizRes.data?.[0] ?? null;
  const { data: attempts } = unitQuiz
    ? await supabase
        .from("quiz_attempts")
        .select("score, total")
        .eq("user_id", ctx.user.id)
        .eq("quiz_id", unitQuiz.id)
    : { data: [] as { score: number; total: number }[] };

  const attemptsSafe = attempts ?? [];
  const attempted = attemptsSafe.length > 0;
  const best = attemptsSafe.reduce<{ score: number; total: number } | null>(
    (bestScore, attempt) => {
    if (
      attempt.total > 0 &&
      (!bestScore || attempt.score / attempt.total > bestScore.score / bestScore.total)
    ) {
      return { score: attempt.score, total: attempt.total };
    }
    return bestScore;
  }, null);

  const practiceCount = resources.filter(
    (resource) => resource.resource_type === "Worksheet" || resource.resource_type === "Practical"
  ).length;

  const rawSteps: Omit<ChapterLadderStep, "number" | "status">[] = [
    {
      key: "learn",
      label: "Learn",
      description: "Read the unit notes and topic material at your own pace.",
      meta: resources.length > 0 ? `${resources.length} ${resources.length === 1 ? "resource" : "resources"} to read` : null,
      cta: { href: "#topics", label: opened ? "Review material" : "Open topics" },
      unavailableReason: null,
    },
    {
      key: "practice",
      label: "Practice",
      description: "Download and solve the worksheets and practicals for this unit.",
      meta: practiceCount > 0 ? `${practiceCount} practice ${practiceCount === 1 ? "sheet" : "sheets"}` : null,
      cta: { href: "#resources", label: downloaded ? "Solve more" : "Open resources" },
      unavailableReason: resources.length > 0 ? null : "No material yet",
    },
    {
      key: "quiz",
      label: "Quiz",
      description: unitQuiz
        ? `Test yourself with "${unitQuiz.title}".`
        : "A quiz for this unit is being prepared.",
      meta: best ? `Best: ${best.score}/${best.total}` : null,
      cta: unitQuiz
        ? { href: `/quizzes/${unitQuiz.id}`, label: attempted ? "Retake quiz" : "Take quiz" }
        : null,
      unavailableReason: unitQuiz ? null : "Not published yet",
    },
  ];

  let nextAssigned = false;
  const steps: ChapterLadderStep[] = rawSteps.map((step, index) => {
    let status: ChapterLadderStep["status"];
    if (step.unavailableReason !== null) {
      status = "unavailable";
    } else if (step.key === "learn" ? opened : step.key === "practice" ? downloaded : attempted) {
      status = "done";
    } else if (!nextAssigned) {
      status = "next";
      nextAssigned = true;
    } else {
      status = "upcoming";
    }
    return { ...step, number: index + 1, status };
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Chapters", href: "/chapters" },
          { label: unit.name },
        ]}
      />

      <div className="mb-10">
        <p className="font-mono text-xs text-brand">~/it-hub-11/units/{unit.slug}</p>
        <span className="mt-3 inline-flex rounded-full border border-zinc-200 bg-white px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wide text-slate-500">
          Part {unit.part} {unit.part === "A" ? "· Employability" : "· Subject skills"}
        </span>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          {unit.name}
        </h1>
        <p className="mt-3 max-w-2xl text-base text-slate-500">{unit.description}</p>
      </div>

      <div className="mb-12">
        <ChapterLadder steps={steps} />
      </div>

      {unit.topics.length > 0 && (
        <section id="topics" className="mb-12 scroll-mt-24">
          <div className="mb-4 flex items-center gap-3">
            <h2 className="font-mono text-xs font-bold uppercase tracking-widest text-slate-400">
              Topics
            </h2>
            <span className="h-px flex-1 bg-zinc-200" />
          </div>
          <ul className="grid gap-2 sm:grid-cols-2">
            {unit.topics.map((topic, index) => (
              <li key={topic.slug}>
                <Link
                  href={`/chapters/${unit.slug}/${topic.slug}`}
                  className="group flex items-center justify-between gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-medium text-ink transition-colors hover:border-brand/40 hover:bg-brand-soft hover:text-brand"
                >
                  <span className="truncate">
                    <span className="mr-2 font-mono text-xs text-slate-400">{index + 1}.</span>
                    {topic.name}
                  </span>
                  <ChevronRightIcon
                    width={14}
                    height={14}
                    className="shrink-0 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-brand"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section id="resources" className="scroll-mt-24">
        <div className="mb-4 flex items-center gap-3">
          <h2 className="font-mono text-xs font-bold uppercase tracking-widest text-slate-400">
            Resources
          </h2>
          <span className="font-mono text-xs text-slate-400">({resources.length})</span>
          <span className="h-px flex-1 bg-zinc-200" />
        </div>
        <ResourceList resources={resources} />
      </section>
    </div>
  );
}