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
  user_id: string;
  is_available: boolean;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createSupabaseBrowserClient();
  const router = useRouter()

  const handleStatusChange = async (value: string) => {
    setIsLoading(true);
    const newStatus = value === "available";


    try{

 // Llamada DIRECTA a Supabase (Cuesta $0 en Vercel)
    const {data: finaleUpdateAvailability, error: errorUpdateAvailability } = await supabase
    .from("service_users")
    .update({ is_available: newStatus })
    .eq("id", user_id)
    .select() // <--- OBLIGATORIO para recibir la fila actualizada
    .single();

    if(errorUpdateAvailability || !finaleUpdateAvailability){
      console.log("Error actualizando el status.")
      throw new Error("Error actualizando el status.")
    }

    }catch(error){
      const message = error instanceof Error? error.message : "Error actualizando el disponiblidad."
      console.log(message)
    }finally{
      setIsLoading(false);
      router.refresh()
    }



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