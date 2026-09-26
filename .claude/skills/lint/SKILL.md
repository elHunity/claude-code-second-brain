---
name: lint
description: Check vault health — broken links, orphans, index vs. content, unverified and outdated notes, contradictions between sources. Triggers on /lint, "check the vault", "run lint", "is the brain ok", "any contradictions".
argument-hint: "[links | contradictions | all]"
allowed-tools: Bash, Read, Edit, Write, Glob, Grep, AskUserQuestion
user-invocable: true
---

# /lint — vault health check

Drift is invisible when you read a file. A note summarized "from memory" reads perfectly normal while holding claims
that aren't in the source. This skill exists so such things are found mechanically, not by luck.

## Steps

**1. Mechanical checks — script:**

```bash
node scripts/lint.mjs
```

It reports: empty files, broken `[[links]]` (code spans excluded), orphans, incomplete frontmatter, files missing from
`00-Index.md`. Separately it lists what needs attention but isn't an error: `confidence: reconstruction`,
`status: outdated`, unsorted inbox.

**2. Meaning checks — yourself.** The script can't do these.

- **Contradictions between sources.** Two notes claim different things about one subject. Often it's a reason for a
  `/topic`. Look where `answers:` and `tags:` overlap.
- **Stale content.** A note talks about a tool we dropped, a plan that's done. Read `updated:` together with content.
- **The index lies.** Numbers and statuses in `00-Index.md` differ from reality. The most expensive break: decisions
  are made from the index.
- **`answers:` don't answer.** Spot-check: take a question, find its answer in the body.

**3. Fix the obvious yourself.** Broken link, missing frontmatter field, file not in the index.

**4. Bring the contested to me.** Contradictions, stale notes, deletion candidates — a list with what exactly is wrong.
Don't decide for me what to throw away.

## Iteration limit

**Three passes max.** If problems remain after the third, stop and say which and why they don't fix.

## Log

One entry per run, even when clean:

```
## [YYYY-MM-DD] lint | N found, M fixed
```

## Done when

The script shows zero mechanical problems or an explained remainder. Meaning findings listed for me. Log written.
