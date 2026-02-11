
type tenantProp = {
    tenant: string
}
export default function TenantName({ tenant }: tenantProp) {

const tenantName = "Unknown";

return <strong>{tenantName}</strong>

}