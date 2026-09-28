# Plan de Migracion Estructural - Operations Task Engine

## Metadata

- Fecha: 2026-09-16
- Modulo: `OperationsLuxuryApp`
- Submodulo: `Task`
- Tipo: migracion estructural frontend
- Origen: `docs/OperationsLuxuryApp/Task/qa_gap_analysis_task-engine.md`
- Estado: Fase 0-3.1 ejecutadas; Fase 3.2-4 y decisiones estructurales pendientes
- Alcance tecnico: `appsweb/angular/src/app/modules/operations.luxuryapp/task-engine`
- Ejecutor: pendiente de asignacion

## 1. Resumen Ejecutivo

Actualmente, desarrolladores y agentes mantienen `task-engine` con archivos
sueltos, niveles inconsistentes y un directorio `task-shared` cuyo alcance real
es compartido por varias features. Esto dificulta localizar ownership, aumenta
el riesgo de imports cruzados y hace ambiguo donde agregar codigo nuevo.

La migracion propone conservar `operations.luxuryapp` como modulo, conservar
`task-engine` como grupo funcional, consolidar contratos compartidos dentro de
`tasks/shared/`, y clasificar los archivos de `tasks/` por feature sin cambiar
rutas publicas, endpoints ni comportamiento.

### KPIs

| KPI | Baseline | Target | Timeline |
|---|---:|---:|---|
| Imports al antiguo `tasks/task-shared` | 4 productivos | 0 | Fase 2 |
| Archivos sueltos en raiz `task-engine` | 1 conocido | 0 | Fase 1 |
| Imports con rutas fisicas `src/app/modules` dentro del alcance | Medir Fase 0 | 0 | Fase 3 |
| Build Angular | PASS actual | PASS | Cada fase |
| Tests focalizados task-engine | PASS actual | 100% PASS | Cada fase |
| Cambios de endpoint o contrato publico | 0 | 0 | Cierre |

## 2. Fase 0 - Pre-Planeacion y Reglas de Control

### 2.1 Problem statement

Actualmente, mantenedores de `task-engine` sufren ownership ambiguo cuando
intentan agregar o mover componentes, lo que resulta en duplicacion, imports
relativos fragiles y riesgo de romper consumidores al reorganizar carpetas.

### 2.2 Reglas de negocio y tecnicas

| ID | Nivel | Regla | Mapeo |
|---|---|---|---|
| RN-TASK-001 | Nivel 1: invariante | `operations.luxuryapp` continua siendo modulo raiz de negocio. | Todo `task-engine` |
| RN-TASK-002 | Nivel 1: invariante | No se cambian endpoints, DTOs serializados ni nombres publicos durante migracion. | `core/constants/endpoints`, interfaces |
| RN-TASK-003 | Nivel 2: flujo | Rutas y modales existentes deben resolver mismos componentes y resultados. | `operations.routing.ts`, listas y dialogos |
| RN-TASK-004 | Nivel 3: seguridad | La migracion no mueve ni modifica guards, interceptors o permisos. | `core/`, routing |
| RN-TASK-005 | Nivel 4: validacion | Todo import debe usar alias oficial o ruta relativa permitida; nunca ruta fisica `src/app/...`. | Archivos del alcance |
| RN-TASK-006 | Nivel 4: validacion | Contrato consumido por 2+ features vive en shared del nivel consumidor correcto. | `tasks/shared/` |
| RN-TASK-007 | Nivel 4: validacion | Cada feature nueva conserva `.ts`, `.html`, `.spec.ts` y carpetas `interfaces/`, `desktop/`, `mobile/` cuando aplique. | Features task |

### 2.3 Flujos de control

- Happy path: inventario -> mapa de consumidores -> movimiento controlado ->
  reemplazo de imports -> build -> tests -> revision de diff.
- Sad path: import roto o ruta no resoluble -> detener fase -> restaurar solo
  movimientos de la fase -> corregir mapa -> repetir validacion.
- Edge path: consumidor fuera de `task-engine`, import dinamico, test aislado,
  barrel export o referencia en configuracion -> no mover hasta registrar
  impacto y aprobacion.

### 2.4 Pre-mortem

Si migracion sale mal, causas probables:

- Se mueve contrato usado fuera del alcance sin detectar consumidor externo.
- Se confunde grupo con feature y se crea profundidad adicional no aprobada.
- Se actualizan imports productivos pero no specs, rutas o lazy imports.
- Se mezclan cambios estructurales con cambios funcionales y no se puede aislar
  una regresion.
- Se modifica `shared` transversal sin analisis de impacto.

Controles: inventario con `rg`, grafo de consumidores, commits por fase,
verificacion de imports, build y tests despues de cada movimiento.

## 3. Objetivo y Arquitectura Objetivo

### Objetivos

- Hacer explicito ownership de `task-engine`.
- Eliminar archivo suelto de la raiz del grupo.
- Reubicar contratos compartidos al nivel de consumidor correcto.
- Mantener comportamiento, rutas, endpoints, permisos y contratos.

### Estructura objetivo propuesta

