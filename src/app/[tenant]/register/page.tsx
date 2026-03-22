import { SignUpForm } from "@/features/register/components/SignUpForm";
import {  fetchTenantDataCached} from "@/lib/dbFunctions/fetch_tenant_domain_cached";
import { redirect } from "next/navigation";



export default async function RegisterPage({params}: {params: Promise<{ tenant: string }>;}) {
  
  
  const { tenant } = await params;

  
  const {data: tenantData, error: errorFetchingTenantData} = await fetchTenantDataCached(tenant)

  if (!tenantData || errorFetchingTenantData) {
    
    // 2. Extraemos el mensaje de forma segura para TypeScript
    const errorMessage = typeof errorFetchingTenantData === "string" 
      ? errorFetchingTenantData 
      : errorFetchingTenantData?.message || "Tenant no encontrado";

    redirect(`/error?type=${encodeURIComponent(errorMessage)}`);
  }

  const tenantDomain  = tenantData.domain
  

  //4.
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        {/* 2. Pasamos el tenant al formulario de registro */}
        <SignUpForm tenant={tenantDomain} />
      </div>
    </div>
  );



}