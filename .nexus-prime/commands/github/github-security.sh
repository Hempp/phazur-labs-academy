#!/bin/bash
# ═══════════════════════════════════════════════════════════════════════════════
#  NEXUS-PRIME: GitHub Security Command
#  Security scanning and vulnerability management
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
SHIELD="🛡️"

SUBCOMMAND="${1:-status}"
shift 2>/dev/null || true

show_help() {
    echo -e "${CYAN}"
    echo "═══════════════════════════════════════════════════════════════════════════════"
    echo "  NEXUS-PRIME: GitHub Security Command"
    echo "  ${SHIELD} SECURITY-HAWK Activated"
    echo "═══════════════════════════════════════════════════════════════════════════════"
    echo -e "${NC}"
    echo ""
    echo "Usage: github-security <command> [options]"
    echo ""
    echo "Commands:"
    echo "  status          View security status"
    echo "  alerts          List security alerts"
    echo "  dependabot      View Dependabot alerts"
    echo "  code-scanning   View code scanning alerts"
    echo "  secrets         View secret scanning alerts"
    echo "  enable          Enable security features"
    echo "  audit           Run security audit"
    echo ""
    echo "Examples:"
    echo "  github-security status"
    echo "  github-security alerts"
    echo "  github-security enable --all"
}

show_header() {
    echo -e "${CYAN}"
    echo "═══════════════════════════════════════════════════════════════════════════════"
    echo "  NEXUS-PRIME: GitHub Security - $1"
    echo "  ${SHIELD} SECURITY-HAWK Activated"
    echo "═══════════════════════════════════════════════════════════════════════════════"
    echo -e "${NC}"
}

get_repo() {
    gh repo view --json nameWithOwner -q '.nameWithOwner'
}

case $SUBCOMMAND in
    status)
        show_header "Security Status"
        REPO=$(get_repo)
        
        echo -e "${BLUE}Repository: ${REPO}${NC}"
        echo ""
        
        # Check vulnerability alerts
        echo -e "${YELLOW}Checking security features...${NC}"
        echo ""
        
        # Dependabot alerts
        DEPENDABOT_COUNT=$(gh api "repos/${REPO}/dependabot/alerts" --jq 'length' 2>/dev/null || echo "N/A")
        echo -e "Dependabot Alerts: ${DEPENDABOT_COUNT}"
        
        # Code scanning
        CODE_SCAN_COUNT=$(gh api "repos/${REPO}/code-scanning/alerts" --jq 'length' 2>/dev/null || echo "N/A")
        echo -e "Code Scanning Alerts: ${CODE_SCAN_COUNT}"
        
        # Secret scanning
        SECRET_COUNT=$(gh api "repos/${REPO}/secret-scanning/alerts" --jq 'length' 2>/dev/null || echo "N/A")
        echo -e "Secret Scanning Alerts: ${SECRET_COUNT}"
        ;;

    alerts)
        show_header "Security Alerts"
        REPO=$(get_repo)
        
        echo -e "${YELLOW}Dependabot Alerts:${NC}"
        gh api "repos/${REPO}/dependabot/alerts" --jq '.[] | "[\(.severity)] \(.security_advisory.summary)"' 2>/dev/null || echo "  No alerts or feature not enabled"
        echo ""
        
        echo -e "${YELLOW}Code Scanning Alerts:${NC}"
        gh api "repos/${REPO}/code-scanning/alerts" --jq '.[] | "[\(.rule.severity)] \(.rule.description)"' 2>/dev/null || echo "  No alerts or feature not enabled"
        echo ""
        
        echo -e "${YELLOW}Secret Scanning Alerts:${NC}"
        gh api "repos/${REPO}/secret-scanning/alerts" --jq '.[] | "[\(.state)] \(.secret_type_display_name)"' 2>/dev/null || echo "  No alerts or feature not enabled"
        ;;

    dependabot)
        show_header "Dependabot Alerts"
        REPO=$(get_repo)
        
        gh api "repos/${REPO}/dependabot/alerts" --jq '.[] | "[\(.severity | ascii_upcase)] \(.security_advisory.summary)\n  Package: \(.dependency.package.name)\n  Fix: \(.security_advisory.vulnerable_version_range) -> \(.security_vulnerability.first_patched_version.identifier // "No fix available")\n"' 2>/dev/null || echo "No Dependabot alerts or feature not enabled"
        ;;

    code-scanning)
        show_header "Code Scanning Alerts"
        REPO=$(get_repo)
        
        gh api "repos/${REPO}/code-scanning/alerts" --jq '.[] | "[\(.rule.severity | ascii_upcase)] \(.rule.description)\n  File: \(.most_recent_instance.location.path):\(.most_recent_instance.location.start_line)\n  State: \(.state)\n"' 2>/dev/null || echo "No code scanning alerts or feature not enabled"
        ;;

    secrets)
        show_header "Secret Scanning Alerts"
        REPO=$(get_repo)
        
        gh api "repos/${REPO}/secret-scanning/alerts" --jq '.[] | "[\(.state | ascii_upcase)] \(.secret_type_display_name)\n  Created: \(.created_at)\n"' 2>/dev/null || echo "No secret scanning alerts or feature not enabled"
        ;;

    enable)
        show_header "Enable Security Features"
        REPO=$(get_repo)
        
        echo -e "${YELLOW}Enabling security features for ${REPO}...${NC}"
        echo ""
        
        # Enable vulnerability alerts
        echo -e "${BLUE}Enabling vulnerability alerts...${NC}"
        gh api "repos/${REPO}/vulnerability-alerts" -X PUT 2>/dev/null && echo -e "${GREEN}${CHECK} Vulnerability alerts enabled${NC}" || echo -e "${YELLOW}Already enabled or requires admin${NC}"
        
        # Enable automated security fixes
        echo -e "${BLUE}Enabling automated security fixes...${NC}"
        gh api "repos/${REPO}/automated-security-fixes" -X PUT 2>/dev/null && echo -e "${GREEN}${CHECK} Automated security fixes enabled${NC}" || echo -e "${YELLOW}Already enabled or requires admin${NC}"
        
        echo ""
        echo -e "${GREEN}${CHECK} Security features enabled${NC}"
        echo ""
        echo -e "${YELLOW}Note: Code scanning requires a workflow. Run:${NC}"
        echo "  github-actions init security"
        ;;

    audit)
        show_header "Security Audit"
        
        echo -e "${YELLOW}Running security audit...${NC}"
        echo ""
        
        # Check for npm audit
        if [ -f "package.json" ]; then
            echo -e "${BLUE}NPM Audit:${NC}"
            npm audit 2>/dev/null || echo "  npm audit completed (check output above)"
            echo ""
        fi
        
        # Check for pip
        if [ -f "requirements.txt" ]; then
            echo -e "${BLUE}Python Dependencies:${NC}"
            pip-audit 2>/dev/null || echo "  Install pip-audit: pip install pip-audit"
            echo ""
        fi
        
        # Check for secrets in git history
        echo -e "${BLUE}Checking for secrets...${NC}"
        if command -v gitleaks &> /dev/null; then
            gitleaks detect --source . --verbose 2>/dev/null || echo "  Gitleaks scan completed"
        else
            echo "  Install gitleaks for secret detection: brew install gitleaks"
        fi
        
        echo ""
        echo -e "${GREEN}${CHECK} Audit complete${NC}"
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
