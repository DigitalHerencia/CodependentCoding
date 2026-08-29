# hipster-stack create

```powershell
hipster-stack create [directory] [options]
```

Create normalizes one recipe, resolves capability dependencies, reviews the plan, copies the master template, prunes excluded ownership, applies transforms, writes configuration and provenance, and optionally installs dependencies and initializes Git.

Use `--config hipsterstack.json --yes` for reproducible non-interactive generation. See [project configuration](/docs/configuration/project) for supported flags.
