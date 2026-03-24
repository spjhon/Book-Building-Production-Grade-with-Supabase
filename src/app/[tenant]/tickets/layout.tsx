

import { Navbar } from "@/features/tickets/components/NavBar/Navbar";
import { BackgroundValidator} from "@/features/tickets/components/PollComponent";
import { ReactNode, Suspense } from "react";

interface TicketsLayoutProps {
  children: ReactNode;
  
}



export default function TicketsLayout({ children}: TicketsLayoutProps) {



  return (
    <>
      <section>
        <Navbar></Navbar>
      </section>

      <section className="min-h-screen">
        <BackgroundValidator></BackgroundValidator>
        <Suspense fallback={<p className="py-10 text-center">Cargando tickets...</p>}>
        {children}
        </Suspense>
      </section>
    </>
  );
}
