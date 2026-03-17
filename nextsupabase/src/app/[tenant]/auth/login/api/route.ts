import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { buildUrl } from "@/utils/url-helpers";


/*** Password Login Route Handler (Route Handler POST API)
 * ---------------------------------------
 * Este route handler se encarga de procesar el inicio de sesión tradicional en caso que en el front este javascript desactivado:
 * - Recibe las credenciales (email y password) desde el formulario de login.
 * - Valida la autenticidad del usuario en Supabase Auth.
 * - Verifica que el usuario pertenezca al tenant específico intentando acceder (Multi-tenancy check).
 * @param request El objeto NextRequest que contiene el FormData con las credenciales.
 * @params tenant El slug del tenant obtenido desde los parámetros dinámicos de la ruta.
 * @Flujo
 * 1. Obtención del slug del tenant y creación del cliente de Supabase (Server Side).
 * 2. Extracción y validación de tipos de los datos del formulario (Email y Password).
 * 3. Intento de autenticación en Supabase Auth con las credenciales proporcionadas.
 * 4. Validación de seguridad Multi-tenant: Verificamos si el tenant actual está en la metadata del usuario.
 * 5. Gestión de cierre de sesión y redirección en caso de error o acceso no autorizado.
 * 6. Redirección final exitosa al dashboard (/tickets) manteniendo el contexto del subdominio.
 * @Return Redirects dinámicos dependiendo del éxito de la autenticación o fallos de pertenencia al tenant.
 */ 
export async function POST(request: NextRequest, {params}: { params: Promise<{ tenant: string }>}) {

  // 1.
  const { tenant } = await params;
  const supabase = await createSupabaseServerClient();

  // 2.
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");

  if (typeof email !== "string" || typeof password !== "string") {
      return NextResponse.redirect(buildUrl(`/error?type=invalid-form`, tenant, request), { status: 303 });
  }

  // 3.
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  // 4.
  const userData = data?.user;
  
  /* Nota de seguridad: No basta con que el password sea correcto. 
     Debemos confirmar que el usuario tiene acceso explícito a este subdominio/tenant
     verificando la propiedad 'tenants' dentro de su app_metadata.
  */
  if (error || !userData || !userData.app_metadata?.tenants?.includes(tenant)) {
    
    // 5.
    await supabase.auth.signOut();
    return NextResponse.redirect(buildUrl(`/error?type=${error?.message ?? "Error al intentar hacer login por medio de route handler"}`, tenant, request), { status: 303 });
  }

  // 6.
  return NextResponse.redirect(buildUrl("/tickets", tenant, request), { status: 303 });
}

/**
import { NextResponse } from "next/server";
export async function POST(request: Request) {
return NextResponse.json({ message: "Hello from Route Handler" });
}
*/
