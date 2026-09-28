'use strict';
/**
 * API inventory scanner for api/LuxuryApp.Application/Modules
 *
 * Emits:
 *   scripts/api_inventory/api_inventory.json  (structured data)
 *   reporte_inventario_api.md                 (markdown report at repo root)
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..', 'api', 'LuxuryApp.Application', 'Modules');
const OUT_JSON = path.resolve(__dirname, 'api_inventory.json');
const OUT_MD = path.resolve(__dirname, '..', '..', 'reporte_inventario_api.md');

// ---------------------------------------------------------------------------
// Filesystem helpers
// ---------------------------------------------------------------------------
function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}
const norm = (p) => p.split(path.sep).join('/');
function rel(p) {
  return norm(path.relative(ROOT, p));
}
// ---------------------------------------------------------------------------
// Classification
// ---------------------------------------------------------------------------
function wordsOf(name) {
  return name
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
    .split(/[^A-Za-z0-9]+/)
    .filter(Boolean)
    .map((w) => w.toLowerCase());
}

const SCALAR_TYPES = /^(bool|boolean|string|int|long|decimal|double|float|guid|datetime|datetimeoffset|timespan|byte\[\]|void)$/i;

const COLLECTION_RX = /(List<|IEnumerable<|ICollection<|IReadOnlyList<|IReadOnlyCollection<|IQueryable<|Dictionary<|HashSet<|\[\]|Paged|Pagination)/i;

function classifyMethod(name, returnType, paramsStr) {
  const cleanName = name.replace(/Async$/, '');
  const words = wordsOf(cleanName);
  if (words.length === 0) return 'OTHER';
  const w0 = words[0];
  const tail = words.slice(1);
  const tailJoined = tail.join('');
  const rt = returnType || '';

  // Param named id (last token of any param) => strong single-resource signal
  const hasIdParam =
    typeof paramsStr === 'string' &&
    paramsStr
      .split(',')
      .map((p) => p.trim().split(/\s+/).pop() || '')
      .some((p) => /^id$/i.test(p) || /^\{?id\}?$/i.test(p));

  if (w0 === 'upsert') return 'UPDATE';
  if (['exists', 'is', 'has', 'can', 'tiene'].includes(w0)) return 'GET_SINGLE';
  if (['details', 'detail'].includes(w0)) return 'GET_SINGLE';

  if (
    ['get', 'find', 'fetch', 'obtener', 'consultar', 'consulta', 'buscar', 'preview', 'analyze', 'analiza', 'analizar'].includes(w0)
  ) {
    if (COLLECTION_RX.test(rt)) return 'GET_LIST';
    if (tail.length === 0) return hasIdParam ? 'GET_SINGLE' : 'GET_LIST';
    // GetById / GetByCustomerId / GetUserById patterns
    if (/^by(id|code|number|externalid|email|username|slug|key|token|folio)?$/.test(tailJoined)) {
      return 'GET_SINGLE';
    }
    if (/by(id|code|number|externalid|email|username|slug|key|token|folio)$/.test(tailJoined)) {
      return 'GET_SINGLE';
    }
    if (hasIdParam && tailJoined.endsWith('id')) return 'GET_SINGLE';
    if (SCALAR_TYPES.test(rt.replace(/^Task</, '').replace(/>$/, ''))) {
      return hasIdParam ? 'GET_SINGLE' : 'GET_LIST';
    }
    return 'GET_LIST';
  }
  if (['list', 'listar', 'lista', 'listas'].includes(w0)) return 'GET_LIST';
  if (['getall', 'getlist', 'getpaged', 'getpage', 'search', 'filter', 'paginate'].includes(w0)) {
    return 'GET_LIST';
  }
  if (['create', 'add', 'post', 'insert'].includes(w0)) return 'CREATE';
  if (['update', 'edit', 'put', 'modify', 'patch', 'set'].includes(w0)) return 'UPDATE';
  if (['delete', 'remove', 'destroy', 'erase', 'elimina', 'eliminar'].includes(w0)) return 'DELETE';

  const specialStarters = new Set([
    'approve', 'aprobar', 'aproba', 'reject', 'rechazar', 'recha', 'activate', 'activar',
    'deactivate', 'desactivar', 'send', 'envia', 'enviar', 'reenvia', 'reenviar', 'process',
    'procesa', 'procesar', 'calculate', 'calcula', 'calcular', 'recalculate', 'recalcular',
    'generate', 'genera', 'generar', 'validate', 'valida', 'validar', 'verify', 'toggle',
    'complete', 'completa', 'completar', 'reopen', 'reabrir', 'cancel', 'cancela', 'cancelar',
    'close', 'cierra', 'cerrar', 'open', 'abre', 'abrir', 'submit', 'publish', 'publica',
    'publicar', 'resolve', 'resolver', 'login', 'logout', 'refresh', 'reset', 'restore',
    'restaurar', 'recover', 'recuperar', 'convert', 'convertir', 'export', 'exporta',
    'exportar', 'import', 'importa', 'importar', 'duplicate', 'duplica', 'duplicar', 'clone',
    'clonar', 'sync', 'sincroniza', 'sincronizar', 'run', 'ejecuta', 'ejecutar', 'start',
    'inicia', 'iniciar', 'stop', 'detener', 'finalize', 'finaliza', 'finalizar', 'upload',
    'carga', 'cargar', 'download', 'descarga', 'descargar', 'assign', 'asigna', 'asignar',
    'reassign', 'reasigna', 'reasignar', 'unassign', 'desasignar', 'aplica', 'aplicar',
    'save', 'guarda', 'guardar', 'sign', 'firmar', 'lock', 'unlock', 'bloquea', 'bloquear',
    'desbloquea', 'desbloquear', 'register', 'registra', 'registrar', 'print', 'imprime',
    'autorizar', 'autoriza', 'authorize', 'revoke', 'revoca', 'revocar', 'confirm', 'confirma',
    'confirmar', 'revert', 'revertir', 'terminate', 'termina', 'terminar', 'issue', 'apply',
    'reconcile', 'concilia', 'conciliar', 'void', 'anular', 'anula', 'escalate', 'escala',
    'escalar', 'invalidate', 'invalida', 'invalidar', 'backfill', 'seed', 'reseed', 'resync',
    'execute', 'handle', 'change', 'cambia', 'cambiar', 'subir', 'initiate', 'ensure',
    'evaluate', 'evalua', 'evaluar', 'compute', 'autoapply', 'reactiva', 'reactivate',
    'imprimir', 'move', 'mover', 'mover', 'copy', 'copiar', 'merge', 'combinar', 'split',
    'divide', 'dividir', 'pay', 'pagar', 'paga', 'collect', 'cobrar', 'cobra', 'notify',
    'notifica', 'notificar', 'link', 'unlink', 'relate', 'relacionar', 'map', 'mapear',
    'reorder', 'reordena', 'reordenar', 'renew', 'renueva', 'renovar', 'extend', 'extiende',
    'extender', 'transfer', 'transfiere', 'transferir', 'migrate', 'migra', 'migrar',
    'reactivate', 'reactivar', 'suspender', 'suspende', 'suspend', 'dismiss', 'finalizar',
  ]);
  if (specialStarters.has(w0)) return 'SPECIAL';

  return 'OTHER';
}

const CAT_ORDER = ['GET_SINGLE', 'GET_LIST', 'CREATE', 'UPDATE', 'DELETE', 'SPECIAL', 'OTHER'];

// ---------------------------------------------------------------------------
// C# parsing (regex based, tolerant)
// ---------------------------------------------------------------------------
function stripCommentsAndStrings(src) {
  let out = src
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\/\/[^\n]*/g, '');
  out = out.replace(/@"(?:[^"]|"")*"/g, '""');
  out = out.replace(/\$?"(?:[^"\\\n]|\\.)*"/g, '""');
  out = out.replace(/'(?:[^'\\\n]|\\.)'/g, "''");
  return out;
}

