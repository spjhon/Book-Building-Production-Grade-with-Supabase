"use client";

import { useContext } from "react";
import { useParams } from "next/navigation";
import { Loader2, AlertCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { fetchServiceUsersCached } from "@/lib/dbFunctions/get_service_users_with_tenant_cached";
import { getAuthorNameAction } from "@/lib/dbFunctions/fetch_autor_name_ticket";

import TicketComments from "../../../../../features/tickets/components/ticketComment";
import DeleteButton from "@/features/tickets/components/DeleteButton";
import AssigneeWrapper from "@/features/tickets/components/AssigneeWrapper";
import TicketStatusSelect from "@/features/tickets/components/TicketStatusSelect";
import { Badge } from "@/components/ui/badge";
import { TicketsContext } from "@/features/tickets/DataLoaderContex";

const statusStyles: Record<string, string> = {
  open: "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-100/80",
  in_progress: "bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-100/80",
  done: "bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100/80",
  cancelled: "bg-red-100 text-red-700 border-red-200 hover:bg-red-100/80",
  information_missing: "bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100/80",
};

export default function TicketDetailPage() {
  const t = useTranslations("TicketDetailPage");
  const { slugId, tenant } = useParams();
  const supabase = createSupabaseBrowserClient();

  // 1. OBTENEMOS TENANT DEL CONTEXTO
  const { TicketContextValue } = useContext(TicketsContext);
  const tenantData = TicketContextValue.tenantObject;

  // 2. QUERY: DATOS DEL TICKET
  const { 
    data: ticket, 
    isLoading: isLoadingTicket, 
    isError: isErrorTicket 
  } = useQuery({
    queryKey: ["ticket", tenantData?.id, slugId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tickets")
        .select("*, comments (*, comment_attachments (*) )")
        .order("created_at", { ascending: true, foreignTable: "comments" })
        .eq("ticket_number", Number(slugId))
        .eq("tenant_id", tenantData.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!tenantData?.id,
  });

  // 3. QUERY: USUARIOS (Reutiliza el caché de la tabla de usuarios si ya la visitaste)
  const { data: usersData = [] } = useQuery({
    queryKey: ["service-users", tenantData?.id],
    queryFn: () => fetchServiceUsersCached(tenantData.id).then(res => res.data || []),
    enabled: !!tenantData?.id,
  });

  // 4. QUERY: NOMBRE DEL AUTOR
  const { data: autorName } = useQuery({
    queryKey: ["author", ticket?.created_by],
    queryFn: () => getAuthorNameAction(ticket!.created_by).then(res => res.data),
    enabled: !!ticket?.created_by,
  });

  // 5. QUERY: USUARIO ACTUAL (Para permisos de borrado/edición)
  const { data: serviceUserId } = useQuery({
    queryKey: ["current-service-user"],
    queryFn: async () => {
      const { data: session } = await supabase.auth.getUser();
      if (!session.user) return null;
      const { data } = await supabase
        .from("service_users")
        .select("id")
        .eq("auth_user_id", session.user.id)
        .single();
      return data?.id;
    },
    staleTime: Infinity,
  });

  // --- MANEJO DE ESTADOS ---

  if (isLoadingTicket || !tenantData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
        <p className="text-slate-500 font-medium">{t("loading_ticket_details")}</p>
      </div>
    );
  }

  if (isErrorTicket || !ticket) {
    return (
      <div className="max-w-xl mx-auto mt-20 p-6 border-2 border-red-100 bg-red-50 rounded-2xl flex flex-col items-center gap-4 text-center">
        <AlertCircle className="w-12 h-12 text-red-500" />
        <h2 className="text-xl font-bold text-red-900">{t("error_title")}</h2>
        <button onClick={() => window.location.reload()} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
          {t("retry")}
        </button>
      </div>
    );
  }

  const isAuthor = serviceUserId === ticket.created_by;
  const dateString = new Date(ticket.created_at).toLocaleString("es-ES");

  return (
    <div className="max-w-4xl mx-auto mt-16 px-4 mb-20 animate-in fade-in duration-500">
      <div className="mb-8 space-y-1">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
          Ticket <span className="text-slate-400 font-light">#{slugId}</span>
        </h1>
        <p className="text-slate-500 text-sm font-medium">{t("ticket_management_description")}</p>
      </div>

      <article className="bg-white border border-slate-200 shadow-sm rounded-3xl overflow-hidden">
        <header className="p-8 pb-6 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Badge variant="outline" className={`px-3 py-1 rounded-full text-xs font-bold border-2 ${statusStyles[ticket.status] || "bg-slate-100"}`}>
                {ticket.status.replace('_', ' ')}
              </Badge>

              {isAuthor && (
                <TicketStatusSelect
                  user_id={ticket.created_by}
                  currentStatus={ticket.status}
                  ticket_id={ticket.id}
                  // Nota: TicketStatusSelect ahora debería usar useMutation + invalidateQueries(["ticket"])
                />
              )}

              <time className="text-xs font-medium text-slate-400 uppercase tracking-wider">{dateString}</time>
            </div>

            <div className="flex items-center gap-2">
              <AssigneeWrapper 
                ticketId={ticket.id} 
                usersData={usersData} 
                defaultValue={ticket.assignee} 
              />
              {isAuthor && (
                <div className="pl-2 border-l border-slate-200">
                  <DeleteButton ticketId={ticket.id} />
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-slate-900 leading-tight">{ticket.title}</h2>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span>{t("created_by")}</span>
              <span className="flex items-center gap-1.5 font-semibold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md">
                <div className="w-4 h-4 rounded-full bg-slate-300" /> 
                {autorName?.full_name || "Usuario del Sistema"}
              </span>
            </div>
          </div>
        </header>

        <section className="p-8 pt-6 prose prose-slate max-w-none border-t border-slate-100">
          <p className="text-slate-700 text-[16px] leading-relaxed whitespace-pre-wrap">
            {ticket.description}
          </p>
        </section>

        <footer className="bg-slate-50/50 p-8 border-t border-slate-100">
          <TicketComments 
            ticket_id={ticket.id} 
            comments={ticket.comments} 
            tenant_id={tenantData.id} 
            tenantName={tenant as string}
          />
        </footer>
      </article>
    </div>
  );
}