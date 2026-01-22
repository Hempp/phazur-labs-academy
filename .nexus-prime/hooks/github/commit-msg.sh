#!/bin/bash
# ═══════════════════════════════════════════════════════════════════════════════
#  NEXUS-PRIME: GitHub Commit Message Hook
#  Validate commit message format (Conventional Commits)
# ═══════════════════════════════════════════════════════════════════════════════

COMMIT_MSG_FILE="$1"
COMMIT_MSG=$(cat "$COMMIT_MSG_FILE")

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Conventional commit pattern
PATTERN="^(feat|fix|docs|style|refactor|test|chore|perf|ci|build|revert)(\(.+\))?: .{1,100}"

# Check if commitlint is available
if [ -f "node_modules/.bin/commitlint" ]; then
    npx commitlint --edit "$COMMIT_MSG_FILE"
    exit $?
fi

# Fallback to basic validation
if [[ ! $COMMIT_MSG =~ $PATTERN ]]; then
    echo ""
    echo -e "${RED}═══════════════════════════════════════════════════════════════════════════════${NC}"
    echo -e "${RED}  Invalid commit message format!${NC}"
    echo -e "${RED}═══════════════════════════════════════════════════════════════════════════════${NC}"
    echo ""
    echo "Commit message must follow Conventional Commits format:"
    echo ""
    echo -e "  ${GREEN}<type>(<scope>): <description>${NC}"
    echo ""
    echo "Types: feat, fix, docs, style, refactor, test, chore, perf, ci, build, revert"
    echo ""
    echo "Examples:"
    echo -e "  ${YELLOW}feat(auth): add OAuth2 login support${NC}"
    echo -e "  ${YELLOW}fix(api): resolve race condition in data fetching${NC}"
    echo -e "  ${YELLOW}docs: update installation instructions${NC}"
    echo ""
    echo "Your message: $COMMIT_MSG"
    echo ""
    exit 1
fi

echo -e "${GREEN}✓ Commit message format valid${NC}"
