#!/bin/bash
# GitHub Projects v2 Kanban Board Setup Script
# This script creates milestones and provides instructions for GitHub Projects v2 board creation

set -e

echo "🚀 Setting up GitHub Projects v2 Kanban Board for ChatGPT Archive Utility"
echo "======================================================================"

# Check if GitHub CLI is available and authenticated
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI is not installed. Please install it from https://cli.github.com/"
    exit 1
fi

# Verify authentication
if ! gh auth status &> /dev/null; then
    echo "❌ GitHub CLI is not authenticated. Please run 'gh auth login' first."
    exit 1
fi

# Accept repository as first argument or from GITHUB_REPO environment variable
if [ -n "$1" ]; then
    REPO="$1"
elif [ -n "$GITHUB_REPO" ]; then
    REPO="$GITHUB_REPO"
else
    echo "❌ Repository name not specified."
    echo "   Usage: $0 <owner/repo>  (or set GITHUB_REPO environment variable)"
    exit 1
fi

echo "📋 Creating Milestones..."
echo "========================"

# Phase 1 — Foundation (T001, T002, T003, T004, T005, T017)
echo "Creating Phase 1 — Foundation milestone..."
gh api repos/$REPO/milestones \
  --method POST \
  --field title='Phase 1 — Foundation' \
  --field description='Foundation tasks: DB, contracts, CI, basic features (T001, T002, T003, T004, T005, T017)' \
  --field due_on='2025-10-01T23:59:59Z' \
  --field state='open' || echo "⚠️  Phase 1 milestone may already exist"

# Phase 2 — Core Features (T006, T007, T008, T009, T010, T011)
echo "Creating Phase 2 — Core Features milestone..."
gh api repos/$REPO/milestones \
  --method POST \
  --field title='Phase 2 — Core Features' \
  --field description='Core functionality: webhooks, actions, CRUD, search, admin (T006, T007, T008, T009, T010, T011)' \
  --field due_on='2025-11-01T23:59:59Z' \
  --field state='open' || echo "⚠️  Phase 2 milestone may already exist"

# Phase 3 — UX & Analytics (T012, T013, T014, T015)
echo "Creating Phase 3 — UX & Analytics milestone..."
gh api repos/$REPO/milestones \
  --method POST \
  --field title='Phase 3 — UX & Analytics' \
  --field description='User experience and analytics: viewer, tagging, timeline, dev tools (T012, T013, T014, T015)' \
  --field due_on='2025-12-01T23:59:59Z' \
  --field state='open' || echo "⚠️  Phase 3 milestone may already exist"

# Phase 4 — Polish & Docs (T018, T019)
echo "Creating Phase 4 — Polish & Docs milestone..."
gh api repos/$REPO/milestones \
  --method POST \
  --field title='Phase 4 — Polish & Docs' \
  --field description='Final polish: deployment preparation and documentation (T018, T019)' \
  --field due_on='2025-12-31T23:59:59Z' \
  --field state='open' || echo "⚠️  Phase 4 milestone may already exist"

echo ""
echo "✅ Milestone creation completed!"
echo ""

echo "📌 Assigning Issues to Milestones..."
echo "==================================="

# Get milestone numbers for assignment
PHASE1_NUM=$(gh api repos/$REPO/milestones --jq '.[] | select(.title=="Phase 1 — Foundation") | .number')
PHASE2_NUM=$(gh api repos/$REPO/milestones --jq '.[] | select(.title=="Phase 2 — Core Features") | .number')
PHASE3_NUM=$(gh api repos/$REPO/milestones --jq '.[] | select(.title=="Phase 3 — UX & Analytics") | .number')
PHASE4_NUM=$(gh api repos/$REPO/milestones --jq '.[] | select(.title=="Phase 4 — Polish & Docs") | .number')

# Phase 1 assignments: T001, T002, T003, T004, T005, T017 (issues #1-5, #16)
echo "Assigning Phase 1 issues (T001-T005, T017)..."
for issue_num in 1 2 3 4 5 16; do
    gh api repos/$REPO/issues/$issue_num \
      --method PATCH \
      --field milestone=$PHASE1_NUM || echo "⚠️  Could not assign issue #$issue_num"
done

# Phase 2 assignments: T006, T007, T008, T009, T010, T011 (issues #6-11)
echo "Assigning Phase 2 issues (T006-T011)..."
for issue_num in 6 7 8 9 10 11; do
    gh api repos/$REPO/issues/$issue_num \
      --method PATCH \
      --field milestone=$PHASE2_NUM || echo "⚠️  Could not assign issue #$issue_num"
done

# Phase 3 assignments: T012, T013, T014, T015 (issues #12-15)
echo "Assigning Phase 3 issues (T012-T015)..."
for issue_num in 12 13 14 15; do
    gh api repos/$REPO/issues/$issue_num \
      --method PATCH \
      --field milestone=$PHASE3_NUM || echo "⚠️  Could not assign issue #$issue_num"
done

# Phase 4 assignments: T018, T019 (issues #17-18)
echo "Assigning Phase 4 issues (T018-T019)..."
for issue_num in 17 18; do
    gh api repos/$REPO/issues/$issue_num \
      --method PATCH \
      --field milestone=$PHASE4_NUM || echo "⚠️  Could not assign issue #$issue_num"
done

echo ""
echo "✅ Issue milestone assignments completed!"
echo ""

echo "🎯 Next Steps: GitHub Projects v2 Board Creation"
echo "==============================================="
echo ""
echo "Since GitHub CLI has limited support for Projects v2, follow these steps in the GitHub web UI:"
echo ""
echo "1. Go to: https://github.com/DigitalHerencia/CodependentCoding/projects"
echo "2. Click 'New project'"
echo "3. Choose 'Board' template"
echo "4. Name: 'Roadmap — ChatGPT Archive Utility'"
echo "5. Description: 'Kanban for phased delivery'"
echo ""
echo "🏗️  Recommended Columns:"
echo "   • Backlog"
echo "   • Selected" 
echo "   • In progress"
echo "   • In review"
echo "   • QA"
echo "   • Done"
echo ""
echo "⚙️  Automation Rules (Project Settings → Automation):"
echo "   • When PR is opened linking an issue → Move to 'In review'"
echo "   • When PR is merged or issue closed → Move to 'Done'"
echo "   • When issue is added to milestone → Move to 'Selected'"
echo ""
echo "📋 Add all T001-T019 issues to the board and they will be auto-organized by milestone!"
echo ""
echo "🎉 Setup complete! All milestones created and issues assigned."