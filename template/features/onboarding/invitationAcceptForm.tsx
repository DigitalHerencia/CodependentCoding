"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { acceptInvitation } from "@/lib/actions/commonActions";
import { Button } from "@/components/ui/button";

export function InvitationAcceptForm({ token }: { token: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  return (
    <form
      className="mx-auto max-w-lg space-y-4 surface-card p-5"
      action={() =>
        startTransition(async () => {
          const result = await acceptInvitation({ token });
          if (!result.ok) {
            setError(
              "This invitation is not valid for your account. It may have expired, been revoked, or been sent to a different email.",
            );
            return;
          }
          router.push("/dashboard");
          router.refresh();
        })
      }
    >
      <h1 className="type-title">Join the workspace</h1>
      <p>You were invited to a workspace. Accept to join it.</p>
      {error && <p role="alert">{error}</p>}
      <Button type="submit" disabled={pending}>
        Accept invitation
      </Button>
    </form>
  );
}
