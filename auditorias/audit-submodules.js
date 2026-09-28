const fs = require('fs');
const path = require('path');

const BACKEND_ROOT = 'D:\\repos\\luxuryapp-api\\api\\LuxuryApp.Application\\Modules';
const FRONTEND_ROOT = 'D:\\repos\\luxuryapp-api\\appsweb\\angular\\src\\app\\apps';
const OUTPUT_PATH = 'D:\\repos\\luxuryapp-api\\auditorias\\auditoria-submodulos.md';

function getBackendStructure(root) {
    const result = {};
    if (!fs.existsSync(root)) return result;
    
    const moduleDirs = fs.readdirSync(root, { withFileTypes: true })
        .filter(d => d.isDirectory() && d.name !== 'SharedLuxuryApp');
    
    for (const module of moduleDirs) {
        const moduleName = module.name;
        const submodules = {};
        const modulePath = path.join(root, moduleName);
        
        const subDirs = fs.readdirSync(modulePath, { withFileTypes: true })
            .filter(d => d.isDirectory() && d.name !== 'Docs');
        
        for (const sub of subDirs) {
            const submoduleName = sub.name;
            const structure = {
                path: path.join(modulePath, submoduleName),
                entities: [], dtos: [], services: [], endPoints: [],
                subServices: [], helpers: [], mappings: [], persistence: [], other: []
            };
            
            const subPath = path.join(modulePath, submoduleName);
            
            function scanCs(dir, category) {
                if (!fs.existsSync(dir)) return;
                const files = fs.readdirSync(dir, { withFileTypes: true })
                    .filter(f => f.isFile() && f.name.endsWith('.cs'));
                structure[category].push(...files.map(f => f.name));
            }
            
            scanCs(path.join(subPath, 'Entities'), 'entities');
            scanCs(path.join(subPath, 'DTOs'), 'dtos');
            scanCs(path.join(subPath, 'Services'), 'services');
            scanCs(path.join(subPath, 'EndPoints'), 'endPoints');
            scanCs(path.join(subPath, 'SubServices'), 'subServices');
            scanCs(path.join(subPath, 'Helpers'), 'helpers');
            scanCs(path.join(subPath, 'Mappings'), 'mappings');
            scanCs(path.join(subPath, 'Persistence'), 'persistence');
            
            // Other CS files not in standard folders
            function findOtherCs(dir, base) {
                if (!fs.existsSync(dir)) return;
                const entries = fs.readdirSync(dir, { withFileTypes: true });
                for (const entry of entries) {
                    if (entry.name === 'Docs') continue;
                    const fullPath = path.join(dir, entry.name);
                    if (entry.isDirectory()) {
                        findOtherCs(fullPath, base);
                    } else if (entry.isFile() && entry.name.endsWith('.cs')) {
                        const relative = path.relative(base, fullPath);
                        const parts = relative.split(path.sep);
                        if (parts.length >= 2 && !['Entities','DTOs','Services','EndPoints','SubServices','Helpers','Mappings','Persistence'].includes(parts[1])) {
                            structure.other.push(entry.name);
                        }
                    }
                }
            }
            findOtherCs(subPath, subPath);
            
            submodules[submoduleName] = structure;
        }
        result[moduleName] = submodules;
    }
    return result;
}

function getFrontendStructure(root) {
    const result = {};
    if (!fs.existsSync(root)) return result;
    
    const moduleDirs = fs.readdirSync(root, { withFileTypes: true })
        .filter(d => d.isDirectory() && !d.name.startsWith('shared'));
    
    for (const module of moduleDirs) {
        const moduleName = module.name;
        const submodules = {};
        const modulePath = path.join(root, moduleName);
        
        const subDirs = fs.readdirSync(modulePath, { withFileTypes: true })
            .filter(d => d.isDirectory() && 
                !d.name.includes('shared') && 
                !d.name.includes('shell') && 
                d.name !== 'docs');
        
        for (const sub of subDirs) {
            const submoduleName = sub.name;
            const structure = {
                path: path.join(modulePath, submoduleName),
                components: [], desktop: [], mobile: [], interfaces: [],
                services: [], subServices: [], helpers: [], pipes: [], other: []
            };
            
            const subPath = path.join(modulePath, submoduleName);
            
            // Components (direct .ts files in root)
            const rootFiles = fs.readdirSync(subPath, { withFileTypes: true })
                .filter(f => f.isFile() && f.name.endsWith('.ts') && 
                    !f.name.includes('desktop') && !f.name.includes('mobile') &&
                    !f.name.endsWith('.interface.ts') && !f.name.endsWith('.service.ts') &&
                    !f.name.endsWith('.pipe.ts') && !f.name.endsWith('.spec.ts'));
            structure.components.push(...rootFiles.map(f => f.name));
            
            function scanTs(dir, category, pattern, baseDir) {
                if (!fs.existsSync(dir)) return;
                const files = fs.readdirSync(dir, { withFileTypes: true })
                    .filter(f => f.isFile() && f.name.endsWith('.ts'));
                structure[category].push(...files.map(f => f.name));
            }
            
            scanTs(subPath, 'desktop', '*desktop.ts');
            scanTs(path.join(subPath, 'desktop'), 'desktop');
            scanTs(subPath, 'mobile', '*mobile.ts');
            scanTs(path.join(subPath, 'mobile'), 'mobile');
            scanTs(path.join(subPath, 'interfaces'), 'interfaces');
            scanTs(subPath, 'services', '*.service.ts');
            scanTs(path.join(subPath, 'sub-services'), 'subServices');
            scanTs(path.join(subPath, 'helpers'), 'helpers');
            scanTs(subPath, 'pipes', '*.pipe.ts');
            
            submodules[submoduleName] = structure;
        }
        result[moduleName] = submodules;
    }
    return result;
}

