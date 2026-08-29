"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useFileSystem, type FileEntry } from "@/components/file-system-provider"

export function AdvancedSearch() {
  const { fileTree, setSelectedFile } = useFileSystem()
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState<string[]>([])

  const searchFiles = async () => {
    if (!searchTerm.trim()) return

    const results: string[] = []

    const searchInTree = async (tree: Record<string, FileEntry>, basePath = "") => {
      for (const [name, entry] of Object.entries(tree)) {
        const path = basePath ? `${basePath}/${name}` : name

        if (entry.type === "file") {
          if (name.toLowerCase().includes(searchTerm.toLowerCase())) {
            results.push(path)
          } else {
            // Search in file content
            const content = await entry.handle?.getFile().then((file) => file.text())
            if (content && content.toLowerCase().includes(searchTerm.toLowerCase())) {
              results.push(path)
            }
          }
        } else if (entry.type === "directory" && entry.children) {
          await searchInTree(entry.children, path)
        }
      }
    }

    await searchInTree(fileTree)
    setSearchResults(results)
  }

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <Input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search files..." />
        <Button onClick={searchFiles}>Search</Button>
      </div>
      {searchResults.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium">Search Results:</h4>
          <ul className="space-y-1">
            {searchResults.map((result) => (
              <li key={result} className="cursor-pointer hover:underline" onClick={() => setSelectedFile(result)}>
                {result}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
