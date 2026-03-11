


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE EXTENSION IF NOT EXISTS "pg_net" WITH SCHEMA "extensions";






COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pg_trgm" WITH SCHEMA "public";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE OR REPLACE FUNCTION "public"."derive_tenant_from_ticket"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
BEGIN
    -- Obtenemos el tenant_id del ticket relacionado
    NEW.tenant_id := (
        SELECT t.tenant_id 
        FROM public.tickets t 
        WHERE t.id = NEW.ticket_id
    );

    -- Validación de seguridad
    IF NEW.tenant_id IS NULL THEN
        RAISE EXCEPTION 'No se pudo encontrar el ticket relacionado o el ticket no tiene un tenant asignado.';
    END IF;

    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."derive_tenant_from_ticket"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."service_users" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "auth_user_id" "uuid" NOT NULL,
    "full_name" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "is_available" boolean DEFAULT true NOT NULL,
    "job_title" "text"
);


ALTER TABLE "public"."service_users" OWNER TO "postgres";


COMMENT ON TABLE "public"."service_users" IS 'Version del schema v1';



COMMENT ON COLUMN "public"."service_users"."is_available" IS 'Indica si el usuario está disponible (vacaciones, enfermedad, etc.)';



COMMENT ON COLUMN "public"."service_users"."job_title" IS 'Título profesional o cargo del usuario dentro del equipo';



CREATE OR REPLACE FUNCTION "public"."get_service_users_with_tenant"("target_tenant_id" "uuid") RETURNS SETOF "public"."service_users"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
begin
  -- 1. Comprobamos si el usuario que llama a la función tiene permisos en ese tenant
  if not exists (
    select 1
    from public.tenant_permissions tp
    join public.service_users su on tp.service_user_id = su.id
    where tp.tenant_id = target_tenant_id
    and su.auth_user_id = auth.uid()
  ) then
    raise exception 'Acceso denegado: no perteneces a este tenant.';
  end if;

  -- 2. Si pasó la comprobación, devolvemos los usuarios
  return query
  select su.*
  from public.service_users su
  join public.tenant_permissions tp on su.id = tp.service_user_id
  where tp.tenant_id = target_tenant_id;
end;
$$;


