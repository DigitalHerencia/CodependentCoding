"use client"

import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"
import { useFileSystem } from "@/components/file-system-provider"
import { useToast } from "@/hooks/use-toast"

interface CodePreviewProps {
  filePath: string | null
}

export function CodePreview({ filePath }: CodePreviewProps) {
  const { readFileContent } = useFileSystem()
  const { toast } = useToast()
  const [code, setCode] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!filePath) {
      setCode(null)
      return
    }

    const loadFileContent = async () => {
      setLoading(true)
      try {
        const content = await readFileContent(filePath)
        setCode(content)
      } catch (error) {
        console.error("Error loading file content:", error)
        setCode(`// Error loading file: ${error.message || "Unknown error"}`)

        // Show toast notification for better user feedback
        toast({
          title: "Error loading file",
          description: error.message || "Unknown error",
          variant: "destructive",
          duration: 3000,
        })
      } finally {
        setLoading(false)
      }
    }

    loadFileContent()
  }, [filePath, readFileContent, toast])

  if (!filePath) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-12rem)] text-muted-foreground bg-background">
        Select a file to preview its content
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-12rem)] bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  const getLanguageFromExtension = (filePath: string): string => {
    const extension = filePath.split(".").pop()?.toLowerCase() || ""
    const languageMap: Record<string, string> = {
      js: "javascript",
      jsx: "jsx",
      ts: "typescript",
      tsx: "tsx",
      css: "css",
      json: "json",
      md: "markdown",
      py: "python",
      html: "html",
      xml: "xml",
      yml: "yaml",
      yaml: "yaml",
    }
    return languageMap[extension] || "text"
  }

  const language = getLanguageFromExtension(filePath || "")

  return (
    <div className="p-4 h-[calc(100vh-12rem)] overflow-auto bg-background">
      <div className="mb-2 text-sm text-muted-foreground">
        {filePath} ({language})
      </div>
      <div className="rounded-lg bg-card border border-border overflow-x-auto">
        <pre className="p-4 text-sm font-mono whitespace-pre-wrap break-words text-foreground">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  )
}
