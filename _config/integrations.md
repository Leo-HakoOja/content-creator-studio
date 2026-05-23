# Integration Configuration — [CLIENT NAME]

## Primary platform API

Platform: _(e.g. YouTube Data API v3, TikTok Research API)_  
API key location: `~/.config/[service-name]/key`  
Setup instructions: `_scripts/README.md`

Default search config:
- Max results per search:
- Default date range:
- Region / language:
- Sort order:

## Research import tool

Tool: _(e.g. VidIQ, TubeBuddy, SparkToro)_  
Integration type: CSV export  
Import command: `node _scripts/import-research.js path/to/export.csv`  
Output: `trends/saved/[tool]-[date].md`

## Footage folder

Set the footage path — used by scan-footage.js:

```
FOOTAGE_PATH=
```

Update this when the drive path changes.

## Design tool

Tool: _(e.g. Canva, Adobe Express, Figma)_  
Integration type: Manual — read brief alongside tool  
Brief file: `projects/<name>/thumbnail-brief.md`  
Optional brand kit URL:

```
DESIGN_BRAND_KIT_URL=
```

## Video editing tool

Tool: _(e.g. Filmora, Final Cut Pro, DaVinci Resolve, CapCut)_  
Integration type: Manual — read brief alongside tool  
Brief file: `projects/<name>/edit-brief.md`  
Optional projects folder:

```
EDITING_PROJECTS_PATH=
```

## Email / newsletter tool

Tool: _(e.g. Flodesk, Mailchimp, ConvertKit)_  
Integration type: Manual — read brief, paste into tool  
Brief file: `projects/<name>/email-brief.md`  
Default audience segment:

```
EMAIL_SEGMENT=
```

## Music tool

Tool: _(e.g. Epidemic Sound, Artlist, Musicbed)_  
Integration type: Manual — use `music_mood` field in idea file to search  

## AI tools

Tools in use: _(e.g. Claude Code, ChatGPT)_  
Role: Research assistant and production manager — not brand voice  
Rule: All AI-drafted copy requires creator review and approval before use
