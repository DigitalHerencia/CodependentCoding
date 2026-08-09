# Loaded Vibes

Loaded Vibes is an opinionated SaaS project initializer. It generates the canonical, governed Hipster Stack application from the packaged `templates/golden/` baseline; it is not a stack selector or blank scaffold.

```powershell
pnpm dlx create-loaded-vibes@latest my-product
```

Workspace development:

```powershell
corepack pnpm install --frozen-lockfile
corepack pnpm validate
corepack pnpm dev -- my-product --yes
```

Use `--config <path>` for versioned non-interactive JSON configuration, `--dry-run` to inspect the plan, `--no-git` to skip Git initialization, or `--skip-install` to generate without claiming acceptance validation.

Generated projects include `.loadedvibes/manifest.json`. From a generated project, an installed CLI can add one explicitly supported capability overlay:

```powershell
loaded-vibes add marketing
loaded-vibes add sample-domain
loaded-vibes add stripe-connect
```

The command resolves capability prerequisites, previews files and setup, and refuses user-modified collisions. It does not merge arbitrary template upgrades.

The canonical product and architecture sources live in [`context/`](context/README.md). Machine contracts and execution evidence live in [`.agents/`](.agents/AGENTS.md).
