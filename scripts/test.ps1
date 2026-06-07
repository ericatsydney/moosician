#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Run metronome widget smoke tests and report pass/fail status.

.DESCRIPTION
    Executes the CLI test suite and returns exit code 0 (pass) or 1 (fail).
    Suitable for CI/CD pipelines and automation hooks.

.EXAMPLE
    .\scripts\test.ps1
    echo $LASTEXITCODE  # 0 = passed, 1 = failed
#>

Write-Host "Running metronome widget smoke tests..." -ForegroundColor Cyan

$projectRoot = Split-Path $PSScriptRoot
$testScript = Join-Path -Path (Join-Path -Path $projectRoot -ChildPath "tests") -ChildPath "run-test.js"

if (-not (Test-Path $testScript)) {
    Write-Host "ERROR: Test script not found at $testScript" -ForegroundColor Red
    exit 1
}

# Run the test
node $testScript
$exitCode = $LASTEXITCODE

# Report result
if ($exitCode -eq 0) {
    Write-Host "`n[PASS] Tests passed" -ForegroundColor Green
    exit 0
} else {
    Write-Host "`n[FAIL] Tests failed" -ForegroundColor Red
    exit 1
}
