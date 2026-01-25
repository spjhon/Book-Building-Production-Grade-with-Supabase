SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- \restrict siJhD9mcTSaV1Jo2sjPhru7buOTnIddh1njydplx6dboQdtZlE27OB6DIxdnqwx

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."audit_log_entries" ("instance_id", "id", "payload", "created_at", "ip_address") VALUES
	('00000000-0000-0000-0000-000000000000', 'a53727cb-2f44-4f10-82af-35cd57e56c38', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"prueba01@gmail.com","user_id":"8d8b21b1-8e8f-44b9-80b3-e16236e1b596","user_phone":""}}', '2026-01-18 20:32:13.620726-05', '');


--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at", "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token", "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at", "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin", "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change", "phone_change_token", "phone_change_sent_at", "email_change_token_current", "email_change_confirm_status", "banned_until", "reauthentication_token", "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous") VALUES
	('00000000-0000-0000-0000-000000000000', '8d8b21b1-8e8f-44b9-80b3-e16236e1b596', 'authenticated', 'authenticated', 'prueba01@gmail.com', '$2a$10$amJ/KyxS/zP5grj5vdlzquXNHq1MCAPA1AbtxiEpJIqUxMMTsIBEC', '2026-01-18 20:32:13.623297-05', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"email_verified": true}', NULL, '2026-01-18 20:32:13.613454-05', '2026-01-18 20:32:13.624555-05', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false);


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at", "updated_at", "id") VALUES
	('8d8b21b1-8e8f-44b9-80b3-e16236e1b596', '8d8b21b1-8e8f-44b9-80b3-e16236e1b596', '{"sub": "8d8b21b1-8e8f-44b9-80b3-e16236e1b596", "email": "prueba01@gmail.com", "email_verified": false, "phone_verified": false}', 'email', '2026-01-18 20:32:13.617515-05', '2026-01-18 20:32:13.617603-05', '2026-01-18 20:32:13.617603-05', 'cc679bda-abdf-4405-a44c-da6295d05bf7');


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_clients; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_authorizations; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_client_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_consents; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: service_users; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."service_users" ("id", "auth_user_id", "full_name", "created_at", "updated_at") VALUES
	('00c88657-fe83-4b5a-9fb6-f108486ae11d', '8d8b21b1-8e8f-44b9-80b3-e16236e1b596', 'nombre completo de prueba', '2026-01-18 20:33:01.278176-05', '2026-01-18 20:33:01.278176-05');


--
-- Data for Name: tenants; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."tenants" ("id", "name", "domain", "created_at", "updated_at") VALUES
	('11111111-1111-1111-1111-111111111111', 'Packt Publishing', 'packt.local', '2026-01-18 20:29:54.168441-05', '2026-01-18 20:29:54.168441-05'),
	('22222222-2222-2222-2222-222222222222', 'Activenode Education', 'activenode.learn', '2026-01-18 20:29:54.168441-05', '2026-01-18 20:29:54.168441-05'),
	('33333333-3333-3333-3333-333333333333', 'OddMonkey Inc', 'oddmonkey.inc', '2026-01-18 20:29:54.168441-05', '2026-01-18 20:29:54.168441-05');


--
-- Data for Name: tenant_permissions; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."tenant_permissions" ("id", "tenant_id", "service_user_id", "created_at", "updated_at") VALUES
	('15f79c0d-0987-4371-b15b-bda34c2c6ad6', '11111111-1111-1111-1111-111111111111', '00c88657-fe83-4b5a-9fb6-f108486ae11d', '2026-01-25 16:56:02.398815-05', '2026-01-25 16:56:02.398815-05'),
	('dd0cc0f0-3484-4823-ba66-45dbe004bf48', '22222222-2222-2222-2222-222222222222', '00c88657-fe83-4b5a-9fb6-f108486ae11d', '2026-01-25 16:56:20.743312-05', '2026-01-25 16:56:20.743312-05');


--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: buckets_analytics; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: buckets_vectors; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: iceberg_namespaces; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: iceberg_tables; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: prefixes; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: vector_indexes; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: hooks; Type: TABLE DATA; Schema: supabase_functions; Owner: supabase_functions_admin
--



--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 1, false);


--
-- Name: hooks_id_seq; Type: SEQUENCE SET; Schema: supabase_functions; Owner: supabase_functions_admin
--

SELECT pg_catalog.setval('"supabase_functions"."hooks_id_seq"', 1, false);


--
-- PostgreSQL database dump complete
--

-- \unrestrict siJhD9mcTSaV1Jo2sjPhru7buOTnIddh1njydplx6dboQdtZlE27OB6DIxdnqwx

RESET ALL;
