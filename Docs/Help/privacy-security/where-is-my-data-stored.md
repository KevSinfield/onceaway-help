---
title: Where is my data stored?
section: Privacy & Security
order: 7
---

# Where is my data stored?

On your Mac, in a local database that belongs to you.

## The location

Onceaway keeps its activity history in your own Library folder, in an
application-support directory named after the app. The folder and the database
inside it are readable only by your user account.

## What is kept there

- Observed activity history.
- Your Pattern reviews and any labels you wrote.
- Your opportunity preferences.

## What is not kept there

Your API key is never stored in this database, in your preferences, or in a
log. It lives in the macOS Keychain. See
[Your API key](../ai/your-api-key.md).

AI suggestions are not stored anywhere at all — they last for the session and
then they are gone.

## How long history is kept

**Settings → Privacy → Activity History** lets you keep history for 7, 30 or 90
days. The default is 30.

That setting covers **observed activity**: apps coming to the front, coarse
file events, browser hostnames. Anything older than your window is removed
automatically — when Onceaway opens, and about once a day while it stays open,
so leaving your Mac running for a month does not quietly keep more than you
asked for.

It does not cover the decisions **you** made. A Pattern you confirmed, a name
you gave it, and your answer to "would you like this reduced?" are yours rather
than something Onceaway observed, so they are kept until you clear them. You
never see one on its own: a review only appears attached to a Pattern that is
happening now, so an old one sits unused rather than showing you something that
is no longer true.

"7 days" means seven times twenty-four hours, counted back from now. It is not
affected by the clocks changing or by moving between timezones.

### Choosing a shorter window

Shortening the window — 90 days to 30, say — deletes the activity that no
longer fits, straight away. Onceaway asks first, because that cannot be undone.
Choosing a longer window later does not bring anything back; it only starts
keeping more from that point on.

## Deleting it yourself

Two actions, in **Settings → Privacy**:

**Clear Activity History…** deletes your observed activity, your saved Pattern
reviews and your opportunity preferences. Your Never Observe list, your API key
and your other settings are kept.

**Remove Onceaway Data…** is the full reset: history, reviews, every setting,
your notification choices, Launch at Login and your API key in the Keychain.
Onceaway then quits, and opening it again is a first run.

See [Uninstalling Onceaway and removing your data](uninstalling-onceaway.md).

## Related articles

- [Uninstalling Onceaway and removing your data](uninstalling-onceaway.md)
- [Is my activity sent anywhere?](is-my-activity-sent-anywhere.md)
- [Your API key](../ai/your-api-key.md)
- [What does Onceaway observe?](what-does-onceaway-observe.md)
