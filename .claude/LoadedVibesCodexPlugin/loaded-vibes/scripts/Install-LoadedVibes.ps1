param(
  [string]$CodexHome = $(if ($env:CODEX_HOME) { $env:CODEX_HOME } else { Join-Path $HOME '.codex' }),
  [string]$TargetRepo,
  [switch]$Force,
  [switch]$WhatIf
)
$ErrorActionPreference = 'Stop'
$Root = Split-Path -Parent $PSScriptRoot
$SkillsSource = Join-Path $Root 'skills'
$SkillsTarget = Join-Path $CodexHome 'skills'
New-Item -ItemType Directory -Force -Path $SkillsTarget | Out-Null
Get-ChildItem -Directory $SkillsSource | ForEach-Object {
  $dest = Join-Path $SkillsTarget $_.Name
  if ((Test-Path $dest) -and -not $Force) {
    Write-Host "SKIP skill $($_.Name) (already exists; use -Force)"
  } else {
    Write-Host "INSTALL skill $($_.Name) -> $dest"
    if (-not $WhatIf) { Copy-Item -Recurse -Force $_.FullName $dest }
  }
}
if ($TargetRepo) {
  $args = @((Join-Path $Root 'scripts/install-project-assets.mjs'), '--target', $TargetRepo)
  if ($WhatIf) { $args += '--dry-run' }
  if ($Force) { $args += '--force' }
  & node @args
  if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
}
