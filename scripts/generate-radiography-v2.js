const fs = require("fs");
const path = require("path");

const angularDir = path.join(__dirname, "client", "angular", "src", "app");
const appsDir = path.join(angularDir, "apps");
const constantsDir = path.join(angularDir, "core", "constants");
const coreDir = path.join(angularDir, "core");
const sharedDir = path.join(angularDir, "shared");
const backendDir = path.join(__dirname, "api", "LuxuryApp.Application");

function normalizeRoute(route, { stripTrailingParam = false } = {}) {
  if (!route) return "";

  let normalized = route
    .replace(/\$\{[^}]+\}/g, "{param}")
    .replace(/\{[^}]+\}/g, "{param}")
    .split("?")[0]
    .replace(/^\/?api\//i, "/")
    .replace(/\/+/g, "/")
    .replace(/\/$/, "")
    .toLowerCase();

  if (stripTrailingParam) {
    normalized = normalized.replace(/\/\{param\}$/, "");
  }

  return normalized;
}

function normalizeRouteForMatch(route) {
  return normalizeRoute(route, { stripTrailingParam: true });
}

function isRouteMatch(frontRoute, backRoute) {
  const strictFront = normalizeRoute(frontRoute);
  const strictBack = normalizeRoute(backRoute);
  const normalizedFront = normalizeRouteForMatch(frontRoute);
  const normalizedBack = normalizeRouteForMatch(backRoute);

  if (!strictFront || !strictBack) return false;
  if (strictFront === strictBack) return true;
  if (normalizedFront === normalizedBack) return true;

  return (
    normalizedFront.startsWith(normalizedBack + "/") ||
    normalizedBack.startsWith(normalizedFront + "/")
  );
}

function renderStatusBadge(level, text) {
  return `<span class="status-badge status-${level.toLowerCase()}"><span class="status-dot"></span>${text}</span>`;
}

function normalizeDomainName(value) {
  if (!value) return "";

  return value
    .replace(/\.endpoints\.ts$/i, "")
    .replace(/\.luxuryapp$/i, "")
    .replace(/luxuryapp$/i, "")
    .replace(/endpoints$/i, "")
    .replace(/[.\-_\s]/g, "")
    .toLowerCase();
}

const domainOwnershipAliases = {
  operations: new Set([
    "operations",
    "mantenimiento",
    "resident",
    "security",
    "supplier",
    "direccion",
    "admin",
    "system",
  ]),
  mantenimiento: new Set(["mantenimiento"]),
  supplier: new Set(["supplier"]),
  resident: new Set(["resident"]),
  security: new Set(["security"]),
  admin: new Set(["admin", "system"]),
  auth: new Set(["auth"]),
  cobranza: new Set(["cobranza"]),
  contabilidad: new Set(["contabilidad"]),
  direccion: new Set(["direccion"]),
  legal: new Set(["legal"]),
  reclutamiento: new Set(["reclutamiento"]),
  recursoshumanos: new Set(["recursoshumanos"]),
  shared: new Set(["shared", "core", "web"]),
};

const crossPortalConsumerAliases = {
  contabilidad: new Set(["operations", "supplier"]),
};

for (const [backDomain, allowedConsumers] of Object.entries(
  crossPortalConsumerAliases,
)) {
  const ownershipSet = domainOwnershipAliases[backDomain];
  if (!ownershipSet) continue;
  for (const consumer of allowedConsumers) {
    ownershipSet.add(consumer);
  }
}

function domainMatchesOwnership(frontDomain, backDomain) {
  const normalizedFront = normalizeDomainName(frontDomain);
  const normalizedBack = normalizeDomainName(backDomain);

  if (!normalizedFront || !normalizedBack) return false;
  if (normalizedFront === normalizedBack) return true;

  const allowedFronts = domainOwnershipAliases[normalizedBack];
  if (allowedFronts?.has(normalizedFront)) {
    return true;
  }

  return (
    normalizedFront.includes(normalizedBack) ||
    normalizedBack.includes(normalizedFront)
  );
}

function isLegitimateCrossPortalConsumer(frontDomain, backDomain) {
  const normalizedFront = normalizeDomainName(frontDomain);
  const normalizedBack = normalizeDomainName(backDomain);

  if (!normalizedFront || !normalizedBack) return false;

  const allowedConsumers = crossPortalConsumerAliases[normalizedBack];
  return allowedConsumers?.has(normalizedFront) ?? false;
}

