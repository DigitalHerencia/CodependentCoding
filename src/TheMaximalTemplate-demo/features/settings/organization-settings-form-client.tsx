"use client"

import { useActionState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { updateOrganizationAction } from "@/lib/actions/organizationActions"
import type { ActionResult } from "@/types/actionResultTypes"

const initialState: ActionResult<{ name: string }> = { ok: true, data: { name: "" } }

export function OrganizationSettingsFormClient({ name }: { name: string }) {
  const [state, action, pending] = useActionState(updateOrganizationAction, initialState)
  return (
    <form action={action} className="grid max-w-xl gap-4 border bg-card p-6">
      <Label htmlFor="organization-name">Organization name</Label>
      <Input
        id="organization-name"
        name="name"
        defaultValue={name}
        required
        minLength={2}
        maxLength={120}
      />
      {!state.ok ? <p className="text-sm text-destructive">{state.formError}</p> : null}
      {state.ok && state.data.name ? (
        <p className="text-sm text-primary">Organization updated.</p>
      ) : null}
      <Button className="w-fit" disabled={pending}>
        {pending ? "Saving..." : "Save organization"}
      </Button>
    </form>
  )
}
