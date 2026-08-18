import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { requireUser } from "@/lib/auth";
import { getUnit } from "@/lib/syllabus";
import { PasswordTools } from "./PasswordTools";

export async function generateMetadata(): Promise<Metadata> {
  const unit = getUnit("networking-internet");
  return { title: `Password Security & Checklist — ${unit?.name ?? ""}` };
}

export default async function PasswordSecurityPage() {
  await requireUser();
  const unit = getUnit("networking-internet");
  if (!unit) notFound();

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Chapters", href: "/chapters" },
          { label: unit.name, href: `/chapters/${unit.slug}` },
          { label: "Password Security & Checklist" },
        ]}
      />

      <div className="mb-10">
        <p className="font-mono text-xs text-brand">
          ~/it-hub-11/units/networking-internet/password-security
        </p>
        <span className="mt-3 inline-flex rounded-full border border-zinc-200 bg-white px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wide text-slate-500">
          Networking & Internet
        </span>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          Password Security & Checklist
        </h1>
        <p className="mt-3 max-w-2xl text-base text-slate-500">
          Creating strong passwords, multi-factor authentication and a practical checklist.
        </p>
      </div>

      <article className="prose prose-slate max-w-none space-y-10">
        <section>
          <h2 className="font-mono text-sm text-brand mb-4">Why Password Security Matters</h2>
          <p className="text-slate-600 mb-4">
            Passwords are the first line of defense for your digital identity. Weak or reused
            passwords are the #1 cause of account compromise. A single breached password can
            lead to a cascade of takeovers across multiple services.
          </p>
          <div className="p-4 rounded-lg border border-zinc-200 bg-white">
            <h3 className="font-medium text-ink mb-2">Key Statistics</h3>
            <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
              <li>80% of data breaches involve weak or stolen passwords</li>
              <li>Average person has 100+ online accounts</li>
              <li>65% of people reuse passwords across multiple sites</li>
              <li>12-character password takes ~200 years to crack vs 8-char (~8 hours)</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="font-mono text-sm text-brand mb-4">Creating Strong Passwords</h2>
          <div className="space-y-4">
            <div className="p-4 rounded-lg border border-zinc-200 bg-white">
              <h3 className="font-medium text-ink mb-2">Passphrase Method (Recommended)</h3>
              <p className="text-slate-600 mb-2">
                Combine 4-6 random words. Easier to remember, harder to crack.
              </p>
              <code className="bg-zinc-100 px-2 py-1 rounded text-sm font-mono text-brand">
                correct-horse-battery-staple-92
              </code>
            </div>
            <div className="p-4 rounded-lg border border-zinc-200 bg-white">
              <h3 className="font-medium text-ink mb-2">Sentence Method</h3>
              <p className="text-slate-600 mb-2">
                Take a memorable sentence and use first letters + substitutions.
              </p>
              <code className="bg-zinc-100 px-2 py-1 rounded text-sm font-mono text-brand">
                I graduated from High School in 2010! → IgfHSi2010!
              </code>
            </div>
            <div className="p-4 rounded-lg border border-zinc-200 bg-white">
              <h3 className="font-medium text-ink mb-2">Use a Password Manager</h3>
              <p className="text-slate-600">
                Generate and store unique, complex passwords for every site.
                You only need to remember one master password.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="font-mono text-sm text-brand mb-4">Multi-Factor Authentication (MFA)</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="p-4 rounded-lg border border-zinc-200 bg-white text-center">
              <div className="text-3xl mb-2">📱</div>
              <h3 className="font-medium text-ink mb-1">Authenticator Apps</h3>
              <p className="text-sm text-slate-600">
                Google Authenticator, Authy, Microsoft Authenticator — Time-based codes
              </p>
            </div>
            <div className="p-4 rounded-lg border border-zinc-200 bg-white text-center">
              <div className="text-3xl mb-2">🔑</div>
              <h3 className="font-medium text-ink mb-1">Hardware Keys</h3>
              <p className="text-sm text-slate-600">
                YubiKey, Titan Key — Physical devices, phishing-resistant
              </p>
            </div>
            <div className="p-4 rounded-lg border border-zinc-200 bg-white text-center">
              <div className="text-3xl mb-2">📧</div>
              <h3 className="font-medium text-ink mb-1">Email/SMS Codes</h3>
              <p className="text-sm text-slate-600">
                Better than nothing, but vulnerable to SIM swapping and interception
              </p>
            </div>
          </div>
        </section>

        <PasswordTools />

        <section>
          <h2 className="font-mono text-sm text-brand mb-4">Quick Reference: Do&rsquo;s &amp; Don&rsquo;ts</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="p-4 rounded-lg border border-green-200 bg-green-50">
              <h3 className="font-medium text-green-800 mb-2 flex items-center gap-2">✅ Do</h3>
              <ul className="list-disc list-inside text-sm text-green-700 space-y-1">
                <li>Use unique passwords for every account</li>
                <li>Enable MFA everywhere possible</li>
                <li>Use a reputable password manager</li>
                <li>Check haveibeenpwned.com regularly</li>
                <li>Change passwords after breaches</li>
              </ul>
            </div>
            <div className="p-4 rounded-lg border border-red-200 bg-red-50">
              <h3 className="font-medium text-red-800 mb-2 flex items-center gap-2">❌ Don&rsquo;t</h3>
              <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
                <li>Reuse passwords across sites</li>
                <li>Use dictionary words or patterns</li>
                <li>Include personal information</li>
                <li>Share passwords via email/chat</li>
                <li>Store passwords in browsers without master password</li>
              </ul>
            </div>
          </div>
        </section>
      </article>
    </div>
  );
}
