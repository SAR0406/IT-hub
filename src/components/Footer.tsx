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

export function Footer() {
  const currentYear = new Date().getFullYear();

  const navigationLinks = [
    {
      title: "Platform",
      links: [
        { label: "Chapters", href: "/chapters" },
        { label: "AI Tutor", href: "/ai-tutor" },
        { label: "Quizzes", href: "/quizzes" },
        { label: "Downloads", href: "/downloads" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "CBSE Syllabus", href: "/syllabus" },
        { label: "Sample Papers", href: "/papers" },
        { label: "Study Guide", href: "/guide" },
        { label: "FAQ", href: "/faq" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About", href: "/about" },
        { label: "Contact", href: "/contact" },
        { label: "Privacy", href: "/privacy" },
        { label: "Terms", href: "/terms" },
      ],
    },
  ];

  const socialLinks = [
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

  return (
    <footer className="relative mt-auto border-t border-slate-200 bg-white">
      {/* Decorative gradient line */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blush via-brand to-teal opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 gap-12 py-16 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand Section - Takes 2 columns */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {/* Logo */}
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blush to-brand font-display text-sm font-bold text-white shadow-lg">
                  11
                </div>
                <div>
                  <p className="font-display text-lg font-bold tracking-tight text-ink">
                    IT Hub <span className="text-brand">11</span>
                  </p>
                  <p className="text-xs text-slate-500 font-medium">Class XI • CBSE</p>
                </div>
              </div>

              {/* Description */}
              <p className="max-w-xs text-sm leading-relaxed text-slate-600">
                Your complete learning companion for CBSE Class 11 Information Technology. Master concepts, practice problems, and ace your exams.
              </p>

              {/* Creator Badge */}
              <div className="pt-2">
                <div className="inline-flex items-center gap-3 rounded-lg bg-gradient-to-r from-blush/10 to-brand/10 px-4 py-2 border border-blush/20">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blush to-brand text-white text-xs font-bold">
                    S
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-ink">Sarthak</p>
                    <p className="text-xs text-slate-500">Creator & Developer</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Columns */}
          {navigationLinks.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold text-ink mb-4">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-600 transition-colors duration-200 hover:text-brand hover:translate-x-0.5 inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Creator & Social Section */}
        <div className="border-t border-slate-200 py-12">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Creator Story */}
            <div>
              <h3 className="text-sm font-semibold text-ink mb-3">Built by a Student</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Hey! I'm <span className="font-semibold text-brand">Sarthak</span> 
                <span className="block mt-2 text-xs text-slate-500">
                  " Just a Student who loves building and creating things "
                </span>
              </p>
            </div>

            {/* Social Links */}
            <div>
              <h3 className="text-sm font-semibold text-ink mb-3">Connect With Me</h3>
              <div className="flex gap-3">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="group relative inline-flex items-center justify-center h-10 w-10 rounded-lg border border-slate-200 text-slate-600 transition-all duration-200 hover:border-brand hover:bg-gradient-to-br hover:from-blush/20 hover:to-brand/20 hover:text-brand"
                      title={`${social.label}: ${social.username}`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-ink text-white text-xs px-2 py-1 rounded whitespace-nowrap pointer-events-none">
                        {social.username}
                      </span>
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Stats / Highlights */}
            <div>
              <h3 className="text-sm font-semibold text-ink mb-3">Highlights</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Chapters Covered</span>
                  <span className="font-semibold text-brand">10+</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Active Students</span>
                  <span className="font-semibold text-brand">50+</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Questions Available</span>
                  <span className="font-semibold text-brand">100+</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-200 py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="text-xs text-slate-500">
            © {currentYear} IT Hub 11. Made with{" "}
            <span className="text-blush">❤</span> by{" "}
            
              href="https://github.com/sar0406"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-brand transition-colors hover:text-blush"
            <a>
              Sarthak
            </a>
            . Built for learning.
          </p>
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <a href="https://github.com/sar0406/IT-hub" target="_blank" rel="noopener noreferrer" className="hover:text-brand transition-colors">
              View Source
            </a>
            <span className="text-slate-300">·</span>
            <a href="/changelog" className="hover:text-brand transition-colors">
              Changelog
            </a>
            <span className="text-slate-300">·</span>
            <span>v1.0.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
}