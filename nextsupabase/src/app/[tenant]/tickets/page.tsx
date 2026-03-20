import { TicketList } from "@/features/tickets/components/TicketList";
import { TicketFilters } from "@/features/tickets/components/TicketsFilter";
import Link from "next/link";
import { Suspense } from "react";

interface TicketsPageProps {
  params: Promise<{ tenant: string }>;
  searchParams: Promise<{ page: string, search: string }> 
}



export default async function TicketsPage({ params, searchParams}: TicketsPageProps) {

  // 1.
  const { tenant } = await params;
  

  const sParams = await searchParams;
  const page = sParams.page || "1";
  const search = sParams.search || "";




  

  return (
    
    // 2.
    <div className="max-w-300 mx-auto">
    <div className=" mt-20 space-y-8 border border-black rounded-xl p-5 mx-5 self">
      
      {/* Header & Actions */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          Tickets
        </h1>

        <Link href={"/tickets/new"} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow transition">
          + Crear Ticket
        </Link>
      </div>

      <p className="text-gray-600">
        Tickes creados
      </p>

      {/* 3. & 4. Ticket List Container */}
      <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6">
        <TicketFilters />
        <Suspense key={search + page} fallback={<p className="py-10 text-center">Cargando tickets...</p>}>
          <TicketList tenant={tenant} page={page} search={search}/>
        </Suspense>
      </div>
    </div>
    </div>
  );
};