# Scripts Reference

All scripts run with Node.js — no install required.

| Script | Command | What it does |
|---|---|---|
| setup.js | `npm run setup` | First-run check — confirms configuration |
| scan-footage.js | `npm run scan [/path]` | Scans footage folder, updates footage-library/_index.md |
| fetch-trends.js | `npm run trends ["keyword"]` | Fetches YouTube trends, writes trends/latest.md |
| import-research.js | `npm run import file.csv [tool]` | Imports research CSV to trends/saved/ |
| new-idea.js | `npm run new-idea "Title"` | Scaffolds a new idea file |
| new-project.js | `npm run new-project "Title"` | Scaffolds a new project folder |
| generate-brief.js | `npm run brief <folder>` | Generates edit, thumbnail, and email briefs |

---

## YouTube API Key Setup

Required for `fetch-trends.js`.

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a project → search for **YouTube Data API v3** → Enable it
3. Go to **Credentials** → **+ Create Credentials** → **API key**
4. Copy the key
5. In Terminal:
   ```
   mkdir -p ~/.config/youtube-api
   echo "PASTE_KEY_HERE" > ~/.config/youtube-api/key
   chmod 600 ~/.config/youtube-api/key
   ```
6. Update `_config/integrations.md` if using a different path
7. Run `npm run setup` to confirm

Free tier: 10,000 quota units/day — sufficient for daily trend searches.

---

## Adding new integrations

To add support for a new tool:
1. Add a section to `_config/integrations.md` describing how it's used
2. If it needs a script, add the script to `_scripts/`
3. Update `package.json` scripts if needed
4. Update `CLAUDE.md` integration quick reference table
