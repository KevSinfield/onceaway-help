---
title: When Onceaway gets it wrong
section: Observation
order: 5
---

# When Onceaway gets it wrong

It will, in both directions. Here is why, and what to do about it.

## It missed something you repeat all the time

Onceaway can only recognise repetition it can see, and there is a fair amount
it cannot see yet.

Things that currently produce little or no signal:

- **Work inside a single app.** Building the same spreadsheet every Monday
  looks, from outside, like "the spreadsheet app was in front for a while".
- **Work with no file activity.** If nothing is created, renamed or moved in
  Downloads or Desktop, that part of the picture is empty.
- **Web work with browser context off.** All web tasks look identical until
  hostnames are available.
- **Files elsewhere on disk.** Only Downloads and Desktop are observed.
- **Anything in a protected or excluded context.** Suppressed by design.
- **Work with variable shape.** If the same job is done in a different order
  each time, there is less structure to match on.

What helps: turn on browser context if it suits you, make sure the folders you
actually use are enabled, and check nothing relevant is on Never Observe.

What will not help: there is no way to tell Onceaway about a repeated task by
hand in 0.5.0.

## It noticed something that isn't really the same task

This is expected and it is why the review question exists. Onceaway matches
structure, and different jobs can share a structure — two unrelated errands
that both involve a download and a trip to Finder look identical from outside.

Answer **No**. A rejected Pattern is never treated as an Opportunity and stops
being offered.

If the occurrences really were related but the grouping is clumsy, **Not sure**
is the honest answer, and it is a perfectly good one.

## Related articles

- [Why does Onceaway ask me to confirm a Pattern?](../how-onceaway-works/why-onceaway-asks-you-to-confirm.md)
- [Reviewing and naming a Pattern](../using-onceaway/reviewing-and-naming-a-pattern.md)
- [Why hasn't Onceaway noticed anything yet?](why-hasnt-onceaway-noticed-anything-yet.md)
