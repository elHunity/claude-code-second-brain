---
name: topic
description: Build or update a topic — a summary of one question across several sources. Triggers on /topic, "build a topic", "what did we decide about", "combine the sources", "make a summary". Argument — the question or topic name.
argument-hint: "<question or topic>"
allowed-tools: Bash, Read, Edit, Write, Glob, Grep, AskUserQuestion
user-invocable: true
---

# /topic — one question, one file

Sources answer "what did the source say". Topics answer "what did we decide from it". The value of the vault isn't
in retellings, it's in the links between sources — this layer holds them.

## Steps

**1. Phrase the question.** One file = one answerable question. Not "graphs" but "do we need a knowledge graph".
If it splits in two — make two files.

**2. Collect positions.** Find everything in `Sources/` that touches the question — by `answers:` in the index and by
grep. Read those notes whole. Look for **disagreements** first: a topic where every source agrees rarely decides
anything.

**3. Write the file.** `Topics/Topic — <question>.md`, frontmatter per `AGENTS.md`, `type: topic`.

```
# <Question>

> Short answer in two or three lines. Read instead of everything else.

## Positions
Who claims what and on what basis. Each position links to its source note.

## Our choice and why
What we do and for what reason. The reason is mandatory — otherwise in six months the choice can't be revisited
consciously.

## When to revisit
A concrete observable sign that the decision stopped being right. Not "when we grow" but "when the agent stops
finding notes that definitely exist".

## Links
```

**4. Keep it short.** Topics are read often. One screen. A topic over 8 KB usually hides two topics.

**5. Link back.** Add a link to the topic in `## Links` of every source note used. Links work both ways or the topic
isn't found from the source.

**6. Log and index:**

```
## [YYYY-MM-DD] topic | <question>

Which sources were combined, what choice was recorded.
```

## Done when

File in `Topics/`, short answer first, the choice has a reason, revisiting has an observable sign, links go both
ways, log and index updated.
