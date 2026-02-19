
-- ==========================================
-- RLS
-- ==========================================

alter table public.tenants enable row level security;

-- Nota:
-- Esta tabla normalmente NO debería permitir a usuarios crear tenants libremente.
-- Normalmente esto lo hace el backend con service_role.
-- Aquí asumimos que solo lectura pública es permitida.


--Entonces ¿qué está comprobando exactamente el EXISTS? El EXISTS pregunta:
--¿Hay al menos una fila en tenant_permissions
--que:
--pertenezca a este tenant
--y cuyo service_user esté asociado al usuario autenticado?


create policy "Solo usuarios autenticados pueden leer sus propios tenants"
on public.tenants
for select
to authenticated
using (
  exists (
    select 1 
    from public.tenant_permissions tp inner join public.service_users su on tp.service_user_id = su.id
    /*
    Significa:
      Combina filas donde tenant_permissions.service_user_id sea igual a service_users.id
    */
    where tp.tenant_id = public.tenants.id
    and su.auth_user_id = auth.uid()
)
);
