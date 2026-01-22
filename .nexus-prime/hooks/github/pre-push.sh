#!/bin/bash
# ═══════════════════════════════════════════════════════════════════════════════
#  NEXUS-PRIME: GitHub Pre-Push Hook
#  Run before pushing to remote
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
echo "  NEXUS-PRIME: Pre-Push Checks"
echo "═══════════════════════════════════════════════════════════════════════════════"
echo ""

FAILED=false

# Run tests if available
if [ -f "package.json" ]; then
    if grep -q '"test"' package.json; then
        echo -e "${YELLOW}Running tests...${NC}"
        if npm test 2>/dev/null; then
            echo -e "${GREEN}${CHECK} Tests passed${NC}"
        else
            echo -e "${RED}${CROSS} Tests failed${NC}"
            FAILED=true
        fi
        echo ""
    fi
fi

# Run build if available
if [ -f "package.json" ]; then
    if grep -q '"build"' package.json; then
        echo -e "${YELLOW}Running build...${NC}"
        if npm run build 2>/dev/null; then
            echo -e "${GREEN}${CHECK} Build passed${NC}"
        else
            echo -e "${RED}${CROSS} Build failed${NC}"
            FAILED=true
        fi
        echo ""
    fi
fi

# Prevent pushing to main/master directly (optional)
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
PROTECTED_BRANCHES="main master"

for branch in $PROTECTED_BRANCHES; do
    if [ "$CURRENT_BRANCH" = "$branch" ]; then
        echo -e "${YELLOW}Warning: Pushing directly to $branch${NC}"
        echo "Consider creating a pull request instead."
        echo ""
        # Uncomment to block:
        # FAILED=true
    fi
done

# Final result
echo "═══════════════════════════════════════════════════════════════════════════════"
if [ "$FAILED" = true ]; then
    echo -e "${RED}${CROSS} Pre-push checks failed${NC}"
    exit 1
else
    echo -e "${GREEN}${CHECK} All pre-push checks passed${NC}"
fi
echo "═══════════════════════════════════════════════════════════════════════════════"
