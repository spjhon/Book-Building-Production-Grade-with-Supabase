


import Link from "next/link";
;

//import { createSupabaseBrowserClient } from "@/lib/supabase/client";
//import { useEffect } from "react";
//import { useSearchParams } from "next/navigation";

export default async function Home() {

  /**
useEffect(() => {
const supabase = createSupabaseBrowserClient();
supabase.storage.listBuckets().then((result) =>{console.log("Bucket List", result)});
}, []);
 */

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black">
        
        Este es el landing page
        ve a login para entrar 
        <Link href={"/auth/login"}>Login</Link>
      </main>
    </div>
  );
}
