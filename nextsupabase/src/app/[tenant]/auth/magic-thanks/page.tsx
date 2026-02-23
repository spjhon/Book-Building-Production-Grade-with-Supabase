import { urlPath } from "@/utils/url-helpers";
import Link from "next/link";


/**
 * Magic Link Success Page (Server Page Component)
 * -----------------------------------------
 * Esta página informa al usuario que el correo electrónico de autenticación o 
 * recuperación de contraseña ha sido enviado exitosamente.
 * * * @param {Promise} searchParams - Parámetros de búsqueda que definen el contexto ('type').
 * * @param {Promise} params - Parámetros de la ruta que contienen el identificador del 'tenant'.
 * * * Flujo:
 * 1. Resuelve asíncronamente los parámetros de búsqueda y de ruta (Next.js 15).
 * 2. Determina si el flujo actual es de recuperación de contraseña ('recovery') o inicio de sesión.
 * 3. Renderiza dinámicamente el título y el mensaje de instrucciones según el valor de 'type'.
 * 4. Proporciona un enlace de retorno seguro hacia la raíz del tenant utilizando 'urlPath'.
 * * * @return JSX.Element - Una interfaz informativa con mensajes dinámicos y navegación de retorno.
 */

export default async function MagicLinkSuccessPage({searchParams, params}: {searchParams: Promise<{ type: string }>, params: Promise<{ tenant: string }>}) {
  
  //1.
  const { type } = await searchParams
  const {tenant} = await params
  //2.
  const isRecovery = type === "recovery";

  return (
    //3.
    <div style={{ textAlign: "center" }}>
      <h1>
        {isRecovery && "Password "}
        Magic on its way!
      </h1>
      {type === "recovery" ? (
        <p>Check your email for a link to reset your password.</p>
      ) : (
        <p>Check your email for a link to log in.</p>
      )}
      <br />
      <br />

      {/*4.*/}
      <Link role="button" href={urlPath('/', tenant)}>
        Go back.
      </Link>
    </div>
  );
}
