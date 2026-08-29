"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Filter } from "lucide-react"

interface FileFilterProps {
  onFilterChange: (filters: FileFilterOptions) => void
}

export interface FileFilterOptions {
  extensions: string[]
  excludePatterns: string[]
  includeHidden: boolean
  maxFileSize: number // in KB
}

export function FileFilter({ onFilterChange }: FileFilterProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [filters, setFilters] = useState<FileFilterOptions>({
    extensions: [],
    excludePatterns: ["node_modules", ".git", "dist", "build", ".next"],
    includeHidden: false,
    maxFileSize: 1024, // 1MB
  })

  const [extensionInput, setExtensionInput] = useState("")
  const [excludeInput, setExcludeInput] = useState("")

  const addExtension = () => {
    if (extensionInput && !filters.extensions.includes(extensionInput)) {
      const newExtensions = [...filters.extensions, extensionInput]
      setFilters({ ...filters, extensions: newExtensions })
      setExtensionInput("")
    }
  }

  const removeExtension = (ext: string) => {
    setFilters({
      ...filters,
      extensions: filters.extensions.filter((e) => e !== ext),
    })
  }

  const addExcludePattern = () => {
    if (excludeInput && !filters.excludePatterns.includes(excludeInput)) {
      const newPatterns = [...filters.excludePatterns, excludeInput]
      setFilters({ ...filters, excludePatterns: newPatterns })
      setExcludeInput("")
    }
  }

  const removeExcludePattern = (pattern: string) => {
    setFilters({
      ...filters,
      excludePatterns: filters.excludePatterns.filter((p) => p !== pattern),
    })
  }

  const applyFilters = () => {
    onFilterChange(filters)
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-9 gap-1">
          <Filter className="h-4 w-4" />
          <span>Filters</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>File Filters</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label>Include File Extensions</Label>
            <div className="flex gap-2">
              <Input
                placeholder="js, tsx, md"
                value={extensionInput}
                onChange={(e) => setExtensionInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addExtension()}
              />
              <Button onClick={addExtension}>Add</Button>
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
              {filters.extensions.map((ext) => (
                <div key={ext} className="bg-muted px-2 py-1 rounded-md text-sm flex items-center gap-1">
                  {ext}
                  <button onClick={() => removeExtension(ext)} className="text-muted-foreground hover:text-foreground">
                    &times;
                  </button>
                </div>
              ))}
              {filters.extensions.length === 0 && (
                <div className="text-sm text-muted-foreground">All extensions included</div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Exclude Patterns</Label>
            <div className="flex gap-2">
              <Input
                placeholder="node_modules, .git"
                value={excludeInput}
                onChange={(e) => setExcludeInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addExcludePattern()}
              />
              <Button onClick={addExcludePattern}>Add</Button>
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
              {filters.excludePatterns.map((pattern) => (
                <div key={pattern} className="bg-muted px-2 py-1 rounded-md text-sm flex items-center gap-1">
                  {pattern}
                  <button
                    onClick={() => removeExcludePattern(pattern)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="include-hidden"
              checked={filters.includeHidden}
              onCheckedChange={(checked) => setFilters({ ...filters, includeHidden: checked as boolean })}
            />
            <Label htmlFor="include-hidden">Include hidden files</Label>
          </div>

          <div className="space-y-2">
            <Label>Maximum File Size (KB)</Label>
            <Input
              type="number"
              value={filters.maxFileSize}
              onChange={(e) => setFilters({ ...filters, maxFileSize: Number.parseInt(e.target.value) || 0 })}
            />
          </div>
        </div>

        <Button onClick={applyFilters}>Apply Filters</Button>
      </DialogContent>
    </Dialog>
  )
}
