import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Check, UserX } from "lucide-react";



export default async function UserList({params}: Readonly<{ params: Promise<{tenant: string }>}>) {




const supabase = await createSupabaseServerClient();
const{tenant} = await params






  const { data: tenantData, error: tenantError } = await supabase
  .from("tenants")
  .select("id")
  .eq("domain", tenant)
  .single();

  if (tenantError || !tenantData) {
    alert("Error: Tenant no válido.");
    return;
  }








const { data: users, error: usersError } = await supabase.rpc("get_service_users_with_tenant", {
  target_tenant_id: tenantData.id
});

if (usersError || !users) {
        alert(`Error: no se puedo traer a la lista de users:  ${usersError.message}`);
        return;
      }

console.log(users)


  return (
    // 1. Contenedor con scroll horizontal para dispositivos móviles
    <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm bg-white">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="text-sm text-gray-600 bg-gray-50 border-b border-gray-200">
            <th className="py-3 px-4 font-medium">Name</th>
            <th className="py-3 px-4 font-medium">Job</th>
            <th className="py-3 px-4 font-medium text-center">Status</th>
          </tr>
        </thead>

        <tbody className="text-gray-800">
          {/* 2. Mapeo de la lista de usuarios */}
          {users.map((user) => (
            <tr
              key={user.full_name}
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
                {user.is_available ? (
                  <span className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-full font-semibold">
                    Available
                  </span>
                ) : (
                  <span className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded-full font-semibold">
                    Unavailable
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}