#!/usr/bin/env bash
# Publish a single article by Notion page ID
# Usage: ./scripts/publish-single.sh <article-page-id>
set -euo pipefail

if [ -z "${1:-}" ]; then
  echo "Usage: ./scripts/publish-single.sh <article-page-id>"
  exit 1
fi

echo "Publishing article: $1"
node src/cli/index.js build-article --id "$1" --output dist --theme G100
echo "Done. Output in dist/"
