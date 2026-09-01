import { getCrmDeals } from "@/lib/fetchers/crmFetchers";

export async function calculatePipelineValueWorkflow(limit = 100) {
  const deals = await getCrmDeals(limit);
  return calculatePipelineValue(deals);
}