function findViolations(data) {
    const violations = {};
    const allSubmodules = {};
    
    for (const module of Object.keys(data)) {
        for (const submodule of Object.keys(data[module])) {
            if (allSubmodules[submodule]) {
                if (!violations[submodule]) violations[submodule] = [];
                violations[submodule].push(allSubmodules[submodule]);
                violations[submodule].push(module);
            } else {
                allSubmodules[submodule] = module;
            }
        }
    }
    return violations;
}

function generateReport(backendData, frontendData, backendViolations, frontendViolations) {
    const date = new Date().toISOString().slice(0, 16).replace('T', ' ');
    const lines = [];
    
    lines.push('# Auditoria de Submodulos - LuxuryApp');
    lines.push('');
    lines.push('**Fecha:** ' + date);
    lines.push('**Regla:** Un submódulo vive en un único módulo padre (2.2 CONVENTIONSFOLDER.MD)');
    lines.push('');
    lines.push('---');
    lines.push('');
    
    // Backend Summary
    lines.push('## Backend - Resumen');
    lines.push('');
    lines.push('**Ruta:** `' + BACKEND_ROOT + '`');
    lines.push('');
    lines.push('| Modulo | Submodulos | Total |');
    lines.push('|--------|-----------|-------|');
    for (const module of Object.keys(backendData).sort()) {
        const count = Object.keys(backendData[module]).length;
        const subs = Object.keys(backendData[module]).sort().join(', ');
        lines.push('| ' + module + ' | ' + subs + ' | ' + count + ' |');
    }
    lines.push('');
    
    // Frontend Summary
    lines.push('## Frontend - Resumen');
    lines.push('');
    lines.push('**Ruta:** `' + FRONTEND_ROOT + '`');
    lines.push('');
    lines.push('| Modulo | Submodulos | Total |');
    lines.push('|--------|-----------|-------|');
    for (const module of Object.keys(frontendData).sort()) {
        const count = Object.keys(frontendData[module]).length;
        const subs = Object.keys(frontendData[module]).sort().join(', ');
        lines.push('| ' + module + ' | ' + subs + ' | ' + count + ' |');
    }
    lines.push('');
    
    // Backend Violations
    lines.push('## Backend - Violaciones Detectadas');
    lines.push('');
    if (Object.keys(backendViolations).length === 0) {
        lines.push('✅ No se detectaron violaciones. Cada submódulo aparece en un único módulo.');
    } else {
        lines.push('⚠️ **Se detectaron ' + Object.keys(backendViolations).length + ' submódulos repetidos:**');
        lines.push('');
        for (const submodule of Object.keys(backendViolations).sort()) {
            const modules = backendViolations[submodule].join(', ');
            lines.push('- **' + submodule + '** aparece en: ' + modules);
        }
        lines.push('');
    }
    lines.push('');
    
    // Frontend Violations
    lines.push('## Frontend - Violaciones Detectadas');
    lines.push('');
    if (Object.keys(frontendViolations).length === 0) {
        lines.push('✅ No se detectaron violaciones. Cada submódulo aparece en un único módulo.');
    } else {
        lines.push('⚠️ **Se detectaron ' + Object.keys(frontendViolations).length + ' submódulos repetidos:**');
        lines.push('');
        for (const submodule of Object.keys(frontendViolations).sort()) {
            const modules = frontendViolations[submodule].join(', ');
            lines.push('- **' + submodule + '** aparece en: ' + modules);
        }
        lines.push('');
    }
    lines.push('');
    
    // Detailed Backend Structure
    lines.push('## Backend - Estructura Detallada por Modulo');
    lines.push('');
    for (const module of Object.keys(backendData).sort()) {
        lines.push('### ' + module);
        lines.push('');
        lines.push('```');
        lines.push(BACKEND_ROOT + '\\' + module + '/');
        for (const submodule of Object.keys(backendData[module]).sort()) {
            lines.push('|-- ' + submodule + '/');
            const struct = backendData[module][submodule];
            if (struct.entities.length > 0) lines.push('|   |-- Entities/ (' + struct.entities.length + ' archivos)');
            if (struct.dtos.length > 0) lines.push('|   |-- DTOs/ (' + struct.dtos.length + ' archivos)');
            if (struct.services.length > 0) lines.push('|   |-- Services/ (' + struct.services.length + ' archivos)');
            if (struct.endPoints.length > 0) lines.push('|   |-- EndPoints/ (' + struct.endPoints.length + ' archivos)');
            if (struct.subServices.length > 0) lines.push('|   |-- SubServices/ (' + struct.subServices.length + ' archivos)');
            if (struct.helpers.length > 0) lines.push('|   |-- Helpers/ (' + struct.helpers.length + ' archivos)');
            if (struct.mappings.length > 0) lines.push('|   |-- Mappings/ (' + struct.mappings.length + ' archivos)');
            if (struct.persistence.length > 0) lines.push('|   |-- Persistence/ (' + struct.persistence.length + ' archivos)');
            if (struct.other.length > 0) lines.push('|   |-- Other/ (' + struct.other.length + ' archivos)');
        }
        lines.push('```');
        lines.push('');
    }
    
    // Detailed Frontend Structure
    lines.push('## Frontend - Estructura Detallada por Modulo');
    lines.push('');
    for (const module of Object.keys(frontendData).sort()) {
        lines.push('### ' + module);
        lines.push('');
        lines.push('```');
        lines.push(FRONTEND_ROOT + '\\' + module + '/');
        for (const submodule of Object.keys(frontendData[module]).sort()) {
            lines.push('|-- ' + submodule + '/');
            const struct = frontendData[module][submodule];
            if (struct.components.length > 0) lines.push('|   |-- Components/ (' + struct.components.length + ' archivos)');
            if (struct.desktop.length > 0) lines.push('|   |-- Desktop/ (' + struct.desktop.length + ' archivos)');
            if (struct.mobile.length > 0) lines.push('|   |-- Mobile/ (' + struct.mobile.length + ' archivos)');
            if (struct.interfaces.length > 0) lines.push('|   |-- Interfaces/ (' + struct.interfaces.length + ' archivos)');
            if (struct.services.length > 0) lines.push('|   |-- Services/ (' + struct.services.length + ' archivos)');
            if (struct.subServices.length > 0) lines.push('|   |-- SubServices/ (' + struct.subServices.length + ' archivos)');
            if (struct.helpers.length > 0) lines.push('|   |-- Helpers/ (' + struct.helpers.length + ' archivos)');
            if (struct.pipes.length > 0) lines.push('|   |-- Pipes/ (' + struct.pipes.length + ' archivos)');
            if (struct.other.length > 0) lines.push('|   |-- Other/ (' + struct.other.length + ' archivos)');
        }
        lines.push('```');
        lines.push('');
    }
    
    // File listings per submodule
    lines.push('## Backend - Archivos por Submodulo');
    lines.push('');
    for (const module of Object.keys(backendData).sort()) {
        for (const submodule of Object.keys(backendData[module]).sort()) {
            lines.push('### ' + module + '/' + submodule);
            lines.push('');
            const struct = backendData[module][submodule];
            if (struct.entities.length > 0) { lines.push('**Entities:** ' + struct.entities.join(', ')); lines.push(''); }
            if (struct.dtos.length > 0) { lines.push('**DTOs:** ' + struct.dtos.join(', ')); lines.push(''); }
            if (struct.services.length > 0) { lines.push('**Services:** ' + struct.services.join(', ')); lines.push(''); }
            if (struct.endPoints.length > 0) { lines.push('**EndPoints:** ' + struct.endPoints.join(', ')); lines.push(''); }
            if (struct.subServices.length > 0) { lines.push('**SubServices:** ' + struct.subServices.join(', ')); lines.push(''); }
            if (struct.helpers.length > 0) { lines.push('**Helpers:** ' + struct.helpers.join(', ')); lines.push(''); }
            if (struct.mappings.length > 0) { lines.push('**Mappings:** ' + struct.mappings.join(', ')); lines.push(''); }
            if (struct.persistence.length > 0) { lines.push('**Persistence:** ' + struct.persistence.join(', ')); lines.push(''); }
            if (struct.other.length > 0) { lines.push('**Other:** ' + struct.other.join(', ')); lines.push(''); }
        }
    }
    
    lines.push('## Frontend - Archivos por Submodulo');
    lines.push('');
    for (const module of Object.keys(frontendData).sort()) {
        for (const submodule of Object.keys(frontendData[module]).sort()) {
            lines.push('### ' + module + '/' + submodule);
            lines.push('');
            const struct = frontendData[module][submodule];
            if (struct.components.length > 0) { lines.push('**Components:** ' + struct.components.join(', ')); lines.push(''); }
            if (struct.desktop.length > 0) { lines.push('**Desktop:** ' + struct.desktop.join(', ')); lines.push(''); }
            if (struct.mobile.length > 0) { lines.push('**Mobile:** ' + struct.mobile.join(', ')); lines.push(''); }
            if (struct.interfaces.length > 0) { lines.push('**Interfaces:** ' + struct.interfaces.join(', ')); lines.push(''); }
            if (struct.services.length > 0) { lines.push('**Services:** ' + struct.services.join(', ')); lines.push(''); }
            if (struct.subServices.length > 0) { lines.push('**SubServices:** ' + struct.subServices.join(', ')); lines.push(''); }
            if (struct.helpers.length > 0) { lines.push('**Helpers:** ' + struct.helpers.join(', ')); lines.push(''); }
            if (struct.pipes.length > 0) { lines.push('**Pipes:** ' + struct.pipes.join(', ')); lines.push(''); }
            if (struct.other.length > 0) { lines.push('**Other:** ' + struct.other.join(', ')); lines.push(''); }
        }
    }
    
    // Recommendations
    lines.push('## Recomendaciones');
    lines.push('');
    const totalViolations = Object.keys(backendViolations).length + Object.keys(frontendViolations).length;
    if (totalViolations === 0) {
        lines.push('✅ La estructura cumple con la regla de submódulos únicos por módulo.');
    } else {
        lines.push('Se detectaron ' + totalViolations + ' violaciones de la regla 2.2.');
        lines.push('');
        lines.push('### Acciones correctivas sugeridas');
        lines.push('');
        lines.push('1. **Renombrar submódulos duplicados:** Cada submódulo debe tener un nombre único dentro de su módulo padre.');
        lines.push('2. **Actualizar namespaces:** Los namespaces deben reflejar la nueva ruta física.');
        lines.push('3. **Actualizar imports:** Revisar todos los imports en el código afectado.');
        lines.push('4. **Actualizar rutas frontend:** Verificar rutas de módulos y componentes.');
        lines.push('5. **Actualizar documentación:** Reflejar los cambios en README.md y documentación del módulo.');
    }
    lines.push('');
    
    lines.push('---');
    lines.push('*Generado automaticamente por auditoria de submódulos*');
    
    const report = lines.join('\n');
    const folder = path.dirname(OUTPUT_PATH);
    if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder, { recursive: true });
    }
    fs.writeFileSync(OUTPUT_PATH, report, 'utf8');
    return OUTPUT_PATH;
}

