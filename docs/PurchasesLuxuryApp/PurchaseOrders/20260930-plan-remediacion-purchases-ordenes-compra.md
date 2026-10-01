# 🛠️ Plan de Remediación: Órdenes de Compra

### 🔀 12 hallazgos de coherencia → 1 ruta por fases con puerta de aprobación antes de tocar una línea

> **Tipo:** Plan de Remediación (deriva del análisis `20260930-analisis-purchases-ordenes-compra.md`).
> Aplica **las 6 reglas obligatorias** de `DOCUMENT-RULES-MANDATORY.md` (Reglas 1-6).
> **Estado:** ⏳ Pendiente de aprobación. No se ejecuta nada hasta autorización explícita.
> **Supersede:** `20260730-remediacion-purchases-ordenes-compra.md` (legacy, rutas muertas). Ver §Metadata.

---

## 📋 Metadata

| Campo | Valor |
|---|---|
| Módulo backend | `api/LuxuryApp.Application/Modules/PurchasesLuxuryApp/Purchases/` |
| Módulo frontend | `appsweb/angular/src/app/modules/purchases.luxuryapp/purchase-orders/` |
| Tipo | Plan de Remediación |
| Origen | Hallazgos H-01..H-12 de `20260930-analisis-purchases-ordenes-compra.md` |
| Auditoría previa | `docs/PurchasesLuxuryApp/PurchaseOrders/20260730-auditoria-purchases-ordenes-compra.md` |
| Plan superseded | `docs/PurchasesLuxuryApp/PurchaseOrders/20260730-remediacion-purchases-ordenes-compra.md` |
| Docs de ejecución | `docs/PurchasesLuxuryApp/PurchaseOrders/20260930-changelog-purchases-ordenes-compra.md` |
| Responsable de aprobación | Owner de convenciones / Tech Lead |
| Datos reales | Sí — OC en producción; migración de columnas requiere protocolo |
| Fecha | 2026-09-30 |

> ⚠️ **Justificación de no duplicar:** el plan previo (2026-07-30) usa rutas `SupplierLuxuryApp/Purchases/OrdenCompra` y `client/angular/.../supplier.luxuryapp/po/purchase-order`, inexistentes hoy. Es legacy (< corte 2026-09-16) y se marca superseded; este plan lo reemplaza re-anclado a rutas reales.

---

## 📌 Resumen Ejecutivo (FASE 0 · 0.1)

**Problem Statement:**

Actualmente el equipo de mantenimiento del módulo **sufre de lógica contable divergente y reglas de negocio replicadas** cuando intenta evolucionar Órdenes de Compra (fondeo, gastos fijos, fuera de fondeo), lo que resulta en **riesgo de importes incorrectos al proveedor y bloqueos inconsistentes** entre los 6 submodulos.

**KPIs**

| Métrica | Baseline | Target | Timeline | Verificación |
|---|---|---|---|---|
| Fórmulas de total distintas | 3 | 1 | Fin Fase 1 | `grep` de `CalcularTotal`/`InporteTotal`/`Total` |
| Copias de `GetFundingConfirmedErrorAsync` | 5 | 1 | Fin Fase 2 | `grep` en `Purchases/` |
| Contratos `object`/`List<object>` | 2 | 0 | Fin Fase 3 | `grep` `ApiResponseDTO<object>` |
| GUIDs de catálogo hardcodeados | 6 | 0 | Fin Fase 4 | `grep` de GUIDs literales |
| `any` productivo en flujos frontend | Alto | Medio | Fin Fase 6 | `eslint`/`grep` |
| Pruebas de totales y candado | 0 | ≥4 | Fin Fase 7 | `dotnet test` |

**Objetivo:**

Remediar el módulo de Órdenes de Compra por fases, de modo que:
1. Exista **una sola fuente de cálculo de totales** (backend y frontend).
2. El candado de fondeo viva en **un solo lugar**.
3. Los contratos públicos devuelvan DTOs explícitos.
4. No queden GUIDs de catálogo hardcodeados.
5. Se elimine el borrado silencioso de OC.
6. El frontend deje de usar `any` en flujos principales.
7. Cada fase tenga criterio de paso verificable y automatización definida.

---

## 🗺️ Alcance

**Dentro de alcance:**
- Convergencia de fórmulas de total: `OrdenCompraDetalle.Total`, `CustomOrdenesCompra`, `OrdenCompraExtensions`, `pdf-generation.service.ts`.
- Extracción del candado de fondeo a helper único.
- Contratos de `GetForEdit` y `CotizacionesRelacionadasAsync`.
- Defaults fiscales hardcodeados (UsoCFDI/Forma/Metodo) en progresiva y fuera de fondeo.
- Borrado silencioso de OC incompletas al listar gastos fijos.
- Naming/estructura de columnas `Indice`/`FundingId` — **solo propuesta**, requiere migración.
- Tipado del frontend principal.
- Documentación Nivel 1/2 y pruebas mínimas.

