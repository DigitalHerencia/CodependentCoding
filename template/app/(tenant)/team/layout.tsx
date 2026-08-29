import { notFound } from "next/navigation"
import type { ReactNode } from "react"

import { loadedVibesCapabilities } from "@/content/loadedvibes"

export default function TeamLayout({ children }: { children: ReactNode }) {
  if (!loadedVibesCapabilities.invitations) notFound()
  return children
}