function extractBalancedBody(src, openBraceIndex) {
  let depth = 0;
  for (let i = openBraceIndex; i < src.length; i++) {
    const c = src[i];
    if (c === '{') depth++;
    else if (c === '}') {
      depth--;
      if (depth === 0) return src.slice(openBraceIndex + 1, i);
    }
  }
  return src.slice(openBraceIndex + 1);
}

function parseInterfaces(src) {
  const res = [];
  const rx = /interface\s+(I[A-Za-z0-9_]+)/g;
  let m;
  while ((m = rx.exec(src)) !== null) {
    const openBrace = src.indexOf('{', m.index + m[0].length);
    res.push({ name: m[1], index: m.index, openBrace });
  }
  return res;
}

function parseClasses(src) {
  const res = [];
  const rx = /\bclass\s+([A-Za-z_][A-Za-z0-9_]*)/g;
  let m;
  while ((m = rx.exec(src)) !== null) {
    const openBrace = src.indexOf('{', m.index + m[0].length);
    res.push({ name: m[1], index: m.index, openBrace });
  }
  return res;
}

function parseMethods(body, opts) {
  const requireVis = !(opts && opts.allowNoVisibility);
  const res = [];
  const vis = requireVis ? '(?:public|internal|protected)\\s+' : '';
  const rx = new RegExp(
    vis +
      '(?:static\\s+|virtual\\s+|abstract\\s+|sealed\\s+|override\\s+|async\\s+|partial\\s+)*' +
      '([A-Za-z_][A-Za-z0-9_<>?,.\\[\\] ]*?)\\s+([A-Za-z_][A-Za-z0-9_]*)\\s*\\(([^;{)]*)\\)\\s*([{;])',
    'g'
  );
  let m;
  while ((m = rx.exec(body)) !== null) {
    const retType = m[1].trim();
    const name = m[2];
    const paramsRaw = (m[3] || '').trim();
    const closer = m[4];
    if (/^(if|for|foreach|while|switch|catch|using|lock|return|new)$/i.test(name)) continue;
    if (retType === name) continue; // constructor
    const params = paramsRaw
      ? paramsRaw.split(',').map((s) => s.trim()).filter(Boolean)
      : [];
    res.push({ name, returnType: retType, params, hasBody: closer === '{' });
  }
  return res;
}

