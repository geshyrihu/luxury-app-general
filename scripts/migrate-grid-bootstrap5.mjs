/**
 * Fase 6.5 - Grid Migration: PrimeFlex -> Bootstrap 5
 * 
 * Reemplaza clases de grid de PrimeFlex por equivalentes Bootstrap 5
 * DENTRO de atributos class="..." y customClass="..." en archivos .html
 * 
 * Uso: node scripts/migrate-grid-bootstrap5.mjs [--dry-run]
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
  // 1. grid-nogutter -> g-0
  [/\bgrid-nogutter\b/g, 'g-0', 'grid-nogutter -> g-0'],
  
  // 2. Responsive col with number: md:col-6 -> col-md-6
  [/\b(sm|md|lg|xl):col-(\d+)\b/g, 'col-$1-$2', 'md:col-N -> col-md-N'],
  
  // 2b. Responsive col without number: md:col -> col-md (auto-width)
  [/\b(sm|md|lg|xl):col\b/g, 'col-$1', 'md:col -> col-md'],
  
  // 3. Responsive offset: md:col-offset-4 -> offset-md-4
  [/\b(sm|md|lg|xl):col-offset-(\d+)\b/g, 'offset-$1-$2', 'md:col-offset-N -> offset-md-N'],
  
  // 4. Base offset: col-offset-N -> offset-N
  [/\bcol-offset-(\d+)\b/g, 'offset-$1', 'col-offset-N -> offset-N'],
  
  // 5. Responsive grid trigger: md:grid -> REMOVE (redundant with BS5 row)
  // Must come BEFORE grid -> row
  [/\b(sm|md|lg|xl):grid\b/g, '', '$1:grid -> removed'],
  
  // 6. Standalone grid -> row (NOT after : or before -)
  [/(?<![:\w-])grid(?!\w|-)/g, 'row', 'grid -> row'],
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
        // Count how many times the pattern matched
        pattern.lastIndex = 0;
        const matches = [...before.matchAll(new RegExp(pattern.source, pattern.flags))];
        const count = matches.length;
        localReplacements += count;
        changes.push(`${attrName}: ${desc.replace('$1', '')} (x${count})`);
      }
    }

    // Collapse multiple spaces and trim
    newClassValue = newClassValue.replace(/\s{2,}/g, ' ').trim();

    totalReplacements += localReplacements;
    return `${attrName}="${newClassValue}"`;
  });

  return { result, totalReplacements, changes };
}

console.log('Fase 6.5 - Grid Migration: PrimeFlex -> Bootstrap 5');
console.log(`Mode: ${DRY_RUN ? 'DRY RUN (no changes written)' : 'LIVE'}`);
console.log(`Target: ${ROOT}\n`);

const files = findHtmlFiles(ROOT);
console.log(`Found ${files.length} .html files\n`);

let grandTotal = 0;
let filesModified = 0;
const allChanges = [];

for (const file of files) {
  const content = readFileSync(file, 'utf-8');
  const { result, totalReplacements, changes } = processHtml(content);

  if (totalReplacements > 0) {
    filesModified++;
    grandTotal += totalReplacements;
    const rel = file.replace(ROOT, '').replace(/^\\/, '');
    allChanges.push({ file: rel, count: totalReplacements, details: changes });

    if (!DRY_RUN) {
      writeFileSync(file, result, 'utf-8');
    }
  }
}

console.log('=== RESULTS ===');
console.log(`Files modified: ${filesModified}`);
console.log(`Total replacements: ${grandTotal}\n`);

if (allChanges.length > 0) {
  console.log('=== DETAILS ===');
  for (const { file, count, details } of allChanges) {
    console.log(`\n${file} (${count} replacements):`);
    for (const d of details) {
      console.log(`  - ${d}`);
    }
  }
}

// Verify remaining patterns
console.log('\n=== VERIFICATION ===');
const verifyPatterns = [
  { pattern: /(?<![:\w-])grid(?!\w|-)/g, name: 'standalone grid (PrimeFlex)' },
  { pattern: /\bgrid-nogutter\b/g, name: 'grid-nogutter' },
  { pattern: /\b(sm|md|lg|xl):col-\d+\b/g, name: 'responsive col (md:col-N)' },
  { pattern: /\b(sm|md|lg|xl):col-offset-\d+\b/g, name: 'responsive offset' },
  { pattern: /\bcol-offset-\d+\b/g, name: 'col-offset-N' },
  { pattern: /\b(sm|md|lg|xl):grid\b/g, name: 'responsive grid trigger' },
];

for (const vp of verifyPatterns) {
  let count = 0;
  for (const file of files) {
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
