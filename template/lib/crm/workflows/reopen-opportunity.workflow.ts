import { updateCrmDealStageWorkflow } from "../../crm/crmWorkflows";

export async function reopenOpportunityWorkflow(input: {
  dealId: string;
  expectedVersion: number;
}) {
  return updateCrmDealStageWorkflow({
    ...input,
    stage: "QUALIFIED",
  });
}
