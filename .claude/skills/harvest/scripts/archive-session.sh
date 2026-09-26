#!/usr/bin/env bash
# Copies a Claude Code session transcript into Archive/Sessions before Claude Code cleans it up.
# Writes two files: the raw .jsonl (source of truth) and a readable .md (dialogue without tool output).
#
#   archive-session.sh                      current session
#   archive-session.sh "session name"       current session, named
#   archive-session.sh --list               sessions Claude Code still keeps for this folder
#   archive-session.sh --from <file> "name" a specific past session
#
# Claude Code writes transcripts line by line to ~/.claude/projects/<project>/<uuid>.jsonl and keeps them for
# cleanupPeriodDays (default 30 — raise it in settings if you want older sessions).

set -u
cd "$(dirname "$0")/../../../.." || exit 1

DEST="Archive/Sessions"
DAY=$(date +%Y-%m-%d)
mkdir -p "$DEST"

# Project folder name is the vault path with separators replaced by dashes.
VAULT=$(pwd)
PROJ="$HOME/.claude/projects/$(printf '%s' "$VAULT" | sed 's|[/\\:. ]|-|g')"
[ -d "$PROJ" ] || PROJ=$(dirname "$(ls -t "$HOME"/.claude/projects/*/*.jsonl 2>/dev/null | head -1)")

if [ "${1:-}" = "--list" ]; then
  echo "Sessions Claude Code still keeps ($PROJ):"
  for f in $(ls -t "$PROJ"/*.jsonl 2>/dev/null); do
    printf '  %s  %6s  %s\n' "$(date -r "$f" +%Y-%m-%d\ %H:%M)" "$(du -h "$f" | cut -f1)" "$(basename "$f")"
  done
  exit 0
fi

if [ "${1:-}" = "--from" ]; then
  SRC="${2:?give a .jsonl file}"
  [ -f "$SRC" ] || SRC="$PROJ/$2"
  set -- "${3:-session}"
else
  SRC=$(ls -t "$PROJ"/*.jsonl 2>/dev/null | head -1)   # newest = current session
fi

if [ -z "${SRC:-}" ] || [ ! -f "$SRC" ]; then
  echo "ERROR: transcript not found ($PROJ). See: archive-session.sh --list"
  exit 1
fi

SLUG="${1:-session}"
BASE="$DEST/$DAY — $SLUG"
cp "$SRC" "$BASE.jsonl"
echo "raw:      $BASE.jsonl"

if command -v node >/dev/null 2>&1; then
  node .claude/skills/harvest/scripts/render-session.mjs "$BASE.jsonl" "$BASE.md" "$SLUG"
  echo "readable: $BASE.md"
else
  echo "node not found — readable version not built, raw file saved"
fi

echo "The transcript is written as the session goes: this copy holds everything UP TO NOW."
echo "More work after this? Run the script again before closing."
