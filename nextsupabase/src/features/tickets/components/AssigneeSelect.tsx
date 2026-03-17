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
import { fetchTenantDataCached } from "@/lib/dbFunctions/fetch_tenant_domain_cached";


interface User {
  id: string;
  full_name: string | null;
}


export function AssigneeSelect({ tenant, onValueChanged, defaultValue }: { 
  tenant: string; 
  onValueChanged: (val: string | null) => void;
  defaultValue?: string | null;
}) {


  const [users, setUsers] = useState<User[] | null>(null);
  const supabase = createSupabaseBrowserClient();
  



  useEffect(() => {
    const fetchData = async () => {
    try {

      const {data: tenantData, error: errorFetchingTenantData} = await fetchTenantDataCached(tenant);

      if (!tenantData || errorFetchingTenantData){
        throw new Error;
      }

      const { data, error } = await supabase.rpc("get_service_users_with_tenant", { target_tenant_id: tenantData.id });

      if (error) {
        console.error("Error detallado del RPC:", error);
      } else {
        setUsers(data ?? []);
      }
    } catch (e) {
      console.error("Error inesperado en el useEffect:", e);
    }
  };

  fetchData();
  }, [tenant, supabase]);

 



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

