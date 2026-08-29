import type React from "react"
import type { Metadata } from "next"
import { ThemeProvider } from "@/components/theme-provider"
import { ToastProvider } from "@/components/toast-provider"
import { FileSystemProvider } from "@/components/file-system-provider"
import { Header } from "@/components/header"
import "./globals.css"

export const metadata: Metadata = {
  title: "Codebase Context Utility",
  description: "A modern tool for generating LLM-ready context from your codebase. Analyze, understand, and prepare your code for AI-assisted development.",
  generator: 'Codebase Context Utility'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <FileSystemProvider>
            <div className="flex min-h-screen flex-col">
              <Header />
              <main className="flex-1">{children}</main>
            </div>
          </FileSystemProvider>
          <ToastProvider />
        </ThemeProvider>
      </body>
    </html>
  )
}
