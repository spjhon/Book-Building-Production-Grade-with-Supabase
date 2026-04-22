"use client";

import { useState } from "react";
import { AssigneeSelect } from "@/features/tickets/components/AssigneeSelect";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { ServiceUser } from "./CreateTicketForm";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

export default function AssigneeWrapper({ 
  ticketId, 
  usersData, 
  defaultValue 
}: { 
  ticketId: string; 
  defaultValue?: string | null; 
  usersData: ServiceUser[];
}) {
  const t = useTranslations("AssigneeSelect");
  const supabase = createSupabaseBrowserClient();
  const queryClient = useQueryClient();

  // Mantenemos un estado local para que el Select responda instantáneamente
  const [currentAssignee, setCurrentAssignee] = useState<string | null>(defaultValue ?? null);

  const { mutate: updateAssignee, isPending } = useMutation({
    mutationFn: async (val: string | null) => {
      const { data, error } = await supabase
        .from("tickets")
        .update({ assignee: val })
        .eq("id", ticketId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      // Sincronizamos el estado local con lo que devolvió la DB
      setCurrentAssignee(data.assignee);
      
      // Invalidamos las queries para que el resto de la app se entere del cambio
      queryClient.invalidateQueries({ queryKey: ["ticket", ticketId] });
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
      
      toast.success(t("assignee_updated_success") || "Asignado correctamente");
    },
    onError: (error: any) => {
      // Si falla, revertimos al valor anterior (defaultValue)
      setCurrentAssignee(defaultValue ?? null);
      toast.error(`Error: ${error.message}`);
    },
  });

  const handleUpdate = (val: string | null) => {
    // Actualizamos el estado visual inmediatamente (Optimistic UI)
    setCurrentAssignee(val);
    // Ejecutamos la mutación
    updateAssignee(val);
  };

  return (
    <div className="min-w-[140px]">
      <AssigneeSelect
        users={usersData}
        onValueChanged={handleUpdate}
        value={currentAssignee} // Usamos 'value' porque ahora es controlado
      />
      {isPending && (
        <span className="text-[10px] text-blue-500 animate-pulse absolute mt-1">
          {t("updating") || "Actualizando..."}
        </span>
      )}
    </div>
  );
}