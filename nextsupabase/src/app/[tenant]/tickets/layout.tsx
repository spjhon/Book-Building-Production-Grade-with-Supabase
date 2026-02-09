import { Navbar } from "@/components/Navbar";
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
        Layout de tickets para tenant: {tenant}
        {children}
      </section>
    </>
  );
}
