/** Presentation for the authenticated organization switcher. */
import { OrganizationSwitcherBlock } from "@/components/blocks/authz-blocks";
import type { OrganizationSwitcherBlockProps } from "@/types/authzTypes";

/** Compose the organization switcher's presentation for its client feature. */
export function OrganizationSwitcherTemplate(
  props: OrganizationSwitcherBlockProps,
) {
  return <OrganizationSwitcherBlock {...props} />;
}
