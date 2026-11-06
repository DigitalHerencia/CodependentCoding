import { loadCrmEditContactWorkflow } from "@/lib/workflows/crmWorkflows";
import { NewCrmContactForm } from "./newCrmContactForm";

export async function CrmEditContactFeature({
  contactId,
}: {
  contactId: string;
}) {
  const { contact } = await loadCrmEditContactWorkflow({ contactId });
  return <NewCrmContactForm contact={contact} />;
}
