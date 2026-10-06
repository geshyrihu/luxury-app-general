# NativeCollections Module Conventions

**Ultima revision:** 2026-10-06 (renombrado de nomenclatura legacy española `CobranzaNativa` a la nomenclatura oficial `NativeCollections`; links corregidos tras migración de documentación a `docs/`)
**Estado:** Vigente
**Deriva de:** [CONVENTIONS.md](../CONVENTIONS.md)

> **Nota histórica:** este módulo se llamó `CobranzaNativa` (backend
> `CobranzaLuxuryApp`, frontend `cobranza.luxuryapp`) hasta el rename a
> inglés de 2026-09 (commit `b2fcb3cad` en `appsweb/angular`). Hoy es
> `NativeCollections` dentro de `CollectionsLuxuryApp` / `collections.luxuryapp`
> (ver CONVENTIONS.md §6bis, catálogo de módulos oficiales). Varios nombres de
> **archivo físico** (ej. `reglas-negocio-cobranza-nativa.md`,
> `cobranza-nativa.routing.ts`) conservan el nombre español porque no se han
> renombrado en el código real — este documento los referencia tal cual
> existen, no inventa rutas nuevas.

## Proposito

Definir la guia rectora especifica de `NativeCollections` para cualquier agente o
desarrollador que implemente, audite, remedie o documente este modulo.

Este documento no sustituye las convenciones globales del proyecto. Su funcion
es aterrizarlas al dominio real de `NativeCollections`, indicar que carpetas y
documentos gobiernan el modulo, y fijar las reglas funcionales que no deben
romperse mientras se resuelve este sistema.

## Alcance del modulo

`NativeCollections` pertenece al dominio maestro `CollectionsLuxuryApp` y mapea al
dominio frontend `collections.luxuryapp`.

Rutas base vivas del modulo:

- backend:
  [api/LuxuryApp.Application/Modules/CollectionsLuxuryApp/NativeCollections](../../api/LuxuryApp.Application/Modules/CollectionsLuxuryApp/NativeCollections)
- frontend:
  [appsweb/angular/src/app/modules/collections.luxuryapp/native-collections](../../appsweb/angular/src/app/modules/collections.luxuryapp/native-collections)

## Orden de lectura obligatorio para trabajar en NativeCollections

### Implementacion o remediacion backend

1. [CONVENTIONS.md](../CONVENTIONS.md)
2. [Workflow por Tipo de Tarea](../core/workflow-por-tipo-de-tarea.md)
3. [Backend Rules](../backend/backend-rules.md)
4. [Backend Module Structure](../backend/backend-module-structure.md)
5. Este documento
6. [reglas-negocio-cobranza-nativa.md](../../docs/CollectionsLuxuryApp/NativeCollections/reglas-negocio-cobranza-nativa.md)
7. [documentacion-cuestionario-cobranza-nativa.md](../../docs/CollectionsLuxuryApp/NativeCollections/documentacion-cuestionario-cobranza-nativa.md)
8. [documentacion-logica-reportes-cobranza.md](../../docs/CollectionsLuxuryApp/NativeCollections/documentacion-logica-reportes-cobranza.md)

### Implementacion o remediacion frontend

1. [CONVENTIONS.md](../CONVENTIONS.md)
2. [Workflow por Tipo de Tarea](../core/workflow-por-tipo-de-tarea.md)
3. [Frontend Rules](../frontend/frontend-rules.md)
4. [UI Desktop Rules](../ui/ui-desktop-rules.md)
5. [UI Mobile Rules](../ui/ui-mobile-rules.md)
6. [Styles Rules](../styles/styles-rules.md)
7. Este documento
8. [COBRANZA-NATIVA-DOCUMENTACION-MAESTRA-2026-07-03.md](../../docs/CollectionsLuxuryApp/NativeCollections/COBRANZA-NATIVA-DOCUMENTACION-MAESTRA-2026-07-03.md)
9. [ORGANIZACION-FRONTAL-CNATIVA-2026-07-26.md](../../docs/CollectionsLuxuryApp/NativeCollections/ORGANIZACION-FRONTAL-CNATIVA-2026-07-26.md)
10. [02-matriz-operativa-front-cobranza-nativa.md](../../docs/CollectionsLuxuryApp/NativeCollections/02-matriz-operativa-front-cobranza-nativa.md)

### Auditoria de modulo

1. [CONVENTIONS.md](../CONVENTIONS.md)
2. [Audit Module Conventions](../audit/audit-module-conventions.md)
3. Este documento
4. Documentacion backend y frontend enlazada arriba
5. Submodulos reales del dominio, no solo la raiz

## Mapa estructural obligatorio del modulo

### Backend

El backend de `NativeCollections` esta organizado por dominios internos en
`Core/`, ademas de `Contracts/ExternalCompatibility/`.

Dominios internos detectados:

- `Approvals`
- `Audit`
- `Charges`
- `ChargeTypes`
- `CollectionCases`
- `Fines`
- `Invoices`
- `LateFees`
- `Ledger`
- `Members`
- `Metrics`
- `Notifications`
- `Payments`
- `PeriodClosures`
- `Reconciliation`
- `Statements`
- `Templates`

Regla:

- cualquier auditoria o remediacion de `NativeCollections` debe declarar
  explicitamente que subdominios toca
- no se permite tratar `NativeCollections` como un modulo plano

### Frontend

El frontend esta organizado principalmente en:

- `entry/`
- `core/`
- `configuration/`
- `contracts/` (incluye `external-compatibility/` y `native/`)
- `interfaces/`
- `onboarding/`
- `architecture/`
- `docs/`

La ruta de entrada principal del modulo es:

