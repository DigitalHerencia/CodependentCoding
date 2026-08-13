'use client';

import { useActionState } from 'react';

import { Button } from '@/components/ui/button';
import { updateMembershipAction } from '@/lib/actions/organizationActions';
import type { ActionResult } from '@/types/actionResultTypes';
import {
  organizationRoleLabels,
  organizationRoles,
  type OrganizationRole,
} from '@/types/authzTypes';

const initialState: ActionResult<{ role: string }> = {
  ok: true,
  data: { role: '' },
};

export function MemberRoleFormClient({
  membershipId,
  role,
}: {
  membershipId: string;
  role: OrganizationRole;
}) {
  const action = updateMembershipAction.bind(null, membershipId);
  const [state, formAction, pending] = useActionState(action, initialState);
  return (
    <form action={formAction} className="flex flex-wrap items-center gap-2">
      <select
        name="role"
        className="h-9 border bg-background px-3 text-sm"
        defaultValue={role}
      >
        {organizationRoles.map((option) => (
          <option key={option} value={option}>
            {organizationRoleLabels[option]}
          </option>
        ))}
      </select>
      <Button size="sm" variant="outline" disabled={pending}>
        {pending ? 'Saving...' : 'Update role'}
      </Button>
      {!state.ok ? (
        <span className="text-sm text-destructive">{state.formError}</span>
      ) : null}
      {state.ok && state.data.role ? (
        <span className="text-sm text-primary">Role updated.</span>
      ) : null}
    </form>
  );
}
