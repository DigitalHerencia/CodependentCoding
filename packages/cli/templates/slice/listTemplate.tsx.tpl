// Why: Template: lays out the {{entity}} list from DTOs; the toolbar is a slot.
import Link from "next/link";
import type { ReactNode } from "react";
import type { {{Entity}}DTO } from "@/types/{{module}}Types";
import { DashboardLayout } from "@/components/blocks/dashboard-layout";

export function {{Module}}{{Entities}}Template({
  {{entities}},
  toolbar,
}: {
  {{entities}}: readonly {{Entity}}DTO[];
  toolbar: ReactNode;
}) {
  return (
    <DashboardLayout title="{{labelPlural}}" nav={[]} toolbar={toolbar}>
      <ul className="grid gap-4 lg:grid-cols-2">
        {{{entities}}.map(({{entity}}) => (
          <li key={{{entity}}.id} className="space-y-3 surface-card p-5">
            <Link
              className="type-title hover:underline"
              href={`/{{route}}/${{{entity}}.id}`}
            >
              {{{titleExpr}}}
            </Link>
            <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
{{summaryRows}}
            </dl>
            <Link className="type-link" href={`/{{route}}/${{{entity}}.id}/edit`}>
              Edit {{labelLower}}
            </Link>
          </li>
        ))}
      </ul>
      {{{entities}}.length === 0 && (
        <p className="surface-inset p-6">
          No matching {{labelPluralLower}}. Create one to get started.
        </p>
      )}
    </DashboardLayout>
  );
}
