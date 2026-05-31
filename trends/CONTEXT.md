# CONTEXT.md — trends/

## What happens here

Trend data is fetched, reviewed, and bookmarked here. `latest.md` is overwritten on every fetch. Saved trends are ones the creator has flagged as worth developing.

## Files

| File | Purpose |
|---|---|
| `latest.md` | Auto-generated on every `npm run trends` run — do not edit manually |
| `saved/<YYYY-MM-DD>-<slug>.md` | Creator-bookmarked trends; each file = one saved trend |
| `fetch.log` | Append-only log from the daily 7am systemd timer |

## Process

1. Fetch: `npm run trends` — reads keywords from `_config/keywords.md`, writes `latest.md`
2. Review: Summarise top 5–8 niche-relevant results (title, channel, views, why relevant)
3. Bookmark: Creator says "save that one" → copy relevant entry to `saved/<date>-<slug>.md` with a one-line creator note
4. Research: If creator wants a deep-dive on a trend, spawn the `trend-researcher` subagent

## Good output

- `latest.md` — 10–20 niche-relevant videos with title, channel, view count, upload date
- Saved trend file — includes original data plus creator's note on why they saved it
- Never invent trend data — only report what the API returned
