create table public.tenants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  domain text not null unique,
  slug text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);





