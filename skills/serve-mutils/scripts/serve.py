#!/usr/bin/env python3
"""Start a local Python HTTP server for the mutils project.

Usage:
    python scripts/serve.py              # default port 8000
    python scripts/serve.py --port 8080  # custom port
"""
import argparse
import os
import subprocess
import sys
import webbrowser
from pathlib import Path


def main():
    parser = argparse.ArgumentParser(description="Start the mutils web server")
    parser.add_argument("--port", "-p", type=int, default=8000, help="Port number (default: 8000)")
    parser.add_argument("--open", "-o", action="store_true", help="Open browser automatically")
    args = parser.parse_args()

    project_root = Path(__file__).resolve().parent.parent

    print(f"Serving {project_root} on http://localhost:{args.port}")
    if args.open:
        webbrowser.open(f"http://localhost:{args.port}")

    # Run the server (blocks until interrupted)
    cmd = [sys.executable, "-m", "http.server", str(args.port), "--directory", str(project_root)]
    subprocess.run(cmd, check=True)


if __name__ == "__main__":
    main()
