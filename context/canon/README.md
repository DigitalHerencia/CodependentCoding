# context/canon — Doctrine v1.0 and Site Refurbishment (proposed)

Status: **decided and locked 2026-10-31** (DEC-082 … DEC-090). The site goes live on it through CC-059; the template conforms through CC-069 … CC-078. Work starts at CC-047 (see `.claude/execution/handoff.json`).

| File                                                          | What it is                                                                                                                                                                     |
| ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `00-reconciliation-ledger.md`                                 | Every source, how the doctrine evolved, every contradiction with its decision and reason, every tracker open question closed, confirmed template findings, dated vendor facts. |
| `doctrine/00-preface.md` … `13-compliance-and-performance.md` | The canon: 14 chapters. Each rule block has ID, tier, enforcement, statement, reason.                                                                                          |
| `doctrine/90-appendix-a-rule-index.md`                        | Generated rule table (143 rules: 135 `now`, 6 `users`, 2 `scale`). Regenerate, never hand-edit.                                                                                |
| `doctrine/91-appendix-b-glossary.md`                          | Standard terms mapped to house names.                                                                                                                                          |
| `doctrine/92-appendix-c-golden-slice.md`                      | One complete vertical slice in code.                                                                                                                                           |
| `refurbish/PLAN.md`                                           | Site refurbishment: quality bar, audit, IA, every page, codebase architecture, design system, content, tests, milestones, risks.                                               |
| `refurbish/legal.md`                                          | Final Terms, Privacy, Security policy and security.txt (effective 2026-11-01).                                                                                                 |
| `context/specs/issues/CC-046 … CC-078`                        | 33 issues (23 site, 10 template), `status: todo`, in `issues.index.json`, milestones M-S1 … M-S6 and M-T.                                                                      |

## Old pages → canon

| Live page(s)                                      | Canon                                                   |
| ------------------------------------------------- | ------------------------------------------------------- |
| Start here (TypeScripture)                        | 00 Preface                                              |
| Architecture §1–3, BoK/BoI 03, 08, 09, 11, 14, 24 | 01 The Model                                            |
| BoK/BoI 23 Tech Stack Map, tech-requirements      | 02 Foundation                                           |
| Architecture §3 (routes), BoK/BoI 24              | 03 Routing and Rendering                                |
| Design.md, BoI 11 (presentation)                  | 04 Presentation                                         |
| BoK/BoI 20 Transaction Helper, AUTH §6            | 05 Data                                                 |
| BoK/BoI 15, AUTH §1–5, §10                        | 06 Identity, Tenancy and Access                         |
| BoK/BoI 14, 16, 18, AUTH §8                       | 07 Server Operations                                    |
| BoK/BoI 19, 21, AUTH §7                           | 08 Integrations, Webhooks and Background Work           |
| (new — tracker L6)                                | 09 Progressive Web App                                  |
| AUTH §9, §11                                      | 10 Security Baseline                                    |
| Architecture §5.2, naming tables                  | 11 Conventions                                          |
| BoK/BoI 01, 02, 12, 13, 17, Architecture §8–9     | 12 Quality and Delivery                                 |
| (new — tracker L10)                               | 13 Compliance and Performance                           |
| The CC-* rules                                    | Appendix A                                              |
| BoK/BoI 05, 06, 07, 10, 22                        | retired (documentation-system metawork; see ledger S-2) |

## Regenerating the rule index

`python3 context/canon/doctrine-index.py context/canon/doctrine` until CC-056 replaces it with `pnpm doctrine:index`.
