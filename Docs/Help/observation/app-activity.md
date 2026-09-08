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

Not separately — it is what observation *is*. To stop it, pause observation
from the menu bar. To leave particular apps alone, use Never Observe.

## Related articles

- [File activity](file-activity.md)
- [Browser context](browser-context.md)
- [Can I exclude apps?](../privacy-security/excluding-apps.md)
- [Starting and stopping observation](../getting-started/starting-and-stopping-observation.md)
