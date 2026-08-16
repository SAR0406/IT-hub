import Link from "next/link";
import { AdminNav } from "@/components/AdminNav";
import { LogoutButton } from "@/components/LogoutButton";
import { getSessionProfile, requireAdmin } from "@/lib/auth";
import { AdminLogin } from "./AdminLogin";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Admin — IT Hub 11", template: "%s — IT Hub 11 Admin" },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  // Guests see the admin sign-in form right on /admin. Students are
  // flagged and redirected by requireAdmin below.
  const profile = await getSessionProfile();
  if (!profile) {
    return <AdminLogin />;
  }

  const ctx = await requireAdmin();

  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-ink font-mono text-xs font-bold text-white">
              &gt;_
            </span>
            <span className="font-mono text-xs text-slate-500">it-hub-11 / admin</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden font-mono text-[11px] text-slate-400 sm:block">
              {ctx.profile.full_name} · {ctx.profile.email}
            </span>
            <Link
              href="/"
              className="text-xs font-semibold text-brand hover:text-brand-strong"
            >
              View site →
            </Link>
            <LogoutButton />
          </div>
        </div>
        <AdminNav />
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}