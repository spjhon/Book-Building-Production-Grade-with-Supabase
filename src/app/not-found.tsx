import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[100dvh] bg-background px-4 text-center">
      
      <h1 className="text-[8rem] md:text-[10rem] font-extrabold leading-none text-primary tracking-tighter">
        404
      </h1>
      
      {/* Español */}
      <h2 className="mt-4 text-2xl md:text-3xl font-bold text-foreground">
        Página no encontrada
      </h2>
      
      <p className="mt-2 text-lg text-muted-foreground max-w-[500px]">
        Lo sentimos, el subdominio al que intentas acceder no existe o no está registrado en nuestro sistema.
      </p>

      {/* Inglés */}
      <h2 className="mt-6 text-xl md:text-2xl font-semibold text-foreground/80">
        Page not found
      </h2>
      
      <p className="mt-2 mb-8 text-base text-muted-foreground max-w-[500px]">
        Sorry, the subdomain you are trying to access does not exist or is not registered in our system.
      </p>

      <Button asChild size="lg" className="font-bold">
        <Link href="/" prefetch={false}>
          Volver al inicio / Back to home
        </Link>
      </Button>

      <div className="absolute inset-0 -z-10 h-full w-full bg-white [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#63e_100%)] opacity-20"></div>
    </div>
  );
}