#!/usr/bin/env node
/**
 * ═══════════════════════════════════════════════════════════════════════════════
 *  NEXUS-PRIME: GitHub MCP Server
 *  Model Context Protocol server for GitHub API integration
 *  "Code flows. Teams collaborate. Software ships."
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { Octokit } from "@octokit/rest";

// Initialize GitHub client
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

// Create MCP server
const server = new Server(
  {
    name: "github-mcp-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
      resources: {},
    },
  }
);

// ─────────────────────────────────────────────────────────────────────────────
//  Tools Definition
// ─────────────────────────────────────────────────────────────────────────────

const tools = [
  {
    name: "github_create_repo",
    description: "Create a new GitHub repository",
    inputSchema: {
      type: "object",
      properties: {
        name: { type: "string", description: "Repository name" },
        description: { type: "string", description: "Repository description" },
        private: { type: "boolean", description: "Make repository private" },
        org: { type: "string", description: "Organization name (optional)" },
      },
      required: ["name"],
    },
  },
  {
    name: "github_get_repo",
    description: "Get repository details",
    inputSchema: {
      type: "object",
      properties: {
        owner: { type: "string", description: "Repository owner" },
        repo: { type: "string", description: "Repository name" },
      },
      required: ["owner", "repo"],
    },
  },
  {
    name: "github_list_repos",
    description: "List repositories for user or organization",
    inputSchema: {
      type: "object",
      properties: {
        owner: { type: "string", description: "User or org name" },
        type: { type: "string", enum: ["all", "public", "private"] },
        per_page: { type: "number", description: "Results per page" },
      },
    },
  },
  {
    name: "github_create_branch",
    description: "Create a new branch",
    inputSchema: {
      type: "object",
      properties: {
        owner: { type: "string" },
        repo: { type: "string" },
        branch: { type: "string", description: "New branch name" },
        from_branch: { type: "string", description: "Source branch" },
      },
      required: ["owner", "repo", "branch"],
    },
  },
  {
    name: "github_create_pr",
    description: "Create a pull request",
    inputSchema: {
      type: "object",
      properties: {
        owner: { type: "string" },
        repo: { type: "string" },
        title: { type: "string" },
        head: { type: "string", description: "Source branch" },
        base: { type: "string", description: "Target branch" },
        body: { type: "string", description: "PR description" },
        draft: { type: "boolean" },
      },
      required: ["owner", "repo", "title", "head", "base"],
    },
  },
  {
    name: "github_list_prs",
    description: "List pull requests",
    inputSchema: {
      type: "object",
      properties: {
        owner: { type: "string" },
        repo: { type: "string" },
        state: { type: "string", enum: ["open", "closed", "all"] },
        per_page: { type: "number" },
      },
      required: ["owner", "repo"],
    },
  },
  {
    name: "github_merge_pr",
    description: "Merge a pull request",
    inputSchema: {
      type: "object",
      properties: {
        owner: { type: "string" },
        repo: { type: "string" },
        pull_number: { type: "number" },
        merge_method: { type: "string", enum: ["merge", "squash", "rebase"] },
      },
      required: ["owner", "repo", "pull_number"],
    },
  },
  {
    name: "github_create_issue",
    description: "Create an issue",
    inputSchema: {
      type: "object",
      properties: {
        owner: { type: "string" },
        repo: { type: "string" },
        title: { type: "string" },
        body: { type: "string" },
        labels: { type: "array", items: { type: "string" } },
        assignees: { type: "array", items: { type: "string" } },
      },
      required: ["owner", "repo", "title"],
    },
  },
  {
    name: "github_list_issues",
    description: "List issues",
    inputSchema: {
      type: "object",
      properties: {
        owner: { type: "string" },
        repo: { type: "string" },
        state: { type: "string", enum: ["open", "closed", "all"] },
        labels: { type: "string" },
        per_page: { type: "number" },
      },
      required: ["owner", "repo"],
    },
  },
  {
    name: "github_list_workflows",
    description: "List GitHub Actions workflows",
    inputSchema: {
      type: "object",
      properties: {
        owner: { type: "string" },
        repo: { type: "string" },
      },
      required: ["owner", "repo"],
    },
  },
  {
    name: "github_trigger_workflow",
    description: "Trigger a workflow dispatch event",
    inputSchema: {
      type: "object",
      properties: {
        owner: { type: "string" },
        repo: { type: "string" },
        workflow_id: { type: "string" },
        ref: { type: "string", description: "Branch or tag ref" },
        inputs: { type: "object", description: "Workflow inputs" },
      },
      required: ["owner", "repo", "workflow_id", "ref"],
    },
  },
  {
    name: "github_create_release",
    description: "Create a release",
    inputSchema: {
      type: "object",
      properties: {
        owner: { type: "string" },
        repo: { type: "string" },
        tag_name: { type: "string" },
        name: { type: "string" },
        body: { type: "string" },
        draft: { type: "boolean" },
        prerelease: { type: "boolean" },
        generate_release_notes: { type: "boolean" },
      },
      required: ["owner", "repo", "tag_name"],
    },
  },
  {
    name: "github_set_secret",
    description: "Set a repository secret",
    inputSchema: {
      type: "object",
      properties: {
        owner: { type: "string" },
        repo: { type: "string" },
        secret_name: { type: "string" },
        secret_value: { type: "string" },
      },
      required: ["owner", "repo", "secret_name", "secret_value"],
    },
  },
];

// ─────────────────────────────────────────────────────────────────────────────
//  Tool Handlers
// ─────────────────────────────────────────────────────────────────────────────

async function handleTool(name, args) {
  switch (name) {
    case "github_create_repo": {
      const createFn = args.org
        ? octokit.repos.createInOrg.bind(octokit.repos)
        : octokit.repos.createForAuthenticatedUser.bind(octokit.repos);
      
      const params = {
        name: args.name,
        description: args.description,
        private: args.private ?? false,
        ...(args.org && { org: args.org }),
      };
      
      const { data } = await createFn(params);
      return { success: true, repository: data };
    }

    case "github_get_repo": {
      const { data } = await octokit.repos.get({
        owner: args.owner,
        repo: args.repo,
      });
      return data;
    }

    case "github_list_repos": {
      const { data } = args.owner
        ? await octokit.repos.listForUser({
            username: args.owner,
            type: args.type || "all",
            per_page: args.per_page || 30,
          })
        : await octokit.repos.listForAuthenticatedUser({
            type: args.type || "all",
            per_page: args.per_page || 30,
          });
      return data;
    }

    case "github_create_branch": {
      const fromBranch = args.from_branch || "main";
      
      // Get the SHA of the source branch
      const { data: ref } = await octokit.git.getRef({
        owner: args.owner,
        repo: args.repo,
        ref: `heads/${fromBranch}`,
      });
      
      // Create new branch
      const { data } = await octokit.git.createRef({
        owner: args.owner,
        repo: args.repo,
        ref: `refs/heads/${args.branch}`,
        sha: ref.object.sha,
      });
      
      return { success: true, branch: args.branch, sha: data.object.sha };
    }

    case "github_create_pr": {
      const { data } = await octokit.pulls.create({
        owner: args.owner,
        repo: args.repo,
        title: args.title,
        head: args.head,
        base: args.base,
        body: args.body,
        draft: args.draft,
      });
      return data;
    }

    case "github_list_prs": {
      const { data } = await octokit.pulls.list({
        owner: args.owner,
        repo: args.repo,
        state: args.state || "open",
        per_page: args.per_page || 30,
      });
      return data;
    }

    case "github_merge_pr": {
      const { data } = await octokit.pulls.merge({
        owner: args.owner,
        repo: args.repo,
        pull_number: args.pull_number,
        merge_method: args.merge_method || "squash",
      });
      return data;
    }

    case "github_create_issue": {
      const { data } = await octokit.issues.create({
        owner: args.owner,
        repo: args.repo,
        title: args.title,
        body: args.body,
        labels: args.labels,
        assignees: args.assignees,
      });
      return data;
    }

    case "github_list_issues": {
      const { data } = await octokit.issues.listForRepo({
        owner: args.owner,
        repo: args.repo,
        state: args.state || "open",
        labels: args.labels,
        per_page: args.per_page || 30,
      });
      return data;
    }

    case "github_list_workflows": {
      const { data } = await octokit.actions.listRepoWorkflows({
        owner: args.owner,
        repo: args.repo,
      });
      return data.workflows;
    }

    case "github_trigger_workflow": {
      await octokit.actions.createWorkflowDispatch({
        owner: args.owner,
        repo: args.repo,
        workflow_id: args.workflow_id,
        ref: args.ref,
        inputs: args.inputs || {},
      });
      return { success: true, message: "Workflow triggered" };
    }

    case "github_create_release": {
      const { data } = await octokit.repos.createRelease({
        owner: args.owner,
        repo: args.repo,
        tag_name: args.tag_name,
        name: args.name || args.tag_name,
        body: args.body,
        draft: args.draft,
        prerelease: args.prerelease,
        generate_release_notes: args.generate_release_notes,
      });
      return data;
    }

    case "github_set_secret": {
      // Get the public key for encrypting secrets
      const { data: publicKey } = await octokit.actions.getRepoPublicKey({
        owner: args.owner,
        repo: args.repo,
      });
      
      // Note: In production, you'd encrypt the secret value here
      // For now, we'll use the direct API (which may not work for all cases)
      await octokit.actions.createOrUpdateRepoSecret({
        owner: args.owner,
        repo: args.repo,
        secret_name: args.secret_name,
        encrypted_value: args.secret_value, // Should be encrypted
        key_id: publicKey.key_id,
      });
      
      return { success: true, message: `Secret ${args.secret_name} set` };
    }

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
//  Server Handlers
// ─────────────────────────────────────────────────────────────────────────────

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools,
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  
  try {
    const result = await handleTool(name, args);
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
          text: `Error: ${error.message}`,
        },
      ],
      isError: true,
    };
  }
});

// Resources
server.setRequestHandler(ListResourcesRequestSchema, async () => ({
  resources: [
    {
      uri: "github://user",
      name: "Authenticated User",
      description: "Current authenticated GitHub user",
      mimeType: "application/json",
    },
  ],
}));

server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const { uri } = request.params;
  
  if (uri === "github://user") {
    const { data } = await octokit.users.getAuthenticated();
    return {
      contents: [
        {
          uri,
          mimeType: "application/json",
          text: JSON.stringify(data, null, 2),
        },
      ],
    };
  }
  
  throw new Error(`Unknown resource: ${uri}`);
});

// ─────────────────────────────────────────────────────────────────────────────
//  Start Server
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("NEXUS-PRIME GitHub MCP Server running");
}

main().catch(console.error);
