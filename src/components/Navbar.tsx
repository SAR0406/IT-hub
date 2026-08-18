"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { CloseIcon, LogoutIcon, MenuIcon } from "@/components/icons";
import { LogoutButton } from "@/components/LogoutButton";
import type { Profile } from "@/lib/types";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/chapters", label: "Chapters" },
  { href: "/quizzes", label: "Quizzes" },
  { href: "/tools", label: "Tools" },
  { href: "/search", label: "Search" },
  { href: "/chat", label: "Chat" },
  { href: "/about", label: "About" },
];

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join("");
}

export function Navbar({ profile }: { profile: Profile | null }) {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const homeHref = profile?.role === "admin" ? "/admin" : "/chapters";
  const links = profile?.role === "admin" ? [...NAV_LINKS, { href: "/admin", label: "Admin" }] : NAV_LINKS;

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper/85 backdrop-blur-xl">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-brand/10 via-brand/70 to-teal/40"
      />
      <nav
        className="mx-auto flex h-[72px] max-w-6xl items-center justify-between px-4 sm:px-6"
        aria-label="Main navigation"
      >
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand to-brand-strong font-mono text-sm font-bold text-white shadow-soft transition-transform group-hover:-translate-y-0.5">
            11
          </span>
          <span className="font-display text-base font-bold tracking-tight text-ink">
            IT Hub <span className="text-brand">11</span>
          </span>
        </Link>

        <div className="surface-card hidden items-center gap-1 rounded-2xl p-1 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(pathname, link.href) ? "page" : undefined}
              className={`rounded-xl px-3.5 py-2 text-sm font-semibold transition-all ${
                isActive(pathname, link.href)
                  ? "bg-white text-brand-strong shadow-soft"
                  : "text-slate-600 hover:bg-white/85 hover:text-ink"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          {profile ? (
            <>
              <Link
                href={homeHref}
                className="surface-card flex items-center gap-2 rounded-full py-1 pl-1 pr-3 transition-colors hover:border-brand/40"
                title={profile.full_name}
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand-strong text-[11px] font-bold text-white">
                  {initials(profile.full_name)}
                </span>
                <span className="text-sm font-semibold text-ink">
                  {profile.full_name.split(" ")[0]}
                </span>
                <span className="pill-muted rounded-full px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-500">
                  {profile.role === "admin" ? "Admin" : "Student"}
                </span>
              </Link>
              <LogoutButton />
            </>
          ) : (
            <Link
              href="/login"
              className="btn-primary flex h-10 items-center rounded-xl px-4 text-sm font-semibold transition-all"
            >
              Get Started
            </Link>
          )}
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          className="surface-card flex h-10 w-10 items-center justify-center rounded-xl text-ink hover:bg-white md:hidden"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <CloseIcon width={22} height={22} /> : <MenuIcon width={22} height={22} />}
        </button>
      </nav>

      {menuOpen && (
        <div className="border-t border-line bg-paper/95 px-4 py-3 backdrop-blur md:hidden">
          {profile && (
            <div className="surface-card mb-2 flex items-center justify-between rounded-2xl px-3 py-2.5">
              <Link href={homeHref} className="flex min-w-0 items-center gap-2.5" onClick={() => setMenuOpen(false)}>
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand-strong text-xs font-bold text-white">
                  {initials(profile.full_name)}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-ink">
                    {profile.full_name}
                  </span>
                  <span className="block text-[11px] text-slate-500">
                    {profile.role === "admin" ? "Administrator" : "Student account"}
                  </span>
                </span>
              </Link>
              <button
                type="button"
                onClick={async () => {
                  try {
                    const { createClient } = await import("@/lib/supabase/client");
                    const supabase = createClient();
                    await supabase.auth.signOut();
                  } catch {
                    // Auth service unreachable — sign out locally anyway.
                  }
                  setMenuOpen(false);
                  router.push("/login");
                  router.refresh();
                }}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-200 hover:text-red-600"
                aria-label="Sign out"
              >
                <LogoutIcon width={17} height={17} />
              </button>
            </div>
          )}
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              aria-current={isActive(pathname, link.href) ? "page" : undefined}
              className={`mb-1 block rounded-xl px-3 py-3 text-base font-medium ${
                isActive(pathname, link.href)
                  ? "bg-brand-soft text-brand-strong"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              {link.label}
            </Link>
          ))}
          {!profile && (
            <Link
              href="/login"
              onClick={() => setMenuOpen(false)}
              className="btn-primary mt-2 flex h-11 items-center justify-center rounded-xl text-sm font-semibold transition-all"
            >
              Sign in
            </Link>
          )}
        </div>
      )}
    </header>
  );
}