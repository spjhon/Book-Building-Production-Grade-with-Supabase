import { TicketList } from "@/features/tickets/components/TicketList";
import { TicketFilters } from "@/features/tickets/components/TicketsFilter";

export interface DummyTicket {
  id: number;
  title: string;
  status: string;
  author: string;
}

interface TicketsPageProps {
  params: Promise<{ tenant: string }>;
  searchParams: Promise<{ page: string }> 
}



export default async function TicketsPage({ params, searchParams }: TicketsPageProps) {

  // 1.
  const { tenant } = await params;
  const{page} = await searchParams || 1;




  

  return (
    
    // 2.
    <div className="max-w-5xl mx-auto py-10 space-y-8">
      
      {/* Header & Actions */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          Tickets
        </h1>

        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow transition">
          + Create Ticket
        </button>
      </div>

      <p className="text-gray-600">
        Manage all your tickets, track progress, and view details.
      </p>

      {/* 3. & 4. Ticket List Container */}
      <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6">
        <TicketFilters tenant={tenant}/>
        <TicketList tenant={tenant}  page={page}/>
      </div>
    </div>
  );
};