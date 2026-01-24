---
name: block-dangerous-rm
enabled: true
event: bash
pattern: rm\s+(-rf|-fr|--recursive.*--force|--force.*--recursive)\s
action: block
---

**BLOCKED: Dangerous rm Command**

This command has been blocked because it uses `rm -rf` or equivalent flags that can cause irreversible data loss.

**Why this is blocked:**
- Can accidentally delete entire directories
- No confirmation prompt
- Cannot be undone (files don't go to trash)

**Safer alternatives:**
- Use `rm -i` for interactive confirmation
- Move to trash instead: `mv <path> ~/.Trash/`
- Be specific about what to delete (avoid wildcards with -rf)
- Use `git clean -fd` for cleaning git repos (safer, respects .gitignore)

**If you really need to use rm -rf:**
Ask the user to run it manually or adjust this hookify rule.
