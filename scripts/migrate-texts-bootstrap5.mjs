/**
 * Fase 6.5 - Texts & Overflows Migration: PrimeFlex -> Bootstrap 5 (Lotes 1 y 2)
 * 
 * Lote 1: Desbordamientos (white-space-nowrap, text-overflow-ellipsis)
 * Lote 2: Textos Semánticos (text-color, text-color-secondary)
 * 
 * Uso: node scripts/migrate-texts-bootstrap5.mjs [--dry-run]
 */
import { readFileSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';
import { resolve } from 'path';

const DRY_RUN = process.argv.includes('--dry-run');
const ROOT = resolve(process.cwd(), 'appsweb/angular/src/app');

function findHtmlFiles(dir) {
  const result = execSync(
    `powershell -Command "Get-ChildItem -Path '${dir}' -Filter '*.html' -Recurse | Select-Object -ExpandProperty FullName"`,
    { encoding: 'utf-8' }
  );
  return result.trim().split('\n').filter(Boolean).map(f => f.replace(/\r/g, '').trim());
}

// Order matters: more specific patterns first
const REPLACEMENTS = [
  // Lote 1 - Desbordamientos
  [/\bwhite-space-nowrap\b/g, 'text-nowrap', 'white-space-nowrap -> text-nowrap'],
  [/\btext-overflow-ellipsis\b/g, 'text-truncate', 'text-overflow-ellipsis -> text-truncate'],
  
  // Lote 2 - Textos Semánticos (secondary ANTES que base)
  [/\btext-color-secondary\b/g, 'text-body-secondary', 'text-color-secondary -> text-body-secondary'],
  [/\btext-color\b/g, 'text-body', 'text-color -> text-body'],
];

function processHtml(content) {
  let totalReplacements = 0;
  let changes = [];

  const CLASS_ATTR_PATTERN = /((?:custom)?class)\s*=\s*"(.*?)"/gs;

  const result = content.replace(CLASS_ATTR_PATTERN, (match, attrName, classValue) => {
    let newClassValue = classValue;
    let localReplacements = 0;

    for (const [pattern, replacement, desc] of REPLACEMENTS) {
      pattern.lastIndex = 0;
      const before = newClassValue;
      newClassValue = newClassValue.replace(pattern, replacement);
      
      if (before !== newClassValue) {
        pattern.lastIndex = 0;
        const matches = [...before.matchAll(new RegExp(pattern.source, pattern.flags))];
        const count = matches.length;
        localReplacements += count;
        changes.push(`${attrName}: ${desc} (x${count})`);
      }
    }

    newClassValue = newClassValue.replace(/\s{2,}/g, ' ').trim();
    totalReplacements += localReplacements;
    return `${attrName}="${newClassValue}"`;
  });

  return { result, totalReplacements, changes };
}

console.log('Fase 6.5 - Texts & Overflows Migration (Lotes 1 y 2)');
console.log(`Mode: ${DRY_RUN ? 'DRY RUN' : 'LIVE'}`);
console.log(`Target: ${ROOT}\n`);

const files = findHtmlFiles(ROOT);
console.log(`Found ${files.length} .html files\n`);

let grandTotal = 0;
let filesModified = 0;
const allChanges = [];

for (const file of files) {
  if (file.includes('.bak')) continue;
  const content = readFileSync(file, 'utf-8');
  const { result, totalReplacements, changes } = processHtml(content);

  if (totalReplacements > 0) {
    filesModified++;
    grandTotal += totalReplacements;
    const rel = file.replace(ROOT, '').replace(/^\\/, '');
    allChanges.push({ file: rel, count: totalReplacements, details: changes });
    if (!DRY_RUN) writeFileSync(file, result, 'utf-8');
  }
}

console.log('=== RESULTS ===');
console.log(`Files modified: ${filesModified}`);
console.log(`Total replacements: ${grandTotal}\n`);

if (allChanges.length > 0) {
  console.log('=== DETAILS ===');
  for (const { file, count, details } of allChanges) {
    console.log(`\n${file} (${count}):`);
    for (const d of details) console.log(`  - ${d}`);
  }
}

console.log('\n=== VERIFICATION ===');
const verify = [
  { pattern: /\bwhite-space-nowrap\b/g, name: 'white-space-nowrap' },
  { pattern: /\btext-overflow-ellipsis\b/g, name: 'text-overflow-ellipsis' },
  { pattern: /\btext-color-secondary\b/g, name: 'text-color-secondary' },
  { pattern: /\btext-color\b/g, name: 'text-color' },
];

for (const vp of verify) {
  let count = 0;
  for (const file of files) {
    if (file.includes('.bak')) continue;
    const content = readFileSync(file, 'utf-8');
    const classMatches = content.matchAll(/(?:custom)?class\s*=\s*"(.*?)"/gs);
    for (const [, classVal] of classMatches) {
      const m = classVal.matchAll(new RegExp(vp.pattern.source, vp.pattern.flags));
      for (const _ of m) count++;
    }
  }
  console.log(`${vp.name}: ${count}`);
}

console.log('\nDone.');
