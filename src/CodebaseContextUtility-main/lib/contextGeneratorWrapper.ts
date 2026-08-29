import { ContextGenerator } from "@/src/contextGenerator"
import type { Config } from "@/src/types/config"

export async function generateCodebaseContext(config: Config): Promise<string> {
  const generator = new ContextGenerator(config)
  return await generator.generateContext()
}
