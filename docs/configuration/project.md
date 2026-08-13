# Project configuration

`hipster-stack create [directory]` controls the destination. The recipe `name` controls package identity, while `identity.displayName` controls visible product naming.

Lifecycle flags:

- `--name <package-name>` overrides the recipe package name.
- `--config <path>` loads the shared JSON contract.
- `--yes` runs non-interactively.
- `--no-git` skips Git initialization.
- `--skip-install` skips dependency installation and generated acceptance validation.
- `--dry-run` plans without writing files.

Generation refuses an unsafe non-empty destination.
