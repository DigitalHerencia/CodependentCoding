"use client"

import { useActionState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createOrganizationAction } from "@/lib/actions/organizationActions"
import type { ActionResult } from "@/types/actionResultTypes"

const initialState: ActionResult<{ id: string }> = { ok: true, data: { id: "" } }

export function OnboardingForm() {
  const [state, action, pending] = useActionState(createOrganizationAction, initialState)
  return (
    <form action={action} className="grid max-w-lg gap-4">
      <Label htmlFor="organization-name">Organization name</Label>
      <Input id="organization-name" name="name" required minLength={2} maxLength={120} />
      {!state.ok ? <p className="text-sm text-destructive">{state.formError}</p> : null}
      {state.ok && state.data.id ? (
        <p className="text-sm text-primary">Organization created. Continue to the dashboard.</p>
      ) : null}
      <Button disabled={pending}>{pending ? "Creating..." : "Create organization"}</Button>
    </form>
  )
}
