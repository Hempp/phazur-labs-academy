# GitHub Master Team Quick Reference

> NEXUS-PRIME v3.0 | GitHub DevOps & Collaboration Swarm

## Quick Start

```bash
# Activate the full team
/deploy-github

# Initialize new repository with best practices
/github-init --template nextjs --private

# Check repository status
/github-status
```

## Team Agents

| Agent | Role | Trigger |
|-------|------|---------|
| **REPO-MASTER** | Lead Repository Architect | `/github`, `/gh` |
| **ACTIONS-GURU** | CI/CD Pipeline Architect | `/github-actions` |
| **PR-SENTINEL** | Code Review Specialist | `/github-pr` |
| **SECURITY-HAWK** | Security & Compliance | `/github-security` |
| **ISSUE-TRACKER** | Project Management | `/github-issue` |
| **PACKAGE-KEEPER** | Releases & Packages | `/github-release` |
| **PAGES-BUILDER** | Documentation & Pages | `/github-pages` |
| **WEBHOOK-WARDEN** | Integrations & APIs | `/github-webhook` |

## Essential Commands

### Repository Management
```bash
/github-init                    # Initialize repo with best practices
/github-init --org mycompany    # Create in organization
/github-clone owner/repo        # Clone with optimal setup
/github-fork owner/repo         # Fork with upstream tracking
/github-status                  # View repo status
```

### Branch Operations
```bash
/github-branch create feature/new-feature
/github-branch protect main --require-reviews 2
/github-branch sync             # Sync with upstream
/github-branch list
```

### Pull Requests
```bash
/github-pr create               # Create PR interactively
/github-pr list                 # List open PRs
/github-pr review 123 --approve # Approve PR
/github-pr merge 123 --squash   # Squash merge
/github-pr checkout 123         # Checkout PR locally
```

### GitHub Actions
```bash
/github-actions list            # List workflows
/github-actions run ci.yml      # Trigger workflow
/github-actions logs 12345      # View run logs
/github-actions cancel 12345    # Cancel run

# Workflow templates
/github-workflow init ci        # Initialize CI workflow
/github-workflow init release   # Initialize release workflow
/github-workflow validate       # Validate workflow syntax
```

### Issues & Projects
```bash
/github-issue create            # Create issue interactively
/github-issue list --label bug  # Filter by label
/github-issue close 123         # Close issue
/github-issue assign 123 @user  # Assign issue

/github-project create "Sprint 1"
/github-project add 123         # Add issue to project
```

### Security
```bash
/github-security scan           # Run security scan
/github-security alerts         # View security alerts
/github-dependabot enable       # Enable Dependabot
/github-dependabot alerts       # View dependency alerts
/github-secrets set API_KEY     # Set repository secret
/github-secrets list            # List secrets
```

### Releases & Packages
```bash
/github-release create v1.0.0   # Create release
/github-release draft           # Create draft release
/github-release publish         # Publish draft
/github-packages list           # List packages
/github-packages publish        # Publish package
```

### GitHub Pages
```bash
/github-pages enable            # Enable Pages
/github-pages deploy            # Deploy to Pages
/github-pages domain example.com # Configure custom domain
```

## Workflow Templates

### CI Pipeline (.github/workflows/ci.yml)
```yaml
name: CI
on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run lint
      - run: npm test
      - run: npm run build
```

### Release Pipeline (.github/workflows/release.yml)
```yaml
name: Release
on:
  push:
    tags: ['v*']

jobs:
  release:
    runs-on: ubuntu-latest
    permissions:
      contents: write
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci && npm run build
      - uses: softprops/action-gh-release@v1
        with:
          generate_release_notes: true
```

### Security Scan (.github/workflows/security.yml)
```yaml
name: Security
on:
  schedule:
    - cron: '0 0 * * 0'
  pull_request:

jobs:
  codeql:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: github/codeql-action/init@v3
      - uses: github/codeql-action/autobuild@v3
      - uses: github/codeql-action/analyze@v3
```

## Branch Protection Settings

