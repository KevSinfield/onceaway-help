---
title: App activity observation
section: Observation
order: 1
---

# App activity observation

App activity is the backbone of what Onceaway notices, and it is always part of
observation while observation is running.

## What it records

Which application came to the front, and when you moved away from it. That is
all: an identifier for the app, and a moment in time.

From a run of those, Onceaway can see the shape of a task — *browser, then
Finder, then this other app* — and spot when the same shape happens again.

## What it does not record

Not the window title. Not the document you had open. Not anything inside the
app. Switching to Mail tells Onceaway that Mail came forward, and nothing about
any message.

## Apps you excluded

An app on your **Never Observe** list still appears by name when you switch to
it, so your timeline stays honest, but nothing is collected from inside it.
Apps in **Always Protected** are treated as protected automatically.

## Can I turn app activity off on its own?

Not separately — it is what observation *is*. To stop it, pause observation on
**Home** or in the menu bar. To leave particular apps alone, use Never Observe.

## Why don't I see macOS's own background services?

macOS brings a few of its own services to the front without you opening them.
Moving your pointer to another Mac with Universal Control is the common one:
as far as the system is concerned, Universal Control came forward.

Onceaway leaves those out of History, of the time it counts per app, and of
what it looks at for repeats. They are not work, and treating them as work
would invent patterns out of your pointer crossing a screen edge.

This applies to a short, specific list of macOS services, not to Apple's
applications. Safari, Mail, Finder, Notes, Reminders, Calendar, Preview and the
rest are your work like anything else, and they appear normally.

## Related articles

- [File activity](file-activity.md)
- [Browser context](browser-context.md)
- [Can I exclude apps?](../privacy-security/excluding-apps.md)
- [Starting and stopping observation](../getting-started/starting-and-stopping-observation.md)
