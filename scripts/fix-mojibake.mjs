// fix-mojibake.mjs — Corrector universal v3 (rápido)
// Uso: node scripts/fix-mojibake.mjs [ruta]
// Busca y corrige mojibake en archivos usando roundtrip 1252.
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, relative } from 'path';

const cp1252 = new Uint16Array(256);
for (let i = 0; i < 256; i++) cp1252[i] = i;
cp1252[0x80]=0x20AC; cp1252[0x82]=0x201A; cp1252[0x83]=0x0192;
cp1252[0x84]=0x201E; cp1252[0x85]=0x2026; cp1252[0x86]=0x2020;
cp1252[0x87]=0x2021; cp1252[0x88]=0x02C6; cp1252[0x89]=0x2030;
cp1252[0x8A]=0x0160; cp1252[0x8B]=0x2039; cp1252[0x8C]=0x0152;
cp1252[0x8E]=0x017D; cp1252[0x91]=0x2018; cp1252[0x92]=0x2019;
cp1252[0x93]=0x201C; cp1252[0x94]=0x201D; cp1252[0x95]=0x2022;
cp1252[0x96]=0x2013; cp1252[0x97]=0x2014; cp1252[0x98]=0x02DC;
cp1252[0x99]=0x2122; cp1252[0x9A]=0x0161; cp1252[0x9B]=0x203A;
cp1252[0x9C]=0x0153; cp1252[0x9E]=0x017E; cp1252[0x9F]=0x0178;

const rev1252 = {};
for (let b = 0; b < 256; b++) rev1252[cp1252[b]] = b;

// Recover a single byte from a mojibake character. Two corruption paths exist:
//  - Latin-1 / C1 control range (0x80-0xFF): the code point IS the original byte.
//  - cp1252 best-fit printable chars (e.g. U+0178, U+201D): mapped back via rev1252.
function recoverByte(cp) {
  if (cp >= 0x80 && cp <= 0xff) return cp;
  if (rev1252[cp] !== undefined) return rev1252[cp];
  return -1;
}

const SPANISH_OK = new Set([0xC1,0xC9,0xCD,0xD3,0xDA,0xD1,0xDC,0xE1,0xE9,0xED,0xF3,0xFA,0xF1,0xFC,0xBF,0xA1]);
const ALWAYS_SUSPICIOUS = new Set([0x83,0x85,0x88,0x89,0x8A,0x8B,0x8C,0x8E,0x91,0x92,0x93,0x94,0x96,0x97,0x98,0x99,0x9A,0x9B,0x9C,0x9E,0x9F,0x152,0x153,0x160,0x161,0x178,0x17D,0x17E,0x192,0x2C6,0x2DC]);
const FALSE_POSITIVES = new Set();
for (let cp = 0x2500; cp <= 0x27BF; cp++) FALSE_POSITIVES.add(cp);
for (let cp = 0x2B00; cp <= 0x2BFF; cp++) FALSE_POSITIVES.add(cp);
for (let cp = 0x2190; cp <= 0x21FF; cp++) FALSE_POSITIVES.add(cp);
for (let cp = 0x1F300; cp <= 0x1FFFF; cp++) FALSE_POSITIVES.add(cp);

function isCorruptChar(cp) {
  if (FALSE_POSITIVES.has(cp)) return false;
  if (cp === 0xFFFD) return true;
  if (cp < 0x80) return false;
  if (SPANISH_OK.has(cp)) return false;
  if (ALWAYS_SUSPICIOUS.has(cp)) return true;
  if (cp === 0xC3 || cp === 0xC2) return true;
  if (cp === 0xF0) return true;
  if (cp >= 0xC0 && cp <= 0xFF) return true;
  // C1 control range / low cp1252 (0x80-0xBF): emoji/symbol mojibake components (e.g. 🎫)
  if (cp >= 0x80 && cp <= 0xBF) return true;
  // Any high char that maps in 1252
  if (cp >= 0x100 && rev1252[cp] !== undefined) return true;
  return false;
}

