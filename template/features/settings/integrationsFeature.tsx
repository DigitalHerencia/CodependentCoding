import {
  IntegrationStatusGridBlock,
  PageHeaderBlock,
} from "@/components/blocks/application-sections";
import { getIntegrationStatuses } from "@/lib/fetchers/integrationFetchers";

export function IntegrationsFeature() {
  const integrations = getIntegrationStatuses();
  return (
    <>
      <PageHeaderBlock
        eyebrow="Safe provider inspection"
        title="Integration status"
        description="Configuration is derived from required environment keys. Secret values are never exposed and no live action runs from this page."
      />
      <IntegrationStatusGridBlock integrations={integrations} />
    </>
  );
}
