#!/usr/bin/env python3

import os
from pathlib import Path
import sys

import uvicorn


project_root = Path(__file__).resolve().parent.parent
if str(project_root) not in sys.path:
    sys.path.insert(0, str(project_root))

os.chdir(project_root)

from backend.app import app


if __name__ == "__main__":
    port = int(os.getenv("PORT", "8001"))
    uvicorn.run(
        app,
        host="127.0.0.1",
        port=port,
        reload=os.getenv("UVICORN_RELOAD", "0") == "1",
        log_level="info",
    )
