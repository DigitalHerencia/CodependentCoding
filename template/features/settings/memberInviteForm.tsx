"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createInvitation } from "@/lib/actions/commonActions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const invitableRoles = ["MEMBER", "VIEWER", "ADMIN"] as const;

export function MemberInviteForm() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [link, setLink] = useState("");
  return (
    <form
      className="space-y-3 surface-card p-5"
      action={(data) =>
        startTransition(async () => {
          setError("");
          setLink("");
          const result = await createInvitation({
            email: data.get("email"),
            role: data.get("role"),
          });
          if (!result.ok) {
            setError(
              result.error.fieldErrors?.email?.[0] ??
                "The invitation could not be created. Inviting needs admin access.",
            );
            return;
          }
          setLink(`${window.location.origin}${result.data.path}`);
          router.refresh();
        })
      }
    >
      <h2 className="type-heading">Invite someone</h2>
      <p>
        They join when they sign in with this email and open the link. The link
        is shown once.
      </p>
      <Label htmlFor="invite-email">Email</Label>
      <Input id="invite-email" name="email" type="email" required />
      <Label htmlFor="invite-role">Role</Label>
      <select
        id="invite-role"
        name="role"
        defaultValue="MEMBER"
        className="control-field"
      >
        {invitableRoles.map((role) => (
          <option key={role}>{role}</option>
        ))}
      </select>
      {error && <p role="alert">{error}</p>}
      {link && (
        <p role="status">
          Share this link: <code className="break-all">{link}</code>
        </p>
      )}
      <Button type="submit" disabled={pending}>
        Create invitation
      </Button>
    </form>
  );
}
