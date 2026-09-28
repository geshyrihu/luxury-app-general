#!/usr/bin/env node
/**
 * Verifica que los archivos de configuración de agentes NO contengan reglas hardcodeadas
 * fuera de CONVENTIONS.md. Deben solo referenciar CONVENTIONS.md y skills/.
 */
import fs from "fs";
import path from "path";

const ROOT = "D:\\\\repos\\\\luxuryapp-api";

// Archivos de agentes a verificar
const AGENT_FILES = [
  "AGENTS.md",           // Kilo
  "CLAUDE.md",           // Claude Code
  ".cursor/rules.md",    // Cursor
  ".codex/AGENTS.md",    // Codex
  ".antigravity/AGENTS.md", // Antigravity
];

// Patrones que SÍ son reglas hardcodeadas (no referencias a herramientas)
const HARDCODED_RULES = [
  // Frontend Angular - reglas específicas
  /standalone\s*:\s*true\b/gi,
  /\b@if\s|\b@for\s|\b@switch\b/gi,
  /\bsignal\(\)/gi,
  /ChangeDetectionStrategy\.OnPush/gi,
  /\b@defer\b/gi,
  /\bNgOptimizedImage\b/gi,
  /custom-table\s+card\s+hidden\s+md:block/gi,
  /\bTableScrollHeightService\b/gi,
  /\bglobalFilterFields\(\)/gi,
  /\btablePrimeNgRows\(\)/gi,
  /\browsPerPageOptions\(\)/gi,
  /\bFormHelper\.submitCrud\(\)/gi,
  /\bstrict\s*:\s*true\b/gi,
  /\bprohibido\s+any\b/gi,
  /@Input\(\)|@Output\(\)|@ViewChild\(\)/gi,
  /\binput\(\)|\boutput\(\)|\bmodel\(\)/gi,
  /\balias\s+@core\b/gi,
  /\bloadComponent\b.*\bcanActivate\b/gi,
  /\bp-datepicker\b|\bp-calendar\b/gi,
  /\bFlatpickr\b/gi,
  /\bnonNullable\s*:\s*true\b/gi,
  /\bFormGroup\.addValidators\(\)/gi,
  /\bpipes.*standalone/gi,
  /\bDateService\b|\bEnumSelectService\b|\bStorageService\b|\bTableScrollHeightService\b/gi,
  /\bDialogHandlerService\b/gi,
  /\bSelectItemController\b/gi,
  /\bpdfmake\b|\bPdfGeneratorService\b/gi,
  /\bheaderCompany\b|\bheaderClient\b/gi,
  /\bcreateTable\(\)/gi,
  /\breplaceUrl\s*:\s*true\b/gi,
  // API Access
  /\bApiResponseService\b/gi,
  /\bonGetList\b|\bonGetPaged\b|\bonGetItem\b|\bonPost\b|\bonPut\b|\bonPatch\b|\bonDelete\b/gi,
  /\bkebab-case.*minúsculas/gi,
  /\bPaginationStore\b/gi,
  /\bpageSize\b|\blimit\b|\bsort\b|\border\b|\bsearch\b/gi,
  /\bpagination\./gi,
  // UX/UI
  /\bp-table\b.*\bvirtual scrolling\b/gi,
  /\bp-dialog\b.*\bp-drawer\b/gi,
  /\bion-infinite-scroll\b|\bion-refresher\b|\bion-item-sliding\b/gi,
  /\bFAB\b.*\bthumb zone\b/gi,
  /\bDynamicDialog\b.*\bmobile\b/gi,
  // Backend .NET
  /\bMinimal APIs\b.*\bAddOpenApi\b/gi,
  /\bMapGroup\b.*\bkebab-case\b/gi,
  /\bApiResponseDTO\b.*\bProblemDetails\b/gi,
  /\bAsp\.Versioning\b/gi,
  /\bPrimary Constructors\b/gi,
  /\brecord\b.*\bDTO\b/gi,
  /\bDisplay\(Name/gi,
  /\benum\b.*\bstring\b.*\bBD\b/gi,
  /\bSource Generators\b.*\bJsonSerializable\b/gi,
  /\bHybridCache\b/gi,
  /\bTimeProvider\b/gi,
  /\bAsNoTracking\b/gi,
  /\bComplexType\b/gi,
  /\bHasPrecision\(18,\s*4\)/gi,
  /\bAsSplitQuery\b/gi,
  /\bcompiled queries\b/gi,
  /\bResilience\b.*\bPolly v8\b/gi,
  /\bLoggerMessage\b/gi,
  /\bOpenTelemetry\b/gi,
  /\bNullable\b.*\bdisable\b/gi,
  /\bstring\?\b|\bobject\?\b/gi,
  /\bNamespaces\b.*\bTipo\b/gi,
  /\bBackground Jobs\b.*\bIServiceScope\b/gi,
  /\bAdd-Migration\b.*\bautónoma\b/gi,
  /\bSerilog\b.*\bSQL\b/gi,
  /\bSecretos\b.*\bhardcode\b/gi,
  // Encoding
  /\bUTF-8 sin BOM\b/gi,
  // Documentación
  /\bespañol de México\b/gi,
  /\bdd-MMM-yy\b/gi,
  /\bMermaid\b.*\bswimlanes\b/gi,
  /\bflowchart TD\b/gi,
  /\bsequenceDiagram\b.*\bautonumber\b/gi,
  /\berDiagram\b/gi,
  /\bbreadcrumbs\b.*\bDocumentación\b/gi,
  /\bSI\s*\[condición\]\s*ENTONCES\s*\[acción\]/gi,
  // Skills
  /\bconsulta atómica\b/gi,
  // Organización por Apps
  /\bapps\/<dominio>\.luxuryapp\b/gi,
  /\bqr-scanner\b.*\bsecurity\b.*\bresident\b.*\badmin\b/gi,
  // Responsive
  /\b768px\b.*\bmd\b/gi,
  /\bPlatformService\.isMobile\b/gi,
  /\bPatrón A\b.*\bCSS Responsive\b/gi,
  /\bPatrón B\b.*\bComponentes Separados\b/gi,
  /\bPatrón C\b.*\bAdaptive Wrapper\b/gi,
  /\bapp-data-view-mobile\b/gi,
  /\bili-action-menu\b.*\bend\b/gi,
  /\bp\s*en lugar de headings\b/gi,
  /\bSkeleton screens\b.*\bion-skeleton-text\b/gi,
  /\bCERO scroll horizontal\b/gi,
  /\bDynamicDialog\b.*\bNO\b.*\bmobile\b/gi,
  // Testing
  /\bxUnit\b/gi,
  /\bFluentAssertions\b/gi,
  /\bMoq\b/gi,
  /\bInMemoryDbContextFactory\b/gi,
  /\bBuildService\b/gi,
  /\bICurrentUserService\b.*\bMock\b/gi,
  /\bSeed\b.*\bDbContext\b/gi,
  /\bBeTrue\b|\bBeFalse\b|\bBeEmpty\b|\bContainSingle\b|\bHaveCount\b/gi,
  /\bShould\(\)\.Be\(true\)/gi,
  // Git
  /\bfeature\/\b|\bfix\/\b|\bhotfix\/\b|\brelease\/\b|\bchore\/\b/gi,
  /\bfeat:\b|\bfix:\b|\brefactor:\b|\bdocs:\b|\bchore:\b/gi,
  // Infraestructura
  /\bIFileWritePathService\b/gi,
  /\bIImageStorageService\b/gi,
  /\bISecureFileStorageService\b/gi,
  /\bIFileReadPathService\b/gi,
  /\b1296×972\b/gi,
  /\bmagic bytes\b/gi,
  /\b5 MB\b/gi,
  /\bJPEG.*PNG.*PDF.*ZIP.*Office.*XML/gi,
  /\bpublic\/customers\b/gi,
  /\bprivate\/rrhh\b/gi,
  // Notificaciones
  /\bCanales\b.*\bEmail\b.*\bPush\b.*\bSignalR\b.*\bWhatsApp\b/gi,
  /\bSendEmailGlobal\b/gi,
  /\bgerente\.mtto@luxurybuildingsite\.com\b/gi,
  /\b3e1ff763-c104-42fe-bb03-1e4c24493f89\b/gi,
  // Identity
  /\bICurrentUserService\b/gi,
  /\bCustomerId\b.*\bHasValue\b/gi,
  // Vault
  /\bNUNCA loggear\b.*\bsecreto\b/gi,
  /\bVaultDbContext\b.*\bprohibido\b/gi,
  /\bPlaintextValue\b.*\bscope\b/gi,
  /\bclave maestra\b.*\bgit\b/gi,
  /\busuario SQL\b.*\bDDL\b/gi,
];

// Palabras permitidas (herramientas, scripts, comandos - NO son reglas)
const ALLOWED_PATTERNS = [
  /scan-mojibake\.mjs/gi,
  /fix-mojibake\.mjs/gi,
  /fix-fffd\.mjs/gi,
  /fix-wrong-vowels\.mjs/gi,
  /fix-n-tilde\.mjs/gi,
  /scripts\//gi,
  /node scripts\//gi,
  /encoding-gate\.yml/gi,
  /\.githooks\//gi,
  /pre-commit/gi,
  /pre-push/gi,
];

function checkFile(filePath) {
  const fullPath = path.join(ROOT, filePath);
  if (!fs.existsSync(fullPath)) return { file: filePath, exists: false, violations: [] };
  
  const content = fs.readFileSync(fullPath, "utf8");
  const violations = [];
  
  for (const pattern of HARDCODED_RULES) {
    const matches = content.match(pattern);
    if (matches) {
      // Verificar si es un patrón permitido (herramienta/script)
      let isAllowed = false;
      for (const allowed of ALLOWED_PATTERNS) {
        if (allowed.test(matches[0])) {
          isAllowed = true;
          break;
        }
      }
      if (!isAllowed) {
        violations.push({
          pattern: pattern.toString(),
          matches: matches.length,
          examples: matches.slice(0, 3)
        });
      }
    }
  }
  
  return { file: filePath, exists: true, violations };
}

function checkReferences(filePath) {
  const fullPath = path.join(ROOT, filePath);
  if (!fs.existsSync(fullPath)) return { file: filePath, hasConventionsRef: false, hasSkillsRef: false };
  
  const content = fs.readFileSync(fullPath, "utf8");
  const hasConventionsRef = /CONVENTIONS\.md/i.test(content);
  const hasSkillsRef = /skills\//i.test(content);
  
  return { file: filePath, hasConventionsRef, hasSkillsRef };
}

console.log("🔍 Verificando reglas hardcodeadas en archivos de agentes...\n");

let totalViolations = 0;
let allOk = true;

for (const file of AGENT_FILES) {
  const result = checkFile(file);
  const refs = checkReferences(file);
  
  if (!result.exists) {
    console.log(`⚠️  ${file}: NO EXISTE`);
    continue;
  }
  
  if (result.violations.length > 0) {
    console.log(`❌ ${file}: ${result.violations.length} violaciones encontradas`);
    for (const v of result.violations) {
      console.log(`   - Patrón: ${v.pattern} (${v.matches} coincidencias)`);
      console.log(`     Ejemplos: ${v.examples.join(", ")}`);
    }
    totalViolations += result.violations.length;
    allOk = false;
  } else {
    console.log(`✅ ${file}: Sin reglas hardcodeadas`);
  }
  
  if (!refs.hasConventionsRef) {
    console.log(`   ⚠️  No referencia CONVENTIONS.md`);
    allOk = false;
  }
  if (!refs.hasSkillsRef) {
    console.log(`   ⚠️  No referencia skills/`);
    allOk = false;
  }
}

console.log(`\n${"=".repeat(50)}`);
if (allOk && totalViolations === 0) {
  console.log("✅ TODOS LOS ARCHIVOS DE AGENTES ESTÁN LIMPIOS");
  console.log("   Solo referencian CONVENTIONS.md y skills/");
  process.exit(0);
} else {
  console.log(`❌ ENCONTRADAS ${totalViolations} VIOLACIONES`);
  console.log("   Los archivos de agentes deben SOLO referenciar CONVENTIONS.md y skills/");
  console.log("   Mueva cualquier regla a CONVENTIONS.md o skills/ correspondiente");
  process.exit(1);
}
