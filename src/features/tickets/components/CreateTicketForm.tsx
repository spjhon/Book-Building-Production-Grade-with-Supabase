"use client";

import { useContext, useRef, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { Loader2, TicketPlus } from "lucide-react";
import { toast } from "sonner"; // 1. Importamos toast de Sonner

import { Button } from "@/components/ui/button";
import { AssigneeSelect } from "@/features/tickets/components/AssigneeSelect";
import { TicketsContext } from "../DataLoaderContex";
import { fetchServiceUsersCached } from "@/lib/dbFunctions/get_service_users_with_tenant_cached";
import { Database } from "../../../../supabase/types/database.types";

export type ServiceUser = Database["public"]["Tables"]["service_users"]["Row"];

export default function CreateTicketForm() {
  const t = useTranslations("CreateTicketForm");
  const queryClient = useQueryClient();
  const supabase = createSupabaseBrowserClient();

  // Obtenemos el tenant del contexto
  const { TicketContextValue } = useContext(TicketsContext);
  const tenantId = TicketContextValue.tenantObject?.id;

  // Referencias y estados
  const ticketTitleRef = useRef<HTMLInputElement>(null);
  const ticketDescriptionRef = useRef<HTMLTextAreaElement>(null);
  const [assignee, setAssignee] = useState<string | null>(null);

  // TanStack Query: Usuarios
  const { data: usersData = [] } = useQuery({
    queryKey: ["service-users", tenantId],
    queryFn: () => fetchServiceUsersCached(tenantId!).then(res => res.data || []),
    enabled: !!tenantId,
    staleTime: 1000 * 60 * 10,
  });

  // 2. MUTACIÓN CON SONNER
  const { mutate: createTicket, isPending: isLoading } = useMutation({
    mutationFn: async (newTicket: { title: string; description: string; assignee: string | null }) => {
      const { data, error } = await supabase
        .from("tickets")
        .insert({
          ...newTicket,
          tenant_id: tenantId,
        } as any)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      // Refrescar tablas globales
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
      
      // Notificación con Sonner (limpia y rápida)
      toast.success(t("alert_ticket_created"));

      // Limpiar campos
      if (ticketTitleRef.current) ticketTitleRef.current.value = "";
      if (ticketDescriptionRef.current) ticketDescriptionRef.current.value = "";
      setAssignee(null);
    },
    onError: (error: any) => {
      // Error con Sonner
      toast.error(`Error: ${error.message || "No se pudo crear el ticket"}`);
    },
  });

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const title = ticketTitleRef.current?.value || "";
    const description = ticketDescriptionRef.current?.value || "";

    if (title.trim().length > 4 && description.trim().length > 9) {
      createTicket({ title, description, assignee });
    } else {
      toast.warning(t("alert_validation_length")); // Usamos warning para validaciones
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="flex flex-col space-y-2">
        <label className="text-sm font-medium">{t("label_title")}</label>
        <input
          ref={ticketTitleRef}
          disabled={isLoading}
          placeholder={t("placeholder_write_title")}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all disabled:bg-gray-50"
        />
      </div>

      <div className="flex flex-col space-y-2">
        <label className="text-sm font-medium">{t("label_description")}</label>
        <textarea
          ref={ticketDescriptionRef}
          placeholder="Describe el peritaje o problema..."
          disabled={isLoading}
          rows={4}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none transition-all disabled:bg-gray-50"
        />
      </div>

      <div className="flex flex-col space-y-2">
        <label className="text-sm font-medium">{t("label_assign_user")}</label>
        <AssigneeSelect
          users={usersData}
          onValueChanged={(val) => setAssignee(val)}
          value={assignee} 
        />
      </div>

      <Button
        type="submit"
        disabled={isLoading || !tenantId}
        className="w-full mt-4 font-semibold py-6 rounded-xl shadow-sm active:scale-[0.98]"
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>{t("creating_ticket")}</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <TicketPlus className="h-5 w-5" />
            <span>{t("btn_create_ticket_now")}</span>
          </div>
        )}
      </Button>
    </form>
  );
}