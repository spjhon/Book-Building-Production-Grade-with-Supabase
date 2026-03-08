"use client";
import { Button } from "@/components/ui/button";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function DeleteButton({ ticketId, tenant }: { ticketId: string, tenant: string }) {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient()

  const handleDelete = async () => {
    const{data, error} = await supabase.from("tickets").delete().eq("id", ticketId);
     console.log(error||"no hubo error")
     console.log(data)
    router.push(`/tickets`); // Redirige después de borrar
    router.refresh(); // Opcional: fuerza a Next.js a re-renderizar la lista

  };

 

  return (
    <Button variant="destructive" onClick={handleDelete}>
      Delete ticket
    </Button>
  );
}