/**
 * Tipo para el mapeo de dominios a identificadores de tenant.
 * Se define como un objeto donde las llaves son los hostnames (dominios)
 * y los valores son los slugs internos del tenant.
 */
export type TenantMapping = {
  [hostname: string]: string;
};

export const TENANT_MAP: TenantMapping = {
  "acme.miapp": "acme",
  "globex.miapp": "globex",
  "initech.miapp": "initech",
  "umbrella.miapp": "umbrella",
}