const FFFD_WORD_MAP = {
  'ción': 'ó', 'sión': 'ó', 'gión': 'ó', 'mión': 'ó',
  'vión': 'ó', 'fión': 'ó', 'blión': 'ó', 'pión': 'ó',
  'rión': 'ó', 'rón': 'ó', 'módulo': 'ó', 'módulos': 'ó',
  'específico': 'í', 'específica': 'í', 'específicos': 'í', 'específicas': 'í',
  'situación': 'ó', 'catálogo': 'á', 'catálogos': 'á', 'catálog': 'á',
  'página': 'á', 'páginas': 'á', 'págin': 'á', 'dinámico': 'á',
  'dinámica': 'á', 'dinámicos': 'á', 'dinámicas': 'á', 'análisis': 'á',
  'práctico': 'á', 'práctica': 'á', 'prácticos': 'á', 'prácticas': 'á',
  'rápido': 'á', 'rápida': 'á', 'rápidos': 'á', 'rápidas': 'á',
  'Razón': 'ó', 'razón': 'ó',
  'día': 'í', 'días': 'í',
  'cancelación': 'ó',
  'comité': 'é', 'método': 'é', 'métodos': 'é', 'esté': 'é',
  'estén': 'é', 'estébamos': 'é', 'déficit': 'é',
  'envío': 'í', 'envíos': 'í', 'lígica': 'í', 'lígico': 'í',
  'lígicas': 'í', 'lígicos': 'í', 'período': 'í', 'períodos': 'í',
  'política': 'í', 'políticas': 'í', 'político': 'í', 'políticos': 'í',
  'mení': 'í', 'menís': 'í', 'días': 'í',
  'número': 'ú', 'números': 'ú', 'mínimo': 'í', 'mínima': 'í',
  'mínimos': 'í', 'mínimas': 'í', 'máximo': 'á', 'máxima': 'á',
  'máximos': 'á', 'máximas': 'á',
  'podría': 'í', 'podrían': 'í', 'debería': 'í', 'deberían': 'í',
  'sería': 'í', 'serían': 'í', 'tendría': 'í', 'tendrían': 'í',
  'dónde': 'ó', 'sí': 'í', 'mí': 'í', 'tú': 'ú',
  'inició': 'ó', 'finalizó': 'ó', 'creó': 'ó', 'ocurrió': 'ó',
  'modificó': 'ó', 'eliminó': 'ó', 'actualizó': 'ó', 'registró': 'ó',
  'autorizó': 'ó', 'rechazó': 'ó', 'aprobó': 'ó', 'capturó': 'ó',
  'generó': 'ó', 'envió': 'ó', 'asignó': 'ó', 'configuró': 'ó',
  'confirmó': 'ó', 'procesó': 'ó', 'verificó': 'ó',
  'seleccionó': 'ó', 'completó': 'ó', 'canceló': 'ó',
  'mostró': 'ó', 'ocultó': 'ó', 'establecó': 'ó',
};
const WORD_ENTRIES = Object.entries(FFFD_WORD_MAP);

function fixFFFD(word) {
  const lower = word.toLowerCase();
  for (const [pattern, replacement] of WORD_ENTRIES) {
    if (pattern.length === word.length) {
      let match = true;
      for (let i = 0; i < pattern.length; i++) {
        const pc = pattern[i], wc = word[i];
        if (pc === '\uFFFD' && wc === '\uFFFD') continue;
        if (pc !== '\uFFFD' && wc !== '\uFFFD' && pc.toLowerCase() !== wc.toLowerCase()) { match = false; break; }
        if (pc === '\uFFFD' && wc !== '\uFFFD') { match = false; break; }
        if (pc !== '\uFFFD' && wc === '\uFFFD') { match = false; break; }
      }
      if (match) return replacement;
    }
  }
  // Substring matching
  for (const [pattern, replacement] of WORD_ENTRIES) {
    if (word.length >= pattern.length) {
      for (let start = 0; start <= word.length - pattern.length; start++) {
        let match = true;
        for (let i = 0; i < pattern.length; i++) {
          const pc = pattern[i], wc = word[start + i];
          if (pc === '\uFFFD' && wc === '\uFFFD') continue;
          if (pc !== '\uFFFD' && wc !== '\uFFFD' && pc.toLowerCase() !== wc.toLowerCase()) { match = false; break; }
          if (pc === '\uFFFD' && wc !== '\uFFFD') { match = false; break; }
          if (pc !== '\uFFFD' && wc === '\uFFFD') { match = false; break; }
        }
        if (match) return replacement;
      }
    }
  }
  // Heuristic fallback based on context
  const ffdIdx = word.indexOf('\uFFFD');
  if (ffdIdx === -1) return 'ó';
  const before = ffdIdx > 0 ? word[ffdIdx - 1] : '';
  const after = ffdIdx < word.length - 1 ? word[ffdIdx + 1] : '';

  if (ffdIdx === word.length - 1) {
    if (before === 't') return 'é'; // comité
    return 'é';
  }
  if (after === 'n') return 'ó'; // acción, canción
  if (after === 's') return 'ó';
  if (/[aeiouáéíóú]/i.test(after)) {
    if (before === 'v') return 'í'; // envío
    return 'ó';
  }
  return 'ó';
}

function extractWord(chars, idx) {
  let start = idx;
  while (start > 0 && /[\wáéíóúüñÁÉÍÓÚÜÑ]/i.test(chars[start - 1])) start--;
  let end = idx + 1;
  while (end < chars.length && /[\wáéíóúüñÁÉÍÓÚÜÑ]/i.test(chars[end])) end++;
  return { word: chars.slice(start, end).join(''), start, end };
}

