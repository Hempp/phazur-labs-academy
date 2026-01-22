#!/bin/bash
# ═══════════════════════════════════════════════════════════════════════════════
#  NEXUS-PRIME: Vercel Deploy Command
#  Deploy to Vercel with pre-deployment checks and notifications
# ═══════════════════════════════════════════════════════════════════════════════

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Icons
CHECK="✓"
CROSS="✗"
ROCKET="🚀"
GEAR="⚙️"
CLOCK="⏱️"

# Configuration
VERCEL_CMD="vercel"
PRODUCTION=false
FORCE=false
SKIP_CHECKS=false
VERBOSE=false

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --prod|--production)
            PRODUCTION=true
            shift
            ;;
        --force)
            FORCE=true
            shift
            ;;
        --skip-checks)
            SKIP_CHECKS=true
            shift
            ;;
        --verbose|-v)
            VERBOSE=true
            shift
            ;;
        --help|-h)
            echo "Usage: vercel-deploy [options]"
            echo ""
            echo "Options:"
            echo "  --prod, --production  Deploy to production"
            echo "  --force               Force rebuild"
            echo "  --skip-checks         Skip pre-deployment checks"
            echo "  --verbose, -v         Verbose output"
            echo "  --help, -h            Show this help"
            exit 0
            ;;
        *)
            shift
            ;;
    esac
done

# Header
echo -e "${CYAN}"
echo "═══════════════════════════════════════════════════════════════════════════════"
echo "  NEXUS-PRIME: Vercel Deployment"
echo "  ${ROCKET} DEPLOY-MASTER Activated"
echo "═══════════════════════════════════════════════════════════════════════════════"
echo -e "${NC}"

# Function: Check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function: Run check with status
run_check() {
    local name="$1"
    local command="$2"
    
    echo -ne "${YELLOW}${GEAR} Running: ${name}...${NC}"
    
    if eval "$command" > /dev/null 2>&1; then
        echo -e "\r${GREEN}${CHECK} ${name}${NC}                    "
        return 0
    else
        echo -e "\r${RED}${CROSS} ${name}${NC}                    "
        return 1
    fi
}

# Check Vercel CLI
if ! command_exists vercel; then
    echo -e "${RED}${CROSS} Vercel CLI not found. Install with: npm i -g vercel${NC}"
    exit 1
fi

# Check if logged in
if ! vercel whoami > /dev/null 2>&1; then
    echo -e "${RED}${CROSS} Not logged in to Vercel. Run: vercel login${NC}"
    exit 1
fi

# Pre-deployment checks
if [ "$SKIP_CHECKS" = false ]; then
    echo -e "${BLUE}Pre-deployment Checks${NC}"
    echo "─────────────────────────────────────────────────────────────────────────────"
    
    CHECKS_PASSED=true
    
    # Git status check
    if [ -d ".git" ]; then
        if [ -n "$(git status --porcelain)" ]; then
            echo -e "${YELLOW}! Uncommitted changes detected${NC}"
        else
            echo -e "${GREEN}${CHECK} Git working tree clean${NC}"
        fi
    fi
    
    # Type check
    if [ -f "tsconfig.json" ]; then
        if command_exists tsc || [ -f "node_modules/.bin/tsc" ]; then
            if ! run_check "TypeScript check" "npx tsc --noEmit"; then
                CHECKS_PASSED=false
            fi
        fi
    fi
    
    # Lint check
    if [ -f "package.json" ] && grep -q '"lint"' package.json; then
        if ! run_check "Lint check" "npm run lint"; then
            CHECKS_PASSED=false
        fi
    fi
    
    # Test check (optional, don't fail on this)
    if [ -f "package.json" ] && grep -q '"test"' package.json; then
        run_check "Tests" "npm test" || true
    fi
    
    # Build check
    if [ -f "package.json" ] && grep -q '"build"' package.json; then
        if ! run_check "Build" "npm run build"; then
            CHECKS_PASSED=false
        fi
    fi
    
    echo "─────────────────────────────────────────────────────────────────────────────"
    
    if [ "$CHECKS_PASSED" = false ] && [ "$FORCE" = false ]; then
        echo -e "${RED}${CROSS} Pre-deployment checks failed. Use --force to deploy anyway.${NC}"
        exit 1
    fi
fi

# Build deployment command
DEPLOY_CMD="$VERCEL_CMD"

if [ "$PRODUCTION" = true ]; then
    DEPLOY_CMD="$DEPLOY_CMD --prod"
    echo -e "${YELLOW}${ROCKET} Deploying to PRODUCTION${NC}"
else
    echo -e "${BLUE}${ROCKET} Deploying preview${NC}"
fi

if [ "$FORCE" = true ]; then
    DEPLOY_CMD="$DEPLOY_CMD --force"
fi

DEPLOY_CMD="$DEPLOY_CMD --yes"

# Deploy
echo ""
echo -e "${CYAN}${CLOCK} Starting deployment...${NC}"
echo "─────────────────────────────────────────────────────────────────────────────"

START_TIME=$(date +%s)

# Execute deployment
DEPLOY_OUTPUT=$($DEPLOY_CMD 2>&1)
DEPLOY_STATUS=$?

END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))

echo "─────────────────────────────────────────────────────────────────────────────"

if [ $DEPLOY_STATUS -eq 0 ]; then
    # Extract URL from output
    DEPLOY_URL=$(echo "$DEPLOY_OUTPUT" | grep -E "https://.*\.vercel\.app" | head -1 | tr -d '[:space:]')
    
    echo -e "${GREEN}"
    echo "═══════════════════════════════════════════════════════════════════════════════"
    echo "  ${CHECK} Deployment Successful!"
    echo "═══════════════════════════════════════════════════════════════════════════════"
    echo -e "${NC}"
    echo -e "${CYAN}URL:${NC} $DEPLOY_URL"
    echo -e "${CYAN}Duration:${NC} ${DURATION}s"
    echo ""
    
    if [ "$PRODUCTION" = true ]; then
        echo -e "${GREEN}${ROCKET} Production deployment complete!${NC}"
    else
        echo -e "${BLUE}Preview deployment complete!${NC}"
        echo -e "Run ${YELLOW}vercel promote $DEPLOY_URL${NC} to promote to production"
    fi
else
    echo -e "${RED}"
    echo "═══════════════════════════════════════════════════════════════════════════════"
    echo "  ${CROSS} Deployment Failed"
    echo "═══════════════════════════════════════════════════════════════════════════════"
    echo -e "${NC}"
    echo "$DEPLOY_OUTPUT"
    exit 1
fi

echo ""
echo -e "${CYAN}─────────────────────────────────────────────────────────────────────────────${NC}"
echo -e "${CYAN}  NEXUS-PRIME: Deployment Complete${NC}"
echo -e "${CYAN}─────────────────────────────────────────────────────────────────────────────${NC}"