function getRouteUsageStatus(consumersSet, constBase) {
  if (!consumersSet.size) {
    return renderStatusBadge(
      "warn",
      "Declarada en constantes, sin consumidor detectado",
    );
  }

  if (constBase === "shared" || constBase === "core") {
    return renderStatusBadge("ok", `Ruta consumida (${constBase})`);
  }

  return renderStatusBadge("ok", "Ruta consumida");
}

function getConsumerDomain(consumer) {
  if (!consumer) return "";

  const [baseSegment] = consumer.split("/");
  return normalizeDomainName(baseSegment);
}

function isSharedContext(consumersSet, constBase) {
  if (constBase === "shared" || constBase === "core") {
    return true;
  }

  return Array.from(consumersSet).some((consumer) => {
    const consumerDomain = getConsumerDomain(consumer);
    return consumerDomain === "shared" || consumerDomain === "core";
  });
}

function getDomainMatchStatus(consumersSet, constBase, backBase) {
  if (!consumersSet.size) {
    return renderStatusBadge("warn", "Sin consumidor detectado");
  }

  if (isSharedContext(consumersSet, constBase)) {
    return renderStatusBadge("ok", "Compartido/transversal");
  }

  const consumerDomains = new Set(
    Array.from(consumersSet)
      .map((consumer) => getConsumerDomain(consumer))
      .filter(Boolean),
  );

  if (
    constBase &&
    backBase &&
    isLegitimateCrossPortalConsumer(constBase, backBase) &&
    Array.from(consumerDomains).every(
      (domain) =>
        domain === normalizeDomainName(constBase) ||
        domain === normalizeDomainName(backBase) ||
        isLegitimateCrossPortalConsumer(domain, backBase),
    )
  ) {
    return renderStatusBadge("ok", "Cross-portal legitimo");
  }

  if (
    constBase &&
    backBase &&
    domainMatchesOwnership(constBase, backBase)
  ) {
    return renderStatusBadge("ok", "Alineado");
  }

  if (consumerDomains.has(backBase)) {
    return renderStatusBadge("warn", "Revisar constante de dominio");
  }

  for (const consumer of consumersSet) {
    const frontBase = getConsumerDomain(consumer);

    if (
      domainMatchesOwnership(frontBase, backBase) &&
      domainMatchesOwnership(constBase, backBase)
    ) {
      return renderStatusBadge("ok", "Alineado");
    }
  }

  return renderStatusBadge("warn", "Revisar dominio");
}

function getLeafMatchScore(leaf) {
  const consumerCount = leaf.consumers?.size || 0;
  const routeCount = leaf.routes?.length || 0;
  const keyPathLength = leaf.keyPath?.length || 0;
  return consumerCount * 1000 + keyPathLength * 10 + routeCount;
}

function getConstOwnershipScore(constBase, backBase) {
  if (!constBase || !backBase) return 0;
  const normalizedConstBase = normalizeDomainName(constBase);
  const normalizedBackBase = normalizeDomainName(backBase);
  if (normalizedConstBase === "shared") return 300;
  if (domainMatchesOwnership(normalizedConstBase, normalizedBackBase)) {
    if (normalizedConstBase === normalizedBackBase) return 800;
    return 400;
  }
  return 0;
}

function getRouteMatchScore(frontRoute, backRoute) {
  const strictFront = normalizeRoute(frontRoute);
  const strictBack = normalizeRoute(backRoute);
  const looseFront = normalizeRouteForMatch(frontRoute);
  const looseBack = normalizeRouteForMatch(backRoute);

  if (!strictFront || !strictBack) return -1;
  if (strictFront === strictBack) return 10_000 + strictFront.length;
  if (looseFront === looseBack) return 5_000 + looseFront.length;

  if (strictFront.startsWith(strictBack + "/")) {
    return 2_000 + strictBack.length;
  }

  if (strictBack.startsWith(strictFront + "/")) {
    return 2_000 + strictFront.length;
  }

  if (looseFront.startsWith(looseBack + "/")) {
    return 1_000 + looseBack.length;
  }

  if (looseBack.startsWith(looseFront + "/")) {
    return 1_000 + looseFront.length;
  }

  return -1;
}

