import {
  PwaAccountMenuBlock,
  PwaInstallBlock,
} from "@/components/blocks/pwa-blocks";
import type { ComponentProps } from "react";

export function PwaAccountMenuTemplate(
  props: ComponentProps<typeof PwaAccountMenuBlock>,
) {
  return <PwaAccountMenuBlock {...props} />;
}
export function PwaInstallTemplate(
  props: ComponentProps<typeof PwaInstallBlock>,
) {
  return props.canInstall || props.showIosInstructions ? (
    <PwaInstallBlock {...props} />
  ) : null;
}
