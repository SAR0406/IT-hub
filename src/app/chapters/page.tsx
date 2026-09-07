import { Suspense } from "react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageHeader, HeaderPill } from "@/components/PageHeader";
import { UnitCard } from "@/components/UnitCard";
import { UnitCardSkeleton } from "@/components/Skeletons";
import { requireUser } from "@/lib/auth";
import { getPublishedSchoolEvents } from "@/lib/events";
import { getResourceCountsByUnit } from "@/lib/resources";
import { UNITS } from "@/lib/syllabus";

async function UnitGrid() {
  const counts = await getResourceCountsByUnit();

  return (
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
  );
}

function formatEventDate(date: string | null): string {
  if (!date) return "Memory moment";
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}

async function EventsSection() {
  const events = await getPublishedSchoolEvents(8);

  return (
    <section
      id="events"
      className="accent-scope-amber mt-12 rounded-3xl border border-line bg-gradient-to-br from-[#fff6df] via-[#ffefcf] to-[#ffe7d7] p-6 sm:p-8"
    >
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-white/70 bg-white/80 px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-wide text-brand-strong">
          Events
        </span>
        <h2 className="font-display text-2xl font-bold text-ink">School Memories 🎉📸</h2>
      </div>
      <p className="mb-6 max-w-2xl text-sm text-mist">
        A warm corner for annual day, sports day, trips, house celebrations, and every happy school
        moment beyond studies.
      </p>

      {events.length === 0 ? (
        <div className="rounded-2xl border border-white/70 bg-white/75 px-4 py-5 text-sm text-mist">
          No events added yet — ask admin to publish your first memory card ✨
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <article
              key={event.id}
              className="overflow-hidden rounded-2xl border border-white/80 bg-white/85 shadow-soft"
            >
              <div
                className="flex h-36 items-end bg-[#ffeac2] bg-cover bg-center p-3"
                style={
                  event.photo_url
                    ? {
                        backgroundImage: `linear-gradient(to top, rgba(25,29,38,0.35), rgba(25,29,38,0.08)), url(${event.photo_url})`,
                      }
                    : undefined
                }
              >
                <span className="rounded-full bg-white/85 px-2.5 py-1 text-sm font-semibold text-ink">
                  {event.emoji}
                </span>
              </div>
              <div className="space-y-2 p-4">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-display text-base font-bold text-ink">{event.title}</h3>
                  <span className="shrink-0 rounded-full bg-brand-soft px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wide text-brand-strong">
                    {formatEventDate(event.event_date)}
                  </span>
                </div>
                {event.description && (
                  <p className="text-sm leading-relaxed text-mist">{event.description}</p>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default async function ChaptersPage() {
  await requireUser();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Chapters" },
        ]}
      />

      <PageHeader
        path="~/it-hub-11/units"
        title="Chapters"
        description="The complete Class 11 Information Technology syllabus — six units, two parts, every resource your teacher has published."
        meta={
          <>
            <HeaderPill>Part A · Employability</HeaderPill>
            <HeaderPill>Part B · Subject skills</HeaderPill>
            <HeaderPill>Unit / 01–06</HeaderPill>
          </>
        }
      />

      <Suspense
        fallback={
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <UnitCardSkeleton key={index} />
            ))}
          </div>
        }
      >
        <UnitGrid />
      </Suspense>

      <Suspense
        fallback={
          <section className="mt-12 rounded-3xl border border-line bg-white p-6 sm:p-8">
            <div className="h-6 w-56 animate-pulse rounded bg-slate-200" />
            <div className="mt-3 h-4 w-96 max-w-full animate-pulse rounded bg-slate-200" />
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="h-56 animate-pulse rounded-2xl bg-slate-200" />
              ))}
            </div>
          </section>
        }
      >
        <EventsSection />
      </Suspense>
    </div>
  );
}