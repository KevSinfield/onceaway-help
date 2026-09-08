---
title: How to get an OpenAI API key
section: AI
order: 6
---

# How to get an OpenAI API key

A key takes a few minutes. You need an email address, and a card if you decide
to add credit.

*Last checked: 8 September 2026.*

## Before you start: a ChatGPT subscription is not the same thing

If you already pay for ChatGPT Plus or Pro, that covers ChatGPT. It does not
include API access, which is what Onceaway uses.

OpenAI bills API usage separately from a ChatGPT subscription, and credits in
ChatGPT are not API credits — they are different systems.

They are separate products. You can have one, both or neither.

## Step 1 — Open the OpenAI Platform

Go to [platform.openai.com](https://platform.openai.com).

This is OpenAI's developer platform. It is a different place from ChatGPT.

![The OpenAI Platform sign-in page. It asks for an email address, with
buttons to continue with Google, Apple, Microsoft or a phone
number.](../images/ai/openai/platform-signin.png)

## Step 2 — Sign in, or create an account

Use an existing OpenAI account, or make one. The same email you use for ChatGPT
is fine — the accounts are linked, the billing is not.

## Step 3 — Open the API keys page

Go to [platform.openai.com/api-keys](https://platform.openai.com/api-keys).

![The OpenAI Platform API keys page. The Create new secret key button sits
at the top right, above a row of filters.](../images/ai/openai/api-keys.png)

## Step 4 — Create the key

Press **+ Create new secret key**.

![The Create new secret key dialog. It has an Owned by control set to You, a
Name field, a Project menu, and a Permissions control set to
All.](../images/ai/openai/create-key.png)

**Owned by** — leave this at **You**. A service account key belongs to an
automation, not to a person.

**Name** — call it `Onceaway`.

**Project** — a new account has a default project. If you have several, pick
the one you want the usage billed against.

**Permissions** — leave this at **All**. Onceaway needs ordinary permission to
send a request; a read-only key cannot do it.

## Step 5 — Copy the key

OpenAI shows the key once. Copy it now and put it somewhere safe until you have
pasted it into Onceaway.

If you lose it, nothing is broken — delete that key and create another.

> **Screenshot:** The newly created secret key, with the key itself redacted.

## Step 6 — Set up billing

API usage is paid for separately from any ChatGPT subscription. Before requests
will work you need a payment method or prepaid credit on the API account:
**Settings → Billing**.

You are charged for what you use. A small amount goes a long way with
Onceaway, which sends a short request only when you press a button.

![The OpenAI Platform Billing page. It shows the API credit balance, painted
out here, with Buy credits and payment-method
options.](../images/ai/openai/billing.png)

## Step 7 — Put the key into Onceaway

1. Open Onceaway.
2. **Settings → AI**.
3. Under **AI provider**, choose **OpenAI**.
4. Paste the key into the **OpenAI API key** field.
5. Press **Save to Keychain**.

Leave the **Model** setting alone unless you have a reason to change it.
Onceaway starts on a sensible default and shows which model is in use. If you
want a different one, see [Choosing an AI model](choosing-an-ai-model.md).

![Onceaway's Settings window on the AI tab. The Provider control is set to
OpenAI, and the OpenAI API key field is
empty.](../images/onceaway/settings-ai-openai.png)

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

**I have ChatGPT Plus, so why doesn't my key work?**
A subscription and API access are separate. You need billing set up on the API
side as well.

**Onceaway says the key was rejected.**
Check that **OpenAI** is the selected provider, that the whole key was pasted,
that the key has not been deleted, and that the API account has a payment
method or credit.

**I have lost my key.**
Create a new one and delete the old one. Keys cannot be shown again.

## If the screen looks different

OpenAI changes the Platform from time to time. If something has moved, look for
the same **API keys** area, or check OpenAI's own documentation at
[developers.openai.com](https://developers.openai.com/api/docs/quickstart).

## Related articles

- [How do I add an API key?](adding-an-api-key.md)
- [Is AI required?](is-ai-required.md)
- [What does Onceaway send to AI?](what-does-onceaway-send-to-ai.md)
