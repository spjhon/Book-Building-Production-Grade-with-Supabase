import { fetchTenantDomainCached } from "@/lib/dbFunctions/fetch_tenant_domain_cached";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { buildUrl } from "@/utils/url-helpers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest, {params}: { params: Promise<{ tenant: string }>}) {


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
      return NextResponse.redirect(buildUrl("/error", tenant, request),302);
    }

//VALIDACION QUE EL TENANT QUE LLEGA POR MEDIO DE PARAMS SE ENCUENTRA EN LA BASE DE DATOS PARA PODER SER PROCESADO
  const tenantDomainValidatedInDb = await fetchTenantDomainCached(tenant);
  if (!tenantDomainValidatedInDb) {
    return NextResponse.redirect(buildUrl("/not-found", tenant, request), { status: 303 });
  } 


  /** 
  const supabaseAdmin = createSupabaseAdminClient();
// Buscamos el ID del tenant usando el slug (tenant) que viene en los params
const { data: tenantID, error: tenantError } = await supabaseAdmin
  .from("tenants")
  .select("id")
  .eq("domain", tenantDomainValidatedInDb)
  .single();


console.log(tenantID?.id)

return NextResponse.json({
    message: "API funcionando",
    email,
    password,
    userName
  });
*/

const emailLowered = email.toLowerCase()
const passwordLowered = password
const userNameTrimmed = userName.trim()

console.log(emailLowered)
console.log(passwordLowered)
console.log(userName)


const supabaseAdmin = createSupabaseAdminClient();

const { data: userData, error: userError } = await supabaseAdmin.auth.admin.createUser({
  email: emailLowered, 
  password: passwordLowered,
  app_metadata: {tenants: [tenant]},
  user_metadata: { name:`${userNameTrimmed}`}
});

const safeEmailString = encodeURIComponent(emailLowered);

if (userError) {

  const userExists = userError.message.includes("register_mail_mismatch");

  if (userExists) {
    console.log(userError.code)
    return NextResponse.redirect(buildUrl(`/error?type=register_mail_exists&email=${safeEmailString}`,tenant,request,),302,);
  } else {
    console.log(userError.code)
    return NextResponse.redirect(buildUrl("/error?type=register_unknown", tenant, request),302,);
  }

}

//INSERT en la tabla service_users
const { data: serviceUser } = await supabaseAdmin
  .from("service_users")
  .insert({auth_user_id: userData.user.id, full_name: userNameTrimmed })
  .select()
  .single();


//FETCH Buscamos el ID del tenant usando el slug (tenant) que viene en los params
const { data: tenantID, error: tenantError } = await supabaseAdmin
  .from("tenants")
  .select("id")
  .eq("domain", tenantDomainValidatedInDb)
  .single();


if ( !tenantID || !serviceUser || tenantError){return NextResponse.redirect(buildUrl("/not-found", tenant, request), { status: 303 });}

  //insertamos en la tabla tenant_permissions para crear el link
const {error: tpError} =
await supabaseAdmin.from("tenant_permissions").insert({ tenant_id: tenantID.id, service_user_id: serviceUser.id});

//aqui hay un truco, si se presenta algun error aca para arriba, se ejecuta el borrado del usuario de la tabla users del schema auth de supabase
//y como la tabla service users que es public tiene un cascade entonces si se borra el usuario asi se haya creado, entonces se borra todo lo que se ha
//hecho
if (tpError) {
  await supabaseAdmin.auth.admin.deleteUser(userData.user.id);
  return NextResponse.redirect(buildUrl("/error", tenant, request), 302);
}


        
      
// Nota el .admin y el redirectTo con r minúscula
const { data, error } = await supabaseAdmin.auth.admin.inviteUserByEmail(
  emailLowered, 
  { 
    redirectTo: `http://${tenant}.miapp:3000/auth/confirm?tenant=${tenant}` 
  }
);

if (error) {
  NextResponse.redirect(buildUrl("/error", tenant, request), 302);
};
      


  return NextResponse.json({
    message: "API funcionando",
    email,
    password,
    userName
  });
 
  
} 