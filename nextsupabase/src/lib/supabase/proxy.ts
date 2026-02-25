import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from 'next/server';
import { Database } from "../../../supabase/types/database.types";
import { buildUrl, getHostnameAndPort } from "@/utils/url-helpers";
import { createSupabaseAdminClient } from "./admin";

export async function updateSession(request: NextRequest) { //funcion proxy especial de supabase, no es el proxy de next js
  let supabaseResponse = NextResponse.next({ request });

  // 1. CLIENTE SUPABASE
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          // Actualizamos la respuesta base con las nuevas cookies
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  
  const { data } = await supabase.auth.getClaims(); //se obtiene el claims osea el usuario
  const sessionUser = data?.claims; //se obtiene el usuario si es que existe y esta autenticado
  
  // 1. EXTRAER INFORMACIÓN BÁSICA
  const [hostname, port] = getHostnameAndPort(request); //Se obtiene el hostname desde una funcion en utils, "acme.miapp" o "globex.miapp"
  const applicationPath = request.nextUrl.pathname; // puede ser "/" o "/auth" o "/auth/login"
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN?.split(":")[0]; // "miapp" o "127.0.0.1" o "localhost"
  

 //RUTAS PUBLICAS PERMITIDAS

//si alguno de estos host o alguno de estos path se cumple, entonces retornar supabaseResponse sin hacer mas preguntas
  if (
    hostname === rootDomain ||
    hostname === "127.0.0.1" ||
    hostname === "miapp" ||
    applicationPath.startsWith("/_next") || 
    applicationPath.startsWith("/api") ||
    applicationPath.includes(".") 
  ) {
    return supabaseResponse;
  }

 //OBTENCION Y VERIFICACION DEL TENANT
  //creacion del admin de supabase para saltarse el rls de la base de datos y extraer todos los tenants registrados
  const supabaseAdmin = createSupabaseAdminClient();

  const { data: tenantData, error: tenantError } = await supabaseAdmin //se consutla el tenant que sea igual al tenant extraido del host con el split
  .from("tenants")
  .select("*")
  .eq("domain", hostname.split(".")[0])
  .single();

  if (tenantError || !tenantData) { //si se detecta un error en la base de datos entonces ir a la ruta not-found
    return NextResponse.rewrite(new URL("/not-found", request.url));
  }

  //Aqui asignamos el domain que viene de la base de datos "acme" o "globex" y se asigna al slug que se va a utilizar en las rutas
  const tenantslug = tenantData.domain; 

  //return NextResponse.json({ tenantMatch: true });


 //PROTECCION DE RUTAS

  if (applicationPath.startsWith("/tickets")) {
    
    if (!sessionUser) {
      // 1. Mandamos explícitamente a la ruta de LOGIN, no a la raíz
      const loginUrl = buildUrl('/auth/login', tenantslug, request);
      return NextResponse.redirect(loginUrl);
    }

    // Si hay usuario, pero el tenant no está en su lista de acceso (app_metadata)
    // Nota: Esto asume que en Supabase guardas un array de 'tenants' en el metadata del usuario
    else if (!sessionUser.app_metadata?.tenants?.includes(tenantslug)) {
      // Si no tiene acceso a este cliente, lo mandamos a Not Found o a una página de "Acceso Denegado"
      return NextResponse.rewrite(new URL("/not-found", request.url));
    }
  } 

 
  //REESCRITURA FINAL DE LA RUTA QUE VA PARA EL INTERIOR DE LA APP Y LA QUE VA DEVUELTA AL NAVEGADOR
  // Obtenemos los query params originales (ej: ?magicLink=yes)
  const searchParams = request.nextUrl.search;

  // Inyectamos el slug en los headers por si lo necesitamos luego
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-tenant", tenantslug);

  // Aquí es donde sucede la magia:
  // El navegador sigue viendo /auth/login
  // Pero Next.js lee de /app/[tenant]/auth/login
  const rewrittenResponse = NextResponse.rewrite(
    //Cuando haces el rewrite, Next.js ignora el dominio para la búsqueda del archivo. Solo le importa el Path que es lo que manda al interior
    //al exterior manda la base que seria en este caso el request.url
    new URL(`/${tenantslug}${applicationPath}${searchParams}`, request.url),
    {
      request: {
        headers: requestHeaders, // Pasamos los nuevos headers
      },
    }
  );

  // Sincronización de cookies (Para que el login de Supabase funcione) el rewrite es una "operación silenciosa" 
  // que ocurre solo dentro del servidor, y eso crea un riesgo de desincronización.
  supabaseResponse.cookies.getAll().forEach((cookie) => {
    const { name, value, ...options } = cookie;
    rewrittenResponse.cookies.set(name, value, options);
  });

  return rewrittenResponse;
  
}