function fixRoundtrip(corrupt) {
  const bytes = [];
  for (const ch of corrupt) {
    const cp = ch.codePointAt(0);
    if (cp < 0x80) bytes.push(cp);
    else {
      const b = recoverByte(cp);
      if (b < 0) return null;
      bytes.push(b);
    }
  }
  let current = new TextDecoder('utf-8').decode(Uint8Array.from(bytes));
  if ([...current].some(c => c === '\uFFFD')) return null;
  for (let iter = 0; iter < 15; iter++) {
    const prev = current;
    const b2 = [];
    let ok = true;
    for (const ch of current) {
      const cp = ch.codePointAt(0);
      if (cp < 0x80) b2.push(cp);
      else {
        const b = recoverByte(cp);
        if (b < 0) { ok = false; break; }
        b2.push(b);
      }
    }
    if (!ok) break;
    const decoded = new TextDecoder('utf-8').decode(Uint8Array.from(b2));
    if ([...decoded].some(c => c === '\uFFFD')) break;
    current = decoded;
    if (current === prev) break;
  }
  return current;
}

function walk(dir, exts) {
  const files = [];
  try {
    const entries = readdirSync(dir, { withFileTypes: true });
    for (const e of entries) {
      if (e.name.startsWith('.') || e.name === 'node_modules' || e.name === 'dist' || e.name === '.git' || e.name === 'bin' || e.name === 'obj' || e.name === '.angular' || e.name === 'packages') continue;
      if (e.name === 'extraer-fffd.mjs' || e.name === 'find-wrong-fixes.mjs') continue;
      const fp = join(dir, e.name);
      if (e.isDirectory()) files.push(...walk(fp, exts));
      else if (e.isFile() && exts.some(x => e.name.toLowerCase().endsWith(x))) files.push(fp);
    }
  } catch(e) {}
  return files;
}

const rootDir = process.argv[2] || '.';
const baseDir = join(import.meta.dirname, '..', rootDir);
// .md agregado 2026-09-21 (mismo cambio que scan-mojibake.mjs) — ver ese
// archivo para el porqué. Comparación case-insensitive por los .MD en mayúscula.
const exts = ['.ts', '.html', '.scss', '.cs', '.json', '.js', '.mjs', '.resx', '.md'];
console.log(`Escaneando ${baseDir} ...`);
// Soporta pasar un archivo suelto, igual que scan-mojibake.mjs.
const rootStat = statSync(baseDir, { throwIfNoEntry: false });
const files = (rootStat && rootStat.isFile())
  ? (exts.some(x => baseDir.toLowerCase().endsWith(x)) ? [baseDir] : [])
  : walk(baseDir, exts);
console.log(`Archivos: ${files.length}`);

let fixed = 0;
const errors = [];

for (const f of files) {
  try {
    const s = statSync(f);
    if (s.size > 2000000) continue;
    const original = readFileSync(f, 'utf-8');
    const chars = [...original];
    const result = [];
    let i = 0;
    let dirty = false;

    while (i < chars.length) {
      const cp = chars[i].codePointAt(0);
      if (!isCorruptChar(cp)) { result.push(chars[i]); i++; continue; }

      // U+FFFD special handling: word-context matching
      if (cp === 0xFFFD) {
        const { word } = extractWord(chars, i);
        const correct = fixFFFD(word);
        result.push(correct);
        dirty = true;
        i++;
        continue;
      }

      let j = i + 1;
      while (j < chars.length && isCorruptChar(chars[j].codePointAt(0))) j++;
      if (j - i <= 1) {
        if (j < chars.length) {
          const next = chars[j].codePointAt(0);
          if (next >= 0xA0 && next <= 0xFF && !FALSE_POSITIVES.has(next)) j++;
        }
      }

      const seq = chars.slice(i, j).join('');
      const fixedStr = fixRoundtrip(seq);
      if (fixedStr && fixedStr !== seq) {
        result.push(fixedStr);
        dirty = true;
        i = j;
        continue;
      }
      result.push(chars[i]);
      i++;
    }

    if (dirty) {
      writeFileSync(f, result.join(''), 'utf-8');
      console.log(`  ✓ ${relative(baseDir, f)}`);
      fixed++;
    }
  } catch(e) {
    errors.push({ file: f, error: e.message });
  }
}

console.log(`\nCorregidos: ${fixed} archivos.`);
if (errors.length) {
  console.log(`Errores: ${errors.length}`);
  for (const e of errors) console.log(`  ✗ ${e.file}: ${e.error}`);
}
if (fixed === 0) console.log('Nada que corregir.');
