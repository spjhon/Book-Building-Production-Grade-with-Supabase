import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  // With Fluid compute, don't put this client in a global environment
  // variable. Always create a new one on each request.

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );

          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getClaims(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: Don't remove getClaims()
  const { data } = await supabase.auth.getClaims();

  const user = data?.claims;
  


const pathname = request.nextUrl.pathname;



  // --------
  // EXTRAER TENANT
  // --------
  const [tenant, ...rest] = pathname.slice(1).split("/");
  const applicationPath = "/" + rest.join("/");

  const isTenantRoute = rest.length > 0;
  

  if (isTenantRoute && !/^[a-z0-9-_]+$/.test(tenant)) {
    return NextResponse.rewrite(new URL("/not-found", request.url));
  }

// --------
// RUTAS PÚBLICAS (dentro del tenant), si la ruta de la aplicacion (la que no tiene tenant) empieza por auth, dejelo pasar.
// --------
if (
  applicationPath.startsWith("/auth")
) {
  return supabaseResponse;
}

 // --------
  // PROTECCIÓN DE RUTAS PRIVADAS, si no hay usuario y a parte la ruta de la aplicacion empieza por tickets, yuka, es ruta privada y hay que hacer redireccion
  // --------
  if (applicationPath.startsWith("/tickets") && !user) {
    console.log("se activo este codigo")
    const url = request.nextUrl.clone();
    url.pathname = `/${tenant}/auth/login`;
    return NextResponse.redirect(url);
  }


if (pathname==="/"){
  const url = request.nextUrl.clone();
    url.pathname = `/tenant-default`;
    return NextResponse.redirect(url);
}


  
/**
 * “Si NO hay usuario
y NO estoy en /login
y NO estoy en /auth
→ redirige a /login”

  if (
    request.nextUrl.pathname !== "/" &&
    !user &&
    !request.nextUrl.pathname.startsWith("/login") &&
    !request.nextUrl.pathname.startsWith("/auth") 
  ) {
    // no user, potentially respond by redirecting the user to the login page
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }

  */




  


  // IMPORTANT: You *must* return the supabaseResponse object as it is. If you're
  // creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse;
}

/**Este es codigo viejo del libro 
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

 
interface GetSupabaseReqResClientArgs {
  request: NextRequest;
}


export const getSupabaseReqResClient = ({ request }: GetSupabaseReqResClientArgs) => {
  const response = {
    value: NextResponse.next({ request: request }),
  };

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },

        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
          });

          response.value = NextResponse.next({
            request,
          });

          cookiesToSet.forEach(({ name, value, options }) => {
            response.value.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  return { supabase, response };
};
*/
