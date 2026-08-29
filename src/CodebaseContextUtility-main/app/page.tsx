import { Dashboard } from "@/components/dashboard"
import { FileSystemProvider } from "@/components/file-system-provider"
import { ToastProvider } from "@/components/toast-provider"
import { ThemeProvider } from "@/components/theme-provider"

export default function Home() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <FileSystemProvider>
        <main className="flex min-h-screen flex-col">
          <Dashboard />
        </main>
      </FileSystemProvider>
      <ToastProvider />
    </ThemeProvider>
  )
}
