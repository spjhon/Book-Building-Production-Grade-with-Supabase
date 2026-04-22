"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
} from "@/components/ui/select";
import { ServiceUser } from "./CreateTicketForm";
import { useTranslations } from "next-intl";

export function AssigneeSelect({
  onValueChanged,
  users,
  value, // Cambiamos defaultValue por value para que sea un componente controlado
}: {
  onValueChanged: (val: string | null) => void;
  users: ServiceUser[];
  value: string | null; // Sincronizado con el estado del padre
}) {
  const t = useTranslations("AssigneeSelect");

  return (
    <Select
      // Si el valor es null, le pasamos "none" para que coincida con el Item de desasignar
      value={value ?? "none"} 
      onValueChange={(val) => onValueChanged(val === "none" ? null : val)}
      disabled={!users || users.length === 0}
    >
      <SelectTrigger className="w-full">
        <SelectValue
          placeholder={
            !users ? t("status_loading") : t("status_unassigned")
          }
        />
      </SelectTrigger>

      <SelectContent>
        <SelectGroup>
          <SelectItem value="none">{t("status_unassigned")}</SelectItem>
          {users?.map((user) => (
            <SelectItem key={user.id} value={user.id}>
              {user.full_name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}