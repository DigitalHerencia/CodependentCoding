import {
  DataTableBlock,
  PageHeaderBlock,
} from "@/components/blocks/application-sections";
import { getAdminRecordSummary } from "@/lib/fetchers/adminFetchers";

// Features orchestrate blocks and lib helpers; they never import raw UI primitives.
export async function RecordsFeature() {
  const records = await getAdminRecordSummary();
  return (
    <div className="space-y-6">
      <PageHeaderBlock
        eyebrow="Administration"
        title="Record inventory"
        description="Read-only tenant-scoped counts; this is not an unrestricted generic data editor."
      />
      <DataTableBlock
        columns={[
          { key: "resource", label: "Resource" },
          { key: "count", label: "Records" },
        ]}
        rows={records.map((record) => ({
          id: record.resource,
          cells: {
            resource: record.resource,
            count: record.count.toLocaleString(),
          },
        }))}
      />
    </div>
  );
}
