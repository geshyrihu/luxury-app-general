const fs = require("fs");
const path = require("path");

const BASE_DIR = __dirname;
const ENDPOINTS_DIR = path.join(
  BASE_DIR,
  "client",
  "angular",
  "src",
  "app",
  "core",
  "constants",
  "endpoints",
);
const FRONTEND_SRC_DIR = path.join(BASE_DIR, "client", "angular", "src", "app");
const OUTPUT_FILE = path.join(BASE_DIR, "routes-radiography.md");
const LIVE_SWAGGER_URLS = [
  "http://localhost:7070/swagger/v1/swagger.json",
  "https://localhost:7070/swagger/v1/swagger.json",
];
const SWAGGER_CANDIDATES = [
  path.join(BASE_DIR, "swagger-api.json"),
  path.join(BASE_DIR, "client", "angular", "src", "app", "routing", "swagger.json"),
  path.join(
    BASE_DIR,
    "client",
    "angular-catalog-showcase",
    "src",
    "app",
    "routing",
    "swagger.json",
  ),
];
const ENUM_SELECT_SERVICE_FILE = path.join(
  BASE_DIR,
  "client",
  "angular",
  "src",
  "app",
  "core",
  "services",
  "enum-select.service.ts",
);

const API_METHOD_FROM_USAGE = {
  Delete: "DELETE",
  DownloadFile: "GET",
  DownloadFilePost: "POST",
  GetEnumSelectItem: "GET",
  GetItem: "GET",
  GetItemNotLoading: "GET",
  GetList: "GET",
  GetListNotLoading: "GET",
  GetPaged: "GET",
  GetSelectItem: "GET",
  Patch: "PATCH",
  Post: "POST",
  PostBlob: "POST",
  PostFile: "POST",
  PostNotLoading: "POST",
  PostPaged: "POST",
  PreviewPdf: "GET",
  Put: "PUT",
};

const QUERY_ONLY_KEYS = new Set(["base"]);
const LEGACY_SWAGGER_PATTERNS = [
  /^updatedatabase\//,
  /^testsignalr\//,
  /^notifications\/(test-one-signal|test-one-signal-web|test-signal-r\/|test-signal-users|connected-users(?:-web)?|users$)/,
];

function resolveSwaggerFile() {
  for (const candidate of SWAGGER_CANDIDATES) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }

  throw new Error(
    `No se encontro ningun archivo Swagger. Candidatos: ${SWAGGER_CANDIDATES.join(", ")}`,
  );
}

async function loadSwaggerSpec() {
  for (const url of LIVE_SWAGGER_URLS) {
    try {
      const response = await fetch(url);
      if (!response.ok) continue;

      return {
        sourceKind: "live",
        sourceLabel: url,
        spec: await response.json(),
      };
    } catch {}
  }

  const swaggerFile = resolveSwaggerFile();
  return {
    sourceKind: "file",
    sourceLabel: swaggerFile,
    spec: JSON.parse(fs.readFileSync(swaggerFile, "utf8")),
  };
}

