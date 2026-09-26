# A second brain Claude Code can run — and a rulebook written from its mistakes

An Obsidian vault template where an AI agent (Claude Code, or any agent that reads `AGENTS.md`) keeps your notes,
decisions and sessions — and gets corrected in writing every time it gets something wrong.

I'm not a developer. For a week I ran my notes, research and a small side project through Claude Code inside one
markdown folder. It wrote emails, researched websites, summarized videos, built scripts and ran other agents.
It also summarized sources "from memory" so smoothly that four claims in one summary were not in the source at all.

Every mistake like that became a rule in `AGENTS.md`, with the date and the reason. This repo is that system with my
personal content removed.

## What's different from the other "Obsidian + Claude" templates

- **Rules come from failures, not from a best-practices list.** See "Rules learned the hard way" in `AGENTS.md`.
  Add yours the same way: what happened, the date, the rule.
- **`confidence:` on every note.** `verbatim`, `reconstruction` or `unverified`. We measured it: summaries the model
  wrote from memory didn't invent facts, they quietly dropped what didn't fit — on 5 files out of 5 we re-checked.
  The field makes that drift visible, and `/lint` lists every `reconstruction` file.
- **Routing by `answers:`, not by reading everything.** Each note lists the questions it answers; the index is built
  from those lists. Cold start is three reads: `AGENTS.md`, `00-Index.md`, one file.
- **`/harvest` at the end of a session.** It diffs what actually changed on disk (memory in a long session is
  unreliable), walks through seven categories (decisions, working rules, facts, findings, open questions, system
  changes, lessons) and copies the verbatim session transcript into `Archive/Sessions/`, so "why did we decide
  this?" has an answer six months later.
- **Plain markdown, no server, no vector DB, no plugin required.** Works with any agent that reads files.

## Quick start

1. Click **Use this template** (or download the zip) and open the folder in Obsidian.
2. Open the same folder in Claude Code: `cd your-vault && claude`.
3. Tell it who you are. It will write `Sources/Profile.md`.
4. Drop anything into `Inbox/` and run `/inbox`. Say "remember this" to run `/capture`.
5. Before closing a long session run `/harvest`.

Requirements: Claude Code, Node 18+ (for `/lint` and the transcript renderer), git. Obsidian is optional — it's just
a nice viewer for the same files.

## What's inside

```
AGENTS.md            constitution + router: how to work with you, where things live, the rules
CLAUDE.md            one line: @AGENTS.md (Claude Code reads CLAUDE.md, other agents read AGENTS.md)
00-Focus.md          handoff between chats: where we stopped, open threads, who owns each
00-Index.md          catalog: file → the questions it answers
00-Log.md            append-only history: what was done, when, why
Architecture.md      why the vault is built this way
Inbox/               dump anything here; the agent sorts it, never answers from it
Sources/             one source = one file (video, article, book, profile)
Topics/              one question = one file: positions, our choice, when to revisit
Attachments/         screenshots, drafts, files you send out
Archive/             raw, immutable: transcripts, exports, session logs (git-ignored)
.claude/skills/      /capture /inbox /topic /lint /harvest
scripts/lint.mjs     broken links, orphans, missing frontmatter, files missing from the index
```

## Skills

| Command | What it does |
|---|---|
| `/capture` | Turns what was just said into a file in the right place, logs it |
| `/inbox` | Sorts `Inbox/` into sources, topics, profile, attachments; asks before deleting anything |
| `/topic` | Builds one question from several sources: positions, our choice with the reason, a visible sign for when to revisit |
| `/lint` | Runs `scripts/lint.mjs`, then checks meaning: contradictions, stale notes, an index that lies. Max three passes |
| `/harvest` | End-of-session sweep + verbatim transcript into `Archive/Sessions/` + commit |

## Honest numbers

The side project this system ran has made $0 so far. The rules are the useful part, and that is what's shared here.

## More

Free: [25 copy-paste prompts for boring adult tasks](https://gorevoi.gumroad.com/l/jdkbqi) — bills, landlords,
insurance, cancellations. Same rule as here: each prompt tells you how to check the answer.

## License

MIT
