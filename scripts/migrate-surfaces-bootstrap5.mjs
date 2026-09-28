/**
 * Fase 6.5 - Surfaces & Text Scales Migration: PrimeFlex -> Bootstrap 5 (Lotes 3 y 4)
 * 
 * Lote 3: Escala de Grises (text-300..900)
 * Lote 4: Fondos Semánticos (surface-*)
 * 
 * Uso: node scripts/migrate-surfaces-bootstrap5.mjs [--dry-run]
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

// Order: more specific first
const REPLACEMENTS = [
  // Lote 3 - Text scales (300-600 -> secondary, 700-900 -> body)
  [/\btext-(300|400|500|600)\b/g, 'text-body-secondary', 'text-N -> text-body-secondary'],
  [/\btext-(700|800|900)\b/g, 'text-body', 'text-N -> text-body'],

  // Lote 4 - Surface specific (most specific first)
  [/\bsurface-overlay\b/g, 'bg-body shadow', 'surface-overlay -> bg-body shadow'],
  [/\bsurface-card\b/g, 'bg-body', 'surface-card -> bg-body'],
  [/\bsurface-ground\b/g, 'bg-body-tertiary', 'surface-ground -> bg-body-tertiary'],
  [/\bsurface-section\b/g, 'bg-body-tertiary', 'surface-section -> bg-body-tertiary'],
  [/\bsurface-border\b/g, 'border', 'surface-border -> border'],

  // Lote 4 - Surface numeric scales (most specific ranges first)
  [/\bsurface-(500|600|700|800|900)\b/g, 'bg-dark text-white', 'surface-N -> bg-dark text-white'],
  [/\bsurface-(300|400)\b/g, 'bg-body-secondary', 'surface-N -> bg-body-secondary'],
  [/\bsurface-(0|50|100|200)\b/g, 'bg-body-tertiary', 'surface-N -> bg-body-tertiary'],
];

function processHtml(content) {
  let totalReplacements = 0;
  let changes = [];

  // Pattern 1: class="..." and customClass="..."
  const CLASS_ATTR_PATTERN = /((?:custom)?class)\s*=\s*"(.*?)"/gs;

  // Pattern 2: [class.surface-*]="..." Angular dynamic bindings
  const NG_CLASS_PATTERN = /\[class\.(surface-(?:ground|section|card|overlay|border|\d+))\]\s*=\s*"(.*?)"/gs;

  let result = content;

  // Process static class attributes
  result = result.replace(CLASS_ATTR_PATTERN, (match, attrName, classValue) => {
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

    // Deduplicate classes
    const classes = newClassValue.split(/\s+/).filter(Boolean);
    const deduped = [...new Set(classes)];
    newClassValue = deduped.join(' ');
    newClassValue = newClassValue.replace(/\s{2,}/g, ' ').trim();

    totalReplacements += localReplacements;
    return `${attrName}="${newClassValue}"`;
  });

  // Process Angular [class.surface-*] bindings
  const NG_MAP = {
    'surface-ground': 'bg-body-tertiary',
    'surface-section': 'bg-body-tertiary',
    'surface-card': 'bg-body',
    'surface-overlay': 'bg-body shadow',
    'surface-border': 'border',
  };

  result = result.replace(NG_CLASS_PATTERN, (match, surfaceClass, expr) => {
    const bsClass = NG_MAP[surfaceClass];
    if (bsClass) {
      totalReplacements++;
      changes.push(`[class.${surfaceClass}] -> [class.${bsClass}] (x1)`);
      return `[class.${bsClass}]="${expr}"`;
    }
    // Numeric surface-* in bindings
    const numMatch = surfaceClass.match(/^surface-(\d+)$/);
    if (numMatch) {
      const n = parseInt(numMatch[1]);
      let bsReplacement;
      if (n >= 500) bsReplacement = 'bg-dark text-white';
      else if (n >= 300) bsReplacement = 'bg-body-secondary';
      else bsReplacement = 'bg-body-tertiary';
      totalReplacements++;
      changes.push(`[class.${surfaceClass}] -> [class.${bsReplacement}] (x1)`);
      return `[class.${bsReplacement}]="${expr}"`;
    }
    return match;
  });

  // Process [ngClass]="..." bindings (string values only)
  const NG_CLASS_BINDING_PATTERN = /\[ngClass\]\s*=\s*"(.*?)"/gs;
  result = result.replace(NG_CLASS_BINDING_PATTERN, (match, expr) => {
    let newExpr = expr;
    let localReplacements = 0;
    for (const [pattern, replacement, desc] of REPLACEMENTS) {
      pattern.lastIndex = 0;
      const before = newExpr;
      newExpr = newExpr.replace(pattern, replacement);
      if (before !== newExpr) {
        pattern.lastIndex = 0;
        const matches = [...before.matchAll(new RegExp(pattern.source, pattern.flags))];
        localReplacements += matches.length;
        changes.push(`[ngClass]: ${desc} (x${matches.length})`);
      }
    }
    if (localReplacements > 0) {
      totalReplacements += localReplacements;
      return `[ngClass]="${newExpr}"`;
    }
    return match;
  });

  // Process border-surface-* classes (border color)
  const BORDER_SURFACE_PATTERN = /\bborder-surface-(\d+)\b/g;
  result = result.replace(BORDER_SURFACE_PATTERN, (match, num) => {
    totalReplacements++;
    changes.push(`border-surface-${num} -> border (x1)`);
    return 'border';
  });

  // Remove hover:surface-hover (PrimeFlex hover state, no BS5 equivalent)
  const HOVER_SURFACE_PATTERN = /\bhover:surface-hover\b/g;
  result = result.replace(HOVER_SURFACE_PATTERN, (match) => {
    totalReplacements++;
    changes.push(`hover:surface-hover -> removed (x1)`);
    return '';
  });

  // Remove [class.hover:surface-*] Angular bindings
  const NG_HOVER_PATTERN = /\[class\.hover:surface-\d+\]\s*=\s*"[^"]*"\s*/g;
  result = result.replace(NG_HOVER_PATTERN, (match) => {
    totalReplacements++;
    changes.push(`[class.hover:surface-*] -> removed (x1)`);
    return '';
  });

  return { result, totalReplacements, changes };
}

