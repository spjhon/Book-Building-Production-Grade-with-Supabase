"use client"



import { AssigneeSelect } from "@/features/tickets/components/AssigneeSelect";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { useEffect, useRef, useState } from "react";
import { Database } from "../../../../supabase/types/database.types";

import { refreshData } from "@/lib/server_actions/revalidatePath";
import { useParams } from "next/navigation";
import router from "next/router";
import { fetchServiceUsersCached } from "@/lib/dbFunctions/get_service_users_with_tenant_cached";
import { fetchTenantDataCached } from "@/lib/dbFunctions/fetch_tenant_domain_cached";


export type ServiceUser = Database['public']['Tables']['service_users']['Row'];




export default function CreateTicketForm() {




const { tenant } = useParams();

const [tenantData, setTenantData] = useState<any>(null);
const [usersData, setUsersData] = useState<any>(null);
  const [isLoading2, setIsLoading2] = useState(true);


useEffect(() => {
    async function loadTenantData() {
      try {
        console.log("Cargando información del tenant para:", tenant);
        
        // Llamada a la promesa desde el cliente
        const { data: tenantData, error: errorTenantData } = await fetchTenantDataCached(tenant as string);

        if (errorTenantData || !tenantData) {
          console.error("Error al traer información del tenant:", errorTenantData);
          router.push(`/error?type=Error trayendo informacion del tenant`);
          return;
        }

        setTenantData(tenantData)

        const {data: usersData, error: usersError} = await fetchServiceUsersCached(tenantData.id)

        if (usersError || !usersData) {
          console.error("Error al traer información del tenant:", usersError.message);
          router.push(`/error?type=Error trayendo informacion del tenant`);
          return;
        }


       
        setUsersData(usersData);

      } catch (err) {

        console.error("Error inesperado:", err);
        router.push(`/error?type=Error inesperado en el cliente`);

      } finally {
        setIsLoading(false);
      }


    }

    loadTenantData();
  }, [tenant]); // Solo se ejecuta al montar o si el tenant cambia









 // 1. Inicialización de referencias con tipos de HTML
  const ticketTitleRef = useRef<HTMLInputElement>(null);
  const ticketDescriptionRef = useRef<HTMLTextAreaElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createSupabaseBrowserClient();
  
  const [assignee, setAssignee] = useState<string | null>(null);



  async function handleSubmit(event: React.FormEvent<HTMLFormElement>){

    
    event.preventDefault();
  

    const title = ticketTitleRef.current?.value || "";
    const description = ticketDescriptionRef.current?.value || "";
    

    if (title.trim().length > 4 && description.trim().length > 9) {

      // Usamos async/await para manejar la respuesta de forma lineal
      const {error } = await supabase
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
      // Limpiar referencias manualmente
        if (ticketTitleRef.current) ticketTitleRef.current.value = "";
        if (ticketDescriptionRef.current) ticketDescriptionRef.current.value = "";
        await refreshData('/tickets')
        setAssignee(null); // Resetear el select
        setIsLoading(false);
      
    }else{
      
      alert("A title must have at least 5 chars and a description must at least contain 10");
    }



  }





  return (
    <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        {/* Campo de Título */}
        <div className="flex flex-col space-y-2">
          <label className="">Titulo</label>
          <input
            ref={ticketTitleRef}
            disabled={isLoading}
            placeholder="Escribe un titulo"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Campo de Descripción */}
        <div className="flex flex-col space-y-2">
          <label className="">Descripcion</label>
          <textarea
            ref={ticketDescriptionRef}
            placeholder="Adiciona una descripcion"
            disabled={isLoading}
            rows={4}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>


        {/* Botón de Envío */}
        <div className="flex flex-col space-y-2">
          <label className="">Asignar Usuario</label>
          
          
            <AssigneeSelect 
              users={usersData} 
              onValueChanged={(val) => setAssignee(val)} 
            />
       
          
        </div>



        {/* Botón de Envío */}
        <button
          type="submit"
          disabled={isLoading}
          aria-busy={isLoading}
          className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
        >
          Crear el ticket ahora
        </button>
      </form>
  )
}


