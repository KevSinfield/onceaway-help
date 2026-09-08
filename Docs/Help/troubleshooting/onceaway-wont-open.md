---
title: Onceaway won't open
section: Troubleshooting
order: 1
---

# Onceaway won't open

Almost always macOS declining to open a test build that Apple has not
notarized. This is expected and it is easy to get past.

## What you will see

A message saying macOS cannot verify that Onceaway is free of malware, or that
it cannot be opened because the developer cannot be verified.

## How to open it

**Right-click** (or Control-click) Onceaway in your Applications folder and
choose **Open**. Then choose **Open** again in the dialog that appears.

If that route does not offer you the option:

1. Open **System Settings**.
2. Go to **Privacy & Security**.
3. Scroll down to the message about Onceaway.
4. Click **Open Anyway**.

You only need to do this once per installed copy.

## What not to do

Do not turn off Gatekeeper or run terminal commands to disable macOS security
checks. You do not need to, and it weakens protection for every app on your
Mac, not just this one.

## If it still will not open

- Check you are on **macOS 15 or later**.
- Make sure you dragged the app to **Applications** and are opening it from
  there, rather than running it from inside the disk image.
- Try downloading or copying the disk image again, in case the transfer was
  incomplete. If you were given a checksum, verify it.

## Related articles

- [Installing Onceaway](../getting-started/installing-onceaway.md)
- [Menu-bar icon problems](menu-bar-icon-problems.md)
