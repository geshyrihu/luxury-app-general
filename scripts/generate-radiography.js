const fs = require('fs');
const path = require('path');

const angularDir = path.join(__dirname, 'client', 'angular', 'src', 'app');
const appsDir = path.join(angularDir, 'apps');
const constantsDir = path.join(angularDir, 'core', 'constants');
const backendDir = path.join(__dirname, 'api', 'LuxuryApp.Application');

// Helper to walk directories
function walk(dir, fileList = []) {
    if (!fs.existsSync(dir)) return fileList;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const stat = fs.statSync(path.join(dir, file));
        if (stat.isDirectory()) {
            walk(path.join(dir, file), fileList);
        } else {
            fileList.push(path.join(dir, file));
        }
    }
    return fileList;
}

// 1. Parse Backend Endpoints
const backendFiles = walk(backendDir).filter(f => f.endsWith('Endpoints.cs') || f.endsWith('Controller.cs'));
const backendEndpoints = []; // { route, method, moduleName, file }

for (const file of backendFiles) {
    const content = fs.readFileSync(file, 'utf8');
    // Extract module name (first folder after LuxuryApp.Application)
    const relPath = path.relative(backendDir, file);
    const moduleName = relPath.split(path.sep)[0];
    
    // We also need to find the base route if it's a group
    let baseRoute = "";
    const groupMatch = content.match(/MapGroup\(\s*"([^"]+)"\s*\)/);
    if (groupMatch) {
        baseRoute = groupMatch[1];
    } else {
        const controllerRoute = content.match(/\[Route\(\s*"([^"]+)"\s*\)\]/);
        if (controllerRoute) baseRoute = controllerRoute[1];
    }
    
    // Find all MapGet, MapPost, etc.
    const regex = /(MapGet|MapPost|MapPut|MapDelete|MapPatch|HttpGet|HttpPost|HttpPut|HttpDelete|HttpPatch)\s*\(\s*(?:"([^"]*)")?/g;
    let match;
    while ((match = regex.exec(content)) !== null) {
        let method = match[1].replace('Map', '').replace('Http', '').toUpperCase();
        let subRoute = match[2] || "";
        let fullRoute = baseRoute;
        if (subRoute) {
            fullRoute = fullRoute ? `${fullRoute}/${subRoute}` : subRoute;
        }
        
        // Clean up route slashes
        fullRoute = fullRoute.replace(/\/+/g, '/');
        if (!fullRoute.startsWith('/')) fullRoute = '/' + fullRoute;
        // In this app, many endpoints might be implicitly under /api, but let's just log what we found
        
        backendEndpoints.push({
            route: fullRoute,
            method: method,
            moduleName: moduleName,
            file: path.basename(file)
        });
    }
}

// 2. Parse Frontend Constants
const constantFiles = walk(constantsDir).filter(f => f.endsWith('.ts'));
const frontendConstants = []; // { fileName, routeStrings: [] }

for (const file of constantFiles) {
    const content = fs.readFileSync(file, 'utf8');
    const fileName = path.basename(file);
    const routeStrings = [];
    
    // Match string literals and template literals
    const strRegex = /(?:['"`])([^'"`\n]+)(?:['"`])/g;
    let match;
    while ((match = strRegex.exec(content)) !== null) {
        let val = match[1];
        // Replace ${...} with {param} or just ignore it for matching
        val = val.replace(/\$\{[^}]+\}/g, '{param}');
        if (val.includes('/') || val.length > 3) {
            if (!val.startsWith('/')) val = '/' + val;
            routeStrings.push(val);
        }
    }
    frontendConstants.push({ fileName, routeStrings });
}

// 3. Map Constants to Frontend Apps
// For each app, find which constant files it imports
const frontendAppsFiles = walk(appsDir).filter(f => f.endsWith('.ts'));
const constantUsageByApp = {}; // { constantFileName: Set of app names }

for (const file of frontendAppsFiles) {
    const content = fs.readFileSync(file, 'utf8');
    const relPath = path.relative(appsDir, file);
    const appName = relPath.split(path.sep)[0]; // e.g., admin.luxuryapp
    const frontModule = relPath.split(path.sep)[1] || ''; // e.g., bank
    
    for (const c of frontendConstants) {
        const importName = c.fileName.replace('.ts', '');
        if (content.includes(importName) || content.includes(c.fileName)) {
            if (!constantUsageByApp[c.fileName]) {
                constantUsageByApp[c.fileName] = new Set();
            }
            constantUsageByApp[c.fileName].add(`${appName} (${frontModule})`);
        }
    }
}

// 4. Cross Reference
const reportLines = [];
reportLines.push(`# Endpoints Radiography`);
reportLines.push(`| Front Constant File | Front App (Module) | Api Module (Backend) | EndPoint | Hace Match? |`);
reportLines.push(`|---------------------|--------------------|----------------------|----------|-------------|`);

for (const be of backendEndpoints) {
    // Try to find if this route exists in any frontend constant
    let foundInFront = false;
    // Replace {id} with {param} to match our parsed frontend constants
    const searchRoute = be.route.replace(/\{[^}]+\}/g, '{param}').toLowerCase();
    
    for (const fc of frontendConstants) {
        for (const fcr of fc.routeStrings) {
            const normalizedFcr = fcr.toLowerCase();
            // simple inclusion match due to prefixes like /api/
            if (normalizedFcr.includes(searchRoute) || searchRoute.includes(normalizedFcr)) {
                foundInFront = true;
                
                // Where is it consumed?
                const consumers = constantUsageByApp[fc.fileName] ? Array.from(constantUsageByApp[fc.fileName]).join(', ') : 'None?';
                
                // Match logic
                // Does Front App name relate to Api Module name?
                // Example: admin.luxuryapp -> AdminLuxuryApp
                let isMatch = false;
                if (consumers !== 'None?') {
                    const firstConsumerApp = consumers.split(' ')[0].toLowerCase().replace('.luxuryapp', '');
                    const backendModLower = be.moduleName.toLowerCase().replace('luxuryapp', '');
                    if (firstConsumerApp === backendModLower || firstConsumerApp.includes(backendModLower) || backendModLower.includes(firstConsumerApp)) {
                        isMatch = true;
                    }
                }
                
                const matchStr = isMatch ? '✅ Sí' : '❌ No (Revisar)';
                
                reportLines.push(`| ${fc.fileName} | ${consumers} | ${be.moduleName} | ${be.method} ${be.route} | ${matchStr} |`);
                break; // stop finding constants for this specific endpoint mapping, move to next
            }
        }
    }
    
    if (!foundInFront) {
        reportLines.push(`| *No encontrado* | *Ninguno* | ${be.moduleName} | ${be.method} ${be.route} | ⚠️ Solo en Backend |`);
    }
}

const outputPath = path.join(__dirname, 'endpoint-radiography.md');
fs.writeFileSync(outputPath, reportLines.join('\n'), 'utf8');
console.log('Report generated at ' + outputPath);
