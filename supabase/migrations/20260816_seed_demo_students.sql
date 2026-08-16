-- IT Hub 11 — demo data (DEVELOPMENT ONLY)
-- Four demo student accounts + realistic activity history + misbehavior
-- flags, so the admin panel shows meaningful data immediately.
--
-- Login                      Password
-- aarav.sharma@ithub11.in    student@123
-- priya.patel@ithub11.in     student@123
-- rohan.mehta@ithub11.in     student@123
-- sara.khan@ithub11.in       student@123
--
-- Passwords are salted bcrypt hashes (generated with bcryptjs, cost 10).
-- Delete this file's contents (or the rows) before going live.

-- ------------------------------------------------------------- auth users

insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
  confirmation_token, recovery_token, email_change_token_new, email_change
) values
  (
    '00000000-0000-0000-0000-000000000000',
    '11111111-1111-4111-8111-111111111111',
    'authenticated', 'authenticated', 'aarav.sharma@ithub11.in',
    '$2b$10$mJn5ETfhMpnt4jxSNF/Mc.anC9YK6ghL7O24uctrjUHm4hv/SoQoi',
    now(), '{"provider":"email","providers":["email"]}', '{}',
    now(), now(), '', '', '', ''
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    '22222222-2222-4222-8222-222222222222',
    'authenticated', 'authenticated', 'priya.patel@ithub11.in',
    '$2b$10$mJn5ETfhMpnt4jxSNF/Mc.anC9YK6ghL7O24uctrjUHm4hv/SoQoi',
    now(), '{"provider":"email","providers":["email"]}', '{}',
    now(), now(), '', '', '', ''
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    '33333333-3333-4333-8333-333333333333',
    'authenticated', 'authenticated', 'rohan.mehta@ithub11.in',
    '$2b$10$mJn5ETfhMpnt4jxSNF/Mc.anC9YK6ghL7O24uctrjUHm4hv/SoQoi',
    now(), '{"provider":"email","providers":["email"]}', '{}',
    now(), now(), '', '', '', ''
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    '44444444-4444-4444-8444-444444444444',
    'authenticated', 'authenticated', 'sara.khan@ithub11.in',
    '$2b$10$mJn5ETfhMpnt4jxSNF/Mc.anC9YK6ghL7O24uctrjUHm4hv/SoQoi',
    now(), '{"provider":"email","providers":["email"]}', '{}',
    now(), now(), '', '', '', ''
  )
on conflict (email) where is_sso_user = false do nothing;

-- -------------------------------------------------------------- profiles

insert into public.profiles (id, full_name, email, role, class_name, student_id, is_active, created_at)
select
  u.id,
  v.full_name, v.email, 'student', v.class_name, v.student_id, true,
  now() - interval '40 days'
from (values
  ('11111111-1111-4111-8111-111111111111', 'Aarav Sharma',  'aarav.sharma@ithub11.in',  '11-A', 'ITHUB1101'),
  ('22222222-2222-4222-8222-222222222222', 'Priya Patel',   'priya.patel@ithub11.in',   '11-B', 'ITHUB1102'),
  ('33333333-3333-4333-8333-333333333333', 'Rohan Mehta',   'rohan.mehta@ithub11.in',   '11-A', 'ITHUB1103'),
  ('44444444-4444-4444-8444-444444444444', 'Sara Khan',     'sara.khan@ithub11.in',     '11-B', 'ITHUB1104')
) as v(id, full_name, email, class_name, student_id)
join auth.users u on u.id = v.id::uuid
on conflict (id) do nothing;

-- Admin profile for the existing admin@ithub11.in account.
insert into public.profiles (id, full_name, email, role, is_active)
select id, 'IT Hub 11 Admin', email, 'admin', true
from auth.users where email = 'admin@ithub11.in'
on conflict (id) do nothing;

-- ------------------------------------------------------- activity history

-- Last 7 days of realistic usage.
insert into public.activity_logs (user_id, action, details, created_at)
select
  v.user_id::uuid, v.action, v.details::jsonb,
  now() - (v.age_days || ' days')::interval
        - (v.age_hours || ' hours')::interval
        - (v.age_mins || ' minutes')::interval
