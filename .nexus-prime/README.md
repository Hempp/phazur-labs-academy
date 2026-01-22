# NEXUS-PRIME v3.0

> Master Skills Orchestration System
> *"I don't just execute tasks. I architect futures."*

---

## Installation Complete

NEXUS-PRIME is installed at `~/.nexus-prime/`

---

## Quick Start

### In Claude Code

```
/nexus                  # Activate NEXUS-PRIME
/nexus-status           # View system status
/nexus-help             # See all commands
```

### Initialize a New Project

```bash
# Option 1: Use the init script
~/.nexus-prime/nexus-init.sh my-project

# Option 2: In Claude Code
cd my-project
/nexus
/workflow-bootstrap
```

---

## File Structure

```
~/.nexus-prime/
├── CLAUDE.md           # Claude Code instructions
├── skills.md           # Full system documentation
├── README.md           # This file
├── nexus-init.sh       # Project initializer script
├── templates/          # Project templates
├── skills/             # Custom skills
├── agents/             # Custom agents
└── workflows/          # Custom workflows
```

---

## Available Commands

### Core
| Command | Description |
|---------|-------------|
| `/nexus` | Activate orchestrator |
| `/nexus-status` | System status |
| `/nexus-help` | Show help |
| `/nexus-sync` | Sync agents |

### Create
| Command | Description |
|---------|-------------|
| `/nexus-create-skill` | New skill |
| `/nexus-create-agent` | New agent |
| `/nexus-create-task` | New task |

### Deploy
| Command | Description |
|---------|-------------|
| `/nexus-deploy [AGENT]` | Deploy agent |
| `/deploy-fullstack` | Full-stack team |
| `/deploy-security` | Security team |
| `/deploy-data` | Data team |

### Workflows
| Command | Description |
|---------|-------------|
| `/workflow-bootstrap` | Init project |
| `/workflow-audit` | Full audit |
| `/workflow-release` | Release pipeline |
| `/workflow-optimize` | Optimization |
| `/workflow-document` | Auto docs |

---

## Foundation Agents

| Codename | Domain |
|----------|--------|
| ARCHITECT | System Design |
| SENTINEL | Security |
| VELOCITY | Performance |
| GENESIS | Creation |
| ORACLE | Research |

## Specialist Agents

| Codename | Expertise |
|----------|-----------|
| QUANTUM-DEV | Full-Stack Dev |
| NEURAL-UX | UX Design |
| FLUX-OPS | DevOps |
| CIPHER | Blockchain |
| SYNAPSE | ML/AI |
| MERIDIAN | Global Scale |
| PRISM | Data |
| AEGIS | Risk |

---

## Add to PATH (Optional)

Add to your `~/.zshrc` or `~/.bashrc`:

```bash
# NEXUS-PRIME
export PATH="$HOME/.nexus-prime:$PATH"
alias nexus-init="~/.nexus-prime/nexus-init.sh"
```

Then: `source ~/.zshrc`

---

## Support

Full documentation: `~/.nexus-prime/skills.md`

---

*NEXUS-PRIME v3.0 - 30 Years of Wisdom, Infinite Possibilities*
