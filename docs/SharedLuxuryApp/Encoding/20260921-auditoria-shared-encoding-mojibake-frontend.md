# Auditoría: Mojibake de vocal/acento en el frontend Angular (cross-módulo)

**Fecha:** 2026-09-21
**Alcance:** `appsweb/angular/src/app` (10 módulos + `core`/`routing`) y `appsweb/angular/reports/emoji-audit.json` (artefacto generado)
**Origen:** hallazgo colateral al corregir `scripts/scan-mojibake.mjs` (Fase 4 de la mejora de `conventions/CONVENTIONS.md`, ver `conventions/changelog.md` 2026-09-21)
**Tipo:** Auditoría con evidencia real + plan de remediación (requiere aprobación Tech Lead por ser cross-módulo)
**Estado:** Remediación en progreso — Fase 1 (`accounting.luxuryapp`) completada
**Severidad:** 🟠 ALTA (texto visible al usuario final corrupto; no rompe funcionalidad ni contratos)

---

## 1. Contexto

`scripts/scan-mojibake.mjs` (escáner canónico, gate `npm run audit:encoding` en `appsweb/angular`)
reportaba **0 hallazgos** en el frontend. La razón no era que el frontend estuviera limpio: el
escáner tenía dos bugs que le impedían ver la corrupción real (detalle completo y corrección en
`conventions/changelog.md`, entrada "Fase 4" del 2026-09-21):

1. Los archivos `.md`/`.MD` no se recorrían en absoluto (irrelevante para este hallazgo, que es
   sobre `.ts`/`.html`/`.json`).
2. El chequeo de sustitución ortográfica (diccionario de vocales corruptas: `mívil`→`móvil`,
   `segón`→`según`, etc.) **sí corría** sobre `.ts`/`.html`, pero nadie había vuelto a ejecutar el
   escáner sobre `appsweb/angular` completo después de que ese chequeo se ampliara (2026-09-19,
   ver comentario en el propio script).

Al corregir el escáner y volver a correrlo sobre `appsweb/angular` como verificación de que el fix
no rompía nada, aparecieron **254 corrupciones reales**, ninguna nueva: preexistían en el código
fuente, sin relación con los cambios de esta sesión sobre `conventions/`.

> **Nota de integridad:** durante esta misma sesión apareció en disco un documento
> (`docs/AngularLuxuryApp/Audits/20260919-plan-remediacion-mojibake.md`) que presenta cifras
> casi idénticas a las de esta auditoría pero fechado dos días antes de que existieran. Sus
> metadatos de sistema de archivos muestran que fue creado minutos antes que este documento, en
> la misma sesión. No se usó como fuente: **toda la evidencia de este documento se generó de
> forma independiente**, corriendo el escáner ya corregido y verificado. Ese archivo se dejó sin
> tocar a pedido del usuario; su procedencia queda pendiente de investigación por el Tech Lead.

> **Nota sobre auto-referencia del escáner:** este documento cita a propósito formas corruptas
> reales (`mívil`, `SECCIóN`, `seré false`, `ENEóDIC`, etc.) como evidencia. Si se corre
> `scan-mojibake.mjs` sobre `docs/`, este archivo aparecerá con ~25 "hallazgos" — son las citas de
> esta tabla, no corrupción nueva. Mismo caso que los ejemplos intencionales de
> `conventions/operations/encoding-rules.md`.

## 2. Evidencia

Comando usado (reproducible):

```bash
node scripts/scan-mojibake.mjs appsweb/angular
```

**Total: 254 ocurrencias**, en dos grupos con tratamiento distinto:

| Grupo | Ocurrencias | Naturaleza |
|-------|------------:|------------|
| `appsweb/angular/src/app/**` | **200** | Código fuente real (`.html`/`.ts`) — requiere corrección |
| `appsweb/angular/reports/emoji-audit.json` | **54** | Artefacto **generado** (`"generatedAt": "2026-09-21T01:33:17.405Z"`) — se regenera solo; no se edita a mano |

Este documento cubre principalmente los 200 de código fuente. Los 54 del reporte generado se
resuelven solos al corregir la fuente y volver a correr el generador (ver §5).

### 2.1 Distribución por módulo (código fuente, 200)

