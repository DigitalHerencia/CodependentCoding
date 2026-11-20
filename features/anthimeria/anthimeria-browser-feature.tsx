import { AnthimeriaFrame } from "@/components/blocks/anthimeria-frame";
import { AnthimeriaBrowser } from "@/features/anthimeria/anthimeria-browser.client";
import {
  getArchitectureSources,
  getArchitectureGraph,
} from "@/lib/content/architecture";

export async function AnthimeriaBrowserFeature({
  searchParams,
  sourceId = "website",
}: {
  searchParams: Promise<{ file?: string | string[] }>;
  sourceId?: string;
}) {
  const [{ file }, sources] = await Promise.all([
    searchParams,
    getArchitectureSources(),
  ]);
  const graph = await getArchitectureGraph(sourceId, "containment", "", 0);

  return (
    <AnthimeriaFrame>
      <AnthimeriaBrowser
        sources={sources}
        initialGraph={graph}
        initialFile={typeof file === "string" ? file : ""}
      />
    </AnthimeriaFrame>
  );
}
