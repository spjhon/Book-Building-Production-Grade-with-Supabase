import Link from "next/link";

import { fetchTenantDataCached } from "@/lib/dbFunctions/fetch_tenant_domain_cached";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";

interface TicketListProps {
 page: string,
  tenant: string
  search: string
}

const statusStyles: Record<string, string> = {
  open: "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-100/80",
  in_progress: "bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-100/80",
  done: "bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100/80",
  cancelled: "bg-red-100 text-red-700 border-red-200 hover:bg-red-100/80",
  information_missing: "bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100/80",
};






export async function TicketList({tenant, page, search}: TicketListProps) {


const pageSize = 6;
const searchValue = search?.trim() || "";
let pageSanitazed = 1


if (Number.isInteger(Number(page)) && Number(page) > 0) {
  pageSanitazed = Number(page);
}


const startingPoint = (pageSanitazed - 1) * pageSize;


const supabaseServer = await createSupabaseServerClient()



const {data: tenantData, error: errorFetchingTenantData} = await fetchTenantDataCached(tenant);


  if (!tenantData || errorFetchingTenantData){
    console.log( " No se puedo obtener info del tenant")
    console.log(errorFetchingTenantData)
    return
  }

  

  // Crea las variables de consulta, pero NO las esperes con 'await'
  let countStatement = supabaseServer
    .from("tickets")
    .select("*", { count: 'exact', head: true })
    .eq("tenant_id", tenantData.id);

  let ticketsStatement = supabaseServer
    .from("tickets")
    .select(`*,creator:service_users!created_by (full_name)`)
    .eq("tenant_id", tenantData.id);




  // AQUÍ es donde entra tu lógica de búsqueda (el filtro OR)
  if (searchValue) {

    const postgrestFilterString = `title.ilike.%${searchValue}%,description.ilike.%${searchValue}%`;
    
    countStatement = countStatement.or(postgrestFilterString);
    ticketsStatement = ticketsStatement.or(postgrestFilterString);
  }




  // Ahora, al final de todo, aplicamos los modificadores finales a la statement
  ticketsStatement = ticketsStatement
    .range(startingPoint, startingPoint + (pageSize - 1))
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

  const moreRows = count > pageSanitazed * pageSize;

  const getHref = (p: number) => {
  const params = new URLSearchParams();
  if (searchValue) params.set("search", searchValue);
  params.set("page", p.toString());
  return `?${params.toString()}`;
}


  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="text-sm text-gray-600 border-b border-gray-200">
            <th className="py-3 px-2 font-medium">ID</th>
            <th className="py-3 px-2 font-medium">Titulo</th>
            <th className="py-3 px-2 font-medium">Estado</th>
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
                  by {ticket.creator?.full_name || "Usuario desconocido"}
                </div>
              </td>

              {/* Status */}
              <td className="py-3 px-2">
                <Badge 
                  variant="outline" 
                  className={`font-semibold capitalize ${statusStyles[ticket.status] || "bg-gray-100"}`}
                >
                  {ticket.status.replace('_', ' ')}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>




      <div className="flex mt-4 w-full">
        {pageSanitazed > 1 && (
          <Link 
            className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200" 
            href={getHref(pageSanitazed - 1)}
          >
            ← Previous page
          </Link>
        )}

        {moreRows && (
          <Link 
            className="ml-auto px-4 py-2 bg-gray-100 rounded hover:bg-gray-200" 
            href={getHref(pageSanitazed + 1)}
          >
            Next page →
          </Link>
        )}
      </div>






    </div>
  );
}
