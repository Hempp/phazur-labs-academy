---
name: warn-console-log
enabled: true
event: file
conditions:
  - field: file_path
    operator: regex_match
    pattern: \.(tsx?|jsx?)$
  - field: new_text
    operator: regex_match
    pattern: console\.(log|debug|info)\(
---

**Console.log Detected in Code**

You're adding `console.log` to a TypeScript/JavaScript file.

**Why this matters for Phazur Labs Academy:**
- Debug logs shouldn't ship to production
- Console logs in checkout/payment flows may expose sensitive data
- Impacts browser performance and user experience

**Alternatives:**
- Use a proper logging service for production
- Remove debug logs before committing
- Use conditional logging: `if (process.env.NODE_ENV === 'development')`
