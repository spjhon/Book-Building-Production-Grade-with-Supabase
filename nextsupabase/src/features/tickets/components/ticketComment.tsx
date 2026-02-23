"use client";

import { useRef } from "react";


const comments = [
  {
    author: "Dave",
    date: "2027-01-01",
    content: "This is a comment from Dave",
  },
  {
    author: "Alice",
    date: "2027-01-02",
    content: "This is a comment from Alice",
  },
];


/**
 * TicketComments (Client Component)
 * --------------------------------
 * Componente encargado de gestionar la visualización y el envío de comentarios dentro 
 * de la vista de un ticket. Utiliza un estado estático para prototipado inicial.
 *
 * * * Datos:
 * - 'comments': Matriz de objetos estáticos que simulan la estructura de datos (autor, fecha, contenido).
 * - 'commentRef': Referencia de React (useRef) para acceder directamente al nodo del DOM de la caja de texto.
 * * * Flujo:
 * 1. Define una lista predeterminada de comentarios para la representación visual inicial.
 * 2. Implementa un formulario de captura que utiliza 'useRef' para gestionar la entrada del usuario sin re-renderizados innecesarios.
 * 3. Gestiona el envío mediante un manejador (onSubmit) que previene el refresco de página y muestra una alerta pendiente de implementación.
 * 4. Itera sobre la colección de comentarios para renderizar artículos individuales con metadatos (autor y fecha).
 * 5. Utiliza etiquetas semánticas de HTML5 (footer, section, article, time) para mejorar la accesibilidad y el SEO.
 * * * @return JSX.Element - Una sección de comentarios con formulario de entrada y listado histórico.
 */

const TicketComments = () => {
  const commentRef = useRef(null);
  return (
    <footer>
      <h4>Comments</h4>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          alert("TODO: Add comment");
        }}
      >
        <textarea ref={commentRef} placeholder="Add a comment" />
        <button type="submit">Add comment</button>
      </form>

      {/* <section>We have {comments.length} comments.</section> */}
      <section>
        {comments.map((comment) => (
          <article key={comment.date}>
            <strong>{comment.author} </strong>
            <time>{comment.date}</time>
            <p>{comment.content}</p>
          </article>
        ))}
      </section>
    </footer>
  );
};

export default TicketComments;
