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


export function AssigneeSelect({ onValueChanged, users, defaultValue }: { 
  onValueChanged: (val: string | null) => void;
  users: ServiceUser[];
  defaultValue?: string | null; 
}) {




  


  return (
    <Select 
      onValueChange={(val) => onValueChanged(val === "none" ? null : val)}
      disabled={users === null}
      defaultValue={defaultValue?defaultValue:undefined }
    >

      <SelectTrigger className="w-full">
        <SelectValue placeholder={users === null ? "Cargando..." : "Sin asignar"} />
      </SelectTrigger>

      <SelectContent>
        <SelectGroup>
          <SelectItem value="none">Sin asignar</SelectItem>
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