function normalizeRoute(route) {
  if (!route) return "";

  return String(route)
    .replace(/\$\{[^}]+\}/g, "{param}")
    .replace(/\{[^}]+\}/g, "{param}")
    .replace(/([a-z0-9-])\{param\}(?=$|\?)/gi, "$1")
    .split("?")[0]
    .toLowerCase()
    .replace(/^\/?api\//, "")
    .replace(/\/+/g, "/")
    .replace(/^\/+|\/+$/g, "");
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function toPascalCase(value) {
  return String(value)
    .split(/[^A-Za-z0-9]+/)
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join("");
}

function swaggerMethodColor(method) {
  const colors = {
    DELETE: "#f93e3e",
    GET: "#61affe",
    PATCH: "#50e3c2",
    POST: "#49cc90",
    PUT: "#fca130",
  };

  return colors[method] || "#98a2b3";
}

function getAppNameFromFile(filePath) {
  const normalized = filePath.replace(/\\/g, "/");
  const match = normalized.match(/\/apps\/([^/]+)\//i);
  return match ? match[1] : "core/shared";
}

function skipStringFactory(content, n, state) {
  return function skipString(quote) {
    state.i++;
    while (state.i < n) {
      const c = content[state.i];
      if (c === "\\") {
        state.i += 2;
        continue;
      }
      if (c === quote) {
        state.i++;
        return;
      }
      state.i++;
    }
  };
}

function skipTemplateFactory(content, n, state, skipString) {
  return function skipTemplate() {
    state.i++;
    let out = "";

    while (state.i < n) {
      const c = content[state.i];

      if (c === "\\") {
        out += content[state.i + 1] || "";
        state.i += 2;
        continue;
      }

      if (c === "`") {
        state.i++;
        return out;
      }

      if (c === "$" && content[state.i + 1] === "{") {
        state.i += 2;
        let depth = 1;

        while (state.i < n && depth > 0) {
          const inner = content[state.i];
          if (inner === "`") skipTemplate();
          else if (inner === '"' || inner === "'") skipString(inner);
          else if (inner === "{") {
            depth++;
            state.i++;
          } else if (inner === "}") {
            depth--;
            state.i++;
          } else {
            state.i++;
          }
        }

        out += "{param}";
        continue;
      }

      out += c;
      state.i++;
    }

    return out;
  };
}

function parseTsConstants(content) {
  const leaves = [];
  const stack = [];
  const state = { i: 0 };
  const n = content.length;
  const skipString = skipStringFactory(content, n, state);
  const skipTemplate = skipTemplateFactory(content, n, state, skipString);

  function skipComment() {
    if (content[state.i] === "/" && content[state.i + 1] === "/") {
      state.i += 2;
      while (state.i < n && content[state.i] !== "\n") state.i++;
      return true;
    }

    if (content[state.i] === "/" && content[state.i + 1] === "*") {
      state.i += 2;
      while (state.i < n) {
        if (content[state.i] === "*" && content[state.i + 1] === "/") {
          state.i += 2;
          break;
        }
        state.i++;
      }
      return true;
    }

    return false;
  }

  function addRoute(routes, value) {
    const normalized = value.replace(/\$\{[^}]+\}/g, "{param}");
    if (normalized.includes("/") || normalized.length > 3) {
      routes.push(normalized.startsWith("/") ? normalized : `/${normalized}`);
    }
  }

  function readLeafValue(name) {
    let depth = 0;
    const routes = [];

    while (state.i < n) {
      const c = content[state.i];

      if (c === "`") {
        addRoute(routes, skipTemplate());
        continue;
      }

      if (c === '"' || c === "'") {
        const start = state.i;
        skipString(c);
        addRoute(routes, content.slice(start + 1, state.i - 1));
        continue;
      }

      if (c === "(" || c === "[" || c === "{") {
        depth++;
        state.i++;
        continue;
      }

      if (c === ")" || c === "]") {
        depth--;
        state.i++;
        continue;
      }

      if (c === "}") {
        if (depth === 0) break;
        depth--;
        state.i++;
        continue;
      }

      if (c === "," && depth === 0) {
        state.i++;
        break;
      }

      state.i++;
    }

    leaves.push({ keyPath: stack.concat(name).join("."), routes });
  }

  while (state.i < n) {
    const c = content[state.i];

    if (
      c === " " ||
      c === "\n" ||
      c === "\t" ||
      c === "\r" ||
      c === "," ||
      c === ";"
    ) {
      state.i++;
      continue;
    }

    if (c === "`") {
      skipTemplate();
      continue;
    }

    if (
      c === "/" &&
      (content[state.i + 1] === "/" || content[state.i + 1] === "*")
    ) {
      skipComment();
      continue;
    }

    if (c === '"' || c === "'") {
      skipString(c);
      continue;
    }

    if (c === "}") {
      if (stack.length) stack.pop();
      state.i++;
      continue;
    }

    if (c === "{") {
      state.i++;
      continue;
    }

    const idMatch = /^[A-Za-z0-9_$]+/.exec(content.slice(state.i));
    if (!idMatch) {
      state.i++;
      continue;
    }

    const name = idMatch[0];
    let j = state.i + name.length;
    while (j < n && /\s/.test(content[j])) j++;

    if (content[j] === ":") {
      j++;
      while (j < n && /\s/.test(content[j])) j++;
      if (content[j] === "{") {
        stack.push(name);
        state.i = j + 1;
        continue;
      }

      state.i = j;
      readLeafValue(name);
      continue;
    }

    state.i += name.length;
  }

  return leaves;
}

function qualifyLeafRoutes(fileName, leaf) {
  const root = leaf.keyPath.split(".")[0];
  const prefixes = {
    "shared.endpoints.ts": {
      SelectItems: "select-items",
    },
  };

  const prefix = prefixes[fileName]?.[root];
  if (!prefix) return leaf;

  return {
    ...leaf,
    routes: leaf.routes.map((route) => {
      const clean = route.replace(/^\/+/, "");
      if (clean.toLowerCase().startsWith(`${prefix.toLowerCase()}/`))
        return route;
      return `/${prefix}/${clean}`;
    }),
  };
}

function isSubstantialRouteCandidate(route) {
  if (!route) return false;
  const clean = String(route).replace(/^\/+/, "");
  return (
    clean.includes("/") || clean.includes("?") || clean.includes("{param}")
  );
}

function sanitizeLeafRoutes(routes) {
  const uniqueRoutes = [...new Set(routes)];
  const hasSubstantialRoute = uniqueRoutes.some(isSubstantialRouteCandidate);
  if (!hasSubstantialRoute) return uniqueRoutes;

  return uniqueRoutes.filter((route) => {
    const clean = String(route).replace(/^\/+/, "");
    if (isSubstantialRouteCandidate(route)) return true;
    if (clean.startsWith("e-")) return true;
    return false;
  });
}

function inferMethodFromLeafName(leafName, rawRoute) {
  const name = leafName.toLowerCase();
  const route = String(rawRoute || "").toLowerCase();

  if (name.includes("delete") || name.includes("remove")) {
    return "DELETE";
  }

  if (
    name.includes("patch") ||
    name.includes("mark") ||
    name.includes("cancel") ||
    name.includes("revoke") ||
    name.includes("unlock") ||
    name.includes("block") ||
    name.includes("complete") ||
    name.includes("reopen") ||
    name.includes("endmembership")
  ) {
    return "PATCH";
  }

  if (
    name.startsWith("update") ||
    name.includes("update") ||
    name.includes("assign") ||
    name.includes("save") ||
    name.includes("replace")
  ) {
    return "PUT";
  }

  if (
    name.startsWith("create") ||
    name.startsWith("add") ||
    name.startsWith("send") ||
    name.startsWith("login") ||
    name.startsWith("logout") ||
    name.startsWith("refresh") ||
    name.startsWith("recover") ||
    name.startsWith("confirm") ||
    name.startsWith("approve") ||
    name.startsWith("reject") ||
    name.startsWith("generate") ||
    name.startsWith("process") ||
    name.startsWith("preview") ||
    name.startsWith("import") ||
    name.startsWith("sync") ||
    name.startsWith("broadcast") ||
    name.startsWith("apply") ||
    name.startsWith("upload") ||
    name.startsWith("test")
  ) {
    return "POST";
  }

  if (
    name.startsWith("get") ||
    name.startsWith("list") ||
    name.startsWith("select") ||
    name.startsWith("search") ||
    name.startsWith("find") ||
    name.startsWith("by") ||
    name.includes("all") ||
    name.includes("paged") ||
    name.includes("pdf") ||
    name.includes("export") ||
    name.includes("download") ||
    name.includes("status") ||
    name.includes("stats") ||
    name.includes("count") ||
    name.includes("matrix") ||
    name.includes("occupancy") ||
    name.includes("analytics") ||
    name.includes("customer") ||
    name.includes("properties") ||
    route.includes("?")
  ) {
    return "GET";
  }

  return null;
}

function buildDeclarationIndex() {
  const declarations = new Map();
  const referenceIndex = new Map();
  const files = fs
    .readdirSync(ENDPOINTS_DIR)
    .filter((file) => file.endsWith(".endpoints.ts"));

  for (const file of files) {
    const absoluteFile = path.join(ENDPOINTS_DIR, file);
    const content = fs.readFileSync(absoluteFile, "utf8");
    const leaves = parseTsConstants(content);
    const baseName = file.replace(".endpoints.ts", "");
    const directReferenceRoot = `Endpoints${toPascalCase(baseName)}`;

    for (const originalLeaf of leaves) {
      const qualifiedLeaf = qualifyLeafRoutes(file, {
        ...originalLeaf,
        routes: sanitizeLeafRoutes(originalLeaf.routes),
      });
      const leaf = {
        ...qualifiedLeaf,
        routes: sanitizeLeafRoutes(qualifiedLeaf.routes),
      };
      const leafName = leaf.keyPath.split(".").at(-1);
      const rootName = leaf.keyPath.split(".")[0];

      if (rootName === "EnumSelectItems" && leafName === "selectItemEnum") {
        continue;
      }

      for (const raw of leaf.routes) {
        const route = normalizeRoute(raw);
        if (!route || route.includes("=")) continue;

        const key = `${file}:${leaf.keyPath}:${route}`;
        const inferredMethod =
          rootName === "SelectItems" || rootName === "EnumSelectItems"
            ? "GET"
            : inferMethodFromLeafName(leafName, raw);
        const declaration = {
          apps: new Set(),
          declarationFile: file,
          declarationPath: absoluteFile,
          inferredMethod,
          key,
          keyPath: leaf.keyPath,
          raw,
          route,
          usages: [],
        };

        declarations.set(key, declaration);

        const referenceKeys = [
          `Endpoints.${leaf.keyPath}`,
          `${directReferenceRoot}.${leaf.keyPath}`,
        ];

        for (const referenceKey of referenceKeys) {
          if (!referenceIndex.has(referenceKey))
            referenceIndex.set(referenceKey, []);
          referenceIndex.get(referenceKey).push(declaration);
        }
      }
    }
  }

  for (const [referenceKey, items] of referenceIndex.entries()) {
    const hasHierarchicalRoute = items.some(
      (item) => item.route.includes("/") || item.route.includes("{param}"),
    );

    if (!hasHierarchicalRoute) continue;

    const normalizedItems = items.filter((item) => {
      if (item.route.includes("/") || item.route.includes("{param}"))
        return true;
      if (item.route.startsWith("e-")) return true;
      declarations.delete(item.key);
      return false;
    });

    referenceIndex.set(referenceKey, normalizedItems);
  }

  return { declarations, referenceIndex };
}

function appendDeclaration(declarations, declaration) {
  if (declarations.has(declaration.key)) return;
  declarations.set(declaration.key, declaration);
}

function buildEnumSelectWrapperDeclarations() {
  if (!fs.existsSync(ENUM_SELECT_SERVICE_FILE)) return [];

  const content = fs.readFileSync(ENUM_SELECT_SERVICE_FILE, "utf8");
  const declarations = [];
  const patterns = [
    {
      regex:
        /([A-Za-z0-9_]+)\s*=\s*\([^)]*\)\s*=>\s*this\.onLoadEnumList\("([^"]+)"/g,
      routeBuilder: (value) => `select-item-enum/${value}/{param}`,
    },
    {
      regex:
        /([A-Za-z0-9_]+)\s*=\s*\([^)]*\)\s*=>\s*this\.onLoadSelectList\("([^"]+)"/g,
      routeBuilder: (value) => `select-items/${value}`,
    },
    {
      regex:
        /([A-Za-z0-9_]+)\s*\([^)]*\)\s*:\s*[^{]+\{[\s\S]*?return this\.onLoadEnumList\("([^"]+)"/g,
      routeBuilder: (value) => `select-item-enum/${value}/{param}`,
    },
    {
      regex:
        /([A-Za-z0-9_]+)\s*\([^)]*\)\s*:\s*[^{]+\{[\s\S]*?return this\.onLoadSelectList\("([^"]+)"/g,
      routeBuilder: (value) => `select-items/${value}`,
    },
  ];

  for (const { regex, routeBuilder } of patterns) {
    let match;
    while ((match = regex.exec(content))) {
      const methodName = match[1];
      const value = match[2];
      if (!methodName || methodName.startsWith("onLoad")) continue;
      const route = normalizeRoute(routeBuilder(value));
      if (!route) continue;

      declarations.push({
        apps: new Set(),
        declarationFile: "enum-select.service.ts",
        declarationPath: ENUM_SELECT_SERVICE_FILE,
        inferredMethod: "GET",
        key: `enum-select.service.ts:EnumSelectService.${methodName}:${route}`,
        keyPath: `EnumSelectService.${methodName}`,
        raw: routeBuilder(value),
        route,
        usages: [],
      });
    }
  }

  return declarations;
}

