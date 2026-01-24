---
name: guard-payment-code
enabled: true
event: file
conditions:
  - field: file_path
    operator: regex_match
    pattern: (stripe|checkout|payment|billing)
---

**Payment/Checkout Code Edit Detected**

You're editing code related to payments or checkout flow.

**Critical considerations for Phazur Labs Academy:**
- Payment flows handle real money - bugs can cause financial loss
- Stripe integration must follow PCI compliance best practices
- Never log or expose card details, even in errors
- Test thoroughly in Stripe test mode before production

**Checklist:**
- [ ] Using Stripe test keys during development?
- [ ] Error handling doesn't expose sensitive info?
- [ ] Webhook signatures verified?
- [ ] Idempotency keys used for critical operations?

**Stripe Docs:** https://stripe.com/docs/security
