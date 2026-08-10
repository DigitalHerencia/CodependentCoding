"use client"

import { useActionState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { saveLocationAction, searchLocationsAction } from "@/lib/actions/capabilityActions"
import type { ActionResult } from "@/types/actionResultTypes"
import type { LocationResult } from "@/types/capabilityTypes"

const initialState: ActionResult<LocationResult[]> = { ok: true, data: [] }

export function LocationSearchFeature() {
  const [state, action, pending] = useActionState(searchLocationsAction, initialState)
  return (
    <div className="grid gap-5">
      <form action={action} className="flex max-w-2xl gap-3">
        <Input name="query" required minLength={2} placeholder="Search an address or place" />
        <Button disabled={pending}>{pending ? "Searching..." : "Search"}</Button>
      </form>
      {!state.ok ? (
        <p className="text-sm text-destructive">{state.formError}</p>
      ) : (
        <div className="grid gap-3">
          {state.data.map((result) => (
            <form
              key={result.id}
              action={saveLocationAction}
              className="flex items-center justify-between gap-4 border bg-card p-4"
            >
              <div>
                <p className="font-medium">{result.label}</p>
                <p className="text-xs text-muted-foreground">
                  {result.latitude}, {result.longitude}
                </p>
              </div>
              <input type="hidden" name="label" value={result.label} />
              <input type="hidden" name="mapboxId" value={result.id} />
              <input type="hidden" name="longitude" value={result.longitude} />
              <input type="hidden" name="latitude" value={result.latitude} />
              <Button variant="outline" size="sm">
                Save
              </Button>
            </form>
          ))}
        </div>
      )}
    </div>
  )
}
