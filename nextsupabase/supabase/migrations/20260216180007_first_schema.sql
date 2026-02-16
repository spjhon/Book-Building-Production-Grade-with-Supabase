
  create table "public"."service_users" (
    "id" uuid not null default gen_random_uuid(),
    "auth_user_id" uuid not null,
    "full_name" text,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );


alter table "public"."service_users" enable row level security;


  create table "public"."tenant_permissions" (
    "id" uuid not null default gen_random_uuid(),
    "tenant_id" uuid not null,
    "service_user_id" uuid not null,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );


alter table "public"."tenant_permissions" enable row level security;


  create table "public"."tenants" (
    "id" uuid not null default gen_random_uuid(),
    "name" text not null,
    "domain" text not null,
    "slug" text,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );


alter table "public"."tenants" enable row level security;

CREATE UNIQUE INDEX service_users_auth_user_id_key ON public.service_users USING btree (auth_user_id);

CREATE UNIQUE INDEX service_users_pkey ON public.service_users USING btree (id);

CREATE UNIQUE INDEX tenant_permissions_pkey ON public.tenant_permissions USING btree (id);

CREATE UNIQUE INDEX tenant_permissions_unique_pair ON public.tenant_permissions USING btree (tenant_id, service_user_id);

CREATE UNIQUE INDEX tenants_domain_key ON public.tenants USING btree (domain);

CREATE UNIQUE INDEX tenants_pkey ON public.tenants USING btree (id);

CREATE UNIQUE INDEX tenants_slug_key ON public.tenants USING btree (slug);

alter table "public"."service_users" add constraint "service_users_pkey" PRIMARY KEY using index "service_users_pkey";

alter table "public"."tenant_permissions" add constraint "tenant_permissions_pkey" PRIMARY KEY using index "tenant_permissions_pkey";

alter table "public"."tenants" add constraint "tenants_pkey" PRIMARY KEY using index "tenants_pkey";

