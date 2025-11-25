---
name: "TemplatePrompt"
description: "Template for creating DevCycle prompts. Each prompt triggers a specific DevCycle."
argument-hint: "Provide the context or parameters for this cycle."
agent: agent
tools:['edit', 'runNotebooks', 'search', 'new', 'runCommands', 'runTasks', 'usages', 'vscodeAPI', 'problems', 'changes', 'testFailure', 'openSimpleBrowser', 'fetch', 'githubRepo', 'extensions', 'todos', 'runSubagent', 'runTests']
---

# Prompt Template

This template can be copied and customized for each DevCycle. Replace the placeholders with the specific cycle name, instruction path, and toolset.

**Instructions**: Refer to `${instructionsFile}` for detailed guidance.

**Toolset**: Use `${toolsetName}` to determine which tools are available.

When this prompt is executed, the agent reads the corresponding instructions file, loads the toolset, and begins the tasks associated with the DevCycle.
