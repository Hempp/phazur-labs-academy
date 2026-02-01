"""
Phazur Labs Academy - AI Implementation Courses
Complete course data for video generation and database seeding
"""

from dataclasses import dataclass
from typing import List, Dict

# ============================================================================
# INSTRUCTOR DEFINITIONS
# ============================================================================

INSTRUCTORS = {
    'james-park': {
        'id': 'james-park',
        'name': 'Dr. James Park',
        'specialty': 'AI Fundamentals, Data Science',
        'style': 'Academic, thorough, patient',
        'appearance': 'Professional Asian male, academic presence, research lab setting, smart casual with glasses',
        'voice': 'en-US-Neural2-A',
    },
    'sarah-chen': {
        'id': 'sarah-chen',
        'name': 'Dr. Sarah Chen',
        'specialty': 'AI Agents, Technical Development',
        'style': 'Innovative, technical, enthusiastic',
        'appearance': 'Professional Asian female, warm smile, modern tech office, smart casual attire',
        'voice': 'en-US-Neural2-F',
    },
    'marcus-williams': {
        'id': 'marcus-williams',
        'name': 'Marcus Williams',
        'specialty': 'MCP Development, Enterprise AI',
        'style': 'Authoritative, systematic, strategic',
        'appearance': 'Professional African American male, confident demeanor, modern office with code screens, business casual',
        'voice': 'en-US-Neural2-D',
    },
    'elena-rodriguez': {
        'id': 'elena-rodriguez',
        'name': 'Elena Rodriguez',
        'specialty': 'Workflow Automation, DevOps',
        'style': 'Hands-on, practical, solution-focused',
        'appearance': 'Professional Latina female, energetic presence, tech startup environment, modern attire',
        'voice': 'en-US-Neural2-G',
    },
    'aisha-kumar': {
        'id': 'aisha-kumar',
        'name': 'Aisha Kumar',
        'specialty': 'AI Training, Change Management',
        'style': 'Warm, creative, people-focused',
        'appearance': 'Professional South Asian female, approachable, design studio environment, creative attire',
        'voice': 'en-US-Neural2-C',
    },
}

# ============================================================================
# COURSE 1: AI FOUNDATIONS & TOOL MASTERY
# ============================================================================

