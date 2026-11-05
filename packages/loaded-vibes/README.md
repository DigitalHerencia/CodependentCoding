# Loaded Vibes plugin and application editor

`@codependent/loaded-vibes` contains the Claude Code plugin, editing engines, doctrine ESLint rules, governance assets and application maintenance commands. Its marketplace entry points at this package.

- `src/`: module addition, slice editing and doctor checks.
- `templates/`: editing and authorization source fragments.
- `eslint/`: doctrine enforcement and the external application lint adapter.
- `scripts/`: validation, database lifecycle, issue synchronization and plugin helpers.
- `assets/app-governance/`: governance rendered for a new app.
- `assets/maximal-template/`: retained template documentation and governance history, outside the shippable application.
- `skills/`, `agents/`, `hooks/`, `references/`, `evals/`: agent integration.

Run from the factory root:

```powershell
pnpm plugin lint --app packages/maximal-template
pnpm plugin check:modules --app D:/Apps/my-app
pnpm plugin check:ownership --app D:/Apps/my-app
pnpm plugin check:env --app D:/Apps/my-app
```

The `loaded-vibes` package binary is shorthand for `node <factory>/packages/loaded-vibes/scripts/app.mjs`. Agent hooks use the plugin's absolute location. The application supplies its own installed ESLint, TypeScript and Prisma; plugin commands accept `--app` and do not require copies of tooling in that application.

Database commands are `db:init`, `db:rls` and `db:rls:check`. Issue synchronization is `issues:sync` (dry run unless `--apply`). These commands act only when explicitly invoked. They retain migration history, RLS and credential handling; no database operation runs during package relocation.
