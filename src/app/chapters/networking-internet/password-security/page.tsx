import { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { requireUser } from "@/lib/auth";
import { getUnit } from "@/lib/syllabus";
import { useState } from "react";

export async function generateMetadata(): Promise<Metadata> {
  const unit = getUnit("networking-internet");
  return { title: `Password Security & Checklist — ${unit?.name ?? ""}` };
}

const CHECKLIST_ITEMS = [
  { id: 1, text: "At least 12 characters long", weight: 2 },
  { id: 2, text: "Mix of uppercase and lowercase letters", weight: 1 },
  { id: 3, text: "Includes numbers (0-9)", weight: 1 },
  { id: 4, text: "Includes special symbols (!@#$%^&*)", weight: 2 },
  { id: 5, text: "No dictionary words or common patterns", weight: 3 },
  { id: 6, text: "No personal info (name, birthdate, phone)", weight: 3 },
  { id: 7, text: "Unique — not reused on other sites", weight: 3 },
  { id: 8, text: "Stored in a password manager", weight: 2 },
  { id: 9, text: "Multi-factor authentication enabled", weight: 3 },
  { id: 10, text: "Changed after known breaches", weight: 2 },
];

function calculateScore(checked: number[]): number {
  return checked.reduce((sum, id) => {
    const item = CHECKLIST_ITEMS.find((i) => i.id === id);
    return sum + (item?.weight ?? 0);
  }, 0);
}

function getMaxScore(): number {
  return CHECKLIST_ITEMS.reduce((sum, item) => sum + item.weight, 0);
}

export default function PasswordSecurityPage() {
  await requireUser();
  const unit = getUnit("networking-internet");
  const [checked, setChecked] = useState<number[]>([]);
  const [customPassword, setCustomPassword] = useState("");

  const toggleCheck = (id: number) => {
    setChecked((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const score = calculateScore(checked);
  const maxScore = getMaxScore();
  const percentage = Math.round((score / maxScore) * 100);

  const checkStrength = (pwd: string) => {
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (pwd.length >= 12) strength++;
    if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) strength++;
    if (/\d/.test(pwd)) strength++;
    if (/[^A-Za-z0-9]/.test(pwd)) strength++;
    if (!/(.)\1{2,}/.test(pwd)) strength++; // no repeating chars
    return strength;
  };

  const customStrength = checkStrength(customPassword);
  const strengthLabels = ["Very Weak", "Weak", "Fair", "Good", "Strong", "Very Strong"];
  const strengthColors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-lime-500", "bg-green-500", "bg-emerald-500"];

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Chapters", href: "/chapters" },
          { label: unit?.name, href: `/chapters/${unit?.slug}` },
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
              <p className="text-sm text-slate-600">Google Authenticator, Authy, Microsoft Authenticator — Time-based codes</p>
            </div>
            <div className="p-4 rounded-lg border border-zinc-200 bg-white text-center">
              <div className="text-3xl mb-2">🔑</div>
              <h3 className="font-medium text-ink mb-1">Hardware Keys</h3>
              <p className="text-sm text-slate-600">YubiKey, Titan Key — Physical devices, phishing-resistant</p>
            </div>
            <div className="p-4 rounded-lg border border-zinc-200 bg-white text-center">
              <div className="text-3xl mb-2">📧</div>
              <h3 className="font-medium text-ink mb-1">Email/SMS Codes</h3>
              <p className="text-sm text-slate-600">Better than nothing, but vulnerable to SIM swapping and interception</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="font-mono text-sm text-brand mb-4">Interactive Password Strength Checker</h2>
          <div className="p-4 rounded-lg border border-zinc-200 bg-white">
            <label className="block text-sm font-medium text-ink mb-2">
              Test a password (never enter real passwords!):
            </label>
            <input
              type="text"
              value={customPassword}
              onChange={(e) => setCustomPassword(e.target.value)}
              placeholder="Enter a test password..."
              className="w-full border rounded px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-brand"
            />
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-ink">Strength: {strengthLabels[customStrength] ?? "Very Weak"}</span>
                <span className="text-sm text-slate-500">{customStrength}/6</span>
              </div>
              <div className="h-2 bg-zinc-200 rounded-full overflow-hidden">
                <div
                  className={`h-full ${strengthColors[customStrength] ?? "bg-red-500"} transition-all duration-300`}
                  style={{ width: `${((customStrength + 1) / 6) * 100}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-slate-500">
                Note: This runs locally in your browser. No data is sent anywhere.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="font-mono text-sm text-brand mb-4">Password Security Checklist</h2>
          <p className="text-slate-600 mb-4">
            Check each item that applies to your current password practices.
            Score: <strong className="text-ink">{score}/{maxScore} ({percentage}%)</strong>
          </p>
          <div className="p-4 rounded-lg border border-zinc-200 bg-white">
            <div className="h-3 bg-zinc-200 rounded-full overflow-hidden mb-4">
              <div
                className={`h-full transition-all duration-300 ${
                  percentage >= 80 ? "bg-green-500" : percentage >= 60 ? "bg-yellow-500" : "bg-red-500"
                }`}
                style={{ width: `${percentage}%` }}
              />
            </div>
            <ul className="space-y-2">
              {CHECKLIST_ITEMS.map((item) => (
                <li
                  key={item.id}
                  className="flex items-start gap-3 p-3 rounded-lg border border-zinc-200 hover:border-brand/40 transition-colors"
                >
                  <input
                    type="checkbox"
                    id={`check-${item.id}`}
                    checked={checked.includes(item.id)}
                    onChange={() => toggleCheck(item.id)}
                    className="mt-1 h-4 w-4 rounded border-zinc-300 text-brand focus:ring-brand focus:ring-2"
                  />
                  <label
                    htmlFor={`check-${item.id}`}
                    className="flex-1 cursor-pointer text-sm text-slate-600"
                  >
                    {item.text}
                    <span className="ml-2 text-xs font-mono text-slate-400">(+{item.weight})</span>
                  </label>
                </li>
              ))}
            </ul>
            <div className="mt-4 p-3 rounded-lg bg-brand-soft border border-brand/20">
              <p className="text-sm text-brand font-medium">
                {percentage >= 80
                  ? "🎉 Excellent! Your password hygiene is strong."
                  : percentage >= 60
                  ? "⚠️ Good start. Review unchecked items to improve."
                  : "🚨 Needs improvement. Focus on high-weight items first."}
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="font-mono text-sm text-brand mb-4">Quick Reference: Do's & Don'ts</h2>
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
              <h3 className="font-medium text-red-800 mb-2 flex items-center gap-2">❌ Don't</h3>
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