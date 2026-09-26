---
name: inbox
description: Sort the Inbox folder — put everything dumped there into its place in the vault. Triggers on /inbox, "sort the inbox", "clean up the dump", "what's piled up". No argument sorts everything; with an argument, only matching items.
argument-hint: "[name filter]"
allowed-tools: Bash, Read, Edit, Write, Glob, Grep, AskUserQuestion
user-invocable: true
---

# /inbox — sort the inbox

`Inbox/` is a dump: things get thrown there without thinking so a thought isn't lost. Here it gets a place.

## Steps

**1. Look.** `ls -la Inbox/`, subfolders included. Empty — say so and stop.

**2. For each item decide what it is.** Read it, don't guess from the name.

| What it is | Where |
|---|---|
| Link to a video or article | `Archive/` as raw material, then a source note — only if I confirmed I need it |
| Transcript, export, PDF, long text | `Archive/`, then a source note |
| Fact about me or my projects | `Sources/Profile.md` |
| A thought or decision on a question | the matching `Topics/Topic — ….md` |
| Image, diagram, screenshot | `Attachments/`, linked from where it's needed; write the text on it into the note — the agent can't grep pixels |
| Duplicate of something that exists | say so, don't copy |
| Junk | **never delete silently** — show the list and ask |

**3. Group before placing.** Five notes about one thing are one topic, not five entries.

**4. Remove what you placed from the inbox**, leave what you left with a reason. The inbox must empty out, otherwise
it becomes a second archive.

**5. Log it.** One entry for the whole pass:

```
## [YYYY-MM-DD] ingest | inbox sorted: N items

What went where, one line per item. What stayed and why.
```

**6. Update the index** if new files appeared.

## Limits

- Deletion — only with my explicit confirmation. Ask with a list, wait for the answer.
- Don't write a full source note in this pass: sorting is placing. Say what's ready and stop.
- If an item is unclear — leave it and ask, don't invent a place for it.

## Done when

Inbox is empty or holds only what I said to keep. Log written, index matches.