alter table "public"."service_users" add constraint "service_users_auth_user_id_fkey" FOREIGN KEY (auth_user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."service_users" validate constraint "service_users_auth_user_id_fkey";

alter table "public"."service_users" add constraint "service_users_auth_user_id_key" UNIQUE using index "service_users_auth_user_id_key";

alter table "public"."tenant_permissions" add constraint "tenant_permissions_service_user_id_fkey" FOREIGN KEY (service_user_id) REFERENCES public.service_users(id) ON DELETE CASCADE not valid;

alter table "public"."tenant_permissions" validate constraint "tenant_permissions_service_user_id_fkey";

alter table "public"."tenant_permissions" add constraint "tenant_permissions_tenant_id_fkey" FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE not valid;

alter table "public"."tenant_permissions" validate constraint "tenant_permissions_tenant_id_fkey";

alter table "public"."tenant_permissions" add constraint "tenant_permissions_unique_pair" UNIQUE using index "tenant_permissions_unique_pair";

alter table "public"."tenants" add constraint "tenants_domain_key" UNIQUE using index "tenants_domain_key";

alter table "public"."tenants" add constraint "tenants_slug_key" UNIQUE using index "tenants_slug_key";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_tenant_name(p_tenant_id uuid)
 RETURNS text
 LANGUAGE sql
 SET search_path TO 'public'
AS $function$
  select name
  from tenants
  where id = p_tenant_id
  limit 1;
$function$
;

CREATE OR REPLACE FUNCTION public.set_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
begin
  new.updated_at = now();
  return new;
end;
$function$
;

grant delete on table "public"."service_users" to "anon";

grant insert on table "public"."service_users" to "anon";

grant references on table "public"."service_users" to "anon";

grant select on table "public"."service_users" to "anon";

grant trigger on table "public"."service_users" to "anon";

grant truncate on table "public"."service_users" to "anon";

grant update on table "public"."service_users" to "anon";

grant delete on table "public"."service_users" to "authenticated";

grant insert on table "public"."service_users" to "authenticated";

grant references on table "public"."service_users" to "authenticated";

grant select on table "public"."service_users" to "authenticated";

grant trigger on table "public"."service_users" to "authenticated";

grant truncate on table "public"."service_users" to "authenticated";

grant update on table "public"."service_users" to "authenticated";

grant delete on table "public"."service_users" to "service_role";

grant insert on table "public"."service_users" to "service_role";

grant references on table "public"."service_users" to "service_role";

grant select on table "public"."service_users" to "service_role";

grant trigger on table "public"."service_users" to "service_role";

grant truncate on table "public"."service_users" to "service_role";

grant update on table "public"."service_users" to "service_role";

grant delete on table "public"."tenant_permissions" to "anon";

grant insert on table "public"."tenant_permissions" to "anon";

grant references on table "public"."tenant_permissions" to "anon";

grant select on table "public"."tenant_permissions" to "anon";

grant trigger on table "public"."tenant_permissions" to "anon";

grant truncate on table "public"."tenant_permissions" to "anon";

grant update on table "public"."tenant_permissions" to "anon";

grant delete on table "public"."tenant_permissions" to "authenticated";

grant insert on table "public"."tenant_permissions" to "authenticated";

grant references on table "public"."tenant_permissions" to "authenticated";

grant select on table "public"."tenant_permissions" to "authenticated";

grant trigger on table "public"."tenant_permissions" to "authenticated";

grant truncate on table "public"."tenant_permissions" to "authenticated";

grant update on table "public"."tenant_permissions" to "authenticated";

grant delete on table "public"."tenant_permissions" to "service_role";

grant insert on table "public"."tenant_permissions" to "service_role";

grant references on table "public"."tenant_permissions" to "service_role";

grant select on table "public"."tenant_permissions" to "service_role";

grant trigger on table "public"."tenant_permissions" to "service_role";

grant truncate on table "public"."tenant_permissions" to "service_role";

grant update on table "public"."tenant_permissions" to "service_role";

grant delete on table "public"."tenants" to "anon";

grant insert on table "public"."tenants" to "anon";

grant references on table "public"."tenants" to "anon";

grant select on table "public"."tenants" to "anon";

grant trigger on table "public"."tenants" to "anon";

grant truncate on table "public"."tenants" to "anon";

grant update on table "public"."tenants" to "anon";

grant delete on table "public"."tenants" to "authenticated";

grant insert on table "public"."tenants" to "authenticated";

grant references on table "public"."tenants" to "authenticated";

grant select on table "public"."tenants" to "authenticated";

grant trigger on table "public"."tenants" to "authenticated";

grant truncate on table "public"."tenants" to "authenticated";

grant update on table "public"."tenants" to "authenticated";

grant delete on table "public"."tenants" to "service_role";

grant insert on table "public"."tenants" to "service_role";

grant references on table "public"."tenants" to "service_role";

grant select on table "public"."tenants" to "service_role";

grant trigger on table "public"."tenants" to "service_role";

grant truncate on table "public"."tenants" to "service_role";

grant update on table "public"."tenants" to "service_role";


  create policy "Public service_users can be read"
  on "public"."service_users"
  as permissive
  for select
  to public
using (true);



  create policy "Public tenant_permissions can be read"
  on "public"."tenant_permissions"
  as permissive
  for select
  to public
using (true);



  create policy "Users can read their tenants"
  on "public"."tenants"
  as permissive
  for select
  to public
using ((EXISTS ( SELECT 1
   FROM public.tenant_permissions tp
  WHERE ((tp.tenant_id = tenants.id) AND (tp.service_user_id = auth.uid())))));


CREATE TRIGGER set_service_users_updated_at BEFORE UPDATE ON public.service_users FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_tenant_permissions_updated_at BEFORE UPDATE ON public.tenant_permissions FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_tenants_updated_at BEFORE UPDATE ON public.tenants FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


