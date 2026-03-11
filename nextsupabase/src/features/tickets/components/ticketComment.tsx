"use client";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { useEffect, useRef, useState } from "react";




type TicketComment = {
  
    id: string,
    tenant_id: string,
    ticket_id: string,
    created_at: string,
    created_by: string,
    updated_at: string,
    author_name: string,
    comment_text: string
}

type TicketCommentsProps = {
  ticket_id: string;
  comments: TicketComment[];
};

const TicketComments = ({ticket_id, comments}: TicketCommentsProps) => {


  const supabaseBrowser = createSupabaseBrowserClient()
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [commentsState, setComments] = useState<TicketComment[]>(comments || []);


  // Sincronizar estado si las props cambian al navegar
  useEffect(() => {
    setComments(comments || []);
  }, [comments]);



  useEffect(() => {

    const subscription = supabaseBrowser
    .channel("realtime_comments")
    .on("postgres_changes", {event: "INSERT", schema: "public", table: "comments", filter: `ticket_id=eq.${ticket_id}`}, (payload) => {
      console.log("se recibio el event correctamente: ")
      console.log(payload.eventType)
      
      setComments((prev) => [...prev, payload.new as TicketComment]) })
    .subscribe()

    console.log(subscription)

    return () => {subscription.unsubscribe();} //supabaseBrowser.removeChannel(channel);

  }, [supabaseBrowser, ticket_id])




  async function handleSubmit (event: React.FormEvent<HTMLFormElement>) {

    event.preventDefault();
    alert("TODO: Add comment");

    const comment_text = textareaRef.current?.value.trim();
    if (!comment_text) return alert("Please enter a comment");

    setIsSubmitting(true);

    
    try {


      const { error } = await supabaseBrowser
        .from("comments")
        .insert({
          ticket_id,
          comment_text,
          // Nota: No enviamos tenant_id, created_by ni author_name.
          // Los triggers se encargan de eso automáticamente.
        } as never);

      if (error) throw error;

      // Limpiar el textarea solo si la inserción fue exitosa
      if (textareaRef.current) {
        textareaRef.current.value = "";
      }


    } catch (err) {
      console.error("Error al guardar comentario:", err);
      alert("No se pudo guardar el comentario.");
    } finally {
      setIsSubmitting(false);
    }

  }



  return (
    <footer>
      <h4>Comments ({commentsState.length})</h4>

      <form
        onSubmit={handleSubmit}
      >
        <textarea ref={textareaRef} placeholder="Add a comment" disabled={isSubmitting}/>
        <button type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving..." : "Add comment"}</button>
      </form>

      

      {/* <section>We have {comments.length} comments.</section> */}
      <section>
        {commentsState.map((comment) => (
          <article key={comment.id}>
            <strong>{comment.author_name} </strong>
            <time>{new Date(comment.created_at).toLocaleString("en-US")}</time>
            <p>{comment.comment_text}</p>
          </article>
        ))}
      </section>
    </footer>
  );
};

export default TicketComments;
