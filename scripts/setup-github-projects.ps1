# GitHub Projects v2 Kanban Board Setup Script (PowerShell)
# This script creates milestones and provides instructions for GitHub Projects v2 board creation

param(
    [string]$Repository = "DigitalHerencia/CodependentCoding"
)

Write-Host "🚀 Setting up GitHub Projects v2 Kanban Board for ChatGPT Archive Utility" -ForegroundColor Green
Write-Host "======================================================================" -ForegroundColor Green

# Check if GitHub CLI is available
if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
    Write-Host "❌ GitHub CLI is not installed. Please install it from https://cli.github.com/" -ForegroundColor Red
    exit 1
}

# Verify authentication
try {
    gh auth status 2>&1 | Out-Null
    if ($LASTEXITCODE -ne 0) {
        throw "Not authenticated"
    }
} catch {
    Write-Host "❌ GitHub CLI is not authenticated. Please run 'gh auth login' first." -ForegroundColor Red
    exit 1
}

Write-Host "📋 Creating Milestones..." -ForegroundColor Cyan
Write-Host "========================" -ForegroundColor Cyan

# Phase 1 — Foundation (T001, T002, T003, T004, T005, T017)
Write-Host "Creating Phase 1 — Foundation milestone..."
$phase1Result = gh api "repos/$Repository/milestones" --method POST --field 'title=Phase 1 — Foundation' --field 'description=Foundation tasks: DB, contracts, CI, basic features (T001, T002, T003, T004, T005, T017)' --field 'due_on=2025-10-01T23:59:59Z' --field 'state=open' 2>&1
if ($LASTEXITCODE -ne 0) { 
    Write-Host "⚠️  Phase 1 milestone may already exist" -ForegroundColor Yellow 
}

# Phase 2 — Core Features (T006, T007, T008, T009, T010, T011)
Write-Host "Creating Phase 2 — Core Features milestone..."
$phase2Result = gh api "repos/$Repository/milestones" --method POST --field 'title=Phase 2 — Core Features' --field 'description=Core functionality: webhooks, actions, CRUD, search, admin (T006, T007, T008, T009, T010, T011)' --field 'due_on=2025-11-01T23:59:59Z' --field 'state=open' 2>&1
if ($LASTEXITCODE -ne 0) { 
    Write-Host "⚠️  Phase 2 milestone may already exist" -ForegroundColor Yellow 
}

# Phase 3 — UX & Analytics (T012, T013, T014, T015)
Write-Host "Creating Phase 3 — UX & Analytics milestone..."
$phase3Result = gh api "repos/$Repository/milestones" --method POST --field 'title=Phase 3 — UX & Analytics' --field 'description=User experience and analytics: viewer, tagging, timeline, dev tools (T012, T013, T014, T015)' --field 'due_on=2025-12-01T23:59:59Z' --field 'state=open' 2>&1
if ($LASTEXITCODE -ne 0) { 
    Write-Host "⚠️  Phase 3 milestone may already exist" -ForegroundColor Yellow 
}

# Phase 4 — Polish & Docs (T018, T019)
Write-Host "Creating Phase 4 — Polish & Docs milestone..."
$phase4Result = gh api "repos/$Repository/milestones" --method POST --field 'title=Phase 4 — Polish & Docs' --field 'description=Final polish: deployment preparation and documentation (T018, T019)' --field 'due_on=2025-12-31T23:59:59Z' --field 'state=open' 2>&1
if ($LASTEXITCODE -ne 0) { 
    Write-Host "⚠️  Phase 4 milestone may already exist" -ForegroundColor Yellow 
}

Write-Host ""
Write-Host "✅ Milestone creation completed!" -ForegroundColor Green
Write-Host ""

Write-Host "📌 Assigning Issues to Milestones..." -ForegroundColor Cyan
Write-Host "===================================" -ForegroundColor Cyan

