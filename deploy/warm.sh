#!/usr/bin/env bash
# Visits every public page in the sitemap, and the files each page loads, through your real
# domain. The Cloudflare Worker (deploy/worker) keeps an offline copy of everything it sees,
# so these pages still open when your Mac is off. Run it after a deploy (deploy.sh does) and
# after you publish a post or project:   ./deploy/warm.sh
#
# Copies are kept per Cloudflare location. This warms the location nearest to this Mac, which
# is also the one nearest to most of your visitors.
set -u
BASE="${1:-https://benlaguroun.com}"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

curl -fsS "$BASE/sitemap.xml" | grep -o '<loc>[^<]*' | sed 's/<loc>//; s/&amp;/\&/g' > "$TMP/pages.txt" || {
  echo "Could not read $BASE/sitemap.xml, nothing warmed."; exit 0; }

: > "$TMP/assets.txt"
n=0
while read -r page; do
  n=$((n + 1))
  curl -fsS "$page" -o "$TMP/page.html" || continue
  # CSS, scripts and optimised images this page loads
  grep -oE '/_next/(static|image)[^"'"'"' )\\]+' "$TMP/page.html" | sed 's/&amp;/\&/g' >> "$TMP/assets.txt"
done < "$TMP/pages.txt"

sort -u "$TMP/assets.txt" -o "$TMP/assets.txt"
a=$(wc -l < "$TMP/assets.txt" | tr -d ' ')
xargs -P 6 -I{} curl -fsS -o /dev/null "$BASE{}" < "$TMP/assets.txt" || true
echo "Warmed $n pages and $a files through $BASE."