COURSE_1_AI_FOUNDATIONS = {
    'id': 'ai-foundations',
    'title': 'AI Foundations & Tool Mastery',
    'slug': 'ai-foundations',
    'instructor_id': 'james-park',
    'description': 'Master the core skills of AI: understanding LLMs, prompt engineering, and API integration.',
    'level': 'beginner',
    'duration_minutes': 91,
    'modules': [
        {
            'id': 'mod-1-1',
            'title': 'Understanding Modern AI',
            'description': 'Core concepts of LLMs and the AI ecosystem',
            'order': 1,
            'lessons': [
                {'id': 'ai-1-1-1', 'title': 'Welcome: Becoming an AI Builder', 'type': 'welcome', 'duration': 6},
                {'id': 'ai-1-1-2', 'title': 'LLMs Explained: How AI Actually Works', 'type': 'concept', 'duration': 7},
                {'id': 'ai-1-1-3', 'title': 'The AI Tool Landscape', 'type': 'concept', 'duration': 7},
                {'id': 'ai-1-1-4', 'title': 'APIs vs Apps: When to Use What', 'type': 'concept', 'duration': 6},
            ],
            'quiz': {
                'title': 'AI Fundamentals Check',
                'questions': 10,
                'pass_score': 70,
                'time_limit': 15,
            },
        },
        {
            'id': 'mod-1-2',
            'title': 'Prompt Engineering Mastery',
            'description': 'Advanced techniques for getting the best results from AI',
            'order': 2,
            'lessons': [
                {'id': 'ai-1-2-1', 'title': 'Prompt Engineering Fundamentals', 'type': 'concept', 'duration': 7},
                {'id': 'ai-1-2-2', 'title': 'System Prompts & Personas', 'type': 'practical', 'duration': 6},
                {'id': 'ai-1-2-3', 'title': 'Chain-of-Thought & Reasoning', 'type': 'advanced', 'duration': 7},
                {'id': 'ai-1-2-4', 'title': 'Few-Shot & In-Context Learning', 'type': 'advanced', 'duration': 6},
                {'id': 'ai-1-2-5', 'title': 'Building Reusable Prompt Templates', 'type': 'practical', 'duration': 7},
            ],
            'quiz': {
                'title': 'Prompt Engineering Mastery',
                'questions': 12,
                'pass_score': 70,
                'time_limit': 18,
            },
            'assignment': {
                'title': 'Build Your Prompt Library',
                'description': 'Create 15 reusable prompt templates for your industry',
                'points': 100,
            },
        },
        {
            'id': 'mod-1-3',
            'title': 'Working with AI APIs',
            'description': 'Integrate AI into applications using APIs',
            'order': 3,
            'lessons': [
                {'id': 'ai-1-3-1', 'title': 'API Basics: Authentication & Requests', 'type': 'practical', 'duration': 7},
                {'id': 'ai-1-3-2', 'title': 'Claude API Deep Dive', 'type': 'practical', 'duration': 7},
                {'id': 'ai-1-3-3', 'title': 'Handling Responses & Errors', 'type': 'practical', 'duration': 6},
                {'id': 'ai-1-3-4', 'title': 'Cost Optimization & Token Management', 'type': 'advanced', 'duration': 6},
                {'id': 'ai-1-3-5', 'title': 'Building Your First AI Integration', 'type': 'practical', 'duration': 7},
            ],
            'quiz': {
                'title': 'API Integration',
                'questions': 10,
                'pass_score': 70,
                'time_limit': 15,
            },
        },
    ],
    'final_test': {
        'title': 'AI Foundations Certification Exam',
        'questions': 25,
        'pass_score': 75,
        'time_limit': 45,
    },
    'project': {
        'title': 'AI-Powered Tool',
        'description': 'Build a working AI tool that integrates with Claude or GPT API, handles errors gracefully, and includes cost tracking.',
        'points': 100,
        'rubric': {
            'Functionality': 30,
            'API Integration': 25,
            'Error Handling': 20,
            'Documentation': 15,
            'Code Quality': 10,
        },
    },
}

# ============================================================================
# COURSE 2: BUILDING AI AGENTS
# ============================================================================

