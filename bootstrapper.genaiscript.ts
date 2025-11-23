// bootstrapper.genaiscript.ts
// Orchestrates DevCycles by mapping prompts to instructions and toolsets.

import { ToolSet } from 'your-genai-sdk';

export const phases = {
  initialization: {
    instructions: 'instructions/initialization.instructions.md',
    toolset: 'toolsets/initialization.toolset.jsonc',
    prompts: 'prompts/initialization.prompt.md',
  },
  scaffolding: {
    instructions: 'instructions/scaffolding.instructions.md',
    toolset: 'toolsets/scaffolding.toolset.jsonc',
    prompts: 'prompts/scaffolding.prompt.md',
  },
  configuration: {
    instructions: 'instructions/configuration.instructions.md',
    toolset: 'toolsets/configuration.toolset.jsonc',
    prompts: 'prompts/configuration.prompt.md',
  },
  verification: {
    instructions: 'instructions/verification.instructions.md',
    toolset: 'toolsets/verification.toolset.jsonc',
    prompts: 'prompts/verification.prompt.md',
  },
  data: {
    instructions: 'instructions/data.instructions.md',
    toolset: 'toolsets/data.toolset.jsonc',
    prompts: 'prompts/data.prompt.md',
  },
  auth: {
    instructions: 'instructions/auth.instructions.md',
    toolset: 'toolsets/auth.toolset.jsonc',
    prompts: 'prompts/auth.prompt.md',
  },
  testing: {
    instructions: 'instructions/testing.instructions.md',
    toolset: 'toolsets/testing.toolset.jsonc',
    prompts: 'prompts/testing.prompt.md',
  },
  validation: {
    instructions: 'instructions/validation.instructions.md',
    toolset: 'toolsets/validation.toolset.jsonc',
    prompts: 'prompts/validation.prompt.md',
  },
  features: {
    instructions: 'instructions/features.instructions.md',
    toolset: 'toolsets/features.toolset.jsonc',
    prompts: 'prompts/features.prompt.md',
  },
  debug: {
    instructions: 'instructions/debug.instructions.md',
    toolset: 'toolsets/debug.toolset.jsonc',
    prompts: 'prompts/debug.prompt.md',
  },
  security: {
    instructions: 'instructions/security.instructions.md',
    toolset: 'toolsets/security.toolset.jsonc',
    prompts: 'prompts/security.prompt.md',
  },
  performance: {
    instructions: 'instructions/performance.instructions.md',
    toolset: 'toolsets/performance.toolset.jsonc',
    prompts: 'prompts/performance.prompt.md',
  },
  observability: {
    instructions: 'instructions/observability.instructions.md',
    toolset: 'toolsets/observability.toolset.jsonc',
    prompts: 'prompts/observability.prompt.md',
  },
  code_review: {
    instructions: 'instructions/code-review.instructions.md',
    toolset: 'toolsets/code-review.toolset.jsonc',
    prompts: 'prompts/code-review.prompt.md',
  },
  documentation: {
    instructions: 'instructions/documentation.instructions.md',
    toolset: 'toolsets/documentation.toolset.jsonc',
    prompts: 'prompts/documentation.prompt.md',
  },
  ci_cd: {
    instructions: 'instructions/ci-cd.instructions.md',
    toolset: 'toolsets/ci-cd.toolset.jsonc',
    prompts: 'prompts/ci-cd.prompt.md',
  },
  deploy: {
    instructions: 'instructions/deploy.instructions.md',
    toolset: 'toolsets/deploy.toolset.jsonc',
    prompts: 'prompts/deploy.prompt.md',
  },
  updates: {
    instructions: 'instructions/updates.instructions.md',
    toolset: 'toolsets/updates.toolset.jsonc',
    prompts: 'prompts/updates.prompt.md',
  },
};

export default phases;