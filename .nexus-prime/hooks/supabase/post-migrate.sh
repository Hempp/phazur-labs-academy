#!/bin/bash
# Supabase Post-Migration Hook
# NEXUS-PRIME v3.0
# Runs after successful database migrations

set -e

echo "🎉 Running post-migration tasks..."

# Configuration
TYPES_OUTPUT="${SUPABASE_TYPES_OUTPUT:-src/types/supabase.ts}"
PROJECT_DIR="${SUPABASE_PROJECT_DIR:-.}"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() {
    echo -e "${GREEN}✓${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}⚠${NC} $1"
}

log_error() {
    echo -e "${RED}✗${NC} $1"
}

log_task() {
    echo -e "${BLUE}→${NC} $1"
}

# 1. Generate TypeScript types
log_task "Generating TypeScript types..."

# Ensure output directory exists
TYPES_DIR=$(dirname "$TYPES_OUTPUT")
mkdir -p "$TYPES_DIR"

if supabase gen types typescript --local > "$TYPES_OUTPUT" 2>/dev/null; then
    log_info "Types generated: $TYPES_OUTPUT"
else
    # Try with linked project
    if supabase gen types typescript > "$TYPES_OUTPUT" 2>/dev/null; then
        log_info "Types generated from remote: $TYPES_OUTPUT"
    else
        log_warn "Could not generate types (run 'supabase start' first)"
    fi
fi

# 2. Audit RLS policies
log_task "Auditing RLS policies..."

# Create audit query
AUDIT_QUERY="
SELECT
    schemaname,
    tablename,
    CASE WHEN rowsecurity THEN '✓' ELSE '✗' END as rls_enabled,
    (SELECT COUNT(*) FROM pg_policies p WHERE p.schemaname = t.schemaname AND p.tablename = t.tablename) as policy_count
FROM pg_tables t
WHERE schemaname = 'public'
ORDER BY tablename;
"

# Run audit if local DB is running
if supabase status &>/dev/null; then
    echo "$AUDIT_QUERY" | supabase db query 2>/dev/null && log_info "RLS audit complete" || log_warn "Could not run RLS audit"
else
    log_warn "Local DB not running, skipping RLS audit"
fi

# 3. Check for tables without RLS
log_task "Checking for unprotected tables..."

UNPROTECTED_QUERY="
SELECT tablename
FROM pg_tables
WHERE schemaname = 'public'
AND rowsecurity = false
AND tablename NOT LIKE 'pg_%'
AND tablename NOT LIKE '_%;'
"

# 4. Update migration log
log_task "Updating migration log..."
MIGRATION_LOG="./supabase/.migrations.log"
echo "[$(date -Iseconds)] Migration completed successfully" >> "$MIGRATION_LOG"
log_info "Migration logged"

# 5. Run any custom post-migration scripts
if [ -d "./supabase/hooks/post-migrate.d" ]; then
    log_task "Running custom post-migration scripts..."
    for script in ./supabase/hooks/post-migrate.d/*.sh; do
        if [ -f "$script" ] && [ -x "$script" ]; then
            echo "  Running: $(basename $script)"
            "$script"
        fi
    done
fi

# 6. Notify about type changes (if git available)
if command -v git &> /dev/null && [ -d ".git" ]; then
    TYPE_CHANGES=$(git diff --stat "$TYPES_OUTPUT" 2>/dev/null || true)
    if [ -n "$TYPE_CHANGES" ]; then
        log_info "Type file changes detected:"
        echo "$TYPE_CHANGES"
    fi
fi

# 7. Summary
echo ""
echo "═══════════════════════════════════════════════════════════"
echo "Post-migration tasks complete"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "Next steps:"
echo "  • Review generated types in $TYPES_OUTPUT"
echo "  • Test your application with the new schema"
echo "  • Commit migration files to version control"
echo ""

log_info "Migration workflow complete!"
exit 0
