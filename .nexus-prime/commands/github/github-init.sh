#!/bin/bash
# ═══════════════════════════════════════════════════════════════════════════════
#  NEXUS-PRIME: GitHub Init Command
#  Initialize GitHub repository with best practices
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
ROCKET="🚀"
GEAR="⚙️"

# Configuration
PRIVATE=false
TEMPLATE=""
ORG=""
LICENSE="MIT"
VISIBILITY="private"

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --private)
            PRIVATE=true
            VISIBILITY="private"
            shift
            ;;
        --public)
            PRIVATE=false
            VISIBILITY="public"
            shift
            ;;
        --template)
            TEMPLATE="$2"
            shift 2
            ;;
        --org)
            ORG="$2"
            shift 2
            ;;
        --license)
            LICENSE="$2"
            shift 2
            ;;
        --help|-h)
            echo "Usage: github-init [name] [options]"
            echo ""
            echo "Options:"
            echo "  --private         Create private repository (default)"
            echo "  --public          Create public repository"
            echo "  --template <repo> Use template repository"
            echo "  --org <name>      Create in organization"
            echo "  --license <type>  License type (MIT, Apache-2.0, GPL-3.0)"
            echo "  --help, -h        Show this help"
            exit 0
            ;;
        *)
            REPO_NAME="$1"
            shift
            ;;
    esac
done

# Header
echo -e "${CYAN}"
echo "═══════════════════════════════════════════════════════════════════════════════"
echo "  NEXUS-PRIME: GitHub Repository Initialization"
echo "  ${ROCKET} REPO-MASTER Activated"
echo "═══════════════════════════════════════════════════════════════════════════════"
echo -e "${NC}"

# Check gh CLI
if ! command -v gh &> /dev/null; then
    echo -e "${RED}${CROSS} GitHub CLI (gh) not found. Install from https://cli.github.com${NC}"
    exit 1
fi

# Check authentication
if ! gh auth status &> /dev/null; then
    echo -e "${RED}${CROSS} Not authenticated with GitHub. Run: gh auth login${NC}"
    exit 1
fi

# Get repo name if not provided
if [ -z "$REPO_NAME" ]; then
    REPO_NAME=$(basename "$(pwd)")
    echo -e "${YELLOW}Using current directory name: ${REPO_NAME}${NC}"
fi

echo -e "${BLUE}Repository: ${REPO_NAME}${NC}"
echo -e "${BLUE}Visibility: ${VISIBILITY}${NC}"
echo ""

# Initialize git if needed
if [ ! -d ".git" ]; then
    echo -e "${GEAR} Initializing git repository..."
    git init
    echo -e "${GREEN}${CHECK} Git initialized${NC}"
fi

# Create .gitignore if not exists
if [ ! -f ".gitignore" ]; then
    echo -e "${GEAR} Creating .gitignore..."
    cat > .gitignore << 'EOF'
# Dependencies
node_modules/
vendor/
.venv/

# Build outputs
dist/
build/
out/
.next/

# Environment
.env
.env.local
.env*.local

# IDE
.idea/
.vscode/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*

# Coverage
coverage/
.nyc_output/
EOF
    echo -e "${GREEN}${CHECK} .gitignore created${NC}"
fi

# Create README if not exists
if [ ! -f "README.md" ]; then
    echo -e "${GEAR} Creating README.md..."
    cat > README.md << EOF
# ${REPO_NAME}

> Project description

## Installation

