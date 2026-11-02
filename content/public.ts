// Owner-approved public page copy; preserve wording.

export const siteNavigation = [
  { label: "Doctrine", href: "/doctrine" },
  { label: "Maximal", href: "/maximal" },
  { label: "Hipster Stack", href: "/hipster-stack" },
  { label: "Loaded Vibes", href: "/loaded-vibes" },
] as const;

export const doctrineRelease = {
  version: "1.0",
  verifiedOn: "2026-10-31",
} as const;

export const siteOperator = {
  name: "Digital Herencia",
  site: "The Codependent Coding™ Web App Architecture",
  repositoryUrl: "https://github.com/DigitalHerencia/CodependentCoding",
  issuesUrl: "https://github.com/DigitalHerencia/CodependentCoding/issues",
  securityUrl:
    "https://github.com/DigitalHerencia/CodependentCoding/security/policy",
} as const;

export const loadedVibesCopy = {
  kicker: "The",
  title: "Loaded Vibes™",
  subtitle: "The Claude Code plugin",
  tagline: "Controlled Vibe Coding under professional supervision",
  install: [
    {
      title: "1. Add the marketplace (inside Claude Code)",
      code: "/plugin marketplace add DigitalHerencia/CodependentCoding",
    },
    {
      title: "2. Install the plugin",
      code: "/plugin install loaded-vibes@codependent-coding",
    },
    {
      title: "3. Restart, open your app, start the grill",
      code: "/loaded-vibes:idea",
    },
  ],
  installNote:
    "Run it inside an app made by the Hipster Stack™ CLI. Restart Claude Code after installing; the skills appear as /loaded-vibes:<skill>.",
  hooks: [
    {
      name: "Lint-on-edit hook",
      description:
        "Lints every file Claude edits and hands back the CC-* findings before it can pretend everything is fine.",
    },
    {
      name: "Execution-state guard",
      description:
        "Blocks the session from stopping once if code changed but progress, decisions and handoff were not updated. Accountability, but automated.",
    },
  ],
  day: [
    {
      time: "09:00",
      text: "/idea grills you until the PRD stops saying TODO.",
    },
    {
      time: "09:40",
      text: "/plan turns the PRD into issues you will ignore in order.",
    },
    {
      time: "10:15",
      text: "/classify tells you where the file goes. You were wrong.",
    },
    {
      time: "11:00",
      text: "/slice scaffolds the entity; Claude writes only the rules the scaffold could not guess.",
    },
    {
      time: "14:30",
      text: "/check reruns everything until it exits 0. Nobody says “should pass.”",
    },
    {
      time: "16:00",
      text: "/ship pushes to production and smoke-tests the URL.",
    },
    {
      time: "16:05",
      text: "/handoff writes it all down so tomorrow-you doesn't have to ask.",
    },
  ],
} as const;

export const maximalCopy = {
  kicker: "The",
  title: "Maximal Template™",
  subtitle: "Normalized defaults · read-only",
  line: "One runnable app containing the base and every module. Build maximal. Select deliberately. Delete aggressively.",
} as const;

export const hipsterStackCopy = {
  kicker: "The",
  title: "Hipster Stack™",
  subtitle: "Command builder · formerly The Anthimeria™ Workbench",
  line: "Now with 100% fewer servers. Pick the command, fill the form, copy the pasta. The flags come straight from the CLI source, so this page changes when the CLI does.",
} as const;

export const landingCopy = {
  eyebrow: "Codependent Coding · The software factory",
  title: ["When epistemologies fail", "the stack still governs"],
  description:
    "An opinionated, executable engineering doctrine for Next.js SaaS — and the factory that generates apps from it.",
  primaryAction: "Read the doctrine",
  secondaryAction: "Browse the template",
  signoff: "Nothing to borrow. We checked.",
  architectureLabel: "01 / The architecture",
  architectureTitle: "Every file has a job.",
  clauses: [
    "Routes own URL and HTTP boundaries.",
    "Features orchestrate application capabilities.",
    "Components render.",
    "Fetchers read persisted data.",
    "Actions own ordinary CRUD mutation boundaries.",
    "Schemas validate runtime input.",
    "Workflows constitute reusable application logic from server operations and helpers.",
    "Transactions preserve atomic database invariants.",
    "Authentication establishes identity.",
    "Authorization decides access.",
    "Integrations own provider mechanics.",
    "Webhooks own provider HTTP request lifecycles.",
  ],
  partsLabel: "02 / One connected system",
  partsTitle: "Understand it. Generate it. Make it yours.",
  parts: [
    {
      title: "Doctrine",
      description:
        "The architecture, responsibilities and rules behind every generated app.",
      href: "/doctrine",
      metric: "rules",
      unit: "architecture rules",
      action: "Read the doctrine",
    },
    {
      title: "Maximal Template",
      description:
        "The runnable SaaS reference. Start complete, then select what your MVP needs.",
      href: "/maximal",
      metric: "modules",
      unit: "composable modules",
      action: "Explore the source",
    },
    {
      title: "Hipster Stack",
      description:
        "The CLI and TUI that turn your choices into your own white-label app.",
      href: "/hipster-stack",
      metric: "commands",
      unit: "CLI commands",
      action: "Build your command",
    },
    {
      title: "Loaded Vibes",
      description:
        "The Claude Code plugin that carries the architecture into your daily work.",
      href: "/loaded-vibes",
      metric: "skills",
      unit: "workflow skills",
      action: "Meet the plugin",
    },
  ],
  proofLabel: "03 / Follow the source",
  proofTitle: "The receipts are in the repo.",
  proofs: [
    {
      title: "Rules with named enforcement",
      description:
        "Each rule names its lint, script, configuration or review boundary.",
      href: "/doctrine/rules",
    },
    {
      title: "Tenant isolation, exercised",
      description: "Read the RLS tests that run against real Postgres.",
      href: "https://github.com/DigitalHerencia/CodependentCoding/blob/main/template/tests/rls/tenantIsolation.test.ts",
    },
    {
      title: "Ownership computed from source",
      description:
        "Module ownership follows the files, rather than a second catalog.",
      href: "https://github.com/DigitalHerencia/CodependentCoding/blob/main/template/scripts/ownership.mjs",
    },
  ],
  heritageLabel: "Built by Digital Herencia",
  heritageDescription:
    "A foundation for your next idea. Your app, your identity, your product to validate.",
} as const;