COURSE_2_AI_AGENTS = {
    'id': 'ai-agents',
    'title': 'Building AI Agents',
    'slug': 'ai-agents',
    'instructor_id': 'sarah-chen',
    'description': 'Design and build autonomous AI agents using Claude Agent SDK and advanced patterns.',
    'level': 'intermediate',
    'duration_minutes': 91,
    'modules': [
        {
            'id': 'mod-2-1',
            'title': 'Agent Architecture',
            'description': 'Understanding AI agent design and patterns',
            'order': 1,
            'lessons': [
                {'id': 'ag-2-1-1', 'title': 'Welcome: The Age of AI Agents', 'type': 'welcome', 'duration': 6},
                {'id': 'ag-2-1-2', 'title': 'Agent Design Patterns', 'type': 'concept', 'duration': 7},
                {'id': 'ag-2-1-3', 'title': 'Anatomy of an AI Agent', 'type': 'concept', 'duration': 7},
                {'id': 'ag-2-1-4', 'title': 'When to Use Agents vs Simple AI', 'type': 'concept', 'duration': 6},
            ],
            'quiz': {
                'title': 'Agent Fundamentals',
                'questions': 10,
                'pass_score': 70,
                'time_limit': 15,
            },
        },
        {
            'id': 'mod-2-2',
            'title': 'Claude Agent SDK',
            'description': 'Building agents with the official SDK',
            'order': 2,
            'lessons': [
                {'id': 'ag-2-2-1', 'title': 'Agent SDK Setup & Configuration', 'type': 'practical', 'duration': 7},
                {'id': 'ag-2-2-2', 'title': 'Defining Agent Tools', 'type': 'practical', 'duration': 7},
                {'id': 'ag-2-2-3', 'title': 'Agent Execution & Control Flow', 'type': 'practical', 'duration': 6},
                {'id': 'ag-2-2-4', 'title': 'Multi-Step Task Orchestration', 'type': 'advanced', 'duration': 7},
                {'id': 'ag-2-2-5', 'title': 'Error Handling & Recovery', 'type': 'practical', 'duration': 6},
            ],
            'quiz': {
                'title': 'Agent SDK Mastery',
                'questions': 12,
                'pass_score': 70,
                'time_limit': 18,
            },
            'assignment': {
                'title': 'Multi-Tool Agent',
                'description': 'Build an agent with 5+ custom tools that can complete complex tasks',
                'points': 100,
            },
        },
        {
            'id': 'mod-2-3',
            'title': 'Advanced Agent Patterns',
            'description': 'Production-ready agent development',
            'order': 3,
            'lessons': [
                {'id': 'ag-2-3-1', 'title': 'Memory Systems for Agents', 'type': 'advanced', 'duration': 7},
                {'id': 'ag-2-3-2', 'title': 'Multi-Agent Collaboration', 'type': 'advanced', 'duration': 7},
                {'id': 'ag-2-3-3', 'title': 'Human-in-the-Loop Agents', 'type': 'practical', 'duration': 6},
                {'id': 'ag-2-3-4', 'title': 'Agent Observability & Debugging', 'type': 'practical', 'duration': 6},
                {'id': 'ag-2-3-5', 'title': 'Production-Ready Agents', 'type': 'advanced', 'duration': 7},
            ],
            'quiz': {
                'title': 'Advanced Agents',
                'questions': 10,
                'pass_score': 70,
                'time_limit': 15,
            },
        },
    ],
    'final_test': {
        'title': 'AI Agent Development Certification',
        'questions': 30,
        'pass_score': 75,
        'time_limit': 50,
    },
    'project': {
        'title': 'Production-Ready AI Agent',
        'description': 'Build an autonomous agent for a real business task with memory, multi-tool support, and human approval for critical actions.',
        'points': 100,
        'rubric': {
            'Agent Functionality': 30,
            'Tool Design': 20,
            'Memory Implementation': 20,
            'Human-in-the-Loop': 15,
            'Documentation': 15,
        },
    },
}

# ============================================================================
# COURSE 3: MCP DEVELOPMENT
# ============================================================================

COURSE_3_MCP = {
    'id': 'mcp-development',
    'title': 'MCP Development',
    'slug': 'mcp-development',
    'instructor_id': 'marcus-williams',
    'description': 'Build Model Context Protocol servers to extend AI capabilities with custom integrations.',
    'level': 'intermediate',
    'duration_minutes': 78,
    'modules': [
        {
            'id': 'mod-3-1',
            'title': 'MCP Fundamentals',
            'description': 'Understanding the Model Context Protocol',
            'order': 1,
            'lessons': [
                {'id': 'mcp-3-1-1', 'title': 'Welcome: Model Context Protocol', 'type': 'welcome', 'duration': 6},
                {'id': 'mcp-3-1-2', 'title': 'MCP Architecture & Concepts', 'type': 'concept', 'duration': 7},
                {'id': 'mcp-3-1-3', 'title': 'MCP vs Traditional APIs', 'type': 'concept', 'duration': 6},
                {'id': 'mcp-3-1-4', 'title': 'Setting Up Your MCP Environment', 'type': 'practical', 'duration': 7},
            ],
            'quiz': {
                'title': 'MCP Fundamentals',
                'questions': 10,
                'pass_score': 70,
                'time_limit': 15,
            },
        },
        {
            'id': 'mod-3-2',
            'title': 'Building MCP Servers',
            'description': 'Create your first MCP server',
            'order': 2,
            'lessons': [
                {'id': 'mcp-3-2-1', 'title': 'Your First MCP Server', 'type': 'practical', 'duration': 7},
                {'id': 'mcp-3-2-2', 'title': 'Implementing Resources', 'type': 'practical', 'duration': 6},
                {'id': 'mcp-3-2-3', 'title': 'Building MCP Tools', 'type': 'practical', 'duration': 7},
                {'id': 'mcp-3-2-4', 'title': 'Adding Prompts & Templates', 'type': 'practical', 'duration': 6},
            ],
            'quiz': {
                'title': 'MCP Server Development',
                'questions': 12,
                'pass_score': 70,
                'time_limit': 18,
            },
            'assignment': {
                'title': 'Basic MCP Server',
                'description': 'Build an MCP server with 3 tools and 2 resources',
                'points': 100,
            },
        },
        {
            'id': 'mod-3-3',
            'title': 'Advanced MCP Patterns',
            'description': 'Enterprise-grade MCP development',
            'order': 3,
            'lessons': [
                {'id': 'mcp-3-3-1', 'title': 'Database Integration MCPs', 'type': 'advanced', 'duration': 7},
                {'id': 'mcp-3-3-2', 'title': 'External Service MCPs', 'type': 'advanced', 'duration': 7},
                {'id': 'mcp-3-3-3', 'title': 'MCP Security & Permissions', 'type': 'advanced', 'duration': 6},
                {'id': 'mcp-3-3-4', 'title': 'Deploying & Distributing MCPs', 'type': 'practical', 'duration': 6},
            ],
            'quiz': {
                'title': 'Advanced MCP',
                'questions': 10,
                'pass_score': 70,
                'time_limit': 15,
            },
        },
    ],
    'final_test': {
        'title': 'MCP Developer Certification',
        'questions': 25,
        'pass_score': 75,
        'time_limit': 45,
    },
    'project': {
        'title': 'Enterprise MCP Server',
        'description': 'Build an MCP server that connects to a real business system with full CRUD operations and proper error handling.',
        'points': 100,
        'rubric': {
            'Functionality': 30,
            'Integration Quality': 25,
            'Security': 20,
            'Documentation': 15,
            'Code Quality': 10,
        },
    },
}

