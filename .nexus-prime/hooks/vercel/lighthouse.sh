#!/bin/bash
# ═══════════════════════════════════════════════════════════════════════════════
#  NEXUS-PRIME: Lighthouse Performance Hook
#  Run Lighthouse audit after deployment
# ═══════════════════════════════════════════════════════════════════════════════

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

CHART="📊"

# Arguments
URL="${1:-}"

if [ -z "$URL" ]; then
    echo -e "${RED}Usage: lighthouse.sh <url>${NC}"
    exit 1
fi

echo -e "${BLUE}${CHART} Running Lighthouse audit...${NC}"
echo "URL: $URL"
echo "─────────────────────────────────────────────────────────────────────────────"

# Check if Lighthouse is installed
if ! command -v lighthouse &> /dev/null; then
    echo -e "${YELLOW}Installing Lighthouse...${NC}"
    npm install -g lighthouse
fi

# Create output directory
OUTPUT_DIR="${HOME}/.nexus-prime/reports/lighthouse"
mkdir -p "$OUTPUT_DIR"

# Generate timestamp for filename
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
OUTPUT_FILE="$OUTPUT_DIR/report_$TIMESTAMP.html"

# Run Lighthouse
lighthouse "$URL" \
    --output=html \
    --output-path="$OUTPUT_FILE" \
    --chrome-flags="--headless --no-sandbox" \
    --only-categories=performance,accessibility,best-practices,seo \
    --quiet

echo "─────────────────────────────────────────────────────────────────────────────"
echo -e "${GREEN}✓ Lighthouse report generated${NC}"
echo -e "Report: ${BLUE}$OUTPUT_FILE${NC}"

# Parse scores if jq is available
if command -v jq &> /dev/null; then
    JSON_FILE="${OUTPUT_FILE%.html}.json"
    lighthouse "$URL" \
        --output=json \
        --output-path="$JSON_FILE" \
        --chrome-flags="--headless --no-sandbox" \
        --only-categories=performance,accessibility,best-practices,seo \
        --quiet 2>/dev/null || true
    
    if [ -f "$JSON_FILE" ]; then
        echo ""
        echo "Scores:"
        PERF=$(jq '.categories.performance.score * 100' "$JSON_FILE" 2>/dev/null || echo "N/A")
        A11Y=$(jq '.categories.accessibility.score * 100' "$JSON_FILE" 2>/dev/null || echo "N/A")
        BP=$(jq '.categories["best-practices"].score * 100' "$JSON_FILE" 2>/dev/null || echo "N/A")
        SEO=$(jq '.categories.seo.score * 100' "$JSON_FILE" 2>/dev/null || echo "N/A")
        
        echo "  Performance:    $PERF"
        echo "  Accessibility:  $A11Y"
        echo "  Best Practices: $BP"
        echo "  SEO:            $SEO"
    fi
fi
