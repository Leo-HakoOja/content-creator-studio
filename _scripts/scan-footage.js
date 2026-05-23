#!/usr/bin/env node
/**
 * Scans a footage folder and updates footage-library/_index.md
 * Usage: node _scripts/scan-footage.js [/path/to/footage]
 */

const fs = require('fs')
const path = require('path')

const ROOT = path.join(__dirname, '..')
const INDEX_PATH = path.join(ROOT, 'footage-library', '_index.md')
const VIDEO_EXTS = new Set(['.mp4', '.mov', '.avi', '.m4v', '.mkv', '.wmv', '.mts', '.m2ts'])

function getFootagePath() {
  if (process.argv[2]) return process.argv[2]
  const configPath = path.join(ROOT, '_config', 'integrations.md')
  const config = fs.readFileSync(configPath, 'utf-8')
  const match = config.match(/FOOTAGE_PATH=(.+)/)
  if (match && match[1].trim()) return match[1].trim()
  console.error('No footage path provided. Pass as argument or set FOOTAGE_PATH= in _config/integrations.md')
  process.exit(1)
}

function scanDir(dir) {
  const files = []
  try {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        files.push(...scanDir(full))
      } else if (entry.isFile() && VIDEO_EXTS.has(path.extname(entry.name).toLowerCase())) {
        const stat = fs.statSync(full)
        files.push({
          path: full,
          filename: entry.name,
          ext: path.extname(entry.name).toLowerCase().slice(1),
          size_mb: (stat.size / 1024 / 1024).toFixed(1),
          created: stat.birthtime.toISOString().split('T')[0]
        })
      }
    }
  } catch (e) {
    console.warn(`Could not read ${dir}: ${e.message}`)
  }
  return files
}

function loadExistingIndex() {
  if (!fs.existsSync(INDEX_PATH)) return []
  const content = fs.readFileSync(INDEX_PATH, 'utf-8')
  const records = []
  const blocks = content.split('\n## ').slice(1)
  for (const block of blocks) {
    const lines = block.split('\n')
    const id = lines[0].match(/^(\d+)\s/)?.[1]
    const pathMatch = block.match(/\*\*Path:\*\* `(.+)`/)
    const tagsMatch = block.match(/\*\*Tags:\*\* (.+)/)
    const notesMatch = block.match(/\*\*Notes:\*\* (.+)/)
    const statusMatch = block.match(/\*\*Status:\*\* (.+)/)
    if (id && pathMatch) {
      records.push({
        id: parseInt(id),
        path: pathMatch[1],
        tags: tagsMatch ? tagsMatch[1].replace(/`/g, '').trim() : '',
        notes: notesMatch ? notesMatch[1].trim() : '',
        status: statusMatch ? statusMatch[1].trim() : 'untagged'
      })
    }
  }
  return records
}

function buildIndex(files, existing) {
  const existingByPath = Object.fromEntries(existing.map(e => [e.path, e]))
  let nextId = existing.length > 0 ? Math.max(...existing.map(e => e.id)) + 1 : 1
  let newCount = 0

  const merged = files.map(f => {
    if (existingByPath[f.path]) return { ...existingByPath[f.path], ...f }
    newCount++
    return { id: nextId++, ...f, tags: '', notes: '', status: 'untagged' }
  })

  for (const old of existing) {
    if (!files.find(f => f.path === old.path)) merged.push({ ...old, status: 'missing' })
  }

  merged.sort((a, b) => a.id - b.id)

  const untaggedCount = merged.filter(c => c.status === 'untagged').length
  const taggedCount = merged.filter(c => c.status === 'tagged' || c.status === 'used').length

  const lines = [
    '# Footage Library Index',
    '',
    `Last scanned: ${new Date().toISOString().split('T')[0]}  `,
    `Total clips: ${merged.length} | Untagged: ${untaggedCount} | Tagged: ${taggedCount} | New this scan: ${newCount}`,
    '',
    '> **To tag a clip:** Find it below and edit the Tags line.',
    '> Define your own tag vocabulary in _config/brand.md',
    '',
    '---',
    ''
  ]

  for (const clip of merged) {
    lines.push(`## ${clip.id} ${clip.filename}`)
    lines.push('')
    lines.push(`**Path:** \`${clip.path}\`  `)
    lines.push(`**Size:** ${clip.size_mb} MB | **Created:** ${clip.created} | **Status:** ${clip.status}  `)
    lines.push(`**Tags:** ${clip.tags || '_(none — add tags here)_'}  `)
    lines.push(`**Notes:** ${clip.notes || '_(add notes here)_'}  `)
    lines.push('')
  }

  return { content: lines.join('\n'), newCount, total: merged.length }
}

const footagePath = getFootagePath()
console.log(`Scanning: ${footagePath}`)

const files = scanDir(footagePath)
const existing = loadExistingIndex()
const { content, newCount, total } = buildIndex(files, existing)

fs.mkdirSync(path.dirname(INDEX_PATH), { recursive: true })
fs.writeFileSync(INDEX_PATH, content, 'utf-8')

console.log(`Done. ${total} clips indexed. ${newCount} new. Index written to footage-library/_index.md`)
if (newCount > 0) {
  console.log(`\nNext: open footage-library/_index.md and tag the ${newCount} new clip(s).`)
}
