---
title: Your API key: where it is stored and when it is used
section: AI
order: 7
---

# Your API key: where it is stored and when it is used

Your key is kept in the **macOS Keychain**, and read only at the moment you ask
for something.

## Where it is stored

In the macOS Keychain, under Onceaway's own service entry, one entry per
provider.

It is **never** written to:

- the app's preferences,
- the activity database,
- any log file,
- any file inside the app,
- anything that is transmitted anywhere except the provider it belongs to.

Onceaway also never displays it back to you — not in full, not as a prefix or
suffix, and not as a length.

## When Onceaway reads it

Only in two situations, both of which start with you pressing something:

1. **You explicitly request AI** — an interpretation or reduction ideas.
2. **You manage the credential** — pressing *Check for stored key*, *Save to
   Keychain*, or *Remove key* in **Settings → AI**.

That is the complete list.

## When it does not read it

- Not at launch.
- Not when you open Settings.
- Not when you open the AI pane.
- Not when you switch provider.
- Not in the background, ever.

This is why opening Onceaway does not produce a Keychain prompt. If launching
the app ever asks you to unlock something, that is a bug worth reporting.

## Local features never depend on it

Nothing in Onceaway that works locally requires the key to be readable. If you
deny Keychain access, everything except the two AI features carries on
normally.

## Related articles

- [Adding an API key](adding-an-api-key.md)
- [Why does macOS ask for Keychain access?](keychain-access-prompts.md)
- [Is AI required?](is-ai-required.md)
