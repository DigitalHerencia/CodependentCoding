"use client"

import { useActionState } from "react"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { runInferenceAction } from "@/lib/actions/capabilityActions"
import type { ActionResult } from "@/types/actionResultTypes"
import type { InferenceResult } from "@/types/capabilityTypes"

const initialState: ActionResult<InferenceResult> = { ok: true, data: { model: "", text: "" } }

export function InferenceFormClient() {
  const [state, action, pending] = useActionState(runInferenceAction, initialState)
  return (
    <div className="grid max-w-3xl gap-6">
      <form action={action} className="grid gap-4">
        <Textarea
          name="prompt"
          required
          minLength={3}
          maxLength={4000}
          placeholder="Describe what you want the model to help with."
        />
        <Button disabled={pending}>{pending ? "Running..." : "Run inference"}</Button>
      </form>
      {!state.ok ? (
        <p className="text-sm text-destructive">{state.formError}</p>
      ) : state.data.text ? (
        <section className="border bg-card p-6 whitespace-pre-wrap">
          <p className="mb-3 text-xs text-muted-foreground">{state.data.model}</p>
          {state.data.text}
        </section>
      ) : null}
    </div>
  )
}
