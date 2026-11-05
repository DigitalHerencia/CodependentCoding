export async function register() {
  const { validateProductionIntegrations } =
    await import("@/lib/integrations/status");
  validateProductionIntegrations();
}
