---
title: How do I choose an AI provider?
section: AI
order: 3
---

# How do I choose an AI provider?

Open **Settings → AI** and pick **Anthropic** or **OpenAI** at the top of the
pane.

## What choosing does

It sets who will handle your **next explicit request**. That is all.

Choosing a provider does not send anything, does not read any key, does not
test the connection, and does not produce a Keychain prompt. It is a
preference, and it is remembered between launches.

## Each provider is separate

- Its own API key. A key saved for one does not work for the other.
- Its own model setting, which you can leave at the provider's default or set
  yourself.

If you switch to a provider you have not given a key to, Onceaway will tell you
so the next time you actually ask for something — not before.

## My provider changed on its own

It should not have. The selection is stored as a preference and persists across
launches. If you see a different provider selected than you expect, the most
likely explanations are that it was changed on another occasion, or that the
preferences were cleared. Set it again in **Settings → AI**; it will stick.

## Related articles

- [Adding an API key](adding-an-api-key.md)
- [Switching providers and failed requests](switching-providers-and-failed-requests.md)
- [Which AI providers are supported?](which-ai-providers-are-supported.md)
