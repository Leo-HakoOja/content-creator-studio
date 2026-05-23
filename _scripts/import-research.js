#!/usr/bin/env node
/**
 * Imports a CSV export from a research tool (VidIQ, TubeBuddy, etc.) into trends/saved/
 * Usage: node _scripts/import-research.js path/to/export.csv [tool-name]
 */

const fs = require('fs')
const path = require('path')

const ROOT = path.join(__dirname, '..')

function parseCSV(content) {
  const lines = content.split('\n').filter(Boolean)
  if (lines.length < 2) return []
  const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim().toLowerCase())
  const col = (row, ...names) => {
    for (const name of names) {
      const i = headers.indexOf(name)
      if (i >= 0) return (row[i] || '').replace(/"/g, '').trim()
    }
    return ''
  }
  return lines.slice(1).map(line => {
    const row = line.split(',')
    const url = col(row, 'url', 'video url', 'link')
    const videoId = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/)?.[1] || ''
    return {
      title: col(row, 'title', 'video title', 'name'),
      channel: col(row, 'channel', 'channel name'),
      url: url || (videoId ? `https://www.youtube.com/watch?v=${videoId}` : ''),
      views: parseInt(col(row, 'views', 'view count') || '0') || 0,
      published: col(row, 'published', 'publish date', 'date'),
      tags: col(row, 'tags', 'keywords', 'keyword'),
      score: col(row, 'score', 'viidiq score', 'tubebuddy score', 'relevance')
    }
  }).filter(r => r.title)
}

function fmtViews(n) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`
  return String(n)
}

const csvPath = process.argv[2]
const toolName = process.argv[3] || 'research-import'

if (!csvPath) {
  console.error('Usage: node _scripts/import-research.js path/to/export.csv [tool-name]')
  process.exit(1)
}

const csv = fs.readFileSync(csvPath, 'utf-8')
const rows = parseCSV(csv)

if (rows.length === 0) {
  console.error('No rows parsed. Check that the CSV has a header row with recognisable column names (title, url, views, channel).')
  process.exit(1)
}

const date = new Date().toISOString().split('T')[0]
const outputPath = path.join(ROOT, 'trends', 'saved', `${toolName}-${date}.md`)
fs.mkdirSync(path.dirname(outputPath), { recursive: true })

const lines = [
  `# Research Import — ${toolName} — ${date}`,
  '',
  `Source: ${path.basename(csvPath)}  `,
  `Imported: ${rows.length} videos`,
  '',
  '---',
  ''
]

for (const r of rows) {
  lines.push(`## ${r.title}`)
  lines.push('')
  if (r.channel) lines.push(`**Channel:** ${r.channel}  `)
  lines.push(`**Views:** ${fmtViews(r.views)}${r.published ? ` | **Published:** ${r.published}` : ''}  `)
  if (r.url) lines.push(`**URL:** ${r.url}  `)
  if (r.tags) lines.push(`**Keywords:** ${r.tags}  `)
  if (r.score) lines.push(`**Score:** ${r.score}  `)
  lines.push('')
  lines.push('**Relevant?** `[ ]` Yes  `[ ]` No  ')
  lines.push('**Notes:** _(add your thoughts)_  ')
  lines.push('')
  lines.push('---')
  lines.push('')
}

fs.writeFileSync(outputPath, lines.join('\n'), 'utf-8')
console.log(`Imported ${rows.length} videos → trends/saved/${path.basename(outputPath)}`)
