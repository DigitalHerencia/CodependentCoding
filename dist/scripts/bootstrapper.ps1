<#
.SYNOPSIS
  Loaded Vibes Bootstrapper - Hardened Validation Wrapper

.DESCRIPTION
  Validates DevCycle manifest, VS Code profiles, MCP endpoints, and tool wiring
  before running the orchestrator. Emits machine-readable JSON status for CI consumption.

  1. Runs comprehensive validation checks (profile, MCP, manifest coherence)
  2. Optionally executes the orchestrator for the requested DevCycle
  3. Provides convenient PowerShell entry points for Windows contributors

.PARAMETER Phase
  Optional DevCycle key to validate specifically (e.g., 'initialization', 'scaffolding')

.PARAMETER Mode
  Orchestrator execution mode: plan-only, plan-first, execute, or validate

.PARAMETER ProfilePath
  Path to the VS Code profile that should mirror dist/.vscode/profile.jsonc

.PARAMETER Task
  Optional task description for the orchestrator

.PARAMETER JsonOutput
  Emit machine-readable JSON status output for CI consumption

.PARAMETER SkipMcpCheck
  Skip MCP endpoint verification (useful for offline environments)

.PARAMETER SkipBootstrap
  Skip bootstrap validations and run orchestrator directly

.PARAMETER SkipOrchestrator
  Run bootstrap validations only, do not invoke orchestrator

.PARAMETER PlanOnly
  Shortcut for Mode = 'plan-only'

.PARAMETER FixProfile
  Create/update the profile file if it is missing

.PARAMETER Check
  Alias for running validation-only mode without orchestrator

.EXAMPLE
  .\bootstrapper.ps1 -Phase initialization
  Validates and runs the initialization DevCycle

.EXAMPLE
  .\bootstrapper.ps1 -JsonOutput -SkipOrchestrator
  Outputs validation status as JSON for CI consumption

.EXAMPLE
  .\bootstrapper.ps1 -Check
  Runs validation checks only, outputs human-readable report

.NOTES
  Reference: TECH_REQUIREMENTS §4.4, SPEC-SECURITY §2, PRD §5.1
  Issue: #13
#>

[CmdletBinding()]
param(
  [Parameter(Position = 0)]
  [string]$Phase,

  [ValidateSet('plan-only', 'plan-first', 'execute', 'validate')]
  [string]$Mode = 'plan-first',

  [string]$ProfilePath = "..\\.vscode\\profile.jsonc",

  [string]$Task,

  [switch]$JsonOutput,

  [switch]$SkipMcpCheck,

  [switch]$SkipBootstrap,

  [switch]$SkipOrchestrator,

  [switch]$PlanOnly,

  [switch]$FixProfile,

  [switch]$Check
)

# Exit codes for CI consumption
$EXIT_SUCCESS = 0
$EXIT_VALIDATION_FAILED = 1
$EXIT_ORCHESTRATOR_FAILED = 2
$EXIT_MISSING_PREREQ = 3

# Canonical DevCycle list from TECH_REQUIREMENTS §6
$CANONICAL_DEVCYCLES = @(
  'initialization', 'scaffolding', 'configuration', 'verification',
  'data', 'auth', 'testing', 'validation', 'features', 'debug',
  'security', 'performance', 'observability', 'code-review',
  'documentation', 'ci-cd', 'deploy', 'updates'
)

$REQUIRED_MCP_SERVERS = @('filesystem', 'git', 'memory', 'sequentialthinking')

$REQUIRED_EXTENSIONS = @(
  'github.copilot',
  'github.copilot-chat',
  'esbenp.prettier-vscode',
  'dbaeumer.vscode-eslint'
)

# =============================================================================
# Path Resolution
# =============================================================================

$scriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$bootstrapperScript = Join-Path $scriptRoot "bootstrapper.genaiscript.ts"
$orchestratorScript = Join-Path $scriptRoot "..\\genaiscript\\orchestrator.genai.js"
$manifestPath = Join-Path $scriptRoot "..\\genaiscript\\devcycles.config.json"
$settingsPath = Join-Path $scriptRoot "..\\.vscode\\settings.json"
$extensionsPath = Join-Path $scriptRoot "..\\.vscode\\extensions.json"
$mcpPath = Join-Path $scriptRoot "..\\.vscode\\mcp.json"
$distRoot = Split-Path -Parent $scriptRoot
$repoRoot = Split-Path -Parent $distRoot

$resolvedProfilePath = Resolve-Path -Path (Join-Path $scriptRoot $ProfilePath) -ErrorAction SilentlyContinue
if (-not $resolvedProfilePath) {
  $resolvedProfilePath = Join-Path $scriptRoot $ProfilePath
}

# =============================================================================
# Validation Status Object
# =============================================================================

$validationStatus = @{
  overall        = 'success'
  timestamp      = (Get-Date -Format 'o')
  duration       = 0
  phase          = if ($Phase) { $Phase.ToLower() } else { 'all' }
  checks         = @()
  summary        = @{
    total    = 0
    passed   = 0
    failed   = 0
    warnings = 0
    skipped  = 0
  }
  remediationHints = @()
  exitCode       = $EXIT_SUCCESS
  references     = @{
    spec  = 'SPEC-SECURITY §2, TECH_REQUIREMENTS §4.4'
    issue = '#13'
  }
}

# =============================================================================
# Helper Functions
# =============================================================================

function Add-Check {
  param(
    [string]$Name,
    [ValidateSet('pass', 'fail', 'warn', 'skip')]
    [string]$Status,
    [string]$Message,
    [string[]]$Errors = @(),
    [string[]]$Remediation = @()
  )

  $check = @{
    name        = $Name
    status      = $Status
    message     = $Message
    errors      = $Errors
    remediation = $Remediation
  }

  $script:validationStatus.checks += $check
  $script:validationStatus.summary.total++

  switch ($Status) {
    'pass' { $script:validationStatus.summary.passed++ }
    'fail' { $script:validationStatus.summary.failed++ }
    'warn' { $script:validationStatus.summary.warnings++ }
    'skip' { $script:validationStatus.summary.skipped++ }
  }

  if ($Remediation.Count -gt 0) {
    $script:validationStatus.remediationHints += $Remediation
  }
}

function Read-JsonFile {
  param([string]$Path)

  if (-not (Test-Path $Path)) {
    return $null
  }

  try {
    $content = Get-Content -Path $Path -Raw
    # Strip comments for JSONC files
    $content = $content -replace '//.*$', '' -replace '/\*[\s\S]*?\*/', ''
    return $content | ConvertFrom-Json
  } catch {
    return $null
  }
}

