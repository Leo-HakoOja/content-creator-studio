#!/usr/bin/env node
/**
 * First-run setup check
 * Usage: node _scripts/setup.js
 */

const fs = require('fs')
const path = require('path')
const os = require('os')

const ROOT = path.join(__dirname, '..')

let errors = 0
let warnings = 0

function ok(msg)   { console.log(`  ✓  ${msg}`) }
function warn(msg) { console.log(`  ⚠  ${msg}`); warnings++ }
function fail(msg) { console.log(`  ✗  ${msg}`); errors++ }

console.log('\nContent Creator Studio — Setup Check\n')

// Node version
const [major] = process.versions.node.split('.').map(Number)
if (major >= 18) {
  ok(`Node.js ${process.versions.node}`)
} else {
  fail(`Node.js ${process.versions.node} — needs v18 or newer. Install from nodejs.org`)
}

// Required folders
const requiredDirs = ['_config', '_scripts', '_templates', 'footage-library', 'trends/saved', 'ideas', 'projects', 'output']
for (const dir of requiredDirs) {
  const full = path.join(ROOT, dir)
  if (fs.existsSync(full)) {
    ok(`Folder: ${dir}/`)
  } else {
    fs.mkdirSync(full, { recursive: true })
    ok(`Folder created: ${dir}/`)
  }
}

// API key
const configPath = path.join(ROOT, '_config', 'integrations.md')
if (fs.existsSync(configPath)) {
  const config = fs.readFileSync(configPath, 'utf-8')
  const match = config.match(/API key location:\s*`([^`]+)`/)
  if (match) {
    const keyPath = match[1].replace('~', os.homedir())
    if (fs.existsSync(keyPath)) {
      ok(`API key found at ${keyPath}`)
    } else {
      warn(`API key not found at ${keyPath}\n       See _scripts/README.md for setup instructions.`)
    }
  } else {
    warn('API key location not set in _config/integrations.md')
  }
}

// Footage path
if (fs.existsSync(configPath)) {
  const config = fs.readFileSync(configPath, 'utf-8')
  const match = config.match(/FOOTAGE_PATH=(.+)/)
  if (match && match[1].trim()) {
    const footagePath = match[1].trim()
    if (fs.existsSync(footagePath)) {
      ok(`Footage path accessible: ${footagePath}`)
    } else {
      warn(`Footage path set but not accessible: ${footagePath}`)
    }
  } else {
    warn('Footage path not set. Edit _config/integrations.md and set FOOTAGE_PATH=')
  }
}

// Config files
const requiredConfigs = ['brand.md', 'keywords.md', 'content-methodology.md', 'integrations.md']
for (const f of requiredConfigs) {
  fs.existsSync(path.join(ROOT, '_config', f))
    ? ok(`Config: _config/${f}`)
    : fail(`Missing config: _config/${f}`)
}

// Templates
for (const t of ['idea-template.md', 'project-template.md']) {
  fs.existsSync(path.join(ROOT, '_templates', t))
    ? ok(`Template: _templates/${t}`)
    : fail(`Missing template: _templates/${t}`)
}

console.log('')
if (errors === 0 && warnings === 0) {
  console.log('All checks passed.')
} else if (errors === 0) {
  console.log(`Ready with ${warnings} warning(s). See above.`)
} else {
  console.log(`${errors} error(s), ${warnings} warning(s). Fix errors before use.`)
}

console.log('\nCommands:')
console.log('  npm run scan [/path]       Scan footage folder')
console.log('  npm run trends ["keyword"] Fetch YouTube trends')
console.log('  npm run import file.csv    Import research CSV')
console.log('  npm run new-idea "Title"   Create a new idea')
console.log('  npm run new-project "Title" Create a new project')
console.log('  npm run brief <folder>     Generate all briefs\n')
