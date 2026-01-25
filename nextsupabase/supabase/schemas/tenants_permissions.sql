-- Tabla intermedia tenant <-> service_user
create table public.tenant_permissions (
  id uuid primary key default gen_random_uuid(),

  tenant_id uuid not null
    references public.tenants(id)
    on delete cascade,

  service_user_id uuid not null
    references public.service_users(id)
    on delete cascade,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- Evita duplicar permisos para el mismo par tenant / service_user
  constraint tenant_permissions_unique_pair
    unique (tenant_id, service_user_id)
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


--Trigger updated_at (nombre ajustado a la tabla)
create trigger set_tenant_permissions_updated_at
before update on public.tenant_permissions
for each row
execute function public.set_updated_at();


--Habilitar rls
alter table public.tenant_permissions
enable row level security;


--politica del rls Política básica (lectura pública – AJUSTABLE) Solo como placeholder inicial (igual que hiciste en service_users):
create policy "Public tenant_permissions can be read"
on public.tenant_permissions
for select
using (true);
