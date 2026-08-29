# Getting started

Hipster Stack requires Node.js 24 and pnpm.

## Generate a project

```powershell
pnpm dlx hipster-stack@latest create my-product
```

The interactive flow asks about supported optional surfaces, identity, and visual direction. To generate reproducibly from an exported configuration:

```powershell
pnpm dlx hipster-stack@latest create my-product --config hipsterstack.json --yes
```

Use `--dry-run` to review the plan without writing, `--skip-install` to leave dependencies uninstalled, or `--no-git` to skip repository initialization.

## Continue locally

Enter the generated directory, read its README and `.env.example`, configure the services you own, then run:

```powershell
hipster-stack doctor
hipster-stack explain
```

Provider accounts, credentials, migrations, deployment, and production verification remain your responsibility.