function getOperationKeyScore(keyPath, method, route) {
  const key = keyPath.split(".").pop()?.toLowerCase() || "";
  const normalizedRoute = normalizeRoute(route);
  const isItemRoute = normalizedRoute.endsWith("/{param}");
  const hasListSegment = normalizedRoute.endsWith("/list");

  if (method === "GET") {
    if (isItemRoute && key.includes("getbyid")) return 500;
    if (hasListSegment && (key.includes("list") || key.includes("getall"))) {
      return 500;
    }
    if (
      !isItemRoute &&
      !hasListSegment &&
      (key.includes("getall") || key === "base" || key.includes("selectitems"))
    ) {
      return 400;
    }
    if (key.includes("get")) return 100;
  }

  if (method === "POST") {
    if (key.includes("create")) return 500;
    if (key === "base" || key.includes("post")) return 250;
  }

  if (method === "PUT" || method === "PATCH") {
    if (key.includes("update") || key.includes("edit")) return 500;
  }

  if (method === "DELETE") {
    if (key.includes("delete") || key.includes("remove")) return 500;
  }

  return 0;
}

function walk(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (file === "bin" || file === "obj") continue;
      walk(fullPath, fileList);
    } else {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

const backendFiles = walk(backendDir).filter(
  (f) => f.endsWith("Endpoints.cs") || f.endsWith("Controller.cs"),
);
const backendEndpoints = [];

for (const file of backendFiles) {
  const content = fs.readFileSync(file, "utf8");
  const relPath = path.relative(backendDir, file);
  const relParts = relPath.split(path.sep);
  const moduleName =
    relParts[0] === "Moduls" && relParts.length > 1 ? relParts[1] : relParts[0];

  let baseRoute = "";
  const groupMatch = content.match(/MapGroup\(\s*"([^"]+)"\s*\)/);
  if (groupMatch) {
    baseRoute = groupMatch[1];
  } else {
    const controllerRoute = content.match(/\[Route\(\s*"([^"]+)"\s*\)\]/);
    if (controllerRoute) baseRoute = controllerRoute[1];
  }

  const regex =
    /(MapGet|MapPost|MapPut|MapDelete|MapPatch|HttpGet|HttpPost|HttpPut|HttpDelete|HttpPatch)\s*\(\s*(?:"([^"]*)")?/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const method = match[1].replace("Map", "").replace("Http", "").toUpperCase();
    const subRoute = match[2] || "";
    let fullRoute = baseRoute;
    if (subRoute) {
      fullRoute = fullRoute ? `${fullRoute}/${subRoute}` : subRoute;
    }

    fullRoute = fullRoute.replace(/\/+/g, "/");
    if (!fullRoute.startsWith("/")) fullRoute = "/" + fullRoute;

    backendEndpoints.push({
      route: fullRoute,
      baseRoute,
      method,
      moduleName,
      file: path.basename(file),
    });
  }
}

const constantFiles = walk(constantsDir).filter(
  (f) => f.endsWith(".ts") && path.basename(f) !== "endpoints.ts",
);
const frontendConstants = [];
const allLeaves = [];

function parseConstantsFile(content) {
  const leaves = [];
  const stack = [];
  let i = 0;
  const n = content.length;

  function skipLineComment() {
    i += 2;
    while (i < n && content[i] !== "\n") {
      i++;
    }
  }

  function skipBlockComment() {
    i += 2;
    while (i < n) {
      if (content[i] === "*" && content[i + 1] === "/") {
        i += 2;
        return;
      }
      i++;
    }
  }

  function skipString(quote) {
    i++;
    while (i < n) {
      const c = content[i];
      if (c === "\\") {
        i += 2;
        continue;
      }
      if (c === quote) {
        i++;
        return;
      }
      i++;
    }
  }

  function skipTemplate() {
    i++;
    let out = "";
    while (i < n) {
      const c = content[i];
      if (c === "\\") {
        out += content[i + 1] || "";
        i += 2;
        continue;
      }
      if (c === "`") {
        i++;
        return out;
      }
      if (c === "$" && content[i + 1] === "{") {
        i += 2;
        let depth = 1;
        while (i < n && depth > 0) {
          const d = content[i];
          if (d === "`") {
            skipTemplate();
          } else if (d === '"' || d === "'") {
            skipString(d);
          } else if (d === "{") {
            depth++;
            i++;
          } else if (d === "}") {
            depth--;
            i++;
          } else {
            i++;
          }
        }
        out += "{param}";
        continue;
      }
      out += c;
      i++;
    }
    return out;
  }

  function addRoute(routes, val) {
    val = val.replace(/\$\{[^}]+\}/g, "{param}");
    if (val.includes("/") || val.length > 3) {
      if (!val.startsWith("/")) val = "/" + val;
      routes.push(val);
    }
  }

  function readLeafValue(name) {
    let depth = 0;
    const routes = [];
    while (i < n) {
      const c = content[i];
      if (c === "`") {
        addRoute(routes, skipTemplate());
        continue;
      }
      if (c === '"' || c === "'") {
        const s = i;
        skipString(c);
        addRoute(routes, content.slice(s + 1, i - 1));
        continue;
      }
      if (c === "(" || c === "[" || c === "{") {
        depth++;
        i++;
        continue;
      }
      if (c === ")" || c === "]") {
        depth--;
        i++;
        continue;
      }
      if (c === "}") {
        if (depth === 0) break;
        depth--;
        i++;
        continue;
      }
      if (c === "," && depth === 0) {
        i++;
        break;
      }
      i++;
    }
    leaves.push({ keyPath: stack.concat(name).join("."), routes });
  }

  while (i < n) {
    const c = content[i];
    if (
      c === " " ||
      c === "\n" ||
      c === "\t" ||
      c === "\r" ||
      c === "," ||
      c === ";"
    ) {
      i++;
      continue;
    }
    if (c === "`") {
      skipTemplate();
      continue;
    }
    if (c === "/" && content[i + 1] === "/") {
      skipLineComment();
      continue;
    }
    if (c === "/" && content[i + 1] === "*") {
      skipBlockComment();
      continue;
    }
    if (c === '"' || c === "'") {
      skipString(c);
      continue;
    }
    if (c === "}") {
      if (stack.length) stack.pop();
      i++;
      continue;
    }
    if (c === "{") {
      i++;
      continue;
    }

    const idMatch = /^[A-Za-z0-9_$]+/.exec(content.slice(i));
    if (idMatch) {
      const name = idMatch[0];
      let j = i + name.length;
      while (j < n && /\s/.test(content[j])) j++;
      if (content[j] === ":") {
        j++;
        while (j < n && /\s/.test(content[j])) j++;
        if (content[j] === "{") {
          stack.push(name);
          i = j + 1;
          continue;
        }
        i = j;
        readLeafValue(name);
        continue;
      }
      i += name.length;
      continue;
    }
    i++;
  }

  return leaves;
}

