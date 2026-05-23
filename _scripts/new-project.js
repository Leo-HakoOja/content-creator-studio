#!/usr/bin/env node
/**
 * Scaffolds a new project folder with brief.md
 * Usage: node _scripts/new-project.js "Project Title"
 */

const fs = require('fs')
const path = require('path')

const ROOT = path.join(__dirname, '..')
const TEMPLATE_PATH = path.join(ROOT, '_templates', 'project-template.md')
const PROJECTS_DIR = path.join(ROOT, 'projects')

const title = process.argv.slice(2).join(' ').trim()
if (!title) {
  console.error('Usage: node _scripts/new-project.js "Project Title"')
  process.exit(1)
}

const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
const projectDir = path.join(PROJECTS_DIR, slug)

if (fs.existsSync(projectDir)) {
  console.error(`Already exists: projects/${slug}/`)
  process.exit(1)
}

let template = fs.readFileSync(TEMPLATE_PATH, 'utf-8')
template = template
  .replace(/\{\{TITLE\}\}/g, title)
  .replace(/\{\{DATE\}\}/g, new Date().toISOString().split('T')[0])

fs.mkdirSync(projectDir, { recursive: true })
fs.writeFileSync(path.join(projectDir, 'brief.md'), template, 'utf-8')

console.log(`Created: projects/${slug}/brief.md`)
console.log(`Next: fill in the brief, then run: node _scripts/generate-brief.js ${slug}`)
