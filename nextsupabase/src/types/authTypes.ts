

// El tenant de la app, (acme, initech, otros...)
export type TenantId = string & { readonly __brand: unique symbol };
