"use client";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

/**
 * Logout Button Component (Client Component)
 * ----------------------------------------
 * Proporciona una interfaz funcional para finalizar la sesión del usuario actual,
 * asegurando la limpieza de la sesión en Supabase y la redirección al login del tenant.
 *
 * * * @param {string} tenant - Identificador de la organización para determinar la ruta de retorno.
 * * * Datos:
 * - Utiliza el hook 'useRouter' para la navegación programática en el cliente.
 * - Invoca el método 'signOut' del cliente de Supabase para invalidar la sesión activa.
 * * * Flujo:
 * 1. Inicializa el router de Next.js y registra el tenant actual en la consola para depuración.
 * 2. Intercepta el evento de envío del formulario (onSubmit) y previene la recarga por defecto.
 * 3. Instancia el cliente de Supabase y ejecuta la desconexión de forma asíncrona.
 * 4. Tras el cierre de sesión exitoso, redirige al usuario a la página de autenticación específica del tenant.
 * 5. Define una acción de respaldo (action) apuntando a una API de servidor para compatibilidad.
 * 6. Renderiza un formulario con un botón de estilo secundario que dispara el proceso de salida.
 * * * @return JSX.Element - Un formulario compacto con lógica de cierre de sesión integrada.
 */

export function LogoutButton() {
  const router = useRouter();
  const handleLogout = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();

    router.push(`/tickets`);
  };

  return (
    <form
      method="POST"
      action={`/auth/logout/api`}
      onSubmit={handleLogout}
    >
      <button type="submit" className="secondary">
        Logout
      </button>
    </form>
  );
}
