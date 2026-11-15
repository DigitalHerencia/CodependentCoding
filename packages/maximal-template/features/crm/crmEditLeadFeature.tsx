import { loadCrmEditLeadWorkflow } from "@/lib/workflows/crmWorkflows";
import { CrmEditLeadForm } from "./crmEditLeadForm";

/** Server feature loads tenant-authorized Lead data for its edit RHF form. */
export async function CrmEditLeadFeature({ leadId }: { leadId: string }) {
  const { contact } = await loadCrmEditLeadWorkflow({ leadId });
  return <CrmEditLeadForm contact={contact} />;
}
