#!/bin/bash
# ═══════════════════════════════════════════════════════════════════════════════
#  NEXUS-PRIME: Vercel Pre-Deployment Hook
#  Runs before every deployment
# ═══════════════════════════════════════════════════════════════════════════════

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

CHECK="✓"
CROSS="✗"
GEAR="⚙️"

echo -e "${BLUE}${GEAR} Running pre-deployment hooks...${NC}"
echo "─────────────────────────────────────────────────────────────────────────────"

# Track failures
FAILURES=0

# 1. Check for uncommitted changes
echo -ne "  Checking git status..."
if [ -d ".git" ]; then
    if [ -n "$(git status --porcelain)" ]; then
        echo -e " ${YELLOW}⚠ uncommitted changes${NC}"
    else
        echo -e " ${GREEN}${CHECK}${NC}"
    fi
else
    echo -e " ${YELLOW}⚠ not a git repo${NC}"
fi

# 2. Lint check
if [ -f "package.json" ] && grep -q '"lint"' package.json; then
    echo -ne "  Running lint..."
    if npm run lint > /dev/null 2>&1; then
        echo -e " ${GREEN}${CHECK}${NC}"
    else
        echo -e " ${RED}${CROSS}${NC}"
        ((FAILURES++))
    fi
fi

# 3. Type check
if [ -f "tsconfig.json" ]; then
    echo -ne "  Running type check..."
    if npx tsc --noEmit > /dev/null 2>&1; then
        echo -e " ${GREEN}${CHECK}${NC}"
    else
        echo -e " ${RED}${CROSS}${NC}"
        ((FAILURES++))
    fi
fi

# 4. Test suite (warning only)
if [ -f "package.json" ] && grep -q '"test"' package.json; then
    echo -ne "  Running tests..."
    if npm test > /dev/null 2>&1; then
        echo -e " ${GREEN}${CHECK}${NC}"
    else
        echo -e " ${YELLOW}⚠ tests failed${NC}"
    fi
fi

# 5. Security audit (warning only)
echo -ne "  Running security audit..."
if npm audit --audit-level=high > /dev/null 2>&1; then
    echo -e " ${GREEN}${CHECK}${NC}"
else
    echo -e " ${YELLOW}⚠ vulnerabilities found${NC}"
fi

# 6. Environment validation
echo -ne "  Validating environment..."
if [ -f ".env.local" ] || [ -f ".env" ]; then
    echo -e " ${GREEN}${CHECK}${NC}"
else
    echo -e " ${YELLOW}⚠ no local env file${NC}"
fi

# 7. Build test
if [ -f "package.json" ] && grep -q '"build"' package.json; then
    echo -ne "  Testing build..."
    if npm run build > /dev/null 2>&1; then
        echo -e " ${GREEN}${CHECK}${NC}"
    else
        echo -e " ${RED}${CROSS}${NC}"
        ((FAILURES++))
    fi
fi

echo "─────────────────────────────────────────────────────────────────────────────"

if [ $FAILURES -gt 0 ]; then
    echo -e "${RED}${CROSS} Pre-deployment checks failed ($FAILURES errors)${NC}"
    echo -e "${YELLOW}Use --force to deploy anyway${NC}"
    exit 1
else
    echo -e "${GREEN}${CHECK} All pre-deployment checks passed${NC}"
    exit 0
fi
