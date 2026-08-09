param(
  [string]$Source = 'D:\.VIBES\Vibes',
  [string]$Destination = (Join-Path $PSScriptRoot '..\template')
)

$ErrorActionPreference = 'Stop'
$sourceRoot = (Resolve-Path -LiteralPath $Source).Path
$destinationRoot = [System.IO.Path]::GetFullPath($Destination)
$repositoryRoot = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))

if (-not ($destinationRoot.StartsWith($repositoryRoot + [System.IO.Path]::DirectorySeparatorChar, [System.StringComparison]::OrdinalIgnoreCase))) {
  throw 'Template destination must remain inside the LoadedVibes repository.'
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
    trackedArtifactCount = $tracked.Count
    includedArtifactCount = @($inventory | Where-Object included).Count
    excludedArtifactCount = @($inventory | Where-Object { -not $_.included }).Count
  }
  $utf8 = [System.Text.UTF8Encoding]::new($false)
  $provenanceJson = (($provenance | ConvertTo-Json -Depth 4) -replace "`r`n", "`n") + "`n"
  $inventoryJson = (($inventory | ConvertTo-Json -Depth 4) -replace "`r`n", "`n") + "`n"
  [System.IO.File]::WriteAllText((Join-Path $destinationRoot '.loaded-vibes-template.json'), $provenanceJson, $utf8)
  [System.IO.File]::WriteAllText((Join-Path $repositoryRoot 'template-disposition.json'), $inventoryJson, $utf8)
} finally {
  if (Test-Path -LiteralPath $archive) { Remove-Item -LiteralPath $archive -Force }
  if (Test-Path -LiteralPath $extract) { Remove-Item -LiteralPath $extract -Recurse -Force }
}

Write-Output "Synchronized $(@($inventory | Where-Object included).Count) of $($tracked.Count) artifacts from Vibes $revision."
