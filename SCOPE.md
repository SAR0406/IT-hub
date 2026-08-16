# IT-11 — Scope Document

Every feature discussed, marked for reality. Legend:

- **SHIPPED** — live in production now
- **V1** — core scope; must be finished before we call the product done
- **V2** — next round of features (built after V1 closes)
- **V3** — later; needs infrastructure or a real user base first
- **CUT** — deliberately rejected; will not build

Note: the inventory that sparked this doc listed student accounts, dashboards,
quizzes and announcements under "cut/future" — they are **SHIPPED** now. Chat was
added after. This doc supersedes that inventory.

---

## 1. Core platform

| Feature | Status |
|---|---|
| Home, chapters, units, topics, search, about | SHIPPED |
| Admin area + admin login | SHIPPED |
| Breadcrumbs, mobile nav, keyboard nav, focus states | SHIPPED |
| Resource counts per unit | SHIPPED |
| CBSE / Class 11 identity | SHIPPED |
| Academic session display (2026-27) | V2 |
| Recent/new material indicators | V2 |

## 2. Resource / notes system

| Feature | Status |
|---|---|
| All resource types (notes, PDFs, practicals, worksheets, QPs, assignments, other) | SHIPPED |
| Open / download / upload / delete + confirm | SHIPPED |
| Metadata display (title, type, size, date, description) | SHIPPED |
| Grouping by unit + topic, newest-first, empty states | SHIPPED |
| Supabase Storage + DB metadata, consistent deletes | SHIPPED |
| Teacher-verified badge | SHIPPED (admin toggle + STATUS / VERIFIED badge) |
| Replace/update uploaded material | V2 |

## 3. Search

| Feature | Status |
|---|---|
| Search by title, filename, unit, topic, type; counts; empty/no-result states | SHIPPED |
| Full-text PDF search, semantic search | V3 |

## 4. Admin / teacher system

| Feature | Status |
|---|---|
| Teacher login, protected uploads/deletes, public student browsing | SHIPPED |
| Upload workflow (unit → topic → title → description → type → file) | SHIPPED |
| Announcements (create/delete) | SHIPPED |
| Resource management + confirm deletion | SHIPPED |
| Teacher-verified marking | V2 |
| Replace material | V2 |
| Advanced CMS | CUT |
| Notification system | CUT |

## 5. Teacher analytics

Raw data exists today (activity logs, quiz attempts, flags, downloads).

| Feature | Status |
|---|---|
| Student counts, active students, progress, quiz scores | V3 |
| Weak-topic / class-average analysis | V3 |
| Assignment tracking (late/missing) | V3 (needs submissions, §17) |
| AI usage statistics | V3 (usage rows logged per call today) |

## 6. AI tutor / "Ask the Archive"

| Feature | Status |
|---|---|
| Full AI tutor with teaching modes, mark-based answers, follow-ups | CUT |
| **Ask AI chat room** (NVIDIA NIM GPT-OSS-120B, per-student daily cap, admin kill switch, moderation) | SHIPPED |
| **AI with tools**: syllabus lookup, archive search, file links in chat, quiz info | SHIPPED |
| **Teacher tools**: AI student-record lookup (admin only) | SHIPPED |
| AI quiz generator for teachers (unit/topic/difficulty → review → publish) | SHIPPED |
| Student records page (/admin/students/[id]: profile, activity, attempts, flags, downloads) | SHIPPED |
| Websearch tool (Tavily free tier behind key; tool hidden when unconfigured) | SHIPPED |
| Narrow V2 vision: upload PDF → index → ask → answer from that PDF | V3 |
| Source references / citations under answers | V3 (with the above) |

## 7. Personal learning

| Feature | Status |
|---|---|
| Student accounts, profiles, instant signup, sign-in | SHIPPED |
| Dashboard: progress, mission list, announcements | SHIPPED |
| Weak-topic detection (from quiz attempts) | V2 |
| Study streak, daily tasks, habit tracking | CUT (vanity metrics, not school need) |
| Study planner, exam countdown, pomodoro | V3 |
| AI-generated study plan | CUT |

## 8. Quiz & assessment

| Feature | Status |
|---|---|
| Admin-built MCQ quizzes, rooms by unit, instant scoring, answer review, retakes | SHIPPED |
| Student quiz list + best-score tracking | SHIPPED |
| Timed quizzes | SHIPPED (optional per-quiz timer, auto-submit on timeout) |
| Explanations on questions | V2 |
| Weak-topic identification from attempts | V2 |
| AI-generated questions | V3 |
| Full exam mode (marks distribution, descriptive answers) | V3 |
| Revision modes | V3 |

## 9. Gamification

| Feature | Status |
|---|---|
| XP, streaks, badges, leaderboards, class ranking, mastery | CUT |
| Gentle mission list on dashboard | SHIPPED (keep; no ranking) |

Rationale: leaderboards in a classroom create losers, not learners. CUT stands.

## 10. Chapter learning system

| Feature | Status |
|---|---|
| Topics as resource shelves (notes/downloads) | SHIPPED |
| Per-chapter Learn → Practice → Quiz ladder | V2 |
| Interactive demos per chapter | V3 |

## 11. Computer organization

| Feature | Status |
|---|---|
| Fundamentals notes, block diagram, CPU/ALU/CU, memory, OS content | SHIPPED (resources) |
| Troubleshooting simulators (display/keyboard/mouse/printer…) | V3 |
| Clickable diagram, CPU visualizer, memory explorer | V3 |
| Utility walkthroughs (Disk Cleanup, Recycle Bin, CMD) | V2 (as tutorial pages) |

