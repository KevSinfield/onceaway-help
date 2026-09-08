---
title: An AI request failed
section: Troubleshooting
order: 5
---

# An AI request failed

Onceaway tells you the request failed and changes nothing else. Nothing is
retried behind your back, and nothing is sent to a different provider.

## Work through these

**No network.** The request has to reach your provider. Check your connection
and try again.

**Provider outage.** Providers do have bad days. Check your provider's own
status page, and try again later.

**Wrong or expired key.** Keys get rotated, revoked, or pasted with a stray
space. Remove the key in **Settings → AI**, paste it again carefully, and save.

**Rate limited.** If you have made a lot of requests, or your account has a low
limit, the provider may refuse for a while. Wait and try again.

**Billing or account problem at the provider.** API access usually needs its
own arrangement, separate from any chat subscription. Check your account on the
provider's site.

**An unexpected response.** Occasionally a provider returns something Onceaway
cannot make sense of. Press **Try again**.

**Privacy Mode.** AI requests are unavailable while Onceaway is in a protected
context. Leave the protected context and try again.

## What a failure never does

It does not send your request to the other provider, does not partially
complete, and does not change any of your data.

## Related articles

- [Switching providers and failed requests](../ai/switching-providers-and-failed-requests.md)
- [AI says no key is configured](ai-says-no-key-is-configured.md)
- [Why does macOS ask for Keychain access?](../ai/keychain-access-prompts.md)
