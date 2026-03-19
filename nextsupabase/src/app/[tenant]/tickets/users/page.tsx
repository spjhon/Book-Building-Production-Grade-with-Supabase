import { AvailabilitySelect } from "@/features/tickets/components/AvailabilitySelect";
import { fetchTenantDataCached } from "@/lib/dbFunctions/fetch_tenant_domain_cached";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Check, UserX } from "lucide-react";
import { redirect } from 'next/navigation'



export default async function UserList({params}: Readonly<{ params: Promise<{tenant: string }>}>) {




  const supabase = await createSupabaseServerClient();
  const{tenant} = await params




  const {data: tenantData, error: errorFetchingTenantData} = await fetchTenantDataCached(tenant)

  if (!tenantData || errorFetchingTenantData) {
    redirect("/error?type=No fue posible obtener informacion del tenant")
  }




  const { data: users, error: usersError } = await supabase.rpc("get_service_users_with_tenant", {
    target_tenant_id: tenantData.id
  });

  if (usersError || !users) {
    redirect("/error?type=No fue posible obtener informacion del tenant: " + usersError.message)
  }


  //obtencion del usuario actual
  const { data: sessionInfo, error: sessionInforError } = await supabase.auth.getClaims(); //se obtiene el claims osea el usuario

    if (sessionInforError || !sessionInfo) {
    redirect("/error?type=No fue posible obtener informacion del tenant" )
  }

  

  const currentAuthId = sessionInfo?.claims?.sub;

  
  return (
    // 1. Contenedor con scroll horizontal para dispositivos móviles
    <div className="max-w-xl mx-auto">
    <div className="mt-20 mx-5 overflow-x-auto border border-black rounded-xs shadow-sm bg-white">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="text-sm font-bold bg-gray-50 border-b border-gray-200">
            <th className="py-3 px-4  ">Nombre</th>
            <th className="py-3 px-4  ">Trabajo</th>
            <th className="py-3 px-4  text-center">Estado</th>
          </tr>
        </thead>

        <tbody className="text-gray-800">
          {/* 2. Mapeo de la lista de usuarios */}
          {users.map((user) => (
            
            <tr
              key={user.id}
              className="border-b border-gray-100 hover:bg-gray-50 transition"
            >
              {/* 3. Renderizado condicional de iconos y nombres */}
              <td className="py-3 px-4 flex items-center gap-2">
                {user.is_available ? (
                  <Check className="text-green-500" />
                ) : (
                  <UserX className="text-red-500" />
                )}
                <span className="font-medium">{user.full_name}</span>
              </td>

              {/* Información del cargo */}
              <td className="py-3 px-4 text-gray-700">{user.job_title}</td>

              {/* 4. Badges de estado dinámicos */}
              <td className="py-3 px-4 text-center">
                

                {currentAuthId === user.auth_user_id?   
                  <AvailabilitySelect 
                    
                    user_id={user.id}
                    is_available={user.is_available} 
                  /> 
                  :
                  user.is_available ? (
                    <span className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-full font-semibold">
                      Disponible
                    </span>
                  ) : (
                    <span className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded-full font-semibold">
                      No disponible
                    </span>
                  )

                }
                


              </td>
            </tr>
          ))}
        </tbody>
      </table>

      

    </div>
    </div>
  );
}