import Link from "next/link";

export default function Home() {
  // Definimos los tenants para iterarlos fácilmente
  const tenants = ["acme", "globex", "initech", "umbrella"];
  
  // En local usamos nuestro dominio base con el puerto
  // En producción podrías cambiar esto por process.env.NEXT_PUBLIC_ROOT_DOMAIN
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN; 

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full max-w-3xl flex-col items-center gap-8 py-32 px-16 bg-white shadow-sm rounded-xl dark:bg-zinc-900">
        
        <h1 className="text-2xl font-bold text-zinc-800 dark:text-white">
          Bienvenido a Mi App SaaS
        </h1>
        
        <p className="text-zinc-500 text-center">
          Selecciona un cliente para entrar a su portal:
        </p>

        <nav className="grid grid-cols-2 gap-4 w-full">
          {tenants.map((tenant) => (
            <Link
              key={tenant}
              href={`http://${tenant}.${rootDomain}/tickets`}
              className="flex items-center justify-center p-4 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 hover:border-zinc-400 transition-all text-zinc-700 font-medium capitalize shadow-sm dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-700"
            >
              Portal {tenant}
            </Link>
          ))}
        </nav>

        <div className="mt-8 text-xs text-zinc-400">
          Dominio raíz: {rootDomain}
        </div>
      </main>
    </div>
  );
}