import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..', 'client', 'angular', 'src', 'app');

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

const allTsFiles = walk(rootDir).filter(f => f.endsWith('.ts'));
const filesToScan = allTsFiles.filter(f => !f.includes(path.join('core', 'constants')));

let totalIssues = 0;
const findings = [];

// Regex to catch things like: .get('url'), .post<Type>(`url`), etc.
// \. (get|post|put|patch|delete|getFile|postFile|getFileFromFullUrl) 
// (?:<[^>]+>)? matches optional generic types like <ApiResponseDto<T>> (might be nested, but regex handles simple ones, or we just rely on matching till parenthesis)
// Actually regex for nested generics is hard, let's just look for HTTP calls followed by parenthesis and then a quote.
// A more robust regex: \.(?:get|post|put|patch|delete|getFile|postFile)\s*(?:<[^>]*>)*\s*\(\s*(['"`])
// But to handle complex generics, maybe just search for `\.(get|post|put|patch|delete|getFile|postFile)` and then read forward until `(`?
// Even simpler: match any `environment.API_BASE_URL` since that's a huge code smell if used directly in services to build URLs instead of endpoints.
// And match string literals containing `api/` or `/api/` in arguments.

for (const file of filesToScan) {
    const content = fs.readFileSync(file, 'utf8');
    const relPath = path.relative(rootDir, file);
    let fileIssues = [];

    // 1. Direct use of API_BASE_URL (which usually means hardcoding paths)
    // We exclude environment.ts which is outside 'app' anyway.
    // Also exclude api-response.service.ts which has one valid declaration.
    if (!relPath.endsWith('api-response.service.ts') && !relPath.endsWith('data-connector.service.ts')) {
        // Exclude lines that correctly combine API_BASE_URL with Endpoints
        const matches = [...content.matchAll(/environment\.API_BASE_URL/g)];
        for (const match of matches) {
            // Check if the characters immediately following are `${Endpoints.`
            const following = content.substring(match.index + 'environment.API_BASE_URL'.length, match.index + 'environment.API_BASE_URL'.length + 12);
            if (following !== '${Endpoints.') {
                const line = content.substring(0, match.index).split('\n').length;
                fileIssues.push(`Línea ${line}: Uso directo de environment.API_BASE_URL detectado (sin uso de Endpoints).`);
            }
        }
    }

    // 2. Look for HTTP calls with string literals as the first argument
    // E.g. this.http.get('...') or dataConnectorS.post(`...`)
    const lines = content.split('\n');
    for (let i = 0; i < lines.length; i++) {
        const lineStr = lines[i];
        
        // This regex looks for common http call methods specifically on this.http or dataConnector services
        const hardcodedHttpRegex = /this\.(?:http|dataConnectorS|dataConnectorService)\.(?:get|post|put|patch|delete|getFile|postFile)\s*(?:<[^>]+>)?\s*\(\s*(['"`])/;
        if (hardcodedHttpRegex.test(lineStr)) {
            // Skip api-response.service itself since it handles external or generic urls
            if (!relPath.endsWith('api-response.service.ts')) {
                fileIssues.push(`Línea ${i + 1}: Llamada HTTP con string literal detectada: ${lineStr.trim().substring(0, 80)}...`);
            }
        }
    }

    if (fileIssues.length > 0) {
        findings.push({ file: relPath, issues: fileIssues });
        totalIssues += fileIssues.length;
    }
}

console.log("=================================================");
console.log("🔎 REPORTE DE RUTAS HARDCODEADAS EN EL FRONTEND");
console.log("=================================================\n");

if (totalIssues === 0) {
    console.log("✅ ¡Excelente! No se encontraron rutas hardcodeadas ni llamadas HTTP directas sospechosas.");
} else {
    console.log(`⚠️ Se encontraron ${totalIssues} posibles incidencias en ${findings.length} archivos:\n`);
    for (const finding of findings) {
        console.log(`📄 ${finding.file}`);
        for (const issue of finding.issues) {
            console.log(`   - ${issue}`);
        }
        console.log("");
    }
}
