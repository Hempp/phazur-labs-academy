---
name: deploy-ux
description: Deploy the PRISM-UX Master Team for design audits, testing, and generation
aliases: [deploy-prism-ux, ux-team, team-ux]
agent: NEXUS-PRIME
---

# Deploy UX/UI Master Team

Activating the PRISM-UX design team with specialized agents for comprehensive UX work.

## Deployment Modes

**Full Team (default):**
```
/deploy-ux
```

**Audit-Focused:**
```
/deploy-ux audit
```

**Research-Focused:**
```
/deploy-ux research
```

**Innovation-Focused:**
```
/deploy-ux future
```

## Team Composition

| Agent | Role | Specialty |
|-------|------|-----------|
| **PRISM-UX** | Lead Architect | Strategy, synthesis, innovation |
| **HEURISTIC-EYE** | Usability Analyst | Heuristic evaluation, cognitive load |
| **ACCESS-GUARDIAN** | Accessibility Specialist | WCAG 2.2, inclusive design |
| **FLOW-MAPPER** | Information Architect | Journeys, navigation, hierarchy |
| **PIXEL-PERFECT** | Visual Design Analyst | Visual hierarchy, aesthetics |
| **RESEARCH-LENS** | UX Researcher | Testing, interviews, data |
| **FUTURE-SIGHT** | Innovation Scout | 2024-2029 trends, AI/spatial UI |

## Quick Start

1. **Audit a website:**
   ```
   /deploy-ux
   /ux-audit https://example.com
   ```

2. **Run accessibility check:**
   ```
   /ux-test accessibility https://example.com
   ```

3. **Generate wireframe:**
   ```
   /ux-wireframe "Dashboard for analytics SaaS"
   ```

4. **Get design feedback:**
   ```
   /ux-critique [paste design or describe]
   ```

## Available Commands

### Audits
- `/ux-audit [target]` - Comprehensive evaluation
- `/ux-audit-quick [target]` - 5-minute scan
- `/ux-audit-a11y [target]` - Accessibility focus
- `/ux-audit-mobile [target]` - Mobile-specific
- `/ux-audit-full [target]` - 50-point deep dive
- `/ux-audit-competitive [targets]` - Benchmark comparison

### Testing
- `/ux-test heuristic` - Nielsen's 10 heuristics
- `/ux-test cognitive-walkthrough` - Task flow analysis
- `/ux-test five-second` - First impression test
- `/ux-test accessibility` - WCAG compliance
- `/ux-test competitive` - Market positioning

### Generation
- `/ux-wireframe` - Low-fidelity specs
- `/ux-flow` - User flow diagrams
- `/ux-persona` - Research-based personas
- `/ux-journey` - Journey maps
- `/ux-critique` - Constructive feedback
- `/ux-improve` - Specific improvements

### Design System
- `/design-system audit` - Health check
- `/design-system create` - Bootstrap new system
- `/design-system extend` - Add components

### Reference
- `/ux-reference [query]` - Pattern lookup
- `/ux-celebrate [element]` - Document wins

---

*PRISM-UX v1.0 — "Design today for tomorrow's users."*
