import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { PresentationShell } from "@/components/(presentation)/presentation-shell"
import { isPresentationCatalogEnabled } from "@/lib/presentation/catalogAccess"

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default function PresentationLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  if (!isPresentationCatalogEnabled()) notFound()

  return <PresentationShell>{children}</PresentationShell>
}
