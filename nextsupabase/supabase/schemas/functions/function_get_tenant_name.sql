create or replace function public.get_tenant_name(p_tenant_id uuid)
returns text
language sql
SET search_path = public
as $$
  select name
  from tenants
  where id = p_tenant_id
  limit 1;
$$