\`\`\`bash
# Installation instructions
\`\`\`

## Usage

\`\`\`bash
# Usage examples
\`\`\`

## Contributing

Contributions welcome! Please read our [Contributing Guide](CONTRIBUTING.md).

## License

${LICENSE}
EOF
    echo -e "${GREEN}${CHECK} README.md created${NC}"
fi

# Create GitHub directory structure
echo -e "${GEAR} Setting up GitHub configuration..."
mkdir -p .github/workflows
mkdir -p .github/ISSUE_TEMPLATE

# Create CI workflow
cat > .github/workflows/ci.yml << 'EOF'
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Lint
        run: npm run lint --if-present

      - name: Test
        run: npm test --if-present

      - name: Build
        run: npm run build --if-present
EOF
echo -e "${GREEN}${CHECK} CI workflow created${NC}"

# Create dependabot.yml
cat > .github/dependabot.yml << 'EOF'
version: 2
updates:
  - package-ecosystem: npm
    directory: "/"
    schedule:
      interval: weekly
    open-pull-requests-limit: 10

  - package-ecosystem: github-actions
    directory: "/"
    schedule:
      interval: weekly
EOF
echo -e "${GREEN}${CHECK} Dependabot configuration created${NC}"

# Create bug report template
cat > .github/ISSUE_TEMPLATE/bug_report.yml << 'EOF'
name: Bug Report
description: Report a bug
labels: ["bug", "triage"]
body:
  - type: textarea
    attributes:
      label: Describe the bug
      description: A clear description of what the bug is
    validations:
      required: true
  - type: textarea
    attributes:
      label: Steps to reproduce
      description: Steps to reproduce the behavior
    validations:
      required: true
  - type: textarea
    attributes:
      label: Expected behavior
      description: What you expected to happen
    validations:
      required: true
EOF

# Create feature request template
cat > .github/ISSUE_TEMPLATE/feature_request.yml << 'EOF'
name: Feature Request
description: Suggest a new feature
labels: ["enhancement", "triage"]
body:
  - type: textarea
    attributes:
      label: Problem to solve
      description: What problem does this solve?
    validations:
      required: true
  - type: textarea
    attributes:
      label: Proposed solution
      description: Describe your proposed solution
    validations:
      required: true
EOF
echo -e "${GREEN}${CHECK} Issue templates created${NC}"

# Create PR template
cat > .github/pull_request_template.md << 'EOF'
## Description
<!-- Describe your changes -->

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
<!-- How was this tested? -->

## Checklist
- [ ] Tests pass
- [ ] Lint passes
- [ ] Documentation updated
EOF
echo -e "${GREEN}${CHECK} PR template created${NC}"

# Initial commit
git add .
git commit -m "chore: initial repository setup

- Add CI workflow
- Add Dependabot configuration
- Add issue templates
- Add PR template
- Add .gitignore
- Add README.md

Co-Authored-By: NEXUS-PRIME <nexus@prime.ai>" 2>/dev/null || true

# Build gh command
GH_CMD="gh repo create $REPO_NAME --$VISIBILITY --source=. --push"

if [ -n "$ORG" ]; then
    GH_CMD="gh repo create $ORG/$REPO_NAME --$VISIBILITY --source=. --push"
fi

if [ -n "$TEMPLATE" ]; then
    GH_CMD="$GH_CMD --template $TEMPLATE"
fi

# Create repository
echo ""
echo -e "${CYAN}Creating GitHub repository...${NC}"
echo -e "${BLUE}Command: $GH_CMD${NC}"
echo ""

eval $GH_CMD

echo ""
echo -e "${GREEN}"
echo "═══════════════════════════════════════════════════════════════════════════════"
echo "  ${CHECK} Repository created successfully!"
echo "═══════════════════════════════════════════════════════════════════════════════"
echo -e "${NC}"

# Get repo URL
REPO_URL=$(gh repo view --json url -q '.url')
echo -e "${CYAN}URL:${NC} $REPO_URL"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "  1. Configure branch protection: /github-protect main"
echo "  2. Add team members: gh repo edit --add-topic"
echo "  3. Enable security features: /github-security enable"
echo ""
echo -e "${CYAN}─────────────────────────────────────────────────────────────────────────────${NC}"
echo -e "${CYAN}  NEXUS-PRIME: Repository Ready${NC}"
echo -e "${CYAN}─────────────────────────────────────────────────────────────────────────────${NC}"