ALTER FUNCTION "public"."get_service_users_with_tenant"("target_tenant_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_tenant_domain"("p_tenant_slug" "text") RETURNS "text"
    LANGUAGE "sql"
    SET "search_path" TO 'public'
    AS $$
  select domain
  from tenants
  where domain = p_tenant_slug
  limit 1;
$$;


ALTER FUNCTION "public"."get_tenant_domain"("p_tenant_slug" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_tenant_name"("p_tenant_slug" "text") RETURNS "text"
    LANGUAGE "sql"
    SET "search_path" TO 'public'
    AS $$
  select name
  from tenants
  where slug = p_tenant_slug
  limit 1;
$$;


ALTER FUNCTION "public"."get_tenant_name"("p_tenant_slug" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."set_comment_author_name"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
begin

    -- Como created_by es NOT NULL, siempre tendrá un valor.
    -- Pero si quieres una validación de seguridad extra:
    IF (NEW.created_by IS NULL) THEN
        RAISE EXCEPTION 'Un comentario debe tener un autor.';
    END IF;


    -- Buscamos el nombre del usuario basado en su ID (created_by)
    -- No necesitamos validar el tenant aquí, porque ya lo haces en el RLS
    SELECT full_name 
    INTO NEW.author_name
    FROM public.service_users 
    WHERE id = NEW.created_by;
    
    -- Si por alguna razón el usuario no existe, lanzamos un error o ponemos 'Unknown'
    IF NOT FOUND THEN
        NEW.author_name := 'Usuario desconocido';
    END IF;

    RETURN NEW;
end;
$$;


ALTER FUNCTION "public"."set_comment_author_name"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."set_created_by_table_tickets"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    SET "search_path" TO 'public'
    AS $$
begin
  -- Buscamos al usuario interno basándonos en la sesión de Supabase
  -- Aqui lo que se esta diciendo es seleccionar el id que resulta del from e 
  -- inyectarlo en el field created_by que es a donde esta dirigida la info que atrapa el trigger
  SELECT id INTO NEW.created_by
  FROM public.service_users
  WHERE auth_user_id = auth.uid();
  -- Opcional: Si el usuario no existe en service_users, bloqueamos el insert
  IF NEW.created_by IS NULL THEN
    RAISE EXCEPTION 'No se encontró un perfil de servicio para el usuario actual.';
  END IF;
  RETURN NEW;
end;
$$;


ALTER FUNCTION "public"."set_created_by_table_tickets"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."set_created_by_value"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
begin
  -- Buscamos el ID en service_users que coincide con el auth.uid() de la sesión
  SELECT id INTO NEW.created_by
  FROM public.service_users
  WHERE auth_user_id = auth.uid();

  -- Si no encontramos el usuario, abortamos la inserción
  IF NOT FOUND THEN
    RAISE EXCEPTION 'No se pudo vincular el usuario actual con un registro en service_users';
  END IF;

  RETURN NEW;
end;
$$;


ALTER FUNCTION "public"."set_created_by_value"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."set_next_ticket_number"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    SELECT COALESCE(MAX(ticket_number), 0) + 1 
    INTO NEW.ticket_number
    FROM public.tickets
    WHERE tenant_id = NEW.tenant_id;
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."set_next_ticket_number"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."set_ticket_assignee_name"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
begin
    IF (NEW.assignee IS NULL) THEN
        NEW.assignee_name := NULL;
        
        -- 2. Si hay un asignado, intentamos buscar su nombre validando que pertenezca al tenant
    ELSE NEW.assignee_name = (
        SELECT full_name FROM service_users WHERE id = NEW.assignee AND EXISTS (
            SELECT 1 FROM tenant_permissions p WHERE
            p.tenant_id = NEW.tenant_id AND p.service_user_id=NEW.assignee
        )
    );

    IF (NEW.assignee_name IS NULL) THEN
    NEW.assignee := NULL;
    END IF;

    END IF;
    RETURN NEW;
end;
$$;


ALTER FUNCTION "public"."set_ticket_assignee_name"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."set_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    SET "search_path" TO 'public'
    AS $$
begin
  new.updated_at = now();
  return new;
end;
$$;


ALTER FUNCTION "public"."set_updated_at"() OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."comments" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "ticket_id" "uuid" NOT NULL,
    "tenant_id" "uuid" NOT NULL,
    "created_by" "uuid" NOT NULL,
    "comment_text" "text" NOT NULL,
    "author_name" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "comments_comment_text_check" CHECK (("char_length"("comment_text") > 0))
);


ALTER TABLE "public"."comments" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."tenant_permissions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "tenant_id" "uuid" NOT NULL,
    "service_user_id" "uuid" NOT NULL,
    "role" "text" DEFAULT 'member'::"text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "tenant_permissions_role_check" CHECK (("role" = ANY (ARRAY['owner'::"text", 'admin'::"text", 'member'::"text"])))
);


ALTER TABLE "public"."tenant_permissions" OWNER TO "postgres";


COMMENT ON TABLE "public"."tenant_permissions" IS 'Maps service_users to tenants with role-based permissions.';



COMMENT ON COLUMN "public"."tenant_permissions"."role" IS 'Role of the user inside the tenant context.';



CREATE TABLE IF NOT EXISTS "public"."tenants" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "domain" "text" NOT NULL,
    "slug" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "tenants_name_length_check" CHECK (("char_length"("name") >= 2)),
    CONSTRAINT "tenants_slug_format_check" CHECK (("slug" ~ '^[a-z0-9-]+$'::"text"))
);


ALTER TABLE "public"."tenants" OWNER TO "postgres";


COMMENT ON TABLE "public"."tenants" IS 'Tenant root entity for multi-tenant isolation. Represents an organization/customer.';



COMMENT ON COLUMN "public"."tenants"."domain" IS 'Primary custom domain for the tenant (must be unique).';



COMMENT ON COLUMN "public"."tenants"."slug" IS 'URL-safe identifier used for subdomain or routing. Lowercase, alphanumeric and hyphens only.';



