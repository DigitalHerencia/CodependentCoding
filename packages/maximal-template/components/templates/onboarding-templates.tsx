/** Modal profile presentation composes owned blocks without persistence decisions. */
import {
  OnboardingModalBlock,
  OnboardingFieldsBlock,
  OnboardingFormBlock,
  OnboardingResultBlock,
} from "@/components/blocks/onboarding-blocks";
import type { OnboardingTemplateProps } from "@/types/authTypes";
/** New and edit forms share one profile presentation contract. */
export function OnboardingTemplate(props: OnboardingTemplateProps) {
  return (
    <OnboardingModalBlock {...props}>
      <OnboardingFormBlock {...props}>
        <OnboardingFieldsBlock fields={props.fields} />
        <OnboardingResultBlock {...props} />
      </OnboardingFormBlock>
    </OnboardingModalBlock>
  );
}
