import {
  SocialCalendarBlock,
  SocialComposeBlock,
  SocialMediaBlock,
  SocialMediaControlsBlock,
  SocialFieldBlock,
  SocialTargetsBlock,
  SocialSubmitBlock,
  SocialVariantReviewBlock,
} from "@/components/blocks/social-blocks";
import type {
  SocialCalendarProps,
  SocialComposeProps,
  SocialMediaProps,
  SocialMediaControlsProps,
  SocialFieldProps,
  SocialTargetsProps,
  SocialSubmitProps,
  SocialVariantReviewProps,
} from "@/types/socialTypes";

/** Compose the calendar page inside the tenant shell. */
export function SocialCalendarTemplate(props: SocialCalendarProps) {
  return <SocialCalendarBlock {...props} />;
}

/** Compose the browser-owned disclosure for a single revision. */
export function SocialVariantReviewTemplate(props: SocialVariantReviewProps) {
  return <SocialVariantReviewBlock {...props} />;
}
/** Compose the draft form and per-account previews. */
export function SocialComposeTemplate(props: SocialComposeProps) {
  return <SocialComposeBlock {...props} />;
}
/** Compose authorized media discovery and existing uploads controls. */
export function SocialMediaTemplate(props: SocialMediaProps) {
  return <SocialMediaBlock {...props} />;
}
/** Compose one browser-owned artifact interaction. */
export function SocialMediaControlsTemplate(props: SocialMediaControlsProps) {
  return <SocialMediaControlsBlock {...props} />;
}
/** Compose a field whose bindings and validation belong to RHF. */
export function SocialFieldTemplate(props: SocialFieldProps) {
  return <SocialFieldBlock {...props} />;
}
/** Compose account target selection controlled by RHF. */
export function SocialTargetsTemplate(props: SocialTargetsProps) {
  return <SocialTargetsBlock {...props} />;
}
/** Compose submission status for a distinct persisted command. */
export function SocialSubmitTemplate(props: SocialSubmitProps) {
  return <SocialSubmitBlock {...props} />;
}
