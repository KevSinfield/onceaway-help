---
title: Why does macOS ask for Keychain access?
section: AI
order: 10
---

# Why does macOS ask for Keychain access?

Because Onceaway is reading the API key you stored, and macOS guards the
Keychain on your behalf.

## When you should expect a prompt

Only after **you** did something that needs the key:

- you asked for an interpretation or for reduction ideas,
- or you pressed *Check for stored key*, *Save to Keychain* or *Remove key* in
  **Settings → AI**.

macOS is most likely to ask the first time a newly installed or updated copy of
Onceaway reads the key, because to macOS that is a different application than
the one that saved it. Choosing **Always Allow** stops it asking again for that
copy.

## When you should not expect one

Not at launch, not when opening Settings, not when switching provider, and not
while the app sits in the background. Onceaway does not read the key in any of
those situations. A prompt at startup would be a bug.

## If you denied it

Nothing is broken. The rest of Onceaway keeps working normally — observation,
Patterns, Opportunities, Insights, History and Assist do not use the key at
all.

To try again, simply repeat the action that needed it: ask for the AI result
again, or open **Settings → AI** and press *Check for stored key*. macOS will
ask again.

If it stops asking and keeps refusing, remove the key in Onceaway and save it
again, which creates a fresh entry.

## Related articles

- [Your API key](your-api-key.md)
- [Adding an API key](adding-an-api-key.md)
- [An AI request failed](../troubleshooting/an-ai-request-failed.md)
