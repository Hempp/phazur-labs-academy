#!/bin/bash
# ═══════════════════════════════════════════════════════════════════════════════
#  NEXUS-PRIME: Vercel Rollback Command
#  Rollback deployments with DEPLOY-MASTER agent
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
CHECK="✓"
CROSS="✗"
REWIND="⏪"
WARNING="⚠️"

# Header
print_header() {
    echo -e "${CYAN}"
    echo "═══════════════════════════════════════════════════════════════════════════════"
    echo "  NEXUS-PRIME: Vercel Rollback"
    echo "  ${REWIND} DEPLOY-MASTER Activated"
    echo "═══════════════════════════════════════════════════════════════════════════════"
    echo -e "${NC}"
}

# Help
print_help() {
    echo "Usage: vercel-rollback [deployment-id] [options]"
    echo ""
    echo "Arguments:"
    echo "  deployment-id           Specific deployment to rollback to (optional)"
    echo ""
    echo "Options:"
    echo "  --list, -l              List recent deployments first"
    echo "  --confirm, -y           Skip confirmation"
    echo "  --help, -h              Show this help"
    echo ""
    echo "Examples:"
    echo "  vercel-rollback                    # Rollback to previous deployment"
    echo "  vercel-rollback dpl_xxx            # Rollback to specific deployment"
    echo "  vercel-rollback --list             # Show deployments then rollback"
}

# List recent deployments
list_deployments() {
    echo -e "${BLUE}Recent Deployments${NC}"
    echo "─────────────────────────────────────────────────────────────────────────────"
    vercel ls --prod -n 10
    echo "─────────────────────────────────────────────────────────────────────────────"
    echo ""
}

# Main
print_header

DEPLOYMENT_ID=""
LIST=false
CONFIRM=""

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --list|-l)
            LIST=true
            shift
            ;;
        --confirm|-y)
            CONFIRM="--yes"
            shift
            ;;
        --help|-h)
            print_help
            exit 0
            ;;
        -*)
            shift
            ;;
        *)
            DEPLOYMENT_ID="$1"
            shift
            ;;
    esac
done

# List deployments if requested
if [ "$LIST" = true ]; then
    list_deployments
fi

# Warning
echo -e "${YELLOW}${WARNING} WARNING: This will rollback your production deployment${NC}"
echo ""

if [ -z "$CONFIRM" ]; then
    read -p "Are you sure you want to proceed? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${YELLOW}Rollback cancelled${NC}"
        exit 0
    fi
fi

# Execute rollback
echo ""
echo -e "${BLUE}${REWIND} Initiating rollback...${NC}"
echo "─────────────────────────────────────────────────────────────────────────────"

if [ -n "$DEPLOYMENT_ID" ]; then
    echo "Rolling back to: $DEPLOYMENT_ID"
    vercel rollback "$DEPLOYMENT_ID" --yes
else
    echo "Rolling back to previous deployment..."
    vercel rollback --yes
fi

echo "─────────────────────────────────────────────────────────────────────────────"
echo ""
echo -e "${GREEN}${CHECK} Rollback completed successfully${NC}"
echo ""
echo -e "${YELLOW}Post-rollback checks:${NC}"
echo "  • Verify site is working: vercel-logs --follow"
echo "  • Check analytics: vercel-analytics"
echo "  • Notify team if needed"
