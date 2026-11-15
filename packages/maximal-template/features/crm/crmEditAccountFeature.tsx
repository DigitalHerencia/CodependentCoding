import { loadCrmEditAccountWorkflow } from "@/lib/workflows/crmWorkflows";
import { CrmEditAccountForm } from "./crmEditAccountForm";

/** Server feature loads tenant-authorized Account data for its edit RHF form. */
export async function CrmEditAccountFeature({ accountId }: { accountId: string }) {
  const { account } = await loadCrmEditAccountWorkflow({ accountId });
  return <CrmEditAccountForm account={account} />;
}