function parseEndpoints(src) {
  const res = [];
  // Capture MapGroup prefix (route base) when present
  const groupRx = /MapGroup\s*\(\s*("(?:[^"\\]|\\.)*"|@"(?:[^"]|"")*")/;
  let prefix = '';
  const gm = groupRx.exec(src);
  if (gm) {
    prefix = gm[1].replace(/^@?"/, '').replace(/"$/, '');
  }
  const rx = /\.(MapGet|MapPost|MapPut|MapPatch|MapDelete)\s*\(\s*("(?:[^"\\]|\\.)*"|@"(?:[^"]|"")*")/g;
  let m;
  while ((m = rx.exec(src)) !== null) {
    const http = m[1].replace(/^Map/, '').toUpperCase();
    const route = m[2].replace(/^@?"/, '').replace(/"$/, '');
    const full = ((prefix ? '/' + prefix : '') + (route ? '/' + route : '')) || '/';
    // Handler heuristic: first `X.Method(` or standalone `Method(` call in the next chunk of source
    const after = src.slice(m.index + m[0].length, m.index + m[0].length + 700);
    let handler = '';
    const hm1 = /([A-Za-z_][A-Za-z0-9_]*)\.([A-Za-z_][A-Za-z0-9_]*Async)\s*\(/.exec(after);
    const hm2 = /(?:await\s+|return\s+)([A-Za-z_][A-Za-z0-9_]*Async)\s*\(/.exec(after);
    if (hm1) handler = `${hm1[1]}.${hm1[2]}`;
    else if (hm2) handler = hm2[1];
    res.push({ http, route, routeFull: full, handler });
  }
  const rx2 = /\[(Http[Gg][Ee][Tt]|Http[Pp][Oo][Ss][Tt]|Http[Pp][Uu][Tt]|Http[Pp][Aa][Tt][Cc][Hh]|Http[Dd][Ee][Ll][Ee][Tt][Ee])(?:\("([^"]*)"\))?\]/g;
  while ((m = rx2.exec(src)) !== null) {
    const http = m[1].replace(/^Http/i, '').toUpperCase();
    res.push({ http, route: m[2] || '' });
  }
  return res;
}

const SERVICE_SUFFIXES = ['AppService', 'Service', 'Manager', 'Handler', 'Generator', 'Calculator', 'Coordinator', 'Policy', 'Validator', 'Provider', 'Helper', 'Mapper', 'Mapping', 'Profile'];
function looksLikeService(name) {
  return SERVICE_SUFFIXES.some((s) => name.endsWith(s));
}

// ---------------------------------------------------------------------------
// Main scan
// ---------------------------------------------------------------------------
function main() {
  const files = walk(ROOT).filter((f) => f.endsWith('.cs'));
  const groups = new Map();
  const allMethods = [];
  const allEndpoints = [];
  let dtoFileCount = 0;
  let entityFileCount = 0;

  for (const f of files) {
    const src = fs.readFileSync(f, 'utf8');
    const clean = stripCommentsAndStrings(src);
    const r = rel(f);
    const parts = r.split('/');
    const groupName = parts[0];
    let moduleFolder = parts.length > 1 ? parts[1] : '(root)';
    // For deep-nested functional folders (e.g. RecursosHumanos/Nomina/Xxx), use depth 3 as module
    if (['RecursosHumanosLuxuryApp'].includes(groupName) && parts.length > 2 && !/^(Docs|Persistence|Shared)$/i.test(parts[1])) {
      moduleFolder = parts.slice(0, 3).join('/');
    }

    if (!groups.has(groupName)) {
      groups.set(groupName, new Map());
    }
    const g = groups.get(groupName);
    if (!g.has(moduleFolder)) {
      g.set(moduleFolder, {
        name: moduleFolder,
        path: parts.slice(0, 2).join('/'),
        interfaces: [],
        services: [],
        endpointFiles: [],
        dtoFiles: [],
        entityFiles: [],
      });
    }
    const folder = g.get(moduleFolder);

    const fileName = path.basename(f);
    const baseName = fileName.replace(/\.cs$/, '');

    if (/(EndPoints|Endpoints)/i.test(fileName)) {
      const eps = parseEndpoints(src);
      folder.endpointFiles.push({ file: r, endpoints: eps });
      for (const e of eps) {
        allEndpoints.push({ ...e, file: r, group: groupName, module: moduleFolder });
      }
      continue;
    }

    if (/^I[A-Z]/.test(fileName) || /\/Interfaces\//.test('/' + r)) {
      const ifaces = parseInterfaces(clean);
      for (const it of ifaces) {
        if (it.openBrace < 0) continue;
        const body = extractBalancedBody(clean, it.openBrace);
        const methods = parseMethods(body, { allowNoVisibility: true });
        folder.interfaces.push({
          name: it.name,
          file: r,
          methods: methods.map((mm) => ({
            name: mm.name,
            returnType: mm.returnType,
            params: mm.params.join(', '),
          })),
        });
        for (const mm of methods) {
          allMethods.push({
            name: mm.name,
            owner: it.name,
            ownerKind: 'interface',
            group: groupName,
            module: moduleFolder,
            file: r,
            returnType: mm.returnType,
            params: mm.params.join(', '),
            category: classifyMethod(mm.name, mm.returnType, mm.params.join(', ')),
          });
        }
      }
      continue;
    }

    if (looksLikeService(baseName)) {
      const classes = parseClasses(clean);
      for (const cl of classes) {
        if (!looksLikeService(cl.name)) continue;
        if (cl.openBrace < 0) continue;
        const body = extractBalancedBody(clean, cl.openBrace);
        const methods = parseMethods(body);
        folder.services.push({
          name: cl.name,
          file: r,
          methods: methods.map((mm) => ({
            name: mm.name,
            returnType: mm.returnType,
            params: mm.params.join(', '),
          })),
        });
        for (const mm of methods) {
          allMethods.push({
            name: mm.name,
            owner: cl.name,
            ownerKind: 'service',
            group: groupName,
            module: moduleFolder,
            file: r,
            returnType: mm.returnType,
            params: mm.params.join(', '),
            category: classifyMethod(mm.name, mm.returnType, mm.params.join(', ')),
          });
        }
      }
      continue;
    }

    if (/DTO|Dto|ViewModel/i.test(fileName)) {
      folder.dtoFiles.push(r);
      dtoFileCount++;
      continue;
    }
    if (/^Entities$|^Entity$/.test(parts[parts.length - 2] || '') || /Entities\//.test(r)) {
      folder.entityFiles.push(r);
      entityFileCount++;
      continue;
    }
  }

  // ------------------------------------------------------------------------
  // Aggregate + outputs
  // ------------------------------------------------------------------------
  const catCounts = Object.fromEntries(CAT_ORDER.map((c) => [c, 0]));
  for (const mm of allMethods) catCounts[mm.category]++;

  const epCounts = {};
  for (const e of allEndpoints) epCounts[e.http] = (epCounts[e.http] || 0) + 1;

  const totalModules = [...groups.values()].reduce((a, g) => a + g.size, 0);
  const ifaceSet = new Set(allMethods.filter((m) => m.ownerKind === 'interface').map((m) => m.owner));
  const svcSet = new Set(allMethods.filter((m) => m.ownerKind === 'service').map((m) => m.owner));

  const json = {
    generatedAt: new Date().toISOString(),
    root: 'api/LuxuryApp.Application/Modules',
    summary: {
      groups: groups.size,
      modules: totalModules,
      interfaces: ifaceSet.size,
      services: svcSet.size,
      methods: allMethods.length,
      endpoints: allEndpoints.length,
      dtoFiles: dtoFileCount,
      entityFiles: entityFileCount,
      methodCategories: catCounts,
      endpointVerbs: epCounts,
    },
    endpoints: allEndpoints,
    methods: allMethods,
    groups: [...groups.entries()].map(([gname, mods]) => ({
      name: gname,
      modules: [...mods.values()],
    })),
  };
  fs.writeFileSync(OUT_JSON, JSON.stringify(json, null, 2));

  // ------------------------------------------------------------------------
  // Naming analytics
  // ------------------------------------------------------------------------
  const ES_VERB_STARTERS = new Set([
    'obtener', 'consultar', 'consulta', 'buscar', 'listar', 'lista', 'listas', 'actualiza', 'actualizar',
    'elimina', 'eliminar', 'crea', 'crear', 'registra', 'registrar', 'envia', 'enviar', 'reenvia', 'reenviar',
    'aproba', 'aprobar', 'recha', 'rechazar', 'activa', 'activar', 'desactivar', 'cancela', 'cancelar',
    'genera', 'generar', 'valida', 'validar', 'procesa', 'procesar', 'calcula', 'calcular', 'recalcular',
    'autoriza', 'autorizar', 'guarda', 'guardar', 'subir', 'anula', 'anular', 'concilia', 'conciliar',
    'actualizamapeo', 'automapeo', 'autorizar', 'lista', 'pendientes', 'bitacoradiaria', 'entradas',
  ]);
  const EN_STARTERS = new Set([
    'get', 'getall', 'getlist', 'getby', 'getbyid', 'find', 'create', 'add', 'update', 'delete', 'remove', 'post', 'put',
    'list', 'search', 'is', 'has', 'can', 'exists', 'approve', 'reject', 'activate', 'deactivate', 'send', 'process',
    'calculate', 'generate', 'validate', 'toggle', 'complete', 'reopen', 'cancel', 'close', 'submit', 'publish',
    'resolve', 'upsert', 'assign', 'reassign', 'upload', 'download', 'export', 'import', 'sync', 'run', 'execute',
    'handle', 'preview', 'analyze', 'seed', 'reseed', 'backfill', 'resync', 'log', 'ensure', 'invalidate', 'confirm',
    'revoke', 'authorize', 'revert', 'void', 'issue', 'apply', 'autoapply', 'reconcile', 'terminate', 'initiate',
    'change', 'check', 'compute', 'evaluate', 'escalate', 'bulkimport', 'bulkset', 'capitalize', 'reactivate',
  ]);
  const countBy = (fn) => {
    const m = {};
    for (const mm of allMethods) {
      const k = fn(mm);
      if (k) m[k] = (m[k] || 0) + 1;
    }
    return m;
  };
  const baseNameOf = (n) => n.replace(/Async$/, '');
  const starterCount = countBy((mm) => wordsOf(baseNameOf(mm.name))[0]);
  const topStarters = Object.entries(starterCount).sort((a, b) => b[1] - a[1]).slice(0, 30);

  const spanishMethods = allMethods.filter((mm) => ES_VERB_STARTERS.has(wordsOf(baseNameOf(mm.name))[0]));
  const otherMethods = allMethods.filter((mm) => mm.category === 'OTHER');
  const asyncWith = allMethods.filter((mm) => /Async$/.test(mm.name)).length;
  const asyncPct = ((asyncWith / allMethods.length) * 100).toFixed(1);

  const getAllStyle = {
    getAll: allMethods.filter((mm) => /^GetAll/.test(baseNameOf(mm.name))).length,
    listPrefix: allMethods.filter((mm) => /^(List|Listar)/.test(baseNameOf(mm.name))).length,
    pluralGet: allMethods.filter((mm) => /^Get[A-Z]/.test(baseNameOf(mm.name)) && /(s|ies)Async$/.test(baseNameOf(mm.name))).length,
    obtener: allMethods.filter((mm) => /^Obtener/.test(baseNameOf(mm.name))).length,
    consultar: allMethods.filter((mm) => /^Consultar/.test(baseNameOf(mm.name))).length,
    buscar: allMethods.filter((mm) => /^Buscar/.test(baseNameOf(mm.name))).length,
    paged: allMethods.filter((mm) => /(Paged|Paginado)/i.test(mm.name)).length,
  };

  const routeStyle = { kebab: 0, camel: 0, pascal: 0, snake: 0, other: 0 };
  for (const e of allEndpoints) {
    const segs = (e.routeFull || e.route || '')
      .split('/')
      .filter((s) => s && !/^\{/.test(s) && s.toLowerCase() !== 'api');
    const seg = segs[0] || '';
    if (/-/.test(seg)) routeStyle.kebab++;
    else if (/_/.test(seg)) routeStyle.snake++;
    else if (/^[a-z]/.test(seg)) routeStyle.camel++;
    else if (/^[A-Z]/.test(seg)) routeStyle.pascal++;
    else routeStyle.other++;
  }

  // Endpoint handler cross-tab: verb x category of handler method (resolved by name)
  const methodCatByName = new Map();
  for (const mm of allMethods) {
    if (!methodCatByName.has(mm.name)) methodCatByName.set(mm.name, mm.category);
  }
  const verbCat = {};
  let handlerMatched = 0;
  for (const e of allEndpoints) {
    const svc = (e.handler || '').split('.').pop();
    const cat = methodCatByName.get(svc);
    if (cat) handlerMatched++;
    const key = `${e.http} -> ${cat || 'UNMATCHED'}`;
    verbCat[key] = (verbCat[key] || 0) + 1;
  }
  // Duplicate routes per group+module
  const routeSeen = new Map();
  const dupRoutes = [];
  for (const e of allEndpoints) {
    const key = `${e.group}|${e.module}|${e.http}|${(e.routeFull || e.route).toLowerCase()}`;
    if (routeSeen.has(key)) {
      dupRoutes.push({ ...e, alsoAt: routeSeen.get(key) });
    } else {
      routeSeen.set(key, e.file);
    }
  }

  const naming = {
    asyncSuffix: { with: asyncWith, without: allMethods.length - asyncWith, pctWith: asyncPct },
    topStarters,
    spanishNamed: { count: spanishMethods.length, examples: [...new Set(spanishMethods.map((mm) => baseNameOf(mm.name)))].slice(0, 25) },
    nounNamed: { count: otherMethods.length, examples: [...new Set(otherMethods.map((mm) => baseNameOf(mm.name)))].slice(0, 25) },
    listStyle: getAllStyle,
    routeStyle,
    endpointHandlerCrossTab: Object.fromEntries(Object.entries(verbCat).sort((a, b) => b[1] - a[1])),
    endpointHandlerMatched: handlerMatched,
    duplicateRoutes: dupRoutes.slice(0, 40),
    duplicateRouteCount: dupRoutes.length,
  };
  json.naming = naming;
  fs.writeFileSync(OUT_JSON, JSON.stringify(json, null, 2));

  // ------------------------------------------------------------------------
  // Markdown report
  // ------------------------------------------------------------------------
  const md = [];
  const push = (s) => md.push(s);
  push('# INVENTARIO API - LuxuryApp');
  push('');
  push(`> Generado automaticamente el ${new Date().toISOString().slice(0, 10)} por \`scripts/api_inventory/scan.js\``);
  push('');

  push('## Resumen Ejecutivo');
  push('');
  push(`- Grupos de modulos (top-level): **${groups.size}**`);
  push(`- Modulos funcionales: **${totalModules}**`);
  push(`- Interfaces: **${ifaceSet.size}**`);
  push(`- Servicios: **${svcSet.size}**`);
  push(`- Metodos publicos analizados: **${allMethods.length}**`);
  push(`- Endpoints HTTP declarados: **${allEndpoints.length}**`);
  push(`- Archivos DTO: **${dtoFileCount}**`);
  push('');

  push('### Distribucion por categoria');
  push('');
  push('| Categoria | Cantidad | % |');
  push('|---|---:|---:|');
  for (const c of CAT_ORDER) {
    const n = catCounts[c];
    const pct = allMethods.length ? ((n / allMethods.length) * 100).toFixed(1) : '0.0';
    push(`| ${c} | ${n} | ${pct}% |`);
  }
  push('');

  push('### Distribucion de endpoints por verbo HTTP');
  push('');
  push('| Verbo | Cantidad |');
  push('|---|---:|');
  for (const [k, v] of Object.entries(epCounts).sort((a, b) => b[1] - a[1])) {
    push(`| ${k} | ${v} |`);
  }
  push('');
  push('## Analisis por Grupo de Modulos');
  const trunc = (s, n) => (s.length > n ? s.slice(0, n - 1) + '…' : s);
  for (const g of json.groups) {
    push('');
    push(`### Grupo: ${g.name}`);
    push('');
    for (const f of g.modules) {
      const epCount = f.endpointFiles.reduce((a, e) => a + e.endpoints.length, 0);
      push(`#### Modulo: ${f.name}`);
      push('');
      push(`- Interfaces: ${f.interfaces.length} | Servicios: ${f.services.length} | Endpoints: ${epCount} | DTOs: ${f.dtoFiles.length}`);
      if (f.interfaces.length) {
        push('');
        push('#### Interfaces');
        push('');
        push('| Interfaz | # Metodos | Archivo |');
        push('|---|---:|---|');
        for (const i of f.interfaces) push(`| ${i.name} | ${i.methods.length} | \`${i.file}\` |`);
      }
      if (f.services.length) {
        push('');
        push('#### Servicios');
        push('');
        push('| Servicio | # Metodos | Archivo |');
        push('|---|---:|---|');
        for (const s of f.services) push(`| ${s.name} | ${s.methods.length} | \`${s.file}\` |`);
      }
      const ifaceRows = allMethods.filter((mm) => mm.group === g.name && mm.module === f.name && mm.ownerKind === 'interface');
      if (ifaceRows.length) {
        push('');
        push('#### Metodos del contrato (interfaces)');
        push('');
        push('| Metodo | Owner | Categoria | Retorno | Parametros |');
        push('|---|---|---|---|---|');
        for (const mm of ifaceRows) {
          push(`| ${mm.name} | ${mm.owner} | ${mm.category} | \`${trunc(mm.returnType, 44)}\` | \`${trunc(mm.params, 60) || '-'}\` |`);
        }
      }
      if (f.endpointFiles.length) {
        push('');
        push('#### Endpoints');
        push('');
        push('| Verbo | Ruta completa | Handler | Archivo |');
        push('|---|---|---|---|');
        for (const ef of f.endpointFiles) {
          for (const e of ef.endpoints) push(`| ${e.http} | \`${e.routeFull || e.route}\` | ${e.handler ? `\`${e.handler}\`` : '-'} | \`${ef.file}\` |`);
        }
      }
      push('');
    }
  }

  // ------------------------------------------------------------------------
  // Naming analysis + standard proposal + recommendations
  // ------------------------------------------------------------------------
  const ES_EN_VERB = {
    obtener: 'Get', consultar: 'Get', consulta: 'Get', buscar: 'Search', listar: 'GetAll', lista: 'GetAll',
    crear: 'Create', crea: 'Create', actualiza: 'Update', actualizar: 'Update', elimina: 'Delete',
    eliminar: 'Delete', envia: 'Send', enviar: 'Send', reenvia: 'Resend', reenviar: 'Resend',
    aproba: 'Approve', aprobar: 'Approve', recha: 'Reject', rechazar: 'Reject', activa: 'Activate',
    activar: 'Activate', desactivar: 'Deactivate', cancela: 'Cancel', cancelar: 'Cancel', genera: 'Generate',
    generar: 'Generate', valida: 'Validate', validar: 'Validate', procesa: 'Process', procesar: 'Process',
    calcula: 'Calculate', calcular: 'Calculate', recalcular: 'Recalculate', autoriza: 'Authorize',
    autorizar: 'Authorize', guarda: 'Save', guardar: 'Save', subir: 'Upload', anula: 'Void', anular: 'Void',
    concilia: 'Reconcile', conciliar: 'Reconcile', registra: 'Register', registrar: 'Register',
  };

  const refactorRows = [];
  const seenRefactor = new Set();
  const entityFromOwner = (owner) =>
    owner.replace(/^I/, '').replace(/AppService$/, '').replace(/Service$/, '') || 'Entity';
  for (const mm of spanishMethods) {
    const base = baseNameOf(mm.name);
    if (seenRefactor.has(base)) continue;
    seenRefactor.add(base);
    const w = wordsOf(base);
    const en = ES_EN_VERB[w[0]] || 'Get';
    let rest = w.slice(1).map((x) => x.charAt(0).toUpperCase() + x.slice(1)).join('');
    if (!rest) rest = entityFromOwner(mm.owner);
    refactorRows.push({ actual: mm.name, propuesto: `${en}${rest}${/Async$/.test(mm.name) ? 'Async' : ''}`, motivo: `Verbo en espanol (${w[0]}) -> estandar ingles` });
    if (refactorRows.length >= 30) break;
  }
  for (const mm of otherMethods) {
    const base = baseNameOf(mm.name);
    if (seenRefactor.has(base)) continue;
    seenRefactor.add(base);
    const isCollection = COLLECTION_RX.test(mm.returnType);
    const hasDtoParam = /DTO|Dto|Request|Command/i.test(mm.params);
    const en = isCollection ? `Get${base}List` : hasDtoParam ? `Create${base}` : `Process${base}`;
    refactorRows.push({ actual: mm.name, propuesto: en, motivo: isCollection ? 'Nombre sin verbo; retorna coleccion' : hasDtoParam ? 'Nombre sin verbo; recibe DTO de escritura' : 'Nombre sin verbo; requiere verbo de negocio' });
    if (refactorRows.length >= 45) break;
  }

  push('## Analisis de Nomenclatura');
  push('');
  push('### Patrones identificados');
  push('');
  push(`- Estructura vertical consistente: \`{Grupo}/{Modulo}/{DTOs|EndPoints|Interfaces|Services|Entities|Mapping}\`.`);
  push(`- Sufijo Async: ${naming.asyncSuffix.with} metodos lo usan (${naming.asyncSuffix.pctWith}%), ${naming.asyncSuffix.without} no.`);
  push('- Servicios con sufijo `AppService` como convencion dominante; contratos `IAppService` espejo.');
  push('- Endpoints minimal-API (`.MapGet/MapPost/...`) con handler lambda o metodo de servicio referenciado.');
  push('- DTOs con sufijos semanticos: `ListDTO`, `GetByIdDTO`, `AddOrEditDTO`, `UpdateStatusDTO`.');
  push(`- Rutas de recursos: kebab-case ${routeStyle.kebab}, camelCase ${routeStyle.camel}, PascalCase ${routeStyle.pascal}, snake_case ${routeStyle.snake}.`);
  const onCount = allMethods.filter((mm) => /^On[A-Z]/.test(baseNameOf(mm.name))).length;
  const selCount = allMethods.filter((mm) => /^(Select|SelectItem)/.test(baseNameOf(mm.name))).length;
  push(`- Metodos de infraestructura/eventos: ${onCount} empiezan con \`On*\` (handlers de eventos), ${selCount} con \`Select*\` (select-items/dropdowns).`);
  push('');
  push('### Inconsistencias detectadas');
  push('');
  push(`1. **Metodos con verbo en espanol** (${naming.spanishNamed.count} metodos). Ejemplos: ${naming.spanishNamed.examples.slice(0, 12).map((e) => `\`${e}\``).join(', ')}.`);
  push(`2. **Metodos con nombre-sustantivo sin verbo** (${naming.nounNamed.count} metodos OTHER). Ejemplos: ${naming.nounNamed.examples.slice(0, 12).map((e) => `\`${e}\``).join(', ')}.`);
  push(`3. **Estilos mixtos para listados**: GetAll* = ${getAllStyle.getAll}, List*/Listar* = ${getAllStyle.listPrefix}, Get*Paged = ${getAllStyle.paged}, Obtener* = ${getAllStyle.obtener}, Consultar* = ${getAllStyle.consultar}, Buscar* = ${getAllStyle.buscar}, Get*Plural = ${getAllStyle.pluralGet}.`);
  push(`4. **Cobertura parcial del sufijo Async** (${naming.asyncSuffix.pctWith}%): mezcla de estilos en firmas publicas.`);
  push(`5. **Contratos vs implementaciones**: ${ifaceSet.size} interfaces vs ${svcSet.size} clases de servicio detectadas; revisar servicios sin contrato y viceversa.`);
  push(`6. **PATCH subutilizado** (${epCounts.PATCH || 0} endpoints) frente a PUT (${epCounts.PUT || 0}): semantica de actualizacion parcial inconsistente.`);
  push(`7. **Desalineacion verbo HTTP vs semantica del metodo**: ${Object.entries(verbCat).filter(([k]) => /UNMATCHED/.test(k)).reduce((a, [, v]) => a + v, 0)} endpoints cuyo handler no resuelve a un contrato mapeado; pares destacados:`);
  const notable = ['GET -> CREATE', 'GET -> UPDATE', 'GET -> DELETE', 'POST -> GET_LIST', 'POST -> GET_SINGLE', 'PUT -> CREATE', 'DELETE -> GET_LIST'];
  for (const k of notable) {
    if (verbCat[k]) push(`   - \`${k}\`: ${verbCat[k]} endpoint(s).`);
  }
  push('');
  push('### Verbo inicial mas frecuente (top 30)');
  push('');
  push('| Verbo inicial | Usos |');
  push('|---|---:|');
  for (const [k, v] of topStarters) push(`| ${k} | ${v} |`);
  push('');

  push('## Propuesta de Estandar de Nomenclatura');
  push('');
  push('### Convenciones recomendadas');
  push('');
  push('| Categoria | Patron recomendado | Ejemplo |');
  push('|---|---|---|');
  push('| GET_SINGLE | `Get{Entity}ByIdAsync`, `Get{Entity}By{Field}Async` | `GetCustomerByIdAsync` |');
  push('| GET_LIST | `GetAll{Entity}sAsync`, `Get{Entity}sBy{Criteria}Async`, `Search{Entity}sAsync` | `GetPendingRequestsAsync` |');
  push('| CREATE | `Create{Entity}Async` | `CreateWorkPositionAsync` |');
  push('| UPDATE | `Update{Entity}Async` | `UpdateModuleStatusAsync` |');
  push('| DELETE | `Delete{Entity}Async` | `DeleteEmployeeDocumentAsync` |');
  push('| SPECIAL | `{Action}{Entity}Async` | `ApproveVacationRequestAsync` |');
  push('| OTHER | Renombrar con verbo de negocio explicito | `ProcessPayrollAsync` |');
  push('');
  push('Reglas complementarias:');
  push('');
  push('1. Todos los metodos publicos de contratos llevan sufijo `Async`.');
  push('2. Un solo estilo para listados: `GetAll*` para catalogos completos, `Get*By*` para filtrados, `Search*` para busqueda de texto libre.');
  push('3. Nombres 100% en ingles (verbos y sustantivos).');
  push('4. Rutas HTTP en minuscula y plural para colecciones: `/api/{resource}`, `/api/{resource}/{id}`, `/api/{resource}/{id}/{action}` para SPECIAL.');
  push('5. SPECIAL usa POST con ruta de accion explicita; PATCH solo para actualizaciones parciales.');
  push('');
  push('### Ejemplos de refactorizacion (generados del codigo real)');
  push('');
  push('| Nombre actual | Propuesto | Justificacion |');
  push('|---|---|---|');
  for (const r of refactorRows) push(`| ${r.actual} | ${r.propuesto} | ${r.motivo} |`);
  push('');

  push('## Recomendaciones');
  push('');
  push(`1. **Migrar verbo en espanol a ingles** en ${naming.spanishNamed.count} metodos (lista completa en \`scripts/api_inventory/api_inventory.json\`).`);
  push(`2. **Nombrar con verbo** los ${naming.nounNamed.count} metodos clasificados OTHER; revisar caso por caso (semi-automatico).`);
  push('3. **Unificar estilo de listados** en `GetAll/GetBy/Search` y deprecar `List*/Obtener*/Consultar*`.');
  push('4. **Completar sufijo Async** en firmas publicas y aplicar analizador Roslyn o test de convenciones para prevenir regresiones.');
  push('5. **Auditar servicios sin interfaz** y contratos sin implementacion para cerrar la brecha 356/372.');
  push(`6. **Estandarizar rutas SPECIAL** como \`POST /api/{resource}/{id}/{action}\` y documentarlas en OpenAPI con OperationId = nombre del metodo. Endpoints con handler sin clasificar: ${allEndpoints.length - handlerMatched}.`);
  push(`7. **Revisar rutas duplicadas** dentro del mismo modulo (${naming.duplicateRouteCount} casos; ver JSON): GET+POST con misma ruta o rutas equivalentes.`);
  push('8. **Versionar el estandar** en `conventions/` y vincularlo desde AGENTS.md/CLAUDE.md para que generacion futura de modulos lo siga.');
  push('');
  push('---');
  push('');
  push('> Datos completos (metodos, endpoints, categorias) en `scripts/api_inventory/api_inventory.json`. Regenerar con `node scripts/api_inventory/scan.js`.');

  fs.writeFileSync(OUT_MD, md.join('\n'), 'utf8');

  console.log(`Files scanned: ${files.length}`);
  console.log(`Groups: ${groups.size} | Modules: ${totalModules} | Interfaces: ${ifaceSet.size} | Services: ${svcSet.size}`);
  console.log(`Methods: ${allMethods.length} | Endpoints: ${allEndpoints.length} | DTOs: ${dtoFileCount}`);
  console.log('Categories:', JSON.stringify(catCounts));
  console.log(`Endpoint handler matched: ${handlerMatched}/${allEndpoints.length} | Duplicate routes: ${dupRoutes.length}`);
  console.log('Endpoint verbs:', JSON.stringify(epCounts));
  console.log(`JSON -> ${OUT_JSON}`);
  console.log(`MD   -> ${OUT_MD}`);
}

main();
