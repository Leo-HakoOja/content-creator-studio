# CONTEXT.md — _config/

## What happens here

Ground truth for the creator's brand, niche, methodology, and integrations. Claude reads these files — it does not modify them without an explicit instruction from the creator.

## Files

| File | Purpose |
|---|---|
| `brand.md` | Creator identity, voice, platform, content pillars |
| `keywords.md` | Primary and secondary niche keywords — used by `fetch-trends.js` |
| `content-methodology.md` | Idea development sequence, title formula, hook structure, scoring rubric |
| `integrations.md` | API key paths, footage folder path, external tool config |

## Process

1. Fill in all four files at onboarding (run `/ckm-brand` to scaffold `brand.md`)
2. Run `npm run setup` once to confirm API key and folder structure
3. Update when brand strategy, niche keywords, or integrations change
4. Never leave placeholder text — Claude stops working if `[CLIENT NAME]` is detected

## Good output

- `brand.md` — completed identity table, filled content pillars, no placeholders
- `keywords.md` — at least 5 primary keywords, 5+ secondary keywords
- `content-methodology.md` — filled scoring rubric with real criteria and threshold, title formula with examples
- `integrations.md` — API key path confirmed, footage path set