function qualifyLeafRoutes(fileName, leaf) {
  const routePrefixByLeafRoot = {
    "shared.endpoints.ts": {
      SelectItems: "select-items",
    },
  };

  const leafRoot = leaf.keyPath.split(".")[0];
  const routePrefix = routePrefixByLeafRoot[fileName]?.[leafRoot];

  if (!routePrefix) {
    return leaf;
  }

  return {
    ...leaf,
    routes: leaf.routes.map((route) => {
      const normalizedRoute = route.replace(/^\/+/, "");
      if (
        normalizedRoute.toLowerCase().startsWith(routePrefix.toLowerCase() + "/")
      ) {
        return route;
      }

      return `/${routePrefix}/${normalizedRoute}`;
    }),
  };
}

for (const file of constantFiles) {
  const content = fs.readFileSync(file, "utf8");
  const fileName = path.basename(file);
  const baseName = normalizeDomainName(fileName);
  const leaves = parseConstantsFile(content).map((leaf) => ({
    ...qualifyLeafRoutes(fileName, leaf),
    consumers: new Set(),
  }));

  for (const leaf of leaves) allLeaves.push(leaf);
  frontendConstants.push({ fileName, baseName, leaves });
}

const usages = [];

function normalizeUsageKeyPath(rawUsage) {
  return rawUsage
    .replace(/^Endpoints[A-Za-z0-9_$]*/, "")
    .replace(/\s+/g, "")
    .replace(/^\./, "")
    .replace(/\.+$/, "");
}

function pushUsage(keyPath, label) {
  if (!keyPath) return;

  usages.push({ keyPath, label });

  const parts = keyPath.split(".");
  if (parts.length > 2) {
    usages.push({ keyPath: parts.slice(1).join("."), label });
  }
}

