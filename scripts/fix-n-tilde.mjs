// fix-n-tilde.mjs \u2014 Corrector espec\u00edfico de errores de codificaci\u00f3n de \u00f1 y \u00d1 por mojibake
// Uso: node scripts/fix-n-tilde.mjs [ruta]
// Corrige secuencias mojibake comunes para la \u00f1 y \u00d1 que el corrector general puede no resolver:
// \u00c3\u00b1 \u2192 \u00f1, \u00c3\u0091 \u2192 \u00d1, \u00c3\u00b1 (variante C1 ctrl + 0x7E) \u2192 \u00f1.
// Aplica correcci\u00f3n a nivel de cadena (string-level), nunca recodifica archivos completos como 1252.
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';

const TARGET_EXTS = ['.ts', '.html', '.scss', '.json', '.md', '.js', '.cs'];

function isTextFile(filePath) {
  const ext = extname(filePath).toLowerCase();
  return TARGET_EXTS.includes(ext);
}

const REPLACEMENTS = {
  '\u00c3\u00b1': '\u00f1',
  '\u00c3\u0091': '\u00d1',
  '\u00c3\u00b1': '\u00f1',
};

function fixNTilde(content) {
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
  const fixed = fixNTilde(content);
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
console.log(`[fix-n-tilde] Corregidos ${count} archivo(s) con errores de \u00f1/\u00d1 en ${targetPath}`);