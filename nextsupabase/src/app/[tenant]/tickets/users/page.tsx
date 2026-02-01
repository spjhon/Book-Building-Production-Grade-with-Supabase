import { Check, UserX } from "lucide-react";

const users = [
  {
    name: "Harry Green",
    job: "QA Engineer",
    isAvailable: false,
  },
  {
    name: "Trudy Torres",
    job: "Project Manager",
    isAvailable: true,
  },
  {
    name: "Alice Ling",
    job: "Software Engineer",
    isAvailable: false,
  },
];

export default function UserList() {
  return (
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
          {users.map((user) => (
            <tr
              key={user.name}
              className="border-b border-gray-100 hover:bg-gray-50 transition"
            >
              {/* Name */}
              <td className="py-3 px-4 flex items-center gap-2">
                {user.isAvailable ? (
                  <Check className="text-green-500" />
                ) : (
                  <UserX className="text-red-500" />
                )}
                <span className="font-medium">{user.name}</span>
              </td>

              {/* Job */}
              <td className="py-3 px-4 text-gray-700">{user.job}</td>

              {/* Availability Badge */}
              <td className="py-3 px-4 text-center">
                {user.isAvailable ? (
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
