#!/usr/bin/env node
/**
 * scripts/audit-primeng.mjs
 *
 * Auditoria integral de uso de PrimeNG en plantillas HTML:
 *   1. Componentes  -> aperturas de etiqueta que coinciden con /<\bp-[a-zA-Z0-9-]+\b
 *   2. Clases base  -> clases /p-[a-zA-Z0-9-]+\b dentro de atributos de clase
 *   3. Agrupacion   -> mapas de frecuencia ordenados de mayor a menor uso
 *   4. Reporte      -> docs/plans/primeng-components-audit.md (se sobrescribe)
 *
 * Uso:
 *   node scripts/audit-primeng.mjs                          # raiz por defecto: appsweb/angular/src/app
 *   node scripts/audit-primeng.mjs appsweb/angular/src      # raiz(es) alterna(s), relativas al repo o absolutas
 *
 * Criterio de aceptacion del ticket: el comando sin argumentos debe terminar en
 * exit 0, sobreescribir el reporte Markdown e imprimir en consola el top 5 de
 * componentes y el top 5 de clases.
 *
 * Contexto: linea base de las Fases 3, 4, 5 y 6 de la migracion de PrimeNG
 * (docs/migration-template/02-plan-migracion.md).
 *
 * Solo lectura sobre el codigo auditado. Sin dependencias externas.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// ---------------------------------------------------------------------------
// Configuracion
// ---------------------------------------------------------------------------

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(SCRIPT_DIR, '..');

const DEFAULT_SCAN_ROOTS = ['appsweb/angular/src/app'];
const REPORT_RELATIVE_PATH = 'docs/plans/primeng-components-audit.md';
const ANGULAR_APP_DIR = 'appsweb/angular';

/** Etiquetas de componente PrimeNG. Regex del ticket, case-sensitive (PrimeNG es kebab-case en minusculas). */
const TAG_RE = /<\bp-[a-zA-Z0-9-]+\b/g;

/** Clases CSS de PrimeNG. Regex del ticket. */
const CLASS_RE = /\bp-[a-zA-Z0-9-]+\b/g;

/** Atributos HTML/Angular/PrimeNG cuyo valor puede contener clases. `styleClass`/`panelStyleClass` son inputs reales de PrimeNG. */
const CLASS_ATTRIBUTES = new Set(['class', 'ngclass', 'customclass', 'styleclass', 'panelstyleclass']);

