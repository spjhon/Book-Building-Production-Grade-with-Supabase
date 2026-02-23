"use client";
import { useRef } from "react";

/**
 * Create Ticket Page (Client Page Component)
 * ------------------------------------
 * Esta página proporciona la interfaz de usuario para la creación de nuevos tickets.
 * Utiliza un enfoque de "uncontrolled components" mediante React Refs para capturar 
 * la entrada de datos de forma eficiente.
 * * * Flujo:
 * 1. Inicializa referencias (`useRef`) para el título y la descripción, evitando re-renders innecesarios.
 * 2. Estructura un formulario responsivo con validaciones visuales mediante Tailwind CSS.
 * 3. Gestiona el evento 'onSubmit' previniendo el comportamiento por defecto del navegador.
 * 4. Captura los datos ingresados para su posterior envío a la API o servidor (pendiente de implementación).
 * * * @return JSX.Element - Un formulario de creación estilizado contenido en un artículo semántico.
 */
const CreateTicketPage = () => {
  // 1. Inicialización de referencias para el DOM
  const ticketTitleRef = useRef(null);
  const ticketDescriptionRef = useRef(null);

  return (
    // 2. Contenedor principal con diseño de tarjeta
    <article className="max-w-xl mx-auto mt-10 bg-white shadow-lg border border-gray-200 rounded-2xl p-8 space-y-6">
      <h3 className="text-2xl font-semibold text-gray-900">
        Create a new ticket
      </h3>

      {/* 3. Manejo del formulario */}
      <form
        onSubmit={(event) => {
          event.preventDefault();
          // 4. Punto de extensión para la lógica de negocio
          alert("TODO: Add a new ticket");
        }}
        className="space-y-5"
      >
        {/* Campo de Título */}
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium text-gray-700">Title</label>
          <input
            ref={ticketTitleRef}
            placeholder="Add a title"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Campo de Descripción */}
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium text-gray-700">Description</label>
          <textarea
            ref={ticketDescriptionRef}
            placeholder="Add a comment"
            rows={4}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>

        {/* Botón de Envío */}
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