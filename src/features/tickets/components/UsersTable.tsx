"use client";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Check, UserX, Loader2 } from "lucide-react";
import {  useRouter } from "next/navigation";
import { AvailabilitySelect } from "./AvailabilitySelect";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { TicketsContext } from "../DataLoaderContex";

export default function UsersTable() {
  const t = useTranslations("UsersTable");
  
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  // 1. Obtenemos el tenantId del contexto (como en TicketList)
  const { TicketContextValue } = useContext(TicketsContext);
  const tenantId = TicketContextValue.tenantObject?.id;

  // 2. QUERY PARA LOS USUARIOS
  const { 
    data: usersData = [], 
    isLoading: isLoadingUsers,
    isError: isErrorUsers 
  } = useQuery({
    queryKey: ["service-users", tenantId],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_service_users_with_tenant", {
        target_tenant_id: tenantId,
      });
      if (error) throw error;
      return data;
    },
    enabled: !!tenantId, // Solo corre si tenemos el ID
    staleTime: 1000 * 60 * 5,
  });

  // 3. QUERY PARA LA SESIÓN ACTUAL (Auth claims)
  const { data: currentAuthId } = useQuery({
    queryKey: ["current-session-id"],
    queryFn: async () => {
      const { data, error } = await supabase.auth.getClaims();
      if (error) throw error;
      return data?.claims?.sub;
    },
    staleTime: Infinity, // El ID de usuario no cambia durante la sesión
  });

  // Manejo de errores de navegación
  if (isErrorUsers) {
    router.push("/error?type=No fue posible obtener informacion");
    return null;
  }

  const isLoading = isLoadingUsers || !tenantId;

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="text-sm font-bold bg-gray-50 border-b border-gray-200">
            <th className="py-3 px-4">{t("table_header_name")}</th>
            <th className="py-3 px-4">{t("table_header_job")}</th>
            <th className="py-3 px-4 text-center">
              {t("table_header_status")}
            </th>
          </tr>
        </thead>

        <tbody className="text-gray-800 relative">
          {isLoading ? (
            <tr>
              <td colSpan={3} className="py-10 text-center">
                <div className="flex flex-col items-center justify-center gap-2 text-gray-400">
                  <Loader2 className="animate-spin w-8 h-8 text-blue-500" />
                  <p className="text-sm font-medium">{t("searching_operators")}</p>
                </div>
              </td>
            </tr>
          ) : usersData.length === 0 ? (
            <tr>
              <td colSpan={3} className="py-10 text-center text-gray-500">
                {t("no_users_found")}
              </td>
            </tr>
          ) : (
            usersData.map((user: any) => (
              <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                <td className="py-3 px-4 flex items-center gap-2">
                  {user.is_available ? (
                    <Check className="text-green-500 h-4 w-4" />
                  ) : (
                    <UserX className="text-red-500 h-4 w-4" />
                  )}
                  <span className="font-medium">{user.full_name}</span>
                </td>

                <td className="py-3 px-4 text-gray-700">{user.job_title}</td>

                <td className="py-3 px-4 text-center">
                  {currentAuthId === user.auth_user_id ? (
                    <AvailabilitySelect
                      user_id={user.id}
                      is_available={user.is_available}
                      // Nota: Aquí lo ideal sería usar queryClient.invalidateQueries(["service-users"]) 
                      // dentro de AvailabilitySelect en lugar de pasar setUsersData
                    />
                  ) : user.is_available ? (
                    <span className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-full font-semibold">
                      {t("status_available")}
                    </span>
                  ) : (
                    <span className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded-full font-semibold">
                      {t("status_unavailable")}
                    </span>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}