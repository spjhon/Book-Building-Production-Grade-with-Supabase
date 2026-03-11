"use client";
import { AssigneeSelect } from "@/features/tickets/components/AssigneeSelect";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { use, useRef, useState } from "react";

interface TicketsProps {
  params: Promise<{ tenant: string }>;
}





const CreateTicketPage = ({params}:TicketsProps) => {


  // 1. Inicialización de referencias con tipos de HTML
  const ticketTitleRef = useRef<HTMLInputElement>(null);
  const ticketDescriptionRef = useRef<HTMLTextAreaElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createSupabaseBrowserClient();
  const { tenant } = use(params)
  const [assignee, setAssignee] = useState<string | null>(null);





  async function handleSubmit(event: React.FormEvent<HTMLFormElement>){


    event.preventDefault();
  

    const title = ticketTitleRef.current?.value || "";
    const description = ticketDescriptionRef.current?.value || "";
    

    if (title.trim().length > 4 && description.trim().length > 9) {




const { data: tenantData, error: tenantDataError } = await supabase
        .from("tenants")
        .select("id")
        .eq("domain", tenant)
        .single();


// Manejo de error limpio
      if (tenantDataError) {
        setIsLoading(false);
        alert("No se pudo extraer el id del tenant" + tenantDataError.message);
        
        return; // Detenemos la ejecución aquí
      }

      
      
      // Usamos async/await para manejar la respuesta de forma lineal
      const { data, error } = await supabase
      .from("tickets")
      //ojo, aqui se presenta el error debito a que created_by se va a insertar por medio de un trigger
      .insert({title, description, tenant_id: tenantData.id, assignee } as never)
      .select()
      .single();

      // Manejo de error limpio
      if (error) {
        setIsLoading(false);
        alert("Could not create ticket " + error.message + " "+ error.code);
        console.error("Error detallado:", error.message);
        return; // Detenemos la ejecución aquí
      }


      // Éxito (Si llegamos aquí, es porque no hubo error)
      alert("Successfully created ticket");
      // Aquí puedes limpiar el formulario o redireccionar
    
    }else{
      console.log(tenant)
      alert("A title must have at least 5 chars and a description must at least contain 10");
    }



  }



  return (
    // Contenedor principal con diseño de tarjeta
    <article className="max-w-xl mx-auto mt-10 bg-white shadow-lg border border-gray-200 rounded-2xl p-8 space-y-6">
      <h3 className="text-2xl font-semibold text-gray-900">
        Create a new ticket
      </h3>

      {/* Manejo del formulario */}
      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        {/* Campo de Título */}
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium text-gray-700">Title</label>
          <input
            ref={ticketTitleRef}
            disabled={isLoading}
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
            disabled={isLoading}
            rows={4}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>


        {/* Botón de Envío */}
        <AssigneeSelect tenant={tenant} onValueChanged={(val) => setAssignee(val)}></AssigneeSelect>




        {/* Botón de Envío */}
        <button
          type="submit"
          disabled={isLoading}
          aria-busy={isLoading}
          className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
        >
          Create ticket now
        </button>
      </form>
    </article>
  );
};

export default CreateTicketPage;