# ============================================================================
# COURSE 4: AI WORKFLOW ARCHITECTURE
# ============================================================================

COURSE_4_WORKFLOWS = {
    'id': 'ai-workflows',
    'title': 'AI Workflow Architecture',
    'slug': 'ai-workflows',
    'instructor_id': 'elena-rodriguez',
    'description': 'Design and build intelligent automation workflows using n8n and AI integration.',
    'level': 'intermediate',
    'duration_minutes': 91,
    'modules': [
        {
            'id': 'mod-4-1',
            'title': 'Workflow Foundations',
            'description': 'Understanding automation architecture',
            'order': 1,
            'lessons': [
                {'id': 'wf-4-1-1', 'title': 'Welcome: AI-Powered Automation', 'type': 'welcome', 'duration': 6},
                {'id': 'wf-4-1-2', 'title': 'Process Mapping for AI', 'type': 'concept', 'duration': 7},
                {'id': 'wf-4-1-3', 'title': 'The AI Automation Stack', 'type': 'concept', 'duration': 7},
            ],
            'quiz': {
                'title': 'Workflow Basics',
                'questions': 8,
                'pass_score': 70,
                'time_limit': 12,
            },
        },
        {
            'id': 'mod-4-2',
            'title': 'n8n AI Workflows',
            'description': 'Building AI-powered automations',
            'order': 2,
            'lessons': [
                {'id': 'wf-4-2-1', 'title': 'n8n Setup & Fundamentals', 'type': 'practical', 'duration': 7},
                {'id': 'wf-4-2-2', 'title': 'AI Nodes: LLM Integration', 'type': 'practical', 'duration': 7},
                {'id': 'wf-4-2-3', 'title': 'Building Intelligent Workflows', 'type': 'practical', 'duration': 6},
                {'id': 'wf-4-2-4', 'title': 'Triggers & Webhooks', 'type': 'practical', 'duration': 6},
            ],
            'quiz': {
                'title': 'n8n AI Workflows',
                'questions': 10,
                'pass_score': 70,
                'time_limit': 15,
            },
            'assignment': {
                'title': 'AI Workflow Set',
                'description': 'Build 3 AI-powered workflows with triggers and error handling',
                'points': 100,
            },
        },
        {
            'id': 'mod-4-3',
            'title': 'Advanced Automation Patterns',
            'description': 'Complex workflow architectures',
            'order': 3,
            'lessons': [
                {'id': 'wf-4-3-1', 'title': 'Document Processing Pipelines', 'type': 'advanced', 'duration': 7},
                {'id': 'wf-4-3-2', 'title': 'Multi-System Orchestration', 'type': 'advanced', 'duration': 7},
                {'id': 'wf-4-3-3', 'title': 'AI Decision Engines', 'type': 'advanced', 'duration': 6},
                {'id': 'wf-4-3-4', 'title': 'Error Handling & Monitoring', 'type': 'practical', 'duration': 6},
            ],
            'quiz': {
                'title': 'Advanced Automation',
                'questions': 10,
                'pass_score': 70,
                'time_limit': 15,
            },
        },
        {
            'id': 'mod-4-4',
            'title': 'Production Workflows',
            'description': 'Scaling and maintaining automations',
            'order': 4,
            'lessons': [
                {'id': 'wf-4-4-1', 'title': 'Scaling AI Workflows', 'type': 'advanced', 'duration': 7},
                {'id': 'wf-4-4-2', 'title': 'Security & Compliance', 'type': 'concept', 'duration': 6},
                {'id': 'wf-4-4-3', 'title': 'Workflow Governance', 'type': 'concept', 'duration': 6},
            ],
            'quiz': {
                'title': 'Production Workflows',
                'questions': 8,
                'pass_score': 70,
                'time_limit': 12,
            },
        },
    ],
    'final_test': {
        'title': 'AI Workflow Architect Certification',
        'questions': 30,
        'pass_score': 75,
        'time_limit': 50,
    },
    'project': {
        'title': 'Enterprise Automation System',
        'description': 'Build an end-to-end business process automation with AI decision-making and monitoring.',
        'points': 100,
        'rubric': {
            'Workflow Design': 25,
            'AI Integration': 25,
            'Error Handling': 20,
            'Monitoring': 15,
            'Documentation': 15,
        },
    },
}

