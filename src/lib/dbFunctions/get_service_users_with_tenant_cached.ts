// lib/dbFunctions/get_service_users_cached.ts
import "server-only";
import { cacheLife, cacheTag } from 'next/cache';
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { PostgrestError } from "@supabase/supabase-js";

export type ServiceUser = {
  id: string;
  full_name: string;
};

/**
 * Función cacheada con el nuevo modelo de Next.js
 * 1. 'use cache' -> Almacena el resultado en el Servidor (Data Cache).
 * 2. Los argumentos (tenantId) -> Se vuelven automáticamente la "Cache Key".
 * 3. Al ser una función exportada, React la memoiza durante el render.
 */
export async function fetchServiceUsersCached(tenantId: string) {
  'use cache'; // Habilita Cache Components para esta función
  
  // Capa de Revalidación: Definimos el tiempo de vida (equivalente a revalidate: 30)
  // Usamos una frase descriptiva o una configuración personalizada
  cacheLife('minutes'); 
  
  // Capa de Organización: Tag para invalidación manual (updateTag)
  cacheTag(`users-${tenantId}`);

  const supabaseAdmin = createSupabaseAdminClient();

  const { data, error } = await supabaseAdmin.rpc("get_service_users_with_tenant", { 
    target_tenant_id: tenantId 
  });

  if (error) {
    console.error("RPC Error:", error);
    return { data: null, error: error as PostgrestError };
  }

  return { data: data as ServiceUser[], error: null };
}