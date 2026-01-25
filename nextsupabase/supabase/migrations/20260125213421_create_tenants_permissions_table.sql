
  create table "public"."tenant_permissions" (
    "id" uuid not null default gen_random_uuid(),
    "tenant_id" uuid not null,
    "service_user_id" uuid not null,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );


alter table "public"."tenant_permissions" enable row level security;

CREATE UNIQUE INDEX tenant_permissions_pkey ON public.tenant_permissions USING btree (id);

CREATE UNIQUE INDEX tenant_permissions_unique_pair ON public.tenant_permissions USING btree (tenant_id, service_user_id);

alter table "public"."tenant_permissions" add constraint "tenant_permissions_pkey" PRIMARY KEY using index "tenant_permissions_pkey";

alter table "public"."tenant_permissions" add constraint "tenant_permissions_service_user_id_fkey" FOREIGN KEY (service_user_id) REFERENCES public.service_users(id) ON DELETE CASCADE not valid;

alter table "public"."tenant_permissions" validate constraint "tenant_permissions_service_user_id_fkey";

alter table "public"."tenant_permissions" add constraint "tenant_permissions_tenant_id_fkey" FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE not valid;

alter table "public"."tenant_permissions" validate constraint "tenant_permissions_tenant_id_fkey";

alter table "public"."tenant_permissions" add constraint "tenant_permissions_unique_pair" UNIQUE using index "tenant_permissions_unique_pair";

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


  create policy "Public tenant_permissions can be read"
  on "public"."tenant_permissions"
  as permissive
  for select
  to public
using (true);


CREATE TRIGGER set_tenant_permissions_updated_at BEFORE UPDATE ON public.tenant_permissions FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


