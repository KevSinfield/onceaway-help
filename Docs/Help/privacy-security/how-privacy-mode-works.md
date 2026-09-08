---
title: How does Privacy Mode work?
section: Privacy & Security
order: 3
---

# How does Privacy Mode work?

Privacy Mode is the protected state Onceaway enters automatically when the
context you are in should not be observed in detail.

**Privacy decides whether observation may happen. Observation never decides
privacy for itself.**

## It is automatic, not a switch

In Onceaway 0.5.0 there is no button to flip. Protection is entered by the app
when it detects a protected context and left when that context ends. You can
see the current state in the menu: *Privacy: Normal* or *Privacy: Protected*.

## What puts Onceaway into a protected state

- A banking, payment or other financial context.
- A built-in protected application, such as a password manager.
- An app you added to your own **Never Observe** list.
- Any other context designated as protected.

## What happens while protected

Detailed observation stops. Onceaway may still record that *something happened
at this time*, but the detail that would normally accompany it is not
collected. The record says, in effect, "activity occurred here, and observation
was suppressed" — and it stores only the **category** of reason, never the
site, app, field or value that triggered it.

Assist is also paused while a protected context is active, and clearing the
protected context does not resume a cancelled action.

## Related articles

- [How are passwords protected?](how-passwords-and-password-managers-are-protected.md)
- [What happens on banking websites?](banking-and-financial-websites.md)
- [Can I exclude apps?](excluding-apps.md)
- [Why privacy comes before observation](why-privacy-comes-before-observation.md)
