# LV-107 — `doctor` and `explain`

## Outcome

Help users understand and finish configuring their generated project without sending them into the architecture basement.

## Scope

- implement `doctor` for actionable local/config/provider readiness checks;
- implement `explain` from recipe/manifest data;
- distinguish missing user setup from generator defects;
- keep output concise and remediation-oriented.

## Acceptance

- doctor identifies common missing prerequisites with exact next actions;
- explain reports preset, capabilities/modules, design choices, provider boundaries, and remaining setup;
- neither command runs unrelated heavyweight suites by default.
