export type Topic = {
  name: string;
  slug: string;
  description: string;
};

export type Unit = {
  name: string;
  slug: string;
  part: "A" | "B";
  description: string;
  topics: Topic[];
};

/**
 * CBSE Class 11 Information Technology (Code 402) syllabus hierarchy.
 *
 * Hardcoded on purpose: the syllabus is static and does not need a CMS.
 * Topics for Part B units are intentionally left empty because the official
 * syllabus does not list sub-chapters for these units at Class 11 level.
 * They can be added later without changing the architecture.
 *
 * Future note: the AI tutor (V2+) should retrieve documents under these
 * slugs, so keep slugs stable.
 */
export const UNITS: Unit[] = [
  {
    name: "Employability Skills",
    slug: "employability-skills",
    part: "A",
    description:
      "Communication, self-management, ICT, entrepreneurial and green skills for the workplace.",
    topics: [
      {
        name: "Communication Skills-III",
        slug: "communication-skills",
        description:
          "Methods of communication, verbal and non-verbal communication and barriers to communication.",
      },
      {
        name: "Self-Management Skills-III",
        slug: "self-management-skills",
        description:
          "Self-awareness, self-motivation, goal setting and managing work.",
      },
      {
        name: "ICT Skills-III",
        slug: "ict-skills",
        description:
          "Basic computer operations, the internet, email and digital etiquette.",
      },
      {
        name: "Entrepreneurial Skills-III",
        slug: "entrepreneurial-skills",
        description:
          "Entrepreneurship concepts, qualities of an entrepreneur and business ideas.",
      },
      {
        name: "Green Skills-III",
        slug: "green-skills",
        description:
          "Sustainable development and environment-friendly practices.",
      },
    ],
  },
  {
    name: "Computer Organization",
    slug: "computer-organization",
    part: "B",
    description:
      "Computer hardware, software, memory and the functioning of a computer system.",
    topics: [
      {
        name: "Utility Walkthroughs",
        slug: "utility-walkthroughs",
        description:
          "Step-by-step guides for Disk Cleanup, Recycle Bin, Command Prompt basics.",
      },
    ],
  },
  {
    name: "Networking & Internet",
    slug: "networking-internet",
    part: "B",
    description:
      "Computer networks, the internet, web services and online safety.",
    topics: [
      {
        name: "Cybersecurity Awareness",
        slug: "cybersecurity-awareness",
        description:
          "Threats, vulnerabilities, safe browsing habits and online safety practices.",
      },
      {
        name: "Password Security & Checklist",
        slug: "password-security",
        description:
          "Creating strong passwords, multi-factor authentication and a practical checklist.",
      },
    ],
  },
  {
    name: "Office Automation Tools",
    slug: "office-automation-tools",
    part: "B",
    description:
      "Word processing, spreadsheets and presentations using office tools.",
    topics: [
      {
        name: "Calc Playground",
        slug: "calc-playground",
        description:
          "Interactive spreadsheet formulas, references, and charts tutorial.",
      },
    ],
  },
  {
    name: "RDBMS",
    slug: "rdbms",
    part: "B",
    description:
      "Database concepts, relational terminology, MySQL and SQL practice.",
    topics: [],
  },
  {
    name: "Fundamentals of Java",
    slug: "fundamentals-of-java",
    part: "B",
    description:
      "Java basics, programming constructs, methods and object-oriented thinking.",
    topics: [],
  },
];

export function getUnit(slug: string): Unit | undefined {
  return UNITS.find((unit) => unit.slug === slug);
}

export function getTopic(unitSlug: string, topicSlug: string): Topic | undefined {
  return getUnit(unitSlug)?.topics.find((topic) => topic.slug === topicSlug);
}

export function isTopicSlug(unitSlug: string, topicSlug: string): boolean {
  return getTopic(unitSlug, topicSlug) !== undefined;
}

export function getUnitName(slug: string): string | undefined {
  return getUnit(slug)?.name;
}

/** Slugs of all units that have named topics (so far: Part A). */
export function getUnitsWithTopics(): Unit[] {
  return UNITS.filter((unit) => unit.topics.length > 0);
}