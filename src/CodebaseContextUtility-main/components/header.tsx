"use client"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Code, Download, FolderOpen, FileText } from "lucide-react"
import { useFileSystem } from "@/components/file-system-provider"
import { useToast } from "@/components/ui/use-toast"
import type { FileEntry } from "@/components/file-system-provider"

export function Header() {
  const { openDirectory, openFile, isLoading, fileTree, readFileContent } = useFileSystem()
  const { toast } = useToast()

  const handleExport = async () => {
    if (Object.keys(fileTree).length === 0) {
      toast({
        title: "No files to export",
        description: "Please open a directory or add files first.",
        variant: "destructive",
        duration: 3000,
      })
      return
    }

    try {
      let markdownContent = "# Codebase Export\n\n"

      const processDirectory = async (directory: Record<string, FileEntry>, path = "") => {
        for (const [name, entry] of Object.entries(directory)) {
          const fullPath = path ? `${path}/${name}` : name

          if (entry.type === "file") {
            // Skip image files and other binary formats
            const fileExtension = name.split(".").pop()?.toLowerCase()
            const skipExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "ico", "svg", "webp"]
            if (skipExtensions.includes(fileExtension || "")) continue

            const content = await readFileContent(fullPath)
            markdownContent += `## ${fullPath}\n\`\`\`${fileExtension}\n${content}\n\`\`\`\n\n`
          } else if (entry.type === "directory" && entry.children) {
            // Skip .next, node_modules, and .git directories
            if (["node_modules", ".next", ".git"].includes(name)) continue
            await processDirectory(entry.children, fullPath)
          }
        }
      }

      await processDirectory(fileTree)

      // Create a blob and download
      const blob = new Blob([markdownContent], { type: "text/markdown" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `codebase-export-${new Date().toISOString().slice(0, 10)}.md`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast({
        title: "Export successful",
        description: "Your codebase has been exported as a Markdown file.",
        duration: 3000,
      })
    } catch (error) {
      console.error("Export failed:", error)
      toast({
        title: "Export failed",
        description: "Failed to export codebase.",
        variant: "destructive",
        duration: 3000,
      })
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <a href="/" className="mr-6 flex items-center space-x-2">
            <Code className="h-6 w-6 text-primary" />
            <span className="hidden font-bold sm:inline-block text-foreground">Codebase Context Utility</span>
          </a>
        </div>
        <div className="flex flex-1 items-center space-x-2 justify-end">
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1 bg-secondary hover:bg-accent border-border"
            onClick={openDirectory}
            disabled={isLoading}
          >
            <FolderOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Open Folder</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1 bg-secondary hover:bg-accent border-border"
            onClick={openFile}
            disabled={isLoading}
          >
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Open File</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1 bg-secondary hover:bg-accent border-border"
            onClick={handleExport}
            disabled={isLoading}
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Export</span>
          </Button>
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}
