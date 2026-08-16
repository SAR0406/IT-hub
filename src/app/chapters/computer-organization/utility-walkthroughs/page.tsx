import { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { requireUser } from "@/lib/auth";
import { getUnit } from "@/lib/syllabus";

export async function generateMetadata(): Promise<Metadata> {
  const unit = getUnit("computer-organization");
  return { title: `Utility Walkthroughs — ${unit?.name ?? ""}` };
}

export default async function UtilityWalkthroughsPage() {
  await requireUser();
  const unit = getUnit("computer-organization");

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Chapters", href: "/chapters" },
          { label: unit?.name, href: `/chapters/${unit?.slug}` },
          { label: "Utility Walkthroughs" },
        ]}
      />

      <div className="mb-10">
        <p className="font-mono text-xs text-brand">
          ~/it-hub-11/units/computer-organization/utility-walkthroughs
        </p>
        <span className="mt-3 inline-flex rounded-full border border-zinc-200 bg-white px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wide text-slate-500">
          Computer Organization
        </span>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          Utility Walkthroughs
        </h1>
        <p className="mt-3 max-w-2xl text-base text-slate-500">
          Step-by-step guides for Disk Cleanup, Recycle Bin, Command Prompt basics.
        </p>
      </div>

      <article className="prose prose-slate max-w-none space-y-10">
        <section>
          <h2 className="font-mono text-sm text-brand mb-4">Disk Cleanup</h2>
          <p className="text-slate-600 mb-4">
            Disk Cleanup removes unnecessary files to free up disk space and improve system performance.
          </p>
          <div className="space-y-6">
            <div className="p-4 rounded-lg border border-zinc-200 bg-white">
              <h3 className="font-medium text-ink mb-3 flex items-center gap-2">
                <span className="bg-brand text-white text-xs font-mono px-2 py-0.5 rounded">1</span>
                Open Disk Cleanup
              </h3>
              <ol className="list-decimal list-inside text-slate-600 space-y-2">
                <li>Press <kbd className="bg-zinc-100 px-1.5 py-0.5 rounded text-xs font-mono">Win + S</kbd> and type "Disk Cleanup"</li>
                <li>Select the drive you want to clean (usually <strong>C:</strong>)</li>
                <li>Click <strong>OK</strong> — Windows calculates freeable space</li>
              </ol>
            </div>

            <div className="p-4 rounded-lg border border-zinc-200 bg-white">
              <h3 className="font-medium text-ink mb-3 flex items-center gap-2">
                <span className="bg-brand text-white text-xs font-mono px-2 py-0.5 rounded">2</span>
                Select Files to Delete
              </h3>
              <p className="text-slate-600 mb-2">Check these recommended categories:</p>
              <ul className="list-disc list-inside text-sm text-slate-600 space-y-1 ml-4">
                <li><strong>Temporary Internet Files</strong> — Browser cache</li>
                <li><strong>Downloaded Program Files</strong> — ActiveX/Java applets</li>
                <li><strong>Thumbnails</strong> — Image preview cache</li>
                <li><strong>Temporary Files</strong> — App temp data</li>
                <li><strong>Recycle Bin</strong> — Deleted files (if you're sure)</li>
              </ul>
              <p className="mt-2 text-sm text-amber-700">
                ⚠️ Avoid checking "Windows ESD Installation Files" unless you're certain — needed for reset/recovery.
              </p>
            </div>

            <div className="p-4 rounded-lg border border-zinc-200 bg-white">
              <h3 className="font-medium text-ink mb-3 flex items-center gap-2">
                <span className="bg-brand text-white text-xs font-mono px-2 py-0.5 rounded">3</span>
                Clean System Files (Advanced)
              </h3>
              <ol className="list-decimal list-inside text-slate-600 space-y-2">
                <li>Click <strong>Clean up system files</strong> button</li>
                <li>Select drive again, wait for recalculation</li>
                <li>Additional options appear:
                  <ul className="list-disc list-inside ml-4 mt-1 space-y-1 text-sm">
                    <li><strong>Windows Update Cleanup</strong> — Old update files (safe after successful updates)</li>
                    <li><strong>Device Driver Packages</strong> — Old driver versions</li>
                  </ul>
                </li>
                <li>Click <strong>OK</strong> → <strong>Delete Files</strong> to confirm</li>
              </ol>
            </div>

            <div className="p-4 rounded-lg border border-zinc-200 bg-white">
              <h3 className="font-medium text-ink mb-3 flex items-center gap-2">
                <span className="bg-brand text-white text-xs font-mono px-2 py-0.5 rounded">4</span>
                Automate with Storage Sense
              </h3>
              <p className="text-slate-600 mb-2">Windows can automatically clean temp files:</p>
              <ol className="list-decimal list-inside text-slate-600 space-y-2">
                <li>Settings → System → Storage</li>
                <li>Turn on <strong>Storage Sense</strong></li>
                <li>Configure: run daily/weekly, delete files in Recycle Bin > 30 days, Downloads > 60 days</li>
              </ol>
            </div>
          </div>
        </section>

        <section>
          <h2 className="font-mono text-sm text-brand mb-4">Recycle Bin Management</h2>
          <p className="text-slate-600 mb-4">
            The Recycle Bin is a safety net for deleted files. Understanding its behavior prevents data loss.
          </p>
          <div className="space-y-6">
            <div className="p-4 rounded-lg border border-zinc-200 bg-white">
              <h3 className="font-medium text-ink mb-3">How It Works</h3>
              <ul className="list-disc list-inside text-slate-600 space-y-1">
                <li>Deleted files move to <code className="bg-zinc-100 px-1.5 py-0.5 rounded text-xs font-mono">$Recycle.Bin</code> on each drive</li>
                <li>Files retain original name, path, and metadata</li>
                <li>Default size: ~5-10% of drive capacity per drive</li>
                <li><strong>Shift + Delete</strong> bypasses Recycle Bin permanently</li>
              </ul>
            </div>

            <div className="p-4 rounded-lg border border-zinc-200 bg-white">
              <h3 className="font-medium text-ink mb-3">Restore Files</h3>
              <ol className="list-decimal list-inside text-slate-600 space-y-2">
                <li>Double-click Recycle Bin icon on desktop</li>
                <li>Locate file (sort by <strong>Date Deleted</strong> or <strong>Original Location</strong>)</li>
                <li>Right-click → <strong>Restore</strong> (returns to original folder)</li>
                <li>Or drag file to desired folder</li>
              </ol>
            </div>

            <div className="p-4 rounded-lg border border-zinc-200 bg-white">
              <h3 className="font-medium text-ink mb-3">Configure Recycle Bin</h3>
              <ol className="list-decimal list-inside text-slate-600 space-y-2">
                <li>Right-click Recycle Bin → <strong>Properties</strong></li>
                <li>Select drive, adjust <strong>Maximum size (MB)</strong></li>
                <li>Optional: <strong>Don't move files to Recycle Bin</strong> (not recommended)</li>
                <li>Optional: <strong>Display delete confirmation dialog</strong> (recommended)</li>
              </ol>
            </div>

            <div className="p-4 rounded-lg border border-amber-200 bg-amber-50">
              <h3 className="font-medium text-ink mb-2">When Files Are Permanently Lost</h3>
              <ul className="list-disc list-inside text-slate-600 space-y-1">
                <li>Shift + Delete used</li>
                <li>Recycle Bin emptied</li>
                <li>File larger than Recycle Bin max size</li>
                <li>Deleted from removable drive (USB/SD card — no Recycle Bin)</li>
                <li>Deleted via Command Prompt (<code className="bg-zinc-100 px-1.5 py-0.5 rounded text-xs font-mono">del</code>)</li>
              </ul>
              <p className="mt-2 text-sm text-amber-800">
                Recovery possible with specialized software if drive not overwritten.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="font-mono text-sm text-brand mb-4">Command Prompt Basics</h2>
          <p className="text-slate-600 mb-4">
            The Command Prompt (<code className="bg-zinc-100 px-1.5 py-0.5 rounded text-xs font-mono">cmd.exe</code>) provides direct access to Windows internals.
          </p>
          <div className="space-y-6">
            <div className="p-4 rounded-lg border border-zinc-200 bg-white">
              <h3 className="font-medium text-ink mb-3">Opening Command Prompt</h3>
              <ul className="list-disc list-inside text-slate-600 space-y-1">
                <li><strong>Win + R</strong> → type <code className="bg-zinc-100 px-1.5 py-0.5 rounded text-xs font-mono">cmd</code> → Enter</li>
                <li><strong>Win + X</strong> → Command Prompt (or Terminal)</li>
                <li>Search "cmd" in Start menu</li>
                <li><strong>Admin:</strong> Right-click → "Run as administrator" (for system commands)</li>
              </ul>
            </div>

            <div className="p-4 rounded-lg border border-zinc-200 bg-white">
              <h3 className="font-medium text-ink mb-3">Essential Commands</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-zinc-200">
                      <th className="text-left pb-2 font-mono text-brand">Command</th>
                      <th className="text-left pb-2">Description</th>
                      <th className="text-left pb-2 font-mono text-xs text-slate-500">Example</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    <tr><td className="py-1 font-mono">dir</td><td>List directory contents</td><td className="font-mono">dir /w /p</td></tr>
                    <tr><td className="py-1 font-mono">cd</td><td>Change directory</td><td className="font-mono">cd \Users\Name\Documents</td></tr>
                    <tr><td className="py-1 font-mono">mkdir</td><td>Create directory</td><td className="font-mono">mkdir Projects</td></tr>
                    <tr><td className="py-1 font-mono">rmdir /s</td><td>Delete directory + contents</td><td className="font-mono">rmdir /s OldFolder</td></tr>
                    <tr><td className="py-1 font-mono">copy</td><td>Copy files</td><td className="font-mono">copy file.txt backup\</td></tr>
                    <tr><td className="py-1 font-mono">move</td><td>Move/rename files</td><td className="font-mono">move file.txt newname.txt</td></tr>
                    <tr><td className="py-1 font-mono">del</td><td>Delete files (permanent!)</td><td className="font-mono">del *.tmp</td></tr>
                    <tr><td className="py-1 font-mono">type</td><td>Display file contents</td><td className="font-mono">type readme.txt</td></tr>
                    <tr><td className="py-1 font-mono">find</td><td>Search text in files</td><td className="font-mono">find "error" log.txt</td></tr>
                    <tr><td className="py-1 font-mono">ipconfig</td><td>Network configuration</td><td className="font-mono">ipconfig /all</td></tr>
                    <tr><td className="py-1 font-mono">ping</td><td>Test network connectivity</td><td className="font-mono">ping google.com</td></tr>
                    <tr><td className="py-1 font-mono">tracert</td><td>Trace route to host</td><td className="font-mono">tracert 8.8.8.8</td></tr>
                    <tr><td className="py-1 font-mono">systeminfo</td><td>System information</td><td className="font-mono">systeminfo</td></tr>
                    <tr><td className="py-1 font-mono">tasklist</td><td>List running processes</td><td className="font-mono">tasklist | find "chrome"</td></tr>
                    <tr><td className="py-1 font-mono">sfc /scannow</td><td>System file checker</td><td className="font-mono">sfc /scannow (admin)</td></tr>
                    <tr><td className="py-1 font-mono">chkdsk</td><td>Check disk for errors</td><td className="font-mono">chkdsk C: /f /r (admin)</td></tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="p-4 rounded-lg border border-zinc-200 bg-white">
              <h3 className="font-medium text-ink mb-3">Useful Tips</h3>
              <ul className="list-disc list-inside text-slate-600 space-y-2">
                <li><strong>Tab completion:</strong> Type partial name, press Tab to auto-complete</li>
                <li><strong>Up/Down arrows:</strong> Cycle through command history</li>
                <li><strong>F7:</strong> Pop-up command history list</li>
                <li><strong>Ctrl + C:</strong> Cancel running command</li>
                <li><strong>Output redirection:</strong> <code className="bg-zinc-100 px-1.5 py-0.5 rounded text-xs font-mono">command > output.txt</code> saves output</li>
                <li><strong>Pipe:</strong> <code className="bg-zinc-100 px-1.5 py-0.5 rounded text-xs font-mono">command | find "text"</code> filters output</li>
                <li><strong>Help:</strong> <code className="bg-zinc-100 px-1.5 py-0.5 rounded text-xs font-mono">command /?</code> shows usage (e.g., <code className="bg-zinc-100 px-1.5 py-0.5 rounded text-xs font-mono">dir /?</code>)</li>
              </ul>
            </div>

            <div className="p-4 rounded-lg border border-zinc-200 bg-white">
              <h3 className="font-medium text-ink mb-3">Batch Files (.bat)</h3>
              <p className="text-slate-600 mb-2">Automate repetitive tasks:</p>
              <pre className="bg-zinc-900 text-zinc-100 p-4 rounded text-sm font-mono overflow-x-auto"><code>@echo off
echo Backing up Documents...
xcopy "C:\Users\%USERNAME%\Documents" "D:\Backup\Documents" /E /H /Y
echo Backup complete!
pause</code></pre>
              <p className="mt-2 text-sm text-slate-600">
                Save as <code className="bg-zinc-100 px-1.5 py-0.5 rounded text-xs font-mono">backup.bat</code>, double-click to run.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="font-mono text-sm text-brand mb-4">Quick Reference Card</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="p-4 rounded-lg border border-zinc-200 bg-white">
              <h3 className="font-medium text-ink mb-2 text-center">🧹 Disk Cleanup</h3>
              <ul className="text-sm text-slate-600 space-y-1">
                <li>Win+S → "Disk Cleanup"</li>
                <li>Select C: drive</li>
                <li>Check temp files, thumbnails, Recycle Bin</li>
                <li>Click "Clean up system files" for more</li>
                <li>Enable Storage Sense for automation</li>
              </ul>
            </div>
            <div className="p-4 rounded-lg border border-zinc-200 bg-white">
              <h3 className="font-medium text-ink mb-2 text-center">🗑️ Recycle Bin</h3>
              <ul className="text-sm text-slate-600 space-y-1">
                <li>Double-click to open</li>
                <li>Right-click → Restore</li>
                <li>Shift+Delete = permanent</li>
                <li>Configure size in Properties</li>
                <li>No Recycle Bin on USB drives</li>
              </ul>
            </div>
            <div className="p-4 rounded-lg border border-zinc-200 bg-white">
              <h3 className="font-medium text-ink mb-2 text-center">💻 Command Prompt</h3>
              <ul className="text-sm text-slate-600 space-y-1">
                <li>Win+R → cmd</li>
                <li>Tab = auto-complete</li>
                <li>dir, cd, copy, move, del</li>
                <li>ipconfig, ping, tracert</li>
                <li>command /? = help</li>
              </ul>
            </div>
          </div>
        </section>
      </article>
    </div>
  );
}