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





  



 
  async function handleOnChange (event: React.ChangeEvent<HTMLInputElement>){
    setFileList(event.target.files);
  }




  async function handleSubmit (event: React.FormEvent<HTMLFormElement>) {

    event.preventDefault();
    alert("TODO: Add comment");

    let uploadedFiles: { path: string }[] = [];
    let commentIDforDeleteInCaseOfError;

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

          const { data, error: errorUploadingFiles } = await supabaseBrowser.storage
          .from("comments-attachments")
          .upload(filePath, file);
        
          if (errorUploadingFiles) {throw {
            contexto: "Error al insertar archivos en el bucket", // Tu mensaje personalizado
            supabaseError: errorUploadingFiles // El objeto completo de Supabase
          }};
          
          return { path: data.path };

        });

        //este codigo es para decir que se va a esperar a que el codigo de arriba se ejecute antes de continuar
        uploadedFiles = await Promise.all(uploadPromises);
      }


      //Intento de creacion de ticket con una asercion, lo voy a dejar asi
      const { data: commentData, error: errorCreatingComment } = await supabaseBrowser
      .from("comments")
      .insert({
        ticket_id,
        comment_text
        // Nota: No enviamos tenant_id, created_by ni author_name.
        // Los triggers se encargan de eso automáticamente.
      } as never)
      .select()
      .single()


      if (errorCreatingComment) throw {
        contexto: "Error al insertar en la tabla de comentarios", // Tu mensaje personalizado
        supabaseError: errorCreatingComment // El objeto completo de Supabase
      };

      
      commentIDforDeleteInCaseOfError = commentData.id;



      if (uploadedFiles.length > 0) {
        const { error: attachError } = await supabaseBrowser
          .from("comment_attachments")
          .insert(
            uploadedFiles.map((file) => ({
              comment_id: commentData.id, // ID del comentario recién creado
              file_path: file.path,
              tenant_id: tenant_id,
            }))
          );

        if (attachError) {throw {
          contexto: "Error al crear la relacion en la tabla comment_attachments", // Tu mensaje personalizado
          supabaseError: attachError // El objeto completo de Supabase
        };
      }}






      // Limpiar el textarea solo si la inserción fue exitosa
      if (textareaRef.current) {
        textareaRef.current.value = "";
      }

      setFileList(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }


    } catch (err: unknown) {

     // console.log(err instanceof Error ? err.message : "An unexpected error occurred")
      console.log(err);
      console.log("esta es la variable commentIDforDeleteInCaseOfError: " + commentIDforDeleteInCaseOfError)
      

      //borra el comentario en caso de error, OJO SI FALLA POR RLS, NO VA A MOSTRAR ERROR, EL ERROR DE RLS SOLO APARECE EN INSERT
      if (commentIDforDeleteInCaseOfError) {
        const {data: dataDeletingComment, error: errorDeletingComment} = await supabaseBrowser
          .from("comments")
          .delete()
          .eq("id", commentIDforDeleteInCaseOfError);
        
        console.log("se activo el dataDeletingComment: " + dataDeletingComment)
        if(dataDeletingComment) console.log("Se borro el comentario correctamente");
        if(errorDeletingComment){console.log(errorDeletingComment + "Error borrando el comentario")}
      }

      //borra los atachment en caso de error
      if (uploadedFiles.length > 0) {
        const pathsToDelete = uploadedFiles.map(f => f.path);
        const{data: deletingAttachmentsData, error: errorDeletingAttachments} = await supabaseBrowser.storage
          .from("comments-attachments")
          .remove(pathsToDelete);
        
        if(deletingAttachmentsData) console.log("se borraron los attachments correctamente");
        if(errorDeletingAttachments) console.log("error en el borrado de attachments" + errorDeletingAttachments)
        
      }
 
      

      
      alert("Error al guardar el comentario o la subida de archivos. Se han limpiado los archivos temporales.");


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
