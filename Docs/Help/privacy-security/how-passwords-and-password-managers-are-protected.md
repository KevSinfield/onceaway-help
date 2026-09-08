---
title: How are passwords protected?
section: Privacy & Security
order: 4
---

# How are passwords protected?

Two separate protections cover credentials: secure fields, and password manager
applications.

## Secure fields

When you type into a password field — or any other secure text field — macOS
puts the system into secure input. Onceaway treats that as a protected context.

The important part is the order: **the protection is applied before detailed
observation happens, not filtered out afterwards.** Password contents are not
captured.

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
