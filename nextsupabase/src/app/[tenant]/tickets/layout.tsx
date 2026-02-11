import { Navbar } from "@/features/tickets/components/Navbar";
import TenantName from "@/features/tickets/components/TenantName";
import { ReactNode } from "react";

interface TicketsLayoutProps {
  children: ReactNode;
  params: Promise<{ tenant: string }>;
}

export default async function TicketsLayout({children, params}: TicketsLayoutProps) {
  const { tenant } = await params;
  

  return (
    <>
      <section>
        <Navbar tenant = {tenant} />
      </section>

      <section>
        Layout de tickets para tenant: <TenantName tenant = {tenant} />
        {children}
      </section>
    </>
  );
}
