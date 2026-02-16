--Habilitar rls
alter table public.tenant_permissions
enable row level security;


--politica del rls Política básica (lectura pública – AJUSTABLE) Solo como placeholder inicial (igual que hiciste en service_users):
create policy "Public tenant_permissions can be read"
on public.tenant_permissions
for select
using (true);
