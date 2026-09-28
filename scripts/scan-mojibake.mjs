// scan-mojibake.mjs — Escáner rápido de mojibake v3
// Uso: node scripts/scan-mojibake.mjs [ruta]
// Escanea archivos en busca de patrones de corrupción conocidos y
// cualquier carácter fuera del rango español correcto que sea sospechoso.
import { readFileSync, readdirSync, statSync } from 'fs';
import { join, relative } from 'path';

// Mapa Windows-1252 para decorrupción universal
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
  // C3/C2/.. are corrupt when NOT followed by a valid Spanish vowel
  if ((cp === 0xC3 || cp === 0xC2)) return true;
  // F0 = emoji corruption start
  if (cp === 0xF0) return true;
  // Any C0-FF range char that's not Spanish OK
  if (cp >= 0xC0 && cp <= 0xFF) return true;
  // C1 control range / low cp1252 (0x80-0xBF): emoji/symbol mojibake components (e.g. 🎫)
  if (cp >= 0x80 && cp <= 0xBF) return true;
  // Any high char that maps in 1252
  if (cp >= 0x100 && rev1252[cp] !== undefined) return true;
  return false;
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

// Chequeo complementario (puntos ciegos de isCorruptChar): controles C1, BOM,
// sustitución sistemática ñ->ó, acentos corruptos conocidos y CJK en código.
// Cubre la corrupción hallada en 2026-08-14 (front Angular) que el detector de
// mojibake por roundtrip no alcanzaba.
// 2026-09-19: se agrega regla de mayúsculas con acento en minúscula (COMITé,
// OPERACIóN, GESTIóN) y diccionario ampliado de vocales sustituidas (mívil,
// lónea, óltimo, pógina, segón, genórica, Tútulo).
const ORTHO_CORRUPTIONS = {
  "Tútulos": "Títulos", "GESTIóN": "GESTIÓN", "ASIGNACIóN": "ASIGNACIÓN",
  "mívil": "móvil", "lónea": "línea", "óltimo": "último", "pógina": "página",
  "segón": "según", "genórica": "genérica", "Tútulo": "Título",
  "invólido": "inválido", "diólogo": "diálogo"
};

// Palabra en MAYÚSCULAS (>=2) seguida de vocal acentuada minúscula:
// p.ej. COMITé, OPERACIóN. En español correcto el acento sería mayúscula.
const UPPERCASE_ACCENT_LOWERCASE = /\b[A-ZÁÉÍÓÚÑ]{2,}[áéíóúñ]/;

function findOrthoIssues(content, file) {
  const out = [];
  const lines = content.split(/\r?\n/);
  const isDoc = /\.(md|txt)$/i.test(file);
  for (let li = 0; li < lines.length; li++) {
    const line = lines[li];
    const ln = li + 1;
    for (const ch of line) {
      const cp = ch.codePointAt(0);
      if (cp >= 0x80 && cp <= 0x9F && cp !== 0x09 && cp !== 0x0a && cp !== 0x0d) {
        out.push({ ln, msg: `control C1 U+${cp.toString(16).toUpperCase()}`, seq: ch });
        break;
      }
      if (!isDoc && cp >= 0x4e00 && cp <= 0x9fff) {
        out.push({ ln, msg: `carácter CJK U+${cp.toString(16).toUpperCase()} en código`, seq: ch });
        break;
      }
    }
    // Nota (2026-09-21): este bloque (sustitución ortográfica, diccionario de
    // vocales corruptas, doble-codificación Ã+byte) antes se desactivaba para
    // .md/.txt con `if (!isDoc)`. Justo ahí apareció la corrupción real
    // (CONVENTIONS.md y 8 documentos más de conventions/ tenían "médulo",
    // "mívil", "aœ", etc. sin que el escáner los detectara). Solo el chequeo
    // de CJK-en-código sigue restringido a código (más arriba).
    {
      const m = line.match(/[óÓ]o/);
      if (m) out.push({ ln, msg: `sustitución "óo" (¿debe ser "ño"?)`, seq: m[0] });
      for (const [bad, good] of Object.entries(ORTHO_CORRUPTIONS)) {
        if (line.includes(bad)) out.push({ ln, msg: `acento/vocal corrupta "${bad}"`, seq: bad, fix: good });
      }
      const mCaps = line.match(UPPERCASE_ACCENT_LOWERCASE);
      if (mCaps) out.push({ ln, msg: `acento minúscula en palabra mayúscula "${mCaps[0]}"`, seq: mCaps[0] });
      const m2 = line.match(/\u00C3[\u00A1\u00A9\u00AD\u00B3\u00BA\u0081\u008D\u00B1\u00BC\u00BF]/);
      if (m2) {
        const before = m2.index > 0 ? line[m2.index - 1] : '';
        const after = m2.index + m2[0].length < line.length ? line[m2.index + m2[0].length] : '';
        if (before && before.codePointAt(0) >= 0x80 && before.codePointAt(0) <= 0xBF) continue;
        if (after && after.codePointAt(0) >= 0xC0) continue;
        const fixes = {
          '\u00C3\u00A1': 'á', '\u00C3\u00A9': 'é', '\u00C3\u00AD': 'í',
          '\u00C3\u00B3': 'ó', '\u00C3\u00BA': 'ú', '\u00C3\u0081': 'Á',
          '\u00C3\u008D': 'Í', '\u00C3\u00B1': 'ñ', '\u00C3\u00BC': 'ü',
          '\u00C3\u00BF': '¿'
        };
        out.push({ ln, msg: `mojibake UTF-8→Latin-1`, seq: m2[0], fix: fixes[m2[0]] || '?' });
      }
    }
  }
  if (content.includes(String.fromCharCode(0xFEFF))) out.push({ ln: 1, msg: "BOM UTF-8 (U+FEFF)", seq: String.fromCharCode(0xFEFF) });
  return out;
}

