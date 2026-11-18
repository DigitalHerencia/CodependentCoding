/** PWA install presentation composes its owned block. */
import { PwaInstallBlock } from "@/components/blocks/pwa-blocks";
import type { PwaInstallProps } from "@/types/pwaTypes";
/** Hide unavailable installation controls while retaining the existing iOS instructions. */
export function PwaInstallTemplate(props: PwaInstallProps) {
  return props.canInstall || props.showIosInstructions ? (
    <PwaInstallBlock {...props} />
  ) : null;
}
