import { TenantLoadingTemplate } from "@/components/templates/tenant-templates";
import { tenantCopy } from "@/content/tenant";

/** Tenant-only route fallback; the route-group layout supplies the shell. */
export default function TenantLoading() {
  return <TenantLoadingTemplate label={tenantCopy.loadingContent} />;
}
