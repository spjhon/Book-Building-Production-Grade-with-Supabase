// app/auth/page.tsx
import { redirect } from "next/navigation";

/**
 * Auth Index Page (Server Page Component)
 * ----------------------------------
 * Esta página actúa como un "index redirector" dentro del grupo de rutas de autenticación.
 * Su único propósito es asegurar que cualquier acceso a la raíz del path de auth sea 
 * redirigido automáticamente hacia el formulario de inicio de sesión.
 * * * @param {Promise} params - Parámetros de la ruta que contienen el identificador del 'tenant'.
 * * * Flujo:
 * 1. Resuelve el parámetro 'tenant' de forma asíncrona para conocer el contexto de la organización.
 * 2. Ejecuta una redirección del lado del servidor (HTTP 307 por defecto en Next.js) hacia 
 * la sub-ruta de login específica de ese tenant.
 * * * @return {never} - Esta función no renderiza contenido, ya que la redirección interrumpe la ejecución.
 */
interface TicketsPageProps {
  params: Promise<{ tenant: string }>;
}

export default async function AuthIndexPage({params}: TicketsPageProps) {

//1.
const { tenant } = await params;
  //2.
  redirect(`/${tenant}/auth/login`);
}