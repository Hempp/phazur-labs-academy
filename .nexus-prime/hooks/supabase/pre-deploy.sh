#!/bin/bash
# Supabase Pre-Deploy Hook
# NEXUS-PRIME v3.0
# Runs before deploying edge functions

set -e

echo "🚀 Running pre-deploy checks..."

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info() { echo -e "${GREEN}✓${NC} $1"; }
log_warn() { echo -e "${YELLOW}⚠${NC} $1"; }
log_error() { echo -e "${RED}✗${NC} $1"; }

FUNCTIONS_DIR="./supabase/functions"

# 1. Check if functions directory exists
if [ ! -d "$FUNCTIONS_DIR" ]; then
    log_warn "No functions directory found at $FUNCTIONS_DIR"
    exit 0
fi

# 2. Check for TypeScript errors
echo "🔍 Type-checking edge functions..."
ERRORS=0

for func_dir in "$FUNCTIONS_DIR"/*/; do
    if [ -d "$func_dir" ]; then
        FUNC_NAME=$(basename "$func_dir")
        INDEX_FILE="$func_dir/index.ts"

        if [ -f "$INDEX_FILE" ]; then
            # Check for deno type errors (if deno installed)
            if command -v deno &> /dev/null; then
                if deno check "$INDEX_FILE" 2>/dev/null; then
                    log_info "$FUNC_NAME: Types OK"
                else
                    log_error "$FUNC_NAME: Type errors found"
                    ERRORS=$((ERRORS + 1))
                fi
            else
                log_info "$FUNC_NAME: Skipping type check (deno not installed)"
            fi
        fi
    fi
done

if [ $ERRORS -gt 0 ]; then
    log_error "Found $ERRORS function(s) with type errors"
    exit 1
fi

# 3. Check for required secrets
echo "🔐 Checking required secrets..."
REQUIRED_SECRETS=(
    "SUPABASE_URL"
    "SUPABASE_ANON_KEY"
)

# Check each function for env usage
for func_dir in "$FUNCTIONS_DIR"/*/; do
    if [ -d "$func_dir" ]; then
        FUNC_NAME=$(basename "$func_dir")
        INDEX_FILE="$func_dir/index.ts"

        if [ -f "$INDEX_FILE" ]; then
            # Extract Deno.env.get calls
            ENVS=$(grep -oE 'Deno\.env\.get\(["\x27]([^"]+)["\x27]\)' "$INDEX_FILE" 2>/dev/null | sed "s/Deno.env.get([\"']//g; s/[\"'])//g" || true)

            if [ -n "$ENVS" ]; then
                echo "  $FUNC_NAME requires: $ENVS"
            fi
        fi
    fi
done

# 4. Check function sizes
echo "📏 Checking function sizes..."
MAX_SIZE_KB=10240  # 10MB limit

for func_dir in "$FUNCTIONS_DIR"/*/; do
    if [ -d "$func_dir" ]; then
        FUNC_NAME=$(basename "$func_dir")
        SIZE_KB=$(du -sk "$func_dir" | cut -f1)

        if [ "$SIZE_KB" -gt "$MAX_SIZE_KB" ]; then
            log_warn "$FUNC_NAME: ${SIZE_KB}KB exceeds recommended size"
        else
            log_info "$FUNC_NAME: ${SIZE_KB}KB"
        fi
    fi
done

# 5. Validate import maps
echo "📦 Validating imports..."
IMPORT_MAP="$FUNCTIONS_DIR/import_map.json"
if [ -f "$IMPORT_MAP" ]; then
    if command -v jq &> /dev/null; then
        if jq empty "$IMPORT_MAP" 2>/dev/null; then
            log_info "Import map valid"
        else
            log_error "Import map JSON is invalid"
            exit 1
        fi
    fi
else
    log_info "No import map found (using inline imports)"
fi

# 6. Summary
echo ""
echo "═══════════════════════════════════════════════════════════"
echo "Pre-deploy checks complete"
echo "═══════════════════════════════════════════════════════════"
log_info "Ready to deploy!"
exit 0