function replaceLastKeySegment(keyPath, nextSegment) {
  const parts = keyPath.split(".");
  if (parts.length === 0) return keyPath;
  parts[parts.length - 1] = nextSegment;
  return parts.join(".");
}

function collectUsages(baseDir, labelFn) {
  const files = walk(baseDir).filter(
    (f) => f.endsWith(".ts") && !f.endsWith(".spec.ts"),
  );

  for (const file of files) {
    const content = fs.readFileSync(file, "utf8");
    const label = labelFn(path.relative(baseDir, file));
    const usageRegex =
      /Endpoints[A-Za-z0-9_$]*(?:\s*\.\s*[A-Za-z0-9_$]+)+/g;
    let match;
    while ((match = usageRegex.exec(content)) !== null) {
      pushUsage(normalizeUsageKeyPath(match[0]), label);
    }

    const submitCrudRegex = /FormHelper\.submitCrud\s*\(\s*\{([\s\S]*?)\}\s*\)/g;
    while ((match = submitCrudRegex.exec(content)) !== null) {
      const block = match[1];
      const endpointMatch = block.match(
        /endpoint\s*:\s*(Endpoints[A-Za-z0-9_$]*(?:\s*\.\s*[A-Za-z0-9_$]+)+)/,
      );

      if (!endpointMatch) continue;

      const endpointKeyPath = normalizeUsageKeyPath(endpointMatch[1]);
      const hasId = /\bid\s*:/.test(block);
      const methodMatch = block.match(/method\s*:\s*["'`](POST|PUT|PATCH)["'`]/i);
      const inferredMethod = methodMatch
        ? methodMatch[1].toUpperCase()
        : hasId
          ? "PUT"
          : "POST";
      const leafName = endpointKeyPath.split(".").pop() || "";

      if (inferredMethod === "POST" && /^(getAll|base)$/i.test(leafName)) {
        pushUsage(replaceLastKeySegment(endpointKeyPath, "create"), label);
      }

      if (
        (inferredMethod === "PUT" || inferredMethod === "PATCH") &&
        /^(create|getAll|base)$/i.test(leafName)
      ) {
        pushUsage(replaceLastKeySegment(endpointKeyPath, "update"), label);
      }
    }
  }
}

collectUsages(appsDir, (rel) => rel.split(path.sep)[0]);
collectUsages(coreDir, (rel) => "core/" + rel.split(path.sep)[0]);
collectUsages(sharedDir, (rel) => "shared/" + rel.split(path.sep)[0]);

for (const u of usages) {
  for (const leaf of allLeaves) {
    if (
      leaf.keyPath === u.keyPath ||
      leaf.keyPath.startsWith(u.keyPath + ".") ||
      u.keyPath.endsWith("." + leaf.keyPath)
    ) {
      leaf.consumers.add(u.label);
    }
  }
}

const groupedLines = {};

for (const be of backendEndpoints) {
  const searchRoute = be.route.replace(/\{[^}]+\}/g, "{param}").toLowerCase();
  let row = "";
  const matches = [];

  for (const fc of frontendConstants) {
    for (const leaf of fc.leaves) {
      for (const fcr of leaf.routes) {
        if (isRouteMatch(fcr, searchRoute)) {
          matches.push({
            fc,
            leaf,
            score:
              getRouteMatchScore(fcr, searchRoute) +
              getOperationKeyScore(leaf.keyPath, be.method, be.route) +
              getConstOwnershipScore(fc.baseName, be.moduleName) +
              getLeafMatchScore(leaf),
          });
        }
      }
    }
  }

  if (matches.length) {
    matches.sort((a, b) => b.score - a.score);
    const bestMatch = matches[0];
    const consumersSet = bestMatch.leaf.consumers;
    const consumers = consumersSet.size
      ? Array.from(consumersSet).sort().join(", ")
      : "Ninguno";

    const backBase = normalizeDomainName(be.moduleName);
    const constBase = bestMatch.fc.baseName;
    const routeUsageStatus = getRouteUsageStatus(consumersSet, constBase);
    const domainMatchStatus = getDomainMatchStatus(
      consumersSet,
      constBase,
      backBase,
    );

    const methodColors = {
      GET: "#61affe",
      POST: "#49cc90",
      PUT: "#fca130",
      DELETE: "#f93e3e",
      PATCH: "#50e3c2",
    };
    const mColor = methodColors[be.method] || "#000";
    const styledMethod = `<strong style="color: ${mColor}">${be.method}</strong>`;

    row = `<tr><td>${bestMatch.fc.fileName} &gt; ${bestMatch.leaf.keyPath}</td><td>${consumers}</td><td>${be.moduleName}</td><td>${styledMethod} ${be.route}</td><td>${routeUsageStatus}</td><td>${domainMatchStatus}</td></tr>`;
  } else {
    const methodColors = {
      GET: "#61affe",
      POST: "#49cc90",
      PUT: "#fca130",
      DELETE: "#f93e3e",
      PATCH: "#50e3c2",
    };
    const mColor = methodColors[be.method] || "#000";
    const styledMethod = `<strong style="color: ${mColor}">${be.method}</strong>`;
    row = `<tr><td><em>No encontrado</em></td><td><em>Ninguno</em></td><td>${be.moduleName}</td><td>${styledMethod} ${be.route}</td><td>${renderStatusBadge("error", "Solo backend")}</td><td>${renderStatusBadge("warn", "Sin constante frontend")}</td></tr>`;
  }

  const normalizedBaseRoute = normalizeRouteForMatch(be.baseRoute || be.route);
  const normalizedFullRoute = normalizeRouteForMatch(be.route);
  const group = normalizedBaseRoute || normalizedFullRoute || "unknown";

  if (!groupedLines[group]) {
    groupedLines[group] = [];
  }
  groupedLines[group].push(row);
}

const reportLines = [];
reportLines.push(`# Radiografía de Endpoints (Punta a Punta)`);
reportLines.push(`<style>
table.radiography-table { width: 100%; table-layout: fixed; border-collapse: collapse; }
table.radiography-table th, table.radiography-table td { border: 1px solid #d0d7de; padding: 6px 8px; vertical-align: top; word-wrap: break-word; overflow-wrap: anywhere; }
table.radiography-table th { background: #f6f8fa; text-align: left; }
.status-badge { display: inline-flex; align-items: center; gap: 6px; padding: 2px 8px; border-radius: 999px; font-size: 12px; font-weight: 600; line-height: 1.4; }
.status-dot { width: 8px; height: 8px; border-radius: 999px; display: inline-block; flex: 0 0 auto; }
.status-ok { background: #ecfdf3; color: #027a48; border: 1px solid #abefc6; }
.status-ok .status-dot { background: #12b76a; }
.status-warn { background: #fffaeb; color: #b54708; border: 1px solid #fedf89; }
.status-warn .status-dot { background: #f79009; }
.status-error { background: #fef3f2; color: #b42318; border: 1px solid #fecdca; }
.status-error .status-dot { background: #f04438; }
</style>`);

const groupKeys = Object.keys(groupedLines);

groupKeys.sort((a, b) => {
  const aHasIssues = groupedLines[a].some(
    (row) => row.includes("status-error") || row.includes("status-warn"),
  );
  const bHasIssues = groupedLines[b].some(
    (row) => row.includes("status-error") || row.includes("status-warn"),
  );

  if (aHasIssues && !bHasIssues) return -1;
  if (!aHasIssues && bHasIssues) return 1;

  return a.localeCompare(b);
});

for (const group of groupKeys) {
  const groupLabel = group.replace(/^\//, "");
  const groupPath = group.startsWith("/") ? group : `/${group}`;
  const prettyGroup = groupLabel
    .split("-")
    .join(" ")
    .split("/")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  reportLines.push(`\n## ${prettyGroup} (${groupPath})`);
  reportLines.push(`<table class="radiography-table">`);
  reportLines.push(`<colgroup>
  <col style="width: 22%">
  <col style="width: 18%">
  <col style="width: 14%">
  <col style="width: 28%">
  <col style="width: 9%">
  <col style="width: 9%">
</colgroup>`);
  reportLines.push(`<thead><tr><th>Front Constant &gt; KeyPath</th><th>Front Consumer(s)</th><th>Api Module (Backend)</th><th>EndPoint</th><th>Match de Ruta</th><th>Match de Dominio</th></tr></thead>`);
  reportLines.push(`<tbody>`);
  reportLines.push(...groupedLines[group]);
  reportLines.push(`</tbody></table>`);
}

const outputPath = path.join(__dirname, "endpoint-radiography.md");
fs.writeFileSync(outputPath, reportLines.join("\n"), "utf8");
console.log("Report generated at " + outputPath);