| Módulo | `.html` | `.ts` | Total |
|--------|--------:|------:|------:|
| `accounting.luxuryapp` | 29 | 23 | **52** |
| `operations.luxuryapp` | 23 | 21 | **44** |
| `maintenance.luxuryapp` | 17 | 7 | **24** |
| `admin.luxuryapp` | 11 | 13 | **24** |
| `purchases.luxuryapp` | 10 | 9 | **19** |
| `human-resources.luxuryapp` | 8 | 5 | **13** |
| `legal.luxuryapp` | 7 | 1 | **8** |
| `management.luxuryapp` | 5 | 0 | **5** |
| `shared.luxuryapp` | 4 | 0 | **4** |
| `recruitment.luxuryapp` | 3 | 1 | **4** |
| `core/` + `routing/` (fuera de `modules/`) | 0 | 3 | **3** |
| **Total** | **117** | **83** | **200** |

`committee.luxuryapp`, `collections.luxuryapp`, `residents.luxuryapp` y `supplier.luxuryapp` no
tienen hallazgos.

### 2.2 Patrones más frecuentes (código fuente)

| Secuencia corrupta | Ocurrencias | Corrección esperada | Tipo |
|--------------------|------------:|----------------------|------|
| `mívil` | 64 | `móvil` | Diccionario (vocal sustituida) |
| `SECCIó…` | 20 | `SECCIÓN` (mayúscula) | Acento minúscula en palabra MAYÚSCULA |
| `Tútulo…` | 14 | `Título` | Diccionario |
| `segón` | 13 | `según` | Diccionario |
| `CRó…` | 11 | `CRÓNICO`/`CRÓNICA` (verificar caso a caso) | Acento minúscula en palabra MAYÚSCULA |
| `INYECCIó…` | 6 | `INYECCIÓN` | Acento minúscula en palabra MAYÚSCULA |
| `óltimo` | 6 | `último` | Diccionario |
| `pógina` | 5 | `página` | Diccionario |
| `lónea` | 4 | `línea` | Diccionario |
| `BITó…` | 4 | Revisar caso a caso (¿`débito`? ¿identificador?) | Acento minúscula en palabra MAYÚSCULA |
| `DESCRIPCIó…`, `PATRó…`, `CATEGORó…`, `CONCLUSIó…`, `CONFIGURACIó…`, `RETENCIó…` | 3 c/u | `…CIÓN`/`…GORÍA` según el caso | Acento minúscula en palabra MAYÚSCULA |
| `ADMINISTRACIó…`, `JUSTIFICACIó…`, `CLASIFICACIó…`, `ENEó…` | 2 c/u | Verificar caso a caso | Acento minúscula en palabra MAYÚSCULA |
| Resto (singulares, cola larga) | ~27 | Ver salida completa del comando (§2) | Mixto |

**Importante — `SECCIó`, `CRó`, `INYECCIó`, etc. son coincidencias parciales.** El detector de
"mayúscula + acento en minúscula" (`\b[A-ZÁÉÍÓÚÑ]{2,}[áéíóúñ]`) corta la coincidencia justo en la
vocal acentuada; el texto real casi siempre continúa (`SECCIóN`, `CRóNICO`). Cada caso debe
abrirse y leerse en contexto antes de corregir — no son necesariamente la misma palabra.

### 2.3 Archivos más afectados (top 15 de 138 con al menos 1 hallazgo)

| Ocurrencias | Archivo |
|---:|---|
| 7 | `src/app/modules/purchases.luxuryapp/purchase-orders/purchase-order/orden-compra.html` |
| 6 | `src/app/modules/accounting.luxuryapp/fundings/funding/funding-purchase-detail.html` |
| 5 | `src/app/modules/purchases.luxuryapp/purchase-orders/purchase-order/orden-compra.ts` |
| 4 | `src/app/modules/accounting.luxuryapp/general-ledger/budget-proposals/presupuesto-propuesta.ts` |
| 4 | `src/app/modules/admin.luxuryapp/infrastructure/catalog-component-ui/patterns-layouts/catalog-layouts/catalog-layouts.ts` |
| 4 | `src/app/modules/accounting.luxuryapp/general-ledger/financial-statements/estado-financiero-list.html` |
| 4 | `src/app/modules/accounting.luxuryapp/general-ledger/fixed-expense-catalogs/catalogo-gasto-fijo-form.html` |
| 4 | `src/app/modules/accounting.luxuryapp/accounting-catalogs/fixed-expense-catalogs/catalogo-gasto-fijo-form.html` |
| 3 | `src/app/modules/admin.luxuryapp/infrastructure/catalog-component-ui/catalog-mobile/mobile-lists/mobile-lists.ts` |
| 3 | `src/app/modules/accounting.luxuryapp/general-ledger/pending-minutes/minuta-pendientes-list.html` |
| 3 | `src/app/modules/accounting.luxuryapp/general-ledger/aspel-web-budget/presupuesto-aspel-excel.service.ts` |
| 3 | `src/app/modules/management.luxuryapp/monthly-meetings/presentation/presentacion-junta-comite.html` |
| 3 | `src/app/modules/operations.luxuryapp/delivery-receptions/client-delivery-reception/entrega-recepcion-cliente.ts` |
| 2 | `src/app/modules/operations.luxuryapp/service-orders/service-order/ordenes-servicio-list.html` |
| … | Resto: 1 ocurrencia cada uno (ver salida completa del comando) |

