import { ForgotPasswordForm } from "../../../../features/auth/components/forgot-password-form";

/**
 * Forgot Password Page (Server Page Component)
 * ---------------------------------------
 * Esta página actúa como el contenedor principal para el flujo de recuperación de contraseña.
 * Renderiza un formulario especializado para que los usuarios soliciten un enlace de restablecimiento, viene casi siempre
 * desde el componente LoginForm.tsx
 * * * @param {Promise} params - Parámetros dinámicos de la ruta que contienen el identificador del 'tenant'.
 * * * Flujo:
 * 1. Resuelve de forma asíncrona los parámetros de la ruta para identificar el contexto del tenant.
 * En el return:
 * 2. Renderiza una interfaz centrada y responsiva (utilizando clases de Tailwind CSS).
 * 3. Inyecta el identificador del 'tenant' en el formulario de recuperación para asegurar que el 
 * proceso de autenticación se mantenga dentro del entorno organizacional correcto.
 * * * @return JSX.Element - Una página estructurada con el formulario de ForgotPassword.
 */

interface TicketsPageProps {
  params: Promise<{ tenant: string }>;
}

export default async function ForgotPasswordPage({params}: TicketsPageProps) {

//1.
const { tenant } = await params;


  return (
    //2.
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        {/*3.*/}
        <ForgotPasswordForm tenant ={tenant}/>
      </div>
    </div>
  );
}
