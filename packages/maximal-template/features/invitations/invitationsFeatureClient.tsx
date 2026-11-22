"use client";

/** Invitations Feature Client contracts and composition for the owning application slice. */
import { InvitationsTemplate } from "@/components/templates/invitation-templates";
import { revokeInvitationWorkflow } from "@/lib/workflows/invitationWorkflows";
import { InvitationsEditMemberForm } from "@/features/invitations/invitationsEditMemberForm";
import type {
  InvitationDTO,
  InvitationsFeatureProps,
} from "@/types/invitationTypes";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

/** Orchestrate pending invitation edits and cancellation from the authenticated list. */
export function InvitationsFeatureClient({
  invitations,
  canEdit,
  canRevoke,
}: InvitationsFeatureProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [editing, setEditing] = useState<InvitationDTO>();
  const [error, setError] = useState("");
  return (
    <>
      {canEdit && editing && (
        <InvitationsEditMemberForm
          key={editing.id}
          invitation={editing}
          onComplete={() => setEditing(undefined)}
        />
      )}
      <InvitationsTemplate
        invitations={invitations}
        pending={pending}
        error={error}
        onEdit={canEdit ? setEditing : undefined}
        onRevoke={
          canRevoke
            ? (invitationId) =>
                startTransition(async () => {
                  setError("");
                  try {
                    const result = await revokeInvitationWorkflow({
                      invitationId,
                    });
                    if (!result.ok) setError("revokeFailed");
                    else if (editing?.id === invitationId)
                      setEditing(undefined);
                    router.refresh();
                  } catch {
                    setError("revokeFailed");
                  }
                })
            : undefined
        }
      />
    </>
  );
}
