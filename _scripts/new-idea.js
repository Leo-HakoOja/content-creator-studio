#!/usr/bin/env node
/**
 * Scaffolds a new content idea file from the idea template
 * Usage: node _scripts/new-idea.js "Video Idea Title"
 */

const fs = require('fs')
const path = require('path')

const ROOT = path.join(__dirname, '..')
const TEMPLATE_PATH = path.join(ROOT, '_templates', 'idea-template.md')
const IDEAS_DIR = path.join(ROOT, 'ideas')

const title = process.argv.slice(2).join(' ').trim()
if (!title) {
  console.error('Usage: node _scripts/new-idea.js "Your Video Title"')
  process.exit(1)
}

const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
const outputPath = path.join(IDEAS_DIR, `${slug}.md`)

if (fs.existsSync(outputPath)) {
  console.error(`Already exists: ideas/${slug}.md`)
  process.exit(1)
}

let template = fs.readFileSync(TEMPLATE_PATH, 'utf-8')
template = template
  .replace(/\{\{TITLE\}\}/g, title)
  .replace(/\{\{DATE\}\}/g, new Date().toISOString().split('T')[0])
  .replace(/\{\{SLUG\}\}/g, slug)

fs.mkdirSync(IDEAS_DIR, { recursive: true })
fs.writeFileSync(outputPath, template, 'utf-8')

console.log(`Created: ideas/${slug}.md`)
console.log(`Next: fill in the idea file, then ask Claude to score it.`)
