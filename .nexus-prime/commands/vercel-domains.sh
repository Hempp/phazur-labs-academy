#!/bin/bash
# ═══════════════════════════════════════════════════════════════════════════════
#  NEXUS-PRIME: Vercel Domains Command
#  Manage custom domains with DOMAIN-HANDLER agent
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
GLOBE="🌐"
LOCK="🔒"

# Header
print_header() {
    echo -e "${CYAN}"
    echo "═══════════════════════════════════════════════════════════════════════════════"
    echo "  NEXUS-PRIME: Vercel Domain Manager"
    echo "  ${GLOBE} DOMAIN-HANDLER Activated"
    echo "═══════════════════════════════════════════════════════════════════════════════"
    echo -e "${NC}"
}

# Help
print_help() {
    echo "Usage: vercel-domains <command> [options]"
    echo ""
    echo "Commands:"
    echo "  ls                      List all domains"
    echo "  add <domain>            Add domain to project"
    echo "  rm <domain>             Remove domain"
    echo "  verify <domain>         Verify domain ownership"
    echo "  inspect <domain>        Show DNS configuration"
    echo "  dns-setup <domain>      Show DNS setup instructions"
    echo ""
    echo "Options:"
    echo "  --project <name>        Target project"
    echo "  --help, -h              Show this help"
    echo ""
    echo "Examples:"
    echo "  vercel-domains ls"
    echo "  vercel-domains add example.com"
    echo "  vercel-domains dns-setup example.com"
}

# List domains
domains_list() {
    local project="$1"
    
    echo -e "${BLUE}${GLOBE} Domains${NC}"
    echo "─────────────────────────────────────────────────────────────────────────────"
    
    if [ -n "$project" ]; then
        vercel domains ls "$project"
    else
        vercel domains ls
    fi
    
    echo "─────────────────────────────────────────────────────────────────────────────"
}

# Add domain
domains_add() {
    local domain="$1"
    local project="$2"
    
    if [ -z "$domain" ]; then
        echo -e "${RED}${CROSS} Domain is required${NC}"
        exit 1
    fi
    
    echo -e "${BLUE}${GLOBE} Adding domain: $domain${NC}"
    
    if [ -n "$project" ]; then
        vercel domains add "$domain" "$project"
    else
        vercel domains add "$domain"
    fi
    
    echo ""
    echo -e "${GREEN}${CHECK} Domain added${NC}"
    echo ""
    echo -e "${YELLOW}Next steps:${NC}"
    echo "  1. Configure DNS records (run: vercel-domains dns-setup $domain)"
    echo "  2. Wait for DNS propagation (up to 48 hours)"
    echo "  3. Verify domain (run: vercel-domains verify $domain)"
}

# Remove domain
domains_remove() {
    local domain="$1"
    
    if [ -z "$domain" ]; then
        echo -e "${RED}${CROSS} Domain is required${NC}"
        exit 1
    fi
    
    echo -e "${YELLOW}Removing domain: $domain${NC}"
    vercel domains rm "$domain" --yes
    echo -e "${GREEN}${CHECK} Domain removed${NC}"
}

# Verify domain
domains_verify() {
    local domain="$1"
    
    if [ -z "$domain" ]; then
        echo -e "${RED}${CROSS} Domain is required${NC}"
        exit 1
    fi
    
    echo -e "${BLUE}${GLOBE} Verifying domain: $domain${NC}"
    vercel domains verify "$domain"
}

# Inspect domain
domains_inspect() {
    local domain="$1"
    
    if [ -z "$domain" ]; then
        echo -e "${RED}${CROSS} Domain is required${NC}"
        exit 1
    fi
    
    echo -e "${BLUE}${GLOBE} Inspecting domain: $domain${NC}"
    echo "─────────────────────────────────────────────────────────────────────────────"
    vercel domains inspect "$domain"
    echo "─────────────────────────────────────────────────────────────────────────────"
}

# DNS setup instructions
dns_setup() {
    local domain="$1"
    
    if [ -z "$domain" ]; then
        echo -e "${RED}${CROSS} Domain is required${NC}"
        exit 1
    fi
    
    # Check if apex or subdomain
    if [[ "$domain" =~ ^[^.]+\.[^.]+$ ]]; then
        # Apex domain
        echo -e "${BLUE}${GLOBE} DNS Setup for Apex Domain: $domain${NC}"
        echo "─────────────────────────────────────────────────────────────────────────────"
        echo ""
        echo -e "${YELLOW}Add the following DNS records at your registrar:${NC}"
        echo ""
        echo -e "${CYAN}A Record (Required)${NC}"
        echo "  Type:  A"
        echo "  Name:  @ (or $domain)"
        echo "  Value: 76.76.21.21"
        echo "  TTL:   300 (or lowest available)"
        echo ""
        echo -e "${CYAN}TXT Record (For Verification)${NC}"
        echo "  Type:  TXT"
        echo "  Name:  _vercel"
        echo "  Value: (Get from Vercel dashboard)"
        echo "  TTL:   300"
        echo ""
        echo -e "${CYAN}www Subdomain (Recommended)${NC}"
        echo "  Type:  CNAME"
        echo "  Name:  www"
        echo "  Value: cname.vercel-dns.com"
        echo "  TTL:   300"
    else
        # Subdomain
        echo -e "${BLUE}${GLOBE} DNS Setup for Subdomain: $domain${NC}"
        echo "─────────────────────────────────────────────────────────────────────────────"
        echo ""
        echo -e "${YELLOW}Add the following DNS record at your registrar:${NC}"
        echo ""
        echo -e "${CYAN}CNAME Record${NC}"
        echo "  Type:  CNAME"
        echo "  Name:  ${domain%%.*}"
        echo "  Value: cname.vercel-dns.com"
        echo "  TTL:   300 (or lowest available)"
    fi
    
    echo ""
    echo "─────────────────────────────────────────────────────────────────────────────"
    echo ""
    echo -e "${YELLOW}After DNS propagation:${NC}"
    echo "  • Run: vercel-domains verify $domain"
    echo "  • SSL certificate will be auto-provisioned"
    echo ""
    echo -e "${BLUE}Check DNS propagation:${NC}"
    echo "  • dig $domain +short"
    echo "  • nslookup $domain"
    echo "  • https://dnschecker.org"
}

# Main
print_header

COMMAND="$1"
shift || true

PROJECT=""

# Parse remaining arguments
POSITIONAL=()
while [[ $# -gt 0 ]]; do
    case $1 in
        --project)
            PROJECT="$2"
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
        domains_list "$PROJECT"
        ;;
    add)
        domains_add "${POSITIONAL[0]}" "$PROJECT"
        ;;
    rm|remove)
        domains_remove "${POSITIONAL[0]}"
        ;;
    verify)
        domains_verify "${POSITIONAL[0]}"
        ;;
    inspect)
        domains_inspect "${POSITIONAL[0]}"
        ;;
    dns-setup|dns)
        dns_setup "${POSITIONAL[0]}"
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
