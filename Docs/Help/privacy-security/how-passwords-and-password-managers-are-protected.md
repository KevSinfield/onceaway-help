---
title: How are passwords protected?
section: Privacy & Security
order: 4
---

# How are passwords protected?

## Onceaway does not record what you type

Not in a password field, and not anywhere else. There is no keystroke
recording, no reading of field values and no capture of the screen anywhere in
Onceaway, so there is nothing that could pick up a password in the first place.

That is a stronger protection than filtering one out afterwards, and it applies
in every application.

### One thing to know

Onceaway does **not** currently detect that a password field is active. There
is a protected-context category for it, and you may see it named in History,
but no part of the current build switches it on.

In practice this matters in one place: if you have browser context switched on
and you sign in to a website, that site's host may be recorded like any other.
Your password is not, and cannot be. Adding secure-input detection is on the
list for a later build.

## Password manager applications

A set of credential apps is protected by default, and **this cannot be turned
off**. In Onceaway 0.5.0 that includes:

- Passwords
- Keychain Access
- 1Password (and 1Password 7)
- Bitwarden
- LastPass
- KeePassXC

While one of these is in front, Onceaway does not collect detailed context from
inside it. You can see the full list under **Settings → Privacy → Always
Protected**, where it is shown as read-only.

## What about your own apps?

Anything else you want left alone can be added to **Never Observe**. That list
is yours and you can change it whenever you like.

## Related articles

- [How does Privacy Mode work?](how-privacy-mode-works.md)
- [Can I exclude apps?](excluding-apps.md)
- [What does Onceaway never record?](what-onceaway-never-records.md)
