"use client";
/** Account interaction orchestrates auth presentation, the identity workflow and onboarding RHF form. */
import { useRef, useState } from "react";
import { AuthAccountTemplate } from "@/components/templates/auth-templates";
import { useAuthAccountWorkflow } from "@/lib/workflows/authWorkflows";
import { OnboardingEditForm } from "@/features/onboarding/onboardingEditForm";
import type { AuthAccountFeatureProps } from "@/types/authTypes";
/** Hand modal focus off only after the sheet closes, then restore its account trigger. */
export function AuthAccountFeatureClient(props: AuthAccountFeatureProps) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [pending, setPending] = useState(false);
  const [failed, setFailed] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const afterClose = useRef<(() => void) | null>(null);
  const { onManageAccount, onSignOut } = useAuthAccountWorkflow();
  return (
    <>
      <AuthAccountTemplate
        {...props}
        open={open}
        onOpenChange={setOpen}
        triggerRef={triggerRef}
        pending={pending}
        failed={failed}
        onAfterClose={() => {
          const action = afterClose.current;
          afterClose.current = null;
          if (!action) return false;
          action();
          return true;
        }}
        onViewProfile={() => {
          afterClose.current = onManageAccount;
          setOpen(false);
        }}
        onEditProfile={() => {
          afterClose.current = () => setEditing(true);
          setOpen(false);
        }}
        onSignOut={async () => {
          setPending(true);
          setFailed(false);
          try {
            await onSignOut();
          } catch {
            setFailed(true);
          } finally {
            setPending(false);
          }
        }}
      />
      {editing && (
        <OnboardingEditForm
          profile={props.profile}
          onClose={() => {
            setEditing(false);
            requestAnimationFrame(() => triggerRef.current?.focus());
          }}
        />
      )}
    </>
  );
}
