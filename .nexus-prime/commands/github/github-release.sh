#!/bin/bash
# ═══════════════════════════════════════════════════════════════════════════════
#  NEXUS-PRIME: GitHub Release Command
#  Release and version management
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
TAG="🏷️"

SUBCOMMAND="${1:-list}"
shift 2>/dev/null || true

show_help() {
    echo -e "${CYAN}"
    echo "═══════════════════════════════════════════════════════════════════════════════"
    echo "  NEXUS-PRIME: GitHub Release Command"
    echo "  ${TAG} PACKAGE-KEEPER Activated"
    echo "═══════════════════════════════════════════════════════════════════════════════"
    echo -e "${NC}"
    echo ""
    echo "Usage: github-release <command> [options]"
    echo ""
    echo "Commands:"
    echo "  create <tag>    Create a new release"
    echo "  list            List releases"
    echo "  view <tag>      View release details"
    echo "  draft           Create draft release"
    echo "  publish <tag>   Publish draft release"
    echo "  upload <tag>    Upload assets to release"
    echo "  delete <tag>    Delete release"
    echo ""
    echo "Examples:"
    echo "  github-release create v1.0.0 --generate-notes"
    echo "  github-release create v1.0.0 --title \"Version 1.0\""
    echo "  github-release upload v1.0.0 ./dist/app.zip"
}

show_header() {
    echo -e "${CYAN}"
    echo "═══════════════════════════════════════════════════════════════════════════════"
    echo "  NEXUS-PRIME: GitHub Release - $1"
    echo "  ${TAG} PACKAGE-KEEPER Activated"
    echo "═══════════════════════════════════════════════════════════════════════════════"
    echo -e "${NC}"
}

case $SUBCOMMAND in
    create)
        TAG_NAME="$1"
        shift 2>/dev/null || true
        
        if [ -z "$TAG_NAME" ]; then
            echo -e "${RED}${CROSS} Tag name required (e.g., v1.0.0)${NC}"
            exit 1
        fi
        
        show_header "Create Release: $TAG_NAME"
        
        # Default to generate notes
        gh release create "$TAG_NAME" --generate-notes "$@"
        
        echo ""
        echo -e "${GREEN}${CHECK} Release $TAG_NAME created${NC}"
        ;;

    list)
        show_header "List Releases"
        gh release list "$@"
        ;;

    view)
        TAG_NAME="$1"
        if [ -z "$TAG_NAME" ]; then
            echo -e "${RED}${CROSS} Tag name required${NC}"
            exit 1
        fi
        
        gh release view "$TAG_NAME"
        ;;

    draft)
        show_header "Create Draft Release"
        
        # Get next version suggestion
        LATEST=$(gh release list --limit 1 | head -1 | awk '{print $1}')
        echo -e "${BLUE}Latest release: ${LATEST:-none}${NC}"
        
        read -p "Enter tag name (e.g., v1.0.0): " TAG_NAME
        
        gh release create "$TAG_NAME" --draft --generate-notes "$@"
        
        echo ""
        echo -e "${GREEN}${CHECK} Draft release $TAG_NAME created${NC}"
        echo -e "${YELLOW}Run 'github-release publish $TAG_NAME' to publish${NC}"
        ;;

    publish)
        TAG_NAME="$1"
        if [ -z "$TAG_NAME" ]; then
            echo -e "${RED}${CROSS} Tag name required${NC}"
            exit 1
        fi
        
        show_header "Publish Release: $TAG_NAME"
        
        gh release edit "$TAG_NAME" --draft=false
        
        echo -e "${GREEN}${CHECK} Release $TAG_NAME published${NC}"
        ;;

    upload)
        TAG_NAME="$1"
        shift 2>/dev/null || true
        
        if [ -z "$TAG_NAME" ]; then
            echo -e "${RED}${CROSS} Tag name required${NC}"
            exit 1
        fi
        
        if [ $# -eq 0 ]; then
            echo -e "${RED}${CROSS} File(s) to upload required${NC}"
            exit 1
        fi
        
        show_header "Upload Assets to: $TAG_NAME"
        
        gh release upload "$TAG_NAME" "$@"
        
        echo -e "${GREEN}${CHECK} Assets uploaded to $TAG_NAME${NC}"
        ;;

    delete)
        TAG_NAME="$1"
        if [ -z "$TAG_NAME" ]; then
            echo -e "${RED}${CROSS} Tag name required${NC}"
            exit 1
        fi
        
        echo -e "${YELLOW}This will delete release $TAG_NAME${NC}"
        read -p "Are you sure? (y/N): " CONFIRM
        
        if [ "$CONFIRM" = "y" ] || [ "$CONFIRM" = "Y" ]; then
            gh release delete "$TAG_NAME" --yes
            echo -e "${GREEN}${CHECK} Release $TAG_NAME deleted${NC}"
        else
            echo "Cancelled"
        fi
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