console.log('Fase 6.5 - Surfaces & Text Scales (Lotes 3 y 4)');
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
  { pattern: /\btext-[3-9]00\b/g, name: 'text-N00 scales' },
  { pattern: /\bsurface-/g, name: 'surface-*' },
  { pattern: /\bsurface-ground\b/g, name: 'surface-ground' },
  { pattern: /\bsurface-section\b/g, name: 'surface-section' },
  { pattern: /\bsurface-card\b/g, name: 'surface-card' },
  { pattern: /\bsurface-overlay\b/g, name: 'surface-overlay' },
  { pattern: /\bsurface-border\b/g, name: 'surface-border' },
];

for (const vp of verify) {
  let count = 0;
  for (const file of files) {
    if (file.includes('.bak')) continue;
    const content = readFileSync(file, 'utf-8');
    // Check class="..." attributes
    const classMatches = content.matchAll(/(?:custom)?class\s*=\s*"(.*?)"/gs);
    for (const [, classVal] of classMatches) {
      const m = classVal.matchAll(new RegExp(vp.pattern.source, vp.pattern.flags));
      for (const _ of m) count++;
    }
    // Check [class.surface-*] bindings
    const ngMatches = content.matchAll(/\[class\.(surface-(?:\w+))\]/g);
    for (const [, cls] of ngMatches) {
      if (vp.pattern.test(cls)) count++;
    }
  }
  console.log(`${vp.name}: ${count}`);
}

console.log('\nDone.');
