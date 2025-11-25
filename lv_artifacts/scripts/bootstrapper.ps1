<#!
  Loaded Vibes Bootstrapper Wrapper

  1. Runs the GenAIScript bootstrapper to validate manifest + profile health.
  2. Optionally executes the orchestrator for the requested DevCycle.
  3. Provides convenient PowerShell entry points for Windows contributors.
#>

param(
  [string]$Phase,
  [ValidateSet('plan-only','plan-first','execute','validate')]
  [string]$Mode = 'plan-first',
  [string]$ProfilePath = "..\\.vscode\\profile.jsonc",
  [string]$Task,
  [switch]$SkipBootstrap,
  [switch]$SkipOrchestrator,
  [switch]$PlanOnly
)

$scriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$bootstrapperScript = Join-Path $scriptRoot "bootstrapper.genaiscript.ts"
$orchestratorScript = Join-Path $scriptRoot "..\\genaiscript\\orchestrator.genai.js"
$resolvedProfilePath = Resolve-Path -Path (Join-Path $scriptRoot $ProfilePath) -ErrorAction SilentlyContinue
if (-not $resolvedProfilePath) {
  $resolvedProfilePath = Join-Path $scriptRoot $ProfilePath
}

if (-not $SkipBootstrap) {
  Write-Host "🧭 Running bootstrap validations..."
  $bootstrapArgs = @("genaiscript", "run", $bootstrapperScript, "--profilePath", $resolvedProfilePath)
  if ($Phase) { $bootstrapArgs += @("--phase", $Phase) }
  $bootstrapArgs += @("--preflightOnly", "false")
  & npx @bootstrapArgs
  if ($LASTEXITCODE -ne 0) {
    throw "Bootstrap validation failed. See output above."
  }
}

if (-not $SkipOrchestrator -and $Phase) {
  $effectiveMode = if ($PlanOnly) { 'plan-only' } else { $Mode }
  Write-Host "🚀 Invoking orchestrator for phase '$Phase' (mode: $effectiveMode)..."
  $orchArgs = @("genaiscript", "run", $orchestratorScript, "--phase", $Phase, "--mode", $effectiveMode)
  if ($Task) { $orchArgs += @("--task", $Task) }
  & npx @orchArgs
  if ($LASTEXITCODE -ne 0) {
    throw "Orchestrator execution failed."
  }
} elseif (-not $Phase) {
  Write-Host "No phase specified. Completed bootstrap only."
}

Write-Host "✅ Bootstrapper finished."