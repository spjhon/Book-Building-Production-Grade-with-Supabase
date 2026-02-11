
type tenantProp = {
    tenant: string
}
export default function TenantName({ tenant }: tenantProp) {

const tenantName = tenant;

return <strong>{tenantName}</strong>

}