function Write-StatusOutput {
  param([switch]$AsJson)

  if ($AsJson) {
    $validationStatus | ConvertTo-Json -Depth 10
  } else {
    Write-Host ""
    Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
    Write-Host "  🧭 Loaded Vibes Bootstrap Validation Report" -ForegroundColor Cyan
    Write-Host "  Reference: TECH_REQUIREMENTS §4.4, SPEC-SECURITY §2" -ForegroundColor DarkGray
    Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
    Write-Host ""

    foreach ($check in $validationStatus.checks) {
      $emoji = switch ($check.status) {
        'pass' { '✅' }
        'fail' { '❌' }
        'warn' { '⚠️ ' }
        'skip' { '⏭️ ' }
      }

      $color = switch ($check.status) {
        'pass' { 'Green' }
        'fail' { 'Red' }
        'warn' { 'Yellow' }
        'skip' { 'DarkGray' }
      }

      Write-Host "$emoji $($check.name): $($check.message)" -ForegroundColor $color

      if ($check.errors.Count -gt 0 -and $check.status -ne 'pass') {
        foreach ($err in $check.errors) {
          Write-Host "   └─ $err" -ForegroundColor $color
        }
      }
    }

    Write-Host ""
    Write-Host "📊 Summary:" -ForegroundColor White
    Write-Host "   Total checks: $($validationStatus.summary.total)" -ForegroundColor Gray
    Write-Host "   Passed: $($validationStatus.summary.passed)" -ForegroundColor Green
    Write-Host "   Failed: $($validationStatus.summary.failed)" -ForegroundColor Red
    Write-Host "   Warnings: $($validationStatus.summary.warnings)" -ForegroundColor Yellow
    Write-Host "   Skipped: $($validationStatus.summary.skipped)" -ForegroundColor DarkGray

    $uniqueHints = $validationStatus.remediationHints | Select-Object -Unique
    if ($uniqueHints.Count -gt 0 -and $validationStatus.overall -ne 'success') {
      Write-Host ""
      Write-Host "💡 Remediation Hints:" -ForegroundColor White
      $hintCount = [Math]::Min($uniqueHints.Count, 5)
      for ($i = 0; $i -lt $hintCount; $i++) {
        Write-Host "   $($i + 1). $($uniqueHints[$i])" -ForegroundColor Gray
      }
      if ($uniqueHints.Count -gt 5) {
        Write-Host "   ... and $($uniqueHints.Count - 5) more (use -JsonOutput for full list)" -ForegroundColor DarkGray
      }
    }

    Write-Host ""
    switch ($validationStatus.overall) {
      'success' { Write-Host "✅ Bootstrap validation PASSED" -ForegroundColor Green }
      'partial' { Write-Host "⚠️  Bootstrap validation PASSED with warnings" -ForegroundColor Yellow }
      'failure' { Write-Host "❌ Bootstrap validation FAILED" -ForegroundColor Red }
    }
  }
}

# =============================================================================
# Validation Checks
# =============================================================================

function Test-Prerequisites {
  # Check Node.js
  try {
    $nodeVersion = & node --version 2>$null
    if ($nodeVersion -match 'v(\d+)') {
      $majorVersion = [int]$Matches[1]
      if ($majorVersion -ge 20) {
        Add-Check -Name 'node-version' -Status 'pass' -Message "Node.js $nodeVersion installed"
      } else {
        Add-Check -Name 'node-version' -Status 'fail' -Message "Node.js version too old: $nodeVersion" `
          -Errors @("Requires Node.js >= 20, found $nodeVersion") `
          -Remediation @("Install Node.js 20+ from https://nodejs.org/")
      }
    }
  } catch {
    Add-Check -Name 'node-version' -Status 'fail' -Message 'Node.js not found' `
      -Errors @('Node.js is not installed or not in PATH') `
      -Remediation @('Install Node.js 20+ from https://nodejs.org/')
  }

  # Check npx availability
  try {
    $npxVersion = & npx --version 2>$null
    Add-Check -Name 'npx-available' -Status 'pass' -Message "npx $npxVersion available"
  } catch {
    Add-Check -Name 'npx-available' -Status 'fail' -Message 'npx not found' `
      -Errors @('npx is not installed or not in PATH') `
      -Remediation @('Ensure npm is installed with Node.js')
  }
}

