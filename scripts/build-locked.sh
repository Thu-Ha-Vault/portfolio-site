#!/bin/bash
# Serialize sync/build runs when several agents work in this repo at once.
# Usage: scripts/build-locked.sh [sync] [build]   (default: build)
LOCK=/tmp/portfolio-site-build.lock
export PATH=/Users/pc/.local/node/bin:$PATH
cd "$(dirname "$0")/.."
for i in $(seq 1 600); do mkdir "$LOCK" 2>/dev/null && break; sleep 2; done
trap 'rmdir "$LOCK" 2>/dev/null' EXIT
steps="${@:-build}"
for s in $steps; do
  if [ "$s" = sync ]; then node scripts/sync-vault.mjs || exit 1; fi
  if [ "$s" = build ]; then npx astro build > /tmp/portfolio-build.log 2>&1; code=$?; grep -iE "error|warn" /tmp/portfolio-build.log | grep -v Shiki | tail -30; tail -3 /tmp/portfolio-build.log; [ $code -ne 0 ] && exit $code; fi
done
exit 0