- [cobranza-nativa.routing.ts](../../appsweb/angular/src/app/modules/collections.luxuryapp/native-collections/cobranza-nativa.routing.ts) — nombre de archivo físico aún no renombrado a inglés

## Reglas rectoras especificas de NativeCollections

### 1. Es un subsistema financiero auditable

`NativeCollections` no debe tratarse como un CRUD comun. Cualquier cambio debe
preservar su naturaleza de subsistema financiero con:

- trazabilidad
- auditabilidad
- ledger
- cierres de periodo
- maker-checker
- controles de integridad

### 2. No romper invariantes financieras del modulo

Con base en la documentacion tecnica viva del modulo, cualquier agente debe
preservar estas invariantes:

- no permitir cruces `CustomerId` o `PropertyId` entre pagos, cargos,
  asignaciones, miembros o expedientes
- no saltarse reglas de idempotencia en comandos sensibles como generar cargos,
  aplicar pagos, cancelar pagos o recalcular recargos
- no bypass de cierres de periodo
- no bypass del flujo de aprobaciones financieras
- no escribir cambios financieros que eviten el ledger o destruyan su
  trazabilidad

Si una correccion exige alterar una de estas invariantes, primero va analisis de
impacto y plan aprobado.

### 3. Contratos externos y compatibilidad deben tratarse como zona sensible

La carpeta:

- [Contracts/ExternalCompatibility](../../appsweb/angular/src/app/modules/collections.luxuryapp/native-collections/contracts/external-compatibility)

se considera zona de alta sensibilidad contractual.

Reglas:

- no modificar contratos externos ni capas de compatibilidad sin analisis de
  impacto y aprobacion explicita
- si hay que retirar o sustituir compatibilidad externa, debe existir plan de
  migracion aprobado

### 4. Backend y frontend deben mantenerse alineados por subdominio

Regla operativa:

- `Core/<Subdominio>` en backend debe mapearse al feature equivalente del
  frontend cuando exista
- los nombres semanticos de subdominio deben conservarse entre stacks
- si un feature frontend consume otro dominio del sistema, eso debe quedar
  documentado y justificado; no debe ocurrir por conveniencia silenciosa

### 5. Rutas publicas actuales del modulo se consideran contrato sensible

La documentacion viva del modulo muestra hoy un esquema publico basado en
`api/accounting-coi/native-collection/*`.

Mientras no exista plan de migracion aprobado:

- no se renombra la ruta publica por iniciativa propia
- no se cambia el shape serializado de responses sensibles
- no se mueve un endpoint de dominio sin inventario de consumidores

### 6. Mobile y desktop forman parte del diseno obligatorio del modulo

La documentacion viva de `NativeCollections` ya declara decisiones de responsive y
separacion de vistas en casos puntuales.

Reglas:

- auditar siempre desktop y mobile cuando el subdominio tenga UI operativa
- si un flujo del modulo usa componentes separados para mobile, la remediacion
  debe revisar ambas variantes
- modales, tablas, estados de cuenta y pagos no se consideran correctamente
  resueltos si solo funciona una variante visual

### 7. Documentacion del modulo ya existe y debe actualizarse antes de crear duplicados

Antes de crear nueva documentacion para `NativeCollections`, primero validar estas
fuentes existentes:

- [docs/CollectionsLuxuryApp/NativeCollections/](../../docs/CollectionsLuxuryApp/NativeCollections/)

Si un documento esta vigente pero incompleto, se actualiza.
Si un documento es historico o desalineado, se reporta y se deja subordinado.

## Criterios de trabajo para agentes

### Si la tarea es auditoria

- cubrir backend, frontend, UI, styles y documentacion
- cubrir los subdominios reales tocados
- verificar contratos, ledger, aprobaciones, cierres, idempotencia y frontera
  de propiedad
- no dar por auditado el modulo revisando solo dashboard o pagos

### Si la tarea es remediacion

- primero analisis
- luego plan por fases
- despues ejecucion aprobada
- actualizar estatus del plan y la documentacion afectada

### Si la tarea es implementacion nueva

- respetar la organizacion por subdominio ya existente
- no introducir carpetas paralelas si ya existe un subdominio equivalente
- no crear servicios transversales nuevos si el catalogo o el dominio ya cubre
  el caso

## Referencias oficiales del modulo

Todas viven en [docs/CollectionsLuxuryApp/NativeCollections/](../../docs/CollectionsLuxuryApp/NativeCollections/):

- [reglas-negocio-cobranza-nativa.md](../../docs/CollectionsLuxuryApp/NativeCollections/reglas-negocio-cobranza-nativa.md)
- [reglas-negocio-cobranza.md](../../docs/CollectionsLuxuryApp/NativeCollections/reglas-negocio-cobranza.md)
- [documentacion-cuestionario-cobranza-nativa.md](../../docs/CollectionsLuxuryApp/NativeCollections/documentacion-cuestionario-cobranza-nativa.md)
- [documentacion-logica-reportes-cobranza.md](../../docs/CollectionsLuxuryApp/NativeCollections/documentacion-logica-reportes-cobranza.md)
- [COBRANZA-NATIVA-DOCUMENTACION-MAESTRA-2026-07-03.md](../../docs/CollectionsLuxuryApp/NativeCollections/COBRANZA-NATIVA-DOCUMENTACION-MAESTRA-2026-07-03.md)
- [ORGANIZACION-FRONTAL-CNATIVA-2026-07-26.md](../../docs/CollectionsLuxuryApp/NativeCollections/ORGANIZACION-FRONTAL-CNATIVA-2026-07-26.md)
- [02-matriz-operativa-front-cobranza-nativa.md](../../docs/CollectionsLuxuryApp/NativeCollections/02-matriz-operativa-front-cobranza-nativa.md)