function buildEnumSelectWrapperIndex(declarations) {
  const index = new Map();

  for (const declaration of declarations) {
    if (declaration.declarationFile !== "enum-select.service.ts") continue;
    const methodName = declaration.keyPath.split(".").at(-1);
    if (!methodName || methodName.startsWith("onLoad")) continue;
    if (!index.has(methodName)) index.set(methodName, []);
    index.get(methodName).push(declaration);
  }

  return index;
}

function extractEnumSelectServiceAliases(content) {
  const aliases = new Set();
  const regex =
    /(?:private|protected|public|readonly|const|let|var)?\s*(?:readonly\s+)?([A-Za-z_$][A-Za-z0-9_$]*)\s*=\s*inject\(\s*EnumSelectService\s*\)/g;
  let match;

  while ((match = regex.exec(content))) {
    aliases.add(match[1]);
  }

  return [...aliases];
}

function extractHttpClientAliases(content) {
  const aliases = new Set();
  const injectRegex =
    /(?:private|protected|public|readonly|const|let|var)?\s*(?:readonly\s+)?([A-Za-z_$][A-Za-z0-9_$]*)\s*=\s*inject\(\s*HttpClient\s*\)/g;
  const constructorRegex = /constructor\s*\(([\s\S]*?)\)/g;
  let match;

  while ((match = injectRegex.exec(content))) {
    aliases.add(match[1]);
  }

  while ((match = constructorRegex.exec(content))) {
    const params = match[1];
    const paramRegex =
      /(?:private|protected|public|readonly)\s+([A-Za-z_$][A-Za-z0-9_$]*)\s*:\s*HttpClient/g;
    let paramMatch;

    while ((paramMatch = paramRegex.exec(params))) {
      aliases.add(paramMatch[1]);
    }
  }

  return [...aliases];
}

function collectEnumSelectWrapperUsages(
  content,
  filePath,
  appName,
  wrapperIndex,
) {
  const aliases = extractEnumSelectServiceAliases(content);
  if (!aliases.length || !wrapperIndex.size) return;

  for (const alias of aliases) {
    const regex = new RegExp(
      `(?:this\\.)?${alias}\\.([A-Za-z_$][A-Za-z0-9_$]*)\\s*\\(`,
      "g",
    );
    let match;

    while ((match = regex.exec(content))) {
      const methodName = match[1];
      const declarations = wrapperIndex.get(methodName);
      if (!declarations?.length) continue;

      addUsageToDeclarations(declarations, {
        appName,
        filePath,
        method: "GET",
        reference: `EnumSelectService.${methodName}`,
      });
    }
  }
}

function extractEndpointReferences(text, referenceIndex) {
  const references = [];
  const regex =
    /(Endpoints[A-Za-z0-9_]*)\.([A-Za-z0-9_]+(?:\.[A-Za-z0-9_]+)+)/g;
  let match;

  while ((match = regex.exec(text))) {
    const key = `${match[1]}.${match[2]}`;
    if (!referenceIndex.has(key)) continue;

    references.push({
      fullRef: key,
      declarations: referenceIndex.get(key),
    });
  }

  return references;
}

function extractObjectPropertyExpression(text, propertyName) {
  const propertyRegex = new RegExp(`\\b${propertyName}\\s*:`);
  const propertyMatch = propertyRegex.exec(text);
  if (!propertyMatch) return "";

  let i = propertyMatch.index + propertyMatch[0].length;
  let depthParen = 0;
  let depthBrace = 0;
  let depthBracket = 0;
  let quote = null;
  let templateDepth = 0;
  let out = "";

  while (i < text.length) {
    const char = text[i];
    const next = text[i + 1];

    if (quote) {
      out += char;

      if (char === "\\") {
        out += next || "";
        i += 2;
        continue;
      }

      if (quote === "`" && char === "$" && next === "{") {
        templateDepth++;
        out += next || "";
        i += 2;
        continue;
      }

      if (quote === "`" && char === "}" && templateDepth > 0) {
        templateDepth--;
        i++;
        continue;
      }

      if (char === quote && templateDepth === 0) {
        quote = null;
      }

      i++;
      continue;
    }

    if (char === '"' || char === "'" || char === "`") {
      quote = char;
      out += char;
      i++;
      continue;
    }

    if (char === "(") {
      depthParen++;
      out += char;
      i++;
      continue;
    }

    if (char === ")") {
      if (depthParen === 0 && depthBrace === 0 && depthBracket === 0) break;
      depthParen--;
      out += char;
      i++;
      continue;
    }

    if (char === "{") {
      depthBrace++;
      out += char;
      i++;
      continue;
    }

    if (char === "}") {
      if (depthParen === 0 && depthBrace === 0 && depthBracket === 0) break;
      depthBrace--;
      out += char;
      i++;
      continue;
    }

    if (char === "[") {
      depthBracket++;
      out += char;
      i++;
      continue;
    }

    if (char === "]") {
      depthBracket--;
      out += char;
      i++;
      continue;
    }

    if (
      char === "," &&
      depthParen === 0 &&
      depthBrace === 0 &&
      depthBracket === 0
    ) {
      break;
    }

    out += char;
    i++;
  }

  return out.trim();
}

