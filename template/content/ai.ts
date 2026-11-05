export const aiPresentationCopy = {
  generating: "Generating…",

  theAIProviderIsNotConfiguredForThisWorkspace:
    "The AI provider is not configured for this workspace.",
  generateResponse: "Generate response",
  generationHistory: "Generation history",
  newGeneration: "New generation",
  separator: " · ",
  separator2: " ·",
  prompt: "Prompt",
  noTextPromptWasRecorded: "No text prompt was recorded.",
  savedResponse: "Saved response",
  noResponseWasRecorded: "No response was recorded.",
  noGenerationsYet: "No generations yet.",
  aIPlayground: "AI playground",
  model: "Model: ",
  generatedResponse: "Generated response",
  myAIUsage: "My AI usage",
  recordedUsageLedger: "Recorded usage ledger",
  generationEntries: "Generation entries",
  inputTokensRecorded: "Input tokens recorded",
  outputTokensRecorded: "Output tokens recorded",
  costRecordedUSD: "Cost recorded (USD)",
  theCurrentGenerationAdapterRecordsZeroTokenAndCost:
    "The current generation adapter records zero token and cost values when usage is not supplied. These totals are not a provider billing statement.",
} as const;

export const aiRemainingCopy = {
  generating: "Generating…",
  submitAPromptToGenerateAResponse: "Submit a prompt to generate a response.",
  yourPrompt: "Your prompt",
} as const;
