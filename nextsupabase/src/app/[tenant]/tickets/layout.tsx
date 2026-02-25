
import { Navbar } from "@/features/tickets/components/Navbar";
import TenantName from "@/features/tickets/components/TenantName";
import { ReactNode } from "react";

interface TicketsLayoutProps {
  children: ReactNode;
  params: Promise<{ tenant: string }>;
}

/**
 * Tickets Layout (Server Layoout Component)
 * --------------------------------
 * Este componente define la estructura base y el entorno para todas las páginas 
 * dentro de la ruta de tickets. Administra componentes globales y la sincronización de sesión.
 * * * @param {ReactNode} children - Las páginas o sub-layouts que se renderizarán dentro de esta estructura.
 * * @param {Promise} params - Parámetros de la ruta que contienen el identificador del 'tenant'.
 * * * Flujo:
 * 1. Resuelve el 'tenant' de forma asíncrona para propagarlo a los componentes dependientes.
 * 3. Renderiza la 'Navbar' global, permitiendo la navegación contextual dentro del tenant.
 * 4. Actúa como wrapper para las vistas de contenido (`children`), manteniendo elementos comunes 
 * como el nombre del tenant visibles en todo momento.
 * * * @return JSX.Element - Una estructura jerárquica que envuelve el ecosistema de tickets.
 */
export default async function TicketsLayout({ children, params }: TicketsLayoutProps) {
  
  // 1.
  const { tenant } = await params;

  return (
    <>

      {/* 3. Navegación global */}
      <section>
        <Navbar />
      </section>

      {/* 4. Contenedor de contenido dinámico */}
      <section>
        Layout de tickets para tenant: <TenantName tenant={tenant} />
        {children}
      </section>
    </>
  );
}