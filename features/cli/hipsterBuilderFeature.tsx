import { HipsterFrame } from "@/components/blocks/hipster-frame";
import { HipsterBuilder } from "@/features/cli/hipsterBuilder.client";
import { getCliManifest } from "@/lib/content/cli";

export async function HipsterBuilderFeature() {
  return (
    <HipsterFrame>
      <HipsterBuilder manifest={await getCliManifest()} />
    </HipsterFrame>
  );
}