# ============================================================================
# COURSE 5: TRAINING TEAMS ON AI
# ============================================================================

COURSE_5_TRAINING = {
    'id': 'ai-training',
    'title': 'Training Teams on AI',
    'slug': 'ai-training',
    'instructor_id': 'aisha-kumar',
    'description': 'Design and deliver effective AI training programs for your organization.',
    'level': 'intermediate',
    'duration_minutes': 78,
    'modules': [
        {
            'id': 'mod-5-1',
            'title': 'AI Readiness Assessment',
            'description': 'Evaluating organizational AI maturity',
            'order': 1,
            'lessons': [
                {'id': 'tr-5-1-1', 'title': 'Welcome: Building an AI-Ready Organization', 'type': 'welcome', 'duration': 6},
                {'id': 'tr-5-1-2', 'title': 'Assessing Team AI Readiness', 'type': 'concept', 'duration': 7},
                {'id': 'tr-5-1-3', 'title': 'Creating Your AI Training Roadmap', 'type': 'practical', 'duration': 7},
            ],
            'quiz': {
                'title': 'AI Readiness',
                'questions': 8,
                'pass_score': 70,
                'time_limit': 12,
            },
        },
        {
            'id': 'mod-5-2',
            'title': 'AI Training Programs',
            'description': 'Designing effective learning experiences',
            'order': 2,
            'lessons': [
                {'id': 'tr-5-2-1', 'title': 'Designing Role-Based AI Training', 'type': 'concept', 'duration': 7},
                {'id': 'tr-5-2-2', 'title': 'Hands-On Learning Approaches', 'type': 'practical', 'duration': 6},
                {'id': 'tr-5-2-3', 'title': 'Building Internal AI Champions', 'type': 'practical', 'duration': 7},
                {'id': 'tr-5-2-4', 'title': 'Measuring Training Effectiveness', 'type': 'practical', 'duration': 6},
            ],
            'quiz': {
                'title': 'Training Design',
                'questions': 10,
                'pass_score': 70,
                'time_limit': 15,
            },
            'assignment': {
                'title': 'AI Training Program Design',
                'description': 'Design a complete AI training program for your team',
                'points': 100,
            },
        },
        {
            'id': 'mod-5-3',
            'title': 'Change Management for AI',
            'description': 'Overcoming adoption challenges',
            'order': 3,
            'lessons': [
                {'id': 'tr-5-3-1', 'title': 'Overcoming AI Resistance', 'type': 'concept', 'duration': 7},
                {'id': 'tr-5-3-2', 'title': 'AI Ethics & Responsible Use', 'type': 'concept', 'duration': 6},
                {'id': 'tr-5-3-3', 'title': 'Sustaining AI Adoption', 'type': 'practical', 'duration': 6},
            ],
            'quiz': {
                'title': 'Change Management',
                'questions': 8,
                'pass_score': 70,
                'time_limit': 12,
            },
        },
        {
            'id': 'mod-5-4',
            'title': 'Knowledge Management',
            'description': 'Building lasting AI capabilities',
            'order': 4,
            'lessons': [
                {'id': 'tr-5-4-1', 'title': 'Building AI Knowledge Bases', 'type': 'practical', 'duration': 7},
                {'id': 'tr-5-4-2', 'title': 'Continuous Learning Culture', 'type': 'concept', 'duration': 6},
            ],
            'quiz': {
                'title': 'Knowledge Management',
                'questions': 6,
                'pass_score': 70,
                'time_limit': 10,
            },
        },
    ],
    'final_test': {
        'title': 'AI Training Specialist Certification',
        'questions': 25,
        'pass_score': 75,
        'time_limit': 45,
    },
    'project': {
        'title': 'Team AI Training Program',
        'description': 'Create a complete training curriculum, assessment framework, and change management plan.',
        'points': 100,
        'rubric': {
            'Curriculum Design': 30,
            'Assessment Framework': 25,
            'Change Management': 25,
            'Documentation': 20,
        },
    },
}

