"use server"

import { ZodError } from "zod"

import {
  runInferenceWorkflow,
  saveLocationWorkflow,
  searchLocationsWorkflow,
  uploadMediaWorkflow,
} from "@/lib/capabilities/workflows/capabilityWorkflows"
import { actionFailure, actionSuccess, type ActionResult } from "@/types/actionResultTypes"
import type { InferenceResult, LocationResult } from "@/types/capabilityTypes"

function formString(formData: FormData, key: string): string {
  const value = formData.get(key)
  return typeof value === "string" ? value : ""
}

function invalid(error: unknown): ActionResult<never> {
  if (error instanceof ZodError)
    return actionFailure(
      "INVALID_INPUT",
      "Check the submitted values.",
      error.flatten().fieldErrors
    )
  throw error
}

export async function uploadMediaAction(
  _state: ActionResult<{ id: string }>,
  formData: FormData
): Promise<ActionResult<{ id: string }>> {
  try {
    const asset = await uploadMediaWorkflow({ file: formData.get("file") })
    return actionSuccess({ id: asset.id })
  } catch (error) {
    return invalid(error)
  }
}

export async function runInferenceAction(
  _state: ActionResult<InferenceResult>,
  formData: FormData
): Promise<ActionResult<InferenceResult>> {
  try {
    return actionSuccess(await runInferenceWorkflow({ prompt: formString(formData, "prompt") }))
  } catch (error) {
    return invalid(error)
  }
}

export async function searchLocationsAction(
  _state: ActionResult<LocationResult[]>,
  formData: FormData
): Promise<ActionResult<LocationResult[]>> {
  try {
    return actionSuccess(await searchLocationsWorkflow({ query: formString(formData, "query") }))
  } catch (error) {
    return invalid(error)
  }
}

export async function saveLocationAction(formData: FormData): Promise<void> {
  await saveLocationWorkflow({
    label: formString(formData, "label"),
    mapboxId: formString(formData, "mapboxId") || undefined,
    longitude: formString(formData, "longitude"),
    latitude: formString(formData, "latitude"),
  })
}
