"use client";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { useEffect, useRef, useState } from "react";


function getRandomHexString() {
return Math.random().toString(16).slice(2);
}


const getFormattedDate = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  
  return `${year}${month}${day}${hours}${minutes}`;
};





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
  tenant_id: string;
};

const TicketComments = ({ticket_id, comments, tenant_id}: TicketCommentsProps) => {


  const supabaseBrowser = createSupabaseBrowserClient()
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [commentsState, setComments] = useState<TicketComment[]>(comments || []);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileList, setFileList] = useState<FileList | null>(null);



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
    .subscribe((status) => console.log('connection status', status))


    return () => {subscription.unsubscribe();} //supabaseBrowser.removeChannel(channel);

  }, [supabaseBrowser, ticket_id])





  let uploadedFiles: { path: string }[] = [];



 
  async function handleOnChange (event: React.ChangeEvent<HTMLInputElement>){
    setFileList(event.target.files);
  }




  async function handleSubmit (event: React.FormEvent<HTMLFormElement>) {

    event.preventDefault();
    alert("TODO: Add comment");

    const comment_text = textareaRef.current?.value.trim();
    if (!comment_text) return alert("Please enter a comment");

    setIsSubmitting(true);

    if (fileList && fileList.length > 0) {
      // Ahora TypeScript sabe que si llega aquí, fileList no es null
      console.log("Archivos listos para subir:", fileList.length);
    }

    
    try {

      
      //Intento de subida de archivos si es que los hay
      if (fileList && fileList.length > 0) {
        const uploadPromises = Array.from(fileList).map(async (file) => {

          const filePath = `${tenant_id}/${ticket_id}/${getFormattedDate()}/${getRandomHexString()}_${file.name}`;

          const { data, error } = await supabaseBrowser.storage
          .from("comments-attachments")
          .upload(filePath, file);
        
          if (error) {console.log(error.message); throw error};
          
          return { path: data.path };

        });

        //este codigo es para decir que se va a esperar a que el codigo de arriba se ejecute antes de continuar
        uploadedFiles = await Promise.all(uploadPromises);
      }


      //Intento de creacion de ticket con una asercion, lo voy a dejar asi
      const { error } = await supabaseBrowser
      .from("comments")
      .insert({
        ticket_id,
        comment_text
        // Nota: No enviamos tenant_id, created_by ni author_name.
        // Los triggers se encargan de eso automáticamente.
      } as never);


      if (error) throw error;


      // Limpiar el textarea solo si la inserción fue exitosa
      if (textareaRef.current) {
        textareaRef.current.value = "";
        setFileList(null);
      }


    } catch (err: unknown) {


      if (uploadedFiles.length > 0) {
        const pathsToDelete = uploadedFiles.map(f => f.path);
        await supabaseBrowser.storage
          .from("comments-attachments")
          .remove(pathsToDelete);
        
        const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred creating user";
        console.log(errorMessage);
      }

      alert("Error al guardar el comentario o la subida de archivos. Se han limpiado los archivos temporales." + err);


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

        <label htmlFor="file">
          <input type="file" id="file" name="file" multiple ref={fileInputRef} onChange={handleOnChange} />
        </label>

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
