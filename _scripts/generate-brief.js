#!/usr/bin/env node
/**
 * Generates edit-brief.md, thumbnail-brief.md, and email-brief.md for a project
 * Usage: node _scripts/generate-brief.js <project-folder-name>
 */

const fs = require('fs')
const path = require('path')

const ROOT = path.join(__dirname, '..')

function readFile(p) {
  if (!fs.existsSync(p)) return null
  return fs.readFileSync(p, 'utf-8')
}

function extractField(content, field) {
  const match = content.match(new RegExp(`\\*\\*${field}:\\*\\*\\s*([^\\n]+)`))
  return match ? match[1].replace(/^_|_$/g, '').trim() : ''
}

function extractSection(content, heading) {
  const match = content.match(new RegExp(`## ${heading}\\n([\\s\\S]*?)(?=\\n## |$)`))
  return match ? match[1].trim() : ''
}

const projectName = process.argv[2]
if (!projectName) {
  console.error('Usage: node _scripts/generate-brief.js <project-folder-name>')
  const projects = fs.readdirSync(path.join(ROOT, 'projects'))
    .filter(f => fs.statSync(path.join(ROOT, 'projects', f)).isDirectory())
  if (projects.length) console.log('Available:', projects.join(', '))
  process.exit(1)
}

const projectDir = path.join(ROOT, 'projects', projectName)
if (!fs.existsSync(projectDir)) {
  console.error(`Not found: projects/${projectName}`)
  process.exit(1)
}

const briefContent = readFile(path.join(projectDir, 'brief.md'))
if (!briefContent) {
  console.error(`No brief.md in projects/${projectName}/`)
  process.exit(1)
}

const ideaFile = extractField(briefContent, 'Idea file')
const ideaContent = ideaFile ? readFile(path.join(ROOT, 'ideas', ideaFile)) : null
const clipRefs = [...briefContent.matchAll(/- Clip (\d+):\s*`([^`]+)`(?:\s*—\s*(.+))?/g)]
const today = new Date().toISOString().split('T')[0]

// ── EDIT BRIEF ────────────────────────────────────────────────────────────────
const editBrief = [
  '# Edit Brief',
  '',
  `**Project:** ${extractField(briefContent, 'Title')}  `,
  `**Platform:** ${extractField(briefContent, 'Platform') || '_(set in brief.md)_'}  `,
  `**Generated:** ${today}  `,
  '',
  '---',
  '',
  '## Concept',
  '',
  ideaContent
    ? (extractSection(ideaContent, 'Concept \\/ Description') || extractField(ideaContent, 'Description') || '_(see idea file)_')
    : (extractField(briefContent, 'Description') || '_(add concept to brief.md)_'),
  '',
  '## Hook (opening)',
  '',
  ideaContent ? (extractField(ideaContent, 'Hook') || '_(add hook to idea file)_') : '_(add hook to brief.md)_',
  '',
  '## Clips — in order',
  '',
  clipRefs.length > 0
    ? clipRefs.map((m, i) =>
        `### ${i + 1}. ${m[2]}\n\n**Clip ID:** ${m[1]}  \n**Notes:** ${m[3] || '_(none)_'}  `
      ).join('\n\n')
    : '_(No clips linked yet. In brief.md add lines like: `- Clip 42: \`filename.mp4\` — your notes`)_',
  '',
  '## Music mood',
  '',
  ideaContent ? (extractField(ideaContent, 'Music mood') || '_(not specified)_') : '_(not specified)_',
  '',
  '## CTA',
  '',
  '_(Fill in from _config/content-methodology.md CTA framework)_',
  '',
  '## Notes',
  '',
  extractField(briefContent, 'Edit notes') || '_(none)_',
].join('\n')

// ── THUMBNAIL BRIEF ───────────────────────────────────────────────────────────
const thumbnailConcept = ideaContent
  ? extractField(ideaContent, 'Thumbnail concept')
  : extractField(briefContent, 'Thumbnail concept')

const titleOptions = ideaContent ? extractSection(ideaContent, 'Title options') : ''

const thumbnailBrief = [
  '# Thumbnail Brief',
  '',
  `**Project:** ${extractField(briefContent, 'Title')}  `,
  `**Generated:** ${today}  `,
  '',
  '---',
  '',
  '## Concept',
  '',
  thumbnailConcept || '_(add thumbnail concept to idea file)_',
  '',
  '## Title options',
  '',
  titleOptions || '_(add title options to idea file)_',
  '',
  '## Brand palette reminder',
  '',
  '_(See _config/brand.md for colour palette and visual style rules)_',
  '',
  '## Thumbnail checklist',
  '',
  '- [ ] Clear focal element',
  '- [ ] Creates a question or curiosity in the viewer\'s mind',
  '- [ ] On-brand colours and aesthetic',
  '- [ ] Text (if any): under 5 words, readable at small size',
  '- [ ] Would this stop your own scroll?',
  '',
  '## Notes',
  '',
  '_(add your notes here before opening the design tool)_',
].join('\n')

// ── EMAIL BRIEF ───────────────────────────────────────────────────────────────
const emailBrief = [
  '# Email / Newsletter Brief',
  '',
  `**Project:** ${extractField(briefContent, 'Title')}  `,
  `**Video URL:** ${extractField(briefContent, 'Published URL') || '_(not published yet)_'}  `,
  `**Generated:** ${today}  `,
  '',
  '---',
  '',
  '## What this video is about',
  '',
  ideaContent
    ? (extractSection(ideaContent, 'Concept \\/ Description') || '_(see idea file)_')
    : '_(add description to brief.md)_',
  '',
  '## Subject line options (write in your voice)',
  '',
  '[ ] Option 1:',
  '[ ] Option 2:',
  '[ ] Option 3:',
  '',
  '## Products / links to feature',
  '',
  ideaContent ? (extractField(ideaContent, 'Products used') || '_(list anything featured in this video)_') : '_(list anything featured in this video)_',
  '',
  '## CTAs',
  '',
  '- [ ] Watch the video: [link]',
  '- [ ] [Primary CTA from content-methodology.md]',
  '- [ ] [Secondary CTA]',
  '',
  '## Audience segment',
  '',
  '_(Which segment / tag in your email tool?)_',
  '',
  '## Notes',
  '',
  '_(add your campaign notes before opening email tool)_',
].join('\n')

fs.writeFileSync(path.join(projectDir, 'edit-brief.md'), editBrief, 'utf-8')
fs.writeFileSync(path.join(projectDir, 'thumbnail-brief.md'), thumbnailBrief, 'utf-8')
fs.writeFileSync(path.join(projectDir, 'email-brief.md'), emailBrief, 'utf-8')

console.log(`Briefs generated for projects/${projectName}/`)
console.log('  ✓ edit-brief.md')
console.log('  ✓ thumbnail-brief.md')
console.log('  ✓ email-brief.md')
