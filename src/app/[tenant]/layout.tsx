import { Button } from "@/components/ui/button";
import AuthListener from "@/features/auth/components/AuthListener";

import Link from "next/link";




export default function TenantLayout({children,}: Readonly<{children: React.ReactNode}>) {


  

  return (
    // 2. Usamos un fragmento <> o un <section> / <main> 
    <main className="bg-[#f2f2f2]">

      <div className="w-[80%] mx-auto">
        
      <Button asChild variant="outline" className="font-bold mt-5">
        <Link prefetch={true} href="https://tiendadelamujer.com/" >
          Menu Tenants
        </Link>
      </Button>
      
      </div>

      {/* El AuthListener es clave aquí para vigilar la sesión del tenant específico */}
      <AuthListener/>
        {children}
    </main>
  );
}