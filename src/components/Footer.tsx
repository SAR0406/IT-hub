import Link from "next/link";

const GithubIcon = ({ className = "" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

const MailIcon = ({ className = "" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-10 7L2 7" />
  </svg>
);

const TwitterIcon = ({ className = "" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53A4.48 4.48 0 0 0 12 7.5v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
  </svg>
);

const SOCIALS = [
  {
    icon: GithubIcon,
    href: "https://github.com/sar0406",
    label: "GitHub",
    username: "@sar0406",
  },
  {
    icon: MailIcon,
    href: "mailto:sarthak@ithub11.dev",
    label: "Email",
    username: "sarthak@ithub11.dev",
  },
  {
    icon: TwitterIcon,
    href: "https://twitter.com/sar0406",
    label: "Twitter",
    username: "@sar0406",
  },
];

/** Only real routes — every link in this footer works. */
const LINK_COLUMNS = [
  {
    title: "Study",
    links: [
      { label: "Chapters", href: "/chapters" },
      { label: "Quizzes", href: "/quizzes" },
      { label: "Tools", href: "/tools" },
      { label: "Offline packs", href: "/bookless" },
    ],
  },
  {
    title: "Explore",
    links: [
      { label: "Search the archive", href: "/search" },
      { label: "Ask AI", href: "/chat" },
      { label: "Dashboard", href: "/dashboard" },
      { label: "About", href: "/about" },
    ],
  },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative mt-auto border-t border-line bg-white">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <Link href="/" className="group flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand to-brand-strong font-mono text-sm font-bold text-white shadow-soft transition-transform group-hover:-translate-y-0.5">
                11
              </span>
              <span className="font-display text-base font-bold tracking-tight text-ink">
                IT Hub <span className="text-brand">11</span>
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-mist">
              Every unit of the Class 11 CBSE IT syllabus in one place — notes,
              worksheets, practicals, quizzes and tools, updated by your teacher.
            </p>
            <div className="mt-6 flex gap-3">
              {SOCIALS.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    title={`${social.label}: ${social.username}`}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-line text-slate-500 transition-all hover:-translate-y-0.5 hover:border-brand/50 hover:text-brand"
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {LINK_COLUMNS.map((column) => (
            <div key={column.title}>
              <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-slate-400">
                {column.title}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm font-medium text-mist transition-colors hover:text-brand"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-xs text-slate-400">
            © {currentYear} IT Hub 11 · built for learning
          </p>
          <a
            href="https://github.com/sar0406/IT-hub"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs text-slate-400 transition-colors hover:text-brand"
          >
            view source ↗
          </a>
        </div>
      </div>
    </footer>
  );
}