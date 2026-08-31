# Evidence and Completion Rules

Completion claims are about executed reality.

Use these distinctions:

```text
expected     ≠ passed
configured   ≠ working
materialized ≠ validated
generated    ≠ provider-ready
deployed     ≠ smoke-verified
```

For each check report:

- exact command or tool used;
- whether it ran;
- exit/result status;
- relevant failure summary;
- what remains unverified.

Choose validation proportional to the changed behavior and blast radius. Do not automatically run every broad suite for a small change. Do not omit a focused high-value check merely because a broad suite exists.
