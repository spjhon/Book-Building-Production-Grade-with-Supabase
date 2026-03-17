import Link from "next/link";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { fetchTenantDataCached } from "@/lib/dbFunctions/fetch_tenant_domain_cached";

interface TicketListProps {
 page: string,
  tenant: string
  search: string
}

const statusStyles: Record<string, string> = {
  "Not started": "bg-gray-200 text-gray-700",
  "In progress": "bg-blue-100 text-blue-700",
  "Done": "bg-green-100 text-green-700",
};






export async function TicketList({tenant, page, search}: TicketListProps) {


const pageSize = 6;
const searchValue = search?.trim() || "";
let pageSanitazed = 1


if (Number.isInteger(Number(page)) && Number(page) > 0) {
  pageSanitazed = Number(page);
}


const startingPoint = (pageSanitazed - 1) * pageSize;


const supabaseAdmin = createSupabaseAdminClient()



const {data: tenantData, error: errorFetchingTenantData} = await fetchTenantDataCached(tenant);


if (!tenantData || errorFetchingTenantData){
    console.log( " No se puedo obtener info del tenant")
    console.log(errorFetchingTenantData)
    return
  }

  

// Crea las variables de consulta, pero NO las esperes con 'await'
let countStatement = supabaseAdmin
  .from("tickets")
  .select("*", { count: 'exact', head: true })
  .eq("tenant_id", tenantData.id);

let ticketsStatement = supabaseAdmin
  .from("tickets")
  .select("*")
  .eq("tenant_id", tenantData.id);




// AQUÍ es donde entra tu lógica de búsqueda (el filtro OR)
if (searchValue) {

  const postgrestFilterString = `title.ilike.%${searchValue}%,description.ilike.%${searchValue}%`;
  
  countStatement = countStatement.or(postgrestFilterString);
  ticketsStatement = ticketsStatement.or(postgrestFilterString);
}

  // Ahora, al final de todo, aplicamos los modificadores finales a la statement
  ticketsStatement = ticketsStatement
    .range(startingPoint, startingPoint + 5)
    .order("created_at", { ascending: true });

  // Y AHORA SÍ, ejecutamos ambas consultas
  const { count, error: errorFetchingCountedTickets } = await countStatement;
  if (errorFetchingCountedTickets || !count){
    console.log(errorFetchingCountedTickets?.message + " No se logro contar los tickets")
    return
  }


  const { data: fetchedTickets, error: errorFetchedTickets } = await ticketsStatement;
  if (errorFetchedTickets || !fetchedTickets){
    console.log(errorFetchedTickets?.message + " No se encontraron tickets")
    return
  }

  const moreRows = count - pageSanitazed * 6 > 0;


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
          {fetchedTickets.map((ticket) => (
            <tr
              key={ticket.id}
              className="border-b border-gray-100 hover:bg-gray-50 transition"
            >
              {/* ID */}
              <td className="py-3 px-2 text-gray-500 font-medium">
                #{ticket.ticket_number}
              </td>

              {/* Title */}
              <td className="py-3 px-2">
                <Link
                  href={`/tickets/details/${ticket.ticket_number}`}
                  className="text-blue-600 hover:underline font-semibold"
                >
                  {ticket.title}
                </Link>
                <div className="text-xs text-gray-500 mt-1">
                  by {ticket.created_by}
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




      <div className="flex mt-4 w-full">
        {pageSanitazed > 1 && (
          <Link 
            className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200" 
            href={`?page=${pageSanitazed - 1}`}
          >
            ← Previous page
          </Link>
        )}

        {moreRows && (
          <Link 
            className="ml-auto px-4 py-2 bg-gray-100 rounded hover:bg-gray-200" 
            href={`?page=${pageSanitazed + 1}`}
          >
            Next page →
          </Link>
        )}
      </div>






    </div>
  );
}
