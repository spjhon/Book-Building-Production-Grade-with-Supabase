import { createSupabaseServerClient } from "@/lib/supabase/server";
import { buildUrl, getHostnameAndPort } from "@/utils/url-helpers";
import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from 'next/server';

/*** Email confirms route handlers (Route Handler POST API)
 * ---------------------------------------
 * Este route handler se encarga de recibir los llamados desde:
 * - El magic link que llega al correo del usuario
 * - El link de confirmacion del nuevo usuario creado en /register
 * Con el fin de confirmar el token, el tenant y el type para otorgar acceso a quien lo pida
 * @param request El request pero mejorado gracias a next js. Request de los links magicos y de login.
 * @Flujo
 * 1. Extraccion de datos del reques y los seach params
 * 2. Extraemos el hostname para identificar el tenatn, el domain que esta en la url
 * 3. Asignamos el hostname a la variable tenant para mayor entendimiento
 * 4. Si el token y el type estan bien entonces se pasa a verificar el token y dar autorizacion de login al usuario
 * 5. Redirección absoluta para asegurar que el usuario permanezca en el subdominio correcto tras validar el correo.
 * @Return Diferentes redirects dadas diferentes concidiones de llegada correcta de datos y erroes presentados
*/ 
export async function GET(request: NextRequest) {

  //1.
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null ;
  

  //2.
  const [hostname] = getHostnameAndPort(request);
  
  /* Nota: El libro sugiere que el 'tenant' se pase como argumento. 
     Como estamos en un subdominio, el 'tenant' es el hostname mismo 
     o el slug que sacamos del mapa.
  */
 //3.
  const tenant = hostname;

  //4.
  if (token_hash && type) {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.verifyOtp({ type, token_hash });

    if (!error) {
      //5.
      return NextResponse.redirect(buildUrl("/tickets", tenant, request), { status: 303 });
    } else {
      return NextResponse.redirect(buildUrl(`/error?type=${error.message ? "Error al verificar token: " + error.message : "Error al verificar token"}`, tenant, request), { status: 303 });
    }
  }

  return NextResponse.redirect(buildUrl("/error?type=No existe el tocken o el tipo de verificacion es incorrecto", tenant, request), { status: 303 });
}





/**El por que de redirect en GET y por que el NextResponse en POST
 * entonces si es get se utiliza redirect y si se utiliza post se utiliza 
 * el return NextResponse por que el que llama tiene la oportunidad de recibir un error y asi hacer 
 * lo que tenga que hacer en lugar de ir a otro lado y que tambien no se recarge la pagina al ser redirigido a otro lado?
 * 
 * 1. En el GET (Navegación directa)
Cuando el usuario hace clic en un link de correo, el navegador cambia de página.
Usamos redirect() porque el flujo es: Link -> Route Handler -> Destino Final.
No hay datos pesados enviándose, así que el comportamiento por defecto de Next.js es suficiente.
 * 2. En el POST (Envío de datos)
Aquí es donde entra lo que mencionas sobre el error y la recarga. Usamos return NextResponse.redirect(..., 303) por tres razones clave:
El "Ataque" del botón Refresh: Si usas un redirect normal (302) tras un POST, y el usuario da a "Actualizar" en el navegador, le saldrá el molesto mensaje: "¿Desea volver a enviar el formulario?". El código 303 obliga al navegador a olvidar el POST y convertirse en un GET, limpiando el historial.
Control de Errores: Como bien dices, al ser un objeto que retornas, te permite hacer lógica antes. Por ejemplo: "Si el login falla, no redirijas, mejor responde con un JSON de error". redirect() es tan "agresivo" que corta la ejecución y no te deja decidir.
La oportunidad del cliente (Fetch): En tu componente LoginForm, el fetch está esperando una respuesta. Si devuelves un objeto NextResponse, el JS del cliente puede leer el response.redirected, capturar la URL y decidir si hace el window.location.href o si muestra un mensaje de error suave en el formulario sin cambiar de página.
 */