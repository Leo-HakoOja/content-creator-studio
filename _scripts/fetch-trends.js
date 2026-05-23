#!/usr/bin/env node
/**
 * Fetches trending YouTube videos using YouTube Data API v3
 * Usage: node _scripts/fetch-trends.js [keyword]
 * API key read from ~/.config/youtube-api/key  (path set in _config/integrations.md)
 */

const fs = require('fs')
const path = require('path')
const https = require('https')
const os = require('os')

const ROOT = path.join(__dirname, '..')
const KEYWORDS_PATH = path.join(ROOT, '_config', 'keywords.md')
const OUTPUT_PATH = path.join(ROOT, 'trends', 'latest.md')

function getApiKeyPath() {
  const config = fs.readFileSync(path.join(ROOT, '_config', 'integrations.md'), 'utf-8')
  const match = config.match(/API key location:\s*`([^`]+)`/)
  if (match) return match[1].replace('~', os.homedir())
  return path.join(os.homedir(), '.config', 'youtube-api', 'key')
}

function getApiKey() {
  const keyPath = getApiKeyPath()
  if (!fs.existsSync(keyPath)) {
    console.error(`API key not found at ${keyPath}`)
    console.error('See _scripts/README.md for setup instructions.')
    process.exit(1)
  }
  return fs.readFileSync(keyPath, 'utf-8').trim()
}

function getKeywordRotation() {
  const config = fs.readFileSync(KEYWORDS_PATH, 'utf-8')
  const match = config.match(/```json\n(\[[\s\S]+?\])\n```/)
  if (match) {
    try { return JSON.parse(match[1]) } catch {}
  }
  return ['content creator tips', 'video ideas']
}

function httpsGet(url) {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      let data = ''
      res.on('data', chunk => data += chunk)
      res.on('end', () => {
        try { resolve(JSON.parse(data)) }
        catch (e) { reject(new Error(`Parse error: ${data.slice(0, 200)}`)) }
      })
    }).on('error', reject)
  })
}

function fmtViews(n) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`
  return String(n)
}

async function fetchTrends(apiKey, query, days = 30) {
  const publishedAfter = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()
  const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&order=viewCount&publishedAfter=${publishedAfter}&maxResults=15&relevanceLanguage=en&key=${apiKey}`

  const searchRes = await httpsGet(searchUrl)
  if (searchRes.error) throw new Error(searchRes.error.message)

  const items = searchRes.items || []
  const videoIds = items.map(i => i.id?.videoId).filter(Boolean).join(',')

  let statsMap = {}
  if (videoIds) {
    const statsUrl = `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoIds}&key=${apiKey}`
    const statsRes = await httpsGet(statsUrl)
    for (const v of statsRes.items || []) {
      statsMap[v.id] = {
        views: parseInt(v.statistics?.viewCount || '0'),
        likes: parseInt(v.statistics?.likeCount || '0')
      }
    }
  }

  return items.map(item => ({
    id: item.id?.videoId,
    title: item.snippet?.title,
    channel: item.snippet?.channelTitle,
    url: `https://www.youtube.com/watch?v=${item.id?.videoId}`,
    published: item.snippet?.publishedAt?.split('T')[0],
    views: statsMap[item.id?.videoId]?.views || 0,
    likes: statsMap[item.id?.videoId]?.likes || 0,
    query
  }))
}

function buildMarkdown(results, query, fetchedAt) {
  const lines = [
    '# Trends — Latest Fetch',
    '',
    `Fetched: ${fetchedAt}  `,
    `Query: "${query}"  `,
    `Results: ${results.length}`,
    '',
    '> Save a trend: copy its block to `trends/saved/` as a new .md file, or ask Claude to save it.',
    '',
    '---',
    ''
  ]

  for (const r of results) {
    lines.push(`## ${r.title}`)
    lines.push('')
    lines.push(`**Channel:** ${r.channel}  `)
    lines.push(`**Views:** ${fmtViews(r.views)} | **Likes:** ${fmtViews(r.likes)} | **Published:** ${r.published}  `)
    lines.push(`**URL:** ${r.url}  `)
    lines.push(`**Query match:** ${r.query}  `)
    lines.push('')
    lines.push('**Why it might be relevant:**  ')
    lines.push('_(Claude: add your analysis here)_  ')
    lines.push('')
    lines.push('**Save?** `[ ]` Yes  `[ ]` No — reason: ____  ')
    lines.push('')
    lines.push('---')
    lines.push('')
  }

  return lines.join('\n')
}

async function main() {
  const apiKey = getApiKey()
  const keywords = getKeywordRotation()
  const query = process.argv[2] || keywords[new Date().getDate() % keywords.length]

  console.log(`Fetching trends for: "${query}"`)

  const results = await fetchTrends(apiKey, query)
  results.sort((a, b) => b.views - a.views)

  const fetchedAt = new Date().toISOString().replace('T', ' ').split('.')[0]
  const markdown = buildMarkdown(results, query, fetchedAt)

  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true })
  fs.writeFileSync(OUTPUT_PATH, markdown, 'utf-8')

  console.log(`Done. ${results.length} results → trends/latest.md`)
  results.slice(0, 3).forEach((r, i) => {
    console.log(`  ${i + 1}. ${r.title} (${fmtViews(r.views)}) — ${r.channel}`)
  })
}

main().catch(err => {
  console.error('Error:', err.message)
  process.exit(1)
})
