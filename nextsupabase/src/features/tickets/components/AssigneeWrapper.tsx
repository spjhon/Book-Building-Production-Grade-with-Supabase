"use client";

import { AssigneeSelect } from "@/features/tickets/components/AssigneeSelect";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function AssigneeWrapper({ ticketId, tenantId, defaultValue }: { 
  ticketId: string; 
  tenantId: string;
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
      tenant_id={tenantId}
      defaultValue={defaultValue}
      onValueChanged={handleUpdate}
    />
  );
}