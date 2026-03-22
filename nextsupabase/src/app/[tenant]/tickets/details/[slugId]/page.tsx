import { createSupabaseServerClient } from "@/lib/supabase/server";
import TicketComments from "../../../../../features/tickets/components/ticketComment";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import DeleteButton from "@/features/tickets/components/DeleteButton";
import AssigneeWrapper from "@/features/tickets/components/AssigneeWrapper";
import { fetchTenantDataCached } from "@/lib/dbFunctions/fetch_tenant_domain_cached";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import TicketStatusSelect from "@/features/tickets/components/TicketStatusSelect";
import { ServiceUser } from "@/features/tickets/components/CreateTicketForm";
import { PostgrestError } from "@supabase/supabase-js";


  const statusStyles: Record<string, string> = {
  open: "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-100/80",
  in_progress: "bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-100/80",
  done: "bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100/80",
  cancelled: "bg-red-100 text-red-700 border-red-200 hover:bg-red-100/80",
  information_missing: "bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100/80",
};

export default async function TicketDetailPage({params}: Readonly<{ params: Promise<{ slugId: string; tenant: string }>, }>) {
  
  
  const { slugId } = await params;
  const{tenant} = await params



  const supabaseServerClient = await createSupabaseServerClient();
  const supabaseAdmin = createSupabaseAdminClient();



  //LLAMADO DB: Se extrae el nombre, el dominio y el id del tenant actual
  const {data: tenantData, error: errorFetchingTenantData} = await fetchTenantDataCached(tenant)
  
  if (!tenantData || errorFetchingTenantData) {
    const errorMessage = typeof errorFetchingTenantData === "string" 
      ? errorFetchingTenantData 
      : errorFetchingTenantData?.message || "Tenant no encontrado";
    redirect(`/error?type=${encodeURIComponent(errorMessage)}`);
  }



  // LLAMADO DB: Se estan trallendo todos los tickets con sus comentarios pegados
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


 
  //LLAMADO DB: Se extrae el nombre del autor del ticket creado
  const { data: AutorName, error: fetchAutorError } = await supabaseAdmin
  .from("service_users")
  .select("*")
  .eq("id", ticket.created_by)
  .single();

  if (fetchAutorError){
    const errorMessage = fetchAutorError?.message || "Error";
    redirect(`/error?type=Error trallendo el autor: ${encodeURIComponent(errorMessage)}`);
  } 


  //LLAMADO DB: Se extrae la informacion del usuario loggeado
  const { data: dataClaims, error: errorFetchingClamis } = await supabaseServerClient.auth.getClaims();
  
  
  if (!dataClaims || errorFetchingClamis){
    const errorMessage = errorFetchingClamis?.message || "Error";
    redirect(`/error?type=Error trallendo la session del usuario: ${encodeURIComponent(errorMessage)}`);
  } 
  

  const sessionUser = dataClaims?.claims;
  const supabase_user_id = sessionUser?.sub || "";



  //LLAMADA DB: Extraccion de la informacion del service_user que esta logeado
  const { data: serviceUser, error: fetchServiceUserError } = await supabaseServerClient
  .from("service_users")
  .select("id")
  .eq("auth_user_id", supabase_user_id)
  .single();

  if (!serviceUser || fetchServiceUserError){
      const errorMessage = fetchServiceUserError?.message || "Error";
      redirect(`/error?type=Error trallendo el id del service user: ${encodeURIComponent(errorMessage)}`);
  } 



  const isAuthor = serviceUser?.id === ticket.created_by;
  const{comments} = ticket;
  
  const dateString = new Date(ticket.created_at).toLocaleString("en-US");




  //LLAMADA DB: SERVICE_USERS PARA EL SELECT, todos los service_users bajo el tenant
const usersPromise = supabaseServerClient.rpc("get_service_users_with_tenant", { target_tenant_id: tenantData.id }).then(res => res as { data: ServiceUser[] | null; error: PostgrestError });
  



  return (
    <div className="max-w-4xl mx-auto mt-16 px-4 mb-20">
      {/* Title Section */}
      <div className="mb-8 space-y-1">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
          Ticket <span className="text-slate-400 font-light">#{slugId}</span>
        </h1>
        <p className="text-slate-500 text-sm font-medium">
          Gestión de detalles, asignación y trazabilidad del caso.
        </p>
      </div>

      {/* Main Card */}
      <article className="bg-white border border-slate-200 shadow-sm rounded-3xl overflow-hidden">
        
        {/* Header info */}
        <header className="p-8 pb-6 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Badge 
                variant="outline" 
                className={`px-3 py-1 rounded-full text-xs font-bold border-2 transition-colors ${statusStyles[ticket.status] || "bg-slate-100"}`}
              >
                {ticket.status.replace('_', ' ')}
              </Badge>



              <TicketStatusSelect
              user_id={ticket.created_by}
              ticket_status={ticket.status}
              ticket_id={ticket.id}
              >
              </TicketStatusSelect>


              <time className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                {dateString}
              </time>
            </div>

            <div className="flex items-center gap-2">
              <AssigneeWrapper
                ticketId={ticket.id} 
                usersPromise={usersPromise}
                defaultValue={ticket.assignee}
              />
              {isAuthor && (
                <div className="pl-2 border-l border-slate-200">
                  <DeleteButton ticketId={ticket.id}  />
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-slate-900 leading-tight">
              {ticket.title}
            </h2>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span>Creado por</span>
              <span className="flex items-center gap-1.5 font-semibold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md">
                <div className="w-4 h-4 rounded-full bg-slate-300" /> 
                {AutorName.full_name}
              </span>
            </div>
          </div>
        </header>

        <div className="px-8">
          <hr className="border-slate-100" />
        </div>

        {/* Body */}
        <section className="p-8 pt-6 prose prose-slate max-w-none">
          <p className="text-slate-700 text-[16px] leading-relaxed whitespace-pre-wrap">
            {ticket.description}
          </p>
        </section>

        <div className="px-8">
          <hr className="border-slate-100" />
        </div>

        {/* Comments Section - Secciones con fondo sutil para separar del cuerpo */}
        <footer className="bg-slate-50/50 p-8">
          <TicketComments 
            ticket_id={ticket.id} 
            comments={comments} 
            tenant_id={tenantData.id} 
            tenantName={tenant}
          />
        </footer>
      </article>
    </div>
  );
}