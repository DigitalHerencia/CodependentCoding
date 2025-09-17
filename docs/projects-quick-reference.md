# Quick Reference: GitHub Projects v2 Setup Commands

## Create Milestones (Copy-paste ready)

```bash
# Phase 1 — Foundation
gh api repos/DigitalHerencia/CodependentCoding/milestones \
  --method POST \
  --field title='Phase 1 — Foundation' \
  --field description='Foundation tasks: DB, contracts, CI, basic features' \
  --field due_on='2025-10-01T23:59:59Z'

# Phase 2 — Core Features  
gh api repos/DigitalHerencia/CodependentCoding/milestones \
  --method POST \
  --field title='Phase 2 — Core Features' \
  --field description='Core functionality: webhooks, actions, CRUD, search, admin' \
  --field due_on='2025-11-01T23:59:59Z'

# Phase 3 — UX & Analytics
gh api repos/DigitalHerencia/CodependentCoding/milestones \
  --method POST \
  --field title='Phase 3 — UX & Analytics' \
  --field description='User experience and analytics: viewer, tagging, timeline, dev tools' \
  --field due_on='2025-12-01T23:59:59Z'

# Phase 4 — Polish & Docs
gh api repos/DigitalHerencia/CodependentCoding/milestones \
  --method POST \
  --field title='Phase 4 — Polish & Docs' \
  --field description='Final polish: deployment preparation and documentation' \
  --field due_on='2025-12-31T23:59:59Z'
```

## Task-to-Milestone Assignments

- **Phase 1**: T001, T002, T003, T004, T005, T017 (Issues #1, #2, #3, #4, #5, #16)
- **Phase 2**: T006, T007, T008, T009, T010, T011 (Issues #6, #7, #8, #9, #10, #11)  
- **Phase 3**: T012, T013, T014, T015 (Issues #12, #13, #14, #15)
- **Phase 4**: T018, T019 (Issues #17, #18)

## Projects v2 Board Config

- **Name**: `Roadmap — ChatGPT Archive Utility`
- **Columns**: Backlog, Selected, In progress, In review, QA, Done
- **Automations**:
  - PR opened linking issue → Move to "In review"
  - PR merged or issue closed → Move to "Done"  
  - Issue added to milestone → Move to "Selected"

## Automated Setup

```bash
./scripts/setup-github-projects.sh
```

For full instructions see: `docs/github-projects-setup.md`
