---
title: AI says no key is configured
section: Troubleshooting
order: 4
---

# AI says no key is configured

Onceaway needs an API key for the provider that is currently selected, and it
does not have one.

## Fix it

1. Open **Settings → AI**.
2. Check which provider is selected — **Anthropic** or **OpenAI**.
3. Paste that provider's API key into the field.
4. Press **Save to Keychain**.
5. Try the AI request again.

## The most common cause

**Each provider keeps its own key.** A key saved for Anthropic does not work
for OpenAI, and the other way round. If you switched provider recently, that
switch is almost certainly the reason.

Onceaway will not fall back to the other provider's key, on purpose — see
[Switching providers and failed requests](../ai/switching-providers-and-failed-requests.md).

## Checking what is stored

Press **Check for stored key**. Onceaway will tell you whether a key exists for
the selected provider. It does not check on its own, so until you press this it
genuinely does not know.

## Everything else still works

This message only affects the two AI features. Observation, Patterns,
Opportunities, Insights, History and Assist are unaffected.

## Related articles

- [How do I add an API key?](../ai/adding-an-api-key.md)
- [Your API key](../ai/your-api-key.md)
- [Is AI required?](../ai/is-ai-required.md)
