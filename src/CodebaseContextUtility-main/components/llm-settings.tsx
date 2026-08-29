"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"

export interface LLMSettings {
  provider: string
  model: string
  apiKey: string
  maxTokens: number
  temperature: number
  systemPrompt: string
  streamResponse: boolean
}

interface LLMSettingsProps {
  settings: LLMSettings
  onSettingsChange: (settings: LLMSettings) => void
}

export function LLMSettings({ settings, onSettingsChange }: LLMSettingsProps) {
  const [localSettings, setLocalSettings] = useState<LLMSettings>(settings)

  const handleChange = (key: keyof LLMSettings, value: any) => {
    setLocalSettings({ ...localSettings, [key]: value })
  }

  const saveSettings = () => {
    onSettingsChange(localSettings)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>LLM Integration Settings</CardTitle>
        <CardDescription>Configure how your codebase context is sent to LLMs</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="provider">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="provider">Provider</TabsTrigger>
            <TabsTrigger value="model">Model</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          <TabsContent value="provider" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="provider">LLM Provider</Label>
              <Select value={localSettings.provider} onValueChange={(value) => handleChange("provider", value)}>
                <SelectTrigger id="provider">
                  <SelectValue placeholder="Select provider" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="openai">OpenAI</SelectItem>
                  <SelectItem value="anthropic">Anthropic</SelectItem>
                  <SelectItem value="google">Google AI</SelectItem>
                  <SelectItem value="local">Local Model</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="api-key">API Key</Label>
              <Input
                id="api-key"
                type="password"
                value={localSettings.apiKey}
                onChange={(e) => handleChange("apiKey", e.target.value)}
                placeholder="Enter your API key"
              />
              <p className="text-xs text-muted-foreground">
                Your API key is stored locally and never sent to our servers.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="model" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="model">Model</Label>
              <Select value={localSettings.model} onValueChange={(value) => handleChange("model", value)}>
                <SelectTrigger id="model">
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent>
                  {localSettings.provider === "openai" && (
                    <>
                      <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                      <SelectItem value="gpt-4">GPT-4</SelectItem>
                      <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                    </>
                  )}
                  {localSettings.provider === "anthropic" && (
                    <>
                      <SelectItem value="claude-3-opus">Claude 3 Opus</SelectItem>
                      <SelectItem value="claude-3-sonnet">Claude 3 Sonnet</SelectItem>
                      <SelectItem value="claude-3-haiku">Claude 3 Haiku</SelectItem>
                    </>
                  )}
                  {localSettings.provider === "google" && (
                    <>
                      <SelectItem value="gemini-pro">Gemini Pro</SelectItem>
                      <SelectItem value="gemini-ultra">Gemini Ultra</SelectItem>
                    </>
                  )}
                  {localSettings.provider === "local" && (
                    <>
                      <SelectItem value="llama-3-70b">Llama 3 (70B)</SelectItem>
                      <SelectItem value="llama-3-8b">Llama 3 (8B)</SelectItem>
                      <SelectItem value="mistral-7b">Mistral (7B)</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="max-tokens">Max Output Tokens</Label>
              <Input
                id="max-tokens"
                type="number"
                value={localSettings.maxTokens}
                onChange={(e) => handleChange("maxTokens", Number.parseInt(e.target.value) || 0)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="temperature">Temperature</Label>
              <Input
                id="temperature"
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={localSettings.temperature}
                onChange={(e) => handleChange("temperature", Number.parseFloat(e.target.value))}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Precise (0.0)</span>
                <span>Balanced (0.5)</span>
                <span>Creative (1.0)</span>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="system-prompt">System Prompt</Label>
              <Input
                id="system-prompt"
                value={localSettings.systemPrompt}
                onChange={(e) => handleChange("systemPrompt", e.target.value)}
                placeholder="You are a helpful assistant analyzing a codebase..."
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="stream-response"
                checked={localSettings.streamResponse}
                onCheckedChange={(checked) => handleChange("streamResponse", checked)}
              />
              <Label htmlFor="stream-response">Stream response</Label>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter>
        <Button onClick={saveSettings}>Save Settings</Button>
      </CardFooter>
    </Card>
  )
}
