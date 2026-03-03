import { fetchTenantDomainCached } from "@/lib/dbFunctions/fetch_tenant_domain_cached";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { buildUrl } from "@/utils/url-helpers";
import { NextRequest, NextResponse } from "next/server";



/*** Manual Registration Route Handler with Rollback (POST API)
 * ---------------------------------------
 * Este route handler gestiona la creación integral de un nuevo usuario en un entorno multi-tenant:
 * - Valida la existencia del tenant antes de proceder.
 * - Crea la identidad en Supabase Auth mediante privilegios de Admin.
 * - Sincroniza los datos en tablas públicas (service_users y tenant_permissions) mediante un bloque try/catch.
 * - Implementa un mecanismo de "Rollback": si falla cualquier operación de DB, se elimina el usuario de Auth 
 * para evitar registros huérfanos y asegurar la atomicidad del proceso.
 * @param request Objeto NextRequest con FormData (userName, email, password).
 * @params tenant Slug del tenant extraído de los parámetros de la URL.
 * @Flujo
 * 1. Extracción y validación rigurosa de tipos y contenido del formulario.
 * 2. Validación de seguridad: Comprobación de que el tenant existe en la DB (vía caché).
 * 3. Creación del usuario en el esquema 'auth' con metadatos específicos del tenant.
 * 4. Bloque Transaccional (try): Inserción de perfil en 'service_users' y vinculación de permisos.
 * 5. Bloque de Reversión (catch): Borrado preventivo del usuario en 'auth' ante cualquier fallo de DB.
 * 6. Disparo de Magic Link (OTP) para validación final de correo electrónico.
 * @Return JSON de éxito o redirecciones de error dinámicas con mensajes técnicos codificados.
 */
export async function POST(request: NextRequest, {params}: { params: Promise<{ tenant: string }>}) {

  //1.
  const { tenant } = await params;

  const formData = await request.formData();
  const userName = formData.get("userName");
  const email = formData.get("email");
  const password = formData.get("password");

  if (typeof email !== "string" || typeof password !== "string" || typeof userName !== "string"){
      // Ahora buildUrl no protestará porque request ya tiene las propiedades necesarias
      return NextResponse.redirect(buildUrl("/auth/login?error=invalid-form", tenant, request), { status: 303 });
  }

  const isNonEmptyString = (value: string) => typeof value === "string" && value.trim().length > 0;

  if (!isNonEmptyString(userName) || !isNonEmptyString(email) || !isNonEmptyString(password)) {
      return NextResponse.redirect(buildUrl("/error?type=No hay datos", tenant, request),303);
    }

//VALIDACION QUE EL TENANT QUE LLEGA POR MEDIO DE PARAMS SE ENCUENTRA EN LA BASE DE DATOS PARA PODER SER PROCESADO
  const tenantDomainValidatedInDb = await fetchTenantDomainCached(tenant);
  if (!tenantDomainValidatedInDb) {
    return NextResponse.redirect(buildUrl("/not-found", tenant, request), { status: 303 });
  } 


const emailLowered = email.toLowerCase()
const passwordLowered = password
const userNameTrimmed = userName.trim()


const supabaseAdmin = createSupabaseAdminClient();

const { data: userData, error: userError } = await supabaseAdmin.auth.admin.createUser({
  email: emailLowered, 
  password: passwordLowered,
  app_metadata: {tenants: [tenant]},
  user_metadata: { name:`${userNameTrimmed}`}
});

const safeEmailString = encodeURIComponent(emailLowered);

if (userError) {
  return NextResponse.redirect(buildUrl(`/error?type=${userError.code}&email=${safeEmailString}`, tenant, request),{ status: 303 })
}




try{


  const { data: serviceUser, error: InsertNewServiceUserError } = await supabaseAdmin
  .from("service_users")
  .insert({auth_user_id: userData.user.id, full_name: userNameTrimmed })
  .select()
  .single();

  if (InsertNewServiceUserError){
    throw new Error(InsertNewServiceUserError.message || "Algo salio mal checkenado el nuevo user");
  }


  //FETCH Buscamos el ID del tenant usando el slug (tenant) que viene en los params
  const { data: tenantID, error: fetchTenantError } = await supabaseAdmin
  .from("tenants")
  .select("id")
  .eq("domain", tenantDomainValidatedInDb)
  .single();

  if (fetchTenantError){
    throw new Error(fetchTenantError.message || "Algo salio mal al checkear el tenant");
  }



  if ( !tenantID || !serviceUser ){
    throw new Error("Algo salio mal con el tenant o con el usuario en la base de datos");
  }


  //INSERT insertamos en la tabla tenant_permissions para crear el link
  const {error: InsertNewTenantError} = await supabaseAdmin
  .from("tenant_permissions")
  .insert({ tenant_id: tenantID.id, service_user_id: serviceUser.id});

  if (InsertNewTenantError){
    throw new Error(InsertNewTenantError.message || "Algo salio mal al insertar un tenant");
  }



}catch(err: unknown){
  await supabaseAdmin.auth.admin.deleteUser(userData.user.id);
  const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred creating user";
  return NextResponse.redirect(buildUrl(`/auth/error?type=${encodeURIComponent(errorMessage)}&email=${safeEmailString}`, tenant, request),{ status: 303 })
}finally{

}


const { error } = await supabaseAdmin.auth.signInWithOtp({email, options: { shouldCreateUser: false, emailRedirectTo: `http://${tenant}.miapp:3000/auth/confirm?tenant=${tenant}`}});


if (error) {
 return NextResponse.redirect(buildUrl(`/auth/error?type=${error.code}`, tenant, request), 303);
};
      


  return NextResponse.json({
    message: "Usuario Registrado Correctamente API funcionando",
  });
 
  
} 