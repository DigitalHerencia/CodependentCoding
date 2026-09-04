import { MyTasksTemplate } from "@/components/templates/myTasksTemplate";
import { MyTasksFeatureClient } from "@/features/projects/myTasksFeature.client";
import { getProjectsDashboardWorkflow } from "@/lib/workflows/projectsWorkflows";

function displayValue(
  record: object,
  keys: readonly string[],
  fallback: string,
) {
  const values = record as Record<string, unknown>;
  for (const key of keys) {
    const value = values[key];
    if (value instanceof Date) return value.toLocaleDateString();
    if (
      typeof value === "string" ||
      typeof value === "number" ||
      typeof value === "bigint"
    ) {
      return String(value);
    }
    if (value && typeof value === "object") {
      const nested = value as Record<string, unknown>;
      const label = nested.displayName ?? nested.name ?? nested.email;
      if (typeof label === "string") return label;
    }
  }
  return fallback;
}

export async function MyTasksFeature() {
  const workspace = await getProjectsDashboardWorkflow();
  const records = workspace.myTasks;
  const rows = records.map((record, index) => {
    const item = record as object;
    const id = displayValue(
      item,
      ["id", "resource", "number"],
      String(index + 1),
    );
    return {
      id,
      href: `${"/my-tasks"}/${id}`,
      cells: {
        name: displayValue(
          item,
          [
            "name",
            "title",
            "subject",
            "resource",
            "invoiceNumber",
            "email",
            "id",
          ],
          id,
        ),
        state: displayValue(
          item,
          ["status", "state", "stage", "role", "count"],
          "ACTIVE",
        ),
        owner: displayValue(
          item,
          [
            "owner",
            "assignee",
            "client",
            "organization",
            "channel",
            "provider",
          ],
          "—",
        ),
        updated: displayValue(
          item,
          ["updatedAt", "createdAt", "dueAt", "publishedAt", "date"],
          "—",
        ),
      },
    };
  });

  return (
    <MyTasksTemplate
      rows={rows}
      stats={[
        {
          label: "Records",
          value: String(rows.length),
          trend: "server workflow",
        },
        {
          label: "Active",
          value: String(
            rows.filter((row) => row.cells.state !== "ARCHIVED").length,
          ),
        },
        { label: "Updated", value: rows[0]?.cells.updated ?? "—" },
        { label: "Source", value: "SERVER" },
      ]}
      toolbar={<MyTasksFeatureClient />}
    />
  );
}
