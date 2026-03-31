"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
} from "@/components/ui/select"; // Ajusta el path según tu estructura

import { ServiceUser } from "./CreateTicketForm";

import { useTranslations } from "next-intl";

export function AssigneeSelect({
  onValueChanged,
  users,
  defaultValue,
}: {
  onValueChanged: (val: string | null) => void;
  users: ServiceUser[];
  defaultValue?: string | null;
}) {
  const t = useTranslations("AssigneeSelect");

  return (
    <Select
      onValueChange={(val) => onValueChanged(val === "none" ? null : val)}
      disabled={users === null}
      defaultValue={defaultValue ? defaultValue : undefined}
    >
      <SelectTrigger className="w-full">
        <SelectValue
          placeholder={
            users === null ? t("status_loading") : t("status_unassigned")
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
