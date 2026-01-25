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

--Esta funcion actualiza el record del field updated_at cuando se dispara un evento
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Trigger para updated_at (reusas tu misma función)
create trigger set_service_users_updated_at
before update on public.service_users
for each row
execute function public.set_updated_at();

-- Habilitar RLS
alter table public.service_users enable row level security;

-- Política pública de lectura
create policy "Public service_users can be read"
on public.service_users
for select
using (true);
