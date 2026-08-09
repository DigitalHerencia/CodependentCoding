# Loaded Vibes

Loaded Vibes is an opinionated SaaS project initializer. It generates the canonical, governed Hipster Stack application embedded in `template/`; it is not a stack selector or blank scaffold.

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

The canonical product and architecture sources live in [`context/`](context/README.md). Machine contracts and execution evidence live in [`.agents/`](.agents/AGENTS.md).
