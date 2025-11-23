script({
  title: "Loaded Vibes Orchestrator",
  description: "Orchestrates the Loaded Vibes development framework cycles.",
  parameters: {
    phase: {
      type: "string",
      description:
        "The DevCycle to run (e.g., 'scaffolding', 'features'). If omitted, determines automatically.",
    },
    task: {
      type: "string",
      description: "Specific task description for the current cycle.",
    },
  },
});

// Define the DevCycles
const phases = [
  "initialization",
  "scaffolding",
  "configuration",
  "verification",
  "data",
  "auth",
  "testing",
  "validation",
  "features",
  "debug",
  "security",
  "performance",
  "observability",
  "code_review",
  "documentation",
  "ci_cd",
  "deploy",
  "updates",
];

// Load state (mock implementation for now, would read from memory.json)
const state = {
  currentPhase: "initialization",
  completedPhases: [],
};

const requestedPhase = env.vars.phase || state.currentPhase;

if (!phases.includes(requestedPhase)) {
  console.error(
    `Invalid phase: ${requestedPhase}. Must be one of: ${phases.join(", ")}`
  );
  throw new Error("Invalid phase");
}

console.log(`🚀 Starting DevCycle: ${requestedPhase}`);

// Load the specific phase script
// In a real implementation, this would import or run the specific script.
// For this redesign, we will simulate the context gathering and prompt generation.

const context = await runPrompt((_) => {
  _.user.text(
    `Analyze the current project state and prepare for the '${requestedPhase}' phase.`
  );
  _.user.text(
    `Task: ${env.vars.task || "Execute standard phase requirements."}`
  );
  _.user.text(`Refer to global.instructions.md for phase definitions.`);
});

console.log("Phase preparation complete. Agent instructions generated.");
console.log(context.text);

// In a full GenAIScript implementation, we would now trigger the agent or tools.
// For example:
// await runScript(`phases/${requestedPhase}.genai.js`, { ...env.vars });
