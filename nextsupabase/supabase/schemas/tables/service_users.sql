create table public.service_users (
  id uuid primary key default gen_random_uuid(),
  -- Relación con el usuario de Supabase Auth
  auth_user_id uuid not null references auth.users(id) on delete cascade,
  full_name text null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- Evita que haya dos filas para el mismo usuario de auth
  constraint service_users_auth_user_id_key unique (auth_user_id)
);

