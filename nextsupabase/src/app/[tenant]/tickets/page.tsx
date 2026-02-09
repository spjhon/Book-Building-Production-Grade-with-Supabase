import { TicketList } from "@/app/[tenant]/tickets/_components/TicketList";

export interface DummyTicket {
  id: number;
  title: string;
  status: string;
  author: string;
}


interface TicketsPageProps {
  params: Promise<{ tenant: string }>;
}


export const dummyTickets: DummyTicket[] = [
  {
    id: 1,
    title: "Write Supabase Book",
    status: "Not started",
    author: "Chayan",
  },
  {
    id: 2,
    title: "Read more Packt Books",
    status: "In progress",
    author: "David",
  },
  {
    id: 3,
    title: "Make videos for the YouTube Channel",
    status: "Done",
    author: "David",
  },
];

export default async function TicketsPage ({params}: TicketsPageProps) {


const { tenant } = await params;


  return (
    <div className="max-w-5xl mx-auto py-10 space-y-8">
      
      {/* Header */}
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

      {/* Ticket List */}
      <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6">
        <TicketList tickets={dummyTickets} tenant ={tenant}/>
      </div>
    </div>
  );
};


















/** 
interface TicketsProps {
    props: string;
}

const TicketsPage = (props: TicketsProps) => {
  return(
  <div>
    Pagina principal de tickets.
  </div>
)};

export default TicketsPage
*/