import { CrmLeadDetailTemplate } from "@/components/templates/crm-templates";
import { loadCrmLeadDetailWorkflow } from "@/lib/workflows/crmWorkflows";
import { CrmLeadDetailFeatureClient } from "./crmLeadDetailFeatureClient";

/** Lead detail server feature keeps qualification behind a Server Function. */
export async function CrmLeadDetailFeature({ leadId }: { leadId: string }) {
  const { contact, qualifyLead } = await loadCrmLeadDetailWorkflow({ leadId });
  return (
    <CrmLeadDetailTemplate
      contact={contact}
      qualifyControl={<CrmLeadDetailFeatureClient contactId={contact.id} qualifyLead={qualifyLead} />}
    />
  );
}
