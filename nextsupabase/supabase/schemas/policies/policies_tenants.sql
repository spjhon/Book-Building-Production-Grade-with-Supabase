--Y este es el role level security para tener control sobrre el acceso de las tablas por diferentes usuarios
alter table public.tenants enable row level security;

create policy "Users can read their tenants"
on public.tenants
for select
using (
  exists (
    select 1
    from public.tenant_permissions tp
    where tp.tenant_id = tenants.id
      and tp.service_user_id = auth.uid()
  )
);