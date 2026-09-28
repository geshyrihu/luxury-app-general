// fix-wrong-vowels.mjs \u2014 Corrector de vocales con tilde da\u00f1adas por mojibake
// Uso: node scripts/fix-wrong-vowels.mjs [ruta]
// Corrige vocales acentuadas que fueron codificadas incorrectamente
// (ej. \u00c3\u00a1 \u2192 \u00e1, \u00c3\u00a9 \u2192 \u00e9, \u00c3\u00ad \u2192 \u00ed,
// \u00c3\u00b3 \u2192 \u00f3, \u00c3\u00ba \u2192 \u00fa, \u00c3\u00b1 \u2192 \u00f1, \u00c3\u0091 \u2192 \u00d1).
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';

const TARGET_EXTS = ['.ts', '.html', '.scss', '.json', '.md', '.js', '.cs'];

function isTextFile(filePath) {
  const ext = extname(filePath).toLowerCase();
  return TARGET_EXTS.includes(ext);
}

const REPLACEMENTS = {
  '\u00c3\u00a1': '\u00e1',
  '\u00c3\u00a9': '\u00e9',
  '\u00c3\u00ad': '\u00ed',
  '\u00c3\u00b3': '\u00f3',
  '\u00c3\u00ba': '\u00fa',
  '\u00c3\u00b1': '\u00f1',
  '\u00c3\u0081': '\u00c1',
  '\u00c3\u0089': '\u00c9',
  '\u00c3\u008d': '\u00cd',
  '\u00c3\u0093': '\u00d3',
  '\u00c3\u009a': '\u00da',
  '\u00c3\u0091': '\u00d1',
};

function fixWrongVowels(content) {
  let result = content;
  let changed = false;
  for (const [broken, correct] of Object.entries(REPLACEMENTS)) {
    if (result.includes(broken)) {
      result = result.split(broken).join(correct);
      changed = true;
    }
  }
  return changed ? result : content;
}

function processFile(filePath) {
  if (!isTextFile(filePath)) return 0;
  const content = readFileSync(filePath, 'utf-8');
  const fixed = fixWrongVowels(content);
  if (fixed !== content) {
    writeFileSync(filePath, fixed, 'utf-8');
    return 1;
  }
  return 0;
}

function scanDirectory(dirPath) {
  let count = 0;
  const entries = readdirSync(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = join(dirPath, entry.name);
    if (entry.isDirectory()) {
      count += scanDirectory(fullPath);
    } else if (entry.isFile() && isTextFile(entry.name)) {
      count += processFile(fullPath);
    }
  }
  return count;
}

const targetPath = process.argv[2] || '.';
const stats = statSync(targetPath);
const count = stats.isDirectory() ? scanDirectory(targetPath) : processFile(targetPath);
console.log(`[fix-wrong-vowels] Corregidos ${count} archivo(s) con vocales da\u00f1adas en ${targetPath}`);