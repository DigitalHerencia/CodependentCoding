import {
  SupportUnavailableTemplate,
  SupportAnalyticsTemplate,
} from "@/components/templates/support-templates";
import { loadSupportAnalyticsWorkflow } from "@/lib/workflows/supportWorkflows";

/** Load the authorized analytics view. */
export async function SupportAnalyticsFeature() {
  const result = await loadSupportAnalyticsWorkflow();
  if (!result.ok)
    return (
      <SupportUnavailableTemplate page="analytics" code={result.error.code} />
    );

  return <SupportAnalyticsTemplate {...result.data} />;
}
