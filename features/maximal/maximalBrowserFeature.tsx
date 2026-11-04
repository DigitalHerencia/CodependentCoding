import { MaximalFrame } from "@/components/blocks/maximal-frame";
import { MaximalBrowser } from "@/features/maximal/maximalBrowser.client";
import { getTemplateFiles, getTemplateSource } from "@/lib/content/template";

export async function MaximalBrowserFeature({
  searchParams,
}: {
  searchParams: Promise<{ file?: string | string[] }>;
}) {
  const [{ file }, files] = await Promise.all([
    searchParams,
    getTemplateFiles(),
  ]);
  const active =
    typeof file === "string" && files.includes(file) ? file : "app/layout.tsx";
  const source = await getTemplateSource(active);

  return (
    <MaximalFrame>
      <MaximalBrowser files={files} active={active} source={source} />
    </MaximalFrame>
  );
}
