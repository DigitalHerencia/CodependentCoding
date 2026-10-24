// Why: Server feature: loads the {{entity}} (null means not in this org, so 404) and reuses the form.
import { notFound } from "next/navigation";
import { get{{Entity}} } from "@/lib/fetchers/{{module}}Fetchers";
import { {{Entity}}NewForm } from "./{{entity}}NewForm";
export async function {{Entity}}EditFeature({ {{param}} }: { {{param}}: string }) {
  const {{entity}} = await get{{Entity}}({{param}});
  if (!{{entity}}) notFound();
  return <{{Entity}}NewForm {{entity}}={{{entity}}} />;
}