```bash
# Recommended main branch protection
/github-protect main \
  --require-reviews 1 \
  --require-checks build,test,lint \
  --dismiss-stale-reviews \
  --require-codeowner-reviews \
  --no-force-push
```

## Configuration Files

### .github/dependabot.yml
```yaml
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
```

### .github/CODEOWNERS
```
# Default owners
* @org/core-team

# Specific paths
/src/api/ @org/backend-team
/src/components/ @org/frontend-team
/docs/ @org/docs-team
/.github/ @org/devops-team
```

### .github/ISSUE_TEMPLATE/bug_report.yml
```yaml
name: Bug Report
description: Report a bug
labels: [bug, triage]
body:
  - type: textarea
    attributes:
      label: Describe the bug
    validations:
      required: true
  - type: textarea
    attributes:
      label: Steps to reproduce
    validations:
      required: true
  - type: textarea
    attributes:
      label: Expected behavior
```

### .github/pull_request_template.md
```markdown
## Description
<!-- Describe your changes -->

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation

## Testing
<!-- How was this tested? -->

## Checklist
- [ ] Tests pass
- [ ] Lint passes
- [ ] Documentation updated
```

## Git Hooks (Husky)

```bash
# Install husky
npm install -D husky
npx husky init

# Pre-commit hook
echo "npm run lint-staged" > .husky/pre-commit

# Commit message validation
echo "npx commitlint --edit \$1" > .husky/commit-msg
```

## Commit Message Format

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

**Examples:**
```
feat(auth): add OAuth2 login support
fix(api): resolve race condition in data fetching
docs(readme): update installation instructions
```

## MCP Server

```bash
# Configure in Claude settings
{
  "mcpServers": {
    "github": {
      "command": "node",
      "args": ["~/.nexus-prime/mcp/github-server/index.js"],
      "env": {
        "GITHUB_TOKEN": "${GITHUB_TOKEN}"
      }
    }
  }
}
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `GITHUB_TOKEN` | Personal access token |
| `GITHUB_OWNER` | Default repository owner |
| `GITHUB_REPO` | Default repository name |
| `GH_HOST` | GitHub Enterprise host |

## Useful gh CLI Commands

```bash
# Authentication
gh auth login
gh auth status

# Repository
gh repo view
gh repo clone owner/repo
gh repo create name --private

# Pull Requests
gh pr create --title "Title" --body "Body"
gh pr list --state open
gh pr merge 123 --squash --delete-branch

# Issues
gh issue create --title "Bug" --label bug
gh issue list --assignee @me

# Actions
gh workflow list
gh run list --workflow ci.yml
gh run view 12345 --log

# Releases
gh release create v1.0.0 --generate-notes
gh release list
```

## Security Best Practices

1. **Enable branch protection** on main/master
2. **Require PR reviews** before merging
3. **Enable Dependabot** for dependency updates
4. **Use secrets** for sensitive values
5. **Enable secret scanning** to detect leaked credentials
6. **Enable CodeQL** for code scanning
7. **Sign commits** with GPG keys
8. **Use CODEOWNERS** for review requirements

## Team Coordination

```
REPO-MASTER (Lead)
    |
    +-- ACTIONS-GURU (CI/CD)
    |       |
    |       +-- Runs pipelines
    |       +-- Manages workflows
    |
    +-- PR-SENTINEL (Code Review)
    |       |
    |       +-- Reviews PRs
    |       +-- Enforces standards
    |
    +-- SECURITY-HAWK (Security)
    |       |
    |       +-- Security scans
    |       +-- Dependency audit
    |
    +-- ISSUE-TRACKER (Projects)
    |       |
    |       +-- Issue management
    |       +-- Sprint planning
    |
    +-- PACKAGE-KEEPER (Releases)
    |       |
    |       +-- Version management
    |       +-- Publishing
    |
    +-- PAGES-BUILDER (Docs)
    |       |
    |       +-- Documentation
    |       +-- GitHub Pages
    |
    +-- WEBHOOK-WARDEN (Integration)
            |
            +-- APIs & webhooks
            +-- Notifications
```

---

*"Code flows. Teams collaborate. Software ships."*
*— GitHub Master Team*
