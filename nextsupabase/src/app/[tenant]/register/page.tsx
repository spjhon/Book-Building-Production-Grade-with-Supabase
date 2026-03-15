import { SignUpForm } from "@/features/register/components/SignUpForm";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { TenantId } from "@/types/authTypes";
import { notFound } from "next/navigation";






/*** Tenant Registration Page (Server Component)
 * ---------------------------------------
 * Esta página sirve como el punto de entrada para el registro de nuevos usuarios en un tenant específico:
 * - Valida en el servidor si el tenant (subdominio) existe en la base de datos antes de renderizar.
 * - Actúa como una "Guarda de Ruta": si el tenant no es válido, dispara un 404 instantáneo.
 * - Provee el contexto del tenant al cliente mediante el componente SignUpForm.
 * @param params Promesa que contiene el slug del tenant proveniente de la URL dinámica.
 * @Flujo
 * 1. Resolución de parámetros asíncronos para identificar el tenant actual.
 * 2. Verificación de existencia: Consulta a la tabla 'tenants' usando privilegios de Admin.
 * 3. Control de flujo: Interrupción de la ejecución mediante notFound() si el tenant no existe.
 * 4. Renderizado seguro: Inyección del tenant validado en el formulario de registro.
 * @Return El layout de registro con el SignUpForm o una página 404 de Next.js.
 */
export default async function Page({params}: {params: Promise<{ tenant: TenantId }>;}) {
  
  //1.
  const { tenant } = await params;

  //2.
  const supabaseAdmin = createSupabaseAdminClient();
  const { data, error } = await supabaseAdmin
  .from("tenants")
  .select("id")
  .eq("domain", tenant)
  .single();


  //3.
  if (error) notFound();


  //4.
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        {/* 2. Pasamos el tenant al formulario de registro */}
        <SignUpForm tenant={tenant} />
      </div>
    </div>
  );



}