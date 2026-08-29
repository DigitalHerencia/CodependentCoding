import {
  MetricGridBlock,
  PageHeaderBlock,
} from "@/components/blocks/application-sections";
import { getCrmDeals } from "@/lib/fetchers/crmFetchers";

export async function CrmAnalyticsFeature() {
  const deals = await getCrmDeals(100);
  const pipeline = deals.reduce((total, deal) => total + Number(deal.value), 0);
  const weighted = deals.reduce(
    (total, deal) => total + (Number(deal.value) * deal.probability) / 100,
    0,
  );
  return (
    <div className="space-y-6">
      <PageHeaderBlock
        eyebrow="CRM"
        title="Pipeline analytics"
        description="Metrics derive only from authorized, tenant-scoped deal DTOs."
      />
      <MetricGridBlock
        metrics={[
          {
            label: "Open deals",
            value: String(
              deals.filter((deal) => !["WON", "LOST"].includes(deal.stage))
                .length,
            ),
          },
          {
            label: "Pipeline value",
            value: pipeline.toLocaleString(undefined, {
              maximumFractionDigits: 2,
            }),
          },
          {
            label: "Weighted value",
            value: weighted.toLocaleString(undefined, {
              maximumFractionDigits: 2,
            }),
          },
          {
            label: "Won",
            value: String(deals.filter((deal) => deal.stage === "WON").length),
          },
        ]}
      />
    </div>
  );
}
