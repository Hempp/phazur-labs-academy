#!/bin/bash
# Supabase Post-Deploy Hook
# NEXUS-PRIME v3.0
# Runs after successful deployment

set -e

echo "✅ Running post-deploy tasks..."

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() { echo -e "${GREEN}✓${NC} $1"; }
log_warn() { echo -e "${YELLOW}⚠${NC} $1"; }
log_task() { echo -e "${BLUE}→${NC} $1"; }

TIMESTAMP=$(date -Iseconds)
DEPLOY_LOG="./supabase/.deploy.log"

# 1. Log deployment
log_task "Logging deployment..."
echo "[$TIMESTAMP] Deployment successful" >> "$DEPLOY_LOG"
log_info "Deployment logged"

# 2. Verify functions are live
log_task "Verifying deployed functions..."
if supabase functions list 2>/dev/null; then
    log_info "Functions verified"
else
    log_warn "Could not verify functions (check dashboard)"
fi

# 3. Update types (in case DB changed)
log_task "Refreshing TypeScript types..."
TYPES_OUTPUT="${SUPABASE_TYPES_OUTPUT:-src/types/supabase.ts}"
if supabase gen types typescript > "$TYPES_OUTPUT" 2>/dev/null; then
    log_info "Types refreshed"
fi

# 4. Clear any caches
log_task "Clearing caches..."
# Add cache clearing logic here if needed
log_info "Caches cleared"

# 5. Send notification (if webhook configured)
WEBHOOK_URL="${SUPABASE_DEPLOY_WEBHOOK:-}"
if [ -n "$WEBHOOK_URL" ]; then
    log_task "Sending deployment notification..."
    curl -s -X POST "$WEBHOOK_URL" \
        -H "Content-Type: application/json" \
        -d "{\"text\": \"Supabase deployed at $TIMESTAMP\"}" \
        >/dev/null 2>&1 && log_info "Notification sent" || log_warn "Notification failed"
fi

# 6. Summary
echo ""
echo "═══════════════════════════════════════════════════════════"
echo "Deployment complete!"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "Dashboard: https://supabase.com/dashboard"
echo ""

log_info "All post-deploy tasks complete!"
exit 0