CREATE TABLE IF NOT EXISTS "public"."tickets" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "tenant_id" "uuid" NOT NULL,
    "created_by" "uuid" NOT NULL,
    "title" "text" NOT NULL,
    "description" "text",
    "status" "text" DEFAULT 'open'::"text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "ticket_number" bigint NOT NULL,
    "assignee" "uuid",
    "assignee_name" "text",
    CONSTRAINT "tickets_status_check" CHECK (("status" = ANY (ARRAY['open'::"text", 'in_progress'::"text", 'done'::"text", 'cancelled'::"text", 'information_missing'::"text"]))),
    CONSTRAINT "tickets_title_check" CHECK (("char_length"("title") > 0))
);


ALTER TABLE "public"."tickets" OWNER TO "postgres";


COMMENT ON TABLE "public"."tickets" IS 'Versión del schema v1. Almacena los tickets de soporte por tenant.';



COMMENT ON COLUMN "public"."tickets"."tenant_id" IS 'ID del tenant al que pertenece el ticket para aislamiento multi-tenant.';



COMMENT ON COLUMN "public"."tickets"."status" IS 'Estado actual del ticket: open, in_progress, done, cancelled.';



COMMENT ON COLUMN "public"."tickets"."ticket_number" IS 'Número secuencial humano (1, 2, 3...) por cada tenant.';



COMMENT ON COLUMN "public"."tickets"."assignee" IS 'ID del usuario asignado al ticket (relacionado con service_users).';



COMMENT ON COLUMN "public"."tickets"."assignee_name" IS 'Nombre del usuario asignado (campo informativo para evitar joins constantes).';



ALTER TABLE ONLY "public"."comments"
    ADD CONSTRAINT "comments_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."service_users"
    ADD CONSTRAINT "service_users_auth_user_id_key" UNIQUE ("auth_user_id");



ALTER TABLE ONLY "public"."service_users"
    ADD CONSTRAINT "service_users_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."tenant_permissions"
    ADD CONSTRAINT "tenant_permissions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."tenant_permissions"
    ADD CONSTRAINT "tenant_permissions_unique_pair" UNIQUE ("tenant_id", "service_user_id");



ALTER TABLE ONLY "public"."tenants"
    ADD CONSTRAINT "tenants_domain_key" UNIQUE ("domain");



ALTER TABLE ONLY "public"."tenants"
    ADD CONSTRAINT "tenants_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."tenants"
    ADD CONSTRAINT "tenants_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."tickets"
    ADD CONSTRAINT "tickets_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."tickets"
    ADD CONSTRAINT "unique_ticket_number_per_tenant" UNIQUE ("tenant_id", "ticket_number");



CREATE INDEX "comments_tenant_id_idx" ON "public"."comments" USING "btree" ("tenant_id");



CREATE INDEX "comments_ticket_id_idx" ON "public"."comments" USING "btree" ("ticket_id");



CREATE INDEX "service_users_full_name_trgm_idx" ON "public"."service_users" USING "gin" ("full_name" "public"."gin_trgm_ops");



CREATE INDEX "service_users_is_available_idx" ON "public"."service_users" USING "btree" ("is_available");



CREATE INDEX "tenant_permissions_service_user_id_idx" ON "public"."tenant_permissions" USING "btree" ("service_user_id");



CREATE INDEX "tenant_permissions_tenant_id_idx" ON "public"."tenant_permissions" USING "btree" ("tenant_id");



CREATE INDEX "tenants_created_at_idx" ON "public"."tenants" USING "btree" ("created_at");



CREATE INDEX "tickets_assignee_idx" ON "public"."tickets" USING "btree" ("assignee");



CREATE INDEX "tickets_created_by_idx" ON "public"."tickets" USING "btree" ("created_by");



CREATE INDEX "tickets_status_idx" ON "public"."tickets" USING "btree" ("status");



CREATE INDEX "tickets_tenant_id_idx" ON "public"."tickets" USING "btree" ("tenant_id");



CREATE INDEX "tickets_ticket_number_idx" ON "public"."tickets" USING "btree" ("ticket_number");



CREATE OR REPLACE TRIGGER "set_comments_updated_at" BEFORE UPDATE ON "public"."comments" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();



CREATE OR REPLACE TRIGGER "set_service_users_updated_at" BEFORE UPDATE ON "public"."service_users" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();



CREATE OR REPLACE TRIGGER "set_tenant_permissions_updated_at" BEFORE UPDATE ON "public"."tenant_permissions" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();



