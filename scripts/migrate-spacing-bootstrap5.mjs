/**
 * Fase 6.5 - Spacing Migration: PrimeFlex -> Bootstrap 5 (Margins, Paddings, Gaps)
 * 
 * Transforma:
 *   - ml-* -> ms-*, mr-* -> me-* (logical properties)
 *   - md:mb-3 -> mb-md-3 (breakpoint position)
 *   - p-6 -> p-5 (cap at 5)
 *   - md:gap-6 -> gap-md-5 (gaps)
 * 
 * Uso: node scripts/migrate-spacing-bootstrap5.mjs [--dry-run]
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

// Main spacing pattern: [sm|md|lg|xl]:m|p[lrxytb]?-0-8|auto
const SPACING_RE = /\b(?:(sm|md|lg|xl):)?([mp])([lrxyt]?)-([0-8]|auto)\b/g;

// Gap pattern: [sm|md|lg|xl]:gap-0-8
const GAP_RE = /\b(?:(sm|md|lg|xl):)?gap-([0-8])\b/g;

function capValue(val) {
  if (val === 'auto') return 'auto';
  const n = parseInt(val);
  return n > 5 ? '5' : val;
}

function transformDirection(dir) {
  if (dir === 'l') return 's';
  if (dir === 'r') return 'e';
  return dir;
}

function processHtml(content) {
  let totalReplacements = 0;
  let changes = [];

  const CLASS_ATTR_PATTERN = /((?:custom)?class)\s*=\s*"(.*?)"/gs;

  const result = content.replace(CLASS_ATTR_PATTERN, (match, attrName, classValue) => {
    let newClassValue = classValue;
    let localReplacements = 0;

    // Transform spacing classes
    newClassValue = newClassValue.replace(SPACING_RE, (fullMatch, bp, attr, dir, val) => {
      // Skip negative values (not matched by our regex, but safety)
      if (val === undefined) return fullMatch;

      const newDir = transformDirection(dir);
      const newVal = capValue(val);
      const newBp = bp ? `${bp}-` : '';
      const newClass = `${attr}${newDir}-${newBp}${newVal}`;

      if (newClass !== fullMatch) {
        localReplacements++;
        changes.push(`${fullMatch} -> ${newClass}`);
      }
      return newClass;
    });

    // Transform gap classes
    newClassValue = newClassValue.replace(GAP_RE, (fullMatch, bp, val) => {
      const newVal = capValue(val);
      const newBp = bp ? `${bp}-` : '';
      const newClass = `gap-${newBp}${newVal}`;

      if (newClass !== fullMatch) {
        localReplacements++;
        changes.push(`${fullMatch} -> ${newClass}`);
      }
      return newClass;
    });

    // Deduplicate classes
    const classes = newClassValue.split(/\s+/).filter(Boolean);
    const deduped = [...new Set(classes)];
    newClassValue = deduped.join(' ');
    newClassValue = newClassValue.replace(/\s{2,}/g, ' ').trim();

    totalReplacements += localReplacements;
    return `${attrName}="${newClassValue}"`;
  });

  return { result, totalReplacements, changes };
}

console.log('Fase 6.5 - Spacing Migration (Margins, Paddings, Gaps)');
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
  for (const { file, count, details } of allChanges.slice(0, 50)) {
    console.log(`\n${file} (${count}):`);
    for (const d of details.slice(0, 10)) console.log(`  - ${d}`);
    if (details.length > 10) console.log(`  ... and ${details.length - 10} more`);
  }
  if (allChanges.length > 50) console.log(`\n... and ${allChanges.length - 50} more files`);
}

console.log('\n=== VERIFICATION ===');
// Check for remaining PrimeFlex spacing patterns
const verifyPatterns = [
  { pattern: /\bmr-\d/g, name: 'mr-*' },
  { pattern: /\bml-\d/g, name: 'ml-*' },
  { pattern: /\bpr-\d/g, name: 'pr-*' },
  { pattern: /\bpl-\d/g, name: 'pl-*' },
  { pattern: /\bmd:mp/g, name: 'md:mp*' },
  { pattern: /\b(lg|xl|sm):m[plr]/g, name: 'bp:m[plr]' },
  { pattern: /\bp-[6-8]\b/g, name: 'p-6/7/8' },
  { pattern: /\bm-[6-8]\b/g, name: 'm-6/7/8' },
];

for (const vp of verifyPatterns) {
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
