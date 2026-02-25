import { createSupabaseServerClient } from "@/lib/supabase/server";
import { buildUrl, getHostnameAndPort } from "@/utils/url-helpers";
import { type EmailOtpType } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { type NextRequest } from "next/server";
// Ya no necesitamos importar TENANT_MAP aquí si lo manejamos en el helper o lo pasamos dinámicamente

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  
  // Extraemos el hostname para identificar el contexto
  const [hostname] = getHostnameAndPort(request);
  
  /* Nota: El libro sugiere que el 'tenant' se pase como argumento. 
     Como estamos en un subdominio, el 'tenant' es el hostname mismo 
     o el slug que sacamos del mapa.
  */
  const tenant = hostname; // O el slug correspondiente de tu mapa

  if (token_hash && type) {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.verifyOtp({ type, token_hash });

    if (!error) {
      // Redirección absoluta para asegurar que el usuario 
      // permanezca en el subdominio correcto tras validar el correo.
      redirect(buildUrl("/tickets", tenant, request));
    } else {
      redirect(buildUrl(`/auth/error?error=${error.message}`, tenant, request));
    }
  }

  redirect(buildUrl("/auth/error?error=No token hash or type", tenant, request));
}



/*
export async function GET(request: NextRequest) {

  //1.
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
 

  //2.
  if (token_hash && type) {
    const supabase = await createSupabaseServerClient();

    const { error } = await supabase.auth.verifyOtp({type, token_hash});

    
    if (!error) {
      //3. redirect user to specified redirect URL or root of app
      redirect(`/tickets`);
    } else {
      // 4. redirect the user to an error page with some instructions
      redirect(`/auth/error?error=${error?.message}`);
    }
  }

  //5.
  redirect(`/auth/error?error=No token hash or type`);
}
*/