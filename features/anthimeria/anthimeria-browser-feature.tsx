import { AnthimeriaFrame } from "@/components/blocks/anthimeria-frame";
import { AnthimeriaBrowser } from "@/features/anthimeria/anthimeria-browser.client";
import { getTemplateFiles, getTemplateSource } from "@/lib/content/template";

export async function AnthimeriaBrowserFeature({
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
    <AnthimeriaFrame>
      <AnthimeriaBrowser files={files} active={active} source={source} />
    </AnthimeriaFrame>
  );
}
