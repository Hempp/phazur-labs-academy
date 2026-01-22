#!/bin/bash
# ═══════════════════════════════════════════════════════════════════════════════
#  NEXUS-PRIME: Vercel Environment Variables Command
#  Manage environment variables with ENV-CONFIG agent
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
LOCK="🔐"
KEY="🔑"

# Header
print_header() {
    echo -e "${CYAN}"
    echo "═══════════════════════════════════════════════════════════════════════════════"
    echo "  NEXUS-PRIME: Vercel Environment Manager"
    echo "  ${LOCK} ENV-CONFIG Activated"
    echo "═══════════════════════════════════════════════════════════════════════════════"
    echo -e "${NC}"
}

# Help
print_help() {
    echo "Usage: vercel-env <command> [options]"
    echo ""
    echo "Commands:"
    echo "  ls                      List all environment variables"
    echo "  add <key> [value]       Add environment variable"
    echo "  rm <key>                Remove environment variable"
    echo "  pull [file]             Pull env vars to local file"
    echo "  push [file]             Push local env vars to Vercel"
    echo "  validate                Validate required env vars"
    echo ""
    echo "Options:"
    echo "  --env <environment>     Target environment (production/preview/development)"
    echo "  --help, -h              Show this help"
    echo ""
    echo "Examples:"
    echo "  vercel-env ls"
    echo "  vercel-env add API_KEY sk_live_xxx --env production"
    echo "  vercel-env pull .env.local"
    echo "  vercel-env push .env.production --env production"
}

# List environment variables
env_list() {
    local env_target="$1"
    
    echo -e "${BLUE}${KEY} Environment Variables${NC}"
    echo "─────────────────────────────────────────────────────────────────────────────"
    
    if [ -n "$env_target" ]; then
        vercel env ls "$env_target"
    else
        vercel env ls
    fi
    
    echo "─────────────────────────────────────────────────────────────────────────────"
}

# Add environment variable
env_add() {
    local key="$1"
    local value="$2"
    local env_target="$3"
    
    if [ -z "$key" ]; then
        echo -e "${RED}${CROSS} Key is required${NC}"
        exit 1
    fi
    
    echo -e "${BLUE}${KEY} Adding environment variable: $key${NC}"
    
    if [ -n "$value" ]; then
        if [ -n "$env_target" ]; then
            echo "$value" | vercel env add "$key" "$env_target"
        else
            echo "$value" | vercel env add "$key"
        fi
    else
        if [ -n "$env_target" ]; then
            vercel env add "$key" "$env_target"
        else
            vercel env add "$key"
        fi
    fi
    
    echo -e "${GREEN}${CHECK} Environment variable added${NC}"
}

# Remove environment variable
env_remove() {
    local key="$1"
    local env_target="$2"
    
    if [ -z "$key" ]; then
        echo -e "${RED}${CROSS} Key is required${NC}"
        exit 1
    fi
    
    echo -e "${YELLOW}Removing environment variable: $key${NC}"
    
    if [ -n "$env_target" ]; then
        vercel env rm "$key" "$env_target" --yes
    else
        vercel env rm "$key" --yes
    fi
    
    echo -e "${GREEN}${CHECK} Environment variable removed${NC}"
}

# Pull environment variables
env_pull() {
    local file="${1:-.env.local}"
    local env_target="$2"
    
    echo -e "${BLUE}${KEY} Pulling environment variables to $file${NC}"
    
    if [ -n "$env_target" ]; then
        vercel env pull "$file" --environment="$env_target"
    else
        vercel env pull "$file"
    fi
    
    echo -e "${GREEN}${CHECK} Environment variables pulled to $file${NC}"
    
    # Add to .gitignore if not present
    if [ -f ".gitignore" ]; then
        if ! grep -q "^$file$" .gitignore; then
            echo "$file" >> .gitignore
            echo -e "${YELLOW}! Added $file to .gitignore${NC}"
        fi
    fi
}

# Push environment variables
env_push() {
    local file="${1:-.env.local}"
    local env_target="${2:-preview}"
    
    if [ ! -f "$file" ]; then
        echo -e "${RED}${CROSS} File not found: $file${NC}"
        exit 1
    fi
    
    echo -e "${BLUE}${KEY} Pushing environment variables from $file${NC}"
    echo "Target environment: $env_target"
    echo ""
    
    # Read file and add each variable
    while IFS='=' read -r key value || [ -n "$key" ]; do
        # Skip comments and empty lines
        [[ "$key" =~ ^#.*$ ]] && continue
        [[ -z "$key" ]] && continue
        
        # Remove quotes from value
        value="${value%\"}"
        value="${value#\"}"
        value="${value%\'}"
        value="${value#\'}"
        
        if [ -n "$key" ] && [ -n "$value" ]; then
            echo -ne "  Adding $key... "
            echo "$value" | vercel env add "$key" "$env_target" --force 2>/dev/null && \
                echo -e "${GREEN}${CHECK}${NC}" || echo -e "${YELLOW}(exists)${NC}"
        fi
    done < "$file"
    
    echo ""
    echo -e "${GREEN}${CHECK} Environment variables pushed${NC}"
}

# Validate environment variables
env_validate() {
    echo -e "${BLUE}${KEY} Validating environment variables${NC}"
    echo "─────────────────────────────────────────────────────────────────────────────"
    
    # Required variables (customize this list)
    REQUIRED_VARS=(
        "DATABASE_URL"
        "NEXTAUTH_SECRET"
    )
    
    MISSING=()
    
    # Check each required variable
    for var in "${REQUIRED_VARS[@]}"; do
        if vercel env ls 2>/dev/null | grep -q "^$var"; then
            echo -e "  ${GREEN}${CHECK}${NC} $var"
        else
            echo -e "  ${RED}${CROSS}${NC} $var (missing)"
            MISSING+=("$var")
        fi
    done
    
    echo "─────────────────────────────────────────────────────────────────────────────"
    
    if [ ${#MISSING[@]} -gt 0 ]; then
        echo -e "${RED}${CROSS} Missing ${#MISSING[@]} required variable(s)${NC}"
        exit 1
    else
        echo -e "${GREEN}${CHECK} All required variables present${NC}"
    fi
}

# Main
print_header

COMMAND="$1"
shift || true

ENV_TARGET=""

# Parse remaining arguments
POSITIONAL=()
while [[ $# -gt 0 ]]; do
    case $1 in
        --env)
            ENV_TARGET="$2"
            shift 2
            ;;
        --help|-h)
            print_help
            exit 0
            ;;
        *)
            POSITIONAL+=("$1")
            shift
            ;;
    esac
done

case "$COMMAND" in
    ls|list)
        env_list "$ENV_TARGET"
        ;;
    add)
        env_add "${POSITIONAL[0]}" "${POSITIONAL[1]}" "$ENV_TARGET"
        ;;
    rm|remove)
        env_remove "${POSITIONAL[0]}" "$ENV_TARGET"
        ;;
    pull)
        env_pull "${POSITIONAL[0]}" "$ENV_TARGET"
        ;;
    push)
        env_push "${POSITIONAL[0]}" "$ENV_TARGET"
        ;;
    validate)
        env_validate
        ;;
    --help|-h|help|"")
        print_help
        ;;
    *)
        echo -e "${RED}${CROSS} Unknown command: $COMMAND${NC}"
        echo ""
        print_help
        exit 1
        ;;
esac