## 12. Networking & Internet

| Feature | Status |
|---|---|
| Fundamentals, transmission media, devices, topologies, protocols notes | SHIPPED (resources) |
| Bandwidth / transfer-time calculators | V2 (tiny client-side tools) |
| Cybersecurity awareness pages + password checklist | V2 |
| Network / topology simulator, drag-and-drop | V3 |
| Phishing/malware simulators | V3 |

## 13. Office automation

| Feature | Status |
|---|---|
| Writer/Calc/Impress tutorials + assignments as resources | SHIPPED |
| Calc playground (formulas, references, charts) | V2 |
| Macro tutorial/recording | V3 |

## 14. RDBMS

| Feature | Status |
|---|---|
| Concepts, keys, terminology, SQL/MySQL notes | SHIPPED (resources) |
| **SQL playground: browser editor, client-side execution (PGlite), missions, error explanations** | **V2 — next build** |
| Key visualizer | V3 |

## 15. Fundamentals of Java

| Feature | Status |
|---|---|
| Basics-to-exceptions notes | SHIPPED (resources) |
| Java playground (in-browser compiler) | V3 (heavy; revisit) |
| Memory/control-flow visualizers, debugging challenges | V3 |

## 16. Employability skills

| Feature | Status |
|---|---|
| All five units' notes + terminology | SHIPPED (resources) |
| Scenario/situation quizzes (reuse quiz system) | V2 |
| E-waste calculator, green-IT pages | V2 |
| AI communication coach, pitch evaluation | CUT |

## 17. Practical / assignments

| Feature | Status |
|---|---|
| Practical pages: objective → requirements → steps → code → expected output, "try yourself" (hide solution) | V2 |
| Assignment upload/submission + teacher review | V3 |

## 18. Notices / communication

| Feature | Status |
|---|---|
| Announcements on dashboard | SHIPPED |
| Class chat (real-time, rooms per unit, moderation) | SHIPPED |
| Homework/deadline-specific posting | V2 (extend announcements) |

## 19. Offline / low-internet ("Bookless mode")

| Feature | Status |
|---|---|
| Download whole chapter/unit as a bundle, offline access | SHIPPED (/bookless — one zip per unit) |
| Low-data experience | SHIPPED (same bundles; zip, not individual PDFs) |

Motivated by the actual school situation. Do this before any simulator work.

## 20-22. Visual / branding

| Feature | Status |
|---|---|
| Editorial type scale, mono labels (UNIT/05, FILE/PDF), terminal motif, caret | SHIPPED |
| Multi-color per-section accents (chapters/quizzes/search/dashboard/admin/auth) | SHIPPED |
| Doodles, float motion, reduced-motion support, rise-in reveals | SHIPPED |
| Paper grain / torn paper / tape details | V3 (decorative polish) |
| Light/dark environment switching | CUT (keep one light world) |

## 23. UX / quality

| Feature | Status |
|---|---|
| Responsive all breakpoints, no horizontal scroll, large tap targets | SHIPPED |
| Semantic HTML, ARIA, focus states, AA contrast | SHIPPED |
| Skeletons, empty states, friendly errors | SHIPPED |
| Minimal JS, no heavy libraries | SHIPPED |

## 24. Technical infrastructure

| Feature | Status |
|---|---|
| Next.js + TS + Tailwind + Supabase + Vercel, RLS everywhere | SHIPPED |
| Activity logs, misbehavior flags, admin moderation | SHIPPED |
| `.env.example`, DB indexes, clean component structure | SHIPPED |
| README / setup docs | V1 (pending) |
| Seed data (demo quiz + a few messages) | V1 (pending) |

## 25. Cut list (final)

- ChatGPT-style global AI tutor with teaching modes (the Ask AI room covers the need)
- Gamification: XP, badges, leaderboards, class ranking
- Notification system, advanced CMS, adaptive learning, complex approval flows
- Java in-browser compiler (V3 revisit, not committed)
- Google/third-party auth (email+password only; instant signup covers it)
- AI communication/pitch coach, AI study plans, light/dark switching

---

## Build order from here

1. **V1 close-out**: README, `.env.example`, seed data (demo quiz, welcome chat message). — DONE
2. **V2 — SQL playground (PGlite)**: the one feature with the best learning-per-effort
   ratio. Client-side SQL in the browser, no backend, missions + error explanations.
   Fits the LAB world already designed. — DONE
3. **V2 — Bookless mode**: unit download bundles for offline/low-internet use. — DONE
4. **V2 — small wins**: teacher-verified badges, replace material, timed quizzes,
   bandwidth calculators, scenario quizzes (reuse quiz system). — verified badges + timed
   quizzes DONE; replace-material, calculators, scenario quizzes still open.
5. **AI — Ask AI room**: NVIDIA NIM GPT-OSS-120B, tools (syllabus, archive, files in chat,
   quiz info, teacher student records), per-student daily cap, admin kill switch. — DONE
6. **AI — teacher quiz generator**: structured MCQs from unit/topic/difficulty → existing
   editor + validation. Needs NVIDIA_API_KEY. — DONE
7. **AI — websearch tool**: NVIDIA web-search NIM first (free), Tavily free tier fallback.
   — DONE via Tavily (no NVIDIA web-search NIM exists in the catalog; tool is provider-shaped
   and hidden until a key is set).
8. **V2 — student records page**: /admin/students/[id] with activity, attempts, flags,
   downloads (data exists; AI tool already has the query). — DONE

Rule for anything after that: one feature at a time, marked V2 or higher in this
doc before a line of code is written.