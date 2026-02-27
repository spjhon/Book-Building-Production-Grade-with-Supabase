const { data: tenantID, error: tenantError } = await supabaseAdmin
  .from("tenants")
  .select("id")
  .eq("domain", tenantDomainValidatedInDb)
  .single();