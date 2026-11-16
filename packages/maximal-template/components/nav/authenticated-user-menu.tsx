"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useRef, useState } from "react";
import type { MouseEvent } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { OnboardingProfileCardBlock } from "@/components/blocks/onboarding-blocks";
import { OrganizationSwitcherFeatureClient } from "@/features/settings/organization-switcher-feature.client";
import { usePwaAccountMenuWorkflow } from "@/lib/workflows/pwaClientWorkflows";
import { useAuthenticatedNavigationDismiss } from "@/components/nav/authenticated-mobile-navigation";
import { authenticatedNavigationCopy as copy } from "@/content/authenticated-navigation";
import type { AuthenticatedUserMenuProps } from "@/types/authenticatedNavigationTypes";

/** Rich account panel uses native form controls; it is a popover, not an ARIA command menu. */
export function AuthenticatedUserMenu({
  profile,
  switcher,
  role,
  presentation = "popover",
}: AuthenticatedUserMenuProps) {
  const { user, isLoaded } = useUser();
  const { onManageAccount, onSignOut } = usePwaAccountMenuWorkflow();
  const closeNavigation = useAuthenticatedNavigationDismiss();
  const [open, setOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [error, setError] = useState("");
  const afterClose = useRef<(() => void) | null>(null);
  const activeOrganization = switcher.organizations.find(
    (organization) => organization.id === switcher.activeOrganizationId,
  );

  useEffect(() => {
    const media = window.matchMedia("(min-width: 64rem)");
    const closeOnMobile = () => {
      if (!media.matches) setOpen(false);
    };
    media.addEventListener("change", closeOnMobile);
    return () => media.removeEventListener("change", closeOnMobile);
  }, []);

  const avatar = (
    <Avatar className="size-8">
      {user?.imageUrl && <AvatarImage src={user.imageUrl} alt="" />}
      <AvatarFallback aria-hidden>
        {profile.displayName.trim().slice(0, 1).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
  const panel = (
    <section aria-label={copy.account} className="min-w-0 space-y-4">
      <div className="flex items-center gap-3">
        {avatar}
        <h2 className="type-heading">{copy.account}</h2>
      </div>
      <OnboardingProfileCardBlock profile={profile} />
      <dl className="space-y-2 text-sm">
        <div>
          <dt className="text-muted-foreground">{copy.role}</dt>
          <dd className="break-words">{role}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">{copy.organization}</dt>
          <dd className="break-words">
            {activeOrganization?.name ?? copy.organizationUnavailable}
          </dd>
        </div>
        {user?.primaryEmailAddress?.emailAddress && (
          <div>
            <dt className="text-muted-foreground">{copy.email}</dt>
            <dd className="break-all">{user.primaryEmailAddress.emailAddress}</dd>
          </div>
        )}
      </dl>
      {switcher.organizations.length > 1 && (
        <OrganizationSwitcherFeatureClient {...switcher} />
      )}
      <div className="flex flex-wrap gap-3">
        <Button
          type="button"
          variant="outline"
          disabled={!isLoaded || !user || signingOut}
          onClick={() => {
            if (closeNavigation) closeNavigation(onManageAccount);
            else {
              afterClose.current = onManageAccount;
              setOpen(false);
            }
          }}
        >
          {copy.manage}
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={!isLoaded || !user || signingOut}
          onClick={async () => {
            setError("");
            setSigningOut(true);
            try {
              await onSignOut();
            } catch {
              setError(copy.signOutFailed);
            } finally {
              setSigningOut(false);
            }
          }}
        >
          {signingOut ? copy.signingOut : copy.signOut}
        </Button>
      </div>
      {!isLoaded && <p role="status">{copy.accountUnavailable}</p>}
      {error && <p role="alert">{error}</p>}
    </section>
  );
  if (presentation === "panel") return panel;
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button type="button" variant="ghost" aria-label={copy.account}>
          {avatar}
          <span>{copy.account}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="hidden max-h-[calc(100dvh-env(safe-area-inset-top)-env(safe-area-inset-bottom)-2rem)] w-80 max-w-[calc(100vw-2rem)] overflow-y-auto lg:block"
        onClick={(event: MouseEvent<HTMLDivElement>) => {
          if (
            event.target instanceof Element &&
            event.target.closest("a[href]")
          )
            setOpen(false);
        }}
        onCloseAutoFocus={(event: Event) => {
          const action = afterClose.current;
          afterClose.current = null;
          if (action) {
            event.preventDefault();
            action();
          }
        }}
      >
        {panel}
      </PopoverContent>
    </Popover>
  );
}
