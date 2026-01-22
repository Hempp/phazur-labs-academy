#!/usr/bin/env node
/**
 * Supabase MCP Server - NEXUS-PRIME Integration
 * Provides tools for Supabase operations via Model Context Protocol
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { createClient } from "@supabase/supabase-js";
import { execSync, spawn } from "child_process";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";

// ═══════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SUPABASE_ACCESS_TOKEN = process.env.SUPABASE_ACCESS_TOKEN;
const SUPABASE_PROJECT_REF = process.env.SUPABASE_PROJECT_REF;

// Initialize Supabase clients
let supabaseClient = null;
let supabaseAdmin = null;

if (SUPABASE_URL && SUPABASE_ANON_KEY) {
  supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
  supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

// ═══════════════════════════════════════════════════════════════
// TOOL DEFINITIONS
// ═══════════════════════════════════════════════════════════════

const TOOLS = [
  // Project Management
  {
    name: "supabase_init",
    description: "Initialize a new Supabase project in the current directory",
    inputSchema: {
      type: "object",
      properties: {
        workdir: {
          type: "string",
          description: "Working directory (default: current)",
        },
      },
    },
  },
  {
    name: "supabase_link",
    description: "Link to an existing Supabase project",
    inputSchema: {
      type: "object",
      properties: {
        project_ref: {
          type: "string",
          description: "Project reference ID",
        },
        password: {
          type: "string",
          description: "Database password (optional)",
        },
      },
      required: ["project_ref"],
    },
  },
  {
    name: "supabase_status",
    description: "Get status of local Supabase services",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },

  // Database Operations
  {
    name: "supabase_db_push",
    description: "Push local migrations to remote database",
    inputSchema: {
      type: "object",
      properties: {
        dry_run: {
          type: "boolean",
          description: "Preview changes without applying",
        },
      },
    },
  },
  {
    name: "supabase_db_pull",
    description: "Pull remote database schema to local",
    inputSchema: {
      type: "object",
      properties: {
        schema: {
          type: "string",
          description: "Schema to pull (default: public)",
        },
      },
    },
  },
  {
    name: "supabase_db_reset",
    description: "Reset local database to clean state",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "supabase_db_diff",
    description: "Show differences between local and remote schema",
    inputSchema: {
      type: "object",
      properties: {
        schema: {
          type: "string",
          description: "Schema to compare (default: public)",
        },
      },
    },
  },
  {
    name: "supabase_migrate_new",
    description: "Create a new migration file",
    inputSchema: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "Migration name",
        },
      },
      required: ["name"],
    },
  },
  {
    name: "supabase_migrate_list",
    description: "List all migrations",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "supabase_query",
    description: "Execute a SQL query against the database",
    inputSchema: {
      type: "object",
      properties: {
        sql: {
          type: "string",
          description: "SQL query to execute",
        },
      },
      required: ["sql"],
    },
  },

  // Auth Operations
  {
    name: "supabase_auth_list_users",
    description: "List all users",
    inputSchema: {
      type: "object",
      properties: {
        page: { type: "number", description: "Page number" },
        per_page: { type: "number", description: "Users per page" },
      },
    },
  },
  {
    name: "supabase_auth_create_user",
    description: "Create a new user",
    inputSchema: {
      type: "object",
      properties: {
        email: { type: "string", description: "User email" },
        password: { type: "string", description: "User password" },
        email_confirm: {
          type: "boolean",
          description: "Auto-confirm email",
        },
        user_metadata: {
          type: "object",
          description: "User metadata",
        },
      },
      required: ["email", "password"],
    },
  },
  {
    name: "supabase_auth_delete_user",
    description: "Delete a user by ID",
    inputSchema: {
      type: "object",
      properties: {
        user_id: { type: "string", description: "User ID to delete" },
      },
      required: ["user_id"],
    },
  },

  // Storage Operations
  {
    name: "supabase_storage_list_buckets",
    description: "List all storage buckets",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "supabase_storage_create_bucket",
    description: "Create a new storage bucket",
    inputSchema: {
      type: "object",
      properties: {
        name: { type: "string", description: "Bucket name" },
        public: { type: "boolean", description: "Is bucket public" },
        file_size_limit: {
          type: "number",
          description: "Max file size in bytes",
        },
        allowed_mime_types: {
          type: "array",
          items: { type: "string" },
          description: "Allowed MIME types",
        },
      },
      required: ["name"],
    },
  },
  {
    name: "supabase_storage_list_files",
    description: "List files in a bucket",
    inputSchema: {
      type: "object",
      properties: {
        bucket: { type: "string", description: "Bucket name" },
        path: { type: "string", description: "Path prefix" },
        limit: { type: "number", description: "Max files to return" },
      },
      required: ["bucket"],
    },
  },

  // Edge Functions
  {
    name: "supabase_functions_list",
    description: "List all edge functions",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "supabase_functions_new",
    description: "Create a new edge function",
    inputSchema: {
      type: "object",
      properties: {
        name: { type: "string", description: "Function name" },
        template: {
          type: "string",
          enum: ["hello-world", "stripe", "openai", "resend", "cron"],
          description: "Function template",
        },
      },
      required: ["name"],
    },
  },
  {
    name: "supabase_functions_deploy",
    description: "Deploy edge functions",
    inputSchema: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "Function name (all if not specified)",
        },
        no_verify_jwt: {
          type: "boolean",
          description: "Disable JWT verification",
        },
      },
    },
  },
  {
    name: "supabase_functions_serve",
    description: "Start local function development server",
    inputSchema: {
      type: "object",
      properties: {
        env_file: { type: "string", description: "Path to .env file" },
      },
    },
  },

  // Types Generation
  {
    name: "supabase_gen_types",
    description: "Generate TypeScript types from database schema",
    inputSchema: {
      type: "object",
      properties: {
        output: {
          type: "string",
          description: "Output file path",
        },
        schema: {
          type: "string",
          description: "Schema to generate types for",
        },
      },
    },
  },

  // RLS Operations
  {
    name: "supabase_rls_generate",
    description: "Generate RLS policies for a table",
    inputSchema: {
      type: "object",
      properties: {
        table: { type: "string", description: "Table name" },
        policy_type: {
          type: "string",
          enum: ["user-owned", "org-based", "role-based", "public-read"],
          description: "Policy template type",
        },
      },
      required: ["table", "policy_type"],
    },
  },
  {
    name: "supabase_rls_audit",
    description: "Audit RLS policies for security issues",
    inputSchema: {
      type: "object",
      properties: {
        schema: { type: "string", description: "Schema to audit" },
      },
    },
  },

  // Realtime
  {
    name: "supabase_realtime_enable",
    description: "Enable realtime for a table",
    inputSchema: {
      type: "object",
      properties: {
        table: { type: "string", description: "Table name" },
        schema: { type: "string", description: "Schema (default: public)" },
      },
      required: ["table"],
    },
  },

  // Secrets Management
  {
    name: "supabase_secrets_list",
    description: "List all secrets",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "supabase_secrets_set",
    description: "Set a secret",
    inputSchema: {
      type: "object",
      properties: {
        name: { type: "string", description: "Secret name" },
        value: { type: "string", description: "Secret value" },
      },
      required: ["name", "value"],
    },
  },
  {
    name: "supabase_secrets_unset",
    description: "Remove a secret",
    inputSchema: {
      type: "object",
      properties: {
        name: { type: "string", description: "Secret name to remove" },
      },
      required: ["name"],
    },
  },

  // Logs
  {
    name: "supabase_logs",
    description: "View project logs",
    inputSchema: {
      type: "object",
      properties: {
        service: {
          type: "string",
          enum: ["api", "auth", "db", "storage", "realtime", "functions"],
          description: "Service to view logs for",
        },
        follow: { type: "boolean", description: "Follow log output" },
      },
    },
  },

  // Schema Generation
  {
    name: "supabase_generate_schema",
    description: "Generate database schema from natural language description",
    inputSchema: {
      type: "object",
      properties: {
        description: {
          type: "string",
          description: "Natural language description of the schema",
        },
        template: {
          type: "string",
          enum: [
            "user-profiles",
            "multi-tenant",
            "blog",
            "ecommerce",
            "chat",
          ],
          description: "Optional schema template to start from",
        },
      },
      required: ["description"],
    },
  },
];

// ═══════════════════════════════════════════════════════════════
// TOOL IMPLEMENTATIONS
// ═══════════════════════════════════════════════════════════════

async function runSupabaseCLI(args, options = {}) {
  try {
    const command = `supabase ${args.join(" ")}`;
    const result = execSync(command, {
      encoding: "utf-8",
      maxBuffer: 10 * 1024 * 1024,
      ...options,
    });
    return { success: true, output: result };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      stderr: error.stderr?.toString(),
    };
  }
}

async function handleToolCall(name, args) {
  switch (name) {
    // Project Management
    case "supabase_init": {
      return await runSupabaseCLI(["init"], { cwd: args.workdir || process.cwd() });
    }

    case "supabase_link": {
      const linkArgs = ["link", "--project-ref", args.project_ref];
      if (args.password) linkArgs.push("--password", args.password);
      return await runSupabaseCLI(linkArgs);
    }

    case "supabase_status": {
      return await runSupabaseCLI(["status"]);
    }

    // Database Operations
    case "supabase_db_push": {
      const pushArgs = ["db", "push"];
      if (args.dry_run) pushArgs.push("--dry-run");
      return await runSupabaseCLI(pushArgs);
    }

    case "supabase_db_pull": {
      const pullArgs = ["db", "pull"];
      if (args.schema) pullArgs.push("--schema", args.schema);
      return await runSupabaseCLI(pullArgs);
    }

    case "supabase_db_reset": {
      return await runSupabaseCLI(["db", "reset"]);
    }

    case "supabase_db_diff": {
      const diffArgs = ["db", "diff"];
      if (args.schema) diffArgs.push("--schema", args.schema);
      return await runSupabaseCLI(diffArgs);
    }

    case "supabase_migrate_new": {
      return await runSupabaseCLI(["migration", "new", args.name]);
    }

    case "supabase_migrate_list": {
      return await runSupabaseCLI(["migration", "list"]);
    }

    case "supabase_query": {
      if (!supabaseAdmin) {
        return { success: false, error: "Supabase admin client not configured" };
      }
      const { data, error } = await supabaseAdmin.rpc("exec_sql", { sql: args.sql });
      if (error) return { success: false, error: error.message };
      return { success: true, data };
    }

    // Auth Operations
    case "supabase_auth_list_users": {
      if (!supabaseAdmin) {
        return { success: false, error: "Supabase admin client not configured" };
      }
      const { data, error } = await supabaseAdmin.auth.admin.listUsers({
        page: args.page || 1,
        perPage: args.per_page || 50,
      });
      if (error) return { success: false, error: error.message };
      return { success: true, users: data.users, total: data.total };
    }

    case "supabase_auth_create_user": {
      if (!supabaseAdmin) {
        return { success: false, error: "Supabase admin client not configured" };
      }
      const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email: args.email,
        password: args.password,
        email_confirm: args.email_confirm || false,
        user_metadata: args.user_metadata || {},
      });
      if (error) return { success: false, error: error.message };
      return { success: true, user: data.user };
    }

    case "supabase_auth_delete_user": {
      if (!supabaseAdmin) {
        return { success: false, error: "Supabase admin client not configured" };
      }
      const { error } = await supabaseAdmin.auth.admin.deleteUser(args.user_id);
      if (error) return { success: false, error: error.message };
      return { success: true, message: "User deleted" };
    }

    // Storage Operations
    case "supabase_storage_list_buckets": {
      if (!supabaseAdmin) {
        return { success: false, error: "Supabase admin client not configured" };
      }
      const { data, error } = await supabaseAdmin.storage.listBuckets();
      if (error) return { success: false, error: error.message };
      return { success: true, buckets: data };
    }

    case "supabase_storage_create_bucket": {
      if (!supabaseAdmin) {
        return { success: false, error: "Supabase admin client not configured" };
      }
      const { data, error } = await supabaseAdmin.storage.createBucket(args.name, {
        public: args.public || false,
        fileSizeLimit: args.file_size_limit,
        allowedMimeTypes: args.allowed_mime_types,
      });
      if (error) return { success: false, error: error.message };
      return { success: true, bucket: data };
    }

    case "supabase_storage_list_files": {
      if (!supabaseAdmin) {
        return { success: false, error: "Supabase admin client not configured" };
      }
      const { data, error } = await supabaseAdmin.storage
        .from(args.bucket)
        .list(args.path || "", { limit: args.limit || 100 });
      if (error) return { success: false, error: error.message };
      return { success: true, files: data };
    }

    // Edge Functions
    case "supabase_functions_list": {
      return await runSupabaseCLI(["functions", "list"]);
    }

    case "supabase_functions_new": {
      const funcArgs = ["functions", "new", args.name];
      return await runSupabaseCLI(funcArgs);
    }

    case "supabase_functions_deploy": {
      const deployArgs = ["functions", "deploy"];
      if (args.name) deployArgs.push(args.name);
      if (args.no_verify_jwt) deployArgs.push("--no-verify-jwt");
      return await runSupabaseCLI(deployArgs);
    }

    case "supabase_functions_serve": {
      const serveArgs = ["functions", "serve"];
      if (args.env_file) serveArgs.push("--env-file", args.env_file);
      return await runSupabaseCLI(serveArgs);
    }

    // Types Generation
    case "supabase_gen_types": {
      const typesArgs = ["gen", "types", "typescript"];
      if (args.output) {
        typesArgs.push("--local");
        const result = await runSupabaseCLI(typesArgs);
        if (result.success && args.output) {
          writeFileSync(args.output, result.output);
          return { success: true, message: `Types written to ${args.output}` };
        }
        return result;
      }
      return await runSupabaseCLI(typesArgs);
    }

    // RLS Operations
    case "supabase_rls_generate": {
      return generateRLSPolicy(args.table, args.policy_type);
    }

    case "supabase_rls_audit": {
      return auditRLSPolicies(args.schema || "public");
    }

    // Realtime
    case "supabase_realtime_enable": {
      const sql = `
        ALTER PUBLICATION supabase_realtime ADD TABLE ${args.schema || "public"}.${args.table};
      `;
      return await handleToolCall("supabase_query", { sql });
    }

    // Secrets
    case "supabase_secrets_list": {
      return await runSupabaseCLI(["secrets", "list"]);
    }

    case "supabase_secrets_set": {
      return await runSupabaseCLI(["secrets", "set", `${args.name}=${args.value}`]);
    }

    case "supabase_secrets_unset": {
      return await runSupabaseCLI(["secrets", "unset", args.name]);
    }

    // Logs
    case "supabase_logs": {
      const logArgs = ["logs"];
      if (args.service) logArgs.push(args.service);
      if (args.follow) logArgs.push("--follow");
      return await runSupabaseCLI(logArgs);
    }

    // Schema Generation
    case "supabase_generate_schema": {
      return generateSchemaFromDescription(args.description, args.template);
    }

    default:
      return { success: false, error: `Unknown tool: ${name}` };
  }
}

// ═══════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════

function generateRLSPolicy(table, policyType) {
  const policies = {
    "user-owned": `
-- RLS Policies for ${table} (User-Owned Pattern)
-- Users can only access their own rows

ALTER TABLE ${table} ENABLE ROW LEVEL SECURITY;

-- Select: Users can view their own rows
CREATE POLICY "${table}_select_own" ON ${table}
  FOR SELECT USING (auth.uid() = user_id);

-- Insert: Users can insert their own rows
CREATE POLICY "${table}_insert_own" ON ${table}
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Update: Users can update their own rows
CREATE POLICY "${table}_update_own" ON ${table}
  FOR UPDATE USING (auth.uid() = user_id);

-- Delete: Users can delete their own rows
CREATE POLICY "${table}_delete_own" ON ${table}
  FOR DELETE USING (auth.uid() = user_id);
`,
    "org-based": `
-- RLS Policies for ${table} (Organization-Based Pattern)
-- Users can access rows belonging to their organization

ALTER TABLE ${table} ENABLE ROW LEVEL SECURITY;

-- Helper function to get user's org
CREATE OR REPLACE FUNCTION auth.user_org_id()
RETURNS UUID AS $$
  SELECT org_id FROM organization_members WHERE user_id = auth.uid() LIMIT 1;
$$ LANGUAGE SQL SECURITY DEFINER;

-- Select: Users can view org rows
CREATE POLICY "${table}_select_org" ON ${table}
  FOR SELECT USING (org_id = auth.user_org_id());

-- Insert: Users can insert to their org
CREATE POLICY "${table}_insert_org" ON ${table}
  FOR INSERT WITH CHECK (org_id = auth.user_org_id());

-- Update: Users can update org rows
CREATE POLICY "${table}_update_org" ON ${table}
  FOR UPDATE USING (org_id = auth.user_org_id());

-- Delete: Users can delete org rows
CREATE POLICY "${table}_delete_org" ON ${table}
  FOR DELETE USING (org_id = auth.user_org_id());
`,
    "role-based": `
-- RLS Policies for ${table} (Role-Based Pattern)
-- Access based on user roles

ALTER TABLE ${table} ENABLE ROW LEVEL SECURITY;

-- Helper function to check user role
CREATE OR REPLACE FUNCTION auth.user_role()
RETURNS TEXT AS $$
  SELECT role FROM user_profiles WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER;

-- Admin: Full access
CREATE POLICY "${table}_admin_all" ON ${table}
  FOR ALL USING (auth.user_role() = 'admin');

-- Editor: Read and write
CREATE POLICY "${table}_editor_select" ON ${table}
  FOR SELECT USING (auth.user_role() IN ('admin', 'editor'));

CREATE POLICY "${table}_editor_insert" ON ${table}
  FOR INSERT WITH CHECK (auth.user_role() IN ('admin', 'editor'));

CREATE POLICY "${table}_editor_update" ON ${table}
  FOR UPDATE USING (auth.user_role() IN ('admin', 'editor'));

-- Viewer: Read only
CREATE POLICY "${table}_viewer_select" ON ${table}
  FOR SELECT USING (auth.user_role() IN ('admin', 'editor', 'viewer'));
`,
    "public-read": `
-- RLS Policies for ${table} (Public Read, Auth Write Pattern)
-- Anyone can read, only authenticated users can write their own

ALTER TABLE ${table} ENABLE ROW LEVEL SECURITY;

-- Select: Anyone can view
CREATE POLICY "${table}_public_select" ON ${table}
  FOR SELECT USING (true);

-- Insert: Authenticated users only
CREATE POLICY "${table}_auth_insert" ON ${table}
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- Update: Own rows only
CREATE POLICY "${table}_auth_update" ON ${table}
  FOR UPDATE USING (auth.uid() = user_id);

-- Delete: Own rows only
CREATE POLICY "${table}_auth_delete" ON ${table}
  FOR DELETE USING (auth.uid() = user_id);
`,
  };

  return {
    success: true,
    sql: policies[policyType] || "Unknown policy type",
    policy_type: policyType,
    table: table,
  };
}

function auditRLSPolicies(schema) {
  const sql = `
    SELECT
      schemaname,
      tablename,
      rowsecurity,
      (SELECT COUNT(*) FROM pg_policies WHERE schemaname = t.schemaname AND tablename = t.tablename) as policy_count
    FROM pg_tables t
    WHERE schemaname = '${schema}'
    ORDER BY tablename;
  `;
  return {
    success: true,
    audit_query: sql,
    message: "Run this query to see RLS status for all tables",
  };
}

function generateSchemaFromDescription(description, template) {
  const templates = {
    "user-profiles": `
-- User Profiles Schema
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE user_settings (
  user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  theme TEXT DEFAULT 'light',
  notifications_enabled BOOLEAN DEFAULT true,
  settings JSONB DEFAULT '{}'::jsonb
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Trigger for updated_at
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION moddatetime(updated_at);
`,
    "multi-tenant": `
-- Multi-Tenant Schema
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  settings JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE organization_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(org_id, user_id)
);

CREATE TABLE invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'member',
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;
`,
    blog: `
-- Blog Schema
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT,
  excerpt TEXT,
  cover_image TEXT,
  published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL
);

CREATE TABLE post_categories (
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, category_id)
);

CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
`,
    ecommerce: `
-- E-commerce Schema
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  compare_at_price DECIMAL(10,2),
  inventory_count INT DEFAULT 0,
  images TEXT[],
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES auth.users(id),
  status TEXT DEFAULT 'pending',
  total DECIMAL(10,2) NOT NULL,
  shipping_address JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  quantity INT NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL
);

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
`,
    chat: `
-- Real-time Chat Schema
CREATE TABLE channels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT DEFAULT 'public',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE channel_members (
  channel_id UUID REFERENCES channels(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member',
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (channel_id, user_id)
);

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id UUID REFERENCES channels(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  attachments JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  edited_at TIMESTAMPTZ
);

-- Enable RLS
ALTER TABLE channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE channel_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
`,
  };

  return {
    success: true,
    schema: templates[template] || `-- Generated schema based on: ${description}\n-- Customize this schema for your needs`,
    template: template || "custom",
    description: description,
  };
}

// ═══════════════════════════════════════════════════════════════
// MCP SERVER
// ═══════════════════════════════════════════════════════════════

const server = new Server(
  {
    name: "supabase-mcp-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
      resources: {},
    },
  }
);

// List Tools Handler
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools: TOOLS };
});

// Call Tool Handler
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    const result = await handleToolCall(name, args || {});
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({ error: error.message }, null, 2),
        },
      ],
      isError: true,
    };
  }
});

// List Resources Handler
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: [
      {
        uri: "supabase://config",
        name: "Supabase Configuration",
        description: "Current Supabase project configuration",
        mimeType: "application/json",
      },
    ],
  };
});

// Read Resource Handler
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const { uri } = request.params;

  if (uri === "supabase://config") {
    return {
      contents: [
        {
          uri,
          mimeType: "application/json",
          text: JSON.stringify(
            {
              url: SUPABASE_URL ? "configured" : "not configured",
              anon_key: SUPABASE_ANON_KEY ? "configured" : "not configured",
              service_role_key: SUPABASE_SERVICE_ROLE_KEY ? "configured" : "not configured",
              project_ref: SUPABASE_PROJECT_REF || "not set",
            },
            null,
            2
          ),
        },
      ],
    };
  }

  throw new Error(`Unknown resource: ${uri}`);
});

// Start Server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Supabase MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
