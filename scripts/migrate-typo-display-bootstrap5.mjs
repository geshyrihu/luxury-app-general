/**
 * Fase 6.5 - Typography, Display, Flex & Borders Migration: PrimeFlex -> Bootstrap 5
 * 
 * Uso: node scripts/migrate-typo-display-bootstrap5.mjs [--dry-run]
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

// Replacement rules: [pattern, replacement, description]
const REPLACEMENTS = [
  // === TYPOGRAPHY ===
  [/\bfont-bold\b/g, 'fw-bold', 'font-bold -> fw-bold'],
  [/\bfont-semibold\b/g, 'fw-semibold', 'font-semibold -> fw-semibold'],
  [/\bfont-medium\b/g, 'fw-medium', 'font-medium -> fw-medium'],
  [/\bfont-light\b/g, 'fw-light', 'font-light -> fw-light'],
  [/\bfont-italic\b/g, 'fst-italic', 'font-italic -> fst-italic'],
  [/\btext-right\b/g, 'text-end', 'text-right -> text-end'],
  [/\btext-left\b/g, 'text-start', 'text-left -> text-start'],
  [/\buppercase\b/g, 'text-uppercase', 'uppercase -> text-uppercase'],
  [/\blowercase\b/g, 'text-lowercase', 'lowercase -> text-lowercase'],

  // === BORDERS ===
  [/\bborder-none\b/g, 'border-0', 'border-none -> border-0'],
  [/\bborder-circle\b/g, 'rounded-circle', 'border-circle -> rounded-circle'],
  [/\bborder-round-(sm|lg|xl|2xl)\b/g, 'rounded', 'border-round-* -> rounded'],
  [/\bborder-round\b/g, 'rounded', 'border-round -> rounded'],

  // === DISPLAY (no breakpoint) ===
  [/\bhidden\b/g, 'd-none', 'hidden -> d-none'],
  [/\bblock\b/g, 'd-block', 'block -> d-block'],

  // === FLEX (no breakpoint, isolated) ===
  [/\bflex-1\b/g, 'flex-fill', 'flex-1 -> flex-fill'],
  [/\bflex-auto\b/g, 'flex-fill', 'flex-auto -> flex-fill'],
  // "flex" alone (not d-flex, not flex-column, etc.)
  [/(?<!d-)\bflex\b(?!-[a-z])/g, 'd-flex', 'flex -> d-flex'],

  // === BREAKPOINT REPOSITIONING ===
  // Hidden
  [/\b(sm|md|lg|xl):hidden\b/g, 'd-$1-none', 'bp:hidden -> d-bp-none'],
  // Block
  [/\b(sm|md|lg|xl):block\b/g, 'd-$1-block', 'bp:block -> d-bp-block'],
  // Flex alone with breakpoint
  [/\b(sm|md|lg|xl):flex\b(?!-[a-z])/g, 'd-$1-flex', 'bp:flex -> d-bp-flex'],
  // Flex direction/wrap with breakpoint
  [/\b(sm|md|lg|xl):(flex-(?:row|column|wrap|nowrap))\b/g, 'flex-$1-$2', 'bp:flex-X -> flex-bp-X'],
  // Align-items with breakpoint
  [/\b(sm|md|lg|xl):(align-items-[a-z]+)\b/g, 'align-items-$1-$2', 'bp:align-items-X -> align-items-bp-X'],
  // Justify-content with breakpoint
  [/\b(sm|md|lg|xl):(justify-content-[a-z]+)\b/g, 'justify-content-$1-$2', 'bp:justify-content-X -> justify-content-bp-X'],
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
        changes.push(`${desc} (x${count})`);
      }
    }

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

console.log('Fase 6.5 - Typography, Display, Flex & Borders Migration');
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
const verifyPatterns = [
  { pattern: /\bhidden\b/g, name: 'hidden' },
  { pattern: /\bborder-round\b/g, name: 'border-round' },
  { pattern: /\bfont-bold\b/g, name: 'font-bold' },
  { pattern: /\btext-right\b/g, name: 'text-right' },
  { pattern: /\btext-left\b/g, name: 'text-left' },
  { pattern: /\bmd:block\b/g, name: 'md:block' },
  { pattern: /\bmd:flex\b/g, name: 'md:flex' },
  { pattern: /\bmd:hidden\b/g, name: 'md:hidden' },
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
