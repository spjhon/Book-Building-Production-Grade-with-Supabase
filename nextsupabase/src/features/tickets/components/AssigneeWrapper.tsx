"use client";

import { AssigneeSelect } from "@/features/tickets/components/AssigneeSelect";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { ServiceUser } from "./CreateTicketForm";

export default function AssigneeWrapper({ ticketId, users, defaultValue }: { 
  ticketId: string; 
  defaultValue?: string | null; 
  users: ServiceUser[];
}) {
  const supabase = createSupabaseBrowserClient();

  const handleUpdate = async (val: string | null) => {
    // Aquí ejecutas la lógica de actualización en Supabase
    const { error } = await supabase
      .from("tickets")
      .update({ assignee: val })
      .eq("id", ticketId);

    if (error) alert("Error al actualizar: " + error.message);
  };

  return (
    <AssigneeSelect
      ServiceUsers={users}
      onValueChanged={handleUpdate}
      defaultValue={defaultValue}
    />
  );
}