# ============================================================================
# COURSE 6: ENTERPRISE AI IMPLEMENTATION
# ============================================================================

COURSE_6_ENTERPRISE = {
    'id': 'enterprise-ai',
    'title': 'Enterprise AI Implementation',
    'slug': 'enterprise-ai',
    'instructor_id': 'marcus-williams',
    'description': 'Lead AI transformation at the organizational level with strategy, governance, and scaling.',
    'level': 'advanced',
    'duration_minutes': 91,
    'modules': [
        {
            'id': 'mod-6-1',
            'title': 'AI Strategy',
            'description': 'Developing enterprise AI vision',
            'order': 1,
            'lessons': [
                {'id': 'ent-6-1-1', 'title': 'Welcome: Enterprise AI Vision', 'type': 'welcome', 'duration': 6},
                {'id': 'ent-6-1-2', 'title': 'AI Opportunity Assessment', 'type': 'concept', 'duration': 7},
                {'id': 'ent-6-1-3', 'title': 'Building the Business Case', 'type': 'practical', 'duration': 7},
                {'id': 'ent-6-1-4', 'title': 'AI Roadmap Development', 'type': 'practical', 'duration': 6},
            ],
            'quiz': {
                'title': 'AI Strategy',
                'questions': 10,
                'pass_score': 70,
                'time_limit': 15,
            },
        },
        {
            'id': 'mod-6-2',
            'title': 'AI Infrastructure',
            'description': 'Building the technical foundation',
            'order': 2,
            'lessons': [
                {'id': 'ent-6-2-1', 'title': 'Choosing AI Platforms & Tools', 'type': 'concept', 'duration': 7},
                {'id': 'ent-6-2-2', 'title': 'Data Infrastructure for AI', 'type': 'concept', 'duration': 7},
                {'id': 'ent-6-2-3', 'title': 'Security & Compliance', 'type': 'concept', 'duration': 6},
                {'id': 'ent-6-2-4', 'title': 'Integration Architecture', 'type': 'practical', 'duration': 6},
            ],
            'quiz': {
                'title': 'AI Infrastructure',
                'questions': 12,
                'pass_score': 70,
                'time_limit': 18,
            },
            'assignment': {
                'title': 'AI Infrastructure Design',
                'description': 'Design AI infrastructure for your organization',
                'points': 100,
            },
        },
        {
            'id': 'mod-6-3',
            'title': 'AI Governance',
            'description': 'Policies, risk, and compliance',
            'order': 3,
            'lessons': [
                {'id': 'ent-6-3-1', 'title': 'AI Policies & Guidelines', 'type': 'concept', 'duration': 7},
                {'id': 'ent-6-3-2', 'title': 'Risk Management for AI', 'type': 'concept', 'duration': 6},
                {'id': 'ent-6-3-3', 'title': 'AI Audit & Compliance', 'type': 'practical', 'duration': 6},
            ],
            'quiz': {
                'title': 'AI Governance',
                'questions': 10,
                'pass_score': 70,
                'time_limit': 15,
            },
        },
        {
            'id': 'mod-6-4',
            'title': 'Scaling AI',
            'description': 'From pilot to enterprise-wide',
            'order': 4,
            'lessons': [
                {'id': 'ent-6-4-1', 'title': 'From Pilot to Production', 'type': 'practical', 'duration': 7},
                {'id': 'ent-6-4-2', 'title': 'Measuring AI Impact', 'type': 'practical', 'duration': 6},
                {'id': 'ent-6-4-3', 'title': 'Future-Proofing Your AI Strategy', 'type': 'concept', 'duration': 6},
            ],
            'quiz': {
                'title': 'Scaling AI',
                'questions': 8,
                'pass_score': 70,
                'time_limit': 12,
            },
        },
    ],
    'final_test': {
        'title': 'Enterprise AI Leader Certification',
        'questions': 30,
        'pass_score': 75,
        'time_limit': 50,
    },
    'project': {
        'title': 'AI Implementation Plan',
        'description': 'Create a complete enterprise AI strategy with infrastructure recommendations, governance framework, and 12-month roadmap.',
        'points': 100,
        'rubric': {
            'Strategy': 25,
            'Infrastructure': 25,
            'Governance': 25,
            'Roadmap': 15,
            'Presentation': 10,
        },
    },
}

