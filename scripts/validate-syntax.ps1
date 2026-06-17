#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Validate JavaScript syntax for all project files.

.DESCRIPTION
    Runs Node.js syntax check on all JavaScript files.
    Returns exit code 0 (pass) or 1 (fail).
    Suitable for CI/CD pipelines and automation hooks.

.EXAMPLE
    .\scripts\validate-syntax.ps1
    echo $LASTEXITCODE  # 0 = passed, 1 = failed
#>

Write-Host "Validating JavaScript syntax..." -ForegroundColor Cyan

$projectRoot = (Get-Item $PSScriptRoot).Parent.FullName
$filesToCheck = @(
    "assets/js/app.js",
    "assets/js/metronome.js",
    "assets/js/strummer.js",
    "assets/js/chords.js",
    "assets/js/chord-chart.js",
    "tests/metronome.test.js",
    "tests/run-test.js"
)

$allPassed = $true

foreach ($file in $filesToCheck) {
    $fullPath = Join-Path $projectRoot $file
    
    if (-not (Test-Path $fullPath)) {
        Write-Host "[SKIP] $file (not found)" -ForegroundColor Yellow
        continue
    }
    
    Write-Host "Checking $file..." -NoNewline
    node -c $fullPath 2>&1 | Out-Null
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host " [OK]" -ForegroundColor Green
    } else {
        Write-Host " [FAIL]" -ForegroundColor Red
        Write-Host (node -c $fullPath 2>&1)
        $allPassed = $false
    }
}

# Final result
Write-Host ""
if ($allPassed) {
    Write-Host "[PASS] All JavaScript files have valid syntax" -ForegroundColor Green
    exit 0
} else {
    Write-Host "[FAIL] Some JavaScript files have syntax errors" -ForegroundColor Red
    exit 1
}
