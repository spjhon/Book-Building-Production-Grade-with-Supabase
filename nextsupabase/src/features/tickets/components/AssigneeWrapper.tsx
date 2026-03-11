"use client";

import { AssigneeSelect } from "@/features/tickets/components/AssigneeSelect";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function AssigneeWrapper({ ticketId, tenant, defaultValue }: { 
  ticketId: string; 
  tenant: string;
  defaultValue?: string | null; 
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
      tenant={tenant}
      defaultValue={defaultValue}
      onValueChanged={handleUpdate}
    />
  );
}