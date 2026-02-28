#!/usr/bin/env bash
# Areas of IO — Quickstart
# Run this once to set up all Notion databases and update config.
#
# Usage:
#   chmod +x scripts/quickstart.sh
#   ./scripts/quickstart.sh
#
# Prerequisites:
#   - Node.js >= 18
#   - NOTION_API_KEY set in .env file
#
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$PROJECT_ROOT"

echo "=== Areas of IO — Quickstart ==="
echo ""

# 1. Check .env
if [ ! -f .env ]; then
  echo "Error: .env file not found"
  echo "Create it with: echo 'NOTION_API_KEY=your_key_here' > .env"
  exit 1
fi

if ! grep -q 'NOTION_API_KEY' .env; then
  echo "Error: NOTION_API_KEY not found in .env"
  exit 1
fi

echo "[1/4] Installing dependencies..."
npm install --silent

echo "[2/4] Creating Notion databases (this takes ~3 minutes)..."
OUTPUT=$(node scripts/setup-areas.js 2>&1)
echo "$OUTPUT"

# 3. Extract database IDs and update .env
echo ""
echo "[3/4] Updating .env with database IDs..."

SECTION_LIB_DB=$(echo "$OUTPUT" | grep 'NOTION_SECTION_LIBRARY_DB=' | head -1 | cut -d= -f2)
AREAS_DB=$(echo "$OUTPUT" | grep 'NOTION_AREAS_DB=' | head -1 | cut -d= -f2)
ARTICLES_DB=$(echo "$OUTPUT" | grep 'NOTION_ARTICLES_DB=' | head -1 | cut -d= -f2)
QUESTIONS_DB=$(echo "$OUTPUT" | grep 'NOTION_QUESTIONS_DB=' | head -1 | cut -d= -f2)
STRUCTURED_DATA_DB=$(echo "$OUTPUT" | grep 'NOTION_STRUCTURED_DATA_DB=' | head -1 | cut -d= -f2)

# Append to .env (avoid duplicates)
for VAR_LINE in \
  "NOTION_SECTION_LIBRARY_DB=$SECTION_LIB_DB" \
  "NOTION_AREAS_DB=$AREAS_DB" \
  "NOTION_ARTICLES_DB=$ARTICLES_DB" \
  "NOTION_QUESTIONS_DB=$QUESTIONS_DB" \
  "NOTION_STRUCTURED_DATA_DB=$STRUCTURED_DATA_DB"
do
  KEY=$(echo "$VAR_LINE" | cut -d= -f1)
  if grep -q "^$KEY=" .env 2>/dev/null; then
    # Update existing
    sed -i "s|^$KEY=.*|$VAR_LINE|" .env
  else
    echo "$VAR_LINE" >> .env
  fi
done

# 4. Update config JSON
echo "[4/4] Updating io-site-builder.config.json..."
node -e "
const fs = require('fs');
const cfg = JSON.parse(fs.readFileSync('io-site-builder.config.json','utf-8'));
cfg.notion.databases.sectionLibrary = '$SECTION_LIB_DB';
cfg.notion.databases.areas = '$AREAS_DB';
cfg.notion.databases.articles = '$ARTICLES_DB';
cfg.notion.databases.questions = '$QUESTIONS_DB';
cfg.notion.databases.structuredData = '$STRUCTURED_DATA_DB';
fs.writeFileSync('io-site-builder.config.json', JSON.stringify(cfg, null, 2) + '\n');
console.log('  Config updated with all 5 database IDs');
"

echo ""
echo "=== Quickstart Complete ==="
echo ""
echo "Next steps:"
echo "  1. Open 'Areas of IO' in Notion — you'll see all 5 databases"
echo "  2. Create articles in 'IO Articles' database"
echo "  3. Run: node src/cli/index.js bulk-publish --area notion-io"
echo ""
echo "Useful commands:"
echo "  node src/cli/index.js bulk-publish --area <slug>    # Publish an area"
echo "  node src/cli/index.js build-article --id <page-id>  # Build one article"
echo "  ./scripts/bulk-publish.sh <area-slug>               # Shell shortcut"
echo ""