# ============================================================================
# COMBINED COURSE LIST
# ============================================================================

ALL_COURSES = [
    COURSE_1_AI_FOUNDATIONS,
    COURSE_2_AI_AGENTS,
    COURSE_3_MCP,
    COURSE_4_WORKFLOWS,
    COURSE_5_TRAINING,
    COURSE_6_ENTERPRISE,
]

def get_all_lessons():
    """Get flat list of all lessons across all courses"""
    lessons = []
    for course in ALL_COURSES:
        instructor = INSTRUCTORS[course['instructor_id']]
        for module in course['modules']:
            for lesson in module['lessons']:
                lessons.append({
                    'lesson_id': lesson['id'],
                    'title': lesson['title'],
                    'type': lesson['type'],
                    'duration': lesson['duration'],
                    'course_id': course['id'],
                    'course_title': course['title'],
                    'module_id': module['id'],
                    'module_title': module['title'],
                    'instructor_id': instructor['id'],
                    'instructor_name': instructor['name'],
                })
    return lessons

def get_course_summary():
    """Get summary statistics"""
    total_lessons = 0
    total_modules = 0
    total_minutes = 0

    for course in ALL_COURSES:
        total_modules += len(course['modules'])
        for module in course['modules']:
            total_lessons += len(module['lessons'])
            for lesson in module['lessons']:
                total_minutes += lesson['duration']

    return {
        'courses': len(ALL_COURSES),
        'modules': total_modules,
        'lessons': total_lessons,
        'total_minutes': total_minutes,
        'total_hours': round(total_minutes / 60, 1),
    }

if __name__ == '__main__':
    summary = get_course_summary()
    print(f"\n{'='*60}")
    print("PHAZUR LABS ACADEMY - AI IMPLEMENTATION CURRICULUM")
    print(f"{'='*60}")
    print(f"Courses: {summary['courses']}")
    print(f"Modules: {summary['modules']}")
    print(f"Lessons: {summary['lessons']}")
    print(f"Total Duration: {summary['total_hours']} hours ({summary['total_minutes']} min)")
    print(f"{'='*60}\n")

    for course in ALL_COURSES:
        instructor = INSTRUCTORS[course['instructor_id']]
        lesson_count = sum(len(m['lessons']) for m in course['modules'])
        print(f"{course['title']}")
        print(f"  Instructor: {instructor['name']}")
        print(f"  Modules: {len(course['modules'])} | Lessons: {lesson_count}")
        print()
