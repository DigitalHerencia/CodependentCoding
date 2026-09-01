import { getAiPlaygroundConfiguration } from "../../fetchers/aiFetchers";
export async function selectModelWorkflow() {
  const configuration = getAiPlaygroundConfiguration();
  if (!configuration.configured) {
    throw new Error("The AI provider is not configured.");
  }
  return configuration.model;
}
