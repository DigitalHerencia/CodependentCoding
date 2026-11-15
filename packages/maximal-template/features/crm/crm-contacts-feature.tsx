import { CrmContactsTemplate } from "@/components/templates/crm-templates";
import { loadCrmContactsWorkflow } from "@/lib/workflows/crmWorkflows";
import { CrmContactsFeatureClient } from "./crm-contacts-feature.client";

/** Server contact directory: workflow and template; client owns search interaction. */
export async function CrmContactsFeature({ query = "" }: { query?: string }) {
  const view = await loadCrmContactsWorkflow(query);
  return (
    <CrmContactsTemplate
      {...view}
      toolbar={<CrmContactsFeatureClient key={query} initialQuery={query} />}
    />
  );
}
