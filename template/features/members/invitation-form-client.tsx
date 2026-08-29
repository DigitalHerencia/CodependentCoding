'use client';

import { useActionState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { inviteOrganizationMemberAction } from '@/lib/actions/organizationActions';
import type { ActionResult } from '@/types/actionResultTypes';
import {
  defaultInvitationRole,
  invitationRoles,
  organizationRoleLabels,
} from '@/types/authzTypes';

const initialState: ActionResult<{ id: string }> = {
  ok: true,
  data: { id: '' },
};

export function InvitationFormClient() {
  const [state, action, pending] = useActionState(
    inviteOrganizationMemberAction,
    initialState,
  );
  return (
    <form action={action} className="grid max-w-lg gap-4">
      <Label htmlFor="invite-email">Email</Label>
      <Input id="invite-email" name="email" type="email" required />
      <Label htmlFor="invite-role">Role</Label>
      <select
        id="invite-role"
        name="role"
        className="h-10 border bg-background px-3"
        defaultValue={defaultInvitationRole}
      >
        {invitationRoles.map((role) => (
          <option key={role} value={role}>
            {organizationRoleLabels[role]}
          </option>
        ))}
      </select>
      {!state.ok ? (
        <p className="text-sm text-destructive">{state.formError}</p>
      ) : null}
      {state.ok && state.data.id ? (
        <p className="text-sm text-primary">Invitation recorded.</p>
      ) : null}
      <Button disabled={pending}>
        {pending ? 'Inviting...' : 'Invite member'}
      </Button>
    </form>
  );
}
