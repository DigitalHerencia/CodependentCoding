#!/bin/bash
# Validation script to check milestone and issue assignments

set -e

REPO="DigitalHerencia/CodependentCoding"

echo "🔍 Validating GitHub Projects v2 Setup"
echo "======================================"

# Check if GitHub CLI is available and authenticated
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI is not installed."
    exit 1
fi

if ! gh auth status &> /dev/null; then
    echo "❌ GitHub CLI is not authenticated."
    exit 1
fi

echo "📋 Checking Milestones..."
echo "========================"

# Get all milestones
MILESTONES=$(gh api repos/$REPO/milestones --jq '.[].title')

# Expected milestones
EXPECTED_MILESTONES=(
    "Phase 1 — Foundation"
    "Phase 2 — Core Features" 
    "Phase 3 — UX & Analytics"
    "Phase 4 — Polish & Docs"
)

for milestone in "${EXPECTED_MILESTONES[@]}"; do
    if echo "$MILESTONES" | grep -q "$milestone"; then
        echo "✅ Found: $milestone"
    else
        echo "❌ Missing: $milestone"
    fi
done

echo ""
echo "📌 Checking Issue Assignments..."
echo "==============================="

# Expected assignments
declare -A EXPECTED_ASSIGNMENTS=(
    ["Phase 1 — Foundation"]="1 2 3 4 5 16"
    ["Phase 2 — Core Features"]="6 7 8 9 10 11"
    ["Phase 3 — UX & Analytics"]="12 13 14 15"
    ["Phase 4 — Polish & Docs"]="17 18"
)

for milestone in "${EXPECTED_MILESTONES[@]}"; do
    echo ""
    echo "Checking assignments for: $milestone"
    
    # Get milestone number
    MILESTONE_NUM=$(gh api repos/$REPO/milestones --jq ".[] | select(.title==\"$milestone\") | .number")
    
    if [ -z "$MILESTONE_NUM" ]; then
        echo "❌ Milestone not found: $milestone"
        continue
    fi
    
    # Get issues assigned to this milestone
    ASSIGNED_ISSUES=$(gh api repos/$REPO/issues --jq ".[] | select(.milestone.number==$MILESTONE_NUM) | .number" | sort -n | tr '\n' ' ')
    EXPECTED_ISSUES=${EXPECTED_ASSIGNMENTS["$milestone"]}
    
    echo "  Expected: $EXPECTED_ISSUES"
    echo "  Assigned: $ASSIGNED_ISSUES"
    
    if [ "$ASSIGNED_ISSUES" = "$EXPECTED_ISSUES " ]; then
        echo "  ✅ Assignments correct"
    else
        echo "  ⚠️  Assignments differ from expected"
    fi
done

echo ""
echo "📊 Summary"
echo "========="

# Count total milestones
MILESTONE_COUNT=$(echo "$MILESTONES" | wc -l)
echo "Total milestones: $MILESTONE_COUNT/4"

# Count total issues with milestones
ISSUES_WITH_MILESTONES=$(gh api repos/$REPO/issues --jq '[.[] | select(.milestone != null)] | length')
echo "Issues with milestones: $ISSUES_WITH_MILESTONES/16"

echo ""
echo "🎯 Next Steps:"
echo "1. Create GitHub Projects v2 board via web UI"
echo "2. Add columns: Backlog, Selected, In progress, In review, QA, Done"
echo "3. Configure automations as per docs/github-projects-setup.md"
echo "4. Add all T001-T019 issues to the project board"

echo ""
echo "📚 Documentation: docs/github-projects-setup.md"