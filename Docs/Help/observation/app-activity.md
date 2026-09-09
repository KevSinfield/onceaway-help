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

## Time is only counted while Onceaway is watching

The minutes next to an app in History are minutes Onceaway actually saw. If
observation is paused, if Onceaway is not running, or if your Mac is asleep or
locked, none of that time is given to any app — not to whatever was in front
when you stopped, and not to whatever is in front when you come back.

So an app you left open overnight does not collect the night, and a day you
spent away from your Mac does not appear as a day of work. It also means
History can total less than the time that passed, which is the honest answer:
Onceaway would rather tell you nothing about a period than make something up.

## Apps you excluded

An app on your **Never Observe** list still appears by name when you switch to
it, so your timeline stays honest, but nothing is collected from inside it.
Apps in **Always Protected** are treated as protected automatically.

## Can I turn app activity off on its own?

Not separately — it is what observation *is*. To stop it, pause observation on
**Home** or in the menu bar. To leave particular apps alone, use Never Observe.

## Why don't I see macOS's own background services?

macOS brings a few of its own services to the front without you opening them.
Moving your pointer to another Mac with Universal Control is the common one: as
far as the system is concerned, Universal Control came forward. Locking your
Mac does the same thing — the lock screen is a process called *loginwindow*,
and it can otherwise turn up in History looking like an app you used for
twenty minutes.

Onceaway leaves those out of History, of the time it counts per app, and of
what it looks at for repeats. They are not work, and treating them as work
would invent patterns out of your pointer crossing a screen edge or your Mac
locking itself while you made a cup of tea.

This applies to a short, specific list of macOS services, not to Apple's
applications. Safari, Mail, Finder, Notes, Reminders, Calendar, Preview and the
rest are your work like anything else, and they appear normally.

## Does Onceaway count itself?

Onceaway appears in **History**, because you did open it and History is a
record of what happened. A day you spent partly in Onceaway that showed no sign
of it would be quietly incomplete.

It is left out of everything Onceaway *concludes*, though: Patterns,
Opportunities, Insights and the sequences behind them. Opening Onceaway to look
at your Patterns is you using this app, not the work this app exists to help
you do less of. Counting it would mean that the more you checked your Patterns,
the more "checking Patterns" started to look like a habit worth breaking.

When you glance at Onceaway in the middle of something, the work either side
stays joined — Onceaway is taken out of the picture, not turned into a wall
across it. If you spend twenty minutes in it, what happened before and after is
twenty minutes apart, and that gap separates them for the ordinary reason.

## Related articles

- [File activity](file-activity.md)
- [Browser context](browser-context.md)
- [Can I exclude apps?](../privacy-security/excluding-apps.md)
- [Starting and stopping observation](../getting-started/starting-and-stopping-observation.md)
