import { SignUpForm } from "@/features/register/components/SignUpForm";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { notFound } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ tenant: string }>;
}) {
  // 1. Resolvemos la promesa de params para obtener el tenant
  const { tenant } = await params;



const supabaseAdmin = createSupabaseAdminClient();
const { data, error } = await supabaseAdmin
.from("tenants")
.select("*")
.eq("domain", tenant)
.single();


if (error) notFound();




  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        {/* 2. Pasamos el tenant al formulario de registro */}
        <SignUpForm tenant={tenant} />
      </div>
    </div>
  );
}