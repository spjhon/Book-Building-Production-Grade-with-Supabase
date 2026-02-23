import { Check, UserX } from "lucide-react";

/**
 * User List Component  (Server Page Component)
 * -------------------
 * Este componente se encarga de listar usuarios y sus estados de disponibilidad
 * en un formato de tabla estructurada y responsiva.
 * * * Datos:
 * - Actualmente utiliza una constante estática 'users' para definir los perfiles.
 * - Cada usuario contiene: nombre, cargo (job) y estado de disponibilidad (isAvailable).
 * * * Flujo:
 * 1. Itera sobre el arreglo de usuarios mediante el método '.map()'.
 * 2. Utiliza renderizado condicional para mostrar iconos de 'Lucide React' (Check/UserX) 
 * según la disponibilidad.
 * 3. Aplica estilos dinámicos de Tailwind CSS para generar "badges" de colores 
 * (verde para disponible, rojo para no disponible).
 * 4. Implementa efectos de hover en las filas para mejorar la experiencia de usuario (UX).
 * * * @return JSX.Element - Una tabla estilizada con la lista de miembros del equipo.
 */
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
              key={user.name}
              className="border-b border-gray-100 hover:bg-gray-50 transition"
            >
              {/* 3. Renderizado condicional de iconos y nombres */}
              <td className="py-3 px-4 flex items-center gap-2">
                {user.isAvailable ? (
                  <Check className="text-green-500" />
                ) : (
                  <UserX className="text-red-500" />
                )}
                <span className="font-medium">{user.name}</span>
              </td>

              {/* Información del cargo */}
              <td className="py-3 px-4 text-gray-700">{user.job}</td>

              {/* 4. Badges de estado dinámicos */}
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