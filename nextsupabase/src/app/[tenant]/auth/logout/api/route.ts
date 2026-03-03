import { createSupabaseServerClient } from "@/lib/supabase/server";
import { buildUrl } from "@/utils/url-helpers";
import { NextRequest, NextResponse } from "next/server";



export async function POST(request: NextRequest, { params }: { params: Promise<{ tenant: string }> }) {

  // 1. Obtenemos el tenant de los parámetros
  const { tenant } = await params;

  // 2. Creamos el cliente y cerramos sesión
  // Esto limpiará las cookies en el servidor
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signOut();

  if (error){
    return NextResponse.redirect(buildUrl(`/auth/error?type=Logout Error`, tenant, request), { status: 303 });
  }

  // 3. Construimos la URL absoluta usando el helper
  // Esto asegura que el usuario se quede en acme.miapp.com/auth/login
  const redirectUrl = buildUrl("/auth/login", tenant, request);

  // 4. Redirigimos con estatus 303 (estándar para después de un POST)
  return NextResponse.redirect(redirectUrl, { status: 303 });
}
