-- Habilitar RLS
alter table public.service_users enable row level security;

-- Política pública de lectura
create policy "Public service_users can be read"
on public.service_users
for select
using (true);
