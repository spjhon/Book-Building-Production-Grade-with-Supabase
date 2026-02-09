import { createSupabaseServerClient } from "@/lib/supabase/server";
import { buildUrl } from "@/utils/url-helpers";
import { NextResponse } from "next/server";



export async function GET(request: Request, {params}: { params: { tenant: string }} ) {
  const supabase = createSupabaseServerClient();
  await (await supabase).auth.signOut();
  return NextResponse.redirect(buildUrl("/", params.tenant, request));
}
