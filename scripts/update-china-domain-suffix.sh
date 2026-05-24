#!/usr/bin/env bash
set -euo pipefail

URL="https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/refs/heads/master/rule/Surge/ChinaMaxNoIP/ChinaMaxNoIP_All.list"
OUT="China_Domain_Suffix.list"
TMP="$(mktemp)"

curl -fsSL "$URL" \
  | grep '^DOMAIN-SUFFIX,' \
  | sed 's/^DOMAIN-SUFFIX,/\./' \
  | sort -u \
  > "$TMP"

mv "$TMP" "$OUT"

echo "Updated $OUT"
echo "Total lines: $(wc -l < "$OUT" | tr -d ' ')"
