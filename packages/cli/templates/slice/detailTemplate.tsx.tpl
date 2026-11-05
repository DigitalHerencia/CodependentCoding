// Why: Template: lays out one {{entity}} from its DTO.
import { {{entity}}Copy as copy } from "@/content/{{module}}";
import Link from "next/link";
import type { {{Entity}}DTO } from "@/types/{{module}}Types";
import {
  DashboardLayout,
  DashboardPanel,
} from "@/components/blocks/shared-blocks";

export function {{Module}}{{Entity}}DetailTemplate({ {{entity}} }: { {{entity}}: {{Entity}}DTO }) {
  return (
    <DashboardLayout
      title={{{titleExpr}}}
      nav={[]}
      toolbar={
        <Link className="type-link" href={`/{{route}}/${{{entity}}.id}/edit`}>
          {copy.edit}
        </Link>
      }
    >
      <DashboardPanel title={copy.details}>
        <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2">
{{detailRows}}
          <dt>{copy.updated}</dt>
          <dd>{{{entity}}.updatedAt.slice(0, 16).replace("T", " ")}</dd>
        </dl>
      </DashboardPanel>
      <Link className="type-link" href="/{{route}}">
        {copy.all}
      </Link>
    </DashboardLayout>
  );
}
