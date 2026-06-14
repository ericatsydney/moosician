# Moosucian

A small music utility page for guitar and songwriting workflows.

## What this page is about

This project is a lightweight page shell for music-focused widgets. It currently includes a metronome module designed for tempo discovery and a strummer module for rhythm patterns.

## Current functionality

- **Metronome widget**
  - BPM input with range validation (30-300)
  - Single Start / Stop toggle control
  - Mute toggle
  - Fixed 4/4 beat display with accented downbeat
  - Tap tempo button for matching a song's tempo
  - Persistent BPM and mute state via `localStorage`

## How to start locally

1. Open a terminal in the project root.
2. Run a simple local server from the repo directory:

```bash
python -m http.server 8000
```

3. Open your browser and visit:

```text
http://localhost:8000
```

## How to run tests

### Syntax validation

Validate all JavaScript files for syntax errors:

```powershell
.\scripts\validate-syntax.ps1
```

Returns:
- Exit code `0` if all files pass
- Exit code `1` if any file has syntax errors

### CLI smoke test (recommended)

Run tests directly from the terminal:

```bash
node tests/run-test.js
```

### Test automation script

For CI/CD pipelines and automation hooks, use the test script wrapper:

```powershell
.\scripts\test.ps1
```

This returns:
- Exit code `0` if all tests pass
- Exit code `1` if any test fails

Example usage in an automation hook:

```powershell
# Validate syntax first
.\scripts\validate-syntax.ps1
if ($LASTEXITCODE -ne 0) {
    Write-Host "Syntax validation failed - abort"
    exit 1
}

# Then run tests
.\scripts\test.ps1
if ($LASTEXITCODE -ne 0) {
    Write-Host "Tests failed - abort"
    exit 1
}

Write-Host "All checks passed - proceed with deployment"
```

### Git workflow script

Stage, commit, and push all changes in one command:

```powershell
.\scripts\git-push.ps1 "Your commit message here"
```

This will:
1. Stage all files (`git add .`)
2. Commit with the provided message
3. Push to `origin main`

Returns:
- Exit code `0` if push succeeds
- Exit code `1` if any step fails

Example:
```powershell
.\scripts\git-push.ps1 "Add tap tempo feature to metronome"
```

### Final pre-commit workflow

The repository includes an AI skill/agent named `gitcommit` for automating the final validation and push process.

This agent is defined in `.copilot/agents/gitcommit/AGENTS.md` and is configured in `.copilot/agents/settings.json`.

The workflow should perform these steps:
1. Run `scripts/validate-syntax.ps1`
2. Run `scripts/test.ps1`
3. Run `scripts/git-push.ps1`

The workflow aborts immediately if syntax validation or tests fail.

If you want to keep the automated shell wrapper, you can still run the existing `scripts/git-push.ps1` script directly with a commit message.

Returns:
- Exit code `0` if all checks pass and push succeeds
- Exit code `1` if any step fails

The test script checks:
- HTML markup structure and required elements
- CSS styles for the widget
- JavaScript implementation and functions
- Test infrastructure files
- Documentation completeness

### Browser smoke test (interactive)

Alternatively, run tests in the browser:

1. Start the local server if it is not already running.
2. Visit:

```text
http://localhost:8000/tests/metronome-smoke.html
```

3. The page will automatically run the smoke tests and display a pass/fail summary.

## Files of note

- `index.html` â€” main page shell with component placeholders
- `components/main.html` â€” main content and metronome widget markup
- `assets/css/metronome.css` â€” metronome widget styles
- `assets/js/metronome.js` â€” metronome behavior and scheduling logic
- `tests/metronome-smoke.html` â€” smoke test harness page
- `tests/metronome.test.js` â€” automated smoke test script
