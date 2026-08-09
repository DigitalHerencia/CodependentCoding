param(
  [string]$Source = 'D:\.VIBES\Vibes',
  [string]$Destination = (Join-Path $PSScriptRoot '..\templates\golden')
)

$ErrorActionPreference = 'Stop'
$sourceRoot = (Resolve-Path -LiteralPath $Source).Path
$destinationRoot = [System.IO.Path]::GetFullPath($Destination)
$repositoryRoot = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$modulesRoot = [System.IO.Path]::GetFullPath((Join-Path $repositoryRoot 'templates\modules'))

if (-not ($destinationRoot.StartsWith($repositoryRoot + [System.IO.Path]::DirectorySeparatorChar, [System.StringComparison]::OrdinalIgnoreCase))) {
  throw 'Template destination must remain inside the LoadedVibes repository.'
}

if (-not ($modulesRoot.StartsWith($repositoryRoot + [System.IO.Path]::DirectorySeparatorChar, [System.StringComparison]::OrdinalIgnoreCase))) {
  throw 'Template modules must remain inside the LoadedVibes repository.'
}

$modulePaths = [ordered]@{
  'marketing' = @('app/(public)/pricing', 'app/(public)/faq', 'tests/e2e/public-routes.spec.ts')
  'sample-domain' = @(
    'app/(tenant)/projects', 'features/dashboard/dashboard-feature.tsx', 'features/projects',
    'components/projects', 'lib/actions/projectActions.ts', 'lib/fetchers/dashboardFetchers.ts',
    'lib/fetchers/projectFetchers.ts', 'lib/projects', 'lib/db/transactions/projectTransactions.ts',
    'lib/db/selects/project.selects.ts', 'lib/db/dto/project.mappers.ts', 'schemas/projectSchemas.ts',
    'types/projectTypes.ts', 'tests/unit/schemas/projectSchemas.test.ts',
    'tests/unit/dto/projectMappers.test.ts'
  )
  'stripe-connect' = @(
    'app/api/stripe/connect', 'lib/actions/connectActions.ts', 'lib/connect',
    'lib/db/transactions/connectTransactions.ts', 'lib/fetchers/connectFetchers.ts',
    'lib/integrations/stripe/connect.ts', 'lib/integrations/stripe/connectWebhooks.ts',
    'lib/webhooks/connectWebhookWorkflow.ts', 'schemas/connectSchemas.ts', 'types/connectTypes.ts',
    'tests/unit/connect', 'tests/integration/stripe-connect.test.ts',
    'tests/contract/stripe-connect-surface.test.ts'
  )
}

$seamPaths = @(
  'proxy.ts', 'app/page.tsx', 'components/shells/public-shell.tsx',
  'components/shells/tenant-shell.tsx', 'components/navigation/public-header.tsx',
  'components/navigation/public-footer.tsx', 'components/navigation/mobile-bottom-nav.tsx',
  'tests/contract/architecture-surface.test.ts', 'content/loadedvibes.ts'
)
$seamContent = @{}
foreach ($relativePath in $seamPaths) {
  $seamPath = Join-Path $destinationRoot $relativePath
  if (Test-Path -LiteralPath $seamPath) {
    $seamContent[$relativePath] = Get-Content -Raw -LiteralPath $seamPath
  }
}

$revision = (git -C $sourceRoot rev-parse HEAD).Trim()
if ($LASTEXITCODE -ne 0) { throw 'Unable to resolve the Vibes revision.' }

$tracked = @(git -C $sourceRoot ls-files)
if ($LASTEXITCODE -ne 0) { throw 'Unable to inventory Vibes tracked files.' }

$rules = @(
  @{ Prefix = 'reference-implementations/'; Disposition = 'reference'; Include = $true; Reason = 'Production-isolated reference evidence is preserved without becoming canonical runtime architecture.' },
  @{ Prefix = 'test-results/'; Disposition = 'workbench-only'; Include = $false; Reason = 'Execution output is not canonical source.' },
  @{ Prefix = '.clerk/'; Disposition = 'workbench-only'; Include = $false; Reason = 'Provider CLI state and credentials are forbidden.' },
  @{ Prefix = '.next/'; Disposition = 'workbench-only'; Include = $false; Reason = 'Framework build output is regenerated.' },
  @{ Prefix = 'node_modules/'; Disposition = 'workbench-only'; Include = $false; Reason = 'Dependencies are installed by the lifecycle.' }
)

