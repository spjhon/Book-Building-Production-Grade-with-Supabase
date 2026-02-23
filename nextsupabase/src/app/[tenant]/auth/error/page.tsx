import { urlPath } from "@/utils/url-helpers";
import Link from "next/link";


/**
 * Error Page Component (Server Page Component)
 * ---------------------------------------
 * Este componente se encarga de renderizar mensajes de error amigables para el usuario
 * basados en el parámetro 'type' recibido en la URL tras fallos en procesos de autenticación.
 * * @param {Promise} searchParams - Parámetros de búsqueda de la URL (contiene el 'type' del error).
 * * @param {Promise} params - Parámetros dinámicos de la ruta (contiene el identificador del 'tenant').
 * * * Flujo:
 * 1. Desestructura de forma asíncrona 'searchParams' y 'params' (requerido en Next.js 15+).
 * 2. Define una lista de errores conocidos para validar el tipo de mensaje a mostrar.
 * En return:
 * 3. Evalúa el 'type' para renderizar condicionalmente el mensaje de error específico.
 * 4. Proporciona una opción de retorno (fallback) para errores desconocidos o genéricos.
 * 5. Genera un enlace dinámico para regresar a la página de inicio del tenant afectado.
 * * * @return JSX.Element - Una vista de error centrada con instrucciones para el usuario.
 */
export default async function ErrorPage({searchParams, params}: {searchParams: Promise<{ type: string }>, params: Promise<{ tenant: string }>}) {
  
  //1.
  const { type } = await searchParams;
  const {tenant} = await params

  //2.
  const knownErrors = [
    "login-failed",
    "invalid_magiclink",
    "magiclink",
    "recovery",
  ];

  return (
    <div style={{ textAlign: "center" }}>
      <h1>Ooops!</h1>

      {/*3.*/}
      {type === "login-failed" && (
        <strong>Login was not successfull, sorry.</strong>
      )}
      {type === "invalid_magiclink" && (
        <strong>
          The magic link was invalid. Maybe it expired? Please request a new
          one.
        </strong>
      )}
      {type === "magiclink" && (
        <strong>
          Could not send a magic link. Maybe you had a typo in your E-Mail?
        </strong>
      )}

      {type === "recovery" && (
        <strong>
          Could not request new password. Maybe you had a typo in your E-Mail?
        </strong>
      )}

      {/*4.*/}
      {!knownErrors.includes(type) && (
        <strong>
          Something went wrong. Please try again or contact support.
        </strong>
      )}

      <br />
      <br />

      {/*5.*/}
      <Link role="button" href={urlPath('/', tenant)}>
        Go back.
      </Link>


    </div>
  );
}
