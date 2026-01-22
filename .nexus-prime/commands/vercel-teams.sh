#!/bin/bash
# ═══════════════════════════════════════════════════════════════════════════════
#  NEXUS-PRIME: Vercel Teams Command
#  Manage teams and projects
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
TEAM="👥"

# Header
print_header() {
    echo -e "${CYAN}"
    echo "═══════════════════════════════════════════════════════════════════════════════"
    echo "  NEXUS-PRIME: Vercel Teams Manager"
    echo "  ${TEAM} Team Management"
    echo "═══════════════════════════════════════════════════════════════════════════════"
    echo -e "${NC}"
}

# Help
print_help() {
    echo "Usage: vercel-teams <command> [options]"
    echo ""
    echo "Commands:"
    echo "  ls                      List all teams"
    echo "  switch <name>           Switch to a team"
    echo "  invite <email>          Invite member to team"
    echo "  whoami                  Show current user/team"
    echo ""
    echo "Options:"
    echo "  --help, -h              Show this help"
}

# Main
print_header

COMMAND="$1"
shift || true

case "$COMMAND" in
    ls|list)
        echo -e "${BLUE}${TEAM} Your Teams${NC}"
        echo "─────────────────────────────────────────────────────────────────────────────"
        vercel teams ls
        echo "─────────────────────────────────────────────────────────────────────────────"
        ;;
    switch)
        if [ -z "$1" ]; then
            echo -e "${YELLOW}Available teams:${NC}"
            vercel teams ls
            echo ""
            read -p "Enter team name to switch to: " team_name
        else
            team_name="$1"
        fi
        echo -e "${BLUE}Switching to team: $team_name${NC}"
        vercel teams switch "$team_name"
        echo -e "${GREEN}${CHECK} Switched to $team_name${NC}"
        ;;
    invite)
        if [ -z "$1" ]; then
            echo -e "${RED}${CROSS} Email is required${NC}"
            exit 1
        fi
        echo -e "${BLUE}Inviting $1 to team...${NC}"
        vercel teams invite "$1"
        echo -e "${GREEN}${CHECK} Invitation sent${NC}"
        ;;
    whoami)
        echo -e "${BLUE}Current User/Team${NC}"
        echo "─────────────────────────────────────────────────────────────────────────────"
        vercel whoami
        echo "─────────────────────────────────────────────────────────────────────────────"
        ;;
    --help|-h|help|"")
        print_help
        ;;
    *)
        echo -e "${RED}${CROSS} Unknown command: $COMMAND${NC}"
        print_help
        exit 1
        ;;
esac
