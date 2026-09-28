#!/usr/bin/env node
/**
 * audit-conventions.mjs — Auditoría de integridad de CONVENTIONS.md
 * Uso: node scripts/audit-conventions.mjs
 *
 * Verifica:
 *   1. Skills luxuryapp-core sincronizados (md5)
 *   2. Cero referencias fantasma a docs/conventions/ o docs/shared/
 *   3. Cero dead symlinks en .claude/skills/
 *   4. Cero archivos .md sueltos con reglas duplicadas
 *   5. Cero contradicciones internas conocidas en CONVENTIONS.md
 */

import { readFileSync, existsSync, readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createHash } from 'crypto';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

let errors = 0;
let warnings = 0;

function err(msg) { console.error(`  🔴 ${msg}`); errors++; }
function warn(msg) { console.warn(`  🟡 ${msg}`); warnings++; }
function ok(msg)  { console.log(`  ✅ ${msg}`); }

function md5(filePath) {
  return createHash('md5').update(readFileSync(filePath)).digest('hex');
}

console.log('\n📋 Auditoría de Convenciones — LuxuryApp\n');

// ── 1. Sincronización de SKILL.md ──────────────────────────
console.log('1. Skills luxuryapp-core sincronizados');

const CANON = join(ROOT, 'skills/luxuryapp-core/luxuryapp-core/SKILL.md');
const AGENTS = ['.kilo', '.agents', '.claude', '.gemini', '.qwen', '.codex', '.cursor', '.antigravity'];

if (!existsSync(CANON)) { err(`Canonical SKILL.md no encontrado: ${CANON}`); process.exit(1); }

const canonMd5 = md5(CANON);
for (const agent of AGENTS) {
  const dest = join(ROOT, agent, 'skills/luxuryapp-core/SKILL.md');
  if (!existsSync(dest)) { err(`${agent}: SKILL.md faltante`); continue; }
  if (md5(dest) !== canonMd5) { err(`${agent}: SKILL.md fuera de sincronía`); }
  else { ok(`${agent}: OK`); }
}

// ── 2. Ghost references ────────────────────────────────────
console.log('\n2. Referencias fantasma');

const ghostPatterns = ['docs/conventions/', 'docs/shared/'];
function scanDir(dir) {
  if (!existsSync(dir)) return;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!entry.name.startsWith('.') && entry.name !== 'node_modules') scanDir(full);
    } else if (entry.name.endsWith('.md')) {
      const content = readFileSync(full, 'utf-8');
      for (const ghost of ghostPatterns) {
        if (content.includes(ghost)) {
          err(`${full} → referencia a "${ghost}"`);
        }
      }
    }
  }
}
scanDir(ROOT);
if (errors === 0) ok('Cero referencias fantasma');

// ── 3. Dead symlinks ────────────────────────────────────────
console.log('\n3. Dead symlinks en .claude/skills/');

const claudeSkills = join(ROOT, '.claude/skills');
if (existsSync(claudeSkills)) {
  let dead = 0;
  for (const entry of readdirSync(claudeSkills, { withFileTypes: true })) {
    if (entry.isSymbolicLink()) {
      const full = join(claudeSkills, entry.name);
      if (!existsSync(full)) { err(`Dead symlink: .claude/skills/${entry.name}`); dead++; }
    }
  }
  if (dead === 0) ok('Cero dead symlinks');
} else { warn('.claude/skills/ no existe'); }

// ── 4. Archivos .md con reglas duplicadas ──────────────────
console.log('\n4. Archivos .md con posibles reglas duplicadas');

const cvContent = readFileSync(join(ROOT, 'CONVENTIONS.md'), 'utf-8');
const suspectPatterns = [
  { file: 'client/angular/AGENTS.md', note: 'AGENTS.md en src (debió eliminarse)' },
];
for (const s of suspectPatterns) {
  if (existsSync(join(ROOT, s.file))) { err(`${s.file}: ${s.note}`); }
}
if (errors === 0) ok('Sin archivos duplicados conocidos');

// ── 5. Contradicciones internas conocidas ──────────────────
console.log('\n5. Contradicciones internas en CONVENTIONS.md');

const contradictions = [
  { pattern: 'ChangeDetectionStrategy.Eager', label: 'Eager (no existe en Angular)' },
  { pattern: 'custom-pipe.module', label: 'custom-pipe.module (NgModule viola §2.1)' },
  { pattern: 'docs/conventions/', label: 'Referencia a docs/conventions/' },
  { pattern: 'docs/shared/', label: 'Referencia a docs/shared/' },
];
for (const c of contradictions) {
  if (cvContent.includes(c.pattern)) { err(`${c.label} → presente en CONVENTIONS.md`); }
  else { ok(`${c.label}: no presente`); }
}

// ── Resumen ─────────────────────────────────────────────────
console.log(`\n${'═'.repeat(50)}`);
console.log(`🔴 Errores: ${errors}  🟡 Advertencias: ${warnings}\n`);

if (errors > 0) process.exit(1);
