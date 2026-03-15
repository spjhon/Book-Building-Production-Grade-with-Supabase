
import { LoginForm } from "@/features/auth/components/LoginForm";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { TenantId } from "@/types/authTypes";
import { redirect } from "next/navigation";

//import { createSupabaseBrowserClient } from "@/lib/supabase/client";
//import { useEffect } from "react";
//import { useSearchParams } from "next/navigation";


/**
 * Login Page Component (Server Page Component)
 * --------------------------------------
 * Esta página gestiona la visualización del formulario de autenticación, permitiendo
 * alternar entre el inicio de sesión con contraseña o mediante Magic Link.
 * * @param {Promise} searchParams - Parámetros de búsqueda opcionales (ej: 'magicLink=yes').
 * * @param {Promise} params - Parámetros dinámicos de la ruta que contienen el 'tenant'.
 * * * Flujo:
 * 1. Resuelve los parámetros dinámicos y de búsqueda de forma asíncrona (Next.js 15).
 * 2. Determina el método de autenticación preferido basándose en el query param 'magicLink'.
 * 3. Verifica si ya existe una sesión activa mediante el chequeo de 'claims' en Supabase.
 * 4. Si el usuario ya está autenticado, realiza una redirección permanente al dashboard de tickets.
 * 5. Si no está autenticado, renderiza el formulario con el modo correspondiente (Password o Magic Link).
 * * * @return JSX.Element - Una página centrada con el formulario de inicio de sesión configurado.
 */
export default async function Login({searchParams, params}: {searchParams: Promise<{magicLink: string}>, params: Promise<{ tenant: TenantId }>}) {

  //1.
  const { tenant } = await params;
  const {magicLink} = await searchParams

  
    /**
  useEffect(() => {
  const supabase = createSupabaseBrowserClient();
  supabase.storage.listBuckets().then((result) =>{console.log("Bucket List", result)});
  }, []);
  */

  //2.
  const wantsMagicLink = magicLink === "yes";

  //3.
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getClaims();



  //4.
  if (data?.claims) {
    redirect(`/tickets`)
  }  

  //5.
  return (
    
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
        <LoginForm isPasswordLogin={!wantsMagicLink} tenant={tenant}></LoginForm>
      </div>
    </div>
  );

}
