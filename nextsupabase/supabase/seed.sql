SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- \restrict LNUJLTOcdKqRN2Bg16TzGNylbVu6gemjfnkNXmdBpSLT6yEKcT7EXKhMgNR7PCw

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
	('00000000-0000-0000-0000-000000000000', 'a53727cb-2f44-4f10-82af-35cd57e56c38', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"prueba01@gmail.com","user_id":"8d8b21b1-8e8f-44b9-80b3-e16236e1b596","user_phone":""}}', '2026-01-18 20:32:13.620726-05', ''),
	('00000000-0000-0000-0000-000000000000', 'd07a78a9-7656-43f4-bd45-29106e3bac27', '{"action":"login","actor_id":"8d8b21b1-8e8f-44b9-80b3-e16236e1b596","actor_username":"prueba01@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-01-25 17:49:58.904904-05', ''),
	('00000000-0000-0000-0000-000000000000', '75bc3067-82f1-4e7b-806d-825ee2dc0f09', '{"action":"logout","actor_id":"8d8b21b1-8e8f-44b9-80b3-e16236e1b596","actor_username":"prueba01@gmail.com","actor_via_sso":false,"log_type":"account"}', '2026-01-25 18:05:14.88876-05', ''),
	('00000000-0000-0000-0000-000000000000', '0249ea1f-8959-4b90-921a-64f5aabc4e34', '{"action":"login","actor_id":"8d8b21b1-8e8f-44b9-80b3-e16236e1b596","actor_username":"prueba01@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-01-25 18:06:45.110137-05', ''),
	('00000000-0000-0000-0000-000000000000', '67582d76-96a4-42ae-9ec4-8c1e516b1f5e', '{"action":"logout","actor_id":"8d8b21b1-8e8f-44b9-80b3-e16236e1b596","actor_username":"prueba01@gmail.com","actor_via_sso":false,"log_type":"account"}', '2026-01-25 18:26:23.786898-05', ''),
	('00000000-0000-0000-0000-000000000000', '23dcd33c-aa38-452b-83b8-23b2e11b7f73', '{"action":"login","actor_id":"8d8b21b1-8e8f-44b9-80b3-e16236e1b596","actor_username":"prueba01@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-01-25 18:27:44.856437-05', ''),
	('00000000-0000-0000-0000-000000000000', 'e63e2963-33dd-4399-9f35-954baee66cd0', '{"action":"logout","actor_id":"8d8b21b1-8e8f-44b9-80b3-e16236e1b596","actor_username":"prueba01@gmail.com","actor_via_sso":false,"log_type":"account"}', '2026-01-25 18:28:11.203237-05', ''),
	('00000000-0000-0000-0000-000000000000', 'c2603e7a-b988-4e75-b440-aae82e7bc8ee', '{"action":"user_recovery_requested","actor_id":"8d8b21b1-8e8f-44b9-80b3-e16236e1b596","actor_username":"prueba01@gmail.com","actor_via_sso":false,"log_type":"user"}', '2026-01-25 18:28:29.906489-05', ''),
	('00000000-0000-0000-0000-000000000000', '3de38c8d-d04a-4877-9fff-3b21ddf68571', '{"action":"login","actor_id":"8d8b21b1-8e8f-44b9-80b3-e16236e1b596","actor_username":"prueba01@gmail.com","actor_via_sso":false,"log_type":"account"}', '2026-01-25 18:28:40.729977-05', ''),
	('00000000-0000-0000-0000-000000000000', 'aa0db4a1-29ec-46ad-80ad-d2dbc3bd870c', '{"action":"token_refreshed","actor_id":"8d8b21b1-8e8f-44b9-80b3-e16236e1b596","actor_username":"prueba01@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-01-25 20:25:47.078896-05', ''),
	('00000000-0000-0000-0000-000000000000', '2ec761f7-b02d-45c9-9c30-00d0622ab7de', '{"action":"token_revoked","actor_id":"8d8b21b1-8e8f-44b9-80b3-e16236e1b596","actor_username":"prueba01@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-01-25 20:25:47.081019-05', ''),
	('00000000-0000-0000-0000-000000000000', '1fe881ac-948c-4313-994b-c7ec55384a0f', '{"action":"logout","actor_id":"8d8b21b1-8e8f-44b9-80b3-e16236e1b596","actor_username":"prueba01@gmail.com","actor_via_sso":false,"log_type":"account"}', '2026-01-25 20:25:47.185329-05', ''),
	('00000000-0000-0000-0000-000000000000', '514aa4c5-b825-4844-8810-b90e195c1275', '{"action":"login","actor_id":"8d8b21b1-8e8f-44b9-80b3-e16236e1b596","actor_username":"prueba01@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-01-25 20:56:07.132256-05', ''),
	('00000000-0000-0000-0000-000000000000', '9acf1a16-bde9-4da8-a48d-28cf0d6033d6', '{"action":"logout","actor_id":"8d8b21b1-8e8f-44b9-80b3-e16236e1b596","actor_username":"prueba01@gmail.com","actor_via_sso":false,"log_type":"account"}', '2026-01-25 20:57:27.46908-05', ''),
	('00000000-0000-0000-0000-000000000000', 'da337d73-7cc5-45e8-9fa8-d9fea0dea28b', '{"action":"login","actor_id":"8d8b21b1-8e8f-44b9-80b3-e16236e1b596","actor_username":"prueba01@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-01-25 21:36:01.6183-05', ''),
	('00000000-0000-0000-0000-000000000000', '151e3684-b976-40b8-85a6-53c05da09476', '{"action":"logout","actor_id":"8d8b21b1-8e8f-44b9-80b3-e16236e1b596","actor_username":"prueba01@gmail.com","actor_via_sso":false,"log_type":"account"}', '2026-01-25 21:36:11.917379-05', ''),
	('00000000-0000-0000-0000-000000000000', 'a0a8d766-4925-4c6f-9f63-39faf81031cb', '{"action":"login","actor_id":"8d8b21b1-8e8f-44b9-80b3-e16236e1b596","actor_username":"prueba01@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-01-25 21:42:19.341804-05', ''),
	('00000000-0000-0000-0000-000000000000', '23df1bd0-8ab7-4333-8df4-2974ee5ccc94', '{"action":"logout","actor_id":"8d8b21b1-8e8f-44b9-80b3-e16236e1b596","actor_username":"prueba01@gmail.com","actor_via_sso":false,"log_type":"account"}', '2026-01-25 21:44:12.261884-05', ''),
	('00000000-0000-0000-0000-000000000000', '002519f5-495f-4223-921a-c554a70dbe7b', '{"action":"login","actor_id":"8d8b21b1-8e8f-44b9-80b3-e16236e1b596","actor_username":"prueba01@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-01-25 21:44:30.594695-05', ''),
	('00000000-0000-0000-0000-000000000000', '44a3b887-24cb-43a2-8fb2-e4785aebee80', '{"action":"login","actor_id":"8d8b21b1-8e8f-44b9-80b3-e16236e1b596","actor_username":"prueba01@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-01-25 21:47:17.740735-05', '');


