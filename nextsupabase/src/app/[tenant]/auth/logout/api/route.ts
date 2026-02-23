import { createSupabaseServerClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

/**
 * Logout Route Handler (POST)
 * ---------------------------
 * Este manejador procesa el cierre de sesión de forma imperativa mediante una petición POST.
 * Es el método recomendado por razones de seguridad para evitar cierres de sesión accidentales
 * o malintencionados provocados por navegaciones automáticas del navegador.
 * * @param {Request} request - Objeto de petición para construir la URL de redirección base.
 * * @param {Promise} params - Contexto de la ruta que contiene el 'tenant' dinámico.
 * * * Flujo:
 * 1. Resuelve el contexto del 'tenant' para asegurar que la redirección final sea contextual.
 * 2. Inicializa el cliente de servidor de Supabase y ejecuta 'signOut'. Invalida la sesión del usuario y 
 * limpia las cookies de autenticación del lado del servidor.
 * 3. Construye la URL de retorno apuntando específicamente a la página de login del tenant.
 * 4. Redirige al usuario al formulario de inicio de sesión tras completar el proceso.
 * * * @return NextResponse - Redirección segura (HTTP 302) hacia el login del tenant.
 */

export async function POST(request: Request, {params}: { params: Promise<{ tenant: string }>} ) {

  //1.
  const { tenant } = await params;

  //2.
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  //3.
  const url = new URL(`/${tenant}/auth/login`, request.url)

  //4.
  return NextResponse.redirect(url);
}
