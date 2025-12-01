/** 
interface NewTicketPageProps {
    props: string;
}
*/

"use client";
import { useRef } from "react";

const CreateTicketPage = () => {
  const ticketTitleRef = useRef(null);
  const ticketDescriptionRef = useRef(null);

  return (
    <article className="max-w-xl mx-auto mt-10 bg-white shadow-lg border border-gray-200 rounded-2xl p-8 space-y-6">
      <h3 className="text-2xl font-semibold text-gray-900">
        Create a new ticket
      </h3>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          alert("TODO: Add a new ticket");
        }}
        className="space-y-5"
      >
        {/* Title */}
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium text-gray-700">Title</label>
          <input
            ref={ticketTitleRef}
            placeholder="Add a title"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Description */}
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium text-gray-700">Description</label>
          <textarea
            ref={ticketDescriptionRef}
            placeholder="Add a comment"
            rows={4}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>

        {/* Submit button */}
        <button
          type="submit"
          className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
        >
          Create ticket now
        </button>
      </form>
    </article>
  );
};

export default CreateTicketPage;

