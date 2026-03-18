import { createSupabaseServerClient } from "@/lib/supabase/server";
import TicketComments from "../../../../../features/tickets/components/ticketComment";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import DeleteButton from "@/features/tickets/components/DeleteButton";
import AssigneeWrapper from "@/features/tickets/components/AssigneeWrapper";
import { fetchTenantDataCached } from "@/lib/dbFunctions/fetch_tenant_domain_cached";
import { redirect } from "next/navigation";


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




  const {data: tenantData, error: errorFetchingTenantData} = await fetchTenantDataCached(tenant)
  
  if (!tenantData || errorFetchingTenantData) {
    
    // 2. Extraemos el mensaje de forma segura para TypeScript
    const errorMessage = typeof errorFetchingTenantData === "string" 
      ? errorFetchingTenantData 
      : errorFetchingTenantData?.message || "Tenant no encontrado";

    redirect(`/error?type=${encodeURIComponent(errorMessage)}`);
  }

  // Asumiendo que ya obtuviste el tenantId con el código anterior
  const { data: ticket, error: fetchTicketError } = await supabaseServerClient
  .from("tickets")
  .select("*, comments (*, comment_attachments (*) )")
  .order("created_at", { ascending: true, foreignTable: "comments" })
  .eq("ticket_number", Number(slugId))
  .eq("tenant_id", tenantData.id) // Filtro de seguridad multi-tenant
  .single();

  
  if (!ticket || fetchTicketError) {
    const errorMessage = fetchTicketError?.message || "Error";
    redirect(`/error?type=Error trallendo el ticket: ${encodeURIComponent(errorMessage)}`);
  }


 
  
  const { data: Autor, error: fetchAutorError } = await supabaseAdmin
  .from("service_users")
  .select("*")
  .eq("id", ticket.created_by)
  .single();

  if (fetchAutorError){
    const errorMessage = fetchAutorError?.message || "Error";
    redirect(`/error?type=Error trallendo el autor: ${encodeURIComponent(errorMessage)}`);
  } 



  const { data: dataClaims, error: errorFetchingClamis } = await supabaseServerClient.auth.getClaims(); //se obtiene el claims osea el usuario
  
  
  if (!dataClaims || errorFetchingClamis){
    const errorMessage = errorFetchingClamis?.message || "Error";
    redirect(`/error?type=Error trallendo la session del usuario: ${encodeURIComponent(errorMessage)}`);
  } 
  
  const sessionUser = dataClaims?.claims;


  const supabase_user_id = sessionUser?.sub || "";




  const { data: serviceUserId, error: fetchServiceUserIdError } = await supabaseServerClient
  .from("service_users")
  .select("id")
  .eq("auth_user_id", supabase_user_id)
  .single();


if (!serviceUserId || fetchServiceUserIdError){
    const errorMessage = fetchServiceUserIdError?.message || "Error";
    redirect(`/error?type=Error trallendo el id del service user: ${encodeURIComponent(errorMessage)}`);
  } 

  const isAuthor = serviceUserId?.id === ticket.created_by;
  const{comments} = ticket;
  
  const dateString = new Date(ticket.created_at).toLocaleString("en-US");

  return (
    
    <div className="max-w-3xl mx-auto mt-20">
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
              tenant_id={tenantData.id} 
              defaultValue={ticket.assignee}
            />

            {isAuthor && (
              <DeleteButton ticketId ={ticket.id} tenant={tenantData.id}></DeleteButton>
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
        <TicketComments ticket_id ={ticket.id} comments ={comments} tenant_id={tenantData.id} tenantName={tenant}/>
      </article>
    </div>
  );
}