// fix-fffd.mjs \u2014 Corrector de caracteres de reemplazo U+FFFD
// Uso: node scripts/fix-fffd.mjs [ruta]
// Reemplaza caracteres de reemplazo (U+FFFD, \uFFFD) detectados por el esc\u00e1ner de mojibake.
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';

const TARGET_EXTS = ['.ts', '.html', '.scss', '.json', '.md', '.js', '.cs'];

function isTextFile(filePath) {
  const ext = extname(filePath).toLowerCase();
  return TARGET_EXTS.includes(ext);
}

const FFFD = '\uFFFD';

function fixFffd(content) {
  if (!content.includes(FFFD)) return content;

  const buf = Buffer.from(content, 'utf-8');
  let result = buf;
  let changed = false;

  while (result.indexOf(FFFD) !== -1) {
    const idx = result.indexOf(FFFD);
    const before = result.slice(0, idx);
    const after = result.slice(idx + 1);

    if (before.length > 0) {
      const lastByte = before[before.length - 1];
      if (lastByte >= 0x80 && lastByte <= 0xff) {
        const cp1252Map = new Uint16Array(256);
        for (let i = 0; i < 256; i++) cp1252Map[i] = i;
        cp1252Map[0x80] = 0x20AC; cp1252Map[0x82] = 0x201A; cp1252Map[0x83] = 0x0192;
        cp1252Map[0x84] = 0x201E; cp1252Map[0x85] = 0x2026; cp1252Map[0x86] = 0x2020;
        cp1252Map[0x87] = 0x2021; cp1252Map[0x88] = 0x02C6; cp1252Map[0x89] = 0x2030;
        cp1252Map[0x8A] = 0x0160; cp1252Map[0x8B] = 0x2039; cp1252Map[0x8C] = 0x0152;
        cp1252Map[0x8E] = 0x017D; cp1252Map[0x91] = 0x2018; cp1252Map[0x92] = 0x2019;
        cp1252Map[0x93] = 0x201C; cp1252Map[0x94] = 0x201D; cp1252Map[0x95] = 0x2022;
        cp1252Map[0x96] = 0x2013; cp1252Map[0x97] = 0x2014; cp1252Map[0x98] = 0x02DC;
        cp1252Map[0x99] = 0x2122; cp1252Map[0x9A] = 0x0161; cp1252Map[0x9B] = 0x203A;
        cp1252Map[0x9C] = 0x0153; cp1252Map[0x9E] = 0x017E; cp1252Map[0x9F] = 0x0178;

        const rev1252 = {};
        for (let b = 0; b < 256; b++) rev1252[cp1252Map[b]] = b;

        const originalByte = rev1252[lastByte];
        if (originalByte !== undefined && originalByte <= 0x7F) {
          result = Buffer.concat([before.slice(0, -1), Buffer.from([originalByte]), after]);
          changed = true;
          continue;
        }
      }
    }

    break;
  }

  if (changed) {
    return result.toString('utf-8');
  }
  return content;
}

function processFile(filePath) {
  if (!isTextFile(filePath)) return 0;
  const content = readFileSync(filePath, 'utf-8');
  if (!content.includes(FFFD)) return 0;
  const fixed = fixFffd(content);
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
console.log(`[fix-fffd] Corregidos ${count} archivo(s) con caracteres U+FFFD en ${targetPath}`);