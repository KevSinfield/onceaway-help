---
title: Choosing an AI model
section: AI
order: 7
---

# Choosing an AI model

Each provider offers several models. **Settings → AI** lets you pick one from
a short list.

*Last checked: 8 September 2026.*

## The short answer

Leave it alone. Onceaway marks one model as its default for each provider, and
that is the one it starts on. It was chosen to be capable enough for the two
small jobs Onceaway asks of AI, without being the most expensive option.

Everything below is for when you want something different.

## What Onceaway asks a model to do

Two things, both only when you press a button:

- describe a repeated pattern in plain words,
- suggest ways you might reduce it.

Both are short requests. Neither needs a model that can write a novel or debug
a codebase, which is why the default is a middle option rather than the
strongest one.

## The list

Three per provider, ordered the same way: lower cost, balanced, more capable.

**Anthropic** — Claude Haiku 4.5, Claude Sonnet 5, Claude Opus 5.
Claude Sonnet 5 is Onceaway's default.

**OpenAI** — GPT-5.6 Luna, GPT-5.6 Terra, GPT-5.6 Sol.
GPT-5.6 Terra is Onceaway's default.

Each shows a one-line description under it, and the one Onceaway starts on is
marked **Onceaway default**.

The list is short on purpose. It is not everything the providers offer — it is
a few options that make sense for what Onceaway does.

## Will a different model be better?

Possibly, for some patterns. Onceaway does not claim to know. It has no
measurements of its own yet, so the descriptions in Settings say only what the
providers themselves publish about each model: which is faster, which costs
less, which is more capable.

If you try a different one and prefer what it says, keep it.

## Model availability depends on your account

A model appearing in Onceaway's list does not mean your API account can use
it. Providers make some models available to some accounts and not others.

If you choose one your account cannot use, the next AI request fails and
Onceaway shows you the provider's answer. It does not change your choice, and
it does not quietly send the request to a different model instead. Check with
your provider which models your account can reach.

## Each provider remembers its own choice

The model belongs to the provider, not to Onceaway. Choosing Claude Opus 5 and
then switching to OpenAI shows OpenAI's list and OpenAI's own selection.
Switching back brings your Anthropic choice with it. An Anthropic model can
never end up being sent to OpenAI, or the other way round.

## Advanced: a model ID you type

If you need a model that is not on the list, turn on **Use a custom model ID**
in Settings → AI and type the identifier exactly as your provider writes it.

- Onceaway cannot check it. If the provider does not recognise it, the request
  fails when you next ask for AI.
- Switching Advanced back off returns you to the last model you chose from the
  list, and keeps what you typed for next time.
- **Use Onceaway default** goes back to the starting choice at any point.

## Onceaway never changes model on its own

Whatever is selected is what Onceaway asks the provider to use. There is no
automatic switching, no picking a cheaper model for an easy request, and no
retrying on a different model when one fails.

## Related articles

- [How do I choose an AI provider?](choosing-an-ai-provider.md)
- [Which AI providers does Onceaway support?](which-ai-providers-are-supported.md)
- [What does Onceaway send to AI?](what-does-onceaway-send-to-ai.md)
- [Switching providers, and what happens if a request fails](switching-providers-and-failed-requests.md)
