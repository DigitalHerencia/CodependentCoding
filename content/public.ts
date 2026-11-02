// Owner-approved public page copy; preserve wording.

export const siteOperator = {
  name: "Digital Herencia",
  site: "The Codependent Coding™ Web App Architecture",
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
