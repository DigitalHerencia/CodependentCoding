import { loadCrmEditAccountWorkflow } from "@/lib/workflows/crmWorkflows";
import { NewCrmAccountForm } from "./newCrmAccountForm";

export async function CrmEditAccountFeature({
  accountId,
}: {
  accountId: string;
}) {
  const { account } = await loadCrmEditAccountWorkflow({ accountId });
  return <NewCrmAccountForm account={account} />;
}
