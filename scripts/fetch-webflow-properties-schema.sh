#!/usr/bin/env bash
# Fetches Webflow v2 collection metadata (includes field schema) for Properties.
# Requires NEXT_PUBLIC_WEBFLOW_API_TOKEN in src/.env.local
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ENV_FILE="${ROOT}/src/.env.local"
COLLECTION_ID="6593ed11d5ad65d107dfe7af"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "Missing ${ENV_FILE}" >&2
  exit 1
fi

# shellcheck disable=SC1090
TOKEN="$(grep -E '^NEXT_PUBLIC_WEBFLOW_API_TOKEN=' "$ENV_FILE" | cut -d= -f2-)"
if [[ -z "${TOKEN}" ]]; then
  echo "NEXT_PUBLIC_WEBFLOW_API_TOKEN not set in ${ENV_FILE}" >&2
  exit 1
fi

URL="https://api.webflow.com/v2/collections/${COLLECTION_ID}"
if command -v jq >/dev/null 2>&1; then
  curl -sS -H "Authorization: Bearer ${TOKEN}" -H "accept: application/json" "$URL" | jq .
else
  curl -sS -H "Authorization: Bearer ${TOKEN}" -H "accept: application/json" "$URL"
fi
