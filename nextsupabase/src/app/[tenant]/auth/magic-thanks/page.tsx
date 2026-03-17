import { urlPath } from "@/utils/url-helpers";
import Link from "next/link";
import { Mail, CheckCircle2 } from "lucide-react";

export const revalidate = 3600; // Cachea la página por 1 hora en el CDN

export default async function MagicLinkSuccessPage({params}: {params: Promise<{ tenant: string }>}) {
 
  const { tenant } = await params;
  
  

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="mx-auto flex w-full max-w-sm flex-col items-center space-y-6 text-center border border-black rounded-xs p-5 sm:p-20">
        
        {/* Icono decorativo de éxito */}
        <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
          <Mail className="h-10 w-10 text-primary" />
          <div className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-background border-4 border-background">
            <CheckCircle2 className="h-6 w-6 text-green-500" />
          </div>
        </div>

        {/* Título y Mensaje */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Magia en camino
          </h1>
          <p className="text-muted-foreground leading-relaxed">
           Revisa tu bandeja de entrada. Hemos enviado un enlace mágico para que inicies sesión sin complicaciones.
          </p>
        </div>

        {/* Botón de acción */}
        <Link
          href={urlPath("/", tenant)}
          className="inline-flex h-10 w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          Volver al inicio
        </Link>

        <p className="text-xs text-muted-foreground">
          ¿No recibiste el correo? Revisa tu carpeta de spam.
        </p>
      </div>
    </div>
  );
}