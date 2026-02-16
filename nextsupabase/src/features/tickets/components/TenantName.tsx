import { createSupabaseServerClient } from "@/lib/supabase/server";


type tenantProp = {
    tenant: string
}
export default async function TenantName({ tenant }: tenantProp) {

const tenantName = tenant;

const supabase = await createSupabaseServerClient();

const {data, error} = await supabase.rpc("get_tenant_name", {p_tenant_id: "11111111-1111-1111-1111-111111111111"})

console.log (data)

return <strong>{tenantName}</strong>

}