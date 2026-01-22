# Supabase Master Team - Quick Reference

> **NEXUS-PRIME v3.0** | Backend-as-a-Service Swarm

---

## Quick Start

```bash
# Deploy the full Supabase team
/deploy-supabase

# Initialize new project
/supabase-init

# Link to existing project
/supabase-link [project-ref]

# Check status
/supabase-status
```

---

## Team Agents

| Agent | Role | Commands |
|-------|------|----------|
| **SUPA-MASTER** | Lead Architect | `/deploy-supabase`, `/supabase-init` |
| **AUTH-GUARD** | Authentication | `/supabase-auth` |
| **DATA-FORGE** | Database | `/supabase-db`, `/supabase-migrate` |
| **STORE-KEEPER** | Storage | `/supabase-storage` |
| **EDGE-RUNNER** | Edge Functions | `/supabase-functions` |
| **REALTIME-SYNC** | Realtime | `/supabase-realtime` |
| **ROW-GUARD** | RLS Security | `/supabase-rls` |
| **VECTOR-SAGE** | AI/Vectors | `/supabase-vectors` |

---

## Essential Commands

### Database

```bash
# Create migration
/supabase-migrate add_users_table

# Push to remote
/supabase-db push

# Pull remote schema
/supabase-db pull

# Show diff
/supabase-db diff

# Reset local
/supabase-db reset
```

### Authentication

```bash
# Configure providers
/supabase-auth providers

# Set up MFA
/supabase-auth mfa

# Manage users
/supabase-auth users
```

### Storage

```bash
# List buckets
/supabase-storage buckets

# Create bucket
/supabase-storage buckets create avatars --public

# Set policies
/supabase-storage policies
```

### Edge Functions

```bash
# Create function
/supabase-function my-function

# Serve locally
/supabase-functions serve

# Deploy all
/supabase-functions deploy

# Deploy specific
/supabase-functions deploy my-function
```

### Security (RLS)

```bash
# Generate policies
/supabase-rls generate posts user-owned

# Audit tables
/supabase-rls audit

# Test access
/supabase-rls test
```

### Realtime

```bash
# Enable for table
/supabase-realtime enable messages

# Disable
/supabase-realtime disable old_data
```

### AI/Vectors

```bash
# Setup pgvector
/supabase-vectors setup

# Create indexes
/supabase-vectors index

# Test search
/supabase-vectors search
```

### Utilities

```bash
# Generate TypeScript types
/supabase-types

# View logs
/supabase-logs api
/supabase-logs auth
/supabase-logs db

# Manage secrets
/supabase-secrets list
/supabase-secrets set API_KEY=xxx
```

---

## Environment Variables

### Required

```env
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

### Optional

```env
SUPABASE_DB_URL=postgresql://...
SUPABASE_PROJECT_REF=xxx
SUPABASE_ACCESS_TOKEN=xxx
```

---

## Schema Templates

| Template | Use Case |
|----------|----------|
| `user-profiles` | Basic user data with auth |
| `multi-tenant` | SaaS with organizations |
| `blog` | Posts, comments, categories |
| `ecommerce` | Products, orders, customers |
| `chat` | Real-time messaging |

```bash
# Generate schema from template
/supabase-schema --template multi-tenant
```

---

## RLS Policy Patterns

| Pattern | Description |
|---------|-------------|
| `user-owned` | Users access own rows |
| `org-based` | Organization membership |
| `role-based` | Admin/Editor/Viewer |
| `public-read` | Anyone reads, auth writes |

```bash
# Generate for table
/supabase-rls generate posts user-owned
```

---

## Edge Function Templates

| Template | Use Case |
|----------|----------|
| `hello-world` | Basic starter |
| `stripe-webhook` | Payment webhooks |
| `send-email` | Email via Resend |
| `openai-completion` | AI integration |
| `cron-job` | Scheduled tasks |

```bash
# Create from template
/supabase-function payment-handler --template stripe-webhook
```

---

## Common Workflows

### New Project Setup

```bash
/deploy-supabase          # Activate team
/supabase-init            # Initialize
/supabase-link xxx        # Link to project
/supabase-schema          # Design schema
/supabase-rls generate    # Add security
/supabase-types           # Generate types
```

### Add Authentication

```bash
/supabase-auth providers  # Configure OAuth
/supabase-rls generate    # Update policies
/supabase-types           # Refresh types
```

### Add Realtime Feature

```bash
/supabase-realtime enable messages
/supabase-rls audit       # Check security
```

### Deploy Changes

```bash
/supabase-db push --dry-run  # Preview
/supabase-db push            # Apply
/supabase-functions deploy   # Deploy functions
/supabase-types              # Update types
```

---

## File Locations

```
supabase/
├── config.toml          # Project config
├── migrations/          # SQL migrations
├── functions/           # Edge functions
│   └── my-func/
│       └── index.ts
├── seed.sql             # Seed data
└── .env.local           # Local secrets
```

---

## MCP Server

The Supabase MCP server provides tools for:

- Project management (init, link, status)
- Database operations (push, pull, migrate)
- Auth management (users, providers)
- Storage operations (buckets, files)
- Edge functions (create, deploy)
- Type generation

```bash
# Install
cd ~/.nexus-prime/mcp/supabase-server
npm install

# Requires env vars
export SUPABASE_URL=xxx
export SUPABASE_ANON_KEY=xxx
export SUPABASE_SERVICE_ROLE_KEY=xxx
```

---

## Quick Code Snippets

### Initialize Client

```typescript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
```

### Query Data

```typescript
const { data, error } = await supabase
  .from('posts')
  .select('*, author:profiles(name)')
  .eq('published', true)
  .order('created_at', { ascending: false })
```

### Subscribe to Changes

```typescript
supabase
  .channel('posts')
  .on('postgres_changes',
    { event: '*', schema: 'public', table: 'posts' },
    (payload) => console.log(payload)
  )
  .subscribe()
```

### Upload File

```typescript
const { data, error } = await supabase.storage
  .from('avatars')
  .upload(`${userId}/avatar.png`, file)
```

---

## Hooks

| Hook | Trigger |
|------|---------|
| `pre-migrate.sh` | Before migrations |
| `post-migrate.sh` | After migrations |
| `pre-deploy.sh` | Before function deploy |
| `post-deploy.sh` | After function deploy |

Location: `~/.nexus-prime/hooks/supabase/`

---

## Documentation

- [Supabase Docs](https://supabase.com/docs)
- [Supabase CLI Reference](https://supabase.com/docs/reference/cli)
- [JavaScript Client](https://supabase.com/docs/reference/javascript)
- [Edge Functions](https://supabase.com/docs/guides/functions)

---

*"Build in a weekend. Scale to millions."* - **SUPA-SWARM**
