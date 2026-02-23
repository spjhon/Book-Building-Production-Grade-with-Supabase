import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";


/**
 * Login Auth Route Handler (POST)
 * ------------------------------
 * Este manejador procesa las solicitudes de inicio de sesión con contraseña (form login).
 * Está diseñado para funcionar tanto con peticiones JavaScript (fetch) como con envíos 
 * nativos de formularios HTML (útil para Progressive Enhancement o JS desactivado).
 * * @param {Request} request - Objeto de petición estándar con los datos del formulario.
 * * @param {Promise} params - Contexto de la ruta que contiene el 'tenant' dinámico.
 * * * Flujo:
 * 1. Resuelve el contexto del 'tenant' y crea el cliente de Supabase para el servidor.
 * 2. Extrae y valida que las credenciales (email y password) sean strings válidos.
 * 3. Intenta la autenticación en Supabase mediante 'signInWithPassword'.
 * 4. Valida la existencia del usuario y verifica que posea permisos para el tenant actual 
 * inspeccionando los 'app_metadata'. Si falla, fuerza el cierre de sesión para limpiar cookies.
 * 5. Redirige al usuario al área de tickets del tenant tras un login exitoso.
 * * * @return NextResponse - Redirección dinámica basada en el resultado de la autenticación.
 */

export async function POST(request: Request, {params}: { params: Promise<{ tenant: string }>}) {

  //1.
  const { tenant } = await params;
  const supabase = await createSupabaseServerClient();

  //2.
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  if (typeof email !== "string" || typeof password !== "string") {
      return NextResponse.redirect(new URL("/error?type=invalid-form", request.url),{ status: 302 });
  }

  //3.
  const { data, error } = await supabase.auth.signInWithPassword({email, password,});

  //4.
  const userData = data?.user;
  if (error || !userData || !userData.app_metadata?.tenants.includes(tenant)) {
    await supabase.auth.signOut();
    return NextResponse.redirect(new URL("/error?type=login-failedd", request.url), { status: 302 });
  }

  //5.
  return NextResponse.redirect(new URL(`/${tenant}/tickets`, request.url), {status: 302,});

}

/**
import { NextResponse } from "next/server";
export async function POST(request: Request) {
return NextResponse.json({ message: "Hello from Route Handler" });
}
*/
