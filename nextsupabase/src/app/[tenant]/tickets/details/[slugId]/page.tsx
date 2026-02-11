import TicketComments from "../../../../../features/tickets/components/ticketComment";

export default async function TicketDetailPage({
  params,
}: Readonly<{ params: Promise<{ slugId: string }> }>) {
  const { slugId } = await params;

  return (
    <div className="max-w-3xl mx-auto py-10 space-y-8">
      {/* Title Section */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          Ticket #{slugId}
        </h1>

        <p className="text-gray-500">
          Detailed information, status, and comments for this ticket.
        </p>
      </div>

      {/* Main Card */}
      <article className="bg-white border border-gray-200 shadow-sm rounded-2xl p-8 space-y-6">
        
        {/* Header info */}
        <header className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 text-sm rounded-full bg-green-100 text-green-700 font-semibold">
              ● Open
            </span>

            <time className="text-sm text-gray-500">
              December 10th 2025
            </time>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-900">
              Ticket title should be here
            </h2>
            <p className="text-gray-500 mt-1">
              Created by{" "}
              <strong className="text-gray-700">AuthorName</strong>
            </p>
          </div>
        </header>

        <hr className="border-gray-200" />

        {/* Body */}
        <section className="text-gray-700 text-[15px] leading-relaxed">
          Some details about the ticket should be here.  
          You can expand this section with additional description, metadata, 
          reproduction steps, or attachments.
        </section>

        <hr className="border-gray-200" />

        {/* Comments / Related components */}
        <TicketComments />
      </article>
    </div>
  );
}
