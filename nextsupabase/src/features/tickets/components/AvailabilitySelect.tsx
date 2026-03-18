"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
} from "@/components/ui/select";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";


export function AvailabilitySelect({ 
  user_id, 
  is_available 
}: { 
  tenant_id: string;
  user_id: string;
  is_available: boolean;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createSupabaseBrowserClient();
  const router = useRouter()

  const handleStatusChange = async (value: string) => {
    setIsLoading(true);
    const newStatus = value === "available";

    // Llamada DIRECTA a Supabase (Cuesta $0 en Vercel)
    const {data: finaleUpdateStatus, error } = await supabase
      .from("service_users")
      .update({ is_available: newStatus })
      .eq("id", user_id)
      .select() // <--- OBLIGATORIO para recibir la fila actualizada
      .single();

      console.log(finaleUpdateStatus)
    if (error) {
      alert("Error: " + error?.message);
    } else {
      // Opcional: podrías usar router.refresh() para actualizar la tabla
      console.log("Estado actualizado");
    }
    setIsLoading(false);
    router.refresh()
  };

  return (
    <Select 
      onValueChange={handleStatusChange}
      defaultValue={is_available ? "available" : "unavailable"}
      disabled={isLoading}
    >
      <SelectTrigger className="w-35">
        <SelectValue placeholder={is_available ? "Disponible" : "No disponible"} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="available">Disponible</SelectItem>
          <SelectItem value="unavailable">No disponible</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}