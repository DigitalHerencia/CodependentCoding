import { updateCrmDealStageWorkflow } from "../../crm/crmWorkflows";
export async function closeDealWorkflow(input: {
  dealId: string;
  outcome: "WON" | "LOST";
  expectedVersion: number;
}) {
  return updateCrmDealStageWorkflow({
    dealId: input.dealId,
    stage: input.outcome,
    expectedVersion: input.expectedVersion,
  });
}
