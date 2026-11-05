# Factory packages

The repository root owns the Codependent Coding website. Product implementations live here.

| Package            | Responsibility                                                                                                                                 |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `maximal-template` | Shippable white-label SaaS application, its application configuration and application tests. Separate pnpm project.                            |
| `generator`        | Composition, module catalog and schema, ownership calculation, environment rendering and initial provisioning.                                 |
| `loaded-vibes`     | Editing engines (`add`, `slice`, `doctor`), doctrine enforcement, agent/governance assets, issue synchronization and database lifecycle tools. |
| `cli`              | Hipster Stack command-line interface and interactive prompts. Calls the generator and plugin engines.                                          |
| `tui`              | Codependent Coding terminal interface. Uses the same engines through the CLI's public adapters.                                                |

Factory scripts, manifests, agent instructions and doctrine implementations never live in `maximal-template`.

The generator owns `generator/assets/hipster.modules.json` and its JSON Schema. It writes a selected application's editing metadata into `.loaded-vibes/`; the SaaS runtime never reads that metadata. Runtime module and seed registries remain application code. The plugin owns all subsequent changes to the app and its editing metadata.

From the repository root:

```powershell
pnpm cli --help
pnpm tui
pnpm template:modules
pnpm template:ownership
pnpm template:env
pnpm template:lint
pnpm --dir packages/maximal-template typecheck
pnpm plugin check:modules --app D:/Apps/my-app
```

`db:init`, `db:rls`, `db:rls:check` and `issues:sync` are plugin commands, not application package scripts. Run them deliberately with `pnpm plugin <command> --app <directory>`. Database commands retain their existing migration and RLS behavior; relocating them does not run them.
