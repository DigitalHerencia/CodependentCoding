export async function register() {
  const { validateProductionIntegrations } =
    await import("@/lib/modules/status");
  validateProductionIntegrations();
}
