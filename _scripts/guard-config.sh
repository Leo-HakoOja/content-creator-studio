#!/bin/bash
# Blocks Claude from editing _config/ files without creator approval.
# Called as a PreToolUse hook on Edit|Write.
f=$(jq -r '.tool_input.file_path // ""')
if echo "$f" | grep -q '_config/'; then
  printf '{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"deny","permissionDecisionReason":"_config/ is the studio source of truth (brand, keywords, methodology, integrations). Do not edit directly — tell the creator what needs changing and let them approve it."}}'
fi
