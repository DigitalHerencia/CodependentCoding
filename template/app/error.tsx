"use client"

import { Button } from "@/components/ui/button"

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <main className="mx-auto grid min-h-dvh max-w-xl place-content-center gap-4 px-6 text-center">
      <h1 className="text-4xl">Something went wrong.</h1>
      <p className="text-muted-foreground">The request could not be completed safely.</p>
      <Button onClick={reset}>Try again</Button>
    </main>
  )
}
