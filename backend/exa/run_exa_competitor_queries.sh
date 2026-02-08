#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

if [[ -f "$SCRIPT_DIR/.env" ]]; then
  # shellcheck disable=SC1091
  source "$SCRIPT_DIR/.env"
fi

if [[ -z "${EXA_API_KEY:-}" ]]; then
  echo "Error: EXA_API_KEY is not set. Put it in backend/.env or export it in your shell."
  exit 1
fi

if [[ $# -lt 1 ]]; then
  cat <<'USAGE'
Usage:
  backend/run_exa_competitor_queries.sh "CUSTOMER_ISSUE" [competitor1,competitor2,...]

Examples:
  backend/run_exa_competitor_queries.sh "Users cannot export dashboard as PDF from mobile app."
  backend/run_exa_competitor_queries.sh "Users cannot export dashboard as PDF from mobile app." "Intercom,Zendesk,Freshdesk"
USAGE
  exit 1
fi

ISSUE="$1"
COMPETITOR_CSV="${2:-Intercom,Zendesk,Freshdesk,Help Scout,Gorgias}"
IFS=',' read -r -a COMPETITORS <<<"$COMPETITOR_CSV"

build_payload() {
  local query="$1"
  python - "$query" <<'PY'
import json
import sys

query = sys.argv[1]
payload = {
    "query": query,
    "type": "auto",
    "num_results": 5,
    "contents": {"highlights": {"max_characters": 2000}},
}
print(json.dumps(payload))
PY
}

run_query() {
  local competitor="$1"
  local intent="$2"
  local query="$3"

  echo
  echo "=== $competitor | $intent ==="
  echo "query: $query"
  echo

  curl -sS -X POST "https://api.exa.ai/search" \
    -H "Content-Type: application/json" \
    -H "x-api-key: $EXA_API_KEY" \
    -d "$(build_payload "$query")" \
    > "$ROOT_DIR/backend/exa_${competitor// /_}_${intent// /_}.json"

  if command -v jq >/dev/null 2>&1; then
    jq -r '.results[]? | "- \(.title // "No title") | \(.url // "")"' \
      "$ROOT_DIR/backend/exa_${competitor// /_}_${intent// /_}.json"
  else
    echo "Saved response to backend/exa_${competitor// /_}_${intent// /_}.json"
  fi
}

for competitor in "${COMPETITORS[@]}"; do
  competitor="$(echo "$competitor" | xargs)"
  [[ -z "$competitor" ]] && continue

  run_query "$competitor" "help_center" "\"$competitor\" \"$ISSUE\" help center support"
  run_query "$competitor" "forum_workaround" "\"$competitor\" \"$ISSUE\" workaround forum community"
  run_query "$competitor" "release_notes_fix" "\"$competitor\" \"$ISSUE\" release notes changelog fixed"
  run_query "$competitor" "status_incident" "\"$competitor\" \"$ISSUE\" status incident outage"
  run_query "$competitor" "policy_limitation" "\"$competitor\" \"$ISSUE\" \"known limitation\" OR \"expected behavior\""
done

echo
echo "Done. Raw responses saved under backend/exa_*.json"
