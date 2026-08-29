"use client"

import { useActionState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { uploadMediaAction } from "@/lib/actions/capabilityActions"
import type { ActionResult } from "@/types/actionResultTypes"

const initialState: ActionResult<{ id: string }> = { ok: true, data: { id: "" } }

export function UploadClient() {
  const [state, action, pending] = useActionState(uploadMediaAction, initialState)
  return (
    <form action={action} className="flex max-w-xl flex-col gap-4">
      <Input name="file" type="file" required />
      {!state.ok ? <p className="text-sm text-destructive">{state.formError}</p> : null}
      {state.ok && state.data.id ? <p className="text-sm text-primary">Upload recorded.</p> : null}
      <Button disabled={pending}>{pending ? "Uploading..." : "Upload asset"}</Button>
    </form>
  )
}
