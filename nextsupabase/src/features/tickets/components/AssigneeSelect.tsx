"use client";


import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
} from "@/components/ui/select"; // Ajusta el path según tu estructura
import { createSupabaseBrowserClient } from "@/lib/supabase/client";


interface User {
  id: string;
  full_name: string | null;
}


export function AssigneeSelect({ tenant_id, onValueChanged, defaultValue }: { 
  tenant_id: string | null; 
  onValueChanged: (val: string | null) => void;
  defaultValue?: string | null;
}) {


  const [users, setUsers] = useState<User[] | null>(null);
  const supabase = createSupabaseBrowserClient();
  const tenant_id_string = tenant_id || "";



  useEffect(() => {
    supabase
      .rpc("get_service_users_with_tenant", { target_tenant_id: tenant_id_string })
      .then(({ data }) => {
        setUsers(data ?? []);
      });
  }, [tenant_id_string, supabase]);

 
console.log(users)


  return (
    <Select 
      onValueChange={(val) => onValueChanged(val === "none" ? null : val)}
      defaultValue={defaultValue ?? "none"}
      disabled={users === null}
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

