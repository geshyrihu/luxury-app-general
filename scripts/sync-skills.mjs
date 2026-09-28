#!/usr/bin/env node

/**
 * sync-skills.mjs — Replica el SKILL.md canónico a todos los agentes.
 * Uso:
 *   node scripts/sync-skills.mjs            # copia el canon a todos los agentes
 *   node scripts/sync-skills.mjs --check    # solo reporta diferencias (exit 1 si hay)
 *
 * El canónico vive en: skills/luxuryapp-core/luxuryapp-core/SKILL.md
 * Se replica a: .kilo, .agents, .claude, .gemini, .qwen, .codex, .cursor, .antigravity
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const CANON = join(ROOT, 'skills/luxuryapp-core/luxuryapp-core/SKILL.md');
const AGENTS = [
  '.kilo',
  '.agents',
  '.claude',
  '.gemini',
  '.qwen',
  '.codex',
  '.cursor',
  '.antigravity',
];

const mode = process.argv.includes('--check') ? 'check' : 'sync';

if (!existsSync(CANON)) {
  console.error(`ERROR: Canonical SKILL.md not found at ${CANON}`);
  process.exit(1);
}

const canonContent = readFileSync(CANON, 'utf-8');
let hasDiff = false;

for (const agent of AGENTS) {
  const dest = join(ROOT, agent, 'skills/luxuryapp-core/SKILL.md');

  if (mode === 'sync') {
    writeFileSync(dest, canonContent, 'utf-8');
    console.log(`  ✔ ${agent}/skills/luxuryapp-core/SKILL.md`);
  } else {
    if (!existsSync(dest)) {
      console.log(`  ✗ ${agent}: MISSING`);
      hasDiff = true;
      continue;
    }
    const agentContent = readFileSync(dest, 'utf-8');
    if (agentContent !== canonContent) {
      console.log(`  ✗ ${agent}: DIFFERS`);
      hasDiff = true;
    } else {
      console.log(`  ✔ ${agent}: OK`);
    }
  }
}

if (mode === 'check') {
  if (hasDiff) {
    console.error('\n⚠️  Algunos agentes tienen diferencias. Corre sync-skills.mjs sin --check.');
    process.exit(1);
  }
  console.log('\n✓ Todos los agentes están sincronizados.');
}
