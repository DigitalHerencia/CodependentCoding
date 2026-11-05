"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  changeAdminMembership,
  suspendAdminMembership,
  restoreAdminMembership,
} from "@/lib/actions/adminActions";
import { appRoles } from "@/lib/authz/roles";
import type { AdminMembershipDTO } from "@/types/adminTypes";
export function AdminUserDetailFeatureClient({
  membership,
}: {
  membership: AdminMembershipDTO;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState("");
  return (
    <div className="space-y-5">
      <form
        className="space-y-3"
        action={(data) =>
          startTransition(async () => {
            const result = await changeAdminMembership({
              membershipId: membership.id,
              role: data.get("role"),
            });
            setMessage(result.ok ? "Role updated." : result.error.message);
            if (result.ok) router.refresh();
          })
        }
      >
        <Label htmlFor="member-role">Application role</Label>
        <select
          id="member-role"
          name="role"
          className="control-field"
          defaultValue={membership.role}
        >
          {appRoles.map((role) => (
            <option key={role}>{role}</option>
          ))}
        </select>
        <Button type="submit" disabled={pending}>
          Save role
        </Button>
      </form>
      <Button
        variant="outline"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            const updateAccess =
              membership.status === "SUSPENDED"
                ? restoreAdminMembership
                : suspendAdminMembership;
            const result = await updateAccess({ membershipId: membership.id });
            setMessage(
              result.ok ? "Membership access updated." : result.error.message,
            );
            if (result.ok) router.refresh();
          })
        }
      >
        {membership.status === "SUSPENDED"
          ? "Restore access"
          : "Suspend access"}
      </Button>
      <p role="status">{message}</p>
    </div>
  );
}