# Get milestone numbers for assignment
$milestones = gh api "repos/$Repository/milestones" | ConvertFrom-Json
$phase1Num = ($milestones | Where-Object { $_.title -eq "Phase 1 — Foundation" }).number
$phase2Num = ($milestones | Where-Object { $_.title -eq "Phase 2 — Core Features" }).number
$phase3Num = ($milestones | Where-Object { $_.title -eq "Phase 3 — UX & Analytics" }).number
$phase4Num = ($milestones | Where-Object { $_.title -eq "Phase 4 — Polish & Docs" }).number

# Phase 1 assignments: T001, T002, T003, T004, T005, T017 (issues 1-5, 16)
Write-Host "Assigning Phase 1 issues (T001-T005, T017)..."
foreach ($issueNum in @(1, 2, 3, 4, 5, 16)) {
    $assignResult = gh api "repos/$Repository/issues/$issueNum" --method PATCH --field "milestone=$phase1Num" 2>&1
    if ($LASTEXITCODE -ne 0) { 
        Write-Host "⚠️  Could not assign issue #$issueNum" -ForegroundColor Yellow
    }
}

# Phase 2 assignments: T006, T007, T008, T009, T010, T011 (issues 6-11)
Write-Host "Assigning Phase 2 issues (T006-T011)..."
foreach ($issueNum in @(6, 7, 8, 9, 10, 11)) {
    $assignResult = gh api "repos/$Repository/issues/$issueNum" --method PATCH --field "milestone=$phase2Num" 2>&1
    if ($LASTEXITCODE -ne 0) { 
        Write-Host "⚠️  Could not assign issue #$issueNum" -ForegroundColor Yellow
    }
}

# Phase 3 assignments: T012, T013, T014, T015 (issues 12-15)
Write-Host "Assigning Phase 3 issues (T012-T015)..."
foreach ($issueNum in @(12, 13, 14, 15)) {
    $assignResult = gh api "repos/$Repository/issues/$issueNum" --method PATCH --field "milestone=$phase3Num" 2>&1
    if ($LASTEXITCODE -ne 0) { 
        Write-Host "⚠️  Could not assign issue #$issueNum" -ForegroundColor Yellow
    }
}

# Phase 4 assignments: T018, T019 (issues 17-18)
Write-Host "Assigning Phase 4 issues (T018-T019)..."
foreach ($issueNum in @(17, 18)) {
    $assignResult = gh api "repos/$Repository/issues/$issueNum" --method PATCH --field "milestone=$phase4Num" 2>&1
    if ($LASTEXITCODE -ne 0) { 
        Write-Host "⚠️  Could not assign issue #$issueNum" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "✅ Issue milestone assignments completed!" -ForegroundColor Green
Write-Host ""

Write-Host "🎯 Next Steps: GitHub Projects v2 Board Creation" -ForegroundColor Magenta
Write-Host "===============================================" -ForegroundColor Magenta
Write-Host ""
Write-Host "Since GitHub CLI has limited support for Projects v2, follow these steps in the GitHub web UI:"
Write-Host ""
Write-Host "1. Go to: https://github.com/$Repository/projects"
Write-Host "2. Click 'New project'"
Write-Host "3. Choose 'Board' template"
Write-Host "4. Name: 'Roadmap — ChatGPT Archive Utility'"
Write-Host "5. Description: 'Kanban for phased delivery'"
Write-Host ""
Write-Host "🏗️  Recommended Columns:" -ForegroundColor Yellow
Write-Host "   • Backlog"
Write-Host "   • Selected" 
Write-Host "   • In progress"
Write-Host "   • In review"
Write-Host "   • QA"
Write-Host "   • Done"
Write-Host ""
Write-Host "⚙️  Automation Rules (Project Settings → Automation):" -ForegroundColor Yellow
Write-Host "   • When PR is opened linking an issue → Move to 'In review'"
Write-Host "   • When PR is merged or issue closed → Move to 'Done'"
Write-Host "   • When issue is added to milestone → Move to 'Selected'"
Write-Host ""
Write-Host "📋 Add all T001-T019 issues to the board and they will be auto-organized by milestone!"
Write-Host ""
Write-Host "🎉 Setup complete! All milestones created and issues assigned." -ForegroundColor Green