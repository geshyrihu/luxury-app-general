# Herramientas Operativas: Escaneo y Remediación de Mojibake

**Ultima revision:** 2026-09-23 (corregida ubicación canónica de los scripts tras el bug de CI descrito abajo)

## Propósito

Documentar los scripts disponibles para detectar y corregir corruptelas de encoding (mojibake / double UTF-8) en el frontend y backend.

## ⚠️ Dos copias existentes — cuál usar

- **`appsweb/angular/scripts/scan-mojibake.mjs` y `fix-mojibake.mjs`** — **canónicos**. Versionados en git, usados por `npm run audit:encoding` y por el gate de CI (`.github/workflows/design-system.yml`). Usar estos siempre que el trabajo sea sobre `appsweb/angular/`.
- **`scripts/scan-mojibake.mjs` y `fix-mojibake.mjs` en la raíz del contenedor** (`d:\repos\luxuryapp-api\scripts\`) — copia histórica, **no versionada en ningún repo git** (la raíz no es un repositorio). Solo existe en el filesystem local. Útil para escanear `docs/` o `conventions/` (que viven fuera de todos los repos), pero **no confiar en ella para nada que deba funcionar en CI**.

Hasta 2026-09-23, `npm run audit:encoding` delegaba a la copia de la raíz vía `path.resolve(cwd, "..", "..")`. Eso rompía el gate en CI (GitHub Actions solo hace checkout de `appsweb/angular/`, nunca de la carpeta contenedora) con `ENOENT`. Corregido en el commit `e3dc9a640`: el script ahora es autocontenido dentro de `appsweb/angular/scripts/`. Ver [Encoding Rules](./encoding-rules.md) para el detalle del incidente.

## Scripts disponibles (rutas relativas a `appsweb/angular/`)

### 1. scan-mojibake.mjs

**Ubicación:** `appsweb/angular/scripts/scan-mojibake.mjs`

**Función:** Escanea archivos en busca de patrones de corrupción por double UTF-8 encoding.

**Uso (desde `appsweb/angular/`):**
```bash
# Escanear directorio completo
node scripts/scan-mojibake.mjs src/app/modules/accounting.luxuryapp

# Escanear archivo individual
node scripts/scan-mojibake.mjs src/app/modules/operations.luxuryapp/task/tasks/my-tasks/my-requests-task.html

# Escanear todo el repo (equivalente a npm run audit:encoding)
node scripts/scan-mojibake.mjs .
```

**Salida:**
- Muestra hallazgos por línea con contexto
- Reporta total de archivos escaneados
- Lista archivos recomendados para fix

**Patrones detectados:**
- Vocales con acento invertido: mívil→móvil, Tútulo→Título, óltimo→último
- Palabras mayúsculas con acento en minúscula: SECCIó→SECCIÓN, INYECCIó→INYECCIÓN
- Otros artefactos de double UTF-8: segón→según, lónea→línea

### 2. fix-mojibake.mjs

**Ubicación:** `appsweb/angular/scripts/fix-mojibake.mjs`

**Función:** Corrige corruptelas mojibake automáticamente usando diccionario y reglas regex.

**Uso (desde `appsweb/angular/`):**
```bash
# Reparar directorio
node scripts/fix-mojibake.mjs src/app/modules/accounting.luxuryapp

# Reparar archivo individual
node scripts/fix-mojibake.mjs src/app/modules/operations.luxuryapp/task/tasks/my-tasks/my-requests-task.html

# Reparar todo el repo
node scripts/fix-mojibake.mjs .
```

**Funcionalidad:**
- Aplica hasta 15 iteraciones de corrección (en caso de corruptelas anidadas)
- Repara líneas con múltiples corruptelas
- Maneja segment-based repair para mixed valid+corrupted lines

**Nota:** Las correcciones se aplican **in-place** en disco. Los cambios están listos para `git add` tras verificación.

### 3. npm run audit:encoding

**Función:** Gate CI/CD que ejecuta scan-mojibake.mjs sobre el workspace completo.

**Uso:**
```bash
# Desde appsweb/angular
npm run audit:encoding
```

**Salida esperada:**
```
✓ CERO mojibake / corrupción ortográfica encontrado (scan-mojibake.mjs).
```

**Integración:** 
- Ejecutado automáticamente en `.github/workflows/design-system.yml`
- Bloquea merge si hay hallazgos
- No bloquea en ramas que no sean main/PR a main

## Workflow operativo recomendado

### Detección (desde `appsweb/angular/`):
```bash
# 1. Escanear módulo sospechoso
node scripts/scan-mojibake.mjs src/app/modules/[modulo].luxuryapp

# 2. Revisar hallazgos y contexto
# → Si 0 hallazgos: está limpio ✅
# → Si hay hallazgos: proceder a reparación
```

### Reparación (desde `appsweb/angular/`):
```bash
# 1. Hacer backup o commit anterior (git stash / git commit)
git stash

# 2. Reparar
node scripts/fix-mojibake.mjs src/app/modules/[modulo].luxuryapp

# 3. Verificar (0 hallazgos)
node scripts/scan-mojibake.mjs src/app/modules/[modulo].luxuryapp

# 4. Si verificación pasa (desde appsweb/angular/):
git add src/app/modules/[modulo].luxuryapp
git commit -m "fix(encoding): remediate mojibake in [modulo]"

# 5. Si verificación falla:
#    → Revisar manualmente (posibles false negatives en líneas con 2+ corruptelas)
#    → Usar find+grep para búsqueda manual
```

### Falsos negativos conocidos

El escáner detecta patrones conocidos pero puede pasar por alto:

- Líneas con múltiples corruptelas (requiere lectura manual)
- Verbos conjugados anormales (seré→será, fallé→falló)
- Palabras truncadas ('Só'→'Sí')
- Guion reemplazado por acento (ENEóDIC→ENE-DIC)
- Patrón ñ→í (DESEMPEíO→DESEMPEÑO)

**Mitigación:** En auditorías manuales, leer cada archivo holísticamente, no confiar solo en scan automático.

## Historial de cambios

- **2026-09-21**: Remediación completada (254 corruptelas), gate CI/CD agregado
- **2026-09-09**: Escáner y fixer implementados inicialmente

## Referencias

- [Encoding Rules](./encoding-rules.md) — Reglas obligatorias y checklist
- [CONVENTIONS.md §6.1](../CONVENTIONS.md#61-shared-contratos-y-dtos) — Regla CRÍTICA en tabla de reglas
