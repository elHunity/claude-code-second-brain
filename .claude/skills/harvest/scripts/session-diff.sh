#!/usr/bin/env bash
# What really changed on disk in the session period — so /harvest doesn't rely on memory.
#
#   session-diff.sh                      today
#   session-diff.sh 2026-01-01 2026-01-02   several days (session crossed midnight)

set -u
cd "$(dirname "$0")/../../../.." || exit 1
DAYS=("$@"); [ ${#DAYS[@]} -eq 0 ] && DAYS=("$(date +%Y-%m-%d)")
FIRST="${DAYS[0]}"; LAST="${DAYS[${#DAYS[@]}-1]}"

echo "== 1. Uncommitted =="
git status --short
echo
echo "== 2. Commits $FIRST .. $LAST =="
git log --since="$FIRST 00:00" --until="$LAST 23:59" --format='%h %ad %s' --date=format:'%Y-%m-%d %H:%M'
echo
echo "== 3. Log entries =="
for d in "${DAYS[@]}"; do grep -F "## [$d]" 00-Log.md; done
echo
echo "== 4. Changed files the log doesn't mention (heuristic: by file name) =="
CHANGED=$( { git diff --name-only; git diff --name-only --cached; git ls-files --others --exclude-standard;
  git log --since="$FIRST 00:00" --until="$LAST 23:59" --name-only --format=; } | sort -u | grep -v '^$' )
LOG=$(cat 00-Log.md)
N=0
while IFS= read -r f; do
  [ -z "$f" ] && continue
  case "$f" in 00-Log.md|00-Index.md|00-Focus.md) continue;; esac
  name=$(basename "$f" .md)
  if ! printf '%s' "$LOG" | grep -qF "$name"; then echo "  $f"; N=$((N+1)); fi
done <<< "$CHANGED"
[ "$N" -eq 0 ] && echo "  none"
