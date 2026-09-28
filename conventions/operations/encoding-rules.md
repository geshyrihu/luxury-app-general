# Encoding Rules

**Ultima revision:** 2026-09-23 (corregido incidente de gate CI/CD roto — ver sección dedicada abajo). Anterior 2026-09-21: Remediación completada: 254 corruptelas mojibake identificadas y corregidas en fases 1-10; gate CI/CD agregado.

## Proposito

Capturar las reglas obligatorias de encoding para evitar corrupcion documental o
de codigo durante operaciones de lectura, escritura, creacion o movimiento de
archivos.

## Regla base

Todo archivo de codigo o documentacion debe mantenerse en UTF-8 sin BOM.

## Capas de proteccion existentes

- `.editorconfig`
- `.gitattributes`
- `.vscode/settings.json`

## Reglas obligatorias

- usar UTF-8 sin BOM
- usar LF cuando la configuracion del proyecto lo exige
- no confiar en conversiones automaticas del editor
- verificar encoding despues de crear o mover archivos sensibles
- si se detecta corrupcion tipo mojibake, no intentar "parches" inciertos sobre
  el archivo productivo
- preferir recrear desde contenido limpio cuando el archivo ya quedo danado
- en Windows, para mover o reubicar archivos sensibles, preferir PowerShell
  antes que Bash

## Regla operativa en Windows

- para operaciones de archivos en Windows, preferir PowerShell
- evitar mover archivos con Bash `mv` si existe riesgo de corrupcion por paths y encoding

## Checklist minimo despues de tocar archivos sensibles

- verificar que el archivo siga legible y sin mojibake
- correr el scanner oficial cuando aplique
- confirmar que el archivo no quedo en UTF-8 con BOM
- si hubo movimiento de archivos, verificar de nuevo despues del move

## Si se detecta corrupcion

- no "parchar" el archivo con conversiones dudosas
- recrear desde contenido limpio cuando sea necesario
- verificar encoding antes de cerrar la tarea

## Gate CI/CD: npm run audit:encoding

Agregado 2026-09-21 a `.github/workflows/design-system.yml`:

```yaml
- name: Textos sin mojibake (encoding correcto)
  run: npm run audit:encoding
```

Este gate ejecuta `appsweb/angular/scripts/scan-mojibake.mjs` (versionado dentro del repo, ver incidente abajo) sobre todo el workspace frontend y bloquea el merge si encuentra:
- Vocales españolas con acento en minúscula invertido (mívil→móvil, Tútulo→Título, etc.)
- Palabras mayúsculas con acento en minúscula (SECCIóN, INYECCIó, etc.)
- Otros patrones de double UTF-8 encoding

**Historial de remediación (2026-09-21):**
- Fase 1: accounting.luxuryapp — 52 corruptelas ✅
- Fase 1.2: operations.luxuryapp — 44 corruptelas ✅
- Fase 2: maintenance.luxuryapp — 24 corruptelas ✅
- Fase 3: admin.luxuryapp — 24 corruptelas ✅
- Fase 4: purchases.luxuryapp — 19 corruptelas ✅
- Fase 5: human-resources.luxuryapp — 13 corruptelas ✅
- Fase 6: legal.luxuryapp — 8 corruptelas ✅
- Fase 7: management.luxuryapp — 5 corruptelas ✅
- Fase 8: shared.luxuryapp — 4 corruptelas ✅
- Fase 9: recruitment.luxuryapp — 4 corruptelas ✅
- Fase 10: core/routing — 3 corruptelas ✅
- Especial: emoji-audit.json — 55 corruptelas ✅

**Total:** 254/254 hallazgos corregidos = 100%
**Estado actual:** ✅ npm run audit:encoding PASS

## Incidente resuelto: gate roto en CI (2026-09-23)

El gate agregado el 2026-09-21 delegaba a `d:\repos\luxuryapp-api\scripts\scan-mojibake.mjs` — dos niveles arriba de `appsweb/angular/`, en la carpeta contenedora del monorepo. Esa carpeta **no es un repositorio git** (contiene tres repos independientes: `api/`, `appsweb/angular/`, `appsmobil/flutter/`), por lo que ese script nunca se versionó y solo existía en el filesystem local de quien lo creó.

En CI, `actions/checkout@v4` solo trae el contenido de `appsweb/angular/` — la carpeta contenedora no existe en el runner. El gate fallaba con `ENOENT` en cada push/PR, bloqueando merges válidos sin relación con encoding real.

**Corrección (commit `e3dc9a640`):** se copiaron `scan-mojibake.mjs` y `fix-mojibake.mjs` a `appsweb/angular/scripts/` (ambos ya resolvían rutas vía `import.meta.dirname`, por lo que no requirieron cambios internos) y se simplificó `audit-encoding.mjs` para invocar la copia local. Verificado con `git archive HEAD | tar -x` en un directorio limpio (simulando un checkout de CI real): el gate corre y pasa sin la carpeta contenedora.

**Lección:** cualquier script referenciado por `npm run` o por un workflow de CI debe vivir **dentro del mismo repo git** que lo consume. Nunca asumir que la carpeta contenedora del monorepo (`d:\repos\luxuryapp-api\`) está disponible en tiempo de ejecución — no es un repositorio y no se clona en ningún pipeline.

## Herramientas operativas

Para más detalles sobre uso de scripts, workflow recomendado y falsos negativos conocidos:
→ [Herramientas Operativas: Escaneo y Remediación de Mojibake](./mojibake-tools-operational.md)

## Validación de textos y propiedades (sin mojibake ni corrupción ortográfica)

El escáner canónico `appsweb/angular/scripts/scan-mojibake.mjs` detecta no solo
mojibake de encoding clásico (UTF-8→CP1252), sino también los puntos ciegos que el
detector por roundtrip no alcanzaba:

- controles C1 (`0x80`–`0x9F`) y BOM `U+FEFF`;
- sustitución sistemática `ñ`→`ó` (p.ej. `Aóo` debe ser `Año`);
- acentos corruptos conocidos (`Tútulos`→`Títulos`, `GESTIóN`→`GESTIÓN`,
  `ASIGNACIóN`→`ASIGNACIÓN`, `invólido`→`inválido`, `diólogo`→`diálogo`);
- caracteres CJK sueltos en archivos de código (mojibake de otro idioma).

Todo texto hardcoded visible y toda propiedad `DisplayName` / `[Display(Name="…)]` de
enums debe estar libre de esas corruptelas. El gate `npm run audit:encoding`
(delegado al escáner) corre dentro de `npm run lint` y falla (exit 1) si hay
hallazgos.

Regla madre en `CONVENTIONS.md` §6.1 (Textos y propiedades en español sin mojibake).

## Fuente historica a preservar

- [encoding-stricto.md](../../encoding-stricto.md)


