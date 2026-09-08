---
title: Browser context
section: Observation
order: 3
---

# Browser context

Browser context is optional, off by default, and turned on per browser.

## What it does

When it is on for a browser, Onceaway records the **host** of the site you are
on — for example `example.com` — while that browser is the frontmost app.

Supported browsers in Onceaway 0.5.0: **Safari** and **Google Chrome**.

## What it records, precisely

The hostname only. Not the full web address, not the path, not the query
string, not the page title, and nothing on the page.

`example.com` — not `example.com/clients/acme/invoice-4417?token=…`.

## Why it helps

Without it, a run of web work looks to Onceaway like "the browser was in front
for a while". With it, the same run can be recognised as the same site being
used in the same position in a task, which is often the thing that makes two
occurrences recognisably the same job.

## Why it is optional

Because it is the only source that touches what you are looking at, rather than
just which app you are in. That is a real step up in sensitivity, so it is a
decision you make deliberately rather than one made for you. Everything else in
Onceaway works with it off.

Turning it on asks macOS for permission to read the address of the active tab
in that browser. Protected and financial contexts still suppress it.

## If something goes wrong

If hostnames are not appearing:

- Check it is switched on for that specific browser under **Settings →
  Privacy → Browser Context**. It is off until you turn it on, and each browser
  is separate.
- Check the browser is one of the two supported ones.
- Remember that protected and financial contexts suppress it by design.
- The browser must actually be the frontmost app at the time.

## Related articles

- [What happens on banking websites?](../privacy-security/banking-and-financial-websites.md)
- [Browser context is missing](../troubleshooting/browser-context-is-missing.md)
- [What does Onceaway observe?](../privacy-security/what-does-onceaway-observe.md)
