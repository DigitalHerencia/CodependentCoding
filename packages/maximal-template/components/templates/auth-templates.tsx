import {
  AuthErrorBlock,
  AuthFormBlock,
  AuthFormPanel,
  AuthLoadingBlock,
} from "@/components/blocks/auth-blocks";
import type { AuthFormTemplateProps } from "@/types/authTypes";

/** Compose editorial heading, controlled fields, challenge and secondary actions. */
export function AuthFormTemplate({
  title,
  description,
  variant,
  ...form
}: AuthFormTemplateProps) {
  return (
    <AuthFormPanel
      title={title}
      description={description}
      {...(variant ? { variant } : {})}
    >
      <AuthFormBlock {...form} />
    </AuthFormPanel>
  );
}

/** Auth boundaries keep the surrounding split shell supplied by the layout. */
export function AuthLoadingTemplate() {
  return <AuthLoadingBlock />;
}

export function AuthErrorTemplate({ reset }: { reset: () => void }) {
  return <AuthErrorBlock reset={reset} />;
}
