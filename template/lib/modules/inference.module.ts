import type { ModuleDefinition } from "@/types/moduleTypes";

export const inferenceModule = {
  id: "inference",
  integration: {
    name: "Hugging Face",
    purpose: "Hosted AI inference",
    env: ["HUGGINGFACE_ACCESS_TOKEN"],
  },
} satisfies ModuleDefinition;
