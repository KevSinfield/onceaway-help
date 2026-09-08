---
title: How to get an Anthropic API key
section: AI
order: 5
---

# How to get an Anthropic API key

A key takes a few minutes. You need an email address, and a card if you decide
to add credit.

*Last checked: 8 September 2026.*

## Before you start: a Claude subscription is not the same thing

If you already pay for Claude Pro or Max, that covers the Claude apps and
website. It does not include API access, which is what Onceaway uses.

Anthropic puts it plainly: a paid Claude subscription "enhances your chat
experience but doesn't include access to the Claude API or Console."

They are separate products with separate billing. You can have one, both or
neither.

## Step 1 — Open the Claude Console

Go to [platform.claude.com](https://platform.claude.com).

This is Anthropic's developer console. It is a different place from the Claude
app you may already use.

> **Screenshot:** The Claude Console sign-in page at platform.claude.com.

## Step 2 — Sign in, or create an account

Use an existing Anthropic account, or make one. Signing in to the Console with
the same email you use for Claude is fine — the accounts are linked, the
billing is not.

## Step 3 — Open the API keys page

Go to **Settings → API keys**, or straight to
[platform.claude.com/settings/keys](https://platform.claude.com/settings/keys).

> **Screenshot:** The API keys page, with the Create key button.

## Step 4 — Create the key

Press **Create key**, then fill in the short form.

> **Screenshot:** The Create key dialog, showing the name, expiration, linked account and workspace fields.

**Name** — call it `Onceaway`, so you know later what it is for.

**Expiration** — you can choose 3 hours, 1 day, 7 days, 30 days, a custom
length, or **Never**. A key that expires stops working without warning, so
unless you have a reason to rotate it, **Never** is the simplest choice for a
key you keep on your own Mac.

**Linked account** — set this to yourself. That makes it a personal key, which
is what you want for your own machine.

**Workspace** — **choose a workspace here.** This one matters: a key that is
not tied to a workspace expects every request to name one, and Onceaway does
not. If your key does not work later and everything else looks right, this is
the first thing to check.

## Step 5 — Copy the key

Anthropic shows the key once. Copy it now and put it somewhere safe until you
have pasted it into Onceaway.

If you lose it, nothing is broken — delete that key and create another.

> **Screenshot:** The newly created key, with the key itself redacted.

## Step 6 — Add credit

API usage is paid for separately from any Claude subscription. Anthropic bills
API use against your Console organisation, and you top it up in advance:
**Settings → Billing**, then **Add funds**.

You are charged for successful requests. A small amount goes a long way with
Onceaway, which sends a short request only when you press a button.

> **Screenshot:** The Billing page, with the Add funds button. Balances and card details redacted.

## Step 7 — Put the key into Onceaway

1. Open Onceaway.
2. **Settings → AI**.
3. Under **AI provider**, choose **Anthropic**.
4. Paste the key into the **Anthropic API key** field.
5. Press **Save to Keychain**.

Leave the **Model** setting alone unless you have a reason to change it.

> **Screenshot:** Onceaway's Settings → AI pane, with Anthropic selected and the key field empty.

## Treat the key like a password

Anyone with your key can spend your credit.

- Do not share it, email it, or paste it into a support message — including to
  us.
- Onceaway keeps it in the macOS Keychain and never shows it back to you.
- If it is ever exposed, delete it on the API keys page and create another.

## Does this mean Onceaway is always talking to AI?

No. Adding a key does not start anything. Onceaway sends a request only when
you press a button asking for an interpretation or for reduction ideas, and it
shows you what it is sending first.

See [What does Onceaway send to AI?](what-does-onceaway-send-to-ai.md).

## If something goes wrong

**I have Claude Pro, so why doesn't my key work?**
A subscription and API access are separate. You need API credit as well.

**Onceaway says the key was rejected.**
Check that **Anthropic** is the selected provider, that the whole key was
pasted, that the key has not expired, and that it was created **for a
workspace** — see Step 4.

**I have lost my key.**
Create a new one and delete the old one. Keys cannot be shown again.

## If the screen looks different

Anthropic changes the Console from time to time. If something has moved, look
for the same **API keys** area under Settings, or check Anthropic's own
documentation at
[platform.claude.com/docs](https://platform.claude.com/docs/en/get-started).

## Related articles

- [How do I add an API key?](adding-an-api-key.md)
- [Is AI required?](is-ai-required.md)
- [What does Onceaway send to AI?](what-does-onceaway-send-to-ai.md)
