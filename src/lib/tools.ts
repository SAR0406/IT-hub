import { getUnit, UNITS, type Unit } from "@/lib/syllabus";

/**
 * Interactive tools, calculators and guides.
 *
 * Every tool is registered here with the chapter (unit) it belongs to — this
 * registry is the single source of truth for the /tools index and the
 * per-chapter "Tools" sections. Add a tool by registering it here first;
 * there is no other list to keep in sync.
 *
 * Slugs are stable on purpose (same rule as the syllabus): the AI assistant
 * and search may reference them later.
 */

export type ToolKind = "interactive" | "calculator" | "guide" | "practice";

export type Tool = {
  slug: string;
  name: string;
  description: string;
  href: string;
  /** Chapter (unit) this tool belongs to — must be a slug from the syllabus. */
  unitSlug: string;
  /** Drives the card icon + accent in ToolCard. */
  kind: ToolKind;
  /** Short mono label shown as a chip on the card. */
  tag: string;
};

export const TOOLS: Tool[] = [
  {
    slug: "sql-playground",
    name: "SQL Playground",
    description:
      "Run real SQL in your browser — no setup, no risk. Try the missions and see results instantly.",
    href: "/tools/sql-playground",
    unitSlug: "rdbms",
    kind: "interactive",
    tag: "missions",
  },
  {
    slug: "network-calculators",
    name: "Network Calculators",
    description:
      "Transfer time, storage conversion and monthly data usage — all math runs in your browser, nothing is sent anywhere.",
    href: "/tools/network-calculators",
    unitSlug: "networking-internet",
    kind: "calculator",
    tag: "calculators",
  },
  {
    slug: "password-security",
    name: "Password Security & Checklist",
    description:
      "Strong-password rules, multi-factor authentication and a practical checklist with a live strength tester.",
    href: "/chapters/networking-internet/password-security",
    unitSlug: "networking-internet",
    kind: "practice",
    tag: "checklist",
  },
  {
    slug: "cybersecurity-awareness",
    name: "Cybersecurity Awareness",
    description:
      "Threats, vulnerabilities and safe browsing habits — the online-safety foundations every user needs.",
    href: "/chapters/networking-internet/cybersecurity-awareness",
    unitSlug: "networking-internet",
    kind: "guide",
    tag: "guide",
  },
  {
    slug: "utility-walkthroughs",
    name: "Utility Walkthroughs",
    description:
      "Step-by-step guides for Disk Cleanup, Recycle Bin and Command Prompt basics.",
    href: "/chapters/computer-organization/utility-walkthroughs",
    unitSlug: "computer-organization",
    kind: "guide",
    tag: "guide",
  },
  {
    slug: "ewaste-calculator",
    name: "E-Waste Calculator",
    description:
      "Estimate the CO₂ footprint and recycling potential of your old electronics.",
    href: "/chapters/employability-skills/green-skills/ewaste-calculator",
    unitSlug: "employability-skills",
    kind: "calculator",
    tag: "green skills",
  },
];

// Fail fast at build time: a tool pointing at a chapter that doesn't exist
// is a mistake, not a runtime concern.
for (const tool of TOOLS) {
  if (!getUnit(tool.unitSlug)) {
    throw new Error(`[tools] "${tool.slug}" references unknown unit "${tool.unitSlug}"`);
  }
}

export function getToolsByUnit(unitSlug: string): Tool[] {
  return TOOLS.filter((tool) => tool.unitSlug === unitSlug);
}

/** All tools grouped by their chapter, in syllabus order. */
export function getToolsGroupedByUnit(): { unit: Unit; tools: Tool[] }[] {
  return UNITS.map((unit) => ({ unit, tools: getToolsByUnit(unit.slug) })).filter(
    (group) => group.tools.length > 0
  );
}