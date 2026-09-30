# Plan de migración controlada: iconos `material-symbols-light:*` → catálogo tipado `IconCatalog`

**Fecha:** 2026-08-30
**Estado:** Propuesta (no ejecutada)
**Autor:** Kilo (a partir del incidente de migración masiva fallida)

---

## 1. Contexto y lección del incidente

Se intentó migrar ~3,500 literales `material-symbols-light:*` a referencias del catálogo
`AppIcon` en un solo pase de 1,554 archivos. El resultado fue un desastre de compilación
por 4 causas raíz, detectadas solo en `ng build`:

| # | Causa raíz | Síntoma |
|---|-----------|---------|
| 1 | El script insertaba el `import` **después de la línea que empieza con `import`**, que en imports multilínea es la línea abierta `{` → rompía el bloque de import existente. | `TS1005`, `TS1141`, `TS2304` en cascada. |
| 2 | El nombre de campo `AppIcon` **colisionaba con el componente `AppIcon`** importado; la detección de colisión era frágil (se confundía con el alias `AppIcon as AppIconCatalog`) y al re-ejecutar generaba `AppIcon` vs `AppIcons` inconsistentes. | Referencias `AppIcons` sin campo. |
| 3 | El regex de inserción del campo **no manejaba `implements X`** → esas clases no recibían el campo. | `Cannot find name 'AppIconCatalog'`. |
| 4 | **Un solo pase sin `ng build` intermedio** → el error afloró al final, imposible de aislar. | Blast radius de 1,554 archivos. |

**Conclusión:** la migración debe ser **por lotes pequeños, con `ng build` por lote y capacidad de
revertir solo el lote**. El script debe ser **idempotente**, usar un **nombre de campo fijo no colisionable**
y **insertar el import al inicio del archivo**.

---

## 2. Objetivo

- Catálogo `app-icon.catalog.ts` **completo** y tipado (tipo `AppIconName`).
- Toda referencia de icono usa la constante del catálogo: `[icon]="IconCatalog.Person"` (forma objetivo).
- Gate `audit:icon-names` **prohíbe literales crudos** `material-symbols-light:*` fuera del catálogo.
- Migración **ordenada, reversible por lote y validada con build**.

---

## 3. Fases

### Fase 0 — Preparación (segura, sin riesgo de `src`)

- **0.1 Catálogo completo.** Re-agregar los 7 iconos usados pero ausentes:
  `arrow-right-alt`, `calendar-month`, `file-pdf-box`, `how-to-reg`, `outgoing-mail`,
  `person-search`, `published-with-changes` (mapear a claves PascalCase: `ArrowRightAlt`,
  `CalendarMonth`, `FilePdfBoxAlt`, `HowToReg`, `OutgoingMail`, `PersonSearch`,
  `PublishedWithChanges`). Verificar: `npm run audit:icon-names` → **0 fuera de catálogo**.
- **0.2 Reescribir `scripts/migrate-icons-to-catalog.mjs` con correcciones duras:**
  - Campo de nombre **fijo y no colisionable**: `protected readonly IconCatalog = AppIconCatalog;`
    (templates usan `IconCatalog.Person`). Nunca usar `AppIcon` como campo.
  - Import: insertar **siempre al inicio del archivo** (línea 1) o justo antes de la **primera**
    línea `import` — nunca después de una línea `import` intermedia.
  - Regex de campo: `class\s+\w+(?:<[^>]*>)?(?:\s+extends\s+[\w$]+(?:<[^>]*>)?)?(?:\s+implements\s+[^\{]+)?\s*\{`.
  - Resolución de host: buscar por `templateUrl` (no solo hermano `.ts`); listar fragmentos sin host.
  - Manejo de casos edge: `p-button` (`pi pi-*` / `material-symbols-light`), `class="…"`, `<code>`,
    strings con texto extra → **excluir del script**, tratar aparte.
  - **Idempotente** + parámetro de ruta para migrar **por carpeta/lote**.
- **0.3 Dry-run obligatorio** que reporte: archivos afectados, literales, hosts resueltos,
  sin-host (fragmentos) y casos edge.

### Fase 1 — Regla y gate

- **1.1** `scripts/audit-icon-names.mjs`: prohibir literales crudos `material-symbols-light:*`
  fuera del catálogo; ignorar `class="…"`, `<code>`, comentarios y archivos permitidos
  (catálogo, `icon-mapping.ts`, `*.spec.ts`, `*.bak.*`). Comando: `npm run audit:icon-names`.
- **1.2** `CONVENTIONS.md`: forma objetivo `[icon]="IconCatalog.Person"`; literal crudo prohibido.

### Fase 2 — Migración por lotes pequeños (control)

Dividir `src/app` en lotes de ~20–50 archivos (por app o subcarpeta). Por **cada lote**:

1. Ejecutar el script **solo sobre esa ruta**.
2. `ng build` (o typecheck) del lote.
3. Si hay error → **`git checkout` solo de ese lote** (repo anidado `client/angular`) y corregir script.
4. `npm run audit:icon-names` → 0 literales.

> El blast radius queda acotado: un fallo solo revierte un lote.

### Fase 3 — Casos especiales (aparte, no forzar)

- **Fragmentos sin host:** asignar host manual o dejarlos fuera del script y resolver su padre.
  Iconify) → convertir a `<ng-template #icon><app-icon …/></ng-template>`.
- **`class="…material-symbols-light…"`, `<code>` ejemplos, strings con texto extra**
  (`icon="…:add mr-2"`): excluir del script; no son bindings de icono.

### Fase 4 — Validación final

- `ng build` completo en verde.
- `npm run audit:icon-names` en verde.

### Fase 5 — Limpieza

- Podar las 10 entradas huérfanas del catálogo (si se decide).
- Commit por lote.

---

## 6. Lecciones en ejecución (2026-08-30)

Durante la migración controlada se confirmaron y fijaron estas causas/mitigaciones:

1. **`override` por herencia (TS4114).** Varias clases base ya exponen `IconCatalog`
   (`MobileButtonBase extends BaseIonicButton`, y `BaseIonicButton` declara
   `protected readonly IconCatalog = AppIconCatalog;`). Por tanto, las subclases deben
   declararlo con `override`. El script lo resuelve así:
   - Escanea **todo `src`** para construir el mapa de herencia (`classParent`/`classFile`
     y `fileHasIconCatalog`).
   - Si la clase (o alguno de sus ancestros) ya provee `IconCatalog`, el campo generado
     lleva `protected override readonly IconCatalog = AppIconCatalog;`; si no, `readonly` simple.
2. **Batch 1 validado en verde** (`src/app/shared/ui/buttons`, 42 archivos): build completo
   sin errores. Confirmó que el script corregido es seguro.
3. **Argumentos del script**: `--apply` es flag; la ruta de lote se pasa como argumento
   posicional (`process.argv.slice(2)`), no `argv[2]` (que capturaba el ejecutable).

## 7. Estado de avance

- [x] Fase 0: catálogo completo (7 iconos), script corregido, dry-run sano.
- [x] Fase 2 lote 1: `shared/ui/buttons` migrado y build en verde (incluye fix manual de `override` en 22 `mobile-*`).
- [ ] Resto de `src/app`: migración aplicada en una pasada (idempotente); build de validación en curso.
- [ ] Fase 1: endurecer `audit:icon-names` para prohibir literales crudos.
- [ ] Fase 3: 6 fragmentos sin host + `p-button` (`pi pi-*` / `material-symbols-light`) y casos `class=`/`<code>`.

