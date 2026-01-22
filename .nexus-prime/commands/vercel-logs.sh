#!/bin/bash
# ═══════════════════════════════════════════════════════════════════════════════
#  NEXUS-PRIME: Vercel Logs Command
#  View and analyze logs with METRICS-WATCH agent
# ═══════════════════════════════════════════════════════════════════════════════

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

# Icons
CHART="📊"

# Header
print_header() {
    echo -e "${CYAN}"
    echo "═══════════════════════════════════════════════════════════════════════════════"
    echo "  NEXUS-PRIME: Vercel Logs Viewer"
    echo "  ${CHART} METRICS-WATCH Activated"
    echo "═══════════════════════════════════════════════════════════════════════════════"
    echo -e "${NC}"
}

# Help
print_help() {
    echo "Usage: vercel-logs [options]"
    echo ""
    echo "Options:"
    echo "  --follow, -f            Stream logs in real-time"
    echo "  --filter <pattern>      Filter logs by pattern"
    echo "  --since <time>          Show logs since (e.g., 1h, 30m, 1d)"
    echo "  --deployment <url>      Specific deployment URL"
    echo "  --output <type>         Output type (raw, json)"
    echo "  --help, -h              Show this help"
    echo ""
    echo "Examples:"
    echo "  vercel-logs"
    echo "  vercel-logs --follow"
    echo "  vercel-logs --filter error --since 1h"
    echo "  vercel-logs --deployment https://myapp-xxx.vercel.app"
}

# Main
print_header

FOLLOW=""
FILTER=""
SINCE=""
DEPLOYMENT=""
OUTPUT=""

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --follow|-f)
            FOLLOW="--follow"
            shift
            ;;
        --filter)
            FILTER="$2"
            shift 2
            ;;
        --since)
            SINCE="--since $2"
            shift 2
            ;;
        --deployment)
            DEPLOYMENT="$2"
            shift 2
            ;;
        --output)
            OUTPUT="--output $2"
            shift 2
            ;;
        --help|-h)
            print_help
            exit 0
            ;;
        *)
            shift
            ;;
    esac
done

# Build command
CMD="vercel logs"

if [ -n "$DEPLOYMENT" ]; then
    CMD="$CMD $DEPLOYMENT"
fi

if [ -n "$FOLLOW" ]; then
    CMD="$CMD $FOLLOW"
fi

if [ -n "$SINCE" ]; then
    CMD="$CMD $SINCE"
fi

if [ -n "$OUTPUT" ]; then
    CMD="$CMD $OUTPUT"
fi

echo -e "${BLUE}Fetching logs...${NC}"
echo "─────────────────────────────────────────────────────────────────────────────"

if [ -n "$FILTER" ]; then
    eval "$CMD" | grep -i --color=auto "$FILTER"
else
    eval "$CMD"
fi
