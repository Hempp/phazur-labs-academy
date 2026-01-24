---
name: protect-env-files
enabled: true
event: file
conditions:
  - field: file_path
    operator: regex_match
    pattern: \.env
---

**Environment File Edit Detected**

You're editing an environment file that may contain sensitive credentials:
- Supabase keys
- Stripe secret keys
- Database URLs
- API tokens

**Before proceeding:**
- Ensure this file is in `.gitignore`
- Never commit real credentials to version control
- Use `.env.example` for documentation (with placeholder values only)
- Consider using a secrets manager for production