$inventory = foreach ($relativePath in $tracked) {
  $normalized = $relativePath.Replace('\', '/')
  $rule = $rules | Where-Object { $normalized.StartsWith($_.Prefix, [System.StringComparison]::Ordinal) } | Select-Object -First 1
  if ($rule) {
    [ordered]@{ path = $normalized; disposition = $rule.Disposition; included = $rule.Include; reason = $rule.Reason }
  } else {
    [ordered]@{ path = $normalized; disposition = 'core'; included = $true; reason = 'Canonical application, governance, validation, or delivery source.' }
  }
}

$archive = Join-Path ([System.IO.Path]::GetTempPath()) ("loaded-vibes-template-$([guid]::NewGuid().ToString('N')).zip")
$extract = Join-Path ([System.IO.Path]::GetTempPath()) ("loaded-vibes-template-$([guid]::NewGuid().ToString('N'))")
try {
  git -C $sourceRoot archive --format=zip --output=$archive $revision
  if ($LASTEXITCODE -ne 0) { throw 'Unable to archive canonical Vibes source.' }
  Expand-Archive -LiteralPath $archive -DestinationPath $extract

  if (Test-Path -LiteralPath $destinationRoot) {
    Remove-Item -LiteralPath $destinationRoot -Recurse -Force
  }
  New-Item -ItemType Directory -Path $destinationRoot | Out-Null

  foreach ($item in $inventory | Where-Object included) {
    $sourcePath = Join-Path $extract $item.path
    $targetPath = Join-Path $destinationRoot $item.path
    $targetParent = Split-Path -Parent $targetPath
    if (-not (Test-Path -LiteralPath $targetParent)) { New-Item -ItemType Directory -Path $targetParent -Force | Out-Null }
    Copy-Item -LiteralPath $sourcePath -Destination $targetPath
  }

  $provenance = [ordered]@{
    schemaVersion = 1
    sourceRepository = 'https://github.com/DigitalHerencia/Vibes'
    sourceRevision = $revision
    templateRevision = "vibes-$revision"
    composition = 'golden-plus-repository-modules'
    trackedArtifactCount = $tracked.Count
    includedArtifactCount = @($inventory | Where-Object included).Count
    excludedArtifactCount = @($inventory | Where-Object { -not $_.included }).Count
  }
  $utf8 = [System.Text.UTF8Encoding]::new($false)
  $provenanceJson = (($provenance | ConvertTo-Json -Depth 4) -replace "`r`n", "`n") + "`n"
  $inventoryJson = (($inventory | ConvertTo-Json -Depth 4) -replace "`r`n", "`n") + "`n"
  [System.IO.File]::WriteAllText((Join-Path $destinationRoot '.loaded-vibes-template.json'), $provenanceJson, $utf8)
  [System.IO.File]::WriteAllText((Join-Path $repositoryRoot 'template-disposition.json'), $inventoryJson, $utf8)

  foreach ($moduleId in $modulePaths.Keys) {
    $moduleRoot = Join-Path $modulesRoot $moduleId
    if (-not (Test-Path -LiteralPath (Join-Path $moduleRoot '.loaded-vibes-module.json'))) {
      throw "Missing repository-owned module metadata for $moduleId."
    }
    Get-ChildItem -LiteralPath $moduleRoot -Force |
      Where-Object Name -ne '.loaded-vibes-module.json' |
      Remove-Item -Recurse -Force

    foreach ($relativePath in $modulePaths[$moduleId]) {
      $sourcePath = Join-Path $destinationRoot $relativePath
      if (-not (Test-Path -LiteralPath $sourcePath)) { continue }
      $targetPath = Join-Path $moduleRoot $relativePath
      $targetParent = Split-Path -Parent $targetPath
      if (-not (Test-Path -LiteralPath $targetParent)) {
        New-Item -ItemType Directory -Path $targetParent -Force | Out-Null
      }
      Move-Item -LiteralPath $sourcePath -Destination $targetPath
    }

    $metadataPath = Join-Path $moduleRoot '.loaded-vibes-module.json'
    $metadata = Get-Content -Raw -LiteralPath $metadataPath | ConvertFrom-Json
    $metadata.sourceRevision = $revision
    $metadataJson = (($metadata | ConvertTo-Json -Depth 6) -replace "`r`n", "`n") + "`n"
    [System.IO.File]::WriteAllText($metadataPath, $metadataJson, $utf8)
  }

  foreach ($relativePath in $seamContent.Keys) {
    $seamPath = Join-Path $destinationRoot $relativePath
    $seamParent = Split-Path -Parent $seamPath
    if (-not (Test-Path -LiteralPath $seamParent)) {
      New-Item -ItemType Directory -Path $seamParent -Force | Out-Null
    }
    [System.IO.File]::WriteAllText($seamPath, $seamContent[$relativePath], $utf8)
  }
} finally {
  if (Test-Path -LiteralPath $archive) { Remove-Item -LiteralPath $archive -Force }
  if (Test-Path -LiteralPath $extract) { Remove-Item -LiteralPath $extract -Recurse -Force }
}

Write-Output "Synchronized $(@($inventory | Where-Object included).Count) of $($tracked.Count) artifacts from Vibes $revision."
