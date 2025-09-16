Project Setup & Milestones

This repository follows the Plan -> Tasks -> Implementation workflow. Use the files in `specs/001-product-requirements-document/` as the source of truth.

Milestones (suggested):
- Phase 1: Foundation (T001-T005, T017)
- Phase 2: Core Features (T006-T011, T008)
- Phase 3: UX and Analytics (T012-T016)
- Phase 4: Polish & Docs (T018-T019)

To create the GitHub milestones and a Projects v2 board using the GitHub CLI:

```pwsh
# Create milestones
gh api repos/:owner/:repo/milestones -F title='Phase 1' -F description='Foundation work (prisma, contracts, CI)'
gh api repos/:owner/:repo/milestones -F title='Phase 2' -F description='Core features (webhooks, archive CRUD, upload)'
gh api repos/:owner/:repo/milestones -F title='Phase 3' -F description='Viewer, tagging, analytics'
gh api repos/:owner/:repo/milestones -F title='Phase 4' -F description='Deploy, polish, docs'

# Create a Projects v2 board (example)
# See: https://docs.github.com/en/issues/organizing-your-work-with-projects/creating-a-project
# Use gh beta projects create --name "Roadmap" --body "Project board for roadmap"
```

This file acts as the canonical milestone and project plan. The `gh` CLI commands are provided for maintainers to run locally or in CI.
