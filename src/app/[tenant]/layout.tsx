import { Button } from "@/components/ui/button";
import AuthListener from "@/features/auth/components/AuthListener";
import { headers } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";



export default async function TenantLayout({children, params,}: Readonly<{children: React.ReactNode;params: Promise<{ tenant: string }>;}>) {

  // 1. Resolvemos el tenant de los params
  const { tenant } = await params;
  const headerList = await headers();
  //Extraemos el tenant que fue leido del proxy
  const tenantFromMiddleware = headerList.get("x-tenant");



// Si el tenant de la URL no coincide con el que validó el Middleware, algo anda mal.
  if (!tenantFromMiddleware || tenantFromMiddleware !== tenant) {
    notFound(); 
  }

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
      <AuthListener tenant={tenant} />
        {children}
    </main>
  );
}