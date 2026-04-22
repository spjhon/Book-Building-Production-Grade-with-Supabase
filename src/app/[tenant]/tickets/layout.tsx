

import Loading from "@/app/loading";
import { Navbar } from "@/features/tickets/components/NavBar/Navbar";
import DataLoaderContext from "@/features/tickets/DataLoaderContex";
import { fetchTenantDataCached } from "@/lib/dbFunctions/fetch_tenant_domain_cached";


import { ReactNode, Suspense } from "react";

interface TicketsLayoutProps {
  children: ReactNode;
  params: Promise<{ tenant: string }>;
  
}



export default async function TicketsLayout({ children, params}: TicketsLayoutProps) {

const { tenant } = await params;


const tenantPromise = fetchTenantDataCached(tenant);


  return (
    <>
      <section>
        <Navbar></Navbar>
      </section>

      <section className="min-h-screen">
        
        <Suspense fallback={<Loading />}>
        <DataLoaderContext tenantPromise={tenantPromise}>
        {children}
        </DataLoaderContext>
        </Suspense>
        
      </section>
    </>
  );
}
