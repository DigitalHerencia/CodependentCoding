import Link from "next/link";
import type { AudienceDTO } from "@/types/marketingTypes";
import {
  DashboardLayout,
  DashboardPanel,
} from "@/components/blocks/dashboard-layout";
import { audienceFormSchema } from "@/schemas/marketingSchemas";
export function MarketingAudienceDetailTemplate({
  audience,
}: {
  audience: AudienceDTO;
}) {
  const parsed = audienceFormSchema.safeParse(audience);
  return (
    <DashboardLayout
      title={audience.name}
      nav={[]}
      toolbar={
        <Link
          className="type-link"
          href={`/marketing/audiences/${audience.id}/edit`}
        >
          Edit segment
        </Link>
      }
    >
      <DashboardPanel title="Membership rule">
        <p>
          {parsed.success
            ? `Include contacts whose relationship is ${parsed.data.definition.rules[0]!.value}.`
            : "This audience has custom rules that the current editor cannot modify."}
        </p>
        <p className="mt-4">Audience status: {audience.status}</p>
      </DashboardPanel>
    </DashboardLayout>
  );
}
