const rate = (numerator: number, denominator: number) =>
  denominator === 0 ? 0 : numerator / denominator;
export function calculateCampaignMetrics(input: {
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  converted: number;
}) {
  return {
    deliveryRate: rate(input.delivered, input.sent),
    openRate: rate(input.opened, input.delivered),
    clickRate: rate(input.clicked, input.delivered),
    conversionRate: rate(input.converted, input.delivered),
  };
}

