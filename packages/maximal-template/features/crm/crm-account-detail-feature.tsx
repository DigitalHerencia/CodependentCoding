import { CrmAccountDetailTemplate } from "@/components/templates/crm-templates";
import { loadCrmAccountDetailWorkflow } from "@/lib/workflows/crmWorkflows";

export async function CrmAccountDetailFeature({
  accountId,
}: {
  accountId: string;
}) {
  const { account } = await loadCrmAccountDetailWorkflow({ accountId });
  return <CrmAccountDetailTemplate account={account} />;
}
