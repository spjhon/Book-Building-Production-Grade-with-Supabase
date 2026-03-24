"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
} from "@/components/ui/select"; // Ajusta el path según tu estructura

import { ServiceUser } from './CreateTicketForm';
import { PostgrestError } from "@supabase/supabase-js";
import { use } from "react";

export function AssigneeSelect({ onValueChanged, usersPromise, defaultValue }: { 
  onValueChanged: (val: string | null) => void;
  usersPromise: PromiseLike<{ data: ServiceUser[] | null; error: PostgrestError }>;
  defaultValue?: string | null; 
}) {


  const {data: ServiceUsers, error} = use(usersPromise)

  


  return (
    <Select 
      onValueChange={(val) => onValueChanged(val === "none" ? null : val)}
      disabled={ServiceUsers === null}
      defaultValue={defaultValue?defaultValue:undefined }
    >

      <SelectTrigger className="w-full">
        <SelectValue placeholder={ServiceUsers === null ? "Cargando..." : "Sin asignar"} />
      </SelectTrigger>

      <SelectContent>
        <SelectGroup>
          <SelectItem value="none">Sin asignar</SelectItem>
          {ServiceUsers?.map((user) => (
            <SelectItem key={user.id} value={user.id}>
              {user.full_name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>

    </Select>
  );
}

