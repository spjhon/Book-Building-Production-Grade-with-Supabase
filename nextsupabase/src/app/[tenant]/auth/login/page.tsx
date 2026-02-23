
import { LoginForm } from "@/features/auth/components/LoginForm";
import { createSupabaseServerClient } from "@/lib/supabase/server";
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
export default async function Login({searchParams, params}: {searchParams: Promise<{[key: string]: string | string[] | undefined}>, params: Promise<{ tenant: string }>}) {

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
    redirect(`/${tenant}/tickets`)
  }  

  //5.
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black">
        
        <LoginForm isPasswordLogin={!wantsMagicLink} tenant={tenant}></LoginForm>
      </main>
    </div>
  );

}
