import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { buildUrl } from "@/utils/url-helpers";


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
    await supabase.auth.signOut({ scope: 'global' });
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
