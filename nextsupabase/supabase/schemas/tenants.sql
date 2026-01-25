create table public.tenants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  domain text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
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


--Y este es el trigger como tal que lo que hace es hacer la operacion de la funcion por cada fila que se le evidencie el update
create trigger set_tenants_updated_at
before update on public.tenants
for each row
execute function public.set_updated_at();


--Y este es el role level security para tener control sobrre el acceso de las tablas por diferentes usuarios
alter table public.tenants enable row level security;

--Esto quiere decir que va a ser publico
create policy "Public tenants can be read"
on public.tenants
for select
using (true);
