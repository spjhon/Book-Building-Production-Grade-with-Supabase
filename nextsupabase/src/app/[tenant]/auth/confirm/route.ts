import { createSupabaseServerClient } from "@/lib/supabase/server";
import { type EmailOtpType } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { type NextRequest } from "next/server";


/**
 * Confirm Auth Route Handler (GET)
 * -------------------------------
 * Este manejador se encarga de procesar la verificación de tokens de un solo uso (OTP) 
 * enviados por Supabase a través de correo electrónico (Magic Links o confirmaciones de registro).
 * * @param {NextRequest} request - Objeto de petición de Next.js que contiene los parámetros de búsqueda.
 * * Flujo:
 * 1. Extrae el 'token_hash', el 'type', los searchParams y el tenant de la URL de redirección.
 * 2. Valida el token y el type mediante el cliente de servidor de Supabase.
 * 3. Si la validación es exitosa, redirige al usuario al dashboard del tenant correspondiente.
 * 4. En caso de error o parámetros faltantes, redirige a una página de error controlada. 
 * 5. En caso de que no haya ningun token o type, redirigir a la pagina de error con el correspondiente token para renderizar el error alla.
   * @return null
 */
export async function GET(request: NextRequest) {

  //1.
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const tenant = searchParams.get("tenant") ?? "/";

  //2.
  if (token_hash && type) {
    const supabase = await createSupabaseServerClient();

    const { error } = await supabase.auth.verifyOtp({type, token_hash});

    
    if (!error) {
      //3. redirect user to specified redirect URL or root of app
      redirect(`/${tenant}/tickets`);
    } else {
      // 4. redirect the user to an error page with some instructions
      redirect(`/auth/error?error=${error?.message}`);
    }
  }

  //5.
  redirect(`/auth/error?error=No token hash or type`);
}
