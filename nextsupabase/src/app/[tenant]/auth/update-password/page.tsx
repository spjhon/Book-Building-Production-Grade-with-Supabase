
import { UpdatePasswordForm } from "../../../../features/auth/components/update-password-form";


/**
 * Update Password Page (Server Page Component)
 * --------------------------------------
 * Esta página sirve como interfaz para que el usuario establezca una nueva contraseña,
 * generalmente después de haber validado un token de recuperación (Recovery Link).
 * * * @param {Promise} params - Parámetros de la ruta que contienen el identificador del 'tenant'.
 * * * Flujo:
 * 1. Resuelve de forma asíncrona el parámetro del 'tenant' para mantener el contexto organizacional.
 * 2. Renderiza un contenedor centrado y responsivo optimizado para formularios de entrada.
 * 3. Inyecta el identificador del 'tenant' en el componente 'UpdatePasswordForm', permitiendo
 * que el formulario maneje la lógica de redirección y seguridad específica del cliente.
 * * * @return JSX.Element - Una página de actualización de credenciales estructurada.
 */
export default function UpdatePasswordFormPage() {

  


  return (
    //2.
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        {/* 3. */}
        <UpdatePasswordForm/>
      </div>
    </div>
  );
}