function walk(dir, exts) {
  const files = [];
  try {
    const entries = readdirSync(dir, { withFileTypes: true });
    for (const e of entries) {
      if (e.name.startsWith('.') || e.name === 'node_modules' || e.name === 'dist' || e.name === '.git' || e.name === 'bin' || e.name === 'obj' || e.name === '.angular' || e.name === 'packages' || e.name === 'scratchpad' || e.name === 'scripts') continue;
      if (e.name === 'extraer-fffd.mjs' || e.name === 'find-wrong-fixes.mjs') continue;
      const fp = join(dir, e.name);
      if (e.isDirectory()) files.push(...walk(fp, exts));
      else if (e.isFile() && exts.some(x => e.name.toLowerCase().endsWith(x))) files.push(fp);
    }
  } catch(e) {}
  return files;
}

const rootDirs = process.argv.slice(2);
if (rootDirs.length === 0) rootDirs.push('.');

// .md agregado 2026-09-21: antes los documentos de conventions/ y docs/ nunca
// se recorrían (ni el escáner los veía), independientemente del bug de arriba.
// Comparación case-insensitive para cubrir también archivos `.MD`.
const exts = ['.ts', '.html', '.scss', '.cs', '.json', '.js', '.mjs', '.resx', '.md'];

const files = [];
for (const rootDir of rootDirs) {
  const baseDir = join(import.meta.dirname, '..', rootDir);
  console.log(`Escaneando ${baseDir} ...`);
  // Soporta pasar un archivo suelto (antes solo aceptaba directorios: un
  // statSync a un archivo tiraba dentro del try/catch de walk() y se ignoraba
  // en silencio, dando "Archivos: 0" sin avisar del error de uso).
  const st = statSync(baseDir, { throwIfNoEntry: false });
  if (st && st.isFile()) {
    if (exts.some(x => baseDir.toLowerCase().endsWith(x))) files.push(baseDir);
  } else {
    files.push(...walk(baseDir, exts));
  }
}
console.log(`Archivos: ${files.length}`);

let total = 0;
const results = [];
const BYTES_TO_SHOW = 30;

for (const f of files) {
  try {
    const s = statSync(f);
    if (s.size > 2000000) continue;
    const content = readFileSync(f, 'utf-8');
    const chars = [...content];
    let i = 0;
    while (i < chars.length) {
      const cp = chars[i].codePointAt(0);
      if (!isCorruptChar(cp)) { i++; continue; }
      // Gather contiguous corruption sequence
      let j = i + 1;
      while (j < chars.length && isCorruptChar(chars[j].codePointAt(0))) j++;
      // If only 1 char and it's contextual (C3/C2), need more context
      if (j - i <= 1) {
        // Try to include next non-corrupt char that's in 0xA0-0xFF
        if (j < chars.length) {
          const next = chars[j].codePointAt(0);
          if (next >= 0xA0 && next <= 0xFF && !FALSE_POSITIVES.has(next)) {
            j++;
          }
        }
      }
      const seq = chars.slice(i, j).join('');
      let fixed = fixRoundtrip(seq);
      // U+FFFD special case: fixRoundtrip returns null, but we must report it
      if (!fixed && [...seq].some(c => c === '\uFFFD')) {
        total++;
        const ctxStart = Math.max(0, i - BYTES_TO_SHOW);
        const ctx = chars.slice(ctxStart, j + BYTES_TO_SHOW).join('').replace(/\n/g, '\\n');
        const rel = f;
        results.push({ file: rel, pos: i, corrupt: seq, fixed: 'é', ctx, isEmoji: false });
        i = j;
        continue;
      }
      if (fixed && fixed !== seq && fixed !== seq + ' ') {
        total++;
        const ctxStart = Math.max(0, i - BYTES_TO_SHOW);
        const ctx = chars.slice(ctxStart, j + BYTES_TO_SHOW).join('').replace(/\n/g, '\\n');
        const rel = f;
        const isEmoji = [...fixed].some(c => c.codePointAt(0) > 0xFFFF);
        results.push({ file: rel, pos: i, corrupt: seq, fixed, ctx, isEmoji });
      }
      i = j;
    }
    const ortho = findOrthoIssues(content, f);
    for (const o of ortho) {
      total++;
      results.push({ file: f, pos: o.ln, corrupt: o.seq, fixed: o.fix || "", ctx: o.msg, isEmoji: false });
    }
  } catch(e) { console.error('CAUGHT', e && e.message, e && e.stack); }
}

if (results.length === 0) {
  console.log('\n✓ CERO mojibake / corrupción ortográfica encontrado (scan-mojibake.mjs).');
  process.exit(0);
} else {
  for (const r of results) {
    console.log(`[${r.file}:${r.pos}] "${r.corrupt}" -> "${r.fixed}"  ctx: ...${r.ctx}...`);
    if (r.isEmoji) {
      const emojis = [...r.fixed].filter(c => c.codePointAt(0) > 0xFFFF);
      console.log(`  emoji: ${emojis.map(c => 'U+' + c.codePointAt(0).toString(16).toUpperCase()).join(' ')}`);
    }
    console.log('');
  }
  console.log(`\nTotal: ${total} ocurrencias.`);
  console.log('Para corregir: node scripts/fix-mojibake.mjs [ruta]');
  process.exit(1);
}