from (values
  -- Aarav — steady revision flow
  ('11111111-1111-4111-8111-111111111111'::uuid, 'page_view'::text, '{"path":"/chapters"}'::jsonb, 6::int, 2::int, 10::int),
  ('11111111-1111-4111-8111-111111111111'::uuid, 'page_view'::text, '{"path":"/chapters/rdbms"}'::jsonb, 6::int, 2::int, 12::int),
  ('11111111-1111-4111-8111-111111111111'::uuid, 'resource_open'::text, '{"title":"Demo — RDBMS basics worksheet","unit":"rdbms"}'::jsonb, 6::int, 2::int, 15::int),
  ('11111111-1111-4111-8111-111111111111'::uuid, 'page_view'::text, '{"path":"/chapters"}'::jsonb, 5::int, 4::int, 0::int),
  ('11111111-1111-4111-8111-111111111111'::uuid, 'search'::text, '{"query":"sql commands","results":1}'::jsonb, 5::int, 4::int, 1::int),
  ('11111111-1111-4111-8111-111111111111'::uuid, 'resource_download'::text, '{"title":"Demo — RDBMS basics worksheet","unit":"rdbms"}'::jsonb, 5::int, 4::int, 3::int),
  ('11111111-1111-4111-8111-111111111111'::uuid, 'search'::text, '{"query":"exam paper","results":0}'::jsonb, 4::int, 0::int, 0::int),
  ('11111111-1111-4111-8111-111111111111'::uuid, 'page_view'::text, '{"path":"/chapters/fundamentals-of-java"}'::jsonb, 3::int, 5::int, 20::int),
  ('11111111-1111-4111-8111-111111111111'::uuid, 'login_success'::text, '{}'::jsonb, 0::int, 0::int, 5::int),
  ('11111111-1111-4111-8111-111111111111'::uuid, 'page_view'::text, '{"path":"/chapters/rdbms"}'::jsonb, 0::int, 0::int, 6::int),
  ('11111111-1111-4111-8111-111111111111'::uuid, 'search'::text, '{"query":"sql joins","results":1}'::jsonb, 0::int, 0::int, 7::int),
  ('11111111-1111-4111-8111-111111111111'::uuid, 'resource_download'::text, '{"title":"Demo — RDBMS basics worksheet","unit":"rdbms"}'::jsonb, 0::int, 0::int, 8::int),
  -- Priya — searches + a failed-login burst yesterday (brute-force suspicion)
  ('22222222-2222-4222-8222-222222222222'::uuid, 'page_view'::text, '{"path":"/chapters"}'::jsonb, 4::int, 3::int, 0::int),
  ('22222222-2222-4222-8222-222222222222'::uuid, 'search'::text, '{"query":"java programs","results":1}'::jsonb, 4::int, 3::int, 2::int),
  ('22222222-2222-4222-8222-222222222222'::uuid, 'resource_open'::text, '{"title":"Demo — Java starter programs","unit":"fundamentals-of-java"}'::jsonb, 4::int, 3::int, 4::int),
  ('22222222-2222-4222-8222-222222222222'::uuid, 'resource_download'::text, '{"title":"Demo — Java starter programs","unit":"fundamentals-of-java"}'::jsonb, 4::int, 3::int, 5::int),
  ('22222222-2222-4222-8222-222222222222'::uuid, 'login_success'::text, '{}'::jsonb, 2::int, 6::int, 0::int),
  ('22222222-2222-4222-8222-222222222222'::uuid, 'page_view'::text, '{"path":"/chapters/networking-internet"}'::jsonb, 1::int, 3::int, 10::int),
  (null, 'login_failed'::text, '{"email":"priya.patel@ithub11.in"}'::jsonb, 1::int, 3::int, 11::int),
  (null, 'login_failed'::text, '{"email":"priya.patel@ithub11.in"}'::jsonb, 1::int, 3::int, 12::int),
  (null, 'login_failed'::text, '{"email":"priya.patel@ithub11.in"}'::jsonb, 1::int, 3::int, 13::int),
  (null, 'login_failed'::text, '{"email":"priya.patel@ithub11.in"}'::jsonb, 1::int, 3::int, 14::int),
  (null, 'login_failed'::text, '{"email":"priya.patel@ithub11.in"}'::jsonb, 1::int, 3::int, 15::int),
  ('22222222-2222-4222-8222-222222222222'::uuid, 'login_success'::text, '{}'::jsonb, 1::int, 3::int, 16::int),
  -- Rohan — banned search term + a download burst today (both flagged)
  ('33333333-3333-4333-8333-333333333333'::uuid, 'page_view'::text, '{"path":"/chapters"}'::jsonb, 5::int, 0::int, 0::int),
  ('33333333-3333-4333-8333-333333333333'::uuid, 'search'::text, '{"query":"idiot teacher notes","results":0}'::jsonb, 5::int, 0::int, 1::int),
  ('33333333-3333-4333-8333-333333333333'::uuid, 'search'::text, '{"query":"networking basics","results":1}'::jsonb, 5::int, 0::int, 5::int),
  ('33333333-3333-4333-8333-333333333333'::uuid, 'resource_open'::text, '{"title":"Demo — Networking quick reference","unit":"networking-internet"}'::jsonb, 5::int, 0::int, 6::int),
  ('33333333-3333-4333-8333-333333333333'::uuid, 'page_view'::text, '{"path":"/chapters/office-automation-tools"}'::jsonb, 2::int, 0::int, 0::int),
  ('33333333-3333-4333-8333-333333333333'::uuid, 'resource_download'::text, '{"title":"Demo — Networking quick reference","unit":"networking-internet"}'::jsonb, 0::int, 0::int, 1::int),
  ('33333333-3333-4333-8333-333333333333'::uuid, 'resource_download'::text, '{"title":"Demo — Networking quick reference","unit":"networking-internet"}'::jsonb, 0::int, 0::int, 2::int),
  ('33333333-3333-4333-8333-333333333333'::uuid, 'resource_download'::text, '{"title":"Demo — Networking quick reference","unit":"networking-internet"}'::jsonb, 0::int, 0::int, 3::int),
  ('33333333-3333-4333-8333-333333333333'::uuid, 'resource_download'::text, '{"title":"Demo — Networking quick reference","unit":"networking-internet"}'::jsonb, 0::int, 0::int, 4::int),
  ('33333333-3333-4333-8333-333333333333'::uuid, 'resource_download'::text, '{"title":"Demo — Networking quick reference","unit":"networking-internet"}'::jsonb, 0::int, 0::int, 5::int),
  ('33333333-3333-4333-8333-333333333333'::uuid, 'resource_download'::text, '{"title":"Demo — Networking quick reference","unit":"networking-internet"}'::jsonb, 0::int, 0::int, 6::int),
  ('33333333-3333-4333-8333-333333333333'::uuid, 'resource_download'::text, '{"title":"Demo — Networking quick reference","unit":"networking-internet"}'::jsonb, 0::int, 0::int, 7::int),
  ('33333333-3333-4333-8333-333333333333'::uuid, 'resource_download'::text, '{"title":"Demo — Networking quick reference","unit":"networking-internet"}'::jsonb, 0::int, 0::int, 8::int),
  ('33333333-3333-4333-8333-333333333333'::uuid, 'resource_download'::text, '{"title":"Demo — Networking quick reference","unit":"networking-internet"}'::jsonb, 0::int, 0::int, 9::int),
  -- Sara — normal usage + one admin-area probe
  ('44444444-4444-4444-8444-444444444444'::uuid, 'page_view'::text, '{"path":"/chapters"}'::jsonb, 5::int, 2::int, 0::int),
  ('44444444-4444-4444-8444-444444444444'::uuid, 'search'::text, '{"query":"green skills","results":1}'::jsonb, 5::int, 2::int, 3::int),
  ('44444444-4444-4444-8444-444444444444'::uuid, 'resource_open'::text, '{"title":"Demo — Green skills notes","unit":"green-skills"}'::jsonb, 5::int, 2::int, 5::int),
  ('44444444-4444-4444-8444-444444444444'::uuid, 'page_view'::text, '{"path":"/search"}'::jsonb, 1::int, 2::int, 0::int),
  ('44444444-4444-4444-8444-444444444444'::uuid, 'search'::text, '{"query":"worksheet","results":0}'::jsonb, 1::int, 2::int, 1::int),
  ('44444444-4444-4444-8444-444444444444'::uuid, 'unauthorized_admin_attempt'::text, '{"path":"/api/admin/students"}'::jsonb, 1::int, 2::int, 5::int),
  ('44444444-4444-4444-8444-444444444444'::uuid, 'login_success'::text, '{}'::jsonb, 0::int, 0::int, 3::int),
  ('44444444-4444-4444-8444-444444444444'::uuid, 'page_view'::text, '{"path":"/chapters/ict-skills"}'::jsonb, 0::int, 0::int, 4::int),
  -- Admin activity
  ('11111111-1111-4111-8111-111111111111'::uuid, 'admin_action'::text, '{}'::jsonb, 0::int, 0::int, 1::int)
) as v(user_id, action, details, age_days, age_hours, age_mins);

