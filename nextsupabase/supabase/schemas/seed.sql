

-- ==========================================
-- Seed: service_users
-- ==========================================

insert into public.service_users (id, auth_user_id, full_name)
values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '06c430dd-a008-426b-a6e4-bd72e886369b', 'Ana Torres');


-- ==========================================
-- Seed: tenants
-- ==========================================

insert into public.tenants (id, name, domain, slug)
values
  ('aaaaaaaa-0000-0000-0000-000000000001', 'Acme Corp', 'acme.com', 'acme'),
  ('bbbbbbbb-0000-0000-0000-000000000002', 'Globex Inc', 'globex.com', 'globex'),
  ('cccccccc-0000-0000-0000-000000000003', 'Initech', 'initech.com', 'initech'),
  ('dddddddd-0000-0000-0000-000000000004', 'Umbrella Co', 'umbrella.com', 'umbrella');

-- ==========================================
-- Seed: tenant_permissions
-- ==========================================

insert into public.tenant_permissions (
  id,
  tenant_id,
  service_user_id,
  role
)
values
  (
    gen_random_uuid(),
    'aaaaaaaa-0000-0000-0000-000000000001',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'owner'
  ),
  (
    gen_random_uuid(),
    'bbbbbbbb-0000-0000-0000-000000000002',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'owner'
  );
  


UPDATE auth.users
SET raw_app_meta_data = '{"provider": "email","providers":
["email"],"tenants": ["acme", "globex"]}'
WHERE id='06c430dd-a008-426b-a6e4-bd72e886369b';