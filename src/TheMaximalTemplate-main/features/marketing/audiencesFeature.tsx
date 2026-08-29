import {
  DataTableBlock,
  PageHeaderBlock,
} from "@/components/blocks/application-sections";
import { getAudiences } from "@/lib/fetchers/marketingFetchers";
export async function AudiencesFeature() {
  const audiences = await getAudiences();
  return (
    <div className="space-y-6">
      <PageHeaderBlock eyebrow="Marketing" title="Audiences" />
      <DataTableBlock
        columns={[
          { key: "name", label: "Audience" },
          { key: "status", label: "Status" },
          { key: "updated", label: "Updated" },
        ]}
        rows={audiences.map((audience) => ({
          id: audience.id,
          cells: {
            name: audience.name,
            status: audience.status,
            updated: new Date(audience.updatedAt).toLocaleDateString(),
          },
        }))}
      />
    </div>
  );
}
