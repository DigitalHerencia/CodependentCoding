# Loaded Vibes Agent Instructions

Loaded Vibes is a product generator with a CLI and visual configurator. Its job is to get a builder from product intent to a useful, good-looking, correctly shaped SaaS starting point with as little friction as possible.

## Read first

1. Read the GitHub Issue you are implementing.
2. Read `context/README.md` and the relevant `context/docs/*` files.
3. Read the matching `context/specs/LV-*.md` specification.
4. Inspect the actual implementation you will change and the relevant Vibes source/template material.
5. Read `.agents/contracts/product.yaml` and `architecture.yaml` for fixed product boundaries.

## Product priority

Optimize in this order:

1. user value and time saved;
2. clear, enjoyable CLI/web UX;
3. generated output matching the user's intended product shape;
4. reuse of the proven Vibes application baseline;
5. maintainable generator mechanics;
6. proportional safety and verification.

Do not turn Loaded Vibes into an enterprise governance platform, generic framework, provider marketplace, hosted control plane, or validation product.

## Product model

```text
CLI / Web Configurator / loadedvibes.json
                 ↓
            Recipe Core
                 ↓
      preset + capability resolver
                 ↓
       generation plan + modules
                 ↓
       Vibes-derived golden template
                 ↓
    identity + design personalization
                 ↓
          useful SaaS project
```

The CLI is an execution surface. The web app is a visual configuration and preview surface. `loadedvibes.json` is the reproducible recipe. All three use the same core schema and resolver.

## Implementation rules

- Work one Issue/spec at a time.
- Make the smallest complete change that satisfies the user-visible outcome.
- Preserve working implementation unless the current Issue requires restructuring it.
- Ask users about product choices, not fixed architecture internals.
- Express and Advanced setup modes must normalize into the same recipe model.
- Product presets describe outcomes such as B2B SaaS, client portal, marketplace/platform, or bare golden app.
- Capabilities resolve prerequisites automatically. Do not make users answer implementation-detail questions implied by a capability.
- Keep Vibes as the upstream reference for the generated SaaS baseline; keep Loaded Vibes self-contained for normal package execution.
- Generated apps preserve the Hipster Stack application grammar and security boundaries already embodied by Vibes.
- Never collect or print provider secrets.
- Never overwrite an unrelated non-empty destination without an explicit user-controlled future feature.
- Windows/PowerShell remains first-class.

## Verification

Use proportional verification. Run checks that establish the behavior changed by the current Issue. Do not automatically run the entire repository, generated-app, provider, browser, release, or deployment matrix for ordinary work.

Release/package work may require broader proof when the Issue explicitly says so. Never claim an unrun check passed.

## Delivery

- Open a focused PR for the Issue.
- Link the Issue and summarize the user-visible outcome.
- Update governance only when the public product contract changes.
- Do not expand scope to unrelated cleanup, architecture renovation, or test creation.
