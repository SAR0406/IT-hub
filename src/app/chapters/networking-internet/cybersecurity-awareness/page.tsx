import { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { requireUser } from "@/lib/auth";
import { getUnit } from "@/lib/syllabus";

export async function generateMetadata(): Promise<Metadata> {
  const unit = getUnit("networking-internet");
  return { title: `Cybersecurity Awareness — ${unit?.name ?? ""}` };
}

export default async function CybersecurityAwarenessPage() {
  await requireUser();
  const unit = getUnit("networking-internet");

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Chapters", href: "/chapters" },
          { label: unit?.name, href: `/chapters/${unit?.slug}` },
          { label: "Cybersecurity Awareness" },
        ]}
      />

      <div className="mb-10">
        <p className="font-mono text-xs text-brand">
          ~/it-hub-11/units/networking-internet/cybersecurity-awareness
        </p>
        <span className="mt-3 inline-flex rounded-full border border-zinc-200 bg-white px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wide text-slate-500">
          Networking & Internet
        </span>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          Cybersecurity Awareness
        </h1>
        <p className="mt-3 max-w-2xl text-base text-slate-500">
          Threats, vulnerabilities, safe browsing habits and online safety practices.
        </p>
      </div>

      <article className="prose prose-slate max-w-none">
        <section className="mb-10">
          <h2 className="font-mono text-sm text-brand mb-4">Common Threats</h2>
          <div className="space-y-6">
            <div className="p-4 rounded-lg border border-zinc-200 bg-white">
              <h3 className="font-medium text-ink mb-2">Malware</h3>
              <p className="text-slate-600">
                Malicious software designed to damage, disrupt, or gain unauthorized access to
                computer systems. Includes viruses, worms, trojans, ransomware, and spyware.
              </p>
              <ul className="mt-2 list-disc list-inside text-sm text-slate-600 space-y-1">
                <li><strong>Virus:</strong> Attaches to files and spreads when executed</li>
                <li><strong>Worm:</strong> Self-replicating, spreads across networks</li>
                <li><strong>Trojan:</strong> Disguised as legitimate software</li>
                <li><strong>Ransomware:</strong> Encrypts files, demands payment for decryption</li>
                <li><strong>Spyware:</strong> Secretly monitors user activity</li>
              </ul>
            </div>

            <div className="p-4 rounded-lg border border-zinc-200 bg-white">
              <h3 className="font-medium text-ink mb-2">Phishing</h3>
              <p className="text-slate-600">
                Social engineering attacks that trick users into revealing sensitive information
                by masquerading as trustworthy entities.
              </p>
              <ul className="mt-2 list-disc list-inside text-sm text-slate-600 space-y-1">
                <li><strong>Email phishing:</strong> Fake emails from "banks," "services," etc.</li>
                <li><strong>Spear phishing:</strong> Targeted attacks on specific individuals</li>
                <li><strong>Smishing:</strong> Phishing via SMS/text messages</li>
                <li><strong>Vishing:</strong> Voice phishing via phone calls</li>
              </ul>
            </div>

            <div className="p-4 rounded-lg border border-zinc-200 bg-white">
              <h3 className="font-medium text-ink mb-2">Social Engineering</h3>
              <p className="text-slate-600">
                Psychological manipulation to trick people into breaking security procedures.
              </p>
              <ul className="mt-2 list-disc list-inside text-sm text-slate-600 space-y-1">
                <li><strong>Pretexting:</strong> Creating a fabricated scenario to steal info</li>
                <li><strong>Baiting:</strong> Offering something enticing to deliver malware</li>
                <li><strong>Tailgating:</strong> Following authorized person into restricted area</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="font-mono text-sm text-brand mb-4">Safe Browsing Habits</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="p-4 rounded-lg border border-zinc-200 bg-white">
              <h3 className="font-medium text-ink mb-2 flex items-center gap-2">
                <span className="text-brand">🔒</span> HTTPS Everywhere
              </h3>
              <p className="text-sm text-slate-600">
                Always check for HTTPS (padlock icon) before entering sensitive data.
                Use browser extensions to force HTTPS where available.
              </p>
            </div>
            <div className="p-4 rounded-lg border border-zinc-200 bg-white">
              <h3 className="font-medium text-ink mb-2 flex items-center gap-2">
                <span className="text-brand">🛡️</span> Keep Software Updated
              </h3>
              <p className="text-sm text-slate-600">
                Enable automatic updates for OS, browsers, and applications.
                Patches fix known vulnerabilities that attackers exploit.
              </p>
            </div>
            <div className="p-4 rounded-lg border border-zinc-200 bg-white">
              <h3 className="font-medium text-ink mb-2 flex items-center gap-2">
                <span className="text-brand">🔍</span> Verify Before You Click
              </h3>
              <p className="text-sm text-slate-600">
                Hover over links to see actual URL. Check sender email addresses carefully.
                Don't download attachments from unknown sources.
              </p>
            </div>
            <div className="p-4 rounded-lg border border-zinc-200 bg-white">
              <h3 className="font-medium text-ink mb-2 flex items-center gap-2">
                <span className="text-brand">💾</span> Regular Backups
              </h3>
              <p className="text-sm text-slate-600">
                Follow the 3-2-1 rule: 3 copies, 2 different media, 1 offsite.
                Test restores periodically.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="font-mono text-sm text-brand mb-4">Online Safety Practices</h2>
          <div className="space-y-4">
            <div className="p-4 rounded-lg border border-zinc-200 bg-white">
              <h3 className="font-medium text-ink mb-2">Digital Footprint Management</h3>
              <p className="text-slate-600">
                What you post online stays online. Review privacy settings on social media.
                Use pseudonyms for non-essential accounts. Google yourself periodically.
              </p>
            </div>
            <div className="p-4 rounded-lg border border-zinc-200 bg-white">
              <h3 className="font-medium text-ink mb-2">Public Wi-Fi Safety</h3>
              <p className="text-slate-600">
                Avoid sensitive transactions on public Wi-Fi. Use a VPN if necessary.
                Disable auto-connect. Forget networks after use.
              </p>
            </div>
            <div className="p-4 rounded-lg border border-zinc-200 bg-white">
              <h3 className="font-medium text-ink mb-2">Device Security</h3>
              <p className="text-slate-600">
                Use screen locks (PIN, biometric). Enable device encryption. Install
                reputable antivirus. Enable "Find My Device" features.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="font-mono text-sm text-brand mb-4">Incident Response</h2>
          <div className="p-4 rounded-lg border border-amber-200 bg-amber-50">
            <h3 className="font-medium text-ink mb-2">If You Suspect a Compromise:</h3>
            <ol className="list-decimal list-inside text-slate-600 space-y-2">
              <li>Disconnect from internet immediately</li>
              <li>Change passwords from a clean device</li>
              <li>Run full antivirus scan</li>
              <li>Check for unauthorized account activity</li>
              <li>Report to relevant authorities (bank, IT admin, cybercrime portal)</li>
              <li>Monitor accounts for suspicious activity</li>
            </ol>
          </div>
        </section>
      </article>
    </div>
  );
}