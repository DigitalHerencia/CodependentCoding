import {
  AiConfigurationBlock,
  AiHeaderBlock,
  AiHistoryBlock,
  AiOutcomesBlock,
  AiOutputBlock,
  AiOverviewMetricsBlock,
  AiPaginationBlock,
  AiPromptBlock,
  AiSubmitBlock,
  AiSummaryBlock,
  AiUsageRecordsBlock,
} from "@/components/blocks/ai-blocks";
import type {
  AiGenerationFormProps,
  AiOverviewView,
  AiUsageView,
} from "@/types/aiTypes";

/** Overview layout composes real metrics, outcomes, history and activity within the tenant shell. */
export function AiOverviewTemplate(view: AiOverviewView) {
  return (
    <section className="flex flex-col gap-6 p-4 md:p-6">
      <AiHeaderBlock route="overview" scope={view.scope} />
      <AiOverviewMetricsBlock {...view} />
      <div className="grid gap-6 xl:grid-cols-2">
        <AiOutcomesBlock {...view} />
        <AiSummaryBlock summary={view.summary} />
      </div>
      <AiHistoryBlock generations={view.generations} />
      <AiPaginationBlock
        page={view.generations.page}
        hasNextPage={view.generations.hasNextPage}
      />
      <AiUsageRecordsBlock records={view.activity} activity />
    </section>
  );
}

/** The playground has one page layout; the owning RHF form supplies bindings and submission handling. */
export function AiPlaygroundTemplate(props: AiGenerationFormProps) {
  return (
    <section className="flex flex-col gap-6 p-4 md:p-6">
      <AiHeaderBlock route="playground" />
      <AiConfigurationBlock configuration={props.configuration} />
      <div className="grid items-start gap-6 lg:grid-cols-2">
        <form
          noValidate
          onSubmit={props.onSubmit}
          className="flex flex-col gap-5"
          aria-busy={props.pending}
        >
          <AiPromptBlock {...props} />
          <AiSubmitBlock {...props} />
        </form>
        <AiOutputBlock pending={props.pending} output={props.output} />
      </div>
    </section>
  );
}

/** Usage layout presents bounded ledger records alongside database aggregates and their explicit scope. */
export function AiUsageTemplate(view: AiUsageView) {
  return (
    <section className="flex flex-col gap-6 p-4 md:p-6">
      <AiHeaderBlock route="usage" scope={view.scope} />
      <AiSummaryBlock summary={view.summary} />
      <AiUsageRecordsBlock records={view.usage.items} />
      <AiPaginationBlock
        page={view.usage.page}
        hasNextPage={view.usage.hasNextPage}
        usage
      />
    </section>
  );
}
