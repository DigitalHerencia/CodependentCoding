import { calculateCampaignMetrics } from "../../marketing/logic/calculate-campaign-metrics.logic";

export async function calculateCampaignMetricsWorkflow(input: {
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  converted: number;
}) {
  return calculateCampaignMetrics(input);
}
