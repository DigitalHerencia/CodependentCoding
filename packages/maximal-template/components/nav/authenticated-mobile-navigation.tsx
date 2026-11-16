"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { authenticatedNavigationCopy as copy } from "@/content/authenticated-navigation";
import type { AuthenticatedMobileNavigationProps } from "@/types/authenticatedNavigationTypes";

// Clerk's account modal must open after the navigation FocusScope has unmounted.
const NavigationDismissContext = createContext<
  ((afterClose: () => void) => void) | null
>(null);
export function useAuthenticatedNavigationDismiss() {
  return useContext(NavigationDismissContext);
}

/** One Radix modal supplies focus trapping/restoration, Escape/outside handling and scroll locking. */
export function AuthenticatedMobileNavigation({
  title,
  children,
}: AuthenticatedMobileNavigationProps) {
  const pathname = usePathname();
  const [state, setState] = useState({ route: pathname, open: false });
  const open = state.route === pathname && state.open;
  const afterClose = useRef<(() => void) | null>(null);
  const close = () => setState({ route: pathname, open: false });

  useEffect(() => {
    const media = window.matchMedia("(min-width: 64rem)");
    const closeOnDesktop = () => {
      if (media.matches)
        setState((current) =>
          current.open ? { ...current, open: false } : current,
        );
    };
    media.addEventListener("change", closeOnDesktop);
    return () => media.removeEventListener("change", closeOnDesktop);
  }, []);

  return (
    <DialogPrimitive.Root
      modal
      open={open}
      onOpenChange={(next) => setState({ route: pathname, open: next })}
    >
      <DialogPrimitive.Trigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={copy.open}
          className="shrink-0 lg:hidden"
        >
          <Menu aria-hidden />
        </Button>
      </DialogPrimitive.Trigger>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          data-authenticated-navigation-backdrop
          className="fixed inset-0 z-50 bg-background/80 lg:hidden"
        />
        <DialogPrimitive.Content
          className="fixed inset-0 z-50 flex h-dvh w-full min-w-0 flex-col gap-4 overflow-hidden bg-background pt-[calc(1rem+env(safe-area-inset-top))] pr-[max(1rem,env(safe-area-inset-right))] pb-[calc(1rem+env(safe-area-inset-bottom))] pl-[max(1rem,env(safe-area-inset-left))] text-foreground lg:hidden"
          onClick={(event) => {
            if (
              event.target instanceof Element &&
              event.target.closest("a[href]")
            )
              close();
          }}
          onCloseAutoFocus={(event) => {
            const action = afterClose.current;
            afterClose.current = null;
            if (action) {
              event.preventDefault();
              action();
            }
          }}
        >
          <header className="flex min-w-0 items-center justify-between gap-4">
            <DialogPrimitive.Title className="type-heading break-words">
              {title}
            </DialogPrimitive.Title>
            <DialogPrimitive.Close asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label={copy.close}
                className="shrink-0"
              >
                <X aria-hidden />
              </Button>
            </DialogPrimitive.Close>
          </header>
          <DialogPrimitive.Description className="sr-only">
            {copy.description}
          </DialogPrimitive.Description>
          <div className="min-h-0 min-w-0 flex-1 space-y-6 overflow-y-auto overscroll-contain">
            <NavigationDismissContext.Provider
              value={(action) => {
                afterClose.current = action;
                close();
              }}
            >
              {children}
            </NavigationDismissContext.Provider>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
