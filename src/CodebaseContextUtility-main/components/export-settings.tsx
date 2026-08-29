"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Copy, Download } from "lucide-react"

interface ExportSettingsProps {
  contextOptions: {
    format: "json" | "markdown" | "plain"
    targetLLM: string
    includeMetadata: boolean
    minify: boolean
    includeFullContent: boolean
    maxTokens: number
  }
  setContextOptions: (options: any) => void
  contextContent: string
  onCopy: () => void
  onDownload: () => void
}

export function ExportSettings({
  contextOptions,
  setContextOptions,
  contextContent,
  onCopy,
  onDownload,
}: ExportSettingsProps) {
  return (
    <div className="space-y-4 p-4 bg-background">
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Format Options</CardTitle>
          <CardDescription className="text-muted-foreground">
            Configure how your context is generated and formatted
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="format" className="text-foreground">
              Format
            </Label>
            <Select
              value={contextOptions.format}
              onValueChange={(value: "json" | "markdown" | "plain") =>
                setContextOptions({ ...contextOptions, format: value })
              }
            >
              <SelectTrigger id="format" className="w-full bg-input border-border">
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                <SelectItem value="json" className="hover:bg-accent">
                  JSON
                </SelectItem>
                <SelectItem value="markdown" className="hover:bg-accent">
                  Markdown
                </SelectItem>
                <SelectItem value="plain" className="hover:bg-accent">
                  Plain Text
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col space-y-4">
            <div className="flex items-start space-x-2">
              <Checkbox
                id="include-metadata"
                checked={contextOptions.includeMetadata}
                onCheckedChange={(checked) =>
                  setContextOptions({ ...contextOptions, includeMetadata: checked as boolean })
                }
                className="mt-1 border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <div>
                <Label htmlFor="include-metadata" className="cursor-pointer text-foreground">
                  Include Metadata
                </Label>
                <p className="text-xs text-muted-foreground">
                  Includes information about file counts, sizes, and languages in the context.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox
                id="minify"
                checked={contextOptions.minify}
                onCheckedChange={(checked) => setContextOptions({ ...contextOptions, minify: checked as boolean })}
                className="mt-1 border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <div>
                <Label htmlFor="minify" className="cursor-pointer text-foreground">
                  Minify
                </Label>
                <p className="text-xs text-muted-foreground">
                  Removes whitespace to reduce token usage (JSON format only).
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox
                id="include-full-content"
                checked={contextOptions.includeFullContent}
                onCheckedChange={(checked) =>
                  setContextOptions({ ...contextOptions, includeFullContent: checked as boolean })
                }
                className="mt-1 border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <div>
                <Label htmlFor="include-full-content" className="cursor-pointer text-foreground">
                  Include Full Content
                </Label>
                <p className="text-xs text-muted-foreground">
                  Includes complete file content instead of truncating large files.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-4">
            <Label htmlFor="max-tokens" className="text-foreground">
              Maximum Tokens
            </Label>
            <div className="flex items-center space-x-2">
              <input
                id="max-tokens"
                type="range"
                min="1000"
                max="128000"
                step="1000"
                value={contextOptions.maxTokens}
                onChange={(e) => setContextOptions({ ...contextOptions, maxTokens: Number.parseInt(e.target.value) })}
                className="w-full accent-primary"
              />
              <span className="text-sm font-medium min-w-[80px] text-foreground">
                {contextOptions.maxTokens.toLocaleString()}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Limit the maximum number of tokens in the generated context.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between mt-4">
        <Button
          variant="outline"
          onClick={onCopy}
          disabled={!contextContent}
          className="gap-1 bg-secondary hover:bg-accent border-border"
        >
          <Copy className="h-4 w-4" />
          Copy
        </Button>
        <Button
          variant="outline"
          onClick={onDownload}
          disabled={!contextContent}
          className="gap-1 bg-secondary hover:bg-accent border-border"
        >
          <Download className="h-4 w-4" />
          Download
        </Button>
      </div>
    </div>
  )
}
