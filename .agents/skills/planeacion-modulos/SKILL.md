---
name: planeacion-modulos
description: >-
  Planeación inteligente de módulos LuxuryApp (nuevo, ampliación o auditoría) ANTES de
  escribir código. Guía al agente a actuar como arquitecto de software senior que elicita
  requisitos del negocio con el dueño del módulo, reconoce la estructura de entidades
  existentes, y produce planes con puertas de aprobación. Usar cuando el usuario diga
  "planeación de módulos", "planear módulo", "crear/ampliar/auditar módulo", o quiera
  trazar un módulo completo antes de implementar.
---

# 🧠 Planeación Inteligente de Módulos (LuxuryApp)

Skill de **facilitación de requisitos + trazabilidad a código** para módulos nuevos,
ampliación o auditoría. NO es la fuente de normas: delega el contenido normativo a
`CONVENTIONS.md` y a `conventions/operations/*`. Aquí vive solo el
**protocolo de conversación y los gates**.

## Regla de oro

> Antes de proponer, modelar o escribir CUALQUIER código (entidades, campos, DTOs,
> endpoints, migraciones), el agente debe (1) entender el problema de negocio y (2)
> reconocer y traducir a español las entidades existentes. El código es inglés; el
> negocio habla español. El puente es un reporte legible.

## Posición respecto al canon (no duplicar)

- Las reglas normativas viven en `CONVENTIONS.md` (única fuente de verdad) y en
  `conventions/operations/*`. Esta skill las **referencia**, no las copia.
- El flujo obligatorio oficial es `CONVENTIONS.md §4.6` (Creación de Módulo Nuevo) y
  `§5.9` (Módulo Nuevo → FASE 0 → Plan → Auditoría). Esta skill es el *facilitador* que
  prepara los insumos para ese flujo.
- Para la generación formal de documentación/auditoría/plan ya existe
  `skills/docs-workflow/` (prompts + templates). Esta skill se detiene en el plan
  aprobado y delega la redacción técnica final a `docs-workflow` + plantillas canónicas.

## Documentos canónicos que el agente DEBE leer según el paso

| Paso | Documento canónico | Ruta |
|------|-------------------|------|
| Discovery | Plantilla de cuestionario | `conventions/operations/discovery-questionnaire-template.md` |
| FASE 0 | Business Rules Discovery | `conventions/operations/fase-0-business-rules-discovery.md` |
| Plan | Plan Creation Protocol | `conventions/operations/plan-creation-protocol.md` |
| Plan | Plan Agent Instructions | `conventions/operations/plan-agent-instructions.md` |
| Roles | Catálogo de Roles | `conventions/operations/application-roles-catalog.md` + `api/LuxuryApp.Application/Shared/Enums/ApplicationRoleEnum.cs` |
| Migración | Data Migration Protocol | `conventions/operations/data-migration-protocol.md` |
| Aplicabilidad | Cuándo NO aplica FASE 0 | `fase-0-business-rules-discovery.md` (sección "Cuándo Aplicar") |

## Flujo de trabajo

```text
PASO 0   Identificar tipo (A/B/C) + registrar rutas
   ↓
PASO 0.5 Reconocimiento de Estructura de Entidades  → 01b-entidad-estructura.md
   ↓
PASO 1   Cuestionario de Discovery (1 pregunta a la vez)  → 01-discovery-cuestionario.md
   ↓
PASO 2   FASE 0 (Problema, KPIs, Reglas 4 niveles, Flujos, Pre-Mortem)
         → 02-business-rules-analysis.md   [formato canónico, ver abajo]
   ↓
PASO 3   Riesgos + Dependencias  → 03-riesgos-dependencias.md
   ↓
PASO 4   Plan de Implementación (11 secciones mínimas)  → 04-implementation-plan.md
   ↓
PASO 5   Revisión y aprobación final (gates objetivos)
```

---

## PASO 0: Identificar el tipo de trabajo

Pregunta al usuario:

