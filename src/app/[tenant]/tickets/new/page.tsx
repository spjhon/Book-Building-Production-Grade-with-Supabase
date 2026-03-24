
import CreateTicketForm, { ServiceUser } from "@/features/tickets/components/CreateTicketForm";
import { fetchTenantDataCached } from "@/lib/dbFunctions/fetch_tenant_domain_cached";
import { fetchServiceUsersCached } from "@/lib/dbFunctions/get_service_users_with_tenant_cached";
import { PostgrestError } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

interface TicketsProps {
  params: Promise<{ tenant: string }>;
}



const CreateTicketPage = async ({params}: TicketsProps) => {

  const { tenant } = await params;
  

  const {data: tenantData, error: fetchingTenantDataError} = await fetchTenantDataCached(tenant)

    // Manejo de error limpio
    if (!tenantData || fetchingTenantDataError){
      redirect(`/error?type=Error trallendo informacion del tenant`);
      
    }




 /**
  const { data: serviceUsersFromSpecificTenant, error: errorUsersFromSpecificTenant } = await supabaseServer.rpc("get_service_users_with_tenant", { target_tenant_id: tenantData.id });

    // Manejo de error limpio
    if (!serviceUsersFromSpecificTenant || errorUsersFromSpecificTenant){
      redirect(`/error?type=Error trallendo informacion del tenant`);
    }
 */


const usersPromise = fetchServiceUsersCached(tenantData.id).then(res => res as { data: ServiceUser[] | null; error: PostgrestError });



  return (
    // Contenedor principal con diseño de tarjeta
    <div className="max-w-xl mx-auto">
    <article className="mt-20 mx-5 bg-white shadow-lg border border-black rounded-xs p-8 ">
      <h3 className="text-2xl font-bold text-gray-900">
        Crear un nuevo ticket
      </h3>

      {/* Manejo del formulario */}
      
      <CreateTicketForm tenant_id={tenantData.id} usersPromise={usersPromise}></CreateTicketForm>
    
    </article>
    </div>
  );
}

export default CreateTicketPage;