```text
operations.luxuryapp/
└── task-engine/
    ├── tasks/
    │   ├── shared/
    │   │   ├── enums/task-message-status.enum.ts
    │   │   └── interfaces/task-refactor.interface.ts
    │   ├── task-message/
    │   │   ├── interfaces/
    │   │   ├── desktop/                 # si aplica al feature
    │   │   ├── mobile/                  # si aplica al feature
    │   │   └── componentes task-message
    │   ├── task-follow-up/
    │   ├── work-group/
    │   └── reports/
    └── recurring-tasks/
```

La ubicacion exacta de archivos actualmente sueltos en `tasks/` se decide en
Fase 0 mediante consumidores, no por nombre. `task-message` como nivel
adicional requiere confirmacion del Tech Lead antes de consolidarse.

## 4. Alcance

### Incluido

- `task-engine/task-message-status.enum.ts`.
- `tasks/task-shared/` y todos sus consumidores.
- `tasks/task-message/interfaces/`.
- Imports relativos, imports por alias, specs y referencias dinamicas del
  alcance.
- Verificacion de `operations.routing.ts` y componentes standalone afectados.
- Actualizacion de documentacion del modulo si la estructura cambia.

### Excluido

- Backend, migraciones de base de datos y namespaces C#.
- Endpoints, DTOs serializados y API behavior.
- Componentes `shared/ui`, `core`, `shared/integration` y catalogos centrales.
- Refactor funcional de formularios, permisos, concurrencia o uploads.
- Reorganizacion de otros modulos LuxuryApp.

## 5. Restricciones

- No mover archivos antes de aprobacion de este plan.
- No crear `task-engine/shared` por conveniencia sin evidencia de consumidores.
- No usar rutas fisicas `src/app/...` en imports.
- No modificar shared transversal sin analisis de impacto explicito.
- No combinar movimiento estructural con cambios de comportamiento.
- No eliminar `MyTaskForm`, legacy components o specs sin decision separada.
- Mantener compatibilidad de rutas de Angular y apertura de modales.

## 6. Fases y Checklist

### Fase 0 - Inventario y aprobacion

- [x] Enumerar todos los archivos y subcarpetas del alcance.
- [x] Buscar consumidores de cada archivo candidato a mover en todo frontend.
- [x] Revisar lazy imports, routing, specs, barrels y configuracion.
- [ ] Confirmar si `task-engine` es grupo y `tasks`/`recurring-tasks` son
      submodulos aprobados. (pendiente Tech Lead)
- [ ] Confirmar destino de `task-message/interfaces`. (pendiente Tech Lead)
- [x] Registrar archivos fuera de alcance detectados.
- [x] Aprobacion de ejecucion recibida para alcance inequivoco.

Hallazgos Fase 0:

- Consumidores fuera de `task-engine`: `dashboard/unified-pending-dashboard.ts`
  y `dashboard/unified-pending-dashboard-mobile.ts` importan
  `task-engine/tasks/task-message/task-form` (dependencia entre submodulos
  hermanos; deuda preexistente, no tocada).
- Import roto preexistente: `tasks/reports/task-weekly-report-preview.spec.ts:3`
  apunta a `tasks/services/date-range-storage.service`; no existe carpeta
  `services/`. Fuera de alcance, reportado.
- Specs con fallo preexistente ajeno a imports:
  `task-message/task-view.spec.ts` y `reports/task-operation-report.spec.ts`
  fallan por guard `[class]` en `shared/ui/web/avatar/avatar.ts` y
  `shared/ui/web/badge/badge.ts`; `work-group/task-group-list.spec.ts` tiene
  drift de expectativa en `Router.navigate`.
- `tasks/` conserva archivos sueltos (`task-close`, `task-reopen`,
  `task-program`, `task-read-list`, `task.service`, `date-range-storage.service`).
  Ubicacion final pendiente de decision estructural.

### Fase 1 - Reubicacion de ownership

- [x] Crear `tasks/shared/enums/` e `interfaces/` con evidencia de consumidores
      (enum: `work-group` + `reports`; interface: `task-message` +
      `task-follow-up`).
- [x] Mover `task-message-status.enum.ts` a
      `tasks/shared/enums/task-message-status.enum.ts`.
- [x] Mover `task-refactor.interface.ts` a
      `tasks/shared/interfaces/task-refactor.interface.ts`.
- [x] No cambiar contenido de contratos durante movimiento.
- [x] Eliminar `tasks/task-shared/` tras mover.

### Fase 2 - Actualizacion de imports

- [x] Actualizar imports productivos.
- [x] Actualizar imports de specs.
- [x] Actualizar imports relativos internos sin convertirlos en rutas fisicas.
- [x] Revisar aliases de modulo y imports dinamicos.
- [x] Confirmar cero referencias a `task-shared` ni al enum en ruta antigua.

Sitios actualizados: `work-group/task-group-list.ts`,
`reports/task-operation-report.ts`, `reports/task-operation-report.spec.ts`,
`task-message/task-form.ts`, `task-message/task-view.ts`,
`task-follow-up/task-followup.ts`, `task-follow-up/task-followup.spec.ts`.

### Fase 3 - Validacion de comportamiento

- [x] Ejecutar tests focalizados de `task-engine`.
- [x] Ejecutar build Angular (PASS).
- [ ] Verificar rutas de listado, detalle, edicion y seguimiento. (requiere
      runtime/servidor)
- [ ] Verificar apertura de dialogs desktop/mobile. (requiere runtime)
- [ ] Verificar carga de responsables, imagenes y evidencias. (requiere runtime)
- [ ] Ejecutar scanner de mojibake aplicable antes de cierre/commit.

Evidencia de validacion:

- `task-form.spec.ts`: 13/13 PASS.
- `task-follow-up/task-followup.spec.ts`: PASS.
- `work-group/task-group-list.spec.ts`: 5/6 PASS (1 fallo preexistente de
  `navigate`, ajeno a imports).
- `task-message/task-view.spec.ts` y `reports/task-operation-report.spec.ts`:
  no ejecutables por guard `[class]` en componentes `shared/ui` (preexistente).
- `npm run build`: PASS, sin errores de resolucion de imports.

### Fase 4 - Cierre documental

- [ ] Revisar diff solo estructural.
- [ ] Actualizar reporte QA si los hallazgos cambian.
- [ ] Actualizar documentacion del modulo existente, sin crear duplicados.
- [ ] Registrar decisiones no resueltas como deuda aprobada.
- [ ] Obtener aceptacion final.

## 7. Criterios de Paso

- Fase 0: inventario completo, consumidores identificados y destino aprobado.
- Fase 1: archivos existen en destino, no hay duplicados y contenido permanece
  semanticamente igual.
- Fase 2: busqueda de imports antiguos devuelve cero resultados dentro y fuera
  del alcance relevante.
- Fase 3: build PASS, tests focalizados PASS y rutas principales operativas.
- Fase 4: diff revisado, documentacion trazable y sin cambios funcionales no
  autorizados.

## 8. Dependencias e Impactos

- `tsconfig.json` y aliases de import.
- `operations.routing.ts` y cualquier carga dinamica.
- Specs standalone que importan contratos o enums.
- Componentes `task-message`, `task-follow-up`, `work-group` y `reports`.
- Documentacion QA y plan frontend previo, si existe en otra ubicacion.

No se espera impacto en backend ni en base de datos porque migracion solo
modifica ubicacion fisica e imports TypeScript.

## 9. Riesgos y Mitigaciones

| Riesgo | Severidad | Mitigacion |
|---|---|---|
| Consumidor no detectado | Alta | Buscar en todo `src/app`, revisar rutas y build antes de mover |
| Ruptura de import dinamico | Alta | Inventariar `loadComponent`/`loadChildren` y validar rutas |
| Profundidad no aprobada | Media | Decidir ownership en Fase 0 antes de crear carpetas |
| Cambio accidental de comportamiento | Alta | Movimiento puro, commits separados y diff semantico |
| Contrato shared mal ubicado | Alta | Aplicar regla de consumidor 2+ y registrar evidencia |
| Worktree con cambios ajenos | Media | No revertir; aislar diff de archivos tocados por migracion |

## 10. Rollback

- Cada fase de movimiento debe ejecutarse en unidad reversible y con lista de
  archivos antes/despues.
- Si falla build o resolucion de imports, restaurar solo movimientos e imports
  de la fase fallida.
- No usar `git reset --hard` ni `git checkout --`.
- Si ya existe commit de fase, revertir commit especifico tras revision.
- Confirmar build y tests despues del rollback.

## 11. Cierre Esperado

`task-engine` queda organizado bajo modulo `operations.luxuryapp`, grupo
`task-engine` y submodulos con ownership explicito. Contratos usados por varias
features quedan en shared del nivel correcto. No quedan imports al destino
antiguo, no cambian APIs publicas y build/tests conservan estado verde.

## 12. Registro de Ejecucion

Ejecutado (2026-09-16):

- Consolidado `tasks/task-shared/` -> `tasks/shared/`.
- Movido `task-message-status.enum.ts` -> `tasks/shared/enums/`.
- Movido `task-refactor.interface.ts` -> `tasks/shared/interfaces/`.
- Actualizados 7 imports consumidores; verificado cero referencias antiguas.
- Build Angular PASS.

Pendiente de decision (no ejecutado):

- Jerarquia `task-engine` (grupo) vs `tasks`/`recurring-tasks` (submodulos):
  `task-message` implicaria 5-6 niveles; requiere aprobacion Tech Lead.
- Destino de archivos sueltos en raiz de `tasks/`.
- Destino de `tasks/task-message/interfaces/task-message.dto.ts`
  (recomendacion: permanece; solo lo consume `task-message`).
- Consumidores externos en `operations.luxuryapp/dashboard/`.
- Import roto en `task-weekly-report-preview.spec.ts` (ruta `services/`).
- Fallos preexistentes de specs por guard `[class]` en `shared/ui`.

Fases de movimiento estructural adicional no se ejecutan sin esa aprobacion.
