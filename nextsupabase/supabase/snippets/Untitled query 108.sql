select * from public.tenant_permissions tp inner join public.service_users su on tp.service_user_id = su.id 
where  su.auth_user_id = '73c7862b-07e7-45f2-9e00-5ed0c2ac863d'