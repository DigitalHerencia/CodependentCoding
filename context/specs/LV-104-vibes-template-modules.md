# LV-104 — Vibes-derived golden template and capability modules

## Outcome

Turn the proven Vibes application into a composable generator source without creating a second SaaS architecture.

## Scope

- inventory the current packaged template against `DigitalHerencia/Vibes` only as needed for this change;
- establish `templates/golden` as the self-contained packaged base;
- extract clean optional capability overlays where Vibes evidence supports it;
- prioritize marketing/onboarding/admin/sample-domain and Stripe Connect separability;
- keep core auth/tenancy/RBAC/application grammar fixed.

## Acceptance

- generated output derives from the Vibes baseline;
- optional module inclusion/exclusion is intentional and does not leave obvious broken imports/routes/config;
- no remote GitHub fetch is required for normal generation;
- no new application architecture is invented by the generator.
