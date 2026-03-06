select tenant_id from tenant_permissions where service_user_id = (select id from service_users where auth_user_id = auth.uid())