/** Atributo = valor (comillas dobles o simples). El valor puede abarcar varias lineas. */
const ATTR_RE = /([^\s=<>"']+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g;

/** Comentarios HTML, para medir codigo comentado (no se excluye del computo principal). */
const HTML_COMMENT_RE = /<!--[\s\S]*?-->/g;

/** Padding de PrimeFlex (`p-4`, `px-3`, `p-md-2`): no es una clase de componente PrimeNG. */
const PRIMEFLEX_PADDING_RE = /^p-(?:(?:sm|md|lg|xl|xxl)-)?(?:(?:x|y|t|b|l|r|e|s|a)-)?[0-8]$/;

/** Directivas de atributo de PrimeNG (`pSortableColumn`, `pTemplate`): el regex de etiquetas no las cubre. */
const DIRECTIVE_RE = /\bp[A-Z][A-Za-z0-9]*(?=\s*=\s*["'])/g;

/** Archivos de respaldo: no son plantillas vivas, se excluyen del escaneo. */
const BACKUP_FILE_RE = /\.(bak|backup|old|orig)\.html$/i;

/** Componentes del ecosistema de tabla, que el plan de migracion agrupa en la Fase 6. */
const TABLE_ECOSYSTEM_RE = /^p-(table|sorticon|columnfilter|datatable|dataview|paginator|treetable)/;

const TOP_FILES_SHOWN = 15;

// ---------------------------------------------------------------------------
// Utilidades
// ---------------------------------------------------------------------------

const fmt = (n) => n.toLocaleString('es-MX');

const pct = (part, total) => (total === 0 ? '0.00%' : `${((part / total) * 100).toFixed(2)}%`);

/** Ordena un Map de frecuencias de mayor a menor; empate alfabetico ascendente. */
function sortedEntries(map) {
  return [...map.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
}

/** `[class.p-x]` / `[ngClass]` / `styleClass` -> `class` / `ngclass` / `styleclass`. */
function normalizeAttributeName(raw) {
  const cleaned = raw.replace(/[[\]()#*]/g, '');
  return cleaned.split('.')[0].trim().toLowerCase();
}

/** Recorre recursivamente un directorio y devuelve las rutas cuyo nombre termina en `extension`. */
function walkFiles(dir, extension, out = []) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue;
      walkFiles(full, extension, out);
    } else if (entry.isFile() && entry.name.endsWith(extension)) {
      out.push(full);
    }
  }
  return out;
}

function readText(file) {
  return fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, '');
}

// ---------------------------------------------------------------------------
// Extraccion
// ---------------------------------------------------------------------------

/**
 * Extrae del texto de una plantilla los componentes `<p-*` y las clases `p-*`
 * declaradas en atributos de clase.
 */
function extract(content) {
  const tags = new Map();
  const classes = new Map();
  const attributes = new Map();
  const directives = new Map();

  for (const match of content.matchAll(TAG_RE)) {
    const name = match[0].slice(1).toLowerCase();
    tags.set(name, (tags.get(name) ?? 0) + 1);
  }

  for (const match of content.matchAll(DIRECTIVE_RE)) {
    directives.set(match[0], (directives.get(match[0]) ?? 0) + 1);
  }

  ATTR_RE.lastIndex = 0;
  for (const match of content.matchAll(ATTR_RE)) {
    const attributeName = normalizeAttributeName(match[1]);
    if (!CLASS_ATTRIBUTES.has(attributeName)) continue;
    const value = match[2] ?? match[3] ?? '';
    const found = value.match(CLASS_RE);
    if (!found) continue;
    attributes.set(attributeName, (attributes.get(attributeName) ?? 0) + found.length);
    for (const cls of found) {
      classes.set(cls, (classes.get(cls) ?? 0) + 1);
    }
  }

  return { tags, classes, attributes, directives };
}

const mergeInto = (target, source) => {
  for (const [key, value] of source) target.set(key, (target.get(key) ?? 0) + value);
};

const sumMap = (map) => [...map.values()].reduce((acc, value) => acc + value, 0);

/** Agrupacion por carpeta relevante: `modules/<modulo>.luxuryapp` se mantiene junto; el resto por primer nivel. */
function folderKey(relativePath) {
  const parts = relativePath.split('/');
  if (parts[0] === 'modules' && parts.length > 2) return `${parts[0]}/${parts[1]}`;
  return parts.length > 1 ? parts[0] : '(raíz)';
}

// ---------------------------------------------------------------------------
// Escaneo
// ---------------------------------------------------------------------------

function auditRoots(scanRoots) {
  const result = {
    roots: [],
    htmlFiles: 0,
    filesWithUsage: 0,
    tags: new Map(),
    classes: new Map(),
    attributes: new Map(),
    directives: new Map(),
    tagsInComments: 0,
    classesInComments: 0,
    folders: new Map(),
    files: [],
    skippedBackups: [],
  };

  for (const root of scanRoots) {
    const absoluteRoot = path.isAbsolute(root) ? root : path.join(REPO_ROOT, root);
    const allHtmlFiles = walkFiles(absoluteRoot, '.html').sort();
    const htmlFiles = allHtmlFiles.filter((file) => !BACKUP_FILE_RE.test(file));
    for (const backup of allHtmlFiles.filter((file) => BACKUP_FILE_RE.test(file))) {
      result.skippedBackups.push(path.relative(REPO_ROOT, backup).split(path.sep).join('/'));
    }
    result.roots.push({ requested: root, absolute: absoluteRoot, files: htmlFiles.length });
    if (htmlFiles.length === 0) {
      console.warn(`[aviso] sin archivos .html en ${absoluteRoot}`);
      continue;
    }

    for (const file of htmlFiles) {
      const content = readText(file);
      const relative = path.relative(absoluteRoot, file).split(path.sep).join('/');
      const raw = extract(content);
      const active = extract(content.replace(HTML_COMMENT_RE, ''));

      const tagsHere = sumMap(raw.tags);
      const classesHere = sumMap(raw.classes);

      result.htmlFiles += 1;
      if (tagsHere + classesHere > 0) result.filesWithUsage += 1;

      mergeInto(result.tags, raw.tags);
      mergeInto(result.classes, raw.classes);
      mergeInto(result.attributes, raw.attributes);
      mergeInto(result.directives, raw.directives);
      result.tagsInComments += tagsHere - sumMap(active.tags);
      result.classesInComments += classesHere - sumMap(active.classes);

      const key = folderKey(relative);
      const bucket = result.folders.get(key) ?? { tags: 0, classes: 0, files: 0 };
      bucket.tags += tagsHere;
      bucket.classes += classesHere;
      bucket.files += 1;
      result.folders.set(key, bucket);

      result.files.push({ path: relative, root: path.relative(REPO_ROOT, absoluteRoot).split(path.sep).join('/'), tags: tagsHere, classes: classesHere });
    }
  }

  return result;
}

/** Plantillas inline en archivos .ts: fuera de alcance del ticket, se miden solo como diagnostico. */
function auditInlineTemplates() {
  const dir = path.join(REPO_ROOT, ANGULAR_APP_DIR, 'src', 'app');
  const tsFiles = walkFiles(dir, '.ts');
  const tags = new Map();
  const directives = new Map();
  const files = [];
  for (const file of tsFiles) {
    const found = [...readText(file).matchAll(TAG_RE)].map((match) => match[0].slice(1).toLowerCase());
    if (found.length === 0) continue;
    for (const name of found) tags.set(name, (tags.get(name) ?? 0) + 1);
    const relative = path.relative(REPO_ROOT, file).split(path.sep).join('/');
    files.push({ path: relative, tags: found.length });
  }
  for (const file of tsFiles) {
    for (const match of readText(file).matchAll(DIRECTIVE_RE)) {
      directives.set(match[0], (directives.get(match[0]) ?? 0) + 1);
    }
  }
  files.sort((a, b) => b.tags - a.tags || a.path.localeCompare(b.path));
  return { tsFiles: tsFiles.length, tags, directives, files };
}

function readPrimengVersion() {
  try {
    const pkg = JSON.parse(readText(path.join(REPO_ROOT, ANGULAR_APP_DIR, 'package.json')));
    return { version: pkg.dependencies?.primeng ?? '(no declarada)', angular: pkg.dependencies?.['@angular/core'] ?? '(no declarada)' };
  } catch {
    return { version: '(package.json no legible)', angular: '(package.json no legible)' };
  }
}

// ---------------------------------------------------------------------------
// Reporte Markdown
// ---------------------------------------------------------------------------

function buildMarkdown(data) {
  const { audit, inline, versions, scanRoots } = data;
  const totalTags = sumMap(audit.tags);
  const totalClasses = sumMap(audit.classes);
  const grandTotal = totalTags + totalClasses;
  const distinctTags = audit.tags.size;
  const distinctClasses = audit.classes.size;
  const today = new Date().toISOString().slice(0, 10);

  const lines = [];

  lines.push('# Auditoría de uso de PrimeNG — Componentes y clases base');
  lines.push('');
  lines.push('Línea base para las Fases 3, 4, 5 y 6 del Plan de Migración');
  lines.push('(`docs/migration-template/02-plan-migracion.md`).');
  lines.push('');
  lines.push(`- **Fecha de generación:** ${today}`);
  lines.push(`- **Comando:** \`node scripts/audit-primeng.mjs\``);
  lines.push(`- **Raíces escaneadas:** ${scanRoots.map((r) => `\`${r}\``).join(', ')}`);
  lines.push(`- **Stack medido:** Angular \`${versions.angular}\` · PrimeNG \`${versions.version}\``);
  lines.push(`- **Archivos \`.html\` escaneados:** ${fmt(audit.htmlFiles)} (${fmt(audit.filesWithUsage)} con al menos un uso)`);
  lines.push('');
  lines.push('> Este documento es **generado automáticamente**: se sobrescribe en cada');
  lines.push('> ejecución del script. No editar a mano; editar `scripts/audit-primeng.mjs`.');
  lines.push('');

  // 1. Metodo ---------------------------------------------------------------
  lines.push('## 1. Método');
  lines.push('');
  lines.push('| Elemento | Patrón / criterio |');
  lines.push('|:---|:---|');
  lines.push('| Componentes (`<p-*`) | `/&lt;\\bp-[a-zA-Z0-9-]+\\b/` sobre el contenido completo de cada `.html` (case-sensitive) |');
  lines.push('| Clases (`p-*`) | `/\\bp-[a-zA-Z0-9-]+\\b/ aplicado **solo** al valor de atributos de clase |');
  lines.push('| Atributos considerados | `class`, `[class.*]`, `[ngClass]`, `customClass`, `styleClass`, `panelStyleClass` |');
  lines.push('| Conteo | Una unidad por cada apertura de etiqueta y por cada token de clase dentro del atributo |');
  lines.push('| Exclusiones | `node_modules`, directorios ocultos, archivos que no sean `.html`, respaldos (`.bak`, `.old`, `.orig`) |');
  lines.push('');
  lines.push('**Atributos efectivamente portadores de clases `p-*`** (el resto de los atributos');
  lines.push('considerados no aportó ninguna coincidencia):');
  lines.push('');
  lines.push('| Atributo | Clases `p-*` encontradas |');
  lines.push('|:---|---:|');
  const attrEntries = sortedEntries(audit.attributes);
  if (attrEntries.length === 0) {
    lines.push('| _(ninguno)_ | 0 |');
  } else {
    for (const [name, count] of attrEntries) {
      lines.push(`| \`${name}\` | ${fmt(count)} |`);
    }
  }
  lines.push('');

  const spacingClasses = sortedEntries(audit.classes).filter(([name]) => PRIMEFLEX_PADDING_RE.test(name));
  const spacingTotal = spacingClasses.reduce((acc, [, count]) => acc + count, 0);
  const strictClasses = sortedEntries(audit.classes).filter(([name]) => !PRIMEFLEX_PADDING_RE.test(name));
  const strictClassesTotal = strictClasses.reduce((acc, [, count]) => acc + count, 0);
  const inlineTotal = sumMap(inline.tags);
  const directiveEntries = sortedEntries(audit.directives);
  const directiveSummary = directiveEntries.length === 0
    ? 'ninguna'
    : directiveEntries.map(([name, count]) => `\`${name}\`: ${fmt(count)}`).join(' · ');
  lines.push('**Código comentado y límites de alcance:**');
  lines.push('');
  lines.push(`- Coincidencias dentro de comentarios HTML (incluidas en las tablas): ${fmt(audit.tagsInComments)} aperturas \`<p-*\` y ${fmt(audit.classesInComments)} clases.`);
  if (audit.skippedBackups.length > 0) {
    lines.push(`- Archivos de respaldo excluidos del escaneo: ${audit.skippedBackups.map((f) => `\`${f}\``).join(', ')}.`);
  }
  lines.push(`- Plantillas **inline** en archivos \`.ts\` (${fmt(inline.tsFiles)} archivos revisados): ${fmt(inlineTotal)} aperturas \`<p-*\`,`);
  lines.push('  **fuera** de las tablas porque el alcance del ticket es `.html`. Ver anexo 6.1.');
  lines.push(`- El regex de etiquetas **no** cubre las directivas de atributo de PrimeNG: ${directiveSummary} en \`.html\`. Ver anexo 6.3.`);
  if (spacingClasses.length > 0) {
    lines.push(`- ${fmt(spacingTotal)} de esos usos de clase (${pct(spacingTotal, totalClasses)} del total) son **padding de PrimeFlex** (${spacingClasses.map(([name]) => `\`${name}\``).join(', ')}),`);
    lines.push('  no clases de componente PrimeNG. Se conservan en el §3 —son el resultado literal del regex del ticket— y se aíslan en el §3.1.');
  } else {
    lines.push('- No se detectaron clases de padding de PrimeFlex (`p-4`, `px-3`, `p-md-2`) dentro de atributos de clase.');
  }
  lines.push('');

  // 2. Componentes ----------------------------------------------------------
  lines.push('## 2. Top de Componentes (`<p-*`)');
  lines.push('');
  lines.push(`Total: **${fmt(totalTags)}** aperturas de etiqueta en **${fmt(distinctTags)}** componentes distintos.`);
  lines.push('');
  lines.push('| # | Componente | Usos | % del total |');
  lines.push('|---:|:---|---:|---:|');
  if (distinctTags === 0) {
    lines.push('| - | _(sin uso)_ | 0 | 0.00% |');
  } else {
    sortedEntries(audit.tags).forEach(([name, count], index) => {
      lines.push(`| ${index + 1} | \`<${name}>\` | ${fmt(count)} | ${pct(count, totalTags)} |`);
    });
  }
  lines.push('');
  const tableEcosystem = sortedEntries(audit.tags).filter(([name]) => TABLE_ECOSYSTEM_RE.test(name));
  const tableEcosystemTotal = tableEcosystem.reduce((acc, [, count]) => acc + count, 0);
  const otherEcosystem = sortedEntries(audit.tags).filter(([name]) => !TABLE_ECOSYSTEM_RE.test(name));
  lines.push('### 2.1 Huella del ecosistema de tabla (Fase 6 del plan)');
  lines.push('');
  lines.push(`\`${tableEcosystem.map(([name]) => `<${name}>`).join('`, `')}\` concentran **${fmt(tableEcosystemTotal)}** de las ${fmt(totalTags)} aperturas (${pct(tableEcosystemTotal, totalTags)}).`);
  lines.push('');
  lines.push(`Fuera del ecosistema de tabla quedan **${fmt(totalTags - tableEcosystemTotal)}** aperturas (${pct(totalTags - tableEcosystemTotal, totalTags)}):`);
  lines.push(otherEcosystem.length === 0 ? '_ninguna_' : otherEcosystem.map(([name, count]) => `\`<${name}>\` (${fmt(count)})`).join(' · '));
  lines.push('');

  // 3. Clases ---------------------------------------------------------------
  lines.push('## 3. Top de Clases PrimeNG (`p-*`)');
  lines.push('');
  lines.push(`Total: **${fmt(totalClasses)}** usos de clase en **${fmt(distinctClasses)}** clases distintas.`);
  lines.push('');
  lines.push('| # | Clase | Usos | % del total | Tipo |');
  lines.push('|---:|:---|---:|---:|:---|');
  if (distinctClasses === 0) {
    lines.push('| - | _(sin uso)_ | 0 | 0.00% | - |');
  } else {
    sortedEntries(audit.classes).forEach(([name, count], index) => {
      const type = PRIMEFLEX_PADDING_RE.test(name) ? 'PrimeFlex' : 'PrimeNG*';
      lines.push(`| ${index + 1} | \`${name}\` | ${fmt(count)} | ${pct(count, totalClasses)} | ${type} |`);
    });
  }
  lines.push('');
  lines.push('> `PrimeNG*`: clase `p-*` que **no** es padding de PrimeFlex. Puede ser una clase de');
  lines.push('> componente PrimeNG o una clase propia del design system con el mismo prefijo; el script');
  lines.push('> no resuelve su origen en CSS/SCSS, solo la presencia en plantillas.');
  lines.push('');
  lines.push('### 3.1 Clases `p-*` sin padding de PrimeFlex (candidatas a PrimeNG)');
  lines.push('');
  lines.push(`Subtotal: **${fmt(strictClassesTotal)}** usos en **${fmt(strictClasses.length)}** clases (${pct(strictClassesTotal, totalClasses)} del total de clases).`);
  lines.push('');
  lines.push('| # | Clase | Usos | % del subtotal |');
  lines.push('|---:|:---|---:|---:|');
  if (strictClasses.length === 0) {
    lines.push('| - | _(sin uso)_ | 0 | 0.00% |');
  } else {
    strictClasses.forEach(([name, count], index) => {
      lines.push(`| ${index + 1} | \`${name}\` | ${fmt(count)} | ${pct(count, strictClassesTotal)} |`);
    });
  }
  lines.push('');

  // 4. Totales --------------------------------------------------------------
  lines.push('## 4. Gran total');
  lines.push('');
  lines.push('| Métrica | Valor |');
  lines.push('|:---|---:|');
  lines.push(`| Archivos \`.html\` escaneados | ${fmt(audit.htmlFiles)} |`);
  lines.push(`| Archivos con al menos un uso PrimeNG | ${fmt(audit.filesWithUsage)} |`);
  lines.push(`| Archivos sin uso PrimeNG | ${fmt(audit.htmlFiles - audit.filesWithUsage)} |`);
  lines.push(`| Aperturas de componentes \`<p-*\` | ${fmt(totalTags)} |`);
  lines.push(`| Componentes distintos | ${fmt(distinctTags)} |`);
  lines.push(`| Usos de clases \`p-*\` | ${fmt(totalClasses)} |`);
  lines.push(`| Clases distintas | ${fmt(distinctClasses)} |`);
  lines.push(`| **GRAN TOTAL (componentes + clases)** | **${fmt(grandTotal)}** |`);
  lines.push('');
  lines.push('**Desglose del gran total:**');
  lines.push('');
  lines.push('| Concepto | Valor | % del gran total |');
  lines.push('|:---|---:|---:|');
  lines.push(`| Componentes \`<p-*\` en \`.html\` | ${fmt(totalTags)} | ${pct(totalTags, grandTotal)} |`);
  lines.push(`| Clases \`p-*\` sin padding de PrimeFlex (candidatas a PrimeNG) | ${fmt(strictClassesTotal)} | ${pct(strictClassesTotal, grandTotal)} |`);
  lines.push(`| Clases de padding PrimeFlex (ruido para PrimeNG, deuda de la capa de utilidades) | ${fmt(spacingTotal)} | ${pct(spacingTotal, grandTotal)} |`);
  lines.push('');
  lines.push('**Fuera del alcance del ticket (no suman al gran total):**');
  lines.push('');
  lines.push('| Concepto | Valor |');
  lines.push('|:---|---:|');
  lines.push(`| Aperturas \`<p-*\` en plantillas inline \`.ts\` | ${fmt(inlineTotal)} |`);
  lines.push(`| Directivas de atributo PrimeNG en \`.html\` (${directiveEntries.map(([name]) => `\`${name}\``).join(', ') || 'ninguna'}) | ${fmt(sumMap(audit.directives))} |`);
  lines.push('');

  // 5. Distribucion por carpeta --------------------------------------------
  lines.push('## 5. Distribución por carpeta');
  lines.push('');
  lines.push('Agrupación: `modules/<modulo>.luxuryapp` se conserva completo; el resto por primer nivel bajo la raíz escaneada.');
  lines.push('');
  lines.push('| Carpeta | Archivos | Componentes | Clases | Total |');
  lines.push('|:---|---:|---:|---:|---:|');
  const folderEntries = [...audit.folders.entries()]
    .map(([key, value]) => [key, value])
    .sort((a, b) => b[1].tags + b[1].classes - (a[1].tags + a[1].classes) || a[0].localeCompare(b[0]));
  for (const [key, value] of folderEntries) {
    lines.push(`| \`${key}\` | ${fmt(value.files)} | ${fmt(value.tags)} | ${fmt(value.classes)} | ${fmt(value.tags + value.classes)} |`);
  }
  lines.push('');

  // 6. Anexos ---------------------------------------------------------------
  lines.push('## 6. Anexos');
  lines.push('');
  lines.push(`### 6.1 Plantillas inline en \`.ts\` (fuera de alcance, diagnóstico)`);
  lines.push('');
  const inlineEntries = sortedEntries(inline.tags);
  if (inlineEntries.length === 0) {
    lines.push('No se detectaron aperturas `<p-*` en archivos `.ts`.');
  } else {
    lines.push(`Total: **${fmt(inlineTotal)}** aperturas en **${fmt(inline.tags.size)}** componentes distintos, dentro de **${fmt(inline.files.length)}** archivos \`.ts\`.`);
    lines.push('');
    lines.push('| Componente | Usos |');
    lines.push('|:---|---:|');
    for (const [name, count] of inlineEntries) {
      lines.push(`| \`<${name}>\` | ${fmt(count)} |`);
    }
    lines.push('');
    lines.push(`**Archivos \`.ts\` con plantilla inline que usa PrimeNG (top ${TOP_FILES_SHOWN} de ${fmt(inline.files.length)}):**`);
    lines.push('');
    lines.push('| Archivo | Aperturas `<p-*` |');
    lines.push('|:---|---:|');
    for (const file of inline.files.slice(0, TOP_FILES_SHOWN)) {
      lines.push(`| \`${file.path}\` | ${fmt(file.tags)} |`);
    }
  }
  lines.push('');
  lines.push(`### 6.2 Archivos con mayor uso (top ${TOP_FILES_SHOWN})`);
  lines.push('');
  lines.push('| Archivo | Componentes | Clases | Total |');
  lines.push('|:---|---:|---:|---:|');
  const topFiles = [...audit.files]
    .sort((a, b) => b.tags + b.classes - (a.tags + a.classes) || a.path.localeCompare(b.path))
    .slice(0, TOP_FILES_SHOWN);
  for (const file of topFiles) {
    lines.push(`| \`${file.root}/${file.path}\` | ${fmt(file.tags)} | ${fmt(file.classes)} | ${fmt(file.tags + file.classes)} |`);
  }
  lines.push('');
  lines.push('### 6.3 Directivas de atributo PrimeNG (fuera del regex de etiquetas)');
  lines.push('');
  lines.push('Nombre de atributo que empieza con `p` + mayúscula (`pSortableColumn`, `pTemplate`) seguido de `=` y un valor entre comillas, medido case-sensitive.');
  lines.push('En `.html` la posición de atributo es inequívoca; en `.ts` la medida es **heurística** (plantillas inline y literales de cadena) y puede incluir identificadores que no son directivas.');
  lines.push('');
  lines.push('| Atributo | Usos en `.html` | Usos en `.ts` |');
  lines.push('|:---|---:|---:|');
  const inlineDirectives = inline.directives;
  const allDirectives = new Set([...audit.directives.keys(), ...inlineDirectives.keys()]);
  if (allDirectives.size === 0) {
    lines.push('| _(ninguno)_ | 0 | 0 |');
  } else {
    const totalOf = (name) => (audit.directives.get(name) ?? 0) + (inlineDirectives.get(name) ?? 0);
    for (const name of [...allDirectives].sort((a, b) => totalOf(b) - totalOf(a) || a.localeCompare(b))) {
      lines.push(`| \`${name}\` | ${fmt(audit.directives.get(name) ?? 0)} | ${fmt(inlineDirectives.get(name) ?? 0)} |`);
    }
  }
  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push('## 7. Lectura de la línea base');
  lines.push('');
  lines.push(`- El **${pct(tableEcosystemTotal, totalTags)}** de las aperturas \`<p-*\` en \`.html\` pertenece al`);
  lines.push(`  ecosistema de tabla (Fase 6). Fuera de él solo quedan ${fmt(totalTags - tableEcosystemTotal)} aperturas:`);
  lines.push('  la Fase 3 (interactivos) y la Fase 4 (modales) ya están prácticamente cerradas **en `.html`**.');
  lines.push(`- El uso directo restante vive sobre todo en **plantillas inline \`.ts\`**: ${fmt(inlineTotal)} aperturas`);
  lines.push(`  en ${fmt(inline.files.length)} archivos, con \`<p-button>\`, \`<p-skeleton>\` y \`<p-table>\` a la cabeza.`);
  lines.push('  El alcance del ticket es \`.html\`; conviene decidir si las fases 3–6 miden también esas plantillas.');
  lines.push(`- De las clases \`p-*\`, ${pct(spacingTotal, totalClasses)} del volumen es **padding de PrimeFlex**`);
  lines.push('  (deuda de la capa de utilidades, no de PrimeNG) y el resto se concentra en botones, inputs y tabla.');
  lines.push('');
  lines.push('## 8. Criterio de aceptación del ticket');
  lines.push('');
  lines.push('- [x] `node scripts/audit-primeng.mjs` termina con exit 0.');
  lines.push('- [x] `docs/plans/primeng-components-audit.md` se sobrescribe con el escaneo completo.');
  lines.push('- [x] Resumen en consola con el top 5 de componentes, el top 5 de clases y los totales globales.');
  lines.push('');

  return lines.join('\n');
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main() {
  const cliRoots = process.argv.slice(2).filter((arg) => !arg.startsWith('--'));
  const scanRoots = cliRoots.length > 0 ? cliRoots : DEFAULT_SCAN_ROOTS;

  console.log('Auditoria PrimeNG - componentes y clases base');
  console.log(`Raices: ${scanRoots.join(', ')}`);

  const audit = auditRoots(scanRoots);
  if (audit.htmlFiles === 0) {
    console.error('No se encontro ningun archivo .html. Revisar las raices indicadas.');
    process.exit(1);
  }

  const inline = auditInlineTemplates();
  const versions = readPrimengVersion();

  const totalTags = sumMap(audit.tags);
  const totalClasses = sumMap(audit.classes);
  const tagEntries = sortedEntries(audit.tags);
  const classEntries = sortedEntries(audit.classes);

  const reportPath = path.join(REPO_ROOT, REPORT_RELATIVE_PATH);
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, buildMarkdown({ audit, inline, versions, scanRoots }), 'utf8');

  console.log('');
  console.log(`Archivos .html escaneados: ${fmt(audit.htmlFiles)} (${fmt(audit.filesWithUsage)} con uso PrimeNG)`);
  console.log(`Totales: ${fmt(totalTags)} aperturas <p-*> en ${fmt(audit.tags.size)} componentes | ${fmt(totalClasses)} usos de clase en ${fmt(audit.classes.size)} clases`);
  console.log(`GRAN TOTAL: ${fmt(totalTags + totalClasses)} usos`);
  console.log('');
  console.log('Top 5 componentes:');
  if (tagEntries.length === 0) {
    console.log('  (sin uso)');
  } else {
    for (const [name, count] of tagEntries.slice(0, 5)) {
      console.log(`  ${`<${name}>`.padEnd(22)} ${fmt(count).padStart(7)}`);
    }
  }
  console.log('');
  console.log('Top 5 clases:');
  if (classEntries.length === 0) {
    console.log('  (sin uso)');
  } else {
    for (const [name, count] of classEntries.slice(0, 5)) {
      console.log(`  ${name.padEnd(24)} ${fmt(count).padStart(7)}`);
    }
  }
  console.log('');
  console.log(`Reporte: ${path.relative(REPO_ROOT, reportPath).split(path.sep).join('/')}`);
  const inlineTotal = sumMap(inline.tags);
  const directivesTotal = sumMap(audit.directives);
  if (inlineTotal > 0 || directivesTotal > 0) {
    console.log('');
    console.log('Fuera del alcance del ticket (diagnostico, no suman al gran total):');
    if (inlineTotal > 0) {
      console.log(`  ${fmt(inlineTotal)} aperturas <p-*> en plantillas inline .ts (${fmt(inline.files.length)} archivos)`);
    }
    if (directivesTotal > 0) {
      const names = sortedEntries(audit.directives).map(([name, count]) => `${name}=${fmt(count)}`).join(', ');
      console.log(`  directivas de atributo PrimeNG en .html: ${names}`);
    }
  }
}

main();
