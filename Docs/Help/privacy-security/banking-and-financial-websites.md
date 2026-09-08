---
title: What happens on banking and financial websites?
section: Privacy & Security
order: 5
---

# What happens on banking and financial websites?

Financial contexts suppress detailed observation.

## What that means

When Onceaway recognises a banking, payment or other financial context, it
enters its protected state. Detailed observation stops for as long as that
context lasts, and resumes afterwards.

This applies whether or not you have turned browser context on. If browser
context is off, no hostname is being recorded anywhere anyway. If it is on, it
is still suppressed in financial contexts.

## What is recorded instead

At most, that some activity occurred at that time with detailed observation
suppressed, plus the **category** of the reason. The site is not recorded. No
account numbers, card numbers, balances or form values are recorded, because
Onceaway does not read form fields or page contents in any context.

## Can I add my own?

Yes — if there is a site or app you want left alone regardless, add the app to
**Never Observe** under **Settings → Privacy**.

## Related articles

- [How does Privacy Mode work?](how-privacy-mode-works.md)
- [Browser context](../observation/browser-context.md)
- [Can I exclude apps?](excluding-apps.md)
