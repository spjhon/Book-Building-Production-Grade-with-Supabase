import Link from "next/link";
import { DummyTicket } from "@/app/[tenant]/tickets/page";

interface TicketListProps {
  tickets: DummyTicket[];
  tenant: string
}

const statusStyles: Record<string, string> = {
  "Not started": "bg-gray-200 text-gray-700",
  "In progress": "bg-blue-100 text-blue-700",
  "Done": "bg-green-100 text-green-700",
};

export function TicketList({ tickets, tenant }: TicketListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="text-sm text-gray-600 border-b border-gray-200">
            <th className="py-3 px-2 font-medium">ID</th>
            <th className="py-3 px-2 font-medium">Title</th>
            <th className="py-3 px-2 font-medium">Status</th>
          </tr>
        </thead>

        <tbody className="text-gray-800">
          {tickets.map((ticket) => (
            <tr
              key={ticket.id}
              className="border-b border-gray-100 hover:bg-gray-50 transition"
            >
              {/* ID */}
              <td className="py-3 px-2 text-gray-500 font-medium">
                #{ticket.id}
              </td>

              {/* Title */}
              <td className="py-3 px-2">
                <Link
                  href={`/${tenant}/tickets/details/${ticket.id}`}
                  className="text-blue-600 hover:underline font-semibold"
                >
                  {ticket.title}
                </Link>
                <div className="text-xs text-gray-500 mt-1">
                  by {ticket.author}
                </div>
              </td>

              {/* Status */}
              <td className="py-3 px-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    statusStyles[ticket.status] || "bg-gray-200 text-gray-700"
                  }`}
                >
                  {ticket.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