--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."flow_state" ("id", "user_id", "auth_code", "code_challenge_method", "code_challenge", "provider_type", "provider_access_token", "provider_refresh_token", "created_at", "updated_at", "authentication_method", "auth_code_issued_at") VALUES
	('2a18e4b1-5cf2-4edd-a68e-48c1ba70ce4c', '8d8b21b1-8e8f-44b9-80b3-e16236e1b596', '2264ebd1-48a2-4a6e-aadc-9f9eb564d8c4', 's256', 'UZ5uZqnfrgu6vxdTeOr9GdTEtUfUFoILwwZ63elCX7I', 'magiclink', '', '', '2026-01-25 18:28:29.878181-05', '2026-01-25 18:28:29.878181-05', 'magiclink', NULL);


--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at", "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token", "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at", "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin", "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change", "phone_change_token", "phone_change_sent_at", "email_change_token_current", "email_change_confirm_status", "banned_until", "reauthentication_token", "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous") VALUES
	('00000000-0000-0000-0000-000000000000', '8d8b21b1-8e8f-44b9-80b3-e16236e1b596', 'authenticated', 'authenticated', 'prueba01@gmail.com', '$2a$10$amJ/KyxS/zP5grj5vdlzquXNHq1MCAPA1AbtxiEpJIqUxMMTsIBEC', '2026-01-18 20:32:13.623297-05', NULL, '', NULL, '', '2026-01-25 18:28:29.90772-05', '', '', NULL, '2026-01-25 21:47:17.742316-05', '{"provider": "email", "providers": ["email"]}', '{"email_verified": true}', NULL, '2026-01-18 20:32:13.613454-05', '2026-01-25 21:47:17.745816-05', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false);


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

