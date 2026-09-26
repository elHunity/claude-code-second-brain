---
name: harvest
description: Before closing a session, collect everything valuable from it into the vault and copy the verbatim transcript into Archive. A category-by-category sweep plus a mechanical check of the log against real file changes. Triggers on /harvest, "wrap up the session", "what from this session should be saved", "save the transcript", "we're closing".
argument-hint: "[YYYY-MM-DD if not today]"
allowed-tools: Bash, Read, Edit, Write, Glob, Grep, AskUserQuestion
user-invocable: true
---

# /harvest — collect the session

A long session holds hundreds of decisions; a small part reaches files, and not the most important part. Architecture
lands by itself because it *is* the work. What gets lost: a working rule dropped in passing, a rejected option with
its reason, "the source lied".

**This skill doesn't trust the agent's memory.** In a long session memory has holes, and after a context compaction
part of the conversation is physically invisible. So: mechanical check first, then the category sweep, only then
what the agent remembers.

## Step 1. Mechanical check

```bash
bash .claude/skills/harvest/scripts/session-diff.sh            # today
bash .claude/skills/harvest/scripts/session-diff.sh 2026-01-01 2026-01-02   # session crossed midnight
```

Shows: uncommitted changes, commits in the period, log entries in the period, changed files the log doesn't mention.
The first three are facts. The last is a heuristic (matching by file name) — check flags by eye.

**If there was a context compaction — say so here, out loud.** Not "I'll try to remember" but "part of the session
is invisible to me". Then the human adds what was lost.

## Step 2. Category sweep

Go through **all seven**, in order. Give a result for each, even "none" — silence means the category was skipped.

| # | Category | What to look for |
|---|---|---|
| 1 | **Decisions** | What was chosen and **why**. Separately — what was rejected and why: in six months the reason for rejecting is worth more than the choice |
| 2 | **Working rules** | How to work with me. What annoys me, what I prefer, what not to do. Surfaces in one sentence and gets lost most often |
| 3 | **Facts about me and projects** | New things not in the profile: tools, circumstances, plans, numbers |
| 4 | **Findings** | What turned out different than thought. Where a source lied. What didn't work and why |
| 5 | **Open questions** | Unresolved. Promised and not done. Postponed, and on what condition we return |
| 6 | **System changes** | New files, folders, skills, settings, rules. Check against step 1 |
| 7 | **Lessons** | A dead end and the way out, a bug and its cause, an unexpected limit of the environment |

## Step 3. Filter

**Always record:** any rule starting with "always" or "never"; **any reason for rejecting an option**; any mismatch
between a source and what the vault says; any bug or dead end with its cause.

**Don't record:** the momentary ("running now"), what follows from what's written, retellings of files changed in this
same session — they're on disk.

## Step 4. Write, then show

**Don't ask permission first.** Write, then show a list by category: one line per item, **what** and **where it went**.
Everything is under git — any entry is one command to undo. Ask first only for deletion or overwriting.

## Step 5. Copy the transcript

```bash
bash .claude/skills/harvest/scripts/archive-session.sh "short session name"
```

Puts two files into `Archive/Sessions/`: the raw `.jsonl` (source of truth) and a readable `.md` (dialogue without tool
output). The log answers "what we decided"; the transcript answers "how we got there".

## Step 6. Log, focus, commit

One entry in `00-Log.md` for the whole harvest, plus a row in the "entries ↔ transcripts" table at the top of the log.
Rewrite `00-Focus.md` whole: main thing now, open threads with owner and next step, unanswered questions, don't-redo.
Check: a new chat that reads only `AGENTS.md` and `00-Focus.md` knows where to start.

```bash
node scripts/lint.mjs
git add -A && git commit -q -m "Harvest <date>: <what the session was about>" && git push -q
```

Fix lint problems that appeared **in this session**; name older ones by count, don't fix them here.
The commit is the undo layer, the push is the off-disk copy. If push fails — say so, don't stay silent.

## Done when

Script run, unmentioned files sorted, all seven categories named with a result, list of what was written shown,
log and focus updated, transcript copied, lint run, committed. If there was a compaction — it was said out loud.

Speak like a human: not "five harvest items" but "found five things that were said but never reached a file".
