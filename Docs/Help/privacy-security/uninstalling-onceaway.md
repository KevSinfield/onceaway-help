---
title: Uninstalling Onceaway and removing your data
section: Privacy & Security
order: 8
---

# Uninstalling Onceaway and removing your data

There are two things you might want, and they are not the same. Removing the
app leaves your data behind. Removing your data is a separate step you take
inside Onceaway, before the app goes.

## A. Remove the app only

1. Quit Onceaway.
2. Drag it from **Applications** to the Trash.

That is a normal Mac uninstall and it works. What it leaves behind is your
local Onceaway folder in your Library, your Onceaway settings, and your saved
AI API key in the Keychain. Nothing there is sent anywhere or read by anything
else, but it is still yours and it is still on the Mac.

## B. Remove your data first

Do this if you want nothing of Onceaway left.

1. Open **Settings → Privacy → Your Data**.
2. Choose **Remove Onceaway Data…**.
3. Read the confirmation and choose **Remove All Data**.
4. Onceaway removes everything and quits.
5. Drag Onceaway from **Applications** to the Trash.

If you open Onceaway again instead of trashing it, it starts as though you had
just installed it: the welcome screens, no history, no settings, no API key.

## What Remove Onceaway Data removes

- Your observed activity history, and the database file itself.
- Your Pattern reviews, the names you gave Patterns, and your reduce-this
  preferences.
- Every Onceaway setting: retention, Never Observe, folder choices, browser
  context choices, your AI provider and model choices.
- Your notification choices, and any Onceaway notification still sitting in
  Notification Centre.
- **Launch at Login**, so a wiped Onceaway does not reopen itself the next time
  you log in.
- Your AI API key, from the Keychain. Only Onceaway's own Keychain items are
  touched; nothing else you or another app has stored there is read or removed.

## What it cannot remove

Two permissions belong to macOS rather than to Onceaway, and no app can take
them back on your behalf:

- **Notification permission**, if you allowed it.
- **Automation permission** for Safari or Chrome, if you turned browser context
  on.

Both live in **System Settings → Privacy & Security**, under *Notifications*
and *Automation*. You can remove them there whenever you like. Once the app is
in the Trash they do nothing, because there is no app left to use them.

## Clear Activity History is not the same thing

**Clear Activity History** empties your history and your reviews and leaves
Onceaway set up exactly as it was — your settings, your API key and your
Never Observe list are all still there. It is the one to use when you want a
clean slate but intend to carry on.

**Remove Onceaway Data** is the full reset.

## Related articles

- [Where is my data stored?](where-is-my-data-stored.md)
- [Your API key](../ai/your-api-key.md)
- [Installing Onceaway](../getting-started/installing-onceaway.md)
