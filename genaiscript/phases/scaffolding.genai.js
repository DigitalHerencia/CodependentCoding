script({
  title: "DevCycle: Scaffolding",
  description: "Generates project structure based on PRD and Tech Spec.",
  tools: ["fs", "git"], // Enable filesystem and git tools
});

// 1. Read PRD and Tech Spec
const prdFiles = await fs.findFiles("docs/specs/*.md");
const prdContent = await fs.readText(prdFiles);

// 2. Generate File Structure Plan
const plan = await runPrompt((_) => {
  _.system.text("You are an expert software architect.");
  _.user.text(
    "Based on the following PRD and Tech Spec, design a comprehensive file structure for a Next.js 15 application."
  );
  _.user.text("Include folders for features, components, libs, and tests.");
  _.user.text(
    "Output the structure as a JSON object where keys are paths and values are brief descriptions."
  );
  _.user.text("PRD Content:");
  _.user.text(prdContent);
});

const fileStructure = JSON.parse(plan.text); // Assuming LLM returns valid JSON (would need validation in prod)

console.log("Proposed File Structure:", fileStructure);

// 3. (Optional) Execute creation - usually we ask for confirmation first
// For this script, we'll just output the plan for the user/agent to review.
// In a fully automated mode, we could use fs.writeFile to create placeholders.

// 4. Update Todo and Changelog
await runPrompt((_) => {
  _.system.text("Update the project tracking files.");
  _.user.text(
    "Add the scaffolding tasks to todo.md and log the plan in CHANGELOG.md"
  );
});
