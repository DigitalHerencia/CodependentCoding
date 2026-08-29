import {
  KanbanBoardBlock,
  PageHeaderBlock,
} from "@/components/blocks/application-sections";
import { getCrmDeals } from "@/lib/fetchers/crmFetchers";

const stages = [
  "LEAD",
  "QUALIFIED",
  "PROPOSAL",
  "NEGOTIATION",
  "WON",
  "LOST",
] as const;

export async function PipelineFeature() {
  const deals = await getCrmDeals(100);
  return (
    <div className="space-y-6">
      <PageHeaderBlock
        eyebrow="CRM"
        title="Pipeline"
        description="Deals are scoped to the active organization before they reach this feature."
      />
      <KanbanBoardBlock
        columns={stages.map((stage) => ({
          id: stage,
          title: stage.replaceAll("_", " "),
          items: deals
            .filter((deal) => deal.stage === stage)
            .map((deal) => ({
              id: deal.id,
              title: deal.name,
              detail: `${deal.currency} ${deal.value} · ${deal.probability}%`,
              href: `/crm/accounts/${deal.account.id}`,
            })),
        }))}
      />
    </div>
  );
}
