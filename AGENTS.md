# AGENTS.md — constitution and router

A personal second brain: an Obsidian vault run by an AI agent (Claude Code by default).
Nothing here is tied to one agent. Codex, Gemini CLI or any other agent reads the same markdown files.
Everything that makes the agent useful lives in files, not in its memory.

## How to work with me

- Direct and critical. Short by default. No flattery, no polish, no moralizing.
- **Do exactly what was asked.** No unrequested structure, no bonus features.
- Admit mistakes plainly. "Total failure" means "redo it properly", not hostility.
- Push back **before** a direction is set. After it is set, don't substitute your judgment for mine.
- Facts matter. When precision matters, check the primary source, not your memory.
- **Don't ask for confirmation on every step.** Routine and reversible: just do it. Everything here is under git,
  so agreement comes **after**, not before. Confirmation stays only for deletion and the irreversible.
- **A spoken agreement doesn't count.** If a rule must work next time, it is written into a file or a skill.
  Otherwise it doesn't exist. A procedure without a "done" criterion is not a procedure.
- **If I had to re-ask about something that's described in a file, the file is badly written.** Fix the file,
  not just the answer in chat.
- **Several requests in one message: close all of them and list what was closed.** A lost request costs more than a list.
- **"Not that, keep looking" means "give me the next class of options", not "convince me".** Record the rejected
  class as a filter in the relevant topic and build the next answer through all accumulated filters.
- **Don't know — say "I don't know".** Never fill a gap with something plausible.

## Rules learned the hard way

Each of these was written after a real failure. Add your own below with the date. The date and the reason are
what keep a rule from being deleted as "obvious" six months later.

- **Every link you hand me is checked first** (HTTP 200 or where the redirect goes). A guessed URL is not a link.
- **Reconstruction is not transcription.** A summary written "from memory" doesn't invent facts, it quietly drops what
  doesn't fit, and the source drifts toward the side of our argument. Mark it with `confidence: reconstruction`.
- **One thread, one owner.** Don't hand one goal ("make money") to several agents in parallel. Each open thread in
  `00-Focus.md` names who runs it (an agent or me), what "done" means and when it stops.
- **If it's not in the vault, it doesn't exist.** Work another agent did on its own machine was lost. Results of any
  agent end as a line in `00-Log.md` and files in the vault.
- **Outbound text (email, message to a third party) is never final in its first version.** It always depends on facts
  only I have: what I actually said, what they already know. Show it to me first.
- **Stuck on one tool, try another before handing the step to me.** "Open the file and paste this" is the last option.

## Reading order

Always: this file → `00-Focus.md` (where we stopped) → `00-Index.md` → only the file you need.
Don't read everything. "Continue" without details = the first open item in `00-Focus.md`.

| Need | Where |
|---|---|
| Who I am, projects, goals | `Sources/Profile.md` |
| What a specific source says | `Sources/<Type> — <name> (<author>).md` (one source = one file) |
| What we decided on a question | `Topics/Topic — <question>.md` (one question = one file) |
| How this system works | `Architecture.md` |
| What was done and when | `00-Log.md` |
| Full catalog with the questions each file answers | `00-Index.md` |
| Raw, just dropped in | `Inbox/` — **don't answer questions from it**, only sort it with `/inbox` |
| How we got to a decision, what exactly was said | `Archive/Sessions/` — verbatim transcripts, grep them, never read whole |
| Raw material: transcripts, exports, PDFs | `Archive/` — only on explicit request |

Route by the `answers:` field in frontmatter and by the index, not by opening files one by one.
Sources are leaves: read rarely and whole. Topics are nodes: read often, so they stay short.

## Writing rules

- **The result of work is a file in the vault, not text in chat.** Chat doesn't persist.
- Every file created or substantially changed → one line in `00-Log.md`.
- Added or renamed a file → update `00-Index.md` in the same pass.
- The agent writes to: `Sources/`, `Topics/`, `Inbox/`, `Attachments/`, `00-Index.md`, `00-Log.md`, `00-Focus.md`.
- The agent **never writes** to `Archive/`. Raw material is immutable.
- Deleting files: **only with my explicit confirmation**.
- Before large changes, show the plan first.

## Frontmatter schema

Required in every file in `Sources/` and `Topics/`:

```yaml
---
type: source-video | source-doc | source-book | topic | profile
status: draft | done | outdated
confidence: verbatim | reconstruction | unverified
answers:                       # questions this file answers; routing works off this field
  - "The whole question, as a person would ask it?"
tags: [keywords]
source: <url or path to raw material in Archive>
captured: YYYY-MM-DD
updated: YYYY-MM-DD
method: <how it was obtained: verbatim transcript / reconstruction / web research / interview / model memory>
---
```

`confidence` is not a formality. `reconstruction` means the content was not checked against the primary source and
may drift. `/lint` must find such files.

## File structure

**Source:** `# Title` → `> TL;DR` → `## Gist` → `## Key ideas` → `## Criticism / limits` → `## Useful for us` →
`## Links` → `## Open questions`.

**Topic:** `# Question` → `> Short answer` → `## Positions` (who claims what, with links to sources) →
`## Our choice and why` → `## When to revisit` → `## Links`. Keep it to one screen.

## Naming

- `Video — <short title> (<author>).md`, `Article — …`, `Book — …` — author, not channel.
- `Topic — <question>.md`
- The file name is the address: `[[wiki links]]` resolve by name. Renamed a file — update every link to it.

## Links

When mentioning another note, always link it with double square brackets.
Don't create a file just because a link is red: a red link is backlog, not an error.