**Fuera de alcance (confirmado):**
- Rediseño del flujo de negocio (no cambia comportamiento, solo se estabiliza).
- Mover archivos o reorganizar carpetas (`/forms`, `/parcials`) — decisión separada.
- Refactor total del God service (H-04) — se abordan síntomas, no el split completo.

**Inventario de cambios**

| Componente | Cambio | Esfuerzo | Status |
|---|---|---|---|
| Backend: totales | Unificar 3 fórmulas | M | ⏳ |
| Backend: candado fondeo | Extraer helper único | S | ⏳ |
| Backend: contratos | DTOs explícitos | M | ⏳ |
| Backend: integridad | GUIDs + borrado silencioso + transacciones | M | ⏳ |
| Backend: naming columnas | Propuesta `[Column]`/migración | S (propuesta) | ⏳ |
| Frontend: typing | Retirar `any` flujos principales | L | ⏳ |
| Frontend: totales | Consumir total backend | M | ⏳ |
| Pruebas | Totales + candado | M | ⏳ |
| Docs Nivel 1/2 | README + documentación técnica | M | ⏳ |

**Leyenda (S/M/L):** S = Small (1-2h), M = Medium (2-8h), L = Large (>8h).

---

## 🏛️ Arquitectura & Diseño Técnico

### Matriz de Reglas de Negocio (FASE 0 · 0.2)

**Nivel 1 — Invariantes de Dominio**

| RN | Regla | Componente |
|---|---|---|
| RN-OC-001 | Toda OC pertenece a un único `CustomerId` | `OrdenCompra`, todos los services |
| RN-OC-002 | Una OC tiene 1 `Auth`, 1 `DatosPago`, 1 `Status` | `AddAsync`, `AddProgressiveAsync` |
| RN-OC-003 | Total neto = SubTotal + IVA − RetIVA − RetISR | `OrdenCompraDetalle`, fórmulas H-01 |

**Nivel 2 — Flujo y Estados**

| RN | Regla | Componente |
|---|---|---|
| RN-OC-010 | `Pendiente → Autorizado / Denegado` | `OrdenCompraAuthAppService` |
| RN-OC-011 | Cambio de autorización sincroniza `SolicitudCompra.Estatus` | `OrdenCompraAuthAppService:58-67,89-98,130-139` |
| RN-OC-012 | Gastos fijos/progresiva/fuera de fondeo nacen `Autorizado` | `OrdenCompraAppService:1457,1622,1712` |
| RN-OC-013 | No se elimina OC si `SePago = true` | `OrdenCompraAppService:1177` |

**Nivel 3 — Seguridad / Autorización**

| RN | Regla | Componente |
|---|---|---|
| RN-OC-020 | `api/orden-compra` requiere autenticación | `OrdenCompraEndPoints:10` |
| RN-OC-021 | Fuera de fondeo (crear/quitar) por rol | `OrdenCompraEndPoints:67,73` |

**Nivel 4 — Validación de Datos**

| RN | Regla | Componente |
|---|---|---|
| RN-OC-030 | Fondeo confirmado/validado bloquea edición | Ms. `GetFundingConfirmedErrorAsync` ×5 |
| RN-OC-031 | `GenerarOrdenCompraFijos` rechaza fondeo verificado | `OrdenCompraAppService:1339` |
| RN-OC-032 | `Indice` se reindexa ante colisión | `OrdenCompraAppService:1391-1431` |

### Decisiones de Diseño (Por qué)

| Decisión | Alternativa rechazada | Razón |
|---|---|---|
| Fuente única de total en backend, frontend la consume | Mantener cálculo paralelo en Angular | Evita divergencia (H-07); backend es autoridad del importe |
| Helper único de candado de fondeo | Atributo de filtro global | Menor riesgo: no cambia pipeline HTTP, solo deduplica |
| DTOs explícitos en contratos públicos | Dejar `object` | Cumple convención de contratos y tipado frontend |
| GUIDs vía `CustomersIdLuxury` o resolución por código | Mantener literales | Catálogos pueden cambiar; literales son frágiles |
| Naming de columnas solo como propuesta | Renombrar columnas en este plan | Rename de columna = migración → requiere protocolo y aprobación aparte |

---

## 🛤️ Fases

### Fase 0 — 🚧 Control de cambios

| Atributo | Valor |
|---|---|
| Owner | Tech Lead |
| Esfuerzo estimado | 0 (gate) |
| Dependencias previas | Aprobación de este plan |
| Criterio de éxito | Plan aprobado y changelog creado |

Restricciones obligatorias antes de ejecutar cualquier fase.

