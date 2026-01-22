#!/bin/bash
# ═══════════════════════════════════════════════════════════════════════════════
#  NEXUS-PRIME: GitHub PR Command
#  Pull request operations
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
PR="🔀"

# Parse subcommand
SUBCOMMAND="${1:-list}"
shift 2>/dev/null || true

show_help() {
    echo -e "${CYAN}"
    echo "═══════════════════════════════════════════════════════════════════════════════"
    echo "  NEXUS-PRIME: GitHub PR Command"
    echo "  ${PR} PR-SENTINEL Activated"
    echo "═══════════════════════════════════════════════════════════════════════════════"
    echo -e "${NC}"
    echo ""
    echo "Usage: github-pr <command> [options]"
    echo ""
    echo "Commands:"
    echo "  create          Create a new pull request"
    echo "  list            List pull requests"
    echo "  view <n>        View pull request details"
    echo "  merge <n>       Merge pull request"
    echo "  checkout <n>    Checkout pull request locally"
    echo "  review <n>      Review pull request"
    echo "  close <n>       Close pull request"
    echo "  ready <n>       Mark PR as ready for review"
    echo "  draft <n>       Convert PR to draft"
    echo ""
    echo "Examples:"
    echo "  github-pr create --title \"Add feature\" --body \"Description\""
    echo "  github-pr list --state open --author @me"
    echo "  github-pr merge 123 --squash --delete-branch"
    echo "  github-pr review 123 --approve"
}

# Header for commands
show_header() {
    echo -e "${CYAN}"
    echo "═══════════════════════════════════════════════════════════════════════════════"
    echo "  NEXUS-PRIME: GitHub PR - $1"
    echo "  ${PR} PR-SENTINEL Activated"
    echo "═══════════════════════════════════════════════════════════════════════════════"
    echo -e "${NC}"
}

case $SUBCOMMAND in
    create)
        show_header "Create Pull Request"
        echo ""
        
        # Interactive mode if no args
        if [ $# -eq 0 ]; then
            echo -e "${YELLOW}Creating PR interactively...${NC}"
            gh pr create
        else
            gh pr create "$@"
        fi
        
        echo ""
        echo -e "${GREEN}${CHECK} Pull request created${NC}"
        ;;

    list)
        show_header "List Pull Requests"
        echo ""
        
        gh pr list "$@"
        ;;

    view)
        if [ -z "$1" ]; then
            gh pr view
        else
            gh pr view "$@"
        fi
        ;;

    merge)
        show_header "Merge Pull Request"
        PR_NUM="$1"
        shift 2>/dev/null || true
        
        if [ -z "$PR_NUM" ]; then
            echo -e "${RED}${CROSS} PR number required${NC}"
            exit 1
        fi
        
        # Default to squash merge
        MERGE_METHOD="--squash"
        DELETE_BRANCH="--delete-branch"
        
        for arg in "$@"; do
            case $arg in
                --merge) MERGE_METHOD="--merge" ;;
                --rebase) MERGE_METHOD="--rebase" ;;
                --squash) MERGE_METHOD="--squash" ;;
                --no-delete) DELETE_BRANCH="" ;;
            esac
        done
        
        echo -e "${YELLOW}Merging PR #${PR_NUM}...${NC}"
        gh pr merge "$PR_NUM" $MERGE_METHOD $DELETE_BRANCH
        
        echo ""
        echo -e "${GREEN}${CHECK} Pull request merged${NC}"
        ;;

    checkout)
        PR_NUM="$1"
        if [ -z "$PR_NUM" ]; then
            echo -e "${RED}${CROSS} PR number required${NC}"
            exit 1
        fi
        
        echo -e "${YELLOW}Checking out PR #${PR_NUM}...${NC}"
        gh pr checkout "$PR_NUM"
        
        echo -e "${GREEN}${CHECK} Checked out PR #${PR_NUM}${NC}"
        ;;

    review)
        show_header "Review Pull Request"
        PR_NUM="$1"
        shift 2>/dev/null || true
        
        if [ -z "$PR_NUM" ]; then
            echo -e "${RED}${CROSS} PR number required${NC}"
            exit 1
        fi
        
        # Parse review type
        REVIEW_TYPE=""
        for arg in "$@"; do
            case $arg in
                --approve|-a) REVIEW_TYPE="--approve" ;;
                --request-changes|-r) REVIEW_TYPE="--request-changes" ;;
                --comment|-c) REVIEW_TYPE="--comment" ;;
            esac
        done
        
        if [ -z "$REVIEW_TYPE" ]; then
            gh pr review "$PR_NUM"
        else
            gh pr review "$PR_NUM" $REVIEW_TYPE
        fi
        
        echo -e "${GREEN}${CHECK} Review submitted${NC}"
        ;;

    close)
        PR_NUM="$1"
        if [ -z "$PR_NUM" ]; then
            echo -e "${RED}${CROSS} PR number required${NC}"
            exit 1
        fi
        
        gh pr close "$PR_NUM"
        echo -e "${GREEN}${CHECK} PR #${PR_NUM} closed${NC}"
        ;;

    ready)
        PR_NUM="$1"
        if [ -z "$PR_NUM" ]; then
            gh pr ready
        else
            gh pr ready "$PR_NUM"
        fi
        echo -e "${GREEN}${CHECK} PR marked as ready for review${NC}"
        ;;

    draft)
        PR_NUM="$1"
        if [ -z "$PR_NUM" ]; then
            echo -e "${RED}${CROSS} PR number required${NC}"
            exit 1
        fi
        
        gh pr ready "$PR_NUM" --undo
        echo -e "${GREEN}${CHECK} PR converted to draft${NC}"
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
