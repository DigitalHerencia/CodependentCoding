---
title: Loaded Vibes Release Contract
artifact: release
status: active
product: Loaded Vibes
authority: source-of-truth
---

# Loaded Vibes Release Contract

## Release outcome

A release is ready when the package and website describe and ship the same product:

- one repository-owned maximal template;
- one shared configuration contract;
- deterministic generation from that template;
- the canonical `loaded-vibes` CLI surface;
- the stateless `/configure` handoff;
- end-user docs that match the released behavior;
- no live or documented dependency on `DigitalHerencia/Vibes`.

## Package contents

The package should include only the compiled CLI/core assets and template/configuration material required for local generation.

Once migration is complete, packaging should reference `template/`, not `templates/golden` or `templates/modules`.

## Naming

`loaded-vibes` is the canonical command.

The package-name transition from `create-loaded-vibes` should be handled deliberately and only when publishing constraints are known. Do not silently claim a package name has been published or reserved.

## Provider setup

Loaded Vibes may generate provider-ready boundaries and `.env.example` documentation. It does not own:

- user provider accounts;
- production credentials;
- live webhook destinations;
- commercial configuration;
- production database migration approval;
- Vercel project/domain promotion.

## Verification

Do not add new tests or validation systems for this migration.

Use existing relevant checks required to establish the changed release behavior. Broader package checks are appropriate only for the release Issue that changes packaging or publishing behavior.

Never claim unrun evidence.