**Checklist:**
- [ ] No tocar shared sin análisis de impacto y aprobación
- [ ] No romper contratos serializados sin inventario de consumidores
- [ ] No reubicar archivos por iniciativa propia
- [ ] Migración de columnas solo con protocolo y aprobación
- [ ] Plan aprobado por owner

### Fase 1 — 🧮 Convergencia de totales

| Atributo | Valor |
|---|---|
| Owner | Backend Lead |
| Esfuerzo estimado | 1-2 días |
| Dependencias previas | Fase 0 |
| Criterio de éxito | 1 fórmula, paridad verificada en tests |

Unificar `OrdenCompraDetalle.Total`, `CustomOrdenesCompra.InporteTotal`, `OrdenCompraExtensions.CalcularTotalDetalles` (H-01) y alinear el cálculo del frontend (H-07).

**Checklist:**
- [ ] Definir fuente única de cálculo
- [ ] Reemplazar los 3 usos backend
- [ ] Frontend consume total del backend
- [ ] Tests de paridad en verde

### Fase 2 — 🔒 Candado de fondeo único

| Atributo | Valor |
|---|---|
| Owner | Backend Lead |
| Esfuerzo estimado | 1 día |
| Dependencias previas | Fase 1 |
| Criterio de éxito | 1 helper, 0 copias, mismo mensaje |

Extraer `GetFundingConfirmedErrorAsync` de los 5 services a un helper compartido (H-02).

**Checklist:**
- [ ] Crear helper/interface único
- [ ] Reemplazar las 5 copias
- [ ] Mensajes de bloqueo idénticos
- [ ] Build sin warnings nuevos

### Fase 3 — 🔌 Contratos backend

| Atributo | Valor |
|---|---|
| Owner | Backend Lead |
| Esfuerzo estimado | 1-2 días |
| Dependencias previas | Fase 2 |
| Criterio de éxito | 0 `object`/`List<object>` en contratos públicos |

DTOs explícitos para `GetForEdit` (H-08) y `CotizacionesRelacionadasAsync` (H-08); normalizar `GetSolicitudPagoPdf` que retorna `null` (H-05); evaluar entidad-como-DTO (H-09).

**Checklist:**
- [ ] DTO explícito `GetForEdit`
- [ ] DTO explícito cotizaciones relacionadas
- [ ] Normalizar retorno de `GetSolicitudPagoPdf`
- [ ] Inventario de consumidores frontend

### Fase 4 — 🛡️ Integridad operativa

| Atributo | Valor |
|---|---|
| Owner | Backend Lead |
| Esfuerzo estimado | 1-2 días |
| Dependencias previas | Fase 3 |
| Criterio de éxito | 0 GUIDs hardcodeados, 0 borrados silenciosos |

Reemplazar GUIDs de catálogo hardcodeados (H-06); eliminar borrado silencioso de OC incompletas en `OrdenesCompraGastosFijosAsync` (H-12); revisar transacciones de los flujos compuestos.

**Checklist:**
- [ ] GUIDs vía fuente oficial (`CustomersIdLuxury`/resolución)
- [ ] Retirar borrado silencioso de OC
- [ ] Frontera transaccional documentada por flujo
- [ ] Revisar escalado `Amount * 1.16M`

### Fase 5 — 🧾 Naming de columnas (propuesta)

| Atributo | Valor |
|---|---|
| Owner | Tech Lead + Backend |
| Esfuerzo estimado | Propuesta (ejecución >8h si se aprueba) |
| Dependencias previas | Fase 4 |
| Criterio de éxito | Propuesta de migración aprobada o descartada |

Resolver `Indice`↔columna `FundingId` y `FundingId`↔columna `FundingGuidId` (H-03). **No se ejecuta sin aprobación de migración.**

**Checklist:**
- [ ] Documentar mapeo actual y destino
- [ ] Definir estrategia (`[Column]` rename vs migración)
- [ ] Aprobación Tech Lead
- [ ] Plan de migración si aplica

### Fase 6 — 🖥️ Frontend typing y estado

| Atributo | Valor |
|---|---|
| Owner | Frontend Lead |
| Esfuerzo estimado | 2-4 días |
| Dependencias previas | Fase 3 (contratos) |
| Criterio de éxito | Sin `any` en flujos principales, sin strings mágicos |

Tipar listado, detalle, create, wizard, forms (H-10); reemplazar `"Autorizado"` por enum.

**Checklist:**
- [ ] Tipar `orden-compra-list.ts` y `orden-compra.ts`
- [ ] Tipar create y wizard
- [ ] Sustituir strings de estatus por enum
- [ ] Retirar cálculo de totales local (H-07)

### Fase 7 — 📚 Documentación y pruebas

| Atributo | Valor |
|---|---|
| Owner | Backend + Frontend |
| Esfuerzo estimado | 1-2 días |
| Dependencias previas | Fase 6 |
| Criterio de éxito | §4.7 Nivel 1/2 + ≥4 tests |

