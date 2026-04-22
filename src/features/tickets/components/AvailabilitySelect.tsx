"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
} from "@/components/ui/select";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { useTranslations } from "next-intl";
import { useMutation, useQueryClient } from "@tanstack/react-query"; // 1. Importamos herramientas de TanStack
import { toast } from "sonner"; // O tu librería de notificaciones favorita

export function AvailabilitySelect({
  user_id,
  is_available,
}: {
  user_id: string;
  is_available: boolean;
}) {
  const t = useTranslations("AvailabilitySelect");
  const supabase = createSupabaseBrowserClient();
  const queryClient = useQueryClient(); // El motor que controla el caché

  // 2. CONFIGURAMOS LA MUTACIÓN
  const { mutate, isPending } = useMutation({
    mutationFn: async (newStatus: boolean) => {
      const { data, error } = await supabase
        .from("service_users")
        .update({ is_available: newStatus })
        .eq("id", user_id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    // 3. LA MAGIA: Al terminar con éxito, invalidamos la lista de usuarios
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["service-users"] });
      toast.success(t("status_updated_successfully")); // Opcional
    },
    onError: (error) => {
      console.error("Error:", error);
      toast.error(t("error_updating_status"));
    },
  });

  const handleStatusChange = (value: string) => {
    const newStatus = value === "available";
    mutate(newStatus); // Disparamos la mutación
  };

  return (
    <Select
      onValueChange={handleStatusChange}
      defaultValue={is_available ? "available" : "unavailable"}
      disabled={isPending}
    >
      <SelectTrigger className="w-40">
        <SelectValue placeholder={is_available ? "Disponible" : "No disponible"} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="available">{t("status_available")}</SelectItem>
          <SelectItem value="unavailable">{t("status_unavailable")}</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}