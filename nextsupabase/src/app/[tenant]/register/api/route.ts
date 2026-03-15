import { fetchTenantDomainCached } from "@/lib/dbFunctions/fetch_tenant_domain_cached";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { TenantId } from "@/types/authTypes";
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
export async function POST(request: NextRequest, {params}: { params: Promise<{ tenant: TenantId }>}) {

  //1.
  const { tenant } = await params;

  const formData = await request.formData();
  const userName = formData.get("userName");
  const email = formData.get("email");
  const password = formData.get("password");


  
  if (typeof email !== "string" || typeof password !== "string" || typeof userName !== "string"){
      // Ahora buildUrl no protestará porque request ya tiene las propiedades necesarias
      return NextResponse.json(
        { message: "Los datos del formulario son inválidos." }, 
        { status: 400 } 
      );
  }


  if (password.length<3){
    return NextResponse.json(
        { message: "La contraseña no tiene el largor que es" }, 
        { status: 400 } 
      );
  }

  const isNonEmptyString = (value: string) => typeof value === "string" && value.trim().length > 0;

  if (!isNonEmptyString(userName) || !isNonEmptyString(email) || !isNonEmptyString(password)) {
      return NextResponse.json(
        { message: "No hay datos" }, 
        { status: 400 } 
      );
    }

//VALIDACION QUE EL TENANT QUE LLEGA POR MEDIO DE PARAMS SE ENCUENTRA EN LA BASE DE DATOS PARA PODER SER PROCESADO
//2.
  const tenantDomainValidatedInDb = await fetchTenantDomainCached(tenant);
  if (!tenantDomainValidatedInDb) {
    return NextResponse.redirect(buildUrl("/not-found", tenant, request), { status: 303 });
  } 

//3.
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


if (userError) {
  return NextResponse.json(
        { message: "Error creando el registro: " + userError.message }, 
        { status: 400 } 
      );
}



//4.
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
    throw {
        contexto: "Error al insertar en la tabla de comentarios", // Tu mensaje personalizado
        supabaseError: fetchTenantError // El objeto completo de Supabase
      };
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
  //5.
  await supabaseAdmin.auth.admin.deleteUser(userData.user.id);
  const errorMessage = err instanceof Error ? err.message : "Ah ocurrido un error inesperado al crear un usuario";
  return NextResponse.json(
        { message: errorMessage }, 
        { status: 400 } 
      );
}finally{

}

//6.
const { error } = await supabaseAdmin.auth.signInWithOtp({email, options: { shouldCreateUser: false, emailRedirectTo: `http://${tenant}.miapp:3000/auth/confirm?tenant=${tenant}`}});


if (error) {
 return NextResponse.redirect(buildUrl(`/auth/error?type=${error.code}`, tenant, request), 303);
};
      


  return NextResponse.json({
    message: "Usuario Registrado Correctamente API funcionando",
  });
 
  
} 