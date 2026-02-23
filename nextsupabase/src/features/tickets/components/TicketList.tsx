import Link from "next/link";
import { DummyTicket } from "@/app/[tenant]/tickets/page";

interface TicketListProps {
  tickets: DummyTicket[];
  tenant: string
}

const statusStyles: Record<string, string> = {
  "Not started": "bg-gray-200 text-gray-700",
  "In progress": "bg-blue-100 text-blue-700",
  "Done": "bg-green-100 text-green-700",
};



/**
 * TicketList (Presentational Component)
 * ------------------------------------
 * Componente encargado de renderizar una tabla detallada con la colección de tickets.
 * Organiza la información técnica de manera tabular para facilitar la lectura del usuario.
 *
 * * * @param {DummyTicket[]} tickets - Arreglo de objetos que contienen los datos de cada ticket.
 * * * @param {string} tenant - Identificador del tenant para construir las rutas de navegación.
 * * * * Datos:
 * - 'statusStyles': Diccionario de mapeo para aplicar clases de Tailwind según el estado (Not started, In progress, Done).
 * - Utiliza interfaces tipadas para garantizar la integridad de los datos de entrada.
 * * * * Flujo:
 * 1. Define una estructura de tabla responsiva con cabeceras fijas (ID, Title, Status).
 * 2. Mapea la colección de tickets para generar filas dinámicas con efectos de hover.
 * 3. Construye enlaces dinámicos para cada título, dirigiendo a la vista de detalles específica del ticket.
 * 4. Implementa etiquetas visuales (badges) mediante clases condicionales basadas en el estado del ticket.
 * 5. Muestra metadatos secundarios como el autor debajo del título principal.
 * * * * @return JSX.Element - Una tabla organizada con navegación integrada y estilos de estado.
 */

export function TicketList({ tickets, tenant }: TicketListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="text-sm text-gray-600 border-b border-gray-200">
            <th className="py-3 px-2 font-medium">ID</th>
            <th className="py-3 px-2 font-medium">Title</th>
            <th className="py-3 px-2 font-medium">Status</th>
          </tr>
        </thead>

        <tbody className="text-gray-800">
          {tickets.map((ticket) => (
            <tr
              key={ticket.id}
              className="border-b border-gray-100 hover:bg-gray-50 transition"
            >
              {/* ID */}
              <td className="py-3 px-2 text-gray-500 font-medium">
                #{ticket.id}
              </td>

              {/* Title */}
              <td className="py-3 px-2">
                <Link
                  href={`/${tenant}/tickets/details/${ticket.id}`}
                  className="text-blue-600 hover:underline font-semibold"
                >
                  {ticket.title}
                </Link>
                <div className="text-xs text-gray-500 mt-1">
                  by {ticket.author}
                </div>
              </td>

              {/* Status */}
              <td className="py-3 px-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    statusStyles[ticket.status] || "bg-gray-200 text-gray-700"
                  }`}
                >
                  {ticket.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
