---
name: capture
description: Record in the vault what we just discussed or decided. Triggers on /capture, "remember this", "write this down", "save this", "don't lose this". Argument — what to record, if it's not obvious from the conversation.
argument-hint: "[what to record]"
allowed-tools: Bash, Read, Edit, Write, Glob, Grep, AskUserQuestion
user-invocable: true
---

# /capture — turn what was said into a file

Chat doesn't persist. This skill moves what was said into a file.

## Steps

**1. Decide what to record.** The argument if given. Otherwise take from the conversation what will matter in six
months: a decision, a fact, a preference, a finding, a conclusion. Record the result and the reason, not the reasoning.

Drop: the momentary ("running the script now"), what's already in the vault, what follows from what's written.

**2. Decide where.** In order:

| What it is | Where |
|---|---|
| A fact about me, my projects, goals, preferences | `Sources/Profile.md`, the right section |
| A claim from a specific source | that source's note |
| A decision on a contested question, our choice | `Topics/Topic — ….md` — create or extend |
| A change to the system itself | `Architecture.md` |
| Unclear | `Inbox/YYYY-MM-DD — <short name>.md` — `/inbox` sorts it later |

Torn between two places — ask. Unsure whether it's worth it at all — put it in `Inbox/`.

**3. Write it.** Appending to an existing file — insert into the right section, not at the end. Update `updated:`.
New file — fill the whole schema from `AGENTS.md`, especially `answers:`: without it nobody finds the file.

**4. Log it.** One line at the bottom of `00-Log.md`:

```
## [YYYY-MM-DD] decision | short title

What was recorded and why, in one or two sentences. Where it went.
```

**5. Update the index** — only if you created a new file.

## Done when

File on disk, line in the log, index matches content. Reply in one line: what was recorded and where.
Don't retell the content back.
