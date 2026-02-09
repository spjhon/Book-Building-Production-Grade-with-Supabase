
import { LoginForm } from "@/app/[tenant]/auth/login/_components/LoginForm";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { permanentRedirect } from "next/navigation";

//import { createSupabaseBrowserClient } from "@/lib/supabase/client";
//import { useEffect } from "react";
//import { useSearchParams } from "next/navigation";

export default async function Login({searchParams, params}: {searchParams: Promise<{[key: string]: string | string[] | undefined}>, params: Promise<{ tenant: string }>}) {

const { tenant } = await params;

  /**
useEffect(() => {
const supabase = createSupabaseBrowserClient();
supabase.storage.listBuckets().then((result) =>{console.log("Bucket List", result)});
}, []);
 */


const {magicLink} = await searchParams

const wantsMagicLink = magicLink === "yes";

console.log("quiere magic link?: "+wantsMagicLink)

const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getClaims();

  if (data?.claims) {
    permanentRedirect(`/${tenant}/tickets`)
  }  


  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black">
        
        <LoginForm isPasswordLogin={!wantsMagicLink} tenant={tenant}></LoginForm>
      </main>
    </div>
  );
}
