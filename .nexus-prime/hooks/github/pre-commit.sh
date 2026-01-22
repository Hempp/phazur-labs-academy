#!/bin/bash
# ═══════════════════════════════════════════════════════════════════════════════
#  NEXUS-PRIME: GitHub Pre-Commit Hook
#  Run before each commit to ensure code quality
# ═══════════════════════════════════════════════════════════════════════════════

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

CHECK="✓"
CROSS="✗"

echo "═══════════════════════════════════════════════════════════════════════════════"
echo "  NEXUS-PRIME: Pre-Commit Checks"
echo "═══════════════════════════════════════════════════════════════════════════════"
echo ""

# Track failures
FAILED=false

# Run lint-staged if available
if [ -f "node_modules/.bin/lint-staged" ]; then
    echo -e "${YELLOW}Running lint-staged...${NC}"
    if npx lint-staged; then
        echo -e "${GREEN}${CHECK} Lint-staged passed${NC}"
    else
        echo -e "${RED}${CROSS} Lint-staged failed${NC}"
        FAILED=true
    fi
    echo ""
fi

# Type check for TypeScript projects
if [ -f "tsconfig.json" ]; then
    echo -e "${YELLOW}Running TypeScript check...${NC}"
    if npx tsc --noEmit 2>/dev/null; then
        echo -e "${GREEN}${CHECK} TypeScript check passed${NC}"
    else
        echo -e "${RED}${CROSS} TypeScript check failed${NC}"
        FAILED=true
    fi
    echo ""
fi

# Secret scanning
if command -v gitleaks &> /dev/null; then
    echo -e "${YELLOW}Scanning for secrets...${NC}"
    if gitleaks protect --staged --verbose 2>/dev/null; then
        echo -e "${GREEN}${CHECK} No secrets detected${NC}"
    else
        echo -e "${RED}${CROSS} Possible secrets detected!${NC}"
        FAILED=true
    fi
    echo ""
fi

# Final result
echo "═══════════════════════════════════════════════════════════════════════════════"
if [ "$FAILED" = true ]; then
    echo -e "${RED}${CROSS} Pre-commit checks failed${NC}"
    echo "Fix the issues above and try again."
    exit 1
else
    echo -e "${GREEN}${CHECK} All pre-commit checks passed${NC}"
fi
echo "═══════════════════════════════════════════════════════════════════════════════"
