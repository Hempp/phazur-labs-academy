#!/bin/bash
# ═══════════════════════════════════════════════════════════════════════════════
#  NEXUS-PRIME: GitHub Post-Merge Hook
#  Run after merging (e.g., git pull)
# ═══════════════════════════════════════════════════════════════════════════════

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

CHECK="✓"

echo ""
echo -e "${CYAN}═══════════════════════════════════════════════════════════════════════════════${NC}"
echo -e "${CYAN}  NEXUS-PRIME: Post-Merge Tasks${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════════════════════════════════${NC}"
echo ""

# Check if package.json changed
CHANGED_FILES=$(git diff-tree -r --name-only --no-commit-id ORIG_HEAD HEAD)

if echo "$CHANGED_FILES" | grep -q "package-lock.json\|package.json"; then
    echo -e "${YELLOW}Package files changed. Running npm install...${NC}"
    npm install
    echo -e "${GREEN}${CHECK} Dependencies updated${NC}"
    echo ""
fi

if echo "$CHANGED_FILES" | grep -q "requirements.txt\|Pipfile"; then
    echo -e "${YELLOW}Python dependencies changed.${NC}"
    if [ -f "requirements.txt" ]; then
        pip install -r requirements.txt
    fi
    if [ -f "Pipfile" ]; then
        pipenv install
    fi
    echo -e "${GREEN}${CHECK} Python dependencies updated${NC}"
    echo ""
fi

# Run migrations if present
if echo "$CHANGED_FILES" | grep -q "migrations/"; then
    echo -e "${YELLOW}Migrations changed. You may need to run migrations.${NC}"
    echo ""
fi

echo -e "${GREEN}${CHECK} Post-merge tasks complete${NC}"
echo ""
