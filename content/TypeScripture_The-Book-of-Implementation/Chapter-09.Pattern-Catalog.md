# Chapter 09: Pattern Catalog

**The Book of Implementation™**

## Canonical placement

```text
lib/fetchers/                 P01
lib/actions/                  P02
lib/<domain>/workflows/       P03
lib/db/transactions/          P04
lib/auth/ + lib/authz/        P05
lib/webhooks/                 P06
app/ + features/ + components/ P07
architecture/import rules     P08
domain/lifecycle modules       P09
context/contracts/decisions    P10
```

## Implementation rule

- Use one obvious owner for each side effect/decision. Do not instantiate every supporting pattern as a folder or file when the concrete product does not need it.
