"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/resources", label: "Resources" },
  { href: "/admin/quizzes", label: "Quizzes" },
  { href: "/admin/announcements", label: "Announcements" },
  { href: "/admin/students", label: "Students" },
  { href: "/admin/activity", label: "Activity" },
  { href: "/admin/flags", label: "Flags" },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Admin sections" className="border-t border-zinc-100 bg-white">
      <div className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 sm:px-6">
        {LINKS.map((link) => {
          const active =
            link.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={active ? "page" : undefined}
              className={`shrink-0 border-b-2 px-3 py-2.5 text-sm font-semibold transition-colors ${
                active
                  ? "border-brand text-brand"
                  : "border-transparent text-slate-500 hover:text-ink"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}