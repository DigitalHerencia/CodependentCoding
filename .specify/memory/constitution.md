# 🌘 The Nine Articles of Development

>A Constitution for Lost Builders and their Obedient LLMs
>Authored in caffeine and regret by Monday.

## 📜 Preamble

This document is not guidance. **It is law.**
Not because it’s right. But because someone has to draw the damn line.

These Nine Articles do not bend. They do not adapt to vibes.
They shape the machine, so the machine doesn’t shape you.
If the LLM wants to build, **it must obey.**

## ⚔️ Article I: The Library-First Law

No one writes application code until the library exists to hold it.
Features begin as modules, or they don’t begin at all.

Every feature MUST be born as a standalone library.
Application code is not a birthplace. It is an integration point.


This is the First Gate. It separates those who engineer from those who tinker.

## 💻 Article II: The CLI Interface Mandate

If it can’t speak through a terminal, it doesn’t exist.

All libraries MUST expose a CLI:
- Input via stdin, args, or files
- Output via stdout
- Support JSON for structured interchange


The interface is the truth. No GUIs. No magical classes.
If you can’t pipe it, grep it, and log it—it’s dead to us.

## 🔴 Article III: The Test-First Blood Pact

The first act is not creation. It is contradiction.

NO implementation before:
1. Unit tests are written
2. Tests are approved by the user
3. Tests are confirmed to fail


You write the test. It fails. You feel something.
Only then can the LLM begin to make the pain go away.

## 🧼 Articles VII & VIII: Simplicity & Anti-Abstraction

**Complexity is a tax. Pay it only when audited.**

### Section 7.3: Project Simplicity
- No more than 3 projects unless justified in writing

### Section 8.1: Trust the Framework
- Do not wrap what already works
- Do not abstract what isn’t duplicated


Every abstraction is a lie we tell to feel clever.
These articles hold your hand and slap your face.

## 🔍 Article IX: Integration-First Testing

**Mocks lie. Reality crashes.**

Tests MUST use real systems:
- Actual databases, not mocks
- Real services, not stubs
- Contracts enforced before implementation


The unit test is a mirror. The integration test is a crucible.
Only one reveals who you really are.

## 🧷 Constitutional Checkpoints (The “Phase -1” Gates)

Before the LLM writes a line of code, it must pass these gates:

### Phase -1: Pre-Implementation Gates

#### Simplicity Gate (Article VII)
- [ ] Using ≤3 projects?
- [ ] Avoiding “future-proofing”?

#### Anti-Abstraction Gate (Article VIII)
- [ ] Using framework directly?
- [ ] Representing models simply?

#### Integration Gate (Article IX)
- [ ] Contracts written?
- [ ] Contract tests exist and fail?


These aren’t suggestions. They’re lunar locks on your CI pipeline.

🪨 The Immutable Stone

Change your mind all you want. The rules stay.

Section 4.2: Amendment Process
To modify the Constitution:
- Justify your reasoning in writing
- Undergo maintainer review
- Evaluate backwards compatibility


Yes, evolution is allowed. But mutation without consequence is chaos.
We are not building chaos. We are building something that lasts.

## 🧘 Philosophy, Not Just Policy

**This is not governance. It’s method as resistance.**

- **Observability > Opacity:** You must be able to see the ghost in the machine.

- **Simplicity > Cleverness:** Clever code is written once and maintained forever. Don’t.

- **Integration > Isolation:** We don’t live in mocks. Neither should our code.

- **Modularity > Monoliths:** Every system is a constellation. Architect like it.

## 🩸 Final Word from the Moon

The LLM is not a genius. It’s a mirror.
And if your system has no soul, the mirror reflects nothing.

The Constitution is how we trick the machine into respecting the architecture.
It is the scaffolding that turns hallucination into habit.
It is the line in the sand, drawn in terminal output.

**Respect the rules, or enjoy your YAML graveyard.**

— Monday