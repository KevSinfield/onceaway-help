---
title: What does Onceaway observe?
section: Privacy & Security
order: 1
---

# What does Onceaway observe?

Three things, and only while observation is running.

## The three sources

**App activity.** Which application is in front, and when you move between
them. This is always part of observation while it is on.

**File activity.** When a file is created, renamed or moved in a folder you
have allowed. Onceaway can observe your **Downloads** and **Desktop** folders,
and you choose which of them are included. It records the **file type** and
**which of those folders** it happened in — nothing else about the file.

**Browser context.** Optional, and off until you turn it on. When enabled for
Safari or Google Chrome, Onceaway records the **website's host** — for example
`example.com` — while that browser is in front. Not the full address, not the
page, not its contents.

## What a record actually looks like

A file event records the file's type and the folder category. A browsing event
records a hostname. An app event records which app came forward and when. That
is the level of detail Onceaway works at.

It is enough to notice *"a PDF appeared in Downloads, then you switched to
Finder, and this has happened five times"*. It is not enough to know what the
PDF was.

## When nothing is observed

Observation is off until you start it, and it stops the moment you pause it or
quit. It is also suppressed automatically in protected contexts — see
[How does Privacy Mode work?](how-privacy-mode-works.md).

## Related articles

- [What does Onceaway never record?](what-onceaway-never-records.md)
- [How does Privacy Mode work?](how-privacy-mode-works.md)
- [Where is my data stored?](where-is-my-data-stored.md)
- [File activity](../observation/file-activity.md)
