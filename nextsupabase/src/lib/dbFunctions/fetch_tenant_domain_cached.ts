"use server";

import "server-only";
import { unstable_cache } from "next/cache";
import { createSupabaseAdminClient } from "../supabase/admin";



// función base sin cache
async function fetchTenantDomain(tenantSlug: string) {
  if (!tenantSlug) return null;

  const supabaseAdmin = createSupabaseAdminClient()

  const { data, error } = await supabaseAdmin.rpc("get_tenant_data", {
    p_tenant_slug: tenantSlug,
  });

  if (error) {
    console.error("Tenant RPC error:", error.message);
    return null;
  }

  return data[0] ?? null;
}

// versión cacheada con TTL de 60 segundos
export const fetchTenantDomainCached = unstable_cache(
  async (tenantSlug: string) => {
    return await fetchTenantDomain(tenantSlug);
  },
  ["tenant-cache"], // key base
  {
    revalidate: 60, // 1 minuto
  }
);