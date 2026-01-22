#!/bin/bash
# ═══════════════════════════════════════════════════════════════════════════════
#  NEXUS-PRIME: GitHub Actions Command
#  Workflow and CI/CD management
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
BOLT="⚡"

SUBCOMMAND="${1:-list}"
shift 2>/dev/null || true

show_help() {
    echo -e "${CYAN}"
    echo "═══════════════════════════════════════════════════════════════════════════════"
    echo "  NEXUS-PRIME: GitHub Actions Command"
    echo "  ${BOLT} ACTIONS-GURU Activated"
    echo "═══════════════════════════════════════════════════════════════════════════════"
    echo -e "${NC}"
    echo ""
    echo "Usage: github-actions <command> [options]"
    echo ""
    echo "Commands:"
    echo "  list            List workflows"
    echo "  run <workflow>  Trigger workflow"
    echo "  runs            List workflow runs"
    echo "  logs <run-id>   View run logs"
    echo "  watch <run-id>  Watch run progress"
    echo "  cancel <run-id> Cancel workflow run"
    echo "  rerun <run-id>  Re-run workflow"
    echo "  init <type>     Initialize workflow template"
    echo ""
    echo "Workflow templates:"
    echo "  ci              Basic CI pipeline"
    echo "  release         Release workflow"
    echo "  deploy          Deploy to Vercel"
    echo "  security        Security scanning"
    echo ""
    echo "Examples:"
    echo "  github-actions list"
    echo "  github-actions run ci.yml"
    echo "  github-actions logs 12345"
    echo "  github-actions init ci"
}

show_header() {
    echo -e "${CYAN}"
    echo "═══════════════════════════════════════════════════════════════════════════════"
    echo "  NEXUS-PRIME: GitHub Actions - $1"
    echo "  ${BOLT} ACTIONS-GURU Activated"
    echo "═══════════════════════════════════════════════════════════════════════════════"
    echo -e "${NC}"
}

init_workflow() {
    TEMPLATE="$1"
    mkdir -p .github/workflows
    
    case $TEMPLATE in
        ci)
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
        run: npm run lint

      - name: Test
        run: npm test

      - name: Build
        run: npm run build
EOF
            echo -e "${GREEN}${CHECK} Created .github/workflows/ci.yml${NC}"
            ;;

        release)
            cat > .github/workflows/release.yml << 'EOF'
name: Release

on:
  push:
    tags:
      - 'v*'

permissions:
  contents: write

jobs:
  release:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Create Release
        uses: softprops/action-gh-release@v1
        with:
          generate_release_notes: true
          files: |
            dist/*
EOF
            echo -e "${GREEN}${CHECK} Created .github/workflows/release.yml${NC}"
            ;;

        deploy)
            cat > .github/workflows/deploy.yml << 'EOF'
name: Deploy

on:
  push:
    branches: [main]
  workflow_dispatch:

env:
  VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
  VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install Vercel CLI
        run: npm install -g vercel@latest

      - name: Pull Vercel Environment
        run: vercel pull --yes --environment=production --token=${{ secrets.VERCEL_TOKEN }}

      - name: Build
        run: vercel build --prod --token=${{ secrets.VERCEL_TOKEN }}

      - name: Deploy
        run: vercel deploy --prebuilt --prod --token=${{ secrets.VERCEL_TOKEN }}
EOF
            echo -e "${GREEN}${CHECK} Created .github/workflows/deploy.yml${NC}"
            ;;

        security)
            cat > .github/workflows/security.yml << 'EOF'
name: Security

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  schedule:
    - cron: '0 0 * * 0'

permissions:
  security-events: write
  contents: read

jobs:
  codeql:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Initialize CodeQL
        uses: github/codeql-action/init@v3
        with:
          languages: javascript

      - name: Autobuild
        uses: github/codeql-action/autobuild@v3

      - name: Perform CodeQL Analysis
        uses: github/codeql-action/analyze@v3

  dependency-review:
    runs-on: ubuntu-latest
    if: github.event_name == 'pull_request'
    
    steps:
      - uses: actions/checkout@v4
      - uses: actions/dependency-review-action@v3
EOF
            echo -e "${GREEN}${CHECK} Created .github/workflows/security.yml${NC}"
            ;;

        *)
            echo -e "${RED}${CROSS} Unknown template: $TEMPLATE${NC}"
            echo "Available templates: ci, release, deploy, security"
            exit 1
            ;;
    esac
}

case $SUBCOMMAND in
    list)
        show_header "List Workflows"
        gh workflow list "$@"
        ;;

    run)
        WORKFLOW="$1"
        shift 2>/dev/null || true
        
        if [ -z "$WORKFLOW" ]; then
            echo -e "${RED}${CROSS} Workflow name required${NC}"
            exit 1
        fi
        
        show_header "Run Workflow: $WORKFLOW"
        gh workflow run "$WORKFLOW" "$@"
        echo -e "${GREEN}${CHECK} Workflow triggered${NC}"
        ;;

    runs)
        show_header "List Workflow Runs"
        gh run list "$@"
        ;;

    logs)
        RUN_ID="$1"
        if [ -z "$RUN_ID" ]; then
            echo -e "${RED}${CROSS} Run ID required${NC}"
            exit 1
        fi
        
        gh run view "$RUN_ID" --log
        ;;

    watch)
        RUN_ID="$1"
        if [ -z "$RUN_ID" ]; then
            gh run watch
        else
            gh run watch "$RUN_ID"
        fi
        ;;

    cancel)
        RUN_ID="$1"
        if [ -z "$RUN_ID" ]; then
            echo -e "${RED}${CROSS} Run ID required${NC}"
            exit 1
        fi
        
        gh run cancel "$RUN_ID"
        echo -e "${GREEN}${CHECK} Run cancelled${NC}"
        ;;

    rerun)
        RUN_ID="$1"
        if [ -z "$RUN_ID" ]; then
            echo -e "${RED}${CROSS} Run ID required${NC}"
            exit 1
        fi
        
        gh run rerun "$RUN_ID"
        echo -e "${GREEN}${CHECK} Workflow re-triggered${NC}"
        ;;

    init)
        TEMPLATE="$1"
        if [ -z "$TEMPLATE" ]; then
            echo -e "${RED}${CROSS} Template name required${NC}"
            echo "Available: ci, release, deploy, security"
            exit 1
        fi
        
        show_header "Initialize Workflow: $TEMPLATE"
        init_workflow "$TEMPLATE"
        ;;

    help|--help|-h)
        show_help
        ;;

    *)
        echo -e "${RED}Unknown command: $SUBCOMMAND${NC}"
        show_help
        exit 1
        ;;
esac
