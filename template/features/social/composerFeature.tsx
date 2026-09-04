import { SocialComposeTemplate } from "@/components/templates/socialComposeTemplate";
import { ComposerFeatureClient } from "@/features/social/composerFeature.client";
import { getSocialWorkspaceWorkflow } from "@/lib/workflows/socialWorkflows";

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

export async function ComposerFeature() {
  const workspace = await getSocialWorkspaceWorkflow();
  const records = workspace.accounts;
  const rows = records.map((record, index) => {
    const item = record as object;
    const id = displayValue(
      item,
      ["id", "resource", "number"],
      String(index + 1),
    );
    return {
      id,
      href: undefined,
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
    <SocialComposeTemplate
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
      toolbar={<ComposerFeatureClient />}
    />
  );
}