CREATE OR REPLACE TRIGGER "set_tenants_updated_at" BEFORE UPDATE ON "public"."tenants" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();



CREATE OR REPLACE TRIGGER "set_tickets_updated_at" BEFORE UPDATE ON "public"."tickets" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();



CREATE OR REPLACE TRIGGER "tr_comments_autoset_created_by" BEFORE INSERT ON "public"."comments" FOR EACH ROW EXECUTE FUNCTION "public"."set_created_by_value"();



CREATE OR REPLACE TRIGGER "tr_comments_derive_tenant" BEFORE INSERT ON "public"."comments" FOR EACH ROW EXECUTE FUNCTION "public"."derive_tenant_from_ticket"();



CREATE OR REPLACE TRIGGER "tr_set_author" BEFORE INSERT ON "public"."tickets" FOR EACH ROW EXECUTE FUNCTION "public"."set_created_by_table_tickets"();



CREATE OR REPLACE TRIGGER "tr_set_ticket_number" BEFORE INSERT ON "public"."tickets" FOR EACH ROW EXECUTE FUNCTION "public"."set_next_ticket_number"();



CREATE OR REPLACE TRIGGER "trg_comments_autoset_author_name" BEFORE INSERT ON "public"."comments" FOR EACH ROW EXECUTE FUNCTION "public"."set_comment_author_name"();



CREATE OR REPLACE TRIGGER "trg_set_ticket_assignee_name" BEFORE INSERT OR UPDATE OF "assignee" ON "public"."tickets" FOR EACH ROW EXECUTE FUNCTION "public"."set_ticket_assignee_name"();



ALTER TABLE ONLY "public"."comments"
    ADD CONSTRAINT "comments_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."service_users"("id");



ALTER TABLE ONLY "public"."comments"
    ADD CONSTRAINT "comments_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."comments"
    ADD CONSTRAINT "comments_ticket_id_fkey" FOREIGN KEY ("ticket_id") REFERENCES "public"."tickets"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."service_users"
    ADD CONSTRAINT "service_users_auth_user_id_fkey" FOREIGN KEY ("auth_user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."tenant_permissions"
    ADD CONSTRAINT "tenant_permissions_service_user_id_fkey" FOREIGN KEY ("service_user_id") REFERENCES "public"."service_users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."tenant_permissions"
    ADD CONSTRAINT "tenant_permissions_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."tickets"
    ADD CONSTRAINT "tickets_assignee_fkey" FOREIGN KEY ("assignee") REFERENCES "public"."service_users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."tickets"
    ADD CONSTRAINT "tickets_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."service_users"("id");



ALTER TABLE ONLY "public"."tickets"
    ADD CONSTRAINT "tickets_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE CASCADE;



CREATE POLICY "Acceso total verificado: JWT + Base de Datos" ON "public"."tenants" FOR SELECT TO "authenticated" USING ((((("auth"."jwt"() -> 'app_metadata'::"text") -> 'tenants'::"text") ? "slug") AND (EXISTS ( SELECT 1
   FROM ("public"."tenant_permissions" "tp"
     JOIN "public"."service_users" "su" ON (("tp"."service_user_id" = "su"."id")))
  WHERE (("tp"."tenant_id" = "tenants"."id") AND ("su"."auth_user_id" = "auth"."uid"()))))));



CREATE POLICY "Authors can update their own tickets" ON "public"."tickets" FOR UPDATE TO "authenticated" USING (("created_by" IN ( SELECT "service_users"."id"
   FROM "public"."service_users"
  WHERE ("service_users"."auth_user_id" = "auth"."uid"())))) WITH CHECK (("created_by" IN ( SELECT "service_users"."id"
   FROM "public"."service_users"
  WHERE ("service_users"."auth_user_id" = "auth"."uid"()))));



CREATE POLICY "Users can create tickets in their tenants" ON "public"."tickets" FOR INSERT TO "authenticated" WITH CHECK (("tenant_id" IN ( SELECT "tenant_permissions"."tenant_id"
   FROM "public"."tenant_permissions"
  WHERE ("tenant_permissions"."service_user_id" IN ( SELECT "service_users"."id"
           FROM "public"."service_users"
          WHERE ("service_users"."auth_user_id" = "auth"."uid"()))))));



CREATE POLICY "Users can delete own tickets" ON "public"."tickets" FOR DELETE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM ("public"."service_users" "su"
     JOIN "public"."tenant_permissions" "tp" ON (("tp"."service_user_id" = "su"."id")))
  WHERE (("su"."auth_user_id" = "auth"."uid"()) AND ("tickets"."created_by" = "su"."id") AND ("tickets"."tenant_id" = "tp"."tenant_id")))));



