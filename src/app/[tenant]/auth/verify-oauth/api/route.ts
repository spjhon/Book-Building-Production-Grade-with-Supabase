import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { buildUrl } from "@/utils/url-helpers";
import { NextRequest, NextResponse } from "next/server";

/*** OAuth Callback Route Handler (Route Handler GET API)
 * ---------------------------------------
 * Este route handler es el punto de aterrizaje (callback) tras la autenticación con Google/OAuth:
 * - Intercambia el código de autorización (code) por una sesión de usuario real.
 * - Gestiona la redirección dinámica basada en el parámetro "next".
 * - Implementa un filtro de seguridad para asegurar que solo usuarios registrados en 'service_users' accedan.
 * @param request Objeto NextRequest que contiene el código de sesión en los searchParams.
 * @params tenant Slug del tenant obtenido de los parámetros dinámicos de la ruta para mantener el contexto.
 * @Flujo
 * 1. Extracción del tenant de los params y del código de autorización de la URL.
 * 2. Validación y saneamiento del parámetro de redirección "next".
 * 3. Verificación de existencia del código; si falta, redirige al flujo de error.
 * 4. Intercambio del código por sesión en Supabase Auth (Exchange Code for Session).
 * 5. Filtro de Seguridad: Verificación de existencia del usuario en la tabla 'service_users'.
 * 6. Gestión de salida (signOut) si el usuario no tiene perfil creado y redirección final.
 * @Return Redirecciones dinámicas al Dashboard (/tickets) o a páginas de error según el resultado.
 */ 
export async function GET(request: NextRequest, { params }: { params: Promise<{ tenant: string }>}) {
  
  // 1.
  const { tenant } = await params;
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  // 2. 
  // if "next" is in param, use it as the redirect URL
  let next = searchParams.get("next") ?? "/";
  if (!next.startsWith("/")) {
    // if "next" is not a relative URL, use the default
    next = "/";
  }
  
  // 3.
  if (!code) {
    return NextResponse.redirect(buildUrl("/error?type=No hay codigo de autenticacion de google", tenant, request), { status: 303 });
  }
  
  // 4.
  const supabase = await createSupabaseServerClient();
  const { data: sessionData, error: sessionError } = await supabase.auth.exchangeCodeForSession(code);

  if (sessionError || !sessionData?.user) {
    return NextResponse.redirect(buildUrl("/error?type=Fallo el login con google", tenant, request), { status: 303 });
  }

  const user = sessionData.user;

  // 5. --- EL FILTRO DE SEGURIDAD ---
  // Buscamos si el usuario existe en la tabla de 'service_users' 
  const { data: profile, error: profileError } = await supabase
  .from("service_users")
  .select("id")
  .eq("auth_user_id", user.id)
  .single();

    

  // 6.
  if (profileError || !profile) {
    // Primero cerramos la sesión en el cliente actual
    await supabase.auth.signOut(); 

    // Usamos el cliente Admin para eliminar al usuario de la tabla auth.users
    const supabaseAdmin = createSupabaseAdminClient();
    await supabaseAdmin.auth.admin.deleteUser(user.id);

    // Redirigimos al error informando que no está registrado
    const errorType = "Usuario no registrado, primero registrate para poder acceder";
    return NextResponse.redirect(buildUrl(`/error?type=${errorType}`, tenant, request), { status: 303 });
  }

  // 7.
  return NextResponse.redirect(buildUrl("/tickets", tenant, request), { status: 303 });
  
}