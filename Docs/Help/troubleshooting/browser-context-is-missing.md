---
title: Browser context is missing
section: Troubleshooting
order: 3
---

# Browser context is missing

Website hostnames are not appearing in what Onceaway noticed.

## Check these in order

**1. Is it switched on?** Browser context is **off by default**. Open
**Settings → Privacy → Browser Context** and check the browser you use is
enabled. Each browser is a separate switch.

**2. Is it a supported browser?** Onceaway 0.5.0 supports **Safari** and
**Google Chrome**. Other browsers are not supported yet.

**3. Was permission granted?** Turning it on asks macOS for permission to read
the address of the active tab. If you declined, try switching it off and on
again to be asked once more.

**4. Was the browser actually in front?** Context is read only while that
browser is the frontmost application.

**5. Were you in a protected context?** Financial and other protected contexts
suppress browser context by design, and always will.

## What you should expect to see

Hostnames only — `example.com` — never full addresses or page contents. If you
were expecting to see which pages you visited, that is not something Onceaway
records in any configuration.

## Related articles

- [Browser context](../observation/browser-context.md)
- [What happens on banking websites?](../privacy-security/banking-and-financial-websites.md)