function Test-VsCodeProfile {
  $errors = @()
  $remediation = @()
  $status = 'pass'

  # Check settings.json exists
  if (-not (Test-Path $settingsPath)) {
    $errors += 'Shipped settings.json not found at dist/.vscode/settings.json'
    $remediation += 'Ensure dist/.vscode/settings.json exists and contains required VS Code settings.'
    $status = 'fail'
  } else {
    $settings = Read-JsonFile -Path $settingsPath
    if ($settings) {
      # Check genaiscript.localTypeDefinitions
      if ($settings.'genaiscript.localTypeDefinitions' -ne $true) {
        $errors += 'genaiscript.localTypeDefinitions should be true'
        $remediation += 'Set "genaiscript.localTypeDefinitions": true in settings.json per TECH §8'
        if ($status -ne 'fail') { $status = 'warn' }
      }

      # Check instructionsFilesLocations doesn't reference dist/**
      $instrLocs = $settings.'chat.instructionsFilesLocations'
      if ($instrLocs) {
        $instrLocs.PSObject.Properties | ForEach-Object {
          if ($_.Name -match 'dist/') {
            $errors += "instructionsFilesLocations references shipped path: $($_.Name)"
            $remediation += 'Remove dist/** references from chat.instructionsFilesLocations per SPEC-ARCH §3'
            $status = 'fail'
          }
        }
      }
    }
  }

  # Check extensions.json exists
  if (-not (Test-Path $extensionsPath)) {
    $errors += 'Shipped extensions.json not found at dist/.vscode/extensions.json'
    $remediation += 'Ensure dist/.vscode/extensions.json exists with recommended extensions.'
    $status = 'fail'
  } else {
    $extensions = Read-JsonFile -Path $extensionsPath
    if ($extensions -and $extensions.recommendations) {
      foreach ($ext in $REQUIRED_EXTENSIONS) {
        if ($ext -notin $extensions.recommendations) {
          $errors += "Required extension '$ext' not in recommendations"
          $remediation += "Add '$ext' to dist/.vscode/extensions.json recommendations"
          if ($status -ne 'fail') { $status = 'warn' }
        }
      }
    }
  }

  $message = if ($status -eq 'pass') {
    'VS Code profile validation passed'
  } else {
    "VS Code profile validation $status`: $($errors.Count) issue(s) found"
  }

  Add-Check -Name 'vscode-profile' -Status $status -Message $message -Errors $errors -Remediation $remediation
}

function Test-McpEndpoints {
  if ($SkipMcpCheck) {
    Add-Check -Name 'mcp-endpoints' -Status 'skip' -Message 'MCP endpoint verification skipped'
    return
  }

  $errors = @()
  $remediation = @()
  $status = 'pass'

  if (-not (Test-Path $mcpPath)) {
    Add-Check -Name 'mcp-endpoints' -Status 'fail' -Message 'MCP configuration file missing' `
      -Errors @('MCP configuration not found at dist/.vscode/mcp.json') `
      -Remediation @('Create dist/.vscode/mcp.json with required MCP server configurations.')
    return
  }

  $mcpConfig = Read-JsonFile -Path $mcpPath
  if (-not $mcpConfig -or -not $mcpConfig.mcpServers) {
    Add-Check -Name 'mcp-endpoints' -Status 'fail' -Message 'MCP configuration invalid' `
      -Errors @('MCP configuration is invalid or missing mcpServers') `
      -Remediation @('Ensure mcp.json contains valid mcpServers object.')
    return
  }

  $configuredServers = $mcpConfig.mcpServers.PSObject.Properties.Name

  # Check required servers are configured
  foreach ($server in $REQUIRED_MCP_SERVERS) {
    if ($server -notin $configuredServers) {
      $errors += "Required MCP server '$server' not configured"
      $remediation += "Add '$server' configuration to mcp.json per TECH_REQUIREMENTS §2"
      if ($status -ne 'fail') { $status = 'warn' }
    }
  }

  # Validate each server configuration
  foreach ($serverName in $configuredServers) {
    $serverConfig = $mcpConfig.mcpServers.$serverName
    if (-not $serverConfig.command) {
      $errors += "MCP server '$serverName' missing command"
      $remediation += "Add 'command' field to $serverName configuration in mcp.json"
      if ($status -ne 'fail') { $status = 'warn' }
    }
    if (-not $serverConfig.args -or $serverConfig.args -isnot [array]) {
      $errors += "MCP server '$serverName' missing or invalid args"
      $remediation += "Add valid 'args' array to $serverName configuration in mcp.json"
      if ($status -ne 'fail') { $status = 'warn' }
    }
  }

  $message = if ($status -eq 'pass') {
    "MCP endpoints verified: $($configuredServers.Count) server(s) configured"
  } else {
    "MCP endpoint validation $status`: $($errors.Count) issue(s) found"
  }

  Add-Check -Name 'mcp-endpoints' -Status $status -Message $message -Errors $errors -Remediation $remediation
}

