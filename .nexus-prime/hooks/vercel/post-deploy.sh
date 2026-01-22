#!/bin/bash
# ═══════════════════════════════════════════════════════════════════════════════
#  NEXUS-PRIME: Vercel Post-Deployment Hook
#  Runs after successful deployment
# ═══════════════════════════════════════════════════════════════════════════════

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

CHECK="✓"
ROCKET="🚀"

# Arguments
DEPLOYMENT_URL="${1:-}"
DEPLOYMENT_ENV="${2:-preview}"

echo -e "${BLUE}${ROCKET} Running post-deployment hooks...${NC}"
echo "─────────────────────────────────────────────────────────────────────────────"

# 1. Log deployment
echo -e "  ${GREEN}${CHECK}${NC} Deployment successful"
if [ -n "$DEPLOYMENT_URL" ]; then
    echo -e "  URL: ${CYAN}$DEPLOYMENT_URL${NC}"
fi
echo -e "  Environment: $DEPLOYMENT_ENV"
echo -e "  Time: $(date)"

# 2. Smoke test (basic health check)
if [ -n "$DEPLOYMENT_URL" ]; then
    echo -ne "  Running smoke test..."
    if curl -s -o /dev/null -w "%{http_code}" "$DEPLOYMENT_URL" | grep -q "200\|301\|302"; then
        echo -e " ${GREEN}${CHECK}${NC}"
    else
        echo -e " ⚠ site may not be responding"
    fi
fi

# 3. Warm cache
if [ -n "$DEPLOYMENT_URL" ]; then
    echo -ne "  Warming cache..."
    # Hit a few key pages to warm the cache
    curl -s -o /dev/null "$DEPLOYMENT_URL" 2>/dev/null || true
    curl -s -o /dev/null "$DEPLOYMENT_URL/api/health" 2>/dev/null || true
    echo -e " ${GREEN}${CHECK}${NC}"
fi

# 4. Notify (if Slack webhook is configured)
if [ -n "$SLACK_WEBHOOK_URL" ]; then
    echo -ne "  Sending notification..."
    curl -s -X POST -H 'Content-type: application/json' \
        --data "{\"text\":\"${ROCKET} Deployment successful!\nURL: $DEPLOYMENT_URL\nEnvironment: $DEPLOYMENT_ENV\"}" \
        "$SLACK_WEBHOOK_URL" > /dev/null 2>&1 && \
        echo -e " ${GREEN}${CHECK}${NC}" || echo -e " ⚠ notification failed"
fi

# 5. Log to file
LOG_FILE="${HOME}/.nexus-prime/logs/vercel-deployments.log"
mkdir -p "$(dirname "$LOG_FILE")"
echo "[$(date -Iseconds)] $DEPLOYMENT_ENV | $DEPLOYMENT_URL" >> "$LOG_FILE"

echo "─────────────────────────────────────────────────────────────────────────────"
echo -e "${GREEN}${CHECK} Post-deployment hooks complete${NC}"
