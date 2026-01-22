#!/bin/bash
# Supabase Pre-Migration Hook
# NEXUS-PRIME v3.0
# Runs before database migrations

set -e

echo "🔄 Running pre-migration checks..."

# Configuration
BACKUP_DIR="${SUPABASE_BACKUP_DIR:-./backups}"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
PROJECT_REF="${SUPABASE_PROJECT_REF:-}"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Functions
log_info() {
    echo -e "${GREEN}✓${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}⚠${NC} $1"
}

log_error() {
    echo -e "${RED}✗${NC} $1"
}

# 1. Check if supabase CLI is available
if ! command -v supabase &> /dev/null; then
    log_error "Supabase CLI not found. Please install it first."
    exit 1
fi
log_info "Supabase CLI found"

# 2. Check if project is linked
if [ ! -f "./supabase/.temp/project-ref" ]; then
    log_warn "Project not linked. Running local migrations only."
else
    PROJECT_REF=$(cat ./supabase/.temp/project-ref)
    log_info "Project linked: $PROJECT_REF"
fi

# 3. Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"
log_info "Backup directory ready: $BACKUP_DIR"

# 4. Backup current schema (if remote)
if [ -n "$PROJECT_REF" ] && [ -n "$SUPABASE_ACCESS_TOKEN" ]; then
    echo "📦 Backing up current schema..."
    BACKUP_FILE="$BACKUP_DIR/schema_${TIMESTAMP}.sql"

    if supabase db dump -f "$BACKUP_FILE" 2>/dev/null; then
        log_info "Schema backed up to: $BACKUP_FILE"
    else
        log_warn "Could not backup remote schema (may not have access)"
    fi
fi

# 5. Lint migrations
echo "🔍 Linting migrations..."
if command -v sqlfluff &> /dev/null; then
    # Use sqlfluff if available
    LINT_ERRORS=$(sqlfluff lint ./supabase/migrations/*.sql 2>/dev/null || true)
    if [ -n "$LINT_ERRORS" ]; then
        log_warn "SQL lint warnings found (non-blocking):"
        echo "$LINT_ERRORS"
    else
        log_info "SQL lint passed"
    fi
else
    log_info "SQL linting skipped (sqlfluff not installed)"
fi

# 6. Check for dangerous operations
echo "⚠️  Checking for dangerous operations..."
DANGEROUS_PATTERNS=(
    "DROP TABLE"
    "DROP SCHEMA"
    "TRUNCATE"
    "DELETE FROM.*WHERE.*="
    "ALTER TABLE.*DROP COLUMN"
)

MIGRATIONS_DIR="./supabase/migrations"
if [ -d "$MIGRATIONS_DIR" ]; then
    for pattern in "${DANGEROUS_PATTERNS[@]}"; do
        MATCHES=$(grep -rni "$pattern" "$MIGRATIONS_DIR"/*.sql 2>/dev/null || true)
        if [ -n "$MATCHES" ]; then
            log_warn "Dangerous operation found: $pattern"
            echo "$MATCHES"
        fi
    done
fi
log_info "Dangerous operation check complete"

# 7. Verify migration file naming
echo "📝 Verifying migration naming conventions..."
INVALID_NAMES=""
for file in ./supabase/migrations/*.sql; do
    if [ -f "$file" ]; then
        BASENAME=$(basename "$file")
        # Check for timestamp prefix (YYYYMMDDHHMMSS_)
        if ! [[ "$BASENAME" =~ ^[0-9]{14}_ ]]; then
            INVALID_NAMES="$INVALID_NAMES\n  - $BASENAME"
        fi
    fi
done

if [ -n "$INVALID_NAMES" ]; then
    log_warn "Non-standard migration names found:$INVALID_NAMES"
else
    log_info "Migration naming conventions OK"
fi

# 8. Check for pending local changes
echo "📊 Checking for uncommitted schema changes..."
if command -v git &> /dev/null && [ -d ".git" ]; then
    UNCOMMITTED=$(git status --porcelain ./supabase/migrations/ 2>/dev/null || true)
    if [ -n "$UNCOMMITTED" ]; then
        log_warn "Uncommitted migration files:"
        echo "$UNCOMMITTED"
    else
        log_info "All migrations committed"
    fi
fi

# 9. Summary
echo ""
echo "═══════════════════════════════════════════════════════════"
echo "Pre-migration checks complete"
echo "═══════════════════════════════════════════════════════════"
echo ""

log_info "Ready to proceed with migration"
exit 0
