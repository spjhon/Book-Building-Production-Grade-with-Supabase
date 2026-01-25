
  create table "public"."service_users" (
    "id" uuid not null default gen_random_uuid(),
    "auth_user_id" uuid not null,
    "full_name" text,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );


alter table "public"."service_users" enable row level security;

CREATE UNIQUE INDEX service_users_auth_user_id_key ON public.service_users USING btree (auth_user_id);

CREATE UNIQUE INDEX service_users_pkey ON public.service_users USING btree (id);

alter table "public"."service_users" add constraint "service_users_pkey" PRIMARY KEY using index "service_users_pkey";

alter table "public"."service_users" add constraint "service_users_auth_user_id_fkey" FOREIGN KEY (auth_user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."service_users" validate constraint "service_users_auth_user_id_fkey";

alter table "public"."service_users" add constraint "service_users_auth_user_id_key" UNIQUE using index "service_users_auth_user_id_key";

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


  create policy "Public service_users can be read"
  on "public"."service_users"
  as permissive
  for select
  to public
using (true);


CREATE TRIGGER set_service_users_updated_at BEFORE UPDATE ON public.service_users FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


