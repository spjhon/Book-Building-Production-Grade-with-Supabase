"use client";

import { useContext } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Loader2, Inbox } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getTicketsAction } from "@/lib/dbFunctions/fetch_tickets_with_comments";
import { useTranslations } from 'next-intl';
import { TicketsContext } from "../DataLoaderContex";
import { useQuery } from "@tanstack/react-query"; // 1. Importamos useQuery

const statusStyles: Record<string, string> = {
  open: "bg-slate-100 text-slate-700 border-slate-200",
  in_progress: "bg-blue-100 text-blue-700 border-blue-200",
  done: "bg-emerald-100 text-emerald-700 border-emerald-200",
  cancelled: "bg-red-100 text-red-700 border-red-200",
  information_missing: "bg-amber-100 text-amber-700 border-amber-200",
};

export function TicketList() {
  const t = useTranslations("TicketList");
  const { TicketContextValue } = useContext(TicketsContext);
  const tenantId = TicketContextValue.tenantObject.id;

  const searchParams = useSearchParams();
  const page = searchParams.get("page") || "1";
  const search = searchParams.get("search") || "";
  const searchValue = search.trim();
  const pageSanitazed = Math.max(1, Number(page) || 1);

  // 2. CONFIGURACIÓN DE TANSTACK QUERY
  const { 
    data: fetchedTicketsState, 
    isLoading, 
    isFetching, // Útil para mostrar un mini-spinner de "sincronizando"
    isError 
  } = useQuery({
    // La clave depende de tenantId, página y búsqueda. 
    // Si algo de esto cambia, TanStack dispara el fetch automáticamente.
    queryKey: ["tickets", tenantId, pageSanitazed, searchValue],
    queryFn: () => getTicketsAction({
      tenantId,
      page: pageSanitazed,
      search: searchValue,
    }),
    enabled: !!tenantId, // Solo se ejecuta si ya tenemos el tenantId del context
    staleTime: 1000 * 60 * 5, // 5 minutos de caché "fresco"
  });

  const getHref = (p: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", p.toString());
    return `?${params.toString()}`;
  };

  // 3. MANEJO DE ERRORES (Opcional pero recomendado)
  if (isError) return <div className="p-4 text-red-500 text-center">Error al cargar tickets.</div>;

  return (
    <div className="space-y-4">
      {/* Indicador de "Fetching" en segundo plano (opcional) */}
      <div className="flex justify-end h-2">
        {isFetching && !isLoading && <span className="text-[10px] text-blue-400 animate-pulse">Sincronizando...</span>}
      </div>

      <div className="overflow-x-auto border rounded-xl bg-white shadow-sm">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="text-sm text-gray-600 bg-gray-50 border-b border-gray-200">
              <th className="py-3 px-4 font-medium">{t("table_header_id")}</th>
              <th className="py-3 px-4 font-medium">{t("table_header_title")}</th>
              <th className="py-3 px-4 font-medium">{t("table_header_status")}</th>
            </tr>
          </thead>
          <tbody className="text-gray-800">
            {isLoading ? (
              <tr>
                <td colSpan={3} className="py-10">
                  <div className="flex flex-col items-center gap-2 text-gray-400">
                    <Loader2 className="animate-spin w-6 h-6 text-blue-500" />
                    <p className="text-sm">{t("loading_tickets")}</p>
                  </div>
                </td>
              </tr>
            ) : fetchedTicketsState?.data?.tickets.length === 0 ? (
              <tr>
                <td colSpan={3} className="py-20 text-center">
                  <div className="flex flex-col items-center text-gray-400 gap-2">
                    <Inbox className="w-8 h-8" />
                    <p className="text-sm">{t("no_tickets_found")}</p>
                  </div>
                </td>
              </tr>
            ) : (
              fetchedTicketsState?.data?.tickets.map((ticket) => (
                <tr key={ticket.id} className="border-b border-gray-100 hover:bg-gray-50 transition group">
                  <td className="py-3 px-4 text-gray-500 font-medium">#{ticket.ticket_number}</td>
                  <td className="py-3 px-4">
                    <Link
                      
                      href={`/tickets/details/${ticket.ticket_number}`}
                      className="text-blue-600 hover:underline font-semibold block"
                    >
                      {ticket.title}
                    </Link>
                    <span className="text-xs text-gray-400">
                      {t("by")} {ticket.creator?.full_name}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <Badge
                      variant="outline"
                      className={`capitalize ${statusStyles[ticket.status] || "bg-gray-100"}`}
                    >
                      {ticket.status.replace("_", " ")}
                    </Badge>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between px-2">
        <div className="text-sm text-gray-500">
          Total: {fetchedTicketsState?.data?.count || 0}
        </div>
        <div className="flex gap-2">
          {pageSanitazed > 1 && !isLoading && (
            <Link
              href={getHref(pageSanitazed - 1)}
              className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition text-sm"
            >
              ← {t("pagination_previous")}
            </Link>
          )}
          {fetchedTicketsState?.data?.hasMore && !isLoading && (
            <Link
              href={getHref(pageSanitazed + 1)}
              className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition text-sm"
            >
              {t("pagination_next")} →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}