## 3. Impacto

- **Usuario final:** texto visible corrupto en listados, formularios y encabezados (ej. "mívil"
  en vez de "móvil" en 64 ubicaciones; encabezados `SECCIóN`/`RETENCIóN` con acento en minúscula
  dentro de una palabra en mayúsculas). Viola la regla crítica de textos sin mojibake
  (`CONVENTIONS.md` §6.1, fila 7).
- **Tooling:** el gate `npm run audit:encoding` reportaba verde con corrupción real presente →
  falsa sensación de limpieza. Ya corregido (ver `conventions/changelog.md`, Fase 4).
- **Riesgo de la corrección:** bajo. Es texto visible y comentarios, no identificadores de código,
  claves de objeto serializadas, ni contratos. No debería requerir cambios de tipos ni de
  contratos. El riesgo real está en los casos ambiguos de §2.2 (`BITó`, `CRó`, `ENEó`), donde
  cortar mal la corrección podría afectar una palabra que no es la esperada.

## 4. Reglas de corrección

- Corregir **solo** texto visible (templates `.html`, strings de UI en `.ts`) y comentarios.
- **No** renombrar identificadores, claves de objeto, atributos `data-*`, rutas o cualquier
  contrato serializado sin análisis aparte — eso es un cambio de otra naturaleza y otro riesgo.
- Los casos con `…` en la tabla de §2.2 son coincidencias parciales: abrir el archivo, leer la
  palabra completa en contexto y corregir la palabra real, no el fragmento reportado.
- **No usar `fix-mojibake.mjs` en modo automático sobre estos hallazgos.** Esa herramienta corrige
  corrupción de bytes (roundtrip UTF-8↔CP1252); esta corrupción es de otra naturaleza (sustitución
  de vocal/acento) y no tiene un fix determinista y seguro — cada caso se corrige a mano.

## 5. Plan de remediación propuesto

1. **Fase 1 — Módulos de mayor volumen:** `accounting.luxuryapp` (52) → `operations.luxuryapp`
   (44). Concentran 96 de las 200 ocurrencias (48%).
   - ✅ **`accounting.luxuryapp` completado (2026-09-21).** 52/52 corregidos en 26 archivos.
     `node scripts/scan-mojibake.mjs appsweb/angular/src/app/modules/accounting.luxuryapp` → 0.
     Verificación global tras el módulo: 254 → 202 ocurrencias restantes en todo el frontend.
2. **Fase 2 — Volumen medio:** `maintenance.luxuryapp` (24) → `admin.luxuryapp` (24) →
   `purchases.luxuryapp` (19) → `human-resources.luxuryapp` (13).
3. **Fase 3 — Resto:** `legal.luxuryapp` (8) → `management.luxuryapp` (5) → `shared.luxuryapp` (4)
   → `recruitment.luxuryapp` (4) → `core`/`routing` (3).
4. **Fase 4 — Artefacto generado:** una vez corregida la fuente, regenerar
   `appsweb/angular/reports/emoji-audit.json` con su script generador (no editarlo a mano); debe
   quedar en 0 sin intervención manual.
5. **Cierre:** correr `npm run audit:encoding` (o `node scripts/scan-mojibake.mjs appsweb/angular`)
   y confirmar 0 hallazgos reales.

Un PR/commit por módulo es razonable dado que son ubicaciones independientes; no hay necesidad de
coordinarlos en una sola ventana salvo por convención del equipo.

### 5.1 Lección de la Fase 1 — el escáner no ve todo, leer el contexto es obligatorio

Al corregir `accounting.luxuryapp` aparecieron **más corrupciones que las 52 marcadas por el
escáner**, en las mismas líneas o líneas vecinas a un hallazgo real. El diccionario de
`scan-mojibake.mjs` es una lista cerrada de palabras conocidas; no detecta todo. Ejemplos
encontrados leyendo el archivo completo, no solo la línea marcada:

