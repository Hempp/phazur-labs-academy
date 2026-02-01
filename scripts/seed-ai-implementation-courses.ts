#!/usr/bin/env npx tsx

/**
 * AI Implementation Curriculum Seeder
 *
 * Seeds the 6 AI Implementation courses to Supabase:
 * - Course 1: AI Foundations & Tool Mastery (14 lessons)
 * - Course 2: Building AI Agents (14 lessons)
 * - Course 3: MCP Development (12 lessons)
 * - Course 4: AI Workflow Architecture (14 lessons)
 * - Course 5: Training Teams on AI (12 lessons)
 * - Course 6: Enterprise AI Implementation (14 lessons)
 *
 * Total: 80 lessons | ~521 minutes | 22 modules
 *
 * Usage: npx tsx scripts/seed-ai-implementation-courses.ts
 */

import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'

// Load .env.local
config({ path: '.env.local' })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Missing Supabase configuration')
  console.log('Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

// ============================================================================
// INSTRUCTOR DEFINITIONS
// ============================================================================

const INSTRUCTORS = {
  'james-park': {
    id: 'james-park',
    name: 'Dr. James Park',
    specialty: 'AI Fundamentals, Data Science',
    bio: 'Former Google AI researcher with 15+ years in machine learning. Ph.D. from Stanford in Computer Science. Passionate about making AI accessible to everyone.',
    avatar_url: '/images/instructors/james-park.jpg',
  },
  'sarah-chen': {
    id: 'sarah-chen',
    name: 'Dr. Sarah Chen',
    specialty: 'AI Agents, Technical Development',
    bio: 'AI agent architect who has built production systems at major tech companies. Expert in autonomous systems and the Claude Agent SDK.',
    avatar_url: '/images/instructors/sarah-chen.jpg',
  },
  'marcus-williams': {
    id: 'marcus-williams',
    name: 'Marcus Williams',
    specialty: 'MCP Development, Enterprise AI',
    bio: 'Enterprise AI consultant who has led AI transformation at Fortune 500 companies. Expert in MCP development and organizational AI strategy.',
    avatar_url: '/images/instructors/marcus-williams.jpg',
  },
  'elena-rodriguez': {
    id: 'elena-rodriguez',
    name: 'Elena Rodriguez',
    specialty: 'Workflow Automation, DevOps',
    bio: 'Automation architect specializing in n8n and AI-powered workflows. Has built automation systems processing millions of tasks.',
    avatar_url: '/images/instructors/elena-rodriguez.jpg',
  },
  'aisha-kumar': {
    id: 'aisha-kumar',
    name: 'Aisha Kumar',
    specialty: 'AI Training, Change Management',
    bio: 'Organizational change specialist focused on AI adoption. Has trained 10,000+ professionals across industries on effective AI use.',
    avatar_url: '/images/instructors/aisha-kumar.jpg',
  },
}

// ============================================================================
// COURSE DEFINITIONS (AI Implementation Curriculum)
// ============================================================================

interface Lesson {
  id: string
  title: string
  type: 'welcome' | 'concept' | 'practical' | 'advanced'
  duration: number
  description?: string
}

interface Quiz {
  title: string
  questions: number
  pass_score: number
  time_limit: number
}

interface Assignment {
  title: string
  description: string
  points: number
}

interface Module {
  id: string
  title: string
  description: string
  order: number
  lessons: Lesson[]
  quiz?: Quiz
  assignment?: Assignment
}

interface FinalTest {
  title: string
  questions: number
  pass_score: number
  time_limit: number
}

interface Project {
  title: string
  description: string
  points: number
  rubric: Record<string, number>
}

interface Course {
  id: string
  title: string
  slug: string
  instructor_id: string
  description: string
  level: 'beginner' | 'intermediate' | 'advanced'
  duration_minutes: number
  modules: Module[]
  final_test: FinalTest
  project: Project
}

// Course 1: AI Foundations & Tool Mastery
const COURSE_1_AI_FOUNDATIONS: Course = {
  id: 'ai-foundations',
  title: 'AI Foundations & Tool Mastery',
  slug: 'ai-foundations',
  instructor_id: 'james-park',
  description: 'Master the core skills of AI: understanding LLMs, prompt engineering, and API integration. Build a solid foundation for all future AI development.',
  level: 'beginner',
  duration_minutes: 91,
  modules: [
    {
      id: 'mod-1-1',
      title: 'Understanding Modern AI',
      description: 'Core concepts of LLMs and the AI ecosystem',
      order: 1,
      lessons: [
        { id: 'ai-1-1-1', title: 'Welcome: Becoming an AI Builder', type: 'welcome', duration: 6, description: 'Course introduction and what you will build' },
        { id: 'ai-1-1-2', title: 'LLMs Explained: How AI Actually Works', type: 'concept', duration: 7, description: 'Transformers, context windows, and reasoning' },
        { id: 'ai-1-1-3', title: 'The AI Tool Landscape', type: 'concept', duration: 7, description: 'Claude, GPT, Gemini, and open source models' },
        { id: 'ai-1-1-4', title: 'APIs vs Apps: When to Use What', type: 'concept', duration: 6, description: 'Direct API access vs application interfaces' },
      ],
      quiz: { title: 'AI Fundamentals Check', questions: 10, pass_score: 70, time_limit: 15 },
    },
    {
      id: 'mod-1-2',
      title: 'Prompt Engineering Mastery',
      description: 'Advanced techniques for getting the best results from AI',
      order: 2,
      lessons: [
        { id: 'ai-1-2-1', title: 'Prompt Engineering Fundamentals', type: 'concept', duration: 7, description: 'Structure, clarity, and specificity' },
        { id: 'ai-1-2-2', title: 'System Prompts & Personas', type: 'practical', duration: 6, description: 'Role definition and behavior control' },
        { id: 'ai-1-2-3', title: 'Chain-of-Thought & Reasoning', type: 'advanced', duration: 7, description: 'Step-by-step prompting techniques' },
        { id: 'ai-1-2-4', title: 'Few-Shot & In-Context Learning', type: 'advanced', duration: 6, description: 'Examples, patterns, and formatting' },
        { id: 'ai-1-2-5', title: 'Building Reusable Prompt Templates', type: 'practical', duration: 7, description: 'Variables and modular prompts' },
      ],
      quiz: { title: 'Prompt Engineering Mastery', questions: 12, pass_score: 70, time_limit: 18 },
      assignment: { title: 'Build Your Prompt Library', description: 'Create 15 reusable prompt templates for your industry', points: 100 },
    },
    {
      id: 'mod-1-3',
      title: 'Working with AI APIs',
      description: 'Integrate AI into applications using APIs',
      order: 3,
      lessons: [
        { id: 'ai-1-3-1', title: 'API Basics: Authentication & Requests', type: 'practical', duration: 7, description: 'Keys, endpoints, and headers' },
        { id: 'ai-1-3-2', title: 'Claude API Deep Dive', type: 'practical', duration: 7, description: 'Messages, tools, and streaming' },
        { id: 'ai-1-3-3', title: 'Handling Responses & Errors', type: 'practical', duration: 6, description: 'Parsing, retries, and edge cases' },
        { id: 'ai-1-3-4', title: 'Cost Optimization & Token Management', type: 'advanced', duration: 6, description: 'Pricing, caching, and efficiency' },
        { id: 'ai-1-3-5', title: 'Building Your First AI Integration', type: 'practical', duration: 7, description: 'End-to-end project' },
      ],
      quiz: { title: 'API Integration', questions: 10, pass_score: 70, time_limit: 15 },
    },
  ],
  final_test: { title: 'AI Foundations Certification Exam', questions: 25, pass_score: 75, time_limit: 45 },
  project: {
    title: 'AI-Powered Tool',
    description: 'Build a working AI tool that integrates with Claude or GPT API, handles errors gracefully, and includes cost tracking.',
    points: 100,
    rubric: { 'Functionality': 30, 'API Integration': 25, 'Error Handling': 20, 'Documentation': 15, 'Code Quality': 10 },
  },
}

// Course 2: Building AI Agents
const COURSE_2_AI_AGENTS: Course = {
  id: 'ai-agents',
  title: 'Building AI Agents',
  slug: 'ai-agents',
  instructor_id: 'sarah-chen',
  description: 'Design and build autonomous AI agents using Claude Agent SDK and advanced patterns. Create agents that can reason, use tools, and complete complex tasks.',
  level: 'intermediate',
  duration_minutes: 91,
  modules: [
    {
      id: 'mod-2-1',
      title: 'Agent Architecture',
      description: 'Understanding AI agent design and patterns',
      order: 1,
      lessons: [
        { id: 'ag-2-1-1', title: 'Welcome: The Age of AI Agents', type: 'welcome', duration: 6, description: 'What agents are and why they matter' },
        { id: 'ag-2-1-2', title: 'Agent Design Patterns', type: 'concept', duration: 7, description: 'ReAct, planning, and tool use patterns' },
        { id: 'ag-2-1-3', title: 'Anatomy of an AI Agent', type: 'concept', duration: 7, description: 'Memory, tools, and reasoning loops' },
        { id: 'ag-2-1-4', title: 'When to Use Agents vs Simple AI', type: 'concept', duration: 6, description: 'Decision framework for agent use' },
      ],
      quiz: { title: 'Agent Fundamentals', questions: 10, pass_score: 70, time_limit: 15 },
    },
    {
      id: 'mod-2-2',
      title: 'Claude Agent SDK',
      description: 'Building agents with the official SDK',
      order: 2,
      lessons: [
        { id: 'ag-2-2-1', title: 'Agent SDK Setup & Configuration', type: 'practical', duration: 7, description: 'Installation and project structure' },
        { id: 'ag-2-2-2', title: 'Defining Agent Tools', type: 'practical', duration: 7, description: 'Tool schemas and implementations' },
        { id: 'ag-2-2-3', title: 'Agent Execution & Control Flow', type: 'practical', duration: 6, description: 'Loops, decisions, and state' },
        { id: 'ag-2-2-4', title: 'Multi-Step Task Orchestration', type: 'advanced', duration: 7, description: 'Complex workflow handling' },
        { id: 'ag-2-2-5', title: 'Error Handling & Recovery', type: 'practical', duration: 6, description: 'Graceful failures and retries' },
      ],
      quiz: { title: 'Agent SDK Mastery', questions: 12, pass_score: 70, time_limit: 18 },
      assignment: { title: 'Multi-Tool Agent', description: 'Build an agent with 5+ custom tools that can complete complex tasks', points: 100 },
    },
    {
      id: 'mod-2-3',
      title: 'Advanced Agent Patterns',
      description: 'Production-ready agent development',
      order: 3,
      lessons: [
        { id: 'ag-2-3-1', title: 'Memory Systems for Agents', type: 'advanced', duration: 7, description: 'Short/long-term memory and vector stores' },
        { id: 'ag-2-3-2', title: 'Multi-Agent Collaboration', type: 'advanced', duration: 7, description: 'Swarms, delegation, and coordination' },
        { id: 'ag-2-3-3', title: 'Human-in-the-Loop Agents', type: 'practical', duration: 6, description: 'Approval flows and oversight' },
        { id: 'ag-2-3-4', title: 'Agent Observability & Debugging', type: 'practical', duration: 6, description: 'Logging, tracing, and monitoring' },
        { id: 'ag-2-3-5', title: 'Production-Ready Agents', type: 'advanced', duration: 7, description: 'Deployment, scaling, and security' },
      ],
      quiz: { title: 'Advanced Agents', questions: 10, pass_score: 70, time_limit: 15 },
    },
  ],
  final_test: { title: 'AI Agent Development Certification', questions: 30, pass_score: 75, time_limit: 50 },
  project: {
    title: 'Production-Ready AI Agent',
    description: 'Build an autonomous agent for a real business task with memory, multi-tool support, and human approval for critical actions.',
    points: 100,
    rubric: { 'Agent Functionality': 30, 'Tool Design': 20, 'Memory Implementation': 20, 'Human-in-the-Loop': 15, 'Documentation': 15 },
  },
}

// Course 3: MCP Development
const COURSE_3_MCP: Course = {
  id: 'mcp-development',
  title: 'MCP Development',
  slug: 'mcp-development',
  instructor_id: 'marcus-williams',
  description: 'Build Model Context Protocol servers to extend AI capabilities with custom integrations. Connect AI to any system, database, or API.',
  level: 'intermediate',
  duration_minutes: 78,
  modules: [
    {
      id: 'mod-3-1',
      title: 'MCP Fundamentals',
      description: 'Understanding the Model Context Protocol',
      order: 1,
      lessons: [
        { id: 'mcp-3-1-1', title: 'Welcome: Model Context Protocol', type: 'welcome', duration: 6, description: 'What MCP is and why it matters' },
        { id: 'mcp-3-1-2', title: 'MCP Architecture & Concepts', type: 'concept', duration: 7, description: 'Servers, resources, tools, and prompts' },
        { id: 'mcp-3-1-3', title: 'MCP vs Traditional APIs', type: 'concept', duration: 6, description: 'Benefits, use cases, and tradeoffs' },
        { id: 'mcp-3-1-4', title: 'Setting Up Your MCP Environment', type: 'practical', duration: 7, description: 'SDK, config, and Claude Desktop' },
      ],
      quiz: { title: 'MCP Fundamentals', questions: 10, pass_score: 70, time_limit: 15 },
    },
    {
      id: 'mod-3-2',
      title: 'Building MCP Servers',
      description: 'Create your first MCP server',
      order: 2,
      lessons: [
        { id: 'mcp-3-2-1', title: 'Your First MCP Server', type: 'practical', duration: 7, description: 'Basic server structure' },
        { id: 'mcp-3-2-2', title: 'Implementing Resources', type: 'practical', duration: 6, description: 'Data exposure and URIs' },
        { id: 'mcp-3-2-3', title: 'Building MCP Tools', type: 'practical', duration: 7, description: 'Actions, parameters, and responses' },
        { id: 'mcp-3-2-4', title: 'Adding Prompts & Templates', type: 'practical', duration: 6, description: 'Reusable prompt patterns' },
      ],
      quiz: { title: 'MCP Server Development', questions: 12, pass_score: 70, time_limit: 18 },
      assignment: { title: 'Basic MCP Server', description: 'Build an MCP server with 3 tools and 2 resources', points: 100 },
    },
    {
      id: 'mod-3-3',
      title: 'Advanced MCP Patterns',
      description: 'Enterprise-grade MCP development',
      order: 3,
      lessons: [
        { id: 'mcp-3-3-1', title: 'Database Integration MCPs', type: 'advanced', duration: 7, description: 'Supabase, PostgreSQL, MongoDB' },
        { id: 'mcp-3-3-2', title: 'External Service MCPs', type: 'advanced', duration: 7, description: 'GitHub, Slack, external APIs' },
        { id: 'mcp-3-3-3', title: 'MCP Security & Permissions', type: 'advanced', duration: 6, description: 'Auth, scopes, and sandboxing' },
        { id: 'mcp-3-3-4', title: 'Deploying & Distributing MCPs', type: 'practical', duration: 6, description: 'Packaging and publishing' },
      ],
      quiz: { title: 'Advanced MCP', questions: 10, pass_score: 70, time_limit: 15 },
    },
  ],
  final_test: { title: 'MCP Developer Certification', questions: 25, pass_score: 75, time_limit: 45 },
  project: {
    title: 'Enterprise MCP Server',
    description: 'Build an MCP server that connects to a real business system with full CRUD operations and proper error handling.',
    points: 100,
    rubric: { 'Functionality': 30, 'Integration Quality': 25, 'Security': 20, 'Documentation': 15, 'Code Quality': 10 },
  },
}

// Course 4: AI Workflow Architecture
const COURSE_4_WORKFLOWS: Course = {
  id: 'ai-workflows',
  title: 'AI Workflow Architecture',
  slug: 'ai-workflows',
  instructor_id: 'elena-rodriguez',
  description: 'Design and build intelligent automation workflows using n8n and AI integration. Create systems that can make decisions and process complex tasks automatically.',
  level: 'intermediate',
  duration_minutes: 91,
  modules: [
    {
      id: 'mod-4-1',
      title: 'Workflow Foundations',
      description: 'Understanding automation architecture',
      order: 1,
      lessons: [
        { id: 'wf-4-1-1', title: 'Welcome: AI-Powered Automation', type: 'welcome', duration: 6, description: 'Vision for intelligent workflows' },
        { id: 'wf-4-1-2', title: 'Process Mapping for AI', type: 'concept', duration: 7, description: 'Identifying automation opportunities' },
        { id: 'wf-4-1-3', title: 'The AI Automation Stack', type: 'concept', duration: 7, description: 'Tools, platforms, and architecture' },
      ],
      quiz: { title: 'Workflow Basics', questions: 8, pass_score: 70, time_limit: 12 },
    },
    {
      id: 'mod-4-2',
      title: 'n8n AI Workflows',
      description: 'Building AI-powered automations',
      order: 2,
      lessons: [
        { id: 'wf-4-2-1', title: 'n8n Setup & Fundamentals', type: 'practical', duration: 7, description: 'Installation, interface, and concepts' },
        { id: 'wf-4-2-2', title: 'AI Nodes: LLM Integration', type: 'practical', duration: 7, description: 'Claude, GPT, and embeddings' },
        { id: 'wf-4-2-3', title: 'Building Intelligent Workflows', type: 'practical', duration: 6, description: 'Decisions, loops, and branches' },
        { id: 'wf-4-2-4', title: 'Triggers & Webhooks', type: 'practical', duration: 6, description: 'Event-driven automation' },
      ],
      quiz: { title: 'n8n AI Workflows', questions: 10, pass_score: 70, time_limit: 15 },
      assignment: { title: 'AI Workflow Set', description: 'Build 3 AI-powered workflows with triggers and error handling', points: 100 },
    },
    {
      id: 'mod-4-3',
      title: 'Advanced Automation Patterns',
      description: 'Complex workflow architectures',
      order: 3,
      lessons: [
        { id: 'wf-4-3-1', title: 'Document Processing Pipelines', type: 'advanced', duration: 7, description: 'Extraction, analysis, and generation' },
        { id: 'wf-4-3-2', title: 'Multi-System Orchestration', type: 'advanced', duration: 7, description: 'Connecting business systems' },
        { id: 'wf-4-3-3', title: 'AI Decision Engines', type: 'advanced', duration: 6, description: 'Classification, routing, and scoring' },
        { id: 'wf-4-3-4', title: 'Error Handling & Monitoring', type: 'practical', duration: 6, description: 'Alerts, recovery, and logging' },
      ],
      quiz: { title: 'Advanced Automation', questions: 10, pass_score: 70, time_limit: 15 },
    },
    {
      id: 'mod-4-4',
      title: 'Production Workflows',
      description: 'Scaling and maintaining automations',
      order: 4,
      lessons: [
        { id: 'wf-4-4-1', title: 'Scaling AI Workflows', type: 'advanced', duration: 7, description: 'Performance, queues, and workers' },
        { id: 'wf-4-4-2', title: 'Security & Compliance', type: 'concept', duration: 6, description: 'Data handling and audit trails' },
        { id: 'wf-4-4-3', title: 'Workflow Governance', type: 'concept', duration: 6, description: 'Documentation and versioning' },
      ],
      quiz: { title: 'Production Workflows', questions: 8, pass_score: 70, time_limit: 12 },
    },
  ],
  final_test: { title: 'AI Workflow Architect Certification', questions: 30, pass_score: 75, time_limit: 50 },
  project: {
    title: 'Enterprise Automation System',
    description: 'Build an end-to-end business process automation with AI decision-making and monitoring.',
    points: 100,
    rubric: { 'Workflow Design': 25, 'AI Integration': 25, 'Error Handling': 20, 'Monitoring': 15, 'Documentation': 15 },
  },
}

// Course 5: Training Teams on AI
const COURSE_5_TRAINING: Course = {
  id: 'ai-training',
  title: 'Training Teams on AI',
  slug: 'ai-training',
  instructor_id: 'aisha-kumar',
  description: 'Design and deliver effective AI training programs for your organization. Build AI-ready teams through structured learning and change management.',
  level: 'intermediate',
  duration_minutes: 78,
  modules: [
    {
      id: 'mod-5-1',
      title: 'AI Readiness Assessment',
      description: 'Evaluating organizational AI maturity',
      order: 1,
      lessons: [
        { id: 'tr-5-1-1', title: 'Welcome: Building an AI-Ready Organization', type: 'welcome', duration: 6, description: 'Vision, outcomes, and approach' },
        { id: 'tr-5-1-2', title: 'Assessing Team AI Readiness', type: 'concept', duration: 7, description: 'Skills gaps, attitudes, and blockers' },
        { id: 'tr-5-1-3', title: 'Creating Your AI Training Roadmap', type: 'practical', duration: 7, description: 'Phased learning paths' },
      ],
      quiz: { title: 'AI Readiness', questions: 8, pass_score: 70, time_limit: 12 },
    },
    {
      id: 'mod-5-2',
      title: 'AI Training Programs',
      description: 'Designing effective learning experiences',
      order: 2,
      lessons: [
        { id: 'tr-5-2-1', title: 'Designing Role-Based AI Training', type: 'concept', duration: 7, description: 'Different needs by function' },
        { id: 'tr-5-2-2', title: 'Hands-On Learning Approaches', type: 'practical', duration: 6, description: 'Labs, projects, and sandboxes' },
        { id: 'tr-5-2-3', title: 'Building Internal AI Champions', type: 'practical', duration: 7, description: 'Power users and mentors' },
        { id: 'tr-5-2-4', title: 'Measuring Training Effectiveness', type: 'practical', duration: 6, description: 'Metrics and assessments' },
      ],
      quiz: { title: 'Training Design', questions: 10, pass_score: 70, time_limit: 15 },
      assignment: { title: 'AI Training Program Design', description: 'Design a complete AI training program for your team', points: 100 },
    },
    {
      id: 'mod-5-3',
      title: 'Change Management for AI',
      description: 'Overcoming adoption challenges',
      order: 3,
      lessons: [
        { id: 'tr-5-3-1', title: 'Overcoming AI Resistance', type: 'concept', duration: 7, description: 'Fear, skepticism, and adoption' },
        { id: 'tr-5-3-2', title: 'AI Ethics & Responsible Use', type: 'concept', duration: 6, description: 'Guidelines, policies, and culture' },
        { id: 'tr-5-3-3', title: 'Sustaining AI Adoption', type: 'practical', duration: 6, description: 'Reinforcement and evolution' },
      ],
      quiz: { title: 'Change Management', questions: 8, pass_score: 70, time_limit: 12 },
    },
    {
      id: 'mod-5-4',
      title: 'Knowledge Management',
      description: 'Building lasting AI capabilities',
      order: 4,
      lessons: [
        { id: 'tr-5-4-1', title: 'Building AI Knowledge Bases', type: 'practical', duration: 7, description: 'Documentation and playbooks' },
        { id: 'tr-5-4-2', title: 'Continuous Learning Culture', type: 'concept', duration: 6, description: 'Updates, sharing, and growth' },
      ],
      quiz: { title: 'Knowledge Management', questions: 6, pass_score: 70, time_limit: 10 },
    },
  ],
  final_test: { title: 'AI Training Specialist Certification', questions: 25, pass_score: 75, time_limit: 45 },
  project: {
    title: 'Team AI Training Program',
    description: 'Create a complete training curriculum, assessment framework, and change management plan.',
    points: 100,
    rubric: { 'Curriculum Design': 30, 'Assessment Framework': 25, 'Change Management': 25, 'Documentation': 20 },
  },
}

// Course 6: Enterprise AI Implementation
const COURSE_6_ENTERPRISE: Course = {
  id: 'enterprise-ai',
  title: 'Enterprise AI Implementation',
  slug: 'enterprise-ai',
  instructor_id: 'marcus-williams',
  description: 'Lead AI transformation at the organizational level with strategy, governance, and scaling. Build the infrastructure and policies for successful enterprise AI.',
  level: 'advanced',
  duration_minutes: 91,
  modules: [
    {
      id: 'mod-6-1',
      title: 'AI Strategy',
      description: 'Developing enterprise AI vision',
      order: 1,
      lessons: [
        { id: 'ent-6-1-1', title: 'Welcome: Enterprise AI Vision', type: 'welcome', duration: 6, description: 'Strategic AI transformation' },
        { id: 'ent-6-1-2', title: 'AI Opportunity Assessment', type: 'concept', duration: 7, description: 'Identifying high-value use cases' },
        { id: 'ent-6-1-3', title: 'Building the Business Case', type: 'practical', duration: 7, description: 'ROI, costs, and benefits' },
        { id: 'ent-6-1-4', title: 'AI Roadmap Development', type: 'practical', duration: 6, description: 'Phases, milestones, and dependencies' },
      ],
      quiz: { title: 'AI Strategy', questions: 10, pass_score: 70, time_limit: 15 },
    },
    {
      id: 'mod-6-2',
      title: 'AI Infrastructure',
      description: 'Building the technical foundation',
      order: 2,
      lessons: [
        { id: 'ent-6-2-1', title: 'Choosing AI Platforms & Tools', type: 'concept', duration: 7, description: 'Build vs buy, vendor selection' },
        { id: 'ent-6-2-2', title: 'Data Infrastructure for AI', type: 'concept', duration: 7, description: 'Storage, pipelines, and quality' },
        { id: 'ent-6-2-3', title: 'Security & Compliance', type: 'concept', duration: 6, description: 'Data protection and regulations' },
        { id: 'ent-6-2-4', title: 'Integration Architecture', type: 'practical', duration: 6, description: 'APIs, MCPs, and workflows' },
      ],
      quiz: { title: 'AI Infrastructure', questions: 12, pass_score: 70, time_limit: 18 },
      assignment: { title: 'AI Infrastructure Design', description: 'Design AI infrastructure for your organization', points: 100 },
    },
    {
      id: 'mod-6-3',
      title: 'AI Governance',
      description: 'Policies, risk, and compliance',
      order: 3,
      lessons: [
        { id: 'ent-6-3-1', title: 'AI Policies & Guidelines', type: 'concept', duration: 7, description: 'Acceptable use and boundaries' },
        { id: 'ent-6-3-2', title: 'Risk Management for AI', type: 'concept', duration: 6, description: 'Identification and mitigation' },
        { id: 'ent-6-3-3', title: 'AI Audit & Compliance', type: 'practical', duration: 6, description: 'Monitoring and reporting' },
      ],
      quiz: { title: 'AI Governance', questions: 10, pass_score: 70, time_limit: 15 },
    },
    {
      id: 'mod-6-4',
      title: 'Scaling AI',
      description: 'From pilot to enterprise-wide',
      order: 4,
      lessons: [
        { id: 'ent-6-4-1', title: 'From Pilot to Production', type: 'practical', duration: 7, description: 'Scaling successful AI projects' },
        { id: 'ent-6-4-2', title: 'Measuring AI Impact', type: 'practical', duration: 6, description: 'KPIs and value tracking' },
        { id: 'ent-6-4-3', title: 'Future-Proofing Your AI Strategy', type: 'concept', duration: 6, description: 'Evolution and emerging tech' },
      ],
      quiz: { title: 'Scaling AI', questions: 8, pass_score: 70, time_limit: 12 },
    },
  ],
  final_test: { title: 'Enterprise AI Leader Certification', questions: 30, pass_score: 75, time_limit: 50 },
  project: {
    title: 'AI Implementation Plan',
    description: 'Create a complete enterprise AI strategy with infrastructure recommendations, governance framework, and 12-month roadmap.',
    points: 100,
    rubric: { 'Strategy': 25, 'Infrastructure': 25, 'Governance': 25, 'Roadmap': 15, 'Presentation': 10 },
  },
}

// All courses
const ALL_COURSES: Course[] = [
  COURSE_1_AI_FOUNDATIONS,
  COURSE_2_AI_AGENTS,
  COURSE_3_MCP,
  COURSE_4_WORKFLOWS,
  COURSE_5_TRAINING,
  COURSE_6_ENTERPRISE,
]

// ============================================================================
// DATABASE OPERATIONS
// ============================================================================

// Use existing admin user as instructor (Supabase Auth constraint)
const DEFAULT_INSTRUCTOR_ID = '253847dc-c7df-4d00-b418-87468f6b6964'

async function getInstructorId(): Promise<string> {
  // First try to find an existing instructor
  const { data: instructor } = await supabase
    .from('users')
    .select('id')
    .eq('role', 'instructor')
    .limit(1)
    .single()

  if (instructor) {
    console.log('  ✓ Using existing instructor')
    return instructor.id
  }

  // Fall back to admin user
  const { data: admin } = await supabase
    .from('users')
    .select('id')
    .eq('role', 'admin')
    .limit(1)
    .single()

  if (admin) {
    console.log('  ✓ Using admin as instructor')
    return admin.id
  }

  // Last resort - use the known admin ID
  console.log('  ✓ Using default instructor ID')
  return DEFAULT_INSTRUCTOR_ID
}

async function seedCourse(course: Course, instructorId: string) {
  console.log(`\n📖 Seeding course: ${course.title}`)

  // Check if course exists
  const { data: existingCourse } = await supabase
    .from('courses')
    .select('id')
    .eq('slug', course.slug)
    .single()

  let courseId: string

  if (existingCourse) {
    courseId = existingCourse.id
    console.log(`  ✓ Course exists (ID: ${courseId})`)
  } else {
    // Calculate totals
    const totalLessons = course.modules.reduce((sum, m) => sum + m.lessons.length, 0)
    const totalDuration = course.modules.reduce((sum, m) =>
      sum + m.lessons.reduce((lsum, l) => lsum + l.duration, 0), 0)

    const { data: newCourse, error: courseError } = await supabase
      .from('courses')
      .insert({
        title: course.title,
        slug: course.slug,
        description: course.description,
        instructor_id: instructorId,
        level: course.level,
        total_lessons: totalLessons,
        total_duration_minutes: totalDuration,
        status: 'published',
        price: 0, // Free courses
        thumbnail_url: `/images/courses/${course.slug}.jpg`,
      })
      .select()
      .single()

    if (courseError) {
      console.log(`  ❌ Failed to create course: ${courseError.message}`)
      return
    }

    courseId = newCourse.id
    console.log(`  ✅ Created course (ID: ${courseId})`)
  }

  // Seed modules and lessons
  for (const module of course.modules) {
    await seedModule(courseId, module)
  }

  // Seed final test
  await seedFinalTest(courseId, course.final_test, course.title)

  // Seed project
  await seedProject(courseId, course.project)
}

async function seedModule(courseId: string, module: Module) {
  // Check if module exists
  const { data: existingModule } = await supabase
    .from('modules')
    .select('id')
    .eq('course_id', courseId)
    .eq('title', module.title)
    .single()

  let moduleId: string

  if (existingModule) {
    moduleId = existingModule.id
    console.log(`    ✓ Module exists: ${module.title}`)
  } else {
    const { data: newModule, error: moduleError } = await supabase
      .from('modules')
      .insert({
        course_id: courseId,
        title: module.title,
        description: module.description,
        display_order: module.order,
      })
      .select()
      .single()

    if (moduleError) {
      console.log(`    ❌ Failed to create module: ${moduleError.message}`)
      return
    }

    moduleId = newModule.id
    console.log(`    ✅ Created module: ${module.title}`)
  }

  // Seed lessons
  for (let i = 0; i < module.lessons.length; i++) {
    await seedLesson(courseId, moduleId, module.lessons[i], i + 1)
  }

  // Seed quiz if exists
  if (module.quiz) {
    await seedQuiz(courseId, moduleId, module.quiz)
  }

  // Seed assignment if exists
  if (module.assignment) {
    await seedAssignment(courseId, moduleId, module.assignment)
  }
}

async function seedLesson(courseId: string, moduleId: string, lesson: Lesson, order: number) {
  const { data: existingLesson } = await supabase
    .from('lessons')
    .select('id')
    .eq('module_id', moduleId)
    .eq('title', lesson.title)
    .single()

  if (existingLesson) {
    return // Lesson already exists
  }

  const { error: lessonError } = await supabase
    .from('lessons')
    .insert({
      module_id: moduleId,
      course_id: courseId,
      title: lesson.title,
      description: lesson.description || '',
      content_type: 'video',
      display_order: order,
      video_duration_seconds: lesson.duration * 60,
    })

  if (lessonError) {
    console.log(`      ❌ Failed to create lesson: ${lessonError.message}`)
  }
}

async function seedQuiz(courseId: string, moduleId: string, quiz: Quiz) {
  const { data: existingQuiz } = await supabase
    .from('quizzes')
    .select('id')
    .eq('module_id', moduleId)
    .eq('title', quiz.title)
    .single()

  if (existingQuiz) {
    return // Quiz already exists
  }

  const { error: quizError } = await supabase
    .from('quizzes')
    .insert({
      module_id: moduleId,
      course_id: courseId,
      title: quiz.title,
      passing_score: quiz.pass_score,
      time_limit_minutes: quiz.time_limit,
    })

  if (quizError) {
    console.log(`      ⚠️  Quiz error: ${quizError.message}`)
  }
}

async function seedAssignment(courseId: string, moduleId: string, assignment: Assignment) {
  // Get first lesson in module for assignment
  const { data: lesson } = await supabase
    .from('lessons')
    .select('id')
    .eq('module_id', moduleId)
    .order('display_order', { ascending: false })
    .limit(1)
    .single()

  if (!lesson) return

  const { data: existingAssignment } = await supabase
    .from('assignments')
    .select('id')
    .eq('lesson_id', lesson.id)
    .eq('title', assignment.title)
    .single()

  if (existingAssignment) {
    return // Assignment already exists
  }

  const { error: assignmentError } = await supabase
    .from('assignments')
    .insert({
      lesson_id: lesson.id,
      course_id: courseId,
      title: assignment.title,
      description: assignment.description,
      instructions: `Complete the following assignment:\n\n${assignment.description}\n\nSubmit your work as a file or URL when complete.`,
      max_score: assignment.points,
      due_days_after_enrollment: 7,
    })

  if (assignmentError) {
    console.log(`      ⚠️  Assignment error: ${assignmentError.message}`)
  }
}

async function seedFinalTest(courseId: string, test: FinalTest, courseTitle: string) {
  // Create a special module for the final test
  const { data: existingModule } = await supabase
    .from('modules')
    .select('id')
    .eq('course_id', courseId)
    .eq('title', 'Final Certification')
    .single()

  if (existingModule) {
    return // Already seeded
  }

  const { data: testModule, error: moduleError } = await supabase
    .from('modules')
    .insert({
      course_id: courseId,
      title: 'Final Certification',
      description: `Complete your ${courseTitle} certification`,
      display_order: 99,
    })
    .select()
    .single()

  if (!testModule) return

  const { error: quizError } = await supabase
    .from('quizzes')
    .insert({
      module_id: testModule.id,
      course_id: courseId,
      title: test.title,
      passing_score: test.pass_score,
      time_limit_minutes: test.time_limit,
    })

  if (quizError) {
    console.log(`    ⚠️  Final test error: ${quizError.message}`)
  }
}

async function seedProject(courseId: string, project: Project) {
  // Create a special module for the capstone project
  const { data: existingModule } = await supabase
    .from('modules')
    .select('id')
    .eq('course_id', courseId)
    .eq('title', 'Capstone Project')
    .single()

  if (existingModule) {
    return // Already seeded
  }

  const { data: projectModule, error: moduleError } = await supabase
    .from('modules')
    .insert({
      course_id: courseId,
      title: 'Capstone Project',
      description: project.description,
      display_order: 100,
    })
    .select()
    .single()

  if (!projectModule) return

  // Create a lesson for the project
  const { data: projectLesson } = await supabase
    .from('lessons')
    .insert({
      module_id: projectModule.id,
      course_id: courseId,
      title: project.title,
      description: project.description,
      content_type: 'article',
      display_order: 1,
    })
    .select()
    .single()

  if (!projectLesson) return

  // Create assignment for the project
  const { error: assignmentError } = await supabase
    .from('assignments')
    .insert({
      lesson_id: projectLesson.id,
      course_id: courseId,
      title: project.title,
      description: project.description,
      max_score: project.points,
      rubric: project.rubric,
      due_days_after_enrollment: 30,
    })

  if (assignmentError) {
    console.log(`    ⚠️  Project error: ${assignmentError.message}`)
  }
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================

async function main() {
  console.log('\n' + '═'.repeat(60))
  console.log('🎓 PHAZUR LABS ACADEMY - AI Implementation Curriculum Seeder')
  console.log('═'.repeat(60))

  // Calculate totals
  const totalLessons = ALL_COURSES.reduce((sum, c) =>
    sum + c.modules.reduce((msum, m) => msum + m.lessons.length, 0), 0)
  const totalModules = ALL_COURSES.reduce((sum, c) => sum + c.modules.length, 0)

  console.log(`\n📊 Curriculum Summary:`)
  console.log(`   Courses: ${ALL_COURSES.length}`)
  console.log(`   Modules: ${totalModules}`)
  console.log(`   Lessons: ${totalLessons}`)

  // Get instructor ID to use for all courses
  console.log('\n📚 Finding instructor...')
  const instructorId = await getInstructorId()
  console.log(`   Using instructor ID: ${instructorId}`)

  // Seed each course
  for (const course of ALL_COURSES) {
    await seedCourse(course, instructorId)
  }

  console.log('\n' + '═'.repeat(60))
  console.log('✅ SEEDING COMPLETE')
  console.log('═'.repeat(60) + '\n')
}

main().catch(console.error)
