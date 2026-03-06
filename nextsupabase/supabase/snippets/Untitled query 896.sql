create policy "Users can read service_users from their same tenants"
on public.service_users
for select
to authenticated
using (
  id in (
    select service_user_id 
    from public.tenant_permissions
    where tenant_id in (
      select tenant_id 
      from public.tenant_permissions
      where service_user_id = (select id from public.service_users where auth_user_id = auth.uid())
    )
  )
);

/*Otra forma de entenderlo seria, con la parte mas profunda estamos buscando el id del tenant al que pertenece el auth.uid(), luego con ese tenant_id se busca todos los service_user_id cuyos tenant_ids sean iguales al tenant_id o tenants_ids si es que el auth.uid() tiene mas tenants, eso me da una lista de service_users_ids y si el id de service_users que se esta evaluando se encuentra en la lista de service_users_ids que sale de la consulta entonces esa perosna, ese auth.uid(), puede pasar*/