// Why: Server feature: loads one {{entity}} (null means not in this org, so 404).
import { notFound } from "next/navigation";
import { {{Module}}{{Entity}}DetailTemplate } from "@/components/templates/{{module}}{{Entity}}DetailTemplate";
import { get{{Entity}} } from "@/lib/fetchers/{{module}}Fetchers";
export async function {{Entity}}Feature({ {{param}} }: { {{param}}: string }) {
  const {{entity}} = await get{{Entity}}({{param}});
  if (!{{entity}}) notFound();
  return <{{Module}}{{Entity}}DetailTemplate {{entity}}={{{entity}}} />;
}
