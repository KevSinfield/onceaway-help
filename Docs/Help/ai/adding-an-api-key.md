---
title: How do I add an API key?
section: AI
order: 4
---

# How do I add an API key?

**Settings → AI**, choose your provider, paste the key into the field, and
press **Save to Keychain**.

## Do you already have a key?

**Yes.** Follow the Onceaway steps below.

**No, I need to create one.** Start with the guide for your provider, which
walks through the provider's own website step by step and then brings you back
here:

- [How to get an Anthropic API key](get-an-anthropic-api-key.md)
- [How to get an OpenAI API key](get-an-openai-api-key.md)

You only need one. Either provider works.

## Step by step

1. Get an API key from your chosen provider's own website.
2. In Onceaway, open **Settings → AI**.
3. Select **Anthropic** or **OpenAI**.
4. Paste the key into the field beneath **Credential**.
5. Press **Save to Keychain**.

The field is a secure field, so the key is never displayed as you type. Once
saved, Onceaway does not show it back to you — not the whole key, and not part
of it.

## Checking and removing

- **Check for stored key** asks the Keychain whether a key exists for the
  selected provider. Onceaway does not check on its own, so until you press
  this it simply does not know.
- **Remove *provider* key** deletes the key for that provider only. The other
  provider's key is untouched.

## Is a ChatGPT or Claude subscription enough?

No. **Provider subscriptions and API access are separate services with separate
billing.** A Claude or ChatGPT subscription covers the chat apps; it does not
include API access, which is what Onceaway uses.

The provider guides above cover what each one currently requires.

## What it costs

Onceaway sends small requests, and only when you press a button. Any charges
come from your provider under your own account — Onceaway does not bill you and
has no view of your provider spending.

## Related articles

- [How to get an Anthropic API key](get-an-anthropic-api-key.md)
- [How to get an OpenAI API key](get-an-openai-api-key.md)
- [Your API key](your-api-key.md)
- [What does Onceaway send to AI?](what-does-onceaway-send-to-ai.md)
- [AI says no key is configured](../troubleshooting/ai-says-no-key-is-configured.md)
