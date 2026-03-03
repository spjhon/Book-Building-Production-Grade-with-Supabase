

type tenantProp = {
  tenant: string;
};



export default async function TenantName({ tenant }: tenantProp) {
  const tenantName = tenant;
  return <strong>{tenantName}</strong>;
}
