# Vercel Deployment Master Team - Quick Reference

> **"Ship faster. Scale infinitely. Deploy fearlessly."**

---

## Quick Start

```bash
# Activate the team
/deploy-vercel

# Or deploy specific agent
/nexus-deploy DEPLOY-MASTER
```

---

## Agents

| Codename | Role | Focus |
|----------|------|-------|
| **DEPLOY-MASTER** | Lead Deployment Architect | Strategy, orchestration, releases |
| **EDGE-OPS** | Edge Function Specialist | Serverless, middleware, caching |
| **DOMAIN-HANDLER** | Domain & DNS Expert | Domains, SSL, DNS |
| **ENV-CONFIG** | Environment Manager | Env vars, secrets, config |
| **PREVIEW-MASTER** | Preview Specialist | PR previews, branching |
| **METRICS-WATCH** | Analytics Monitor | Web Vitals, performance |

---

## Commands

### Deployment
| Command | Description |
|---------|-------------|
| `/deploy-vercel` | Deploy to Vercel |
| `/deploy-vercel --prod` | Deploy to production |
| `/deploy-vercel --preview` | Create preview deployment |
| `/vercel-rollback` | Rollback deployment |
| `/vercel-promote` | Promote preview to production |
| `/vercel-inspect` | Inspect deployment details |

### Teams & Projects
| Command | Description |
|---------|-------------|
| `/vercel-teams ls` | List teams |
| `/vercel-teams switch <name>` | Switch team |
| `/vercel-teams create <name>` | Create team |
| `/vercel-teams invite <email>` | Invite member |
| `/vercel-projects ls` | List projects |
| `/vercel-projects link` | Link current directory |

### Environment
| Command | Description |
|---------|-------------|
| `/vercel-env ls` | List env vars |
| `/vercel-env add <key> <value>` | Add variable |
| `/vercel-env rm <key>` | Remove variable |
| `/vercel-env pull` | Pull to .env.local |
| `/vercel-env push` | Push to Vercel |
| `/vercel-secrets` | Manage secrets |

### Domains
| Command | Description |
|---------|-------------|
| `/vercel-domains ls` | List domains |
| `/vercel-domains add <domain>` | Add domain |
| `/vercel-domains rm <domain>` | Remove domain |
| `/vercel-domains verify <domain>` | Verify domain |
| `/vercel-dns` | Configure DNS |

### Monitoring
| Command | Description |
|---------|-------------|
| `/vercel-logs` | View logs |
| `/vercel-logs --follow` | Stream logs |
| `/vercel-analytics` | View analytics |

### Edge Functions
| Command | Description |
|---------|-------------|
| `/vercel-edge ls` | List edge functions |
| `/vercel-edge test` | Test locally |
| `/vercel-middleware` | Configure middleware |

---

## Hooks

### Pre-Deployment
- `lint-check` - Run linting
- `type-check` - TypeScript validation
- `test-suite` - Run tests
- `security-scan` - Audit dependencies
- `env-validation` - Validate env vars

### Post-Deployment
- `smoke-tests` - Basic functionality tests
- `lighthouse-check` - Performance audit
- `notify-team` - Send notifications
- `warm-cache` - Warm edge caches

### PR Preview
- `preview-comment` - Comment URL on PR
- `visual-diff` - Generate screenshots

---

## Plugins

### Core
- **vercel-cli** - CLI integration
- **vercel-git** - GitHub/GitLab/Bitbucket

### Monitoring
- **vercel-analytics** - Web Vitals
- **vercel-speed-insights** - Performance
- **vercel-logs** - Log drains

### Security
- **vercel-firewall** - WAF & DDoS protection
- **vercel-password-protect** - Password protection

### Storage
- **vercel-postgres** - Serverless PostgreSQL
- **vercel-kv** - Redis-compatible store
- **vercel-blob** - File storage
- **vercel-edge-config** - Ultra-low latency data

### Notifications
- **slack-notify** - Slack webhooks
- **discord-notify** - Discord webhooks
- **email-notify** - Email notifications

---

## Framework Support

| Framework | Features |
|-----------|----------|
| **Next.js** | ISR, SSR, Edge Runtime, App Router |
| **Remix** | SSR, Edge Runtime, Streaming |
| **Astro** | Static, SSR, Islands |
| **SvelteKit** | SSR, Static, Edge |
| **Nuxt** | SSR, Static, Edge |
| **Vite** | Static SPA |

---

## MCP Tools

```yaml
# Available MCP tools
vercel_deploy          # Deploy project
vercel_list_deployments # List deployments
vercel_get_deployment   # Get deployment details
vercel_cancel_deployment # Cancel deployment
vercel_list_projects    # List projects
vercel_list_env_vars    # List env vars
vercel_set_env_var      # Set env var
vercel_list_domains     # List domains
vercel_add_domain       # Add domain
vercel_get_logs         # Get logs
vercel_list_teams       # List teams
vercel_switch_team      # Switch team
```

---

## Environment Types

| Type | Auto-Expose | Use Case |
|------|-------------|----------|
| `production` | Yes | Live site |
| `preview` | Yes | PR previews |
| `development` | No | Local dev |

---

## Workflow

```
Setup -> Development -> Staging -> Production -> Monitoring
  |          |            |            |            |
ENV-CONFIG  PREVIEW    DEPLOY      DEPLOY      METRICS
DOMAIN      EDGE-OPS   METRICS     EDGE-OPS    EDGE-OPS
```

---

## Quick Examples

```bash
# Full deployment workflow
/deploy-vercel --prod

# Manage environments
/vercel-env pull
# Edit .env.local
/vercel-env push

# Add custom domain
/vercel-domains add example.com
/vercel-domains verify example.com

# Monitor deployment
/vercel-logs --follow
/vercel-analytics
```

---

*Vercel Deployment Master Team v1.0.0*
*"Six specialists, one mission—deploy to the edge, serve the world."*
