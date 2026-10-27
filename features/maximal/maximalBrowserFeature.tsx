import { MaximalFrame } from "@/components/blocks/maximal-frame";
import { MaximalBrowser } from "@/features/maximal/maximalBrowser.client";
import { getTemplateFiles } from "@/lib/fetchers/templateFetchers";

export async function MaximalBrowserFeature() {
  return (
    <MaximalFrame>
      <MaximalBrowser files={await getTemplateFiles()} />
    </MaximalFrame>
  );
}
