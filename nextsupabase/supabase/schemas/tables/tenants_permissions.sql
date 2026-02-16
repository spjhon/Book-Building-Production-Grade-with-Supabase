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

