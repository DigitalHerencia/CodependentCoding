import { CrmLeadDetailTemplate } from "@/components/templates/crm-templates";
import { loadCrmLeadDetailWorkflow } from "@/lib/workflows/crmWorkflows";

export async function CrmLeadDetailFeature({ leadId }: { leadId: string }) {
  const { contact } = await loadCrmLeadDetailWorkflow({ leadId });
  return <CrmLeadDetailTemplate contact={contact} />;
}
