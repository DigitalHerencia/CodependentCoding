# Troubleshooting

## The destination is not empty

Choose an empty directory. Hipster Stack will not overwrite an existing project.

## Installation was skipped or failed

Run `corepack pnpm install` inside the generated project, then run its documented validation command.

## Doctor reports missing environment values

Copy the generated `.env.example` to the appropriate local environment file and supply credentials from provider projects you own. Never commit secrets.

## A provider-backed journey is not ready

Confirm the account, environment variables, webhook destination, database URLs or migration state, and provider dashboard configuration. Generation creates integration boundaries; it does not configure external services.

## Add reports a collision

Review the listed paths. The command stops rather than silently overwriting user-modified files outside its declared replacement contract.
