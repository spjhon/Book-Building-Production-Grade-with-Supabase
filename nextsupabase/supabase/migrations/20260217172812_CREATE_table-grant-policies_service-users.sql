-- ===============================
-- Tabla: service_users
-- ===============================



CREATE table public.service_users (
  id uuid primary key default gen_random_uuid(),

  -- Relación con el usuario de Supabase Auth
  auth_user_id uuid not null references auth.users(id) on delete cascade,

  full_name text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- Evita que haya dos filas para el mismo usuario de auth
  constraint service_users_auth_user_id_key unique (auth_user_id)
);

COMMENT ON TABLE public.service_users IS 'Version del schema v1';

-- ==========================================
-- Indexes
-- ==========================================

-- Aunque el UNIQUE ya crea un índice,
-- lo dejamos explícito si quieres claridad arquitectónica
-- (no es estrictamente necesario)
-- create unique index service_users_auth_user_id_idx
--   on public.service_users (auth_user_id);



-- ==========================================
-- GRANTS
-- ==========================================

alter table public.service_users enable row level security;

-- Permiso para role authenticated
grant select, insert, update, delete
on table public.service_users
to authenticated;

-- Permiso para el service role
grant select, insert, update, delete
on table public.service_users
to service_role;

-- ==========================================
-- RLS
-- ==========================================

create policy "Users can read their own service_user"
on public.service_users
for select
to authenticated
using (auth_user_id = auth.uid());

create policy "Users can insert their own service_user"
on public.service_users
for insert
to authenticated
with check (auth_user_id = auth.uid());

create policy "Users can update their own service_user"
on public.service_users
for update
to authenticated
using (auth_user_id = auth.uid())
with check (auth_user_id = auth.uid());

create policy "Users can delete their own service_user"
on public.service_users
for delete
to authenticated
using (auth_user_id = auth.uid());