function Test-ManifestCoherence {
  $errors = @()
  $remediation = @()
  $status = 'pass'

  if (-not (Test-Path $manifestPath)) {
    Add-Check -Name 'manifest-coherence' -Status 'fail' -Message 'Manifest file not found' `
      -Errors @("Manifest not found at $manifestPath") `
      -Remediation @('Ensure devcycles.config.json exists in dist/genaiscript/')
    return
  }

  $manifest = Read-JsonFile -Path $manifestPath
  if (-not $manifest) {
    Add-Check -Name 'manifest-coherence' -Status 'fail' -Message 'Manifest file invalid' `
      -Errors @('Failed to parse devcycles.config.json') `
      -Remediation @('Ensure devcycles.config.json contains valid JSON')
    return
  }

  $manifestKeys = $manifest.PSObject.Properties.Name
  $targetPhase = if ($Phase) { $Phase.ToLower() } else { $null }

  # Validate requested phase exists
  if ($targetPhase -and $targetPhase -notin $manifestKeys) {
    Add-Check -Name 'manifest-coherence' -Status 'fail' `
      -Message "Phase '$targetPhase' not found in manifest" `
      -Errors @("Invalid phase: $targetPhase") `
      -Remediation @("Use one of: $($manifestKeys -join ', ')")
    $script:validationStatus.exitCode = $EXIT_VALIDATION_FAILED
    return
  }

  # Check canonical DevCycle coverage
  if (-not $targetPhase) {
    $missingDevCycles = $CANONICAL_DEVCYCLES | Where-Object { $_ -notin $manifestKeys }
    $extraDevCycles = $manifestKeys | Where-Object { $_ -notin $CANONICAL_DEVCYCLES }

    if ($missingDevCycles.Count -gt 0) {
      $errors += "Missing canonical DevCycles: $($missingDevCycles -join ', ')"
      $remediation += 'Add entries for missing DevCycles to devcycles.config.json per TECH §6'
      $status = 'fail'
    }

    if ($extraDevCycles.Count -gt 0) {
      $errors += "Extra DevCycles not in canonical list: $($extraDevCycles -join ', ')"
      # Informational only, not a failure
    }
  }

  # Validate each phase entry
  $phasesToCheck = if ($targetPhase) { @($targetPhase) } else { $manifestKeys }
  $validPhases = 0

  foreach ($phaseKey in $phasesToCheck) {
    $entry = $manifest.$phaseKey
    $phaseErrors = @()

    # Check required fields
    $requiredFields = @('label', 'description', 'instructions', 'toolset', 'prompt')
    foreach ($field in $requiredFields) {
      if (-not $entry.$field) {
        $phaseErrors += "Phase '$phaseKey' missing required field: $field"
        $remediation += "Add '$field' to $phaseKey entry in devcycles.config.json"
      }
    }

    # Validate file references exist
    $genaiRoot = Join-Path $scriptRoot "..\\genaiscript"
    foreach ($artifactKey in @('instructions', 'toolset', 'prompt')) {
      if ($entry.$artifactKey) {
        $artifactPath = Join-Path $genaiRoot $entry.$artifactKey
        if (-not (Test-Path $artifactPath)) {
          $phaseErrors += "Phase '$phaseKey': $artifactKey file not found at $($entry.$artifactKey)"
          $remediation += "Create $($entry.$artifactKey) or fix reference in devcycles.config.json"
        }
      }
    }

    # Validate checkpoints array
    if (-not $entry.checkpoints -or $entry.checkpoints -isnot [array]) {
      $errors += "Phase '$phaseKey' missing or invalid checkpoints array"
      $remediation += "Add 'checkpoints' array to $phaseKey entry per TECH §4.1"
      if ($status -ne 'fail') { $status = 'warn' }
    }

    if ($phaseErrors.Count -gt 0) {
      $errors += $phaseErrors
      $status = 'fail'
    } else {
      $validPhases++
    }
  }

  $message = if ($status -eq 'pass') {
    "Manifest coherence verified: $validPhases/$($phasesToCheck.Count) phases valid"
  } else {
    "Manifest coherence $status`: $($errors.Count) issue(s) found"
  }

  Add-Check -Name 'manifest-coherence' -Status $status -Message $message -Errors $errors -Remediation $remediation
}

