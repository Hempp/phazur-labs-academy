#!/bin/bash
# ═══════════════════════════════════════════════════════════════════════════════
#  NEXUS-PRIME: Vercel Deployment Error Hook
#  Runs when deployment fails
# ═══════════════════════════════════════════════════════════════════════════════

set -e

# Colors
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

CROSS="✗"
WARNING="⚠️"

# Arguments
ERROR_MESSAGE="${1:-Unknown error}"
DEPLOYMENT_ID="${2:-}"

echo -e "${RED}${CROSS} Deployment Failed${NC}"
echo "─────────────────────────────────────────────────────────────────────────────"
echo -e "Error: ${RED}$ERROR_MESSAGE${NC}"
echo -e "Time: $(date)"
if [ -n "$DEPLOYMENT_ID" ]; then
    echo -e "Deployment ID: $DEPLOYMENT_ID"
fi
echo "─────────────────────────────────────────────────────────────────────────────"

# Notify Slack if configured
if [ -n "$SLACK_WEBHOOK_URL" ]; then
    curl -s -X POST -H 'Content-type: application/json' \
        --data "{\"text\":\"${WARNING} Deployment failed!\nError: $ERROR_MESSAGE\nDeployment: $DEPLOYMENT_ID\"}" \
        "$SLACK_WEBHOOK_URL" > /dev/null 2>&1 || true
fi

# Log error
LOG_FILE="${HOME}/.nexus-prime/logs/vercel-errors.log"
mkdir -p "$(dirname "$LOG_FILE")"
echo "[$(date -Iseconds)] ERROR | $ERROR_MESSAGE | $DEPLOYMENT_ID" >> "$LOG_FILE"

echo ""
echo -e "${YELLOW}Troubleshooting tips:${NC}"
echo "  1. Check build logs: vercel logs --deployment $DEPLOYMENT_ID"
echo "  2. Verify environment variables: vercel env ls"
echo "  3. Test build locally: npm run build"
echo "  4. Check for TypeScript errors: npx tsc --noEmit"