function extractHttpMethodsFromExpression(expression) {
  if (!expression) return [];

  const methods = [];
  const regex = /["'`](GET|POST|PUT|PATCH|DELETE)["'`]/gi;
  let match;

  while ((match = regex.exec(expression))) {
    const method = match[1].toUpperCase();
    if (!methods.includes(method)) methods.push(method);
  }

  return methods;
}

function chooseBestMethodForDeclaration(
  declaration,
  candidateMethods,
  fallbackIndex = 0,
) {
  if (!candidateMethods.length) return null;
  if (candidateMethods.length === 1) return candidateMethods[0];

  if (
    declaration?.inferredMethod &&
    candidateMethods.includes(declaration.inferredMethod)
  ) {
    return declaration.inferredMethod;
  }

  return candidateMethods[Math.min(fallbackIndex, candidateMethods.length - 1)];
}

function extractStringLiterals(text) {
  const values = [];
  const regex = /`([^`]+)`|"([^"\r\n]+)"|'([^'\r\n]+)'/g;
  let match;

  while ((match = regex.exec(text))) {
    const value = match[1] ?? match[2] ?? match[3] ?? "";
    if (!value.trim()) continue;
    values.push(value);
  }

  return values;
}

function extractFirstArgumentExpression(snippet) {
  const openIndex = snippet.indexOf("(");
  if (openIndex === -1) return "";

  let i = openIndex + 1;
  let depthParen = 0;
  let depthBrace = 0;
  let depthBracket = 0;
  let quote = null;
  let templateDepth = 0;
  let out = "";

  while (i < snippet.length) {
    const char = snippet[i];
    const next = snippet[i + 1];

    if (quote) {
      out += char;

      if (char === "\\") {
        out += next || "";
        i += 2;
        continue;
      }

      if (quote === "`" && char === "$" && next === "{") {
        templateDepth++;
        out += next;
        i += 2;
        continue;
      }

      if (quote === "`" && char === "}" && templateDepth > 0) {
        templateDepth--;
        i++;
        continue;
      }

      if (char === quote && templateDepth === 0) {
        quote = null;
      }

      i++;
      continue;
    }

    if (char === '"' || char === "'" || char === "`") {
      quote = char;
      out += char;
      i++;
      continue;
    }

    if (char === "(") {
      depthParen++;
      out += char;
      i++;
      continue;
    }

    if (char === ")") {
      if (depthParen === 0 && depthBrace === 0 && depthBracket === 0) {
        break;
      }
      depthParen--;
      out += char;
      i++;
      continue;
    }

    if (char === "{") {
      depthBrace++;
      out += char;
      i++;
      continue;
    }

    if (char === "}") {
      depthBrace--;
      out += char;
      i++;
      continue;
    }

    if (char === "[") {
      depthBracket++;
      out += char;
      i++;
      continue;
    }

    if (char === "]") {
      depthBracket--;
      out += char;
      i++;
      continue;
    }

    if (
      char === "," &&
      depthParen === 0 &&
      depthBrace === 0 &&
      depthBracket === 0
    ) {
      break;
    }

    out += char;
    i++;
  }

  return out.trim();
}

function detectApiFunctionName(snippet) {
  const match = snippet.match(/\.(on[A-Za-z]+|get|post|put|patch|delete)\b/);
  return match ? match[1] : null;
}

function buildSyntheticRoute(rawRoute, apiFunctionName) {
  const cleaned = String(rawRoute).trim();
  if (!cleaned) return null;

  if (apiFunctionName === "onGetEnumSelectItem") {
    return cleaned.startsWith("select-item-enum/")
      ? cleaned
      : `select-item-enum/${cleaned}`;
  }

  if (apiFunctionName === "onGetSelectItem") {
    return cleaned.startsWith("select-items/")
      ? cleaned
      : `select-items/${cleaned}`;
  }

  return cleaned;
}

function isPlausibleRouteCandidate(route, apiFunctionName) {
  if (!route) return false;
  const value = String(route).trim();
  if (!value) return false;
  if (/\s|,|\|/.test(value)) return false;
  if (/^[0-9]+$/.test(value)) return false;
  if (/^\d{4}-\d{2}(-\d{2})?/.test(value)) return false;
  if (value.includes("${")) return false;

  if (
    apiFunctionName === "onGetEnumSelectItem" ||
    apiFunctionName === "onGetSelectItem"
  ) {
    return /^[a-z][a-z0-9-/]*$/i.test(value);
  }

  return (
    value.includes("/") ||
    value.startsWith("api/") ||
    /^[a-z0-9]+(?:-[a-z0-9]+)+$/i.test(value)
  );
}

