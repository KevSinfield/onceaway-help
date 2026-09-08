---
title: Switching providers, and what happens if a request fails
section: AI
order: 10
---

# Switching providers, and what happens if a request fails

Two questions with the same answer underneath: Onceaway does not do anything
with a provider unless you asked it to.

## Does switching providers send anything?

No.

Switching is a preference change. It sends nothing, reads no key, contacts
nobody and produces no Keychain prompt. It changes who will handle your **next**
explicit request, and nothing else.

## Will Onceaway fall back to the other provider if one fails?

No. Never.

If a request to your selected provider fails — the network is down, the
provider is having problems, the key is wrong — Onceaway tells you it failed
and stops. It does not quietly retry with the other provider.

## Why not, when a fallback would be convenient?

Because you chose that provider, and sending your data somewhere else without
asking would be a decision about your privacy made on your behalf. You may have
chosen deliberately: a provider your business has an agreement with, or one
your client permits. A silent fallback would break that quietly and you would
never know it had happened.

So the rule is simple: **the provider you selected is the only one that ever
receives your request.** If it cannot answer, you decide what to do next.

## Related articles

- [An AI request failed](../troubleshooting/an-ai-request-failed.md)
- [Choosing an AI provider](choosing-an-ai-provider.md)
- [What does Onceaway send to AI?](what-does-onceaway-send-to-ai.md)