console.log('🔍 Escaneando estructura Backend...');
const backendData = getBackendStructure(BACKEND_ROOT);
console.log('   Encontrados ' + Object.keys(backendData).length + ' modulos');

console.log('🔍 Escaneando estructura Frontend...');
const frontendData = getFrontendStructure(FRONTEND_ROOT);
console.log('   Encontrados ' + Object.keys(frontendData).length + ' modulos');

console.log('🔎 Buscando violaciones en Backend...');
const backendViolations = findViolations(backendData);
console.log('   Encontradas ' + Object.keys(backendViolations).length + ' violaciones');

console.log('🔎 Buscando violaciones en Frontend...');
const frontendViolations = findViolations(frontendData);
console.log('   Encontradas ' + Object.keys(frontendViolations).length + ' violaciones');

console.log('📝 Generando reporte Markdown...');
const reportPath = generateReport(backendData, frontendData, backendViolations, frontendViolations);
console.log('✅ Reporte generado en: ' + reportPath);
console.log('');

if (Object.keys(backendViolations).length > 0 || Object.keys(frontendViolations).length > 0) {
    console.log('⚠️  VIOLACIONES DETECTADAS:');
    if (Object.keys(backendViolations).length > 0) {
        console.log('   Backend:');
        for (const v of Object.keys(backendViolations).sort()) {
            console.log('   - ' + v + ' : ' + backendViolations[v].join(', '));
        }
    }
    if (Object.keys(frontendViolations).length > 0) {
        console.log('   Frontend:');
        for (const v of Object.keys(frontendViolations).sort()) {
            console.log('   - ' + v + ' : ' + frontendViolations[v].join(', '));
        }
    }
} else {
    console.log('✅ No se detectaron violaciones. La estructura cumple con la regla.');
}
