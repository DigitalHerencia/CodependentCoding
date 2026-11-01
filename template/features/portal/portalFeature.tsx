import { getPortalDocuments } from "@/lib/fetchers/portalFetchers";
import { PortalHomeTemplate } from "@/components/templates/portal-templates";
export async function PortalFeature() {
  return <PortalHomeTemplate documents={await getPortalDocuments()} />;
}