INSERT INTO "auth"."sessions" ("id", "user_id", "created_at", "updated_at", "factor_id", "aal", "not_after", "refreshed_at", "user_agent", "ip", "tag", "oauth_client_id", "refresh_token_hmac_key", "refresh_token_counter", "scopes") VALUES
	('b3984774-bdd3-47f1-a9f4-3382477696e2', '8d8b21b1-8e8f-44b9-80b3-e16236e1b596', '2026-01-25 21:44:30.596384-05', '2026-01-25 21:44:30.596384-05', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:147.0) Gecko/20100101 Firefox/147.0', '172.18.0.1', NULL, NULL, NULL, NULL, NULL),
	('1f4e1ba1-5752-47a4-8694-380ef76fb268', '8d8b21b1-8e8f-44b9-80b3-e16236e1b596', '2026-01-25 21:47:17.742401-05', '2026-01-25 21:47:17.742401-05', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:147.0) Gecko/20100101 Firefox/147.0', '172.18.0.1', NULL, NULL, NULL, NULL, NULL);


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."mfa_amr_claims" ("session_id", "created_at", "updated_at", "authentication_method", "id") VALUES
	('b3984774-bdd3-47f1-a9f4-3382477696e2', '2026-01-25 21:44:30.600365-05', '2026-01-25 21:44:30.600365-05', 'password', '2166e6d1-0e8d-4555-8067-9855c790f4f1'),
	('1f4e1ba1-5752-47a4-8694-380ef76fb268', '2026-01-25 21:47:17.746528-05', '2026-01-25 21:47:17.746528-05', 'password', '053cfedf-0b73-4aab-af09-310ac92bfd42');


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

INSERT INTO "auth"."refresh_tokens" ("instance_id", "id", "token", "user_id", "revoked", "created_at", "updated_at", "parent", "session_id") VALUES
	('00000000-0000-0000-0000-000000000000', 9, '3rq2zt34o7wq', '8d8b21b1-8e8f-44b9-80b3-e16236e1b596', false, '2026-01-25 21:44:30.598548-05', '2026-01-25 21:44:30.598548-05', NULL, 'b3984774-bdd3-47f1-a9f4-3382477696e2'),
	('00000000-0000-0000-0000-000000000000', 10, 'cchrduzvan7h', '8d8b21b1-8e8f-44b9-80b3-e16236e1b596', false, '2026-01-25 21:47:17.744402-05', '2026-01-25 21:47:17.744402-05', NULL, '1f4e1ba1-5752-47a4-8694-380ef76fb268');


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

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 10, true);


--
-- Name: hooks_id_seq; Type: SEQUENCE SET; Schema: supabase_functions; Owner: supabase_functions_admin
--

SELECT pg_catalog.setval('"supabase_functions"."hooks_id_seq"', 1, false);


--
-- PostgreSQL database dump complete
--

-- \unrestrict LNUJLTOcdKqRN2Bg16TzGNylbVu6gemjfnkNXmdBpSLT6yEKcT7EXKhMgNR7PCw

RESET ALL;
