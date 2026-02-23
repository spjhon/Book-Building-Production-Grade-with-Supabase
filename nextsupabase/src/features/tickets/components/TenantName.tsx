import { createSupabaseServerClient } from "@/lib/supabase/server";

type tenantProp = {
  tenant: string;
};


/**
 * TenantName Component (Server Component)
 * --------------------------------------
 * Componente asíncrono encargado de recuperar y mostrar el nombre oficial del tenant 
 * consultando directamente la base de datos a través de una función RPC en Supabase.
 *
 * * * @param {string} tenant - El slug o identificador único del tenant actual.
 * * * Datos:
 * - 'supabase': Cliente de servidor para realizar peticiones autenticadas desde el backend.
 * - 'get_tenant_name': Función almacenada (RPC) en Postgres que retorna el nombre del tenant.
 * - 'p_tenant_slug': Parámetro enviado a la base de datos para filtrar la búsqueda.
 * * * Flujo:
 * 1. Inicializa el cliente de Supabase para servidor de forma asíncrona.
 * 2. Llama a la función remota 'get_tenant_name' pasando el slug del tenant (actualmente hardcodeado como "acme" para pruebas).
 * 3. Gestiona la respuesta imprimiendo en consola el resultado (data) o el error obtenido.
 * 4. Renderiza el nombre del tenant envuelto en una etiqueta de énfasis (strong).
 * 5. Nota: El componente permite la visualización dinámica de la identidad de la organización en layouts compartidos.
 * * * @return JSX.Element - Un elemento de texto enriquecido con el nombre del tenant.
 */


export default async function TenantName({ tenant }: tenantProp) {
  const tenantName = tenant;

  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase.rpc("get_tenant_name", {
    p_tenant_slug: "acme",
  });

  console.log(data? data:error);

  return <strong>{tenantName}</strong>;
}