CREATE POLICY "Users can delete their own service_user" ON "public"."service_users" FOR DELETE TO "authenticated" USING (("auth_user_id" = "auth"."uid"()));



CREATE POLICY "Users can insert comments in their tenants" ON "public"."comments" FOR INSERT TO "authenticated" WITH CHECK (("tenant_id" IN ( SELECT "tenant_permissions"."tenant_id"
   FROM "public"."tenant_permissions"
  WHERE ("tenant_permissions"."service_user_id" IN ( SELECT "service_users"."id"
           FROM "public"."service_users"
          WHERE ("service_users"."auth_user_id" = "auth"."uid"()))))));



CREATE POLICY "Users can insert their own service_user" ON "public"."service_users" FOR INSERT TO "authenticated" WITH CHECK (("auth_user_id" = "auth"."uid"()));



CREATE POLICY "Users can read their own service_user" ON "public"."service_users" FOR SELECT TO "authenticated" USING (("auth_user_id" = "auth"."uid"()));



CREATE POLICY "Users can read their tenant memberships" ON "public"."tenant_permissions" FOR SELECT TO "authenticated" USING (("service_user_id" IN ( SELECT "service_users"."id"
   FROM "public"."service_users"
  WHERE ("service_users"."auth_user_id" = "auth"."uid"()))));



CREATE POLICY "Users can see comments from their tenants" ON "public"."comments" FOR SELECT TO "authenticated" USING (("tenant_id" IN ( SELECT "tenant_permissions"."tenant_id"
   FROM "public"."tenant_permissions"
  WHERE ("tenant_permissions"."service_user_id" IN ( SELECT "service_users"."id"
           FROM "public"."service_users"
          WHERE ("service_users"."auth_user_id" = "auth"."uid"()))))));



CREATE POLICY "Users can see tickets from their tenants" ON "public"."tickets" FOR SELECT TO "authenticated" USING (("tenant_id" IN ( SELECT "tenant_permissions"."tenant_id"
   FROM "public"."tenant_permissions"
  WHERE ("tenant_permissions"."service_user_id" IN ( SELECT "service_users"."id"
           FROM "public"."service_users"
          WHERE ("service_users"."auth_user_id" = "auth"."uid"()))))));



CREATE POLICY "Users can update their own service_user" ON "public"."service_users" FOR UPDATE TO "authenticated" USING (("auth_user_id" = "auth"."uid"())) WITH CHECK (("auth_user_id" = "auth"."uid"()));



ALTER TABLE "public"."comments" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."service_users" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."tenant_permissions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."tenants" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."tickets" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";






ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."comments";






GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";



GRANT ALL ON FUNCTION "public"."gtrgm_in"("cstring") TO "postgres";
GRANT ALL ON FUNCTION "public"."gtrgm_in"("cstring") TO "anon";
GRANT ALL ON FUNCTION "public"."gtrgm_in"("cstring") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gtrgm_in"("cstring") TO "service_role";



GRANT ALL ON FUNCTION "public"."gtrgm_out"("public"."gtrgm") TO "postgres";
GRANT ALL ON FUNCTION "public"."gtrgm_out"("public"."gtrgm") TO "anon";
GRANT ALL ON FUNCTION "public"."gtrgm_out"("public"."gtrgm") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gtrgm_out"("public"."gtrgm") TO "service_role";































































































































































GRANT ALL ON FUNCTION "public"."derive_tenant_from_ticket"() TO "anon";
GRANT ALL ON FUNCTION "public"."derive_tenant_from_ticket"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."derive_tenant_from_ticket"() TO "service_role";



GRANT ALL ON TABLE "public"."service_users" TO "anon";
GRANT ALL ON TABLE "public"."service_users" TO "authenticated";
GRANT ALL ON TABLE "public"."service_users" TO "service_role";



GRANT ALL ON FUNCTION "public"."get_service_users_with_tenant"("target_tenant_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_service_users_with_tenant"("target_tenant_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_service_users_with_tenant"("target_tenant_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_tenant_domain"("p_tenant_slug" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."get_tenant_domain"("p_tenant_slug" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_tenant_domain"("p_tenant_slug" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_tenant_name"("p_tenant_slug" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."get_tenant_name"("p_tenant_slug" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_tenant_name"("p_tenant_slug" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."gin_extract_query_trgm"("text", "internal", smallint, "internal", "internal", "internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gin_extract_query_trgm"("text", "internal", smallint, "internal", "internal", "internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gin_extract_query_trgm"("text", "internal", smallint, "internal", "internal", "internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gin_extract_query_trgm"("text", "internal", smallint, "internal", "internal", "internal", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gin_extract_value_trgm"("text", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gin_extract_value_trgm"("text", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gin_extract_value_trgm"("text", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gin_extract_value_trgm"("text", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gin_trgm_consistent"("internal", smallint, "text", integer, "internal", "internal", "internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gin_trgm_consistent"("internal", smallint, "text", integer, "internal", "internal", "internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gin_trgm_consistent"("internal", smallint, "text", integer, "internal", "internal", "internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gin_trgm_consistent"("internal", smallint, "text", integer, "internal", "internal", "internal", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gin_trgm_triconsistent"("internal", smallint, "text", integer, "internal", "internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gin_trgm_triconsistent"("internal", smallint, "text", integer, "internal", "internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gin_trgm_triconsistent"("internal", smallint, "text", integer, "internal", "internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gin_trgm_triconsistent"("internal", smallint, "text", integer, "internal", "internal", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gtrgm_compress"("internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gtrgm_compress"("internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gtrgm_compress"("internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gtrgm_compress"("internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gtrgm_consistent"("internal", "text", smallint, "oid", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gtrgm_consistent"("internal", "text", smallint, "oid", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gtrgm_consistent"("internal", "text", smallint, "oid", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gtrgm_consistent"("internal", "text", smallint, "oid", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gtrgm_decompress"("internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gtrgm_decompress"("internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gtrgm_decompress"("internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gtrgm_decompress"("internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gtrgm_distance"("internal", "text", smallint, "oid", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gtrgm_distance"("internal", "text", smallint, "oid", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gtrgm_distance"("internal", "text", smallint, "oid", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gtrgm_distance"("internal", "text", smallint, "oid", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gtrgm_options"("internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gtrgm_options"("internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gtrgm_options"("internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gtrgm_options"("internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gtrgm_penalty"("internal", "internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gtrgm_penalty"("internal", "internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gtrgm_penalty"("internal", "internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gtrgm_penalty"("internal", "internal", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gtrgm_picksplit"("internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gtrgm_picksplit"("internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gtrgm_picksplit"("internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gtrgm_picksplit"("internal", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gtrgm_same"("public"."gtrgm", "public"."gtrgm", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gtrgm_same"("public"."gtrgm", "public"."gtrgm", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gtrgm_same"("public"."gtrgm", "public"."gtrgm", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gtrgm_same"("public"."gtrgm", "public"."gtrgm", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gtrgm_union"("internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gtrgm_union"("internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gtrgm_union"("internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gtrgm_union"("internal", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."set_comment_author_name"() TO "anon";
GRANT ALL ON FUNCTION "public"."set_comment_author_name"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."set_comment_author_name"() TO "service_role";



GRANT ALL ON FUNCTION "public"."set_created_by_table_tickets"() TO "anon";
GRANT ALL ON FUNCTION "public"."set_created_by_table_tickets"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."set_created_by_table_tickets"() TO "service_role";



GRANT ALL ON FUNCTION "public"."set_created_by_value"() TO "anon";
GRANT ALL ON FUNCTION "public"."set_created_by_value"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."set_created_by_value"() TO "service_role";



GRANT ALL ON FUNCTION "public"."set_limit"(real) TO "postgres";
GRANT ALL ON FUNCTION "public"."set_limit"(real) TO "anon";
GRANT ALL ON FUNCTION "public"."set_limit"(real) TO "authenticated";
GRANT ALL ON FUNCTION "public"."set_limit"(real) TO "service_role";



GRANT ALL ON FUNCTION "public"."set_next_ticket_number"() TO "anon";
GRANT ALL ON FUNCTION "public"."set_next_ticket_number"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."set_next_ticket_number"() TO "service_role";



GRANT ALL ON FUNCTION "public"."set_ticket_assignee_name"() TO "anon";
GRANT ALL ON FUNCTION "public"."set_ticket_assignee_name"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."set_ticket_assignee_name"() TO "service_role";



GRANT ALL ON FUNCTION "public"."set_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."set_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."set_updated_at"() TO "service_role";



GRANT ALL ON FUNCTION "public"."show_limit"() TO "postgres";
GRANT ALL ON FUNCTION "public"."show_limit"() TO "anon";
GRANT ALL ON FUNCTION "public"."show_limit"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."show_limit"() TO "service_role";



GRANT ALL ON FUNCTION "public"."show_trgm"("text") TO "postgres";
GRANT ALL ON FUNCTION "public"."show_trgm"("text") TO "anon";
GRANT ALL ON FUNCTION "public"."show_trgm"("text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."show_trgm"("text") TO "service_role";



GRANT ALL ON FUNCTION "public"."similarity"("text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."similarity"("text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."similarity"("text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."similarity"("text", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."similarity_dist"("text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."similarity_dist"("text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."similarity_dist"("text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."similarity_dist"("text", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."similarity_op"("text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."similarity_op"("text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."similarity_op"("text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."similarity_op"("text", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."strict_word_similarity"("text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."strict_word_similarity"("text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."strict_word_similarity"("text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."strict_word_similarity"("text", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."strict_word_similarity_commutator_op"("text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."strict_word_similarity_commutator_op"("text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."strict_word_similarity_commutator_op"("text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."strict_word_similarity_commutator_op"("text", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."strict_word_similarity_dist_commutator_op"("text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."strict_word_similarity_dist_commutator_op"("text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."strict_word_similarity_dist_commutator_op"("text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."strict_word_similarity_dist_commutator_op"("text", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."strict_word_similarity_dist_op"("text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."strict_word_similarity_dist_op"("text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."strict_word_similarity_dist_op"("text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."strict_word_similarity_dist_op"("text", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."strict_word_similarity_op"("text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."strict_word_similarity_op"("text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."strict_word_similarity_op"("text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."strict_word_similarity_op"("text", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."word_similarity"("text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."word_similarity"("text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."word_similarity"("text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."word_similarity"("text", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."word_similarity_commutator_op"("text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."word_similarity_commutator_op"("text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."word_similarity_commutator_op"("text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."word_similarity_commutator_op"("text", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."word_similarity_dist_commutator_op"("text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."word_similarity_dist_commutator_op"("text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."word_similarity_dist_commutator_op"("text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."word_similarity_dist_commutator_op"("text", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."word_similarity_dist_op"("text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."word_similarity_dist_op"("text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."word_similarity_dist_op"("text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."word_similarity_dist_op"("text", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."word_similarity_op"("text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."word_similarity_op"("text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."word_similarity_op"("text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."word_similarity_op"("text", "text") TO "service_role";


















GRANT ALL ON TABLE "public"."comments" TO "anon";
GRANT ALL ON TABLE "public"."comments" TO "authenticated";
GRANT ALL ON TABLE "public"."comments" TO "service_role";



GRANT ALL ON TABLE "public"."tenant_permissions" TO "anon";
GRANT ALL ON TABLE "public"."tenant_permissions" TO "authenticated";
GRANT ALL ON TABLE "public"."tenant_permissions" TO "service_role";



GRANT ALL ON TABLE "public"."tenants" TO "anon";
GRANT ALL ON TABLE "public"."tenants" TO "authenticated";
GRANT ALL ON TABLE "public"."tenants" TO "service_role";



GRANT ALL ON TABLE "public"."tickets" TO "anon";
GRANT ALL ON TABLE "public"."tickets" TO "authenticated";
GRANT ALL ON TABLE "public"."tickets" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";































