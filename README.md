# Content Creator Studio — Template

A Claude Code-powered content production workspace for individual creators.
Drop this folder into a client project, fill in the `_config/` files, and it's live.

## What this is

A folder-based production system. Claude Code reads it, operates on it, and helps
the creator manage their pipeline — trend research, footage organisation, idea development,
and brief generation for their editing, design, and email tools.

No app. No database. No install beyond Node.js. Plain markdown files throughout.

## Setup

1. Copy this folder to your client project location
2. Fill in `_config/brand.md` — creator identity, aesthetic, voice
3. Fill in `_config/keywords.md` — their niche search vocabulary
4. Fill in `_config/content-methodology.md` — their framework (JVC, Colin and Samir, etc.)
5. Fill in `_config/integrations.md` — their tool stack and paths
6. Run `npm run setup` to verify everything is in order

## Daily use

Open in VS Code, start a Claude Code session, talk to it.

## Folder structure

```
content-creator-studio/
  CLAUDE.md                  ← Claude's operating instructions
  README.md                  ← This file
  _config/
    brand.md                 ← Creator identity, aesthetic, voice
    keywords.md              ← Niche keyword vocabulary
    content-methodology.md   ← Idea scoring and content framework
    integrations.md          ← Tool stack configuration
  _scripts/
    scan-footage.js          ← Indexes video files from a local folder
    fetch-trends.js          ← Pulls YouTube trends via API
    import-research.js       ← Imports CSV from research tools
    new-idea.js              ← Scaffolds a new idea file
    new-project.js           ← Scaffolds a new project folder
    generate-brief.js        ← Generates edit/thumbnail/email briefs
    setup.js                 ← First-run configuration check
    README.md                ← Script reference and API setup guide
  _templates/
    idea-template.md         ← Blank idea with methodology scaffold
    project-template.md      ← Blank project brief
  footage-library/
    _index.md                ← Auto-generated footage inventory
  trends/
    latest.md                ← Most recent trend fetch
    saved/                   ← Bookmarked trends
  ideas/
    _index.md                ← Idea pipeline at a glance
  projects/
    <project-name>/
      brief.md               ← Project brief
      edit-brief.md          ← For the editing tool
      thumbnail-brief.md     ← For the design tool
      email-brief.md         ← For the email tool
  output/                    ← Exported deliverables
```
