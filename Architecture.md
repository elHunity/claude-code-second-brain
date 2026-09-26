---
type: topic
status: done
confidence: verbatim
answers:
  - "How is this vault built and why?"
  - "Where does new material go?"
  - "What is the agent allowed to change?"
  - "When is it time to make the system more complex?"
tags: [architecture, routing]
---

# Architecture

> Four layers — raw, sources, topics, router — plus an inbox and a log. The agent routes by the `answers:` field
> in frontmatter instead of reading files one by one. Everything is local markdown: no vectors, no server.
> Not tied to any agent: it's a folder of text files.

## Layers

**Raw — `Archive/`.** Transcripts, exports, PDFs, session logs. Immutable: read, never change. The source of truth
you can go back to and re-check any claim against.

**Sources — `Sources/`.** One source = one file: what it says, with quotes and timestamps, plus criticism and what's
useful for us. A leaf: opened rarely, read whole.

**Topics — `Topics/`.** One question = one file: what we decided and why, with links to sources. A node: opened
often, so it's short. This is the point of the vault — the value is not in retelling sources, it's in the links
between them.

**Router — `AGENTS.md` + `00-Index.md`.** The first says how to work and where things are. The second is a catalog
"file → questions it closes". Cold start: router, index, one file. Three reads.

**Inbox — `Inbox/`.** A dump. Drop without thinking, sort later. Without this layer capture fails: if saving a thought
requires deciding where it goes, the thought isn't saved. The inbox is **outside answers**: the agent sorts it but
never answers from it — otherwise it picks a source out of an unsorted pile and confidently lies.

**Log — `00-Log.md`.** Append-only. What, when, why. Needed to understand in six months where a file came from.

## Routing

Frontmatter is written for the agent, not for a human. The key field is `answers:` — the questions a file answers.
The index is built from these lists, so the agent picks a file without opening files.

The second key field is `confidence:`. It separates "checked against the source" from "retold from a description".
Without it drift is invisible: a file reads equally confident no matter where its wording came from.

## Three operations

**Ingest.** A source goes into `Archive/`, a note is written from it. One source at a time.

**Query.** Router → index → file. A good answer produced during a query is written back into the vault: research
accumulates instead of burning with the chat.

**Lint.** Broken links, orphans, index vs. content, `confidence: reconstruction` files, contradictions, stale notes.
Three passes max, then escalate to the human with the reason named.

## When to add complexity

Not before a concrete, observed failure. "The agent can't find a note that definitely exists" is a reason to add
search. "It would be cool to have a graph" is not.
