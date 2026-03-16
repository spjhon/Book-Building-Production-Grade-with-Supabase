import { SignUpForm } from "@/features/register/components/SignUpForm";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { TenantId } from "@/types/authTypes";
import { notFound } from "next/navigation";



export default async function Page({params}: {params: Promise<{ tenant: TenantId }>;}) {
  
  //1.
  const { tenant } = await params;

  //2.
  const supabaseAdmin = createSupabaseAdminClient();
  const { error } = await supabaseAdmin
  .from("tenants")
  .select("id")
  .eq("domain", tenant)
  .single();


  //3.
  if (error) notFound();


  //4.
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        {/* 2. Pasamos el tenant al formulario de registro */}
        <SignUpForm tenant={tenant} />
      </div>
    </div>
  );



}