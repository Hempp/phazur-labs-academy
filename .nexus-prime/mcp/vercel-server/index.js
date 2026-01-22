#!/usr/bin/env node
/**
 * ═══════════════════════════════════════════════════════════════════════════════
 *  NEXUS-PRIME: Enhanced Vercel MCP Server
 *  Model Context Protocol server for Vercel API integration
 *  Part of NEXUS-PRIME Vercel Deployment Master Team
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

const VERCEL_API_BASE = 'https://api.vercel.com';

// ─────────────────────────────────────────────────────────────────────────────
//  Token Management
// ─────────────────────────────────────────────────────────────────────────────
const getToken = () => {
  const token = process.env.VERCEL_TOKEN;
  if (!token) {
    throw new Error('VERCEL_TOKEN environment variable is required');
  }
  return token;
};

const getTeamId = () => process.env.VERCEL_TEAM_ID || null;

// ─────────────────────────────────────────────────────────────────────────────
//  Vercel API Client
// ─────────────────────────────────────────────────────────────────────────────
const vercelFetch = async (endpoint, options = {}) => {
  const token = getToken();
  const teamId = getTeamId();
  
  let url = `${VERCEL_API_BASE}${endpoint}`;
  
  // Add team ID if available
  if (teamId) {
    const separator = url.includes('?') ? '&' : '?';
    url = `${url}${separator}teamId=${teamId}`;
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Vercel API error: ${response.status} - ${error}`);
  }

  // Handle empty responses
  const text = await response.text();
  return text ? JSON.parse(text) : {};
};

// ─────────────────────────────────────────────────────────────────────────────
//  MCP Server Setup
// ─────────────────────────────────────────────────────────────────────────────
const server = new Server(
  {
    name: 'vercel-mcp-server',
    version: '2.0.0',
  },
  {
    capabilities: {
      tools: {},
      resources: {},
    },
  }
);

// ─────────────────────────────────────────────────────────────────────────────
//  Tool Definitions
// ─────────────────────────────────────────────────────────────────────────────
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      // ─────────────────────────────────────────────────────────────────────
      //  Team & User Tools
      // ─────────────────────────────────────────────────────────────────────
      {
        name: 'vercel_whoami',
        description: 'Get current user information',
        inputSchema: { type: 'object', properties: {} },
      },
      {
        name: 'vercel_list_teams',
        description: 'List all teams the user belongs to',
        inputSchema: { type: 'object', properties: {} },
      },
      {
        name: 'vercel_get_team',
        description: 'Get team details by ID or slug',
        inputSchema: {
          type: 'object',
          properties: {
            teamId: { type: 'string', description: 'Team ID or slug' },
          },
          required: ['teamId'],
        },
      },
      
      // ─────────────────────────────────────────────────────────────────────
      //  Project Tools
      // ─────────────────────────────────────────────────────────────────────
      {
        name: 'vercel_list_projects',
        description: 'List all projects',
        inputSchema: {
          type: 'object',
          properties: {
            limit: { type: 'number', description: 'Number of projects to return', default: 20 },
            search: { type: 'string', description: 'Search query' },
          },
        },
      },
      {
        name: 'vercel_get_project',
        description: 'Get project details',
        inputSchema: {
          type: 'object',
          properties: {
            projectId: { type: 'string', description: 'Project ID or name' },
          },
          required: ['projectId'],
        },
      },
      {
        name: 'vercel_create_project',
        description: 'Create a new project',
        inputSchema: {
          type: 'object',
          properties: {
            name: { type: 'string', description: 'Project name' },
            framework: { type: 'string', description: 'Framework (nextjs, remix, astro, etc.)' },
            gitRepository: {
              type: 'object',
              description: 'Git repository configuration',
              properties: {
                type: { type: 'string', enum: ['github', 'gitlab', 'bitbucket'] },
                repo: { type: 'string', description: 'Repository (owner/repo)' },
              },
            },
          },
          required: ['name'],
        },
      },
      {
        name: 'vercel_delete_project',
        description: 'Delete a project',
        inputSchema: {
          type: 'object',
          properties: {
            projectId: { type: 'string', description: 'Project ID or name' },
          },
          required: ['projectId'],
        },
      },
      
      // ─────────────────────────────────────────────────────────────────────
      //  Deployment Tools
      // ─────────────────────────────────────────────────────────────────────
      {
        name: 'vercel_list_deployments',
        description: 'List deployments for a project',
        inputSchema: {
          type: 'object',
          properties: {
            projectId: { type: 'string', description: 'Project ID' },
            limit: { type: 'number', description: 'Number of deployments', default: 10 },
            state: { type: 'string', enum: ['READY', 'ERROR', 'BUILDING', 'QUEUED', 'CANCELED'] },
            target: { type: 'string', enum: ['production', 'preview'] },
          },
        },
      },
      {
        name: 'vercel_get_deployment',
        description: 'Get deployment details',
        inputSchema: {
          type: 'object',
          properties: {
            deploymentId: { type: 'string', description: 'Deployment ID or URL' },
          },
          required: ['deploymentId'],
        },
      },
      {
        name: 'vercel_create_deployment',
        description: 'Create a new deployment',
        inputSchema: {
          type: 'object',
          properties: {
            name: { type: 'string', description: 'Project name' },
            target: { type: 'string', enum: ['production', 'preview'], default: 'preview' },
            gitSource: {
              type: 'object',
              properties: {
                type: { type: 'string' },
                ref: { type: 'string' },
                repoId: { type: 'string' },
              },
            },
          },
          required: ['name'],
        },
      },
      {
        name: 'vercel_cancel_deployment',
        description: 'Cancel an in-progress deployment',
        inputSchema: {
          type: 'object',
          properties: {
            deploymentId: { type: 'string', description: 'Deployment ID' },
          },
          required: ['deploymentId'],
        },
      },
      {
        name: 'vercel_redeploy',
        description: 'Redeploy an existing deployment',
        inputSchema: {
          type: 'object',
          properties: {
            deploymentId: { type: 'string', description: 'Deployment ID to redeploy' },
            target: { type: 'string', enum: ['production', 'preview'] },
          },
          required: ['deploymentId'],
        },
      },
      {
        name: 'vercel_promote_deployment',
        description: 'Promote a deployment to production',
        inputSchema: {
          type: 'object',
          properties: {
            deploymentId: { type: 'string', description: 'Deployment ID' },
          },
          required: ['deploymentId'],
        },
      },
      
      // ─────────────────────────────────────────────────────────────────────
      //  Environment Variable Tools
      // ─────────────────────────────────────────────────────────────────────
      {
        name: 'vercel_list_env_vars',
        description: 'List environment variables for a project',
        inputSchema: {
          type: 'object',
          properties: {
            projectId: { type: 'string', description: 'Project ID or name' },
          },
          required: ['projectId'],
        },
      },
      {
        name: 'vercel_create_env_var',
        description: 'Create an environment variable',
        inputSchema: {
          type: 'object',
          properties: {
            projectId: { type: 'string', description: 'Project ID' },
            key: { type: 'string', description: 'Variable name' },
            value: { type: 'string', description: 'Variable value' },
            target: {
              type: 'array',
              items: { type: 'string', enum: ['production', 'preview', 'development'] },
              description: 'Target environments',
            },
            type: { type: 'string', enum: ['plain', 'secret', 'encrypted'], default: 'encrypted' },
          },
          required: ['projectId', 'key', 'value', 'target'],
        },
      },
      {
        name: 'vercel_update_env_var',
        description: 'Update an environment variable',
        inputSchema: {
          type: 'object',
          properties: {
            projectId: { type: 'string', description: 'Project ID' },
            envId: { type: 'string', description: 'Environment variable ID' },
            value: { type: 'string', description: 'New value' },
            target: { type: 'array', items: { type: 'string' } },
          },
          required: ['projectId', 'envId', 'value'],
        },
      },
      {
        name: 'vercel_delete_env_var',
        description: 'Delete an environment variable',
        inputSchema: {
          type: 'object',
          properties: {
            projectId: { type: 'string', description: 'Project ID' },
            envId: { type: 'string', description: 'Environment variable ID' },
          },
          required: ['projectId', 'envId'],
        },
      },
      
      // ─────────────────────────────────────────────────────────────────────
      //  Domain Tools
      // ─────────────────────────────────────────────────────────────────────
      {
        name: 'vercel_list_domains',
        description: 'List domains for a project',
        inputSchema: {
          type: 'object',
          properties: {
            projectId: { type: 'string', description: 'Project ID' },
          },
          required: ['projectId'],
        },
      },
      {
        name: 'vercel_add_domain',
        description: 'Add a domain to a project',
        inputSchema: {
          type: 'object',
          properties: {
            projectId: { type: 'string', description: 'Project ID' },
            domain: { type: 'string', description: 'Domain name' },
          },
          required: ['projectId', 'domain'],
        },
      },
      {
        name: 'vercel_remove_domain',
        description: 'Remove a domain from a project',
        inputSchema: {
          type: 'object',
          properties: {
            projectId: { type: 'string', description: 'Project ID' },
            domain: { type: 'string', description: 'Domain name' },
          },
          required: ['projectId', 'domain'],
        },
      },
      {
        name: 'vercel_verify_domain',
        description: 'Verify domain ownership',
        inputSchema: {
          type: 'object',
          properties: {
            domain: { type: 'string', description: 'Domain name' },
          },
          required: ['domain'],
        },
      },
      {
        name: 'vercel_get_domain_config',
        description: 'Get domain DNS configuration',
        inputSchema: {
          type: 'object',
          properties: {
            domain: { type: 'string', description: 'Domain name' },
          },
          required: ['domain'],
        },
      },
      
      // ─────────────────────────────────────────────────────────────────────
      //  Logs & Monitoring Tools
      // ─────────────────────────────────────────────────────────────────────
      {
        name: 'vercel_get_deployment_logs',
        description: 'Get logs for a deployment',
        inputSchema: {
          type: 'object',
          properties: {
            deploymentId: { type: 'string', description: 'Deployment ID' },
            since: { type: 'number', description: 'Unix timestamp to start from' },
            until: { type: 'number', description: 'Unix timestamp to end at' },
          },
          required: ['deploymentId'],
        },
      },
      {
        name: 'vercel_get_deployment_events',
        description: 'Get deployment build events',
        inputSchema: {
          type: 'object',
          properties: {
            deploymentId: { type: 'string', description: 'Deployment ID' },
          },
          required: ['deploymentId'],
        },
      },
      
      // ─────────────────────────────────────────────────────────────────────
      //  Edge Config Tools
      // ─────────────────────────────────────────────────────────────────────
      {
        name: 'vercel_list_edge_configs',
        description: 'List Edge Config stores',
        inputSchema: { type: 'object', properties: {} },
      },
      {
        name: 'vercel_get_edge_config',
        description: 'Get Edge Config details',
        inputSchema: {
          type: 'object',
          properties: {
            edgeConfigId: { type: 'string', description: 'Edge Config ID' },
          },
          required: ['edgeConfigId'],
        },
      },
      {
        name: 'vercel_get_edge_config_items',
        description: 'Get Edge Config items',
        inputSchema: {
          type: 'object',
          properties: {
            edgeConfigId: { type: 'string', description: 'Edge Config ID' },
          },
          required: ['edgeConfigId'],
        },
      },
      
      // ─────────────────────────────────────────────────────────────────────
      //  Webhook Tools
      // ─────────────────────────────────────────────────────────────────────
      {
        name: 'vercel_list_webhooks',
        description: 'List webhooks for a project',
        inputSchema: {
          type: 'object',
          properties: {
            projectId: { type: 'string', description: 'Project ID' },
          },
          required: ['projectId'],
        },
      },
      {
        name: 'vercel_create_webhook',
        description: 'Create a webhook',
        inputSchema: {
          type: 'object',
          properties: {
            projectId: { type: 'string', description: 'Project ID' },
            url: { type: 'string', description: 'Webhook URL' },
            events: {
              type: 'array',
              items: { type: 'string' },
              description: 'Events to trigger on',
            },
          },
          required: ['projectId', 'url', 'events'],
        },
      },
    ],
  };
});

// ─────────────────────────────────────────────────────────────────────────────
//  Tool Handler
// ─────────────────────────────────────────────────────────────────────────────
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      // User & Team
      case 'vercel_whoami': {
        const data = await vercelFetch('/v2/user');
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      }
      
      case 'vercel_list_teams': {
        const data = await vercelFetch('/v2/teams');
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      }
      
      case 'vercel_get_team': {
        const data = await vercelFetch(`/v2/teams/${args.teamId}`);
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      }

      // Projects
      case 'vercel_list_projects': {
        const params = new URLSearchParams();
        if (args?.limit) params.append('limit', args.limit.toString());
        if (args?.search) params.append('search', args.search);
        const query = params.toString() ? `?${params.toString()}` : '';
        const data = await vercelFetch(`/v9/projects${query}`);
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      }
      
      case 'vercel_get_project': {
        const data = await vercelFetch(`/v9/projects/${args.projectId}`);
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      }
      
      case 'vercel_create_project': {
        const data = await vercelFetch('/v9/projects', {
          method: 'POST',
          body: JSON.stringify({
            name: args.name,
            framework: args.framework,
            gitRepository: args.gitRepository,
          }),
        });
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      }
      
      case 'vercel_delete_project': {
        await vercelFetch(`/v9/projects/${args.projectId}`, { method: 'DELETE' });
        return { content: [{ type: 'text', text: `Project ${args.projectId} deleted` }] };
      }

      // Deployments
      case 'vercel_list_deployments': {
        const params = new URLSearchParams();
        if (args?.projectId) params.append('projectId', args.projectId);
        if (args?.limit) params.append('limit', args.limit.toString());
        if (args?.state) params.append('state', args.state);
        if (args?.target) params.append('target', args.target);
        const query = params.toString() ? `?${params.toString()}` : '';
        const data = await vercelFetch(`/v6/deployments${query}`);
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      }
      
      case 'vercel_get_deployment': {
        const data = await vercelFetch(`/v13/deployments/${args.deploymentId}`);
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      }
      
      case 'vercel_create_deployment': {
        const data = await vercelFetch('/v13/deployments', {
          method: 'POST',
          body: JSON.stringify({
            name: args.name,
            target: args.target || 'preview',
            gitSource: args.gitSource,
          }),
        });
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      }
      
      case 'vercel_cancel_deployment': {
        const data = await vercelFetch(`/v12/deployments/${args.deploymentId}/cancel`, {
          method: 'PATCH',
        });
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      }
      
      case 'vercel_redeploy': {
        const data = await vercelFetch(`/v13/deployments/${args.deploymentId}/redeploy`, {
          method: 'POST',
          body: JSON.stringify({ target: args.target }),
        });
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      }
      
      case 'vercel_promote_deployment': {
        const data = await vercelFetch(`/v10/deployments/${args.deploymentId}/promote`, {
          method: 'POST',
        });
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      }

      // Environment Variables
      case 'vercel_list_env_vars': {
        const data = await vercelFetch(`/v9/projects/${args.projectId}/env`);
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      }
      
      case 'vercel_create_env_var': {
        const data = await vercelFetch(`/v10/projects/${args.projectId}/env`, {
          method: 'POST',
          body: JSON.stringify({
            key: args.key,
            value: args.value,
            target: args.target,
            type: args.type || 'encrypted',
          }),
        });
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      }
      
      case 'vercel_update_env_var': {
        const data = await vercelFetch(`/v9/projects/${args.projectId}/env/${args.envId}`, {
          method: 'PATCH',
          body: JSON.stringify({ value: args.value, target: args.target }),
        });
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      }
      
      case 'vercel_delete_env_var': {
        await vercelFetch(`/v9/projects/${args.projectId}/env/${args.envId}`, {
          method: 'DELETE',
        });
        return { content: [{ type: 'text', text: `Environment variable deleted` }] };
      }

      // Domains
      case 'vercel_list_domains': {
        const data = await vercelFetch(`/v9/projects/${args.projectId}/domains`);
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      }
      
      case 'vercel_add_domain': {
        const data = await vercelFetch(`/v10/projects/${args.projectId}/domains`, {
          method: 'POST',
          body: JSON.stringify({ name: args.domain }),
        });
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      }
      
      case 'vercel_remove_domain': {
        await vercelFetch(`/v9/projects/${args.projectId}/domains/${args.domain}`, {
          method: 'DELETE',
        });
        return { content: [{ type: 'text', text: `Domain ${args.domain} removed` }] };
      }
      
      case 'vercel_verify_domain': {
        const data = await vercelFetch(`/v4/domains/${args.domain}/verify`, {
          method: 'POST',
        });
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      }
      
      case 'vercel_get_domain_config': {
        const data = await vercelFetch(`/v4/domains/${args.domain}/config`);
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      }

      // Logs
      case 'vercel_get_deployment_logs': {
        const params = new URLSearchParams();
        if (args?.since) params.append('since', args.since.toString());
        if (args?.until) params.append('until', args.until.toString());
        const query = params.toString() ? `?${params.toString()}` : '';
        const data = await vercelFetch(`/v2/deployments/${args.deploymentId}/events${query}`);
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      }
      
      case 'vercel_get_deployment_events': {
        const data = await vercelFetch(`/v2/deployments/${args.deploymentId}/events`);
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      }

      // Edge Config
      case 'vercel_list_edge_configs': {
        const data = await vercelFetch('/v1/edge-config');
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      }
      
      case 'vercel_get_edge_config': {
        const data = await vercelFetch(`/v1/edge-config/${args.edgeConfigId}`);
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      }
      
      case 'vercel_get_edge_config_items': {
        const data = await vercelFetch(`/v1/edge-config/${args.edgeConfigId}/items`);
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      }

      // Webhooks
      case 'vercel_list_webhooks': {
        const data = await vercelFetch(`/v1/webhooks?projectId=${args.projectId}`);
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      }
      
      case 'vercel_create_webhook': {
        const data = await vercelFetch('/v1/webhooks', {
          method: 'POST',
          body: JSON.stringify({
            projectId: args.projectId,
            url: args.url,
            events: args.events,
          }),
        });
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [{ type: 'text', text: `Error: ${error.message}` }],
      isError: true,
    };
  }
});

// ─────────────────────────────────────────────────────────────────────────────
//  Resource Definitions
// ─────────────────────────────────────────────────────────────────────────────
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: [
      {
        uri: 'vercel://user',
        name: 'Current User',
        description: 'Current authenticated user',
        mimeType: 'application/json',
      },
      {
        uri: 'vercel://teams',
        name: 'Vercel Teams',
        description: 'List of user teams',
        mimeType: 'application/json',
      },
      {
        uri: 'vercel://projects',
        name: 'Vercel Projects',
        description: 'List of projects',
        mimeType: 'application/json',
      },
      {
        uri: 'vercel://deployments',
        name: 'Recent Deployments',
        description: 'Recent deployments across projects',
        mimeType: 'application/json',
      },
      {
        uri: 'vercel://domains',
        name: 'Domains',
        description: 'All domains',
        mimeType: 'application/json',
      },
    ],
  };
});

// ─────────────────────────────────────────────────────────────────────────────
//  Resource Handler
// ─────────────────────────────────────────────────────────────────────────────
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const { uri } = request.params;

  try {
    switch (uri) {
      case 'vercel://user': {
        const data = await vercelFetch('/v2/user');
        return {
          contents: [{ uri, mimeType: 'application/json', text: JSON.stringify(data, null, 2) }],
        };
      }
      
      case 'vercel://teams': {
        const data = await vercelFetch('/v2/teams');
        return {
          contents: [{ uri, mimeType: 'application/json', text: JSON.stringify(data, null, 2) }],
        };
      }
      
      case 'vercel://projects': {
        const data = await vercelFetch('/v9/projects');
        return {
          contents: [{ uri, mimeType: 'application/json', text: JSON.stringify(data, null, 2) }],
        };
      }
      
      case 'vercel://deployments': {
        const data = await vercelFetch('/v6/deployments?limit=20');
        return {
          contents: [{ uri, mimeType: 'application/json', text: JSON.stringify(data, null, 2) }],
        };
      }
      
      case 'vercel://domains': {
        const data = await vercelFetch('/v5/domains');
        return {
          contents: [{ uri, mimeType: 'application/json', text: JSON.stringify(data, null, 2) }],
        };
      }

      default:
        throw new Error(`Unknown resource: ${uri}`);
    }
  } catch (error) {
    throw new Error(`Failed to read resource: ${error.message}`);
  }
});

// ─────────────────────────────────────────────────────────────────────────────
//  Server Start
// ─────────────────────────────────────────────────────────────────────────────
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('NEXUS-PRIME Vercel MCP Server v2.0.0 running on stdio');
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});