-- -------------------------------------------------------- misbehavior flags

insert into public.misbehavior_flags (user_id, type, severity, details, status, created_at)
select
  v.user_id::uuid, v.type, v.severity, v.details::jsonb, v.status,
  now() - (v.age_days || ' days')::interval
        - (v.age_hours || ' hours')::interval
        - (v.age_mins || ' minutes')::interval
from (values
  ('33333333-3333-4333-8333-333333333333'::uuid, 'banned_search'::text, 'medium'::text, '{"query":"idiot teacher notes","term":"idiot"}'::jsonb, 'open'::text, 5::int, 0::int, 2::int),
  ('33333333-3333-4333-8333-333333333333'::uuid, 'rapid_downloads'::text, 'medium'::text, '{"count":10,"window":"60s","unit":"networking-internet"}'::jsonb, 'open'::text, 0::int, 0::int, 10::int),
  ('22222222-2222-4222-8222-222222222222'::uuid, 'failed_login'::text, 'high'::text, '{"count":5,"window":"10m","email":"priya.patel@ithub11.in"}'::jsonb, 'open'::text, 1::int, 3::int, 16::int),
  ('44444444-4444-4444-8444-444444444444'::uuid, 'unauthorized_admin'::text, 'high'::text, '{"path":"/api/admin/students"}'::jsonb, 'open'::text, 1::int, 2::int, 6::int),
  ('33333333-3333-4333-8333-333333333333'::uuid, 'banned_search'::text, 'medium'::text, '{"query":"boring teacher","term":"boring"}'::jsonb, 'dismissed'::text, 4::int, 0::int, 0::int)
) as v(user_id, type, severity, details, status, age_days, age_hours, age_mins);

-- Mark the dismissed flag as reviewed by the admin.
update public.misbehavior_flags
set reviewed_by = (select id from public.profiles where role = 'admin' limit 1),
    reviewed_at = now() - interval '4 days'
where type = 'banned_search' and status = 'dismissed';