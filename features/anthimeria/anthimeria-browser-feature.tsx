import { AnthimeriaFrame } from "@/components/blocks/anthimeria-frame";
import { AnthimeriaBrowser } from "@/features/anthimeria/anthimeria-browser.client";
import { getTemplateFiles, getTemplateSource } from "@/lib/content/template";
import { getTemplateArchitecture } from "@/lib/content/template-architecture";

export async function AnthimeriaBrowserFeature({
  searchParams,
}: {
  searchParams: Promise<{ file?: string | string[] }>;
}) {
  const [{ file }, files, modules] = await Promise.all([
    searchParams,
    getTemplateFiles(),
    getTemplateArchitecture(),
  ]);
  const active =
    typeof file === "string" && files.includes(file) ? file : "app/layout.tsx";
  const source = await getTemplateSource(active);

  return (
    <AnthimeriaFrame>
      <AnthimeriaBrowser files={files} active={active} source={source} modules={modules} />
    </AnthimeriaFrame>
  );
}
