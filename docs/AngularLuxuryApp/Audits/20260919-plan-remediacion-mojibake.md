# Plan de Remediación: Mojibake de vocal/acento en Frontend Angular (cross-módulo)

**Fecha:** 2026-09-19
**Alcance:** `appsweb/angular/src/app` (11 módulos)
**Origen:** hallazgo colateral de `docs/OperationsLuxuryApp/Minuta/20260919-auditoria-juntas-mensuales-minuta.md` (M1)
**Tipo:** Plan de remediación (requiere aprobación Tech Lead por ser cross-módulo)
**Estado:** Propuesto

---

## 1. Contexto

El escáner canónico `scripts/scan-mojibake.mjs` (`npm run audit:encoding`) reportaba **0**
hallazgos, pero su heurística ortográfica solo cubría un puñado de tokens
(`Tútulos`, `GESTIóN`, `ASIGNACIóN`, `invólido`, `diólogo`) y la sustitución `óo` (`ñ→ó`).

Al extender temporalmente el escáner con (a) regla de mayúsculas con acento minúscula
(`\b[A-ZÁÉÍÓÚÑ]{2,}[áéíóúñ]`) y (b) diccionario de vocales sustituidas, aparecieron
**254 corrupciones reales** en el frontend. El módulo auditado (`monthly-meetings/meeting-minutes`)
quedó limpio; el resto es deuda preexistente.

**La extensión se revirtió** para no dejar el gate `audit:encoding` en rojo antes de
remediar. Ese es el primer paso de este plan.

## 2. Evidencia (capturada con la heurística extendida, 2026-09-19)

Total: **254** ocurrencias en `appsweb/angular/src/app`.

### 2.1 Distribución por módulo

| Módulo | `.html` | `.ts` | Total |
|--------|--------:|------:|------:|
| accounting.luxuryapp | 29 | 23 | 52 |
| operations.luxuryapp | 23 | 21 | 44 |
| maintenance.luxuryapp | 17 | 7 | 24 |
| admin.luxuryapp | 11 | 13 | 24 |
| purchases.luxuryapp | 10 | 9 | 19 |
| human-resources.luxuryapp | 8 | 5 | 13 |
| legal.luxuryapp | 7 | 1 | 8 |
| management.luxuryapp | 5 | 0 | 5 |
| shared.luxuryapp | 4 | 0 | 4 |
| core / other | 0 | 3 | 3 |
| recruitment.luxuryapp | 3 | 1 | 4 |

### 2.2 Patrones más frecuentes

| Secuencia corrupta | Ocurrencias | Corrección esperada |
|--------------------|------------:|---------------------|
| `mívil` | 64 | `móvil` |
| `SECCIó*` | 20 | `SECCIÓN` |
| `Tútulo*` | 14 | `Título` |
| `segón` | 13 | `según` |
| `CRó*` | 11 | `CRÓNICO` / `CRÓNICA` |
| `INYECCIó*` | 6 | `INYECCIÓN` |
| `óltimo` | 6 | `último` |
| `pógina` | 5 | `página` |
| `lónea` | 4 | `línea` |
| `BITó*` | 4 | revisar caso (posible `débito`/identificador) |
| `DESCRIPCIó*` | 3 | `DESCRIPCIÓN` |
| `PATRó*` | 3 | `PATRÓN` |
| `CATEGORó*` | 3 | `CATEGORÍA` |
| `CONCLUSIó*` | 3 | `CONCLUSIÓN` |
| `CONFIGURACIó*` | 3 | `CONFIGURACIÓN` |
| `RETENCIó*` | 3 | `RETENCIÓN` |
| `ADMINISTRACIó*` | 2 | `ADMINISTRACIÓN` |
| `JUSTIFICACIó*` | 2 | `JUSTIFICACIÓN` |
| `CLASIFICACIó*` | 2 | `CLASIFICACIÓN` |
| `ENEó*` | 2 | revisar caso |

> Las cifras se obtuvieron con la heurística temporal; deben re-verificarse al implementar
> la detección (Paso 0).

## 3. Impacto

- **Usuario:** textos visibles corruptos (`móvil`→`mívil`, `SECCIÓN`→`SECCIóN`), viola §6.1.
- **Tooling:** el gate reporta verde con corrupción real → falsa sensación de limpieza.
- **Riesgo de arreglo:** bajo (texto visible / comentarios), pero cross-módulo → requiere
  aprobación y verificación por módulo.

## 4. Estrategia

1. **Paso 0 — Detección (solo herramienta, sin tocar código de app):**
   ampliar `scripts/scan-mojibake.mjs` con la regla de mayúsculas y el diccionario, pero
   ejecutarla en modo **reporte** (`--report`) que no cambia el exit code, para disponer del
   inventario exacto y por archivo.
2. **Fase 1..N — Remediación por módulo:** corregir de mayor a menor volumen
   (accounting → operations → maintenance → admin → purchases → hr → legal → management →
   shared → core → recruitment). Un PR/commit por módulo.
3. **Cierre — Gate estricto:** una vez el inventario llegue a 0, mover la detección extendida
   a modo estricto (exit 1) y actualizar `conventions`/`AGENTS`.

## 5. Reglas de corrección

- Corregir solo texto visible y comentarios; **no** renombrar identificadores, claves de
  objeto, `data-*`, ni contratos serializados sin análisis (podrían romper runtime).
- Casos ambiguos (`BITó`, `ENEó`, `CRó`) se inspeccionan caso por caso; no sustitución ciega.
- No usar `fix-mojibake.mjs` en bloque sin revisión: su roundtrip no cubre este tipo de
  corrupción.

## 6. Criterios de aceptación

- [ ] Inventario exacto generado (Paso 0) y archivado junto a este plan.
- [ ] `npm run audit:encoding` reporta 0 con la detección extendida **estricta**.
- [ ] `npm run lint` en verde.
- [ ] Sin cambios en contratos serializados ni identificadores.
- [ ] Verificación visual (build) en los módulos con `.html` corregidos.

## 7. Verificación

```bash
# Inventario (modo reporte, no fatal)
node scripts/scan-mojibake.mjs appsweb/angular/src/app --report

# Tras remediar cada módulo
node scripts/scan-mojibake.mjs "appsweb/angular/src/app/modules/<modulo>"

# Gate final
cd appsweb/angular && npm run lint
```

## 8. Riesgos

- Cross-módulo: puede solaparse con refactors en curso; coordinar ventana.
- Falsos positivos posibles en identificadores `SCREAMING_CASE` con acento (revisar, no sustituir a ciegas).

## 9. Relación con scanner actual

El comentario agregado en `scripts/scan-mojibake.mjs` deja constancia de que esta deuda
existe y apunta a este plan. No se activa la detección estricta hasta cerrar el inventario.

## 10. Historial

| Fecha | Cambio |
|-------|--------|
| 2026-09-19 | Plan creado. Extensión de escáner revertida para mantener el gate en verde. |
