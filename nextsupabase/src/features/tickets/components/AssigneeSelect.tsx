

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
} from "@/components/ui/select"; // Ajusta el path según tu estructura

import { ServiceUser } from "./CreateTicketForm";

export function AssigneeSelect({ onValueChanged, ServiceUsers, defaultValue }: { 
  onValueChanged: (val: string | null) => void;
  ServiceUsers: ServiceUser[];
  defaultValue?: string | null; 
}) {


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

