import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { buildUrl } from "@/utils/url-helpers";
import { NextRequest, NextResponse } from "next/server";


export async function GET(request: NextRequest, { params }: { params: Promise<{ tenant: string }>}) {
  
  // 1.
  const { tenant } = await params;
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  console.log(code)
  console.log(searchParams)

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