> "¿Qué necesitamos hacer?
> **A)** Crear un módulo nuevo · **B)** Ampliar módulo existente · **C)** Auditar módulo existente
> Además dame: Ruta Backend `api/LuxuryApp.Application/Moduls/[ModuloLuxuryApp]/`,
> Ruta Frontend `appsweb/angular/src/app/apps/[modulo].luxuryapp/`, nombre del módulo y
> objetivo en una frase."

Registra en el documento raíz del módulo: tipo (A/B/C), rutas, objetivo.

---

## PASO 0.5: Reconocimiento de Estructura de Entidades (OBLIGATORIO antes de proponer código)

Evita el "volver atrás a mitad del plan". El agente lee el código y lo traduce a negocio.

### Dónde vive realmente cada cosa (verificado en el repo)

Las entidades **NO** están en `LuxuryApp.Application`. Esa capa sólo tiene servicios, DTOs y
endpoints. Buscar entidades ahí lleva a una carpeta vacía.

| Qué buscas | Ruta real |
|------------|-----------|
| Entidades (clases C#) | `api/LuxuryApp.Application/Modules/[ModuloLuxuryApp]/[Submódulo]/Entities/` |
| Áreas bajo `Tenant/` | `Accounting`, `Hr`, `Legal`, `Maintenance`, `Operations`, `Purchasing`, `Recruitment` |
| Configuraciones EF (cuando existen) | `api/LuxuryApp.Application/Infrastructure/Data/EntityConfigurations/[Área]/*Configuration.cs` |
| `DbSet<>` + Fluent API inline | `api/LuxuryApp.Application/Infrastructure/Data/ApplicationDbContext.cs` |
| Servicios / DTOs / Endpoints | `api/LuxuryApp.Application/Moduls/[ModuloLuxuryApp]/` |

### El mapeo se define en TRES lugares, no en uno

Un `*Configuration.cs` por entidad **no es la norma en este repo**. Muchos módulos no tienen
ninguno. Para conocer tablas, índices y relaciones reales hay que revisar los tres:

1. **Anotaciones en la propia entidad** — `[Table]`, `[Column]`, `[Required]`, `[MaxLength]`,
   `[Index]`, `[Display]`. Es el mecanismo más usado.
2. **`IEntityTypeConfiguration`** en `Data/EntityConfigurations/` — se registran solos vía
   `ApplyConfigurationsFromAssembly` (`ApplicationDbContext.cs`). Sólo algunos módulos los usan.
3. **Fluent API inline** dentro de `OnModelCreating` en `ApplicationDbContext.cs` — precisión
   de decimales, índices, `HasQueryFilter`, `UseTpcMappingStrategy`, relaciones puntuales.

Si el agente sólo mira (2), reportará que "no hay configuración" cuando sí la hay.

**Comportamientos globales que aplican aunque la entidad no los declare:**
- **Soft delete:** toda entidad que implemente `ISoftDeletable` recibe un query filter global
  que oculta los borrados. Para verlos: `.IgnoreQueryFilters()`.
- **Multi-cliente:** `ITenantEntity` marca aislamiento por `CustomerId`. **Verificar entidad por
  entidad**: dentro de una misma carpeta conviven entidades con y sin tenancy.

**Ejecución:**
- **B/C:** localiza el `DbSet<>` de cada entidad en `ApplicationDbContext.cs` — es la prueba de
  que está mapeada. Un `DbSet` **comentado** indica una entidad desactivada: repórtalo, no lo
  ignores.
- **B/C:** lee **TODOS** los archivos de la carpeta de entidades, no sólo los que el nombre del
  módulo sugiere. Es frecuente que en una misma carpeta convivan un motor vigente y uno legado,
  o dos sistemas distintos con nombres parecidos. Si un archivo queda fuera del alcance,
  **dilo explícitamente y explica por qué**; no lo omitas en silencio.
- **B/C:** cruza contra el catálogo de jobs (`HangfireJobCatalog.cs`) para ver qué procesos
  automáticos tocan esas entidades. Un job registrado como `-legado` es señal de un segundo
  motor conviviendo con el vigente.
- **A:** modo "reutilización" — revisa módulos vecinos y entidades transversales
  (`Customer`, `Employee`, `PersonData`, `Address`, `ApplicationUser`, `Equipment`,
  `Property`, etc.) para no duplicar.
- Por cada entidad: explicar en español **qué representa** y, por cada propiedad, **qué
  función cumple en el negocio** (aunque el nombre esté en inglés). Incluir clase, tabla y
  ruta de archivo.
- Mapear relaciones (1:N, N:1, 1:1) y señalar **GAPs**: qué datos del objetivo ya tienen
  "hogar" y qué falta de verdad.
- Declarar el **conteo**: cuántos archivos tiene la carpeta y cuántos se documentaron. Si no
  cuadra, justificar la diferencia.

**Reglas:**
- ✅ Reporte en español, independiente del idioma del código.
- ✅ Cada propiedad con su propósito de negocio, no solo su tipo C#.
- ❌ NO proponer cambios todavía; solo documentar lo existente.
- ❌ NO inventar propiedades ni pedir al usuario que explique el código.

**Salida:** `01b-entidad-estructura.md` (plantilla abajo). Mostrar para revisión antes de
PASO 1.

**Ejemplo de referencia (nivel de detalle esperado):**
`appsweb/angular/src/app/apps/reclutamiento.luxuryapp/candidates/extructura.md`
`appsweb/angular/src/app/apps/reclutamiento.luxuryapp/candidates/nueva-extructuraV2.md`

---

## PASO 1: Cuestionario de Discovery

Usa la plantilla canónica `discovery-questionnaire-template.md` (6 secciones: Contexto,
Reglas 4 niveles, Flujos, Integraciones, Restricciones no funcionales, Preguntas abiertas).
El agente:
- Hace **UNA pregunta a la vez**, espera respuesta, piensa 3 pasos adelante.
- Nunca asume; pregunta hasta aclarar.
- Usa lenguaje simple (sin jerga), salvo que el usuario sea técnico.
- Cruza las respuestas con `01b-entidad-estructura.md`: si el usuario pide un dato que ya
  vive en otra entidad, lo señala en vez de proponer duplicar.

**Salida:** `01-discovery-cuestionario.md`.

---

## PASO 2: FASE 0 — Análisis de Reglas de Negocio

Sigue **literalmente** `fase-0-business-rules-discovery.md` (estructura de 3 sub-bloques:
0.1 Problem Statement + KPIs, 0.2 Matriz RN 4 niveles `RN-[MOD]-NNN`, 0.3 Pre-Mortem +
Flujos). Cumple sus mínimos verificables: ≥3 KPIs con baseline/target/timeline/verificación,
≥6 RN distribuidas en 4 niveles, cada RN mapeada a ubicación de código (`archivo:línea`),
≥3 supuestos de pre-mortem, ≥3 flujos con criterio de PASO, cero placeholders.

**Salida:** `02-business-rules-analysis.md` en la carpeta del módulo (ver "Estructura de
documentos"). Muéstralo para aprobación antes de PASO 3.

---

## PASO 3: Riesgos y Dependencias

Matriz de riesgos (técnica + seguridad) con probabilidad/impacto/mitigación/owner, matriz
de dependencias (qué necesita de otros módulos y plan de contingencia). No triplicar: esta
es la única matriz de riesgos canónica del plan.

**Salida:** `03-riesgos-dependencias.md`.

---

## PASO 4: Plan de Implementación

Sigue `plan-creation-protocol.md`: **11 secciones mínimas obligatorias**
(metadata, resumen ejecutivo, objetivo, alcance, restricciones, fases, checklist por fase,
criterios de paso, riesgos, dependencias/impactos, cierre esperado). El mapa FASE 0 →
secciones del plan es obligatorio (Problem+KPIs → Resumen; Matriz RN → Arquitectura;
Pre-Mortem+Flujos → Riesgos + Criterios de paso).

**Reutilización obligatoria:** antes de crear entidad/campo nuevo, el agente debe tabular
qué entidades existentes se reusan (basado en `01b-entidad-estructura.md`). Prohibido
duplicar lo que ya existe.

**Rollback:** clasificar migraciones como reversibles vs irreversibles y referenciar
`data-migration-protocol.md`. Un `DROP COLUMN`/borrado de datos no es "volver atrás".

**Sin cronograma inventado:** usa secuenciación por dependencias + tamaño relativo
(S/M/L) + criterios de paso. Las fechas las aporta quien tiene capacidad, no el LLM.

**Salida:** `04-implementation-plan.md`.

---

## PASO 5: Revisión y aprobación final (gates objetivos)

El agente pregunta: "Revisa todo el plan. ¿Entendí problema, roles, reglas, riesgos y
tiempo?" Si algo está mal, se ajusta. Si está bien, el plan queda aprobado.

**Gate de convenciones (objetivo, no autodeclaración):** antes de declarar el plan listo,
el agente debe poder ejecutar y pasar:
- `node scripts/audit-conventions.mjs`
- `node scripts/check-agent-rules.mjs`
El checklist de cumplimiento se basa en la salida de estos scripts, no en casillas ✅
autorrellenadas.

---

## Estructura de documentos generados

Para módulos nuevos, nombres **canónicos** (`CONVENTIONS.md §4.6`):

```text
docs/modulos-nuevos/[nombreModulo]/
├── README.md                      (estado y tracking)
├── 01-discovery-cuestionario.md   (PASO 1)
├── 01b-entidad-estructura.md      (PASO 0.5, reporte en español)
├── 02-business-rules-analysis.md  (PASO 2, FASE 0)
├── 03-preliminary-architecture.md (decisiones técnicas/ADR)
├── 04-implementation-plan.md       (PASO 4)
├── 05-module-documentation.md     (documentación técnica)
└── CHECKLIST.md                   (tracking de progreso)
```

Para módulos existentes (auditoría/plan), usar la carpeta correspondiente y, si es
auditoría, el reporte va a `docs/reporte_maestro/modulos/YYYYMMDD-auditoria-[modulo].md`
(`CONVENTIONS.md §5.9`).

---

## Reglas para el agente (resumen)

| Regla | Descripción |
|-------|-------------|
| 🗣️ Una pregunta a la vez | No bombardear. Una, esperar, luego la siguiente. |
| 🔍 Reconocer entidades primero | PASO 0.5: leer y traducir entidades existentes a español antes de proponer código. Las entidades viven en `LuxuryApp.Infrastructure.Data/Data/Entities/`, no en `LuxuryApp.Application`. |
| 🔢 Leer la carpeta completa | Documentar TODOS los archivos de la carpeta de entidades y declarar el conteo (encontrados vs documentados). Lo omitido se justifica por escrito. |
| 📚 Delegar al canon | El contenido normativo está en `CONVENTIONS.md` y `docs-conventions/...`; citarlo, no copiarlo. |
| 🔁 Reutilizar, no duplicar | Toda entidad/campo nuevo debe justificarse frente a lo existente. |
| 🚫 No asumir | Si falta una regla, repórtala y propón alta; no la inventes. |
| ✅ Mostrar para revisión | Cada paso importante se aprueba antes de continuar. |
| 🧪 Gate objetivo | Cumplimiento validado con `audit-conventions.mjs` / `check-agent-rules.mjs`. |

---

## Cómo invocar

> "Quiero usar la skill de planeación de módulos. Vamos a [CREAR/AMPLIAR/AUDITAR] el módulo
> de [nombre]. Backend: [ruta], Frontend: [ruta]. Objetivo: [descripción breve]."

El agente: (1) identifica A/B/C, (2) registra rutas, (3) hace PASO 0.5 (reporte de
entidades), (4) cuestionario PASO 1, (5) FASE 0, (6) riesgos, (7) plan, (8) revisa y
ajusta hasta aprobación.
