import { calculatePipelineValue } from "../../crm/logic/calculate-pipeline-value.logic";
import { getCrmDeals } from "../../fetchers/crmFetchers";
export async function calculatePipelineValueWorkflow(limit = 100) {
  const deals = await getCrmDeals(limit);
  return calculatePipelineValue(deals);
}
