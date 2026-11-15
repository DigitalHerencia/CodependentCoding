import { CrmLeadsTemplate } from "@/components/templates/crm-templates";
import { loadCrmLeadsWorkflow } from "@/lib/workflows/crmWorkflows";
import { CrmContactsFeatureClient } from "./crm-contacts-feature.client";

/** Server lead queue: workflow and template with a small client search slot. */
export async function CrmLeadsFeature({ query = "" }: { query?: string }) {
  const view = await loadCrmLeadsWorkflow(query);
  return (
    <CrmLeadsTemplate
      {...view}
      toolbar={<CrmContactsFeatureClient key={query} initialQuery={query} lead />}
    />
  );
}