function Test-CoreFiles {
  $errors = @()
  $remediation = @()
  $status = 'pass'

  $coreFiles = @(
    @{ Path = Join-Path $repoRoot 'docs\PRD.md'; Name = 'PRD.md' },
    @{ Path = Join-Path $repoRoot 'docs\TECH_REQUIREMENTS.md'; Name = 'TECH_REQUIREMENTS.md' },
    @{ Path = Join-Path $repoRoot 'TODO.md'; Name = 'TODO.md' },
    @{ Path = Join-Path $repoRoot 'CHANGELOG.md'; Name = 'CHANGELOG.md' },
    @{ Path = Join-Path $repoRoot 'README.md'; Name = 'README.md' }
  )

  foreach ($file in $coreFiles) {
    if (-not (Test-Path $file.Path)) {
      $errors += "Core file missing: $($file.Name)"
      $remediation += "Create $($file.Name) in the repository root or docs/ directory"
      $status = 'fail'
    }
  }

  $message = if ($status -eq 'pass') {
    'All core project files present'
  } else {
    "Core files validation $status`: $($errors.Count) file(s) missing"
  }

  Add-Check -Name 'core-files' -Status $status -Message $message -Errors $errors -Remediation $remediation
}

function Test-ProfileFile {
  $errors = @()
  $remediation = @()
  $status = 'pass'

  $defaultProfilePath = Join-Path $distRoot '.vscode\profile.jsonc'
  $targetPath = if ($ProfilePath -and $ProfilePath -ne "..\\.vscode\\profile.jsonc") {
    Resolve-Path -Path (Join-Path $scriptRoot $ProfilePath) -ErrorAction SilentlyContinue
  } else {
    $defaultProfilePath
  }

  if (-not (Test-Path $targetPath)) {
    if ($FixProfile) {
      if (Test-Path $defaultProfilePath) {
        try {
          Copy-Item -Path $defaultProfilePath -Destination $targetPath -Force
          Add-Check -Name 'profile-file' -Status 'pass' -Message "Profile file created at $targetPath"
          return
        } catch {
          $errors += "Failed to create profile: $_"
          $remediation += 'Manually create profile.jsonc from dist/.vscode/profile.jsonc template'
          $status = 'fail'
        }
      } else {
        $errors += 'Profile template not found at dist/.vscode/profile.jsonc'
        $remediation += 'Create dist/.vscode/profile.jsonc template first'
        $status = 'fail'
      }
    } else {
      $errors += "Profile file not found at $targetPath"
      $remediation += 'Run with -FixProfile to auto-create, or manually copy dist/.vscode/profile.jsonc'
      $status = 'warn'
    }
  }

  $message = if ($status -eq 'pass') {
    "Profile file exists at $targetPath"
  } elseif ($status -eq 'warn') {
    'Profile file missing (optional)'
  } else {
    "Profile file $status`: $($errors.Count) issue(s)"
  }

  Add-Check -Name 'profile-file' -Status $status -Message $message -Errors $errors -Remediation $remediation
}

