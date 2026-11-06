import { CrmContactDetailTemplate } from "@/components/templates/crm-templates";
import { loadCrmContactDetailWorkflow } from "@/lib/workflows/crmWorkflows";

export async function CrmContactDetailFeature({
  contactId,
}: {
  contactId: string;
}) {
  const { contact } = await loadCrmContactDetailWorkflow({ contactId });
  return <CrmContactDetailTemplate contact={contact} />;
}
