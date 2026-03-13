import { createSupabaseServerClient } from "@/lib/supabase/server";
import TicketComments from "../../../../../features/tickets/components/ticketComment";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import DeleteButton from "@/features/tickets/components/DeleteButton";
import AssigneeWrapper from "@/features/tickets/components/AssigneeWrapper";


const TICKET_STATUS = {
  open: "Open",
  in_progress: "In progress",
  information_missing: "Information missing",
  canceled: "Canceled",
  done: "Done",
  };

  const STATUS_STYLES = {
  open: "bg-blue-100 text-blue-700",
  in_progress: "bg-yellow-100 text-yellow-700",
  information_missing: "bg-orange-100 text-orange-700",
  canceled: "bg-gray-100 text-gray-700",
  done: "bg-green-100 text-green-700",
} as const; // 'as const' nos da seguridad de tipos


export default async function TicketDetailPage({params}: Readonly<{ params: Promise<{ slugId: string; tenant: string }>, }>) {
  
  
  const { slugId } = await params;
  const{tenant} = await params



  const supabaseServerClient = await createSupabaseServerClient();
  const supabaseAdmin = createSupabaseAdminClient();




  const { data: fetchTenantID, error: fetchTenantError } = await supabaseServerClient
  .from("tenants")
  .select("id")
  .eq("domain", tenant) // Asumiendo que tu columna se llama 'domain'
  .single(); // Usamos maybeSingle para evitar errores si no existe


  if (fetchTenantError){
    console.log(fetchTenantError?.message + " No se puedo obtener info del tenant")
    return
  }
  

  // Asumiendo que ya obtuviste el tenantId con el código anterior
  const { data: ticket, error: fetchTicketError } = await supabaseServerClient
  .from("tickets")
  .select("*, comments (*, comment_attachments (*) )")
  .order("created_at", { ascending: true, foreignTable: "comments" })
  .eq("ticket_number", Number(slugId))
  .eq("tenant_id", fetchTenantID.id) // Filtro de seguridad multi-tenant
  .single();

  



  if (fetchTicketError){
    console.log(fetchTicketError?.message + " no se pudo traer el ticket")
    return
  }


 
  
  const { data: Autor, error: fetchAutorError } = await supabaseAdmin
  .from("service_users")
  .select("*")
  .eq("id", ticket.created_by)
  .single();

  if (fetchAutorError){
    console.log(fetchAutorError?.message + "No se puedo traer el autor del ticket")
    return
  } 



  const { data } = await supabaseServerClient.auth.getClaims(); //se obtiene el claims osea el usuario
  const sessionUser = data?.claims;


  const supabase_user_id = sessionUser?.sub || "";




  const { data: serviceUserId } = await supabaseServerClient
  .from("service_users")
  .select("id")
  .eq("auth_user_id", supabase_user_id)
  .single();




  const isAuthor = serviceUserId?.id === ticket.created_by;
  const{comments} = ticket;
  console.log(comments)
  const dateString = new Date(ticket.created_at).toLocaleString("en-US");

  return (
    
    <div className="max-w-3xl mx-auto py-10 space-y-8">
      {/* Title Section */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          Ticket #{slugId}
        </h1>

        <p className="text-gray-500">
          Detailed information, status, and comments for this ticket.
        </p>
      </div>

      {/* Main Card */}
      <article className="bg-white border border-gray-200 shadow-sm rounded-2xl p-8 space-y-6">
        
        {/* Header info */}
        <header className="space-y-4">
          <div className="flex items-center justify-between">
            <span className={`px-3 py-1 text-sm rounded-full font-semibold ${STATUS_STYLES[ticket.status as keyof typeof STATUS_STYLES]  || " bg-orange-100 text-orange-700"}`}>
              ● {TICKET_STATUS[ticket.status as keyof typeof TICKET_STATUS] || "Unknown"}
            </span>

            <time className="text-sm text-gray-500">
              Ticket creado el: {dateString}
            </time>

            <AssigneeWrapper
              ticketId={ticket.id} 
              tenant={tenant} 
              defaultValue={ticket.assignee}
            />

            {isAuthor && (
              <DeleteButton ticketId ={ticket.id} tenant={fetchTenantID.id}></DeleteButton>
            )}
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-900">
              {ticket.title}
            </h2>
            <p className="text-orange-500 mt-1">
              Created by: 
              <strong className="text-gray-700">{" " + Autor.full_name}</strong>
            </p>
          </div>
        </header>

        <hr className="border-gray-200" />

        {/* Body */}
        <section className="text-gray-700 text-[15px] leading-relaxed">
          {ticket.description}
        </section>

       

        <hr className="border-gray-200" />

        {/* Comments / Related components */}
        <TicketComments ticket_id ={ticket.id} comments ={comments} tenant_id={fetchTenantID.id}/>
      </article>
    </div>
  );
}