-- Admin account for IT Hub 11 (admin@ithub11.in / ithub11@1608).
-- Created here because the demo seed's admin profile insert expects an
-- existing admin@ithub11.in auth user. Password is a salted bcrypt hash.
insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
  confirmation_token, recovery_token, email_change_token_new, email_change
) values (
  '00000000-0000-0000-0000-000000000000',
  '99999999-9999-4999-8999-999999999999',
  'authenticated', 'authenticated', 'admin@ithub11.in',
  '$2b$10$VAvg4maBYiYSyUvf09fSouw02Ut7kAd82qvtnKGlsY6F6ILeTriIq',
  now(), '{"provider":"email","providers":["email"]}', '{}',
  now(), now(), '', '', '', ''
)
on conflict (email) where is_sso_user = false do nothing;