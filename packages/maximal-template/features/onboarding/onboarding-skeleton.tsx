import { FormLoadingTemplate } from "@/components/templates/shared-templates";

// Sized like the onboarding card it stands in for, inside the auth shell.
export function OnboardingSkeleton() {
  return <FormLoadingTemplate fields={1} />;
}