Generar los 6 documentos obligatorios de módulo (§4.7) y pruebas mínimas; registrar `ITotalesOrdenCompraDetallleService` en DI si es gap (H-11).

**Checklist:**
- [ ] README Nivel 1 y documentación Nivel 2
- [ ] Tests de totales
- [ ] Tests de candado de fondeo
- [ ] Verificar DI de `ITotalesOrdenCompraDetallleService`

---

## 🚦 Criterios de Paso

**Happy path:** crear OC → autorizar → marcar fondeo → validar fondeo → el sistema bloquea edición en los 5 services.
**PASS si:** el bloqueo es idéntico y el total coincide en backend, carátula y PDF.
**Automatización:** Unit test en xUnit (`GetFundingConfirmed_Blocks_AllSubmodules`, `Totals_Backend_Matches_Frontend`).

**Sad path:** editar OC de un fondeo ya confirmado.
**PASS si:** `ErrorResult` con mensaje de fondeo confirmado; sin persistencia.
**Automatización:** Unit test en xUnit por cada service de la Fase 2.

**Edge path:** `GenerarOrdenCompraFijosAsync` con `Indice` duplicado.
**PASS si:** reindexa a `{major}.{maxMinor+1}`sin error.
**Automatización:** Unit test en xUnit (`GenerarFijos_DuplicateIndice_Reindexes`).

**Edge path (regresión):** listar gastos fijos con una OC con hijos nulos.
**PASS si:** la OC **no** se borra silenciosamente.
**Automatización:** Unit test en xUnit (`ListFixedExpenses_IncompleteOrder_NotDeleted`).

---

## ⚠️ Riesgos y Mitigaciones

| Supuesto fallido | Impacto | Probabilidad | Mitigación | Owner |
|---|---|---|---|---|
| 🔴 Cambiar la fórmula de total altera importes ya fondeados | Discrepancia de pago al proveedor | Media | Fase 1 con tests de paridad y muestra de OC reales | Backend |
| 🔴 Migración de columnas `Indice`/`FundingId` sin conteo previo | Pérdida de datos / romper FK | Media | Fase 5 exige plan de migración aprobado y rollback | Tech Lead |
| Deduplicar candado cambia el mensaje/orden de validación | Consumidor frontend deja de mostrar el aviso | Media | Congelar mensajes exactos; inventario de consumidores | Backend |
| Retirar borrado silencioso deja OC basura visibles | Datos sucios en listados | Media | Reporte previo de OC incompletas antes de retirar | Backend |
| Tipado frontend rompe wizard multi-paso | Pérdida de progreso en captura | Media | Fase 6 con pruebas del wizard | Frontend |

---

## 🔗 Dependencias e Impactos

| Sistema | Relación | Versión mínima | Impacto en este plan |
|---|---|---|---|
| `SolicitudCompra` | **Depende de** | Actual | Alto — sincroniza estatus en autorización |
| `Funding` (Fondeo) | **Depende de** | Actual | Alto — candado y periodo |
| `Aspel` (`IAspelQuotationService`) | **Depende de** | Actual | Medio — presupuesto en `GetByIdAsync` |
| `BudgetToPurchaseOrderDTO` | **Impacta** | Actual | Medio — referenciado por `SolicitudCompra/Presupuesto` |
| `CustomersIdLuxury` (catálogos) | **Depende de** | Actual | Medio — defaults fiscales |
| Frontend `supplier.endpoints.ts` | **Impacta** | Actual | Medio — contratos de rutas |
| `ApplicationDbContext` de otros módulos | **No impacta** | N/A | Cero — alcance contenido |

---

## 🏁 Cierre Esperado

Órdenes de Compra queda con **una fórmula de total**, **un candado de fondeo**, **contratos tipados**, **cero GUIDs hardcodeados** y **sin borrados silenciosos**, con documentación Nivel 1/2 y pruebas mínimas. Cada cambio se registra en `20260930-changelog-purchases-ordenes-compra.md` **en el momento de autorizarse y ejecutarse**, cerrando el círculo auditoría → análisis → plan → ejecución → evidencia.

---

## ☑️ Checklist de cumplimiento (6 reglas obligatorias)

- [x] **REGLA 1:** §Alcance con tabla Componente | Cambio | Esfuerzo (S/M/L) | Status
- [x] **REGLA 2:** §Dependencias es tabla Sistema | Relación | Versión | Impacto
- [x] **REGLA 3:** §Decisiones de Diseño con tabla Decisión | Alternativa | Razón
- [x] **REGLA 4:** cada Fase con tabla Owner | Esfuerzo | Dependencias | Criterio éxito
- [x] **REGLA 5:** cada criterio de paso especifica Automatización
- [x] **REGLA 6:** riesgos críticos marcados con 🔴