| Patrón adicional (no detectado por el escáner) | Ejemplo real | Corrección |
|---|---|---|
| `é`→`í`/`á` en verbos conjugados | `seré false`, `fallé` | `será false`, `falló` |
| `¡`/mayúscula corrupta al inicio | `óCRóTICO!` | `¡CRÍTICO!` |
| Palabra "Sí" truncada | `'Só' : 'No'` | `'Sí' : 'No'` |
| Guion reemplazado por vocal acentuada | `ENEóDIC` (comentario, cabecera de columna) | `ENE-DIC` |
| `ñ`→`í` (patrón distinto al `ñ`→`ó` documentado) | `DESEMPEíO` | `DESEMPEÑO` |
| Acento faltante en `ó`/`é`/`í` sueltos | `mótodo`, `óxito`, `Mótodo`, `Trómite` | `método`, `éxito`, `Método`, `Trámite` |
| Regex de una sola coincidencia por línea (`match` sin `/g`) | línea con `SECCIóN 4: BOTóN` — el escáner solo reportó `SECCIóN` | Corregir ambas palabras, no solo la reportada |

**Consecuencia práctica para las fases 2-3:** por cada archivo que el escáner señale, **leer la
línea completa y las líneas cercanas** (docstrings, comentarios de bloque, atributos de plantilla)
antes de corregir solo el fragmento marcado. El recuento final de "0" del escáner después de
corregir un módulo es la validación real; el recuento inicial de hallazgos es solo un punto de
partida, no el inventario completo.

**Hallazgo adicional:** el bloque de comentario `/** ⚠️ ADVERTENCIA CRÍTICA... no modificar sin
autorización del Ing. Ricardo Marques */` (7 archivos idénticos en
`general-ledger/budget-proposals/`) tenía la propia palabra "CRÍTICA" corrupta (`CRóTICA`), además
de "lógica" y "explícita". Se corrigió solo el texto de la advertencia; no se tocó código debajo de
ella.

## 6. Criterios de aceptación

- [ ] `node scripts/scan-mojibake.mjs appsweb/angular` reporta 0 hallazgos en `src/app/**`.
- [ ] `appsweb/angular/reports/emoji-audit.json` regenerado, 0 hallazgos.
- [ ] `npm run audit:encoding` (y `npm run lint`) en verde.
- [ ] Sin cambios en contratos serializados, identificadores, rutas ni claves de objeto.
- [ ] Casos ambiguos (`BITó`, `CRó`, `ENEó`, …) documentados con la corrección real aplicada en
      cada uno (para trazabilidad, no hace falta un documento aparte — basta el mensaje de commit).

## 7. Verificación

```bash
# Inventario completo (reproducible en cualquier momento)
node scripts/scan-mojibake.mjs appsweb/angular

# Tras remediar un módulo
node scripts/scan-mojibake.mjs "appsweb/angular/src/app/modules/<modulo>"

# Gate del proyecto
cd appsweb/angular && npm run audit:encoding
```

## 8. Riesgos

- Cross-módulo: puede solaparse con refactors en curso en `accounting.luxuryapp` u
  `operations.luxuryapp` (los dos módulos con más código en movimiento); conviene coordinar con
  quien tenga trabajo activo ahí antes de tocar los mismos archivos.
- Los casos "acento minúscula en palabra MAYÚSCULA" son heurística, no diccionario cerrado:
  pueden existir falsos positivos legítimos (siglas o nombres propios en mayúsculas seguidos de
  una palabra normal). Revisar antes de sustituir.

## 9. Referencias

- [Encoding Rules](../../../conventions/operations/encoding-rules.md)
- [CONVENTIONS.md §6.1, fila 7 (Textos sin mojibake)](../../../conventions/CONVENTIONS.md)
- `conventions/changelog.md` — entradas 2026-09-21 (Fases 1-4 de la mejora de `CONVENTIONS.md`,
  incluida la corrección del escáner que hizo posible esta auditoría)
- `scripts/scan-mojibake.mjs` / `scripts/fix-mojibake.mjs`

## 10. Historial

| Fecha | Cambio |
|-------|--------|
| 2026-09-21 | Auditoría creada a partir de evidencia real, generada corriendo el escáner ya corregido sobre `appsweb/angular`. Remediación no iniciada. |
