import Loading from "@/app/loading";
import AppLayout from "@/features/tickets/components/AppLayout";
import DataLoaderContext from "@/features/tickets/DataLoaderContex";

import { fetchTenantDataCached } from "@/lib/dbFunctions/fetch_tenant_domain_cached";

import { ReactNode, Suspense } from "react";

interface TicketsLayoutProps {
  children: ReactNode;
  params: Promise<{ tenant: string }>;
}

export default async function TicketsLayout({
  children,
  params,
}: TicketsLayoutProps) {
  const { tenant } = await params;

  const tenantPromise = fetchTenantDataCached(tenant);

  return (
    <Suspense fallback={<Loading />}>
      <DataLoaderContext tenantPromise={tenantPromise}>
        <AppLayout>{children}</AppLayout>
      </DataLoaderContext>
    </Suspense>
  );
}
