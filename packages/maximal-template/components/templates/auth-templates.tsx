/** Auth presentation composes blocks; each page has exactly one template. */
import {
  AuthHeadingBlock,
  AuthAccountBlock,
  AuthFieldsBlock,
  AuthFormBlock,
  AuthControlsBlock,
  AuthFooterLinksBlock,
  AuthManagedBlock,
} from "@/components/blocks/auth-blocks";
import type {
  AuthPageTemplateProps,
  AuthAccountTemplateProps,
  AuthRouteVariantProps,
} from "@/types/authTypes";
/** Shared arrangement for the two route templates; no application decisions. */
function AuthRoutePresentation(props: AuthRouteVariantProps) {
  if (props.managed) return <AuthManagedBlock variant={props.variant} />;
  return (
    <div
      data-auth-variant={props.variant}
      className="w-full space-y-6 bg-transparent text-left"
    >
      <AuthHeadingBlock {...props} />
      <AuthFormBlock {...props}>
        <AuthFieldsBlock {...props} />
        <AuthControlsBlock {...props} />
      </AuthFormBlock>
      <AuthFooterLinksBlock variant={props.variant} />
    </div>
  );
}
/** The sign-in route's sole presentation entry. */
export function AuthSignInTemplate(props: AuthPageTemplateProps) {
  return <AuthRoutePresentation {...props} variant="signIn" />;
}
/** The sign-up route's sole presentation entry. */
export function AuthSignUpTemplate(props: AuthPageTemplateProps) {
  return <AuthRoutePresentation {...props} variant="signUp" />;
}

/** Account sheet presentation remains independent of onboarding and authorization logic. */
export function AuthAccountTemplate(props: AuthAccountTemplateProps) {
  return <AuthAccountBlock {...props} />;
}