# =============================================================================
# Main Execution
# =============================================================================

$startTime = Get-Date

# Handle -Check alias
if ($Check) {
  $SkipOrchestrator = $true
}

# Run validation checks
if (-not $SkipBootstrap) {
  Test-Prerequisites
  Test-VsCodeProfile
  Test-McpEndpoints
  Test-ManifestCoherence
  Test-CoreFiles
  Test-ProfileFile
}

# Calculate duration and final status
$validationStatus.duration = ((Get-Date) - $startTime).TotalMilliseconds

if ($validationStatus.summary.failed -gt 0) {
  $validationStatus.overall = 'failure'
  $validationStatus.exitCode = $EXIT_VALIDATION_FAILED
} elseif ($validationStatus.summary.warnings -gt 0) {
  $validationStatus.overall = 'partial'
  $validationStatus.exitCode = $EXIT_SUCCESS
}

# Deduplicate remediation hints
$validationStatus.remediationHints = $validationStatus.remediationHints | Select-Object -Unique

# Output validation results
if (-not $SkipBootstrap) {
  Write-StatusOutput -AsJson:$JsonOutput
}

# Exit early if validation failed or orchestrator skipped
if ($validationStatus.exitCode -ne $EXIT_SUCCESS) {
  exit $validationStatus.exitCode
}

if ($SkipOrchestrator -or -not $Phase) {
  if (-not $JsonOutput -and -not $SkipBootstrap) {
    if (-not $Phase) {
      Write-Host ""
      Write-Host "No phase specified. Completed bootstrap validation only." -ForegroundColor Cyan
    }
    Write-Host ""
    Write-Host "✅ Bootstrapper finished." -ForegroundColor Green
  }
  exit $EXIT_SUCCESS
}

# Run GenAIScript bootstrapper for additional validation
if (-not $SkipBootstrap) {
  if (-not $JsonOutput) {
    Write-Host ""
    Write-Host "🧭 Running GenAIScript bootstrapper validation..." -ForegroundColor Cyan
  }

  $bootstrapArgs = @("genaiscript", "run", $bootstrapperScript, "--profilePath", $resolvedProfilePath)
  if ($Phase) { $bootstrapArgs += @("--phase", $Phase) }
  if ($JsonOutput) { $bootstrapArgs += @("--jsonOutput", "true") }
  if ($SkipMcpCheck) { $bootstrapArgs += @("--skipMcpCheck", "true") }
  if ($FixProfile) { $bootstrapArgs += @("--fixProfile", "true") }
  $bootstrapArgs += @("--preflightOnly", "false")

  & npx @bootstrapArgs
  if ($LASTEXITCODE -ne 0) {
    if (-not $JsonOutput) {
      Write-Host "❌ GenAIScript bootstrap validation failed." -ForegroundColor Red
    }
    exit $EXIT_VALIDATION_FAILED
  }
}

# Run orchestrator if phase specified
if ($Phase) {
  $effectiveMode = if ($PlanOnly) { 'plan-only' } else { $Mode }
  if (-not $JsonOutput) {
    Write-Host ""
    Write-Host "🚀 Invoking orchestrator for phase '$Phase' (mode: $effectiveMode)..." -ForegroundColor Cyan
  }

  $orchArgs = @("genaiscript", "run", $orchestratorScript, "--phase", $Phase, "--mode", $effectiveMode)
  if ($Task) { $orchArgs += @("--task", $Task) }
  & npx @orchArgs

  if ($LASTEXITCODE -ne 0) {
    if (-not $JsonOutput) {
      Write-Host "❌ Orchestrator execution failed." -ForegroundColor Red
    }
    exit $EXIT_ORCHESTRATOR_FAILED
  }
}

if (-not $JsonOutput) {
  Write-Host ""
  Write-Host "✅ Bootstrapper finished." -ForegroundColor Green
}

exit $EXIT_SUCCESS