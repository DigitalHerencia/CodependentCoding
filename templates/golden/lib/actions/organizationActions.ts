"use server"

import {
  createOrganizationWorkflow,
  inviteOrganizationMemberWorkflow,
} from "@/lib/organizations/workflows/organizationWorkflows"
import {
  createOrganizationSchema,
  inviteOrganizationMemberSchema,
} from "@/schemas/organizationSchemas"
import { actionFailure, actionSuccess, type ActionResult } from "@/types/actionResultTypes"

function formString(formData: FormData, key: string): string {
  const value = formData.get(key)
  return typeof value === "string" ? value : ""
}

export async function createOrganizationAction(
  _state: ActionResult<{ id: string }>,
  formData: FormData
): Promise<ActionResult<{ id: string }>> {
  const parsed = createOrganizationSchema.safeParse({ name: formString(formData, "name") })
  if (!parsed.success)
    return actionFailure(
      "INVALID_INPUT",
      "Check the organization name.",
      parsed.error.flatten().fieldErrors
    )
  const organization = await createOrganizationWorkflow(parsed.data)
  return actionSuccess({ id: organization.id })
}

export async function inviteOrganizationMemberAction(
  _state: ActionResult<{ id: string }>,
  formData: FormData
): Promise<ActionResult<{ id: string }>> {
  const parsed = inviteOrganizationMemberSchema.safeParse({
    email: formString(formData, "email"),
    role: formString(formData, "role"),
  })
  if (!parsed.success)
    return actionFailure(
      "INVALID_INPUT",
      "Check the invitation details.",
      parsed.error.flatten().fieldErrors
    )
  const invitation = await inviteOrganizationMemberWorkflow(parsed.data)
  return actionSuccess({ id: invitation.id })
}
