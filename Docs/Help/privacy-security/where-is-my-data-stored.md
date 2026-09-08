---
title: Where is my data stored?
section: Privacy & Security
order: 7
---

# Where is my data stored?

On your Mac, in a local database that belongs to you.

## The location

Onceaway keeps its activity history in your own Library folder, in an
application-support directory named after the app. The folder and the database
inside it are readable only by your user account.

## What is kept there

- Observed activity history.
- Your Pattern reviews and any labels you wrote.
- Your opportunity preferences.

## What is not kept there

Your API key is never stored in this database, in your preferences, or in a
log. It lives in the macOS Keychain. See
[Your API key](../ai/your-api-key.md).

AI suggestions are not stored anywhere at all — they last for the session and
then they are gone.

## How long history is kept

**Settings → Privacy → Activity History** lets you keep history for 7, 30 or 90
days. The default is 30. Anything older is removed automatically.

## Deleting it yourself

**Clear Activity History…** in the same place deletes your observed activity,
your saved Pattern reviews and your opportunity preferences. Your Never Observe
list and other settings are kept.

To remove everything, drag Onceaway from Applications to the Trash and delete
its folder in `~/Library/Application Support/`.

## Related articles

- [Is my activity sent anywhere?](is-my-activity-sent-anywhere.md)
- [Your API key](../ai/your-api-key.md)
- [What does Onceaway observe?](what-does-onceaway-observe.md)
