create or replace function public.get_tenant_data(p_tenant_slug text)
returns table
language sql
SET search_path = public
as $$
  select id, name, domain
  from tenants
  where domain = p_tenant_slug
  limit 1;
$$