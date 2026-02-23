


import Link from "next/link";
;

//import { createSupabaseBrowserClient } from "@/lib/supabase/client";
//import { useEffect } from "react";
//import { useSearchParams } from "next/navigation";


/**
 * Tenant Home / Landing Page (Server Page Component)
 * -------------------------------------------
 * Esta página es el punto de entrada público para cada tenant. Sirve como 
 * una interfaz informativa inicial antes de que el usuario acceda al sistema.
 * * * * @param {Promise} params - Parámetros de la ruta que contienen el identificador del 'tenant'.
 * * * * Datos:
 * - Renderiza el nombre del 'tenant' dinámicamente para personalizar la bienvenida.
 * - Estilos: Utiliza un diseño centrado con soporte para modo oscuro (zinc/black).
 * * * * Flujo:
 * 1. Resuelve el 'tenant' de forma asíncrona desde los parámetros de la ruta.
 * 2. Define el contenedor principal con clases de Tailwind para centrado y tipografía.
 * 3. Muestra el mensaje de aterrizaje contextualizado con el nombre de la organización.
 * 4. Proporciona un enlace de navegación manual hacia la sección de tickets/login.
 * * * * @return JSX.Element - Una página de aterrizaje limpia y específica por tenant.
 */

export default async function Home({params}: {params: Promise<{ tenant: string }>}) {

  //1.
const {tenant} = await params

  /**
useEffect(() => {
const supabase = createSupabaseBrowserClient();
supabase.storage.listBuckets().then((result) =>{console.log("Bucket List", result)});
}, []);
 */

  return (
    //2.
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black">
        {/*3.*/}
        Este es el landing page de {tenant} ve a login para entrar 
        {/*4.*/}
        <Link href={`${tenant}/tickets`}>Login</Link>
      </main>
    </div>
  );
}
