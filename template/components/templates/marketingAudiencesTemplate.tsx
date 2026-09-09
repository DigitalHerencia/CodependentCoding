import Link from "next/link";
import type { ReactNode } from "react";
import type { AudienceDTO } from "@/types/marketingTypes";
import { DashboardLayout } from "@/components/blocks/dashboard-layout";
import { audienceFormSchema } from "@/schemas/marketingSchemas";
export function MarketingAudiencesTemplate({
  audiences,
  toolbar,
}: {
  audiences: AudienceDTO[];
  toolbar: ReactNode;
}) {
  return (
    <DashboardLayout title="Audience segments" nav={[]} toolbar={toolbar}>
      <div className="grid gap-4 md:grid-cols-2">
        {audiences.map((audience) => {
          const parsed = audienceFormSchema.safeParse(audience);
          return (
            <article key={audience.id} className="space-y-4 surface-card p-5">
              <Link
                className="type-title hover:underline"
                href={`/marketing/audiences/${audience.id}`}
              >
                {audience.name}
              </Link>
              <p>{audience.status}</p>
              <p>
                Contact relationship:{" "}
                {parsed.success
                  ? parsed.data.definition.rules[0]!.value
                  : "Custom rules"}
              </p>
              <Link
                className="type-link"
                href={`/marketing/audiences/${audience.id}/edit`}
              >
                Edit segment
              </Link>
            </article>
          );
        })}
      </div>
      {!audiences.length && <p>No matching audiences.</p>}
    </DashboardLayout>
  );
}
