// IT Hub 11 — demo seed data.
//
// Uploads one small, clearly-marked demo text file per unit and registers
// it as a resource, so the whole flow (counts, search, open, download,
// admin list) can be tested immediately.
//
// Usage:
//   node --env-file=.env.local scripts/seed-demo.mjs
//
// The teacher should delete these demo rows from /admin once real material
// is uploaded (deleting a row removes its file too).
//
// Admin credentials must be set in .env.local as ADMIN_EMAIL / ADMIN_PASSWORD
// (same account used to log in at /admin/login).

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const adminEmail = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_PASSWORD;

if (!supabaseUrl || !supabaseKey || !adminEmail || !adminPassword) {
  console.error(
    "Missing env vars. Add NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, ADMIN_EMAIL and ADMIN_PASSWORD to .env.local"
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const DEMOS = [
  {
    unit: "employability-skills",
    title: "Demo — Employability Skills overview (placeholder)",
    description:
      "Sample resource. Your teacher will replace this with the real material.",
  },
  {
    unit: "computer-organization",
    title: "Demo — Computer Organization overview (placeholder)",
    description:
      "Sample resource. Your teacher will replace this with the real material.",
  },
  {
    unit: "networking-internet",
    title: "Demo — Networking & Internet overview (placeholder)",
    description:
      "Sample resource. Your teacher will replace this with the real material.",
  },
  {
    unit: "office-automation-tools",
    title: "Demo — Office Automation overview (placeholder)",
    description:
      "Sample resource. Your teacher will replace this with the real material.",
  },
  {
    unit: "rdbms",
    title: "Demo — RDBMS overview (placeholder)",
    description:
      "Sample resource. Your teacher will replace this with the real material.",
  },
  {
    unit: "fundamentals-of-java",
    title: "Demo — Fundamentals of Java overview (placeholder)",
    description:
      "Sample resource. Your teacher will replace this with the real material.",
  },
];

const { data: session, error: loginError } = await supabase.auth.signInWithPassword({
  email: adminEmail,
  password: adminPassword,
});

if (loginError) {
  console.error(`Admin login failed: ${loginError.message}`);
  process.exit(1);
}

let uploaded = 0;
let skipped = 0;

for (const demo of DEMOS) {
  const filePath = `${demo.unit}/demo-${demo.unit}.txt`;
  const content = `IT HUB 11 — DEMO RESOURCE\n\nThis is a placeholder file for the unit "${demo.unit}".\nIt exists so the site can be tested before real material is uploaded.\n\nYour teacher will replace this with real notes, worksheets or question papers.`;

  const { error: existsError } = await supabase.storage
    .from("resources")
    .info(filePath);

  if (!existsError) {
    // Already seeded — skip to keep the script idempotent.
    skipped += 1;
    continue;
  }

  const { error: uploadError } = await supabase.storage
    .from("resources")
    .upload(filePath, new Blob([content], { type: "text/plain" }), {
      contentType: "text/plain",
      upsert: false,
    });

  if (uploadError) {
    console.error(`Upload failed for ${demo.unit}: ${uploadError.message}`);
    continue;
  }

  const { error: insertError } = await supabase.from("resources").insert({
    title: demo.title,
    file_name: `demo-${demo.unit}.txt`,
    file_path: filePath,
    file_type: "text/plain",
    file_size: new Blob([content]).size,
    unit_slug: demo.unit,
    topic_slug: null,
    resource_type: "Other",
    description: demo.description,
  });

  if (insertError) {
    console.error(`Insert failed for ${demo.unit}: ${insertError.message}`);
    await supabase.storage.from("resources").remove([filePath]);
    continue;
  }

  uploaded += 1;
}

console.log(`Done. Uploaded ${uploaded} demo resource(s), skipped ${skipped} already-seeded.`);