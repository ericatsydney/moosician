#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Stage, commit, and push changes to Git.

.DESCRIPTION
    Adds all unstaged files, commits with the provided message, and pushes to origin main.
    Returns exit code 0 (success) or 1 (failure).

.PARAMETER Message
    The commit message to use.

.EXAMPLE
    .\scripts\git-push.ps1 "Add metronome feature"
    echo $LASTEXITCODE  # 0 = success, 1 = failed
#>

param(
    [Parameter(Mandatory=$true, HelpMessage="Commit message")]
    [string]$Message
)

Write-Host "Git workflow: add, commit, push" -ForegroundColor Cyan

# Stage all changes
Write-Host "Running: git add ." -NoNewline
git add .
if ($LASTEXITCODE -ne 0) {
    Write-Host " [FAIL]" -ForegroundColor Red
    Write-Host "[FAIL] Failed to stage files" -ForegroundColor Red
    exit 1
}
Write-Host " [OK]" -ForegroundColor Green

# Commit
Write-Host "Running: git commit -m `"$Message`"" -NoNewline
git commit -m $Message
if ($LASTEXITCODE -ne 0) {
    Write-Host " [FAIL]" -ForegroundColor Red
    Write-Host "[FAIL] Failed to commit" -ForegroundColor Red
    exit 1
}
Write-Host " [OK]" -ForegroundColor Green

# Confirm before push
Write-Host ""
$confirm = Read-Host "Ready to push to origin main? (y/n)"
if ($confirm -ne "y" -and $confirm -ne "Y") {
    Write-Host "[SKIP] Push cancelled by user" -ForegroundColor Yellow
    exit 0
}

# Push
Write-Host "Running: git push origin main" -NoNewline
git push origin main
if ($LASTEXITCODE -ne 0) {
    Write-Host " [FAIL]" -ForegroundColor Red
    Write-Host "[FAIL] Failed to push" -ForegroundColor Red
    exit 1
}
Write-Host " [OK]" -ForegroundColor Green

Write-Host "`n[PASS] Changes pushed successfully" -ForegroundColor Green
exit 0
