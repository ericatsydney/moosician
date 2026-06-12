---
name: serve-mutils
description: Start a local Python HTTP server for the mutils project. Use when the user asks to preview, serve, or open the mutils site in the browser, or to run a local development server for testing HTML/CSS/JS changes.
---

# Serve Mutils

Start a simple Python HTTP server for the mutils project root directory.

## Quick Start

Run the script:

```bash
python scripts/serve.py
```

This serves the project root at `http://localhost:8000`.

## Options

| Flag | Description |
|------|-------------|
| `--port`, `-p` | Set a custom port (default: 8000) |
| `--open`, `-o`  | Open the browser automatically |

## Examples

```bash
# Default on port 8000
python scripts/serve.py

# Custom port with auto-open browser
python scripts/serve.py --port 8080 --open
```

## Notes

- The server blocks the terminal — use Ctrl+C to stop.
- Works on Windows (Python 3) and cross-platform.
- For background serving on Windows, use `Start-Process` or a background job with `&`.
