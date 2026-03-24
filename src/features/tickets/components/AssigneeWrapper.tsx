"use client";

import { AssigneeSelect } from "@/features/tickets/components/AssigneeSelect";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { ServiceUser } from "./CreateTicketForm";
import { PostgrestError } from "@supabase/supabase-js";

export default function AssigneeWrapper({ ticketId, usersPromise, defaultValue }: { 
  ticketId: string; 
  defaultValue?: string | null; 
  usersPromise: PromiseLike<{ data: ServiceUser[] | null; error: PostgrestError }>;
}) {
  const supabase = createSupabaseBrowserClient();

  const handleUpdate = async (val: string | null) => {
    // Aquí ejecutas la lógica de actualización en Supabase
    console.log("se puso a trabajar la funcion handleupdate")
    const { error } = await supabase
      .from("tickets")
      .update({ assignee: val })
      .eq("id", ticketId);

    if (error) alert("Error al actualizar: " + error.message);
  };

  return (
    <AssigneeSelect
      usersPromise={usersPromise}
      onValueChanged={handleUpdate}
      defaultValue={defaultValue}
    />
  );
}