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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

const statusStyles: Record<string, string> = {
  open: "bg-slate-500",
  in_progress: "bg-blue-500",
  done: "bg-emerald-500",
  cancelled: "bg-red-500",
  information_missing: "bg-amber-500",
};

export default function TicketStatusSelect({
  user_id,
  currentStatus,
  ticket_id,
}: {
  user_id: string;
  currentStatus: string;
  ticket_id: string;
}) {
  const t = useTranslations("TicketStatusSelect");
  const queryClient = useQueryClient();
  const supabase = createSupabaseBrowserClient();

  const statusLabels: Record<string, string> = {
    open: t("status_open"),
    in_progress: t("status_in_progress"),
    done: t("status_done"),
    cancelled: t("status_cancelled"),
    information_missing: t("status_information_missing"),
  };

  // MUTACIÓN: Actualizar el estado del ticket
  const { mutate: updateStatus, isPending } = useMutation({
    mutationFn: async (newValue: string) => {
      const { data, error } = await supabase
        .from("tickets")
        .update({ status: newValue })
        .eq("id", ticket_id)
        .eq("created_by", user_id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      // 1. Invalidamos la query del ticket específico para que la página de detalle se refresque
      queryClient.invalidateQueries({ queryKey: ["ticket"] });
      // 2. También invalidamos la lista general de tickets por si el usuario vuelve atrás
      queryClient.invalidateQueries({ queryKey: ["tickets"] });

      toast.success(t("status_updated_success"));
    },
    onError: (error: any) => {
      toast.error(`${t("error_updating")}: ${error.message}`);
    },
  });

  return (
    <Select
      onValueChange={(val) => updateStatus(val)}
      disabled={isPending}
      value={currentStatus}
    >
      <SelectTrigger className="w-[180px] h-9 bg-white shadow-sm border-slate-200">
        <SelectValue placeholder={statusLabels[currentStatus]} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {Object.entries(statusLabels).map(([value, label]) => (
            <SelectItem key={value} value={value}>
              <div className="flex items-center gap-2">
                <span
                  className={`h-2 w-2 rounded-full ${statusStyles[value] || "bg-slate-400"}`}
                />
                <span className="text-sm">{label}</span>
              </div>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}