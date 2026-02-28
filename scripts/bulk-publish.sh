#!/usr/bin/env bash
# Bulk publish all approved articles for an area (or all areas)
# Usage: ./scripts/bulk-publish.sh [area-id] [--status Published]
set -euo pipefail

AREA="${1:-}"
STATUS="${2:---status}"
STATUS_VAL="${3:-Approved}"

echo "=== IO Bulk Publish ==="
echo "Area: ${AREA:-all} | Status: ${STATUS_VAL}"

node src/cli/index.js bulk-publish \
  ${AREA:+--area "$AREA"} \
  --status "$STATUS_VAL" \
  --output dist \
  --theme G100

echo "Build complete. Files in dist/"