function detectUsageMethodFromSnippet(snippet) {
  const apiMatch = snippet.match(
    /\.(on(GetListNotLoading|GetList|GetItemNotLoading|GetItem|GetPaged|GetSelectItem|GetEnumSelectItem|DownloadFilePost|DownloadFile|PreviewPdf|PostBlob|PostNotLoading|PostPaged|PostFile|Post|Put|Patch|Delete))\b/,
  );
  if (apiMatch) {
    return API_METHOD_FROM_USAGE[apiMatch[2]] || null;
  }

  const httpMatch = snippet.match(
    /\.(get|post|put|patch|delete)\s*(?:<[^>]+>)?\s*\(/i,
  );
  if (httpMatch) {
    return httpMatch[1].toUpperCase();
  }

  return null;
}

function buildVariableReferenceIndex(content, referenceIndex) {
  const variableRefs = new Map();
  const assignmentRegex =
    /\b(?:const|let|var)\s+([A-Za-z_$][A-Za-z0-9_$]*)\s*=\s*([\s\S]{0,500}?);/g;
  let match;

  while ((match = assignmentRegex.exec(content))) {
    const variableName = match[1];
    const snippet = match[2];
    const refs = extractEndpointReferences(snippet, referenceIndex);
    const routes = extractStringLiterals(snippet);
    if (!refs.length && !routes.length) continue;

    if (!variableRefs.has(variableName)) variableRefs.set(variableName, []);
    variableRefs.get(variableName).push({
      index: match.index,
      refs,
      routes,
    });
  }

  return variableRefs;
}

function resolveVariableReferences(variableRefs, variableName, usageIndex) {
  const assignments = variableRefs.get(variableName) || [];
  if (!assignments.length) return [];

  let selected = null;
  for (const assignment of assignments) {
    if (assignment.index <= usageIndex) {
      if (!selected || assignment.index > selected.index) {
        selected = assignment;
      }
    }
  }

  return (selected || assignments[assignments.length - 1]).refs;
}

function resolveVariableAssignment(variableRefs, variableName, usageIndex) {
  const assignments = variableRefs.get(variableName) || [];
  if (!assignments.length) return null;

  let selected = null;
  for (const assignment of assignments) {
    if (assignment.index <= usageIndex) {
      if (!selected || assignment.index > selected.index) {
        selected = assignment;
      }
    }
  }

  return selected || assignments[assignments.length - 1];
}

function appendRouteParam(route) {
  if (!route || route.includes("{param}")) return route;
  return `${route.replace(/\/+$/g, "")}/{param}`;
}

function addUsageToDeclarations(declarations, usage) {
  for (const declaration of declarations) {
    declaration.usages.push({
      ...usage,
      effectiveRoute: usage.effectiveRoute || declaration.route,
    });
    declaration.apps.add(usage.appName);
  }
}

function createSyntheticDeclaration({ appName, filePath, method, raw, route }) {
  const normalizedRoute = normalizeRoute(route);
  if (!normalizedRoute) return null;

  return {
    apps: new Set([appName]),
    declarationFile: "[hardcoded-route]",
    declarationPath: filePath,
    inferredMethod: method,
    key: `[hardcoded-route]:${filePath}:${normalizedRoute}:${method}`,
    keyPath: "[hardcoded-route]",
    raw,
    route: normalizedRoute,
    synthetic: true,
    usages: [
      {
        appName,
        effectiveRoute: normalizedRoute,
        filePath,
        method,
        reference: "[hardcoded-route]",
      },
    ],
  };
}

function extractBalancedSnippet(content, startIndex, maxLength = 1200) {
  const openIndex = content.indexOf("(", startIndex);
  if (openIndex === -1) {
    return content.slice(startIndex, startIndex + maxLength);
  }

  let i = openIndex;
  let depth = 0;
  let quote = null;
  let templateDepth = 0;

  while (i < content.length && i - startIndex < maxLength) {
    const char = content[i];
    const next = content[i + 1];

    if (quote) {
      if (char === "\\") {
        i += 2;
        continue;
      }

      if (quote === "`" && char === "$" && next === "{") {
        templateDepth++;
        i += 2;
        continue;
      }

      if (quote === "`" && char === "}" && templateDepth > 0) {
        templateDepth--;
        i++;
        continue;
      }

      if (char === quote && templateDepth === 0) {
        quote = null;
      }

      i++;
      continue;
    }

    if (char === '"' || char === "'" || char === "`") {
      quote = char;
      i++;
      continue;
    }

    if (char === "(") {
      depth++;
      i++;
      continue;
    }

    if (char === ")") {
      depth--;
      i++;
      if (depth === 0) {
        return content.slice(startIndex, i);
      }
      continue;
    }

    i++;
  }

  return content.slice(startIndex, startIndex + maxLength);
}

function collectFrontendUsages(
  referenceIndex,
  wrapperIndex,
  syntheticDeclarations,
) {
  const sourceFiles = [];

  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (fullPath === ENDPOINTS_DIR) continue;
        walk(fullPath);
        continue;
      }

      if (
        entry.isFile() &&
        entry.name.endsWith(".ts") &&
        !entry.name.endsWith(".spec.ts") &&
        fullPath !== ENUM_SELECT_SERVICE_FILE &&
        !fullPath.endsWith(`${path.sep}api-response.service.ts`) &&
        !fullPath.endsWith(`${path.sep}form-helper.ts`)
      ) {
        sourceFiles.push(fullPath);
      }
    }
  }

  walk(FRONTEND_SRC_DIR);

  for (const filePath of sourceFiles) {
    const content = fs.readFileSync(filePath, "utf8");
    const variableRefs = buildVariableReferenceIndex(content, referenceIndex);
    const appName = getAppNameFromFile(filePath);
    const httpClientAliases = extractHttpClientAliases(content);

    collectEnumSelectWrapperUsages(content, filePath, appName, wrapperIndex);

    const callRegex =
      /\.(?:onGetListNotLoading|onGetList|onGetItemNotLoading|onGetItem|onGetPaged|onGetSelectItem|onGetEnumSelectItem|onDownloadFilePost|onDownloadFile|onPreviewPdf|onPostBlob|onPostNotLoading|onPostPaged|onPostFile|onPost|onPut|onPatch|onDelete)\b/g;
    let match;

    while ((match = callRegex.exec(content))) {
      const snippet = extractBalancedSnippet(content, match.index);
      const method = detectUsageMethodFromSnippet(snippet);
      if (!method) continue;
      const apiFunctionName = detectApiFunctionName(snippet);

      let refs = extractEndpointReferences(snippet, referenceIndex);
      let literalRoutes = [];

      if (!refs.length) {
        const variableArgMatch = snippet.match(
          /\(\s*([A-Za-z_$][A-Za-z0-9_$]*)\b/,
        );
        if (variableArgMatch) {
          const assignment = resolveVariableAssignment(
            variableRefs,
            variableArgMatch[1],
            match.index,
          );
          refs = assignment?.refs || [];
          literalRoutes = assignment?.routes || [];
        }
      }

      if (refs.length) {
        for (const ref of refs) {
          addUsageToDeclarations(ref.declarations, {
            appName,
            filePath,
            method,
            reference: ref.fullRef,
          });
        }
        continue;
      }

      if (!literalRoutes.length) {
        literalRoutes = extractStringLiterals(
          extractFirstArgumentExpression(snippet),
        );
      }

      for (const rawRoute of literalRoutes) {
        if (!isPlausibleRouteCandidate(rawRoute, apiFunctionName)) continue;
        const route = buildSyntheticRoute(rawRoute, apiFunctionName);
        if (!route) continue;

        const syntheticDeclaration = createSyntheticDeclaration({
          appName,
          filePath,
          method,
          raw: route,
          route,
        });

        if (syntheticDeclaration) {
          syntheticDeclarations.push(syntheticDeclaration);
        }
      }
    }

    for (const alias of httpClientAliases) {
      const httpCallRegex = new RegExp(
        `(?:this\\.)?${alias}\\.(get|post|put|patch|delete)\\b`,
        "g",
      );

      while ((match = httpCallRegex.exec(content))) {
        const snippet = extractBalancedSnippet(content, match.index);
        const method = detectUsageMethodFromSnippet(snippet);
        if (!method) continue;

        let refs = extractEndpointReferences(snippet, referenceIndex);
        let literalRoutes = [];

        if (!refs.length) {
          const variableArgMatch = snippet.match(
            /\(\s*([A-Za-z_$][A-Za-z0-9_$]*)\b/,
          );
          if (variableArgMatch) {
            const assignment = resolveVariableAssignment(
              variableRefs,
              variableArgMatch[1],
              match.index,
            );
            refs = assignment?.refs || [];
            literalRoutes = assignment?.routes || [];
          }
        }

        if (refs.length) {
          for (const ref of refs) {
            addUsageToDeclarations(ref.declarations, {
              appName,
              filePath,
              method,
              reference: ref.fullRef,
            });
          }
          continue;
        }

        if (!literalRoutes.length) {
          literalRoutes = extractStringLiterals(
            extractFirstArgumentExpression(snippet),
          );
        }

        for (const rawRoute of literalRoutes) {
          if (!isPlausibleRouteCandidate(rawRoute, match[1])) continue;
          const route = buildSyntheticRoute(rawRoute, match[1]);
          if (!route) continue;

          const syntheticDeclaration = createSyntheticDeclaration({
            appName,
            filePath,
            method,
            raw: route,
            route,
          });

          if (syntheticDeclaration) {
            syntheticDeclarations.push(syntheticDeclaration);
          }
        }
      }
    }

    const submitCrudRegex = /submitCrud\s*\(/g;
    while ((match = submitCrudRegex.exec(content))) {
      const snippet = extractBalancedSnippet(content, match.index);
      const refs = extractEndpointReferences(snippet, referenceIndex);
      if (!refs.length) continue;

      const appName = getAppNameFromFile(filePath);
      const endpointExpression = extractObjectPropertyExpression(
        snippet,
        "endpoint",
      );
      const methodExpression = extractObjectPropertyExpression(
        snippet,
        "method",
      );
      const endpointRefs = endpointExpression
        ? extractEndpointReferences(endpointExpression, referenceIndex)
        : refs;
      const methodLiterals = extractHttpMethodsFromExpression(methodExpression);

      if (
        endpointRefs.length > 0 &&
        endpointRefs.length === methodLiterals.length
      ) {
        for (let index = 0; index < endpointRefs.length; index++) {
          const ref = endpointRefs[index];
          for (const declaration of ref.declarations) {
            const method = chooseBestMethodForDeclaration(
              declaration,
              methodLiterals,
              index,
            );
            if (!method) continue;
            addUsageToDeclarations([declaration], {
              appName,
              effectiveRoute:
                method === "POST"
                  ? declaration.route
                  : appendRouteParam(declaration.route),
              filePath,
              method,
              reference: ref.fullRef,
            });
          }
        }
        continue;
      }

      const explicitMethodMatch = snippet.match(
        /method\s*:\s*["'`](POST|PUT|PATCH)["'`]/i,
      );
      const hasId = /\bid\s*:/.test(snippet);
      const methods = explicitMethodMatch
        ? [explicitMethodMatch[1].toUpperCase()]
        : methodLiterals.length === 1
          ? methodLiterals
          : hasId
            ? ["POST", "PUT"]
            : ["POST"];

      for (const ref of refs) {
        for (const declaration of ref.declarations) {
          for (const method of methods) {
            addUsageToDeclarations([declaration], {
              appName,
              effectiveRoute:
                method === "POST"
                  ? declaration.route
                  : appendRouteParam(declaration.route),
              filePath,
              method,
              reference: ref.fullRef,
            });
          }
        }
      }
    }
  }
}

function loadFrontend() {
  const { declarations, referenceIndex } = buildDeclarationIndex();
  const enumSelectWrapperDeclarations = buildEnumSelectWrapperDeclarations();
  for (const declaration of enumSelectWrapperDeclarations) {
    appendDeclaration(declarations, declaration);
  }
  const enumSelectWrapperIndex = buildEnumSelectWrapperIndex(
    enumSelectWrapperDeclarations,
  );
  const syntheticDeclarations = [];
  collectFrontendUsages(
    referenceIndex,
    enumSelectWrapperIndex,
    syntheticDeclarations,
  );

  const routeMethodMap = new Map();
  const unknownDeclarations = [];
  const declarationOnly = [];

  for (const declaration of declarations.values()) {
    const usageKeys = [
      ...new Set(
        declaration.usages.map(
          (usage) => `${usage.effectiveRoute}|${usage.method}`,
        ),
      ),
    ];
    const methodSet = declaration.inferredMethod
      ? [declaration.inferredMethod]
      : [];

    if (!usageKeys.length) {
      declarationOnly.push(declaration);
    }

    if (!usageKeys.length && !methodSet.length) {
      unknownDeclarations.push(declaration);
      continue;
    }

    for (const usageKey of usageKeys) {
      const [route, method] = usageKey.split("|");
      const mapKey = `${route}|${method}`;
      if (!routeMethodMap.has(mapKey)) {
        routeMethodMap.set(mapKey, {
          declarations: [],
          method,
          route,
          usages: [],
        });
      }

      const bucket = routeMethodMap.get(mapKey);
      bucket.declarations.push(declaration);
      bucket.usages.push(
        ...declaration.usages.filter(
          (usage) => usage.method === method && usage.effectiveRoute === route,
        ),
      );
    }

    if (!usageKeys.length) {
      for (const method of methodSet) {
        const mapKey = `${declaration.route}|${method}`;
        if (!routeMethodMap.has(mapKey)) {
          routeMethodMap.set(mapKey, {
            declarations: [],
            method,
            route: declaration.route,
            usages: [],
          });
        }

        const bucket = routeMethodMap.get(mapKey);
        bucket.declarations.push(declaration);
      }
    }
  }

  for (const declaration of syntheticDeclarations) {
    const mapKey = `${declaration.route}|${declaration.inferredMethod}`;
    if (!routeMethodMap.has(mapKey)) {
      routeMethodMap.set(mapKey, {
        declarations: [],
        method: declaration.inferredMethod,
        route: declaration.route,
        usages: [],
      });
    }

    const bucket = routeMethodMap.get(mapKey);
    bucket.declarations.push(declaration);
    bucket.usages.push(...declaration.usages);
  }

  return {
    declarationOnly,
    declarations,
    routeMethodMap,
    unknownDeclarations,
  };
}

async function loadSwagger() {
  const swaggerSource = await loadSwaggerSpec();
  const routes = new Map();
  const spec = swaggerSource.spec;

  for (const [swaggerPath, methods] of Object.entries(spec.paths || {})) {
    const route = normalizeRoute(swaggerPath);
    for (const [methodName, details] of Object.entries(methods)) {
      const method = methodName.toUpperCase();
      const key = `${route}|${method}`;
      routes.set(key, {
        key,
        method,
        original: swaggerPath,
        route,
        tags: details.tags || [],
      });
    }
  }

  return { routes, swaggerSource };
}

function compare(frontend, swagger) {
  const matchedUsed = [];
  const matchedDeclaredOnly = [];
  const onlyFrontendUsed = [];
  const onlyFrontendDeclaredOnly = [];
  const onlySwaggerLegacy = [];
  const onlySwagger = [];

  for (const [key, frontInfo] of frontend.routeMethodMap.entries()) {
    const swaggerInfo = swagger.get(key);
    const hasRealUsage = frontInfo.usages.length > 0;

    if (swaggerInfo) {
      const combined = { ...swaggerInfo, ...frontInfo };
      if (hasRealUsage) matchedUsed.push(combined);
      else matchedDeclaredOnly.push(combined);
      continue;
    }

    if (hasRealUsage) onlyFrontendUsed.push(frontInfo);
    else onlyFrontendDeclaredOnly.push(frontInfo);
  }

  for (const [key, swaggerInfo] of swagger.entries()) {
    if (!frontend.routeMethodMap.has(key)) {
      const isLegacy = LEGACY_SWAGGER_PATTERNS.some((pattern) =>
        pattern.test(swaggerInfo.route),
      );
      if (isLegacy) onlySwaggerLegacy.push(swaggerInfo);
      else onlySwagger.push(swaggerInfo);
    }
  }

  return {
    frontendUnknownMethod: frontend.unknownDeclarations,
    matchedDeclaredOnly,
    matchedUsed,
    onlyFrontendDeclaredOnly,
    onlyFrontendUsed,
    onlySwaggerLegacy,
    onlySwagger,
  };
}

function groupByTag(items) {
  const groups = new Map();

  for (const item of items) {
    const tags = item.tags?.length ? item.tags : ["(sin tag)"];
    for (const tag of tags) {
      if (!groups.has(tag)) groups.set(tag, []);
      groups.get(tag).push(item);
    }
  }

  return new Map(
    [...groups.entries()].sort((a, b) => a[0].localeCompare(b[0])),
  );
}

function renderFrontendSourceCell(item) {
  const declarations = item.declarations || [];
  const keyPaths = [
    ...new Set(
      declarations.map(
        (entry) => `${entry.declarationFile} :: ${entry.keyPath}`,
      ),
    ),
  ];
  return keyPaths
    .map((value) => `<div><code>${escapeHtml(value)}</code></div>`)
    .join("");
}

function renderAppsCell(item) {
  const apps = [
    ...new Set((item.usages || []).map((usage) => usage.appName)),
  ].sort();
  if (!apps.length) return `<span class="muted">Sin uso detectado</span>`;
  return apps.map((app) => `<code>${escapeHtml(app)}</code>`).join("<br>");
}

function renderUsageCell(item) {
  const usages = item.usages || [];
  if (!usages.length) {
    return `<span class="badge warn">&#9888;&#65039; Solo declarada</span>`;
  }

  const files = [
    ...new Set(
      usages.map((usage) => usage.filePath.replace(`${BASE_DIR}\\`, "")),
    ),
  ];
  const preview = files
    .slice(0, 3)
    .map((file) => `<div><code>${escapeHtml(file)}</code></div>`)
    .join("");
  const more =
    files.length > 3
      ? `<div class="muted">+${files.length - 3} archivo(s)</div>`
      : "";

  return `<span class="badge ok">&#9989; ${usages.length} uso(s)</span>${preview}${more}`;
}

function renderMatchedSection(title, items, openByDefault) {
  const lines = [];
  lines.push(`## ${title} (${items.length})`);
  lines.push("");

  if (!items.length) {
    lines.push(`<p class="empty">&#9989; Sin elementos en esta categoria.</p>`);
    lines.push("");
    return lines;
  }

  const grouped = groupByTag(items);
  for (const [tag, group] of grouped.entries()) {
    lines.push(`<details${openByDefault ? " open" : ""}>`);
    lines.push(
      `<summary><strong>${escapeHtml(tag)}</strong> (${group.length})</summary>`,
    );
    lines.push("");
    lines.push(`<table class="report-table">`);
    lines.push(
      `<colgroup><col style="width:8%"><col style="width:24%"><col style="width:28%"><col style="width:15%"><col style="width:25%"></colgroup>`,
    );
    lines.push(
      `<thead><tr><th>Metodo</th><th>Ruta</th><th>Constante Front</th><th>Apps</th><th>Uso detectado</th></tr></thead>`,
    );
    lines.push(`<tbody>`);

    for (const item of group) {
      const color = swaggerMethodColor(item.method);
      lines.push(
        `<tr>` +
          `<td><span class="method-tag" style="background:${color}">${item.method}</span></td>` +
          `<td><code>/api/${escapeHtml(item.route)}</code></td>` +
          `<td>${renderFrontendSourceCell(item)}</td>` +
          `<td>${renderAppsCell(item)}</td>` +
          `<td>${renderUsageCell(item)}</td>` +
          `</tr>`,
      );
    }

    lines.push(`</tbody></table>`);
    lines.push(`</details>`);
    lines.push("");
  }

  return lines;
}

function renderFrontendOnlySection(title, items) {
  const lines = [];
  lines.push(`## ${title} (${items.length})`);
  lines.push("");

  if (!items.length) {
    lines.push(`<p class="empty">&#9989; Sin elementos en esta categoria.</p>`);
    lines.push("");
    return lines;
  }

  lines.push(`<table class="report-table">`);
  lines.push(
    `<colgroup><col style="width:8%"><col style="width:22%"><col style="width:30%"><col style="width:14%"><col style="width:26%"></colgroup>`,
  );
  lines.push(
    `<thead><tr><th>Metodo</th><th>Ruta</th><th>Constante Front</th><th>Apps</th><th>Uso detectado</th></tr></thead>`,
  );
  lines.push(`<tbody>`);

  for (const item of items.sort(
    (a, b) =>
      a.route.localeCompare(b.route) || a.method.localeCompare(b.method),
  )) {
    const color = swaggerMethodColor(item.method);
    lines.push(
      `<tr>` +
        `<td><span class="method-tag" style="background:${color}">${item.method}</span></td>` +
        `<td><code>/api/${escapeHtml(item.route)}</code></td>` +
        `<td>${renderFrontendSourceCell(item)}</td>` +
        `<td>${renderAppsCell(item)}</td>` +
        `<td>${renderUsageCell(item)}</td>` +
        `</tr>`,
    );
  }

  lines.push(`</tbody></table>`);
  lines.push("");
  return lines;
}

function renderSwaggerOnlySection(items) {
  const lines = [];
  lines.push(`## Rutas Solo API (${items.length})`);
  lines.push("");

  if (!items.length) {
    lines.push(`<p class="empty">&#9989; Sin elementos en esta categoria.</p>`);
    lines.push("");
    return lines;
  }

  const grouped = groupByTag(items);
  for (const [tag, group] of grouped.entries()) {
    lines.push(`<details>`);
    lines.push(
      `<summary><strong>${escapeHtml(tag)}</strong> (${group.length})</summary>`,
    );
    lines.push("");
    lines.push(`<table class="report-table">`);
    lines.push(
      `<colgroup><col style="width:8%"><col style="width:42%"><col style="width:50%"></colgroup>`,
    );
    lines.push(
      `<thead><tr><th>Metodo</th><th>Ruta normalizada</th><th>Ruta swagger</th></tr></thead>`,
    );
    lines.push(`<tbody>`);

    for (const item of group) {
      const color = swaggerMethodColor(item.method);
      lines.push(
        `<tr>` +
          `<td><span class="method-tag" style="background:${color}">${item.method}</span></td>` +
          `<td><code>/api/${escapeHtml(item.route)}</code></td>` +
          `<td><code>${escapeHtml(item.original)}</code></td>` +
          `</tr>`,
      );
    }

    lines.push(`</tbody></table>`);
    lines.push(`</details>`);
    lines.push("");
  }

  return lines;
}

function renderSwaggerLegacySection(items) {
  const lines = [];
  lines.push(`## Rutas Solo API Legacy (${items.length})`);
  lines.push("");
  lines.push(
    `<p>Estas rutas siguen expuestas como alias de compatibilidad o endpoints tecnicos legacy. Se separan para no inflar la deuda principal.</p>`,
  );
  lines.push("");

  if (!items.length) {
    lines.push(`<p class="empty">&#9989; Sin elementos en esta categoria.</p>`);
    lines.push("");
    return lines;
  }

  const grouped = groupByTag(items);
  for (const [tag, group] of grouped.entries()) {
    lines.push(`<details>`);
    lines.push(
      `<summary><strong>${escapeHtml(tag)}</strong> (${group.length})</summary>`,
    );
    lines.push("");
    lines.push(`<table class="report-table">`);
    lines.push(
      `<colgroup><col style="width:8%"><col style="width:42%"><col style="width:50%"></colgroup>`,
    );
    lines.push(
      `<thead><tr><th>Metodo</th><th>Ruta normalizada</th><th>Ruta swagger</th></tr></thead>`,
    );
    lines.push(`<tbody>`);

    for (const item of group) {
      const color = swaggerMethodColor(item.method);
      lines.push(
        `<tr>` +
          `<td><span class="method-tag" style="background:${color}">${item.method}</span></td>` +
          `<td><code>/api/${escapeHtml(item.route)}</code></td>` +
          `<td><code>${escapeHtml(item.original)}</code></td>` +
          `</tr>`,
      );
    }

    lines.push(`</tbody></table>`);
    lines.push(`</details>`);
    lines.push("");
  }

  return lines;
}

function renderUnknownDeclarationsSection(items) {
  const lines = [];
  lines.push(`## Constantes sin metodo detectable (${items.length})`);
  lines.push("");
  lines.push(
    `<p>Estas constantes no tienen uso detectado y el generador no pudo inferir con seguridad el metodo HTTP. Requieren revision manual o mejorar el nombrado.</p>`,
  );
  lines.push("");

  if (!items.length) {
    lines.push(`<p class="empty">&#9989; Sin elementos en esta categoria.</p>`);
    lines.push("");
    return lines;
  }

  lines.push(`<table class="report-table">`);
  lines.push(
    `<colgroup><col style="width:25%"><col style="width:25%"><col style="width:50%"></colgroup>`,
  );
  lines.push(
    `<thead><tr><th>Archivo</th><th>KeyPath</th><th>Ruta</th></tr></thead>`,
  );
  lines.push(`<tbody>`);

  for (const item of items.sort((a, b) => a.route.localeCompare(b.route))) {
    lines.push(
      `<tr>` +
        `<td><code>${escapeHtml(item.declarationFile)}</code></td>` +
        `<td><code>${escapeHtml(item.keyPath)}</code></td>` +
        `<td><code>/api/${escapeHtml(item.route)}</code></td>` +
        `</tr>`,
    );
  }

  lines.push(`</tbody></table>`);
  lines.push("");
  return lines;
}

function renderSummary(result) {
  const totalSwaggerSurface =
    result.matchedUsed.length +
    result.matchedDeclaredOnly.length +
    result.onlySwagger.length;

  const realCoverage = totalSwaggerSurface
    ? ((result.matchedUsed.length / totalSwaggerSurface) * 100).toFixed(1)
    : "0.0";

  const contractCoverage = totalSwaggerSurface
    ? (
        ((result.matchedUsed.length + result.matchedDeclaredOnly.length) /
          totalSwaggerSurface) *
        100
      ).toFixed(1)
    : "0.0";

  return [
    `## Resumen`,
    ``,
    `<div class="summary-grid">`,
    `<div class="summary-card"><div class="num">${result.matchedUsed.length}</div><div class="lbl ok">&#9989; Match real</div></div>`,
    `<div class="summary-card"><div class="num">${result.matchedDeclaredOnly.length}</div><div class="lbl warn">&#9888;&#65039; Match solo declarado</div></div>`,
    `<div class="summary-card"><div class="num">${result.onlyFrontendUsed.length}</div><div class="lbl err">&#10060; Solo Front usado</div></div>`,
    `<div class="summary-card"><div class="num">${result.onlyFrontendDeclaredOnly.length}</div><div class="lbl warn">&#9888;&#65039; Solo Front declarado</div></div>`,
    `<div class="summary-card"><div class="num">${result.onlySwagger.length}</div><div class="lbl err">&#10060; Solo API</div></div>`,
    `<div class="summary-card"><div class="num">${result.onlySwaggerLegacy.length}</div><div class="lbl muted">Solo API legacy</div></div>`,
    `<div class="summary-card"><div class="num">${result.frontendUnknownMethod.length}</div><div class="lbl muted">Metodo desconocido</div></div>`,
    `<div class="summary-card"><div class="num">${realCoverage}%</div><div class="lbl ok">Cobertura real</div></div>`,
    `<div class="summary-card"><div class="num">${contractCoverage}%</div><div class="lbl">Cobertura contractual</div></div>`,
    `</div>`,
    ``,
    `> **Cobertura real** = uso real del frontend detectado contra Swagger.`,
    `> **Cobertura contractual** = uso real + constantes declaradas que coinciden con Swagger.`,
    ``,
  ];
}

function render(result) {
  const swaggerSource =
    result.swaggerSource.sourceKind === "file"
      ? path.relative(BASE_DIR, result.swaggerSource.sourceLabel).replace(/\\/g, "/")
      : result.swaggerSource.sourceLabel;
  const lines = [];
  lines.push(`# Routes Radiography: Frontend vs API`);
  lines.push("");
  lines.push(`> Generado el ${new Date().toISOString().slice(0, 10)}`);
  lines.push(
    `> Fuente Frontend: constantes en \`client/angular/src/app/core/constants/endpoints\` + uso detectado en \`client/angular/src/app\``,
  );
  lines.push(
    `> Fuente API: \`${swaggerSource}\` (${result.swaggerSource.sourceKind === "live" ? "viva" : "archivo"})`,
  );
  lines.push("");
  lines.push(`<style>`);
  lines.push(
    `body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }`,
  );
  lines.push(
    `.summary-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(180px,1fr)); gap:10px; margin:12px 0 20px; }`,
  );
  lines.push(
    `.summary-card { border:1px solid #d0d7de; border-radius:10px; padding:12px; background:#ffffff; }`,
  );
  lines.push(
    `.summary-card .num { font-size:28px; font-weight:700; line-height:1.1; }`,
  );
  lines.push(`.summary-card .lbl { font-size:12px; margin-top:6px; }`);
  lines.push(
    `.report-table { width:100%; border-collapse:collapse; table-layout:fixed; margin:10px 0; }`,
  );
  lines.push(
    `.report-table th, .report-table td { border:1px solid #d0d7de; padding:8px; text-align:left; vertical-align:top; word-break:break-word; }`,
  );
  lines.push(`.report-table th { background:#f6f8fa; }`);
  lines.push(
    `.method-tag { display:inline-block; padding:2px 8px; border-radius:999px; font-size:11px; font-weight:700; color:#fff; }`,
  );
  lines.push(
    `.badge { display:inline-block; padding:2px 8px; border-radius:999px; font-size:11px; font-weight:700; margin-bottom:6px; }`,
  );
  lines.push(
    `.badge.ok { background:#ecfdf3; color:#027a48; border:1px solid #abefc6; }`,
  );
  lines.push(
    `.badge.warn { background:#fffaeb; color:#b54708; border:1px solid #fedf89; }`,
  );
  lines.push(`.ok { color:#027a48; }`);
  lines.push(`.warn { color:#b54708; }`);
  lines.push(`.err { color:#b42318; }`);
  lines.push(`.muted { color:#667085; }`);
  lines.push(
    `.empty { padding:10px 12px; border:1px solid #d0d7de; border-radius:8px; background:#f8fafc; }`,
  );
  lines.push(`details { margin-bottom:12px; }`);
  lines.push(`summary { cursor:pointer; }`);
  lines.push(`</style>`);
  lines.push("");

  lines.push(...renderSummary(result));
  lines.push(
    ...renderMatchedSection("Matches Reales", result.matchedUsed, true),
  );
  lines.push(
    ...renderMatchedSection(
      "Matches Solo Declarados",
      result.matchedDeclaredOnly,
      false,
    ),
  );
  lines.push(
    ...renderFrontendOnlySection(
      "Rutas Solo Front Usadas",
      result.onlyFrontendUsed,
    ),
  );
  lines.push(
    ...renderFrontendOnlySection(
      "Rutas Solo Front Declaradas",
      result.onlyFrontendDeclaredOnly,
    ),
  );
  lines.push(...renderSwaggerOnlySection(result.onlySwagger));
  lines.push(...renderSwaggerLegacySection(result.onlySwaggerLegacy));
  lines.push(...renderUnknownDeclarationsSection(result.frontendUnknownMethod));

  return lines.join("\n");
}

async function main() {
  console.log("[1/4] Cargando frontend...");
  const frontend = loadFrontend();
  console.log(
    `      -> ${frontend.declarations.size} declaraciones de endpoint`,
  );
  console.log(
    `      -> ${frontend.routeMethodMap.size} combinaciones ruta+metodo en frontend`,
  );

  console.log("[2/4] Cargando swagger...");
  const { routes: swagger, swaggerSource } = await loadSwagger();
  console.log(`      -> ${swagger.size} combinaciones ruta+metodo en swagger`);
  console.log(
    `      -> fuente: ${swaggerSource.sourceLabel} (${swaggerSource.sourceKind})`,
  );

  console.log("[3/4] Comparando...");
  const result = compare(frontend, swagger);
  result.swaggerSource = swaggerSource;
  console.log(
    `      -> reales: ${result.matchedUsed.length}, declarados: ${result.matchedDeclaredOnly.length}, solo front usados: ${result.onlyFrontendUsed.length}, solo api: ${result.onlySwagger.length}`,
  );

  console.log("[4/4] Generando reporte...");
  fs.writeFileSync(OUTPUT_FILE, render(result), "utf8");
  console.log(`      -> ${OUTPUT_FILE}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
