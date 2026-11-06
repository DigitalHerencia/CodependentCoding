import { DashboardLayout } from "@/components/blocks/shared-blocks";
import { MediaAssetControlsBlock } from "@/components/blocks/social-blocks";
import {
  SocialCalendarContentBlock,
  SocialCalendarToolbarBlock,
  SocialComposePageBlock,
  SocialMediaContentBlock,
  SocialMediaToolbarBlock,
} from "@/components/blocks/social-page-blocks";
import { socialPresentationCopy } from "@/content/social";
import type { ComponentProps } from "react";

export function SocialCalendarTemplate(
  props: ComponentProps<typeof SocialCalendarContentBlock>,
) {
  return (
    <DashboardLayout
      title={socialPresentationCopy.publishingCalendar}
      nav={[]}
      toolbar={<SocialCalendarToolbarBlock {...props} />}
    >
      <SocialCalendarContentBlock {...props} />
    </DashboardLayout>
  );
}
export function SocialComposeTemplate(
  props: ComponentProps<typeof SocialComposePageBlock>,
) {
  return <SocialComposePageBlock {...props} />;
}
export function SocialMediaTemplate(
  props: ComponentProps<typeof SocialMediaContentBlock>,
) {
  return (
    <DashboardLayout
      title={socialPresentationCopy.mediaLibrary}
      nav={[]}
      toolbar={<SocialMediaToolbarBlock {...props} />}
    >
      <SocialMediaContentBlock {...props} />
    </DashboardLayout>
  );
}

export function MediaAssetControlsTemplate(
  props: ComponentProps<typeof MediaAssetControlsBlock>,
) {
  return <MediaAssetControlsBlock {...props} />;
}
