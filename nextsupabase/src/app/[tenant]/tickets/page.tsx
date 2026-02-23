import { TicketList } from "@/features/tickets/components/TicketList";

export interface DummyTicket {
  id: number;
  title: string;
  status: string;
  author: string;
}

interface TicketsPageProps {
  params: Promise<{ tenant: string }>;
}

/**
 * Tickets Main Page (Server Component)
 * -----------------------------------
 * Esta página es la vista principal del dashboard donde se listan todos los tickets 
 * asociados al tenant actual. Sirve como punto de entrada para la gestión de tareas.
 * * * @param {Promise} params - Parámetros de la ruta que contienen el identificador del 'tenant'.
 * * * Datos:
 * - Define la interfaz 'DummyTicket' para asegurar la consistencia de tipos en la lista.
 * - 'dummyTickets': Conjunto de datos estáticos para prototipado y visualización inicial.
 * * * Flujo:
 * 1. Resuelve el 'tenant' de forma asíncrona para contextualizar la navegación.
 * 2. Renderiza una cabecera con un botón de acción para la creación de nuevos recursos.
 * 3. Inyecta los datos de los tickets y el ID del tenant en el componente especializado 'TicketList'.
 * 4. Utiliza clases de Tailwind CSS para crear una estructura de lista limpia y profesional.
 * * * @return JSX.Element - Una página organizada con el listado completo de tickets.
 */
export const dummyTickets: DummyTicket[] = [
  {
    id: 1,
    title: "Write Supabase Book",
    status: "Not started",
    author: "Chayan",
  },
  {
    id: 2,
    title: "Read more Packt Books",
    status: "In progress",
    author: "David",
  },
  {
    id: 3,
    title: "Make videos for the YouTube Channel",
    status: "Done",
    author: "David",
  },
];

export default async function TicketsPage({ params }: TicketsPageProps) {

  // 1.
  const { tenant } = await params;

  return (
    // 2.
    <div className="max-w-5xl mx-auto py-10 space-y-8">
      
      {/* Header & Actions */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          Tickets
        </h1>

        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow transition">
          + Create Ticket
        </button>
      </div>

      <p className="text-gray-600">
        Manage all your tickets, track progress, and view details.
      </p>

      {/* 3. & 4. Ticket List Container */}
      <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6">
        <TicketList tickets={dummyTickets} tenant={tenant} />
      </div>
    </div>
  );
};