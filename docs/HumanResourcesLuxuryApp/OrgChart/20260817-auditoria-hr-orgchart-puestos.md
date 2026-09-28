# Auditoría: Organigrama de Puestos (Org Chart)

**Fecha:** 2026-08-17
**Frontend:** `client/angular/src/app/apps/recursos-humanos.luxuryapp/expediente-del-empleado/employees/org-chart/`
**Backend:** `api/LuxuryApp.Application/Moduls/RecursosHumanosLuxuryApp/Employees/EmployeeOrganigrama/`
**Metodología:** `docs/reporte_maestro/AUDIT_AGENT_INSTRUCTIONS.md` (PHASE 1 Quick Check + PHASE 2 Deep Audit)
**Nota de alcance:** no existe `reglas-negocio-*.md` (FASE 0) para este módulo — todas las RN listadas abajo son **implícitas** (extraídas de código, no documentadas previamente).

---

## 📊 Resumen Ejecutivo

**Estado combinado:** ~81% cumplimiento CONVENTIONS.md
**Hallazgos Críticos:** 3 (autorización backend, módulo duplicado huérfano, colores hardcoded)
**Fortalezas:** signals/standalone/`@if`/`ApiResponseService` 100% correctos en frontend; transacción explícita + prevención de ciclos (BFS) bien implementadas en backend
**Prioridad:** Inmediata (hallazgo de autorización es explotable hoy)

---

## ✅ PHASE 1 — Verificación Rápida

| Aspecto | Resultado | Status |
|---|---|---|
| Estructura FE (standalone/NgModule/wrapper) | 0 `.module.ts`, 0 wrappers propios (reutiliza `il-button`/`lx-*` de shared/ui) | ✓ |
| State management (signals) | 0 `BehaviorSubject`, signals/computed/effect en 2/2 archivos relevantes, 0 `@Input`/`@Output`/`@ViewChild` | ✓ |
| Templates | 0 `*ngIf`/`*ngFor`, sintaxis `@if`/`@for` en uso | ✓ |
| API Access FE | `ApiResponseService` en 2/2 llamadas, 0 `HttpClient` directo, 0 `*-api.service.ts` | ✓ |
| Backend Minimal API | 0 `ControllerBase`/`ApiController`, 1 `IEndPointsModule` | ✓ |
| Endpoint naming | `api/work-position-org-chart/tree/{id}` y `/reassign` — kebab-case, prefijo correcto | ✓ |
| ApiResponseDTO | 2/2 métodos del contrato retornan `ApiResponseDTO<T>` | ✓ |
| **Autorización por rol backend** | Solo `.RequireAuthorization()` genérico — **sin policy/rol** | ❌ **CRÍTICO** |
| **Design tokens** | **31 colores hardcoded** (hex) fuera de `var(--ds-*)` | ❌ **CRÍTICO** |

**Brechas Identificadas (Phase 1):**
1. Autorización de reasignación solo existe en el frontend — 🔴 CRÍTICA
2. 31 valores hex hardcoded en vez de tokens — 🔴 CRÍTICA
3. Módulo duplicado (`hr-employees/org-chart/`) sin rutear — 🔴 CRÍTICA (higiene/mantenibilidad)
4. Texto visible roto en producción ("puestos é vacantes") — 🟠 ALTA
5. Cobertura de test de 1 solo caso sobre la lógica más riesgosa del servicio — 🟠 ALTA

---

## 🏢 Reglas de Negocio (RN) — todas implícitas, sin FASE 0 previa

| ID | Descripción | Nivel | Ubicación Backend | Ubicación Frontend | Documentada | Cumplimiento |
|---|---|:---:|---|---|:---:|:---:|
| RN-ORG-001 | Solo puestos con `State = Activo` aparecen en el árbol | 1-Invariante | `WorkPositionOrgChartAppService.cs:17-23` | N/A | ✗ Implícita | ✓ |
| RN-ORG-002 | Un puesto sin empleado asignado se muestra como "Vacante" y sigue en el árbol | 1-Invariante | `WorkPositionOrgChartAppService.cs:41-57` | `org-chart.interfaces.ts:15` (`hasEmployee`) | ✗ Implícita | ✓ |
| RN-ORG-003 | Un puesto no puede reportar a uno de sus propios subordinados (anti-ciclo) | 1-Invariante | `WouldCreateCycleAsync`, `WorkPositionOrgChartAppService.cs:216-243` | `org-chart-validation.ts:26-41` (duplicado como validación UX) | ✗ Implícita | ✓ |
| RN-ORG-004 | Solo rol `SuperUsuario` puede editar/reasignar el organigrama | 3-Seguridad | **No implementada** | `org-chart.ts:91-93` (`canEdit`) | ✗ Implícita | ❌ **Solo en UI** |
| RN-ORG-005 | El `SortOrder` entre hermanos define el acomodo izquierda→derecha del organigrama visual | 2-Flujo | `NormalizeSiblingOrders`, `WorkPositionOrgChartAppService.cs:254-283` | `org-chart-tree-ops.ts` (lectura de orden) | ✗ Implícita | ✓ |
| RN-ORG-006 | `HierarchyLevel` se recalcula en cascada para toda la descendencia al mover un puesto | 2-Flujo | `RecalculateLevelsAsync`, `WorkPositionOrgChartAppService.cs:180-214` | N/A | ✗ Implícita | ✓ |
| RN-ORG-007 | Un puesto no puede asignarse como su propio jefe | 4-Validación | `WorkPositionOrgChartAppService.cs:98-99` | `org-chart-validation.ts:22-24` | ✗ Implícita | ✓ |

**Total RN implementadas:** 7 · **Documentadas en FASE 0:** 0 (0%) · **Implícitas:** 7 (100%) · **RN con cumplimiento roto:** 1 (RN-ORG-004)

---

## 🔐 Matriz de Roles por Tarea

| Funcionalidad | Endpoint/Componente | Roles permitidos (UI) | Roles permitidos (Backend) | Estado |
|---|---|---|---|:---:|
| **VER** árbol | `GET tree/{customerId}` | Cualquier autenticado (tab "Visualizar" siempre habilitada) | Cualquier autenticado | ✓ (coherente, visualización abierta es aceptable) |
| **EDITAR/REASIGNAR** | `PATCH reassign` | Solo `SuperUsuario` (`org-chart.ts:91-93`) | Cualquier autenticado (sin policy) | ❌ **Desalineado — CRÍTICO** |

`SuperUsuario` está registrado en `conventions/operations/application-roles-catalog.md:27` ("Acceso total al sistema") — el diseño previsto es claro, la implementación backend no lo aplica.

---

## 🔴 Problemas Funcionales Hallados

| ID | Descripción | Severidad | Ubicación | Impacto | Reproducible |
|---|---|:---:|---|---|---|
| PRIM-001 | ~~Falta autorización por rol en backend para `PATCH reassign`~~ **RESUELTO 2026-08-17** | 🔴 CRÍTICA | `WorkPositionOrgChartEndPoints.cs:7-8` (ahora línea 17-20) | Cualquier usuario autenticado (no solo SuperUsuario) podía reestructurar toda la jerarquía organizacional vía API directa | Se agregó `.RequireAuthorization("SoloSuperUsuario")` al `MapPatch("reassign", ...)`, reutilizando la policy ya registrada en `DependencyInjection.Authorization.cs:39` y el mismo patrón de `RequestPositionEndPoints.cs:45`. `GET tree/{customerId}` se dejó sin cambios (sigue abierto a cualquier autenticado, coherente con RN-ORG). Build de `LuxuryApp.Application` verificado: sin errores nuevos en este archivo. |
| PRIM-002 | ~~Módulo completo duplicado y huérfano~~ **RESUELTO 2026-08-17** | 🔴 CRÍTICA | `.../hr-employees/org-chart/` (12 archivos, copia byte-idéntica de `employees/org-chart/`, creada 29s después) | Ningún archivo fuera de esa carpeta la importa; riesgo de edición accidental de la copia muerta, specs huérfanos en CI | El usuario confirmó que era residuo de una corrección anterior y eliminó la carpeta completa. Verificado: la ruta ya no existe. |
| PRIM-003 | ~~31 colores hardcoded en vez de `var(--ds-*)`~~ **RESUELTO 2026-08-17** | 🔴 CRÍTICA | `org-chart.interfaces.ts` (17), `org-chart-graph-adapter.ts` (2), `org-chart.scss` (12) | Viola Regla Crítica 8 de CONVENTIONS.md; tema oscuro/rebrand no puede aplicarse a estos colores | Se agregaron 18 tokens `--ds-dept-*` (17 departamentos + default) siguiendo la cadena canónica: hex en `styles/core/_colors.scss` (fuente única) → exposición en `styles/theme/_variables.scss`. `DEPTO_ACCENT_COLORS` ahora referencia `var(--ds-dept-*)` (funciona porque se consume vía la custom property `--org-node-accent`); los 12 hex del SCSS migrados a tokens semánticos existentes (`--ds-accent-text-info`, `--ds-icon-secondary`, `--ds-info`, `--ds-warning`, `--ds-warning-light`). Verificado: `grep -rnE "#[0-9A-Fa-f]{6}"` sobre el módulo → 0 |
| PRIM-004 | ~~Texto visible roto en producción: "puestos é vacantes"~~ **RESUELTO 2026-08-17** | 🟠 ALTA | `org-chart.html:6` y `org-chart.html:346` (mismo patrón: "departmentName é folio") | Confirmado visualmente en captura de pantalla real ("46 puestos é 3 vacantes"); no detectado por `scan-mojibake.mjs` (0 hallazgos) porque "é" es carácter español válido — punto ciego real del escáner ante typos semánticos | Línea 6: "é"→"y" (es una frase: "46 puestos y 3 vacantes"). Línea 346: "é"→"·" (es un par de metadatos en tarjeta, no una frase: "Operaciones · CRA-CON-9"). Re-ejecutado `scan-mojibake.mjs` tras el cambio: 0 hallazgos, el `·` no dispara el gate de CI. |
| PRIM-005 | ~~Cobertura de test insuficiente en la lógica más riesgosa~~ **RESUELTO 2026-08-17** | 🟠 ALTA | `WorkPositionOrgChartAppServiceTests.cs` | Solo 1 caso ("mover root bajo otro root"); sin cobertura de detección de ciclos, reordenamiento horizontal, mover a raíz, ni "vacante" | Se agregaron 4 tests: anti-ciclo (mover jefe bajo su subordinado → error + jerarquía intacta), reordenamiento horizontal puro (orden 2→0 sin cambiar jefe ni niveles), mover a raíz (padre null + recálculo en cascada del nivel de la descendencia), puesto vacante en `GetTreeAsync` (RN-ORG-002). Ejecutados: **5/5 en verde** |
| PRIM-006 | ~~`SelectButtonModule` de PrimeNG importado sin uso~~ **RESUELTO 2026-08-17** | 🟡 MEDIA | `org-chart.ts:20,58` | Bundle innecesario, confunde intención del componente | Import y entrada del array `imports` eliminados |
| PRIM-007 | ~~`IOrgChartTreeNode` y `DEPTO_BORDER_COLORS` sin consumidores~~ **RESUELTO 2026-08-17** | 🟡 MEDIA | `org-chart.interfaces.ts` | Código muerto, documentación engañosa (`IOrgChartTreeNode` referencia PrimeNG OrganizationChart, pero el componente usa `ngx-graph`) | Ambos eliminados de `org-chart.interfaces.ts` y del barrel `index.ts` (re-verificado antes: 0 consumidores fuera del módulo) |
| PRIM-008 | `WorkPositionOrgChartMappingProfile.cs` (AutoMapper) sin uso | 🟡 MEDIA | `.../Mapping/WorkPositionOrgChartMappingProfile.cs` | `GetTreeAsync` construye DTOs a mano; doble mantenimiento si el DTO cambia y solo se actualiza uno de los dos | No aplica (hallazgo estático) |
| PRIM-009 | README backend con casing de ruta desalineado | 🔵 BAJA | `EmployeeOrganigrama/README.md:10-11` (documenta `api/WorkPositionOrgChart/...`, la ruta real es `api/work-position-org-chart/...`) | Solo confunde documentación; ASP.NET Core Minimal API es case-insensitive, no rompe funcionalmente | No aplica |
| PRIM-010 | Sin caché en `GetTreeAsync` | 🔵 BAJA | `WorkPositionOrgChartAppService.cs` (método completo) | Recalcula el árbol completo (con Includes de Employee/User/Role) en cada carga; no urgente con 46 puestos (dato real de la captura), vigilar si crece | No aplica |

---

## 🧩 Dudas Técnicas

| ID | Descripción | Ubicación | Tipo | Impacto | Recomendación |
|---|---|---|---|:---:|---|
| DUDA-001 | ¿Hay constraint de unicidad o locking para `(ParentWorkPositionId, SortOrder)`? Dos `PATCH` concurrentes normalizando hermanos podrían dejar un `SortOrder` duplicado transitorio | `NormalizeSiblingOrders`, `WorkPositionOrgChartAppService.cs:254-283` | Concurrencia no verificada | MEDIA | Confirmar índice único compuesto en `OrganizationHierarchy`, o documentar que el volumen de ediciones manuales hace el riesgo aceptable |
| DUDA-002 | ¿`WorkPositionOrgChartMappingProfile.cs` se debe eliminar o se planeaba usar? | `.../Mapping/WorkPositionOrgChartMappingProfile.cs` | Código residual | BAJA | Decidir y actuar (ver ACCIÓN-007) |
| DUDA-003 | ¿`hr-employees/org-chart/` es un respaldo intencional (rollback) o descuido de un rename? | `.../hr-employees/org-chart/` | Duda de proceso, no de código | ALTA (bloquea limpieza segura) | Confirmar con el equipo antes de borrar (ver ACCIÓN-002) |

---

## ✅ Cumplimiento CONVENTIONS.md

### Backend (8 reglas evaluadas)

| Regla | Estado | Hallazgos |
|---|:---:|---|
| Minimal API (`IEndPointsModule`, no `ControllerBase`) | ✓ | 1/1 endpoint module correcto |
| Endpoint naming (kebab-case, prefijo `/api/`) | ✓ | 2/2 rutas correctas |
| `ApiResponseDTO` en respuestas | ✓ | 2/2 métodos del contrato |
| Transacción explícita en escritura | ✓ | `ReassignAsync` usa `BeginTransactionAsync`/`Commit`/`Rollback` |
| **Autorización por rol (RBAC)** | ❌ | 0/1 endpoints de escritura protegidos por rol — **CRÍTICO** |
| AutoMapper consistente | ⚠️ | Profile existe pero no se usa (DTOs construidos a mano) |
| Cobertura de tests | ⚠️ | 1 test relevante de ~5 escenarios de riesgo identificados |
| Logging/auditoría de actividad | ✓ | `LogUserActivityEndPointsFilter` cubre ambos endpoints |

**Cumplimiento Backend: 63% (5/8 plenas)** — el gap de autorización pesa como crítico, no promediable linealmente.

### Frontend (8 reglas evaluadas)

| Regla | Estado | Hallazgos |
|---|:---:|---|
| Standalone components | ✓ | 0 `.module.ts` |
| Signals (no `BehaviorSubject`) | ✓ | 0/0 `BehaviorSubject`, signals en uso |
| `@if`/`@for` (no `*ngIf`/`*ngFor`) | ✓ | 0 sintaxis antigua |
| `ApiResponseService` (no `HttpClient`) | ✓ | 2/2 llamadas |
| Interfaces en `interfaces/` (no `models/`) | ✓ | 100% |
| Wrappers (`-wrapper`, no PrimeNG/Ionic directo en template) | ✓ | 0 componentes PrimeNG usados directamente en `.html` |
| **Design tokens (`var(--ds-*)`, no hardcoded)** | ❌ | 31 valores hex hardcoded — **CRÍTICO** |
| Código muerto (imports/interfaces sin uso) | ⚠️ | `SelectButtonModule`, `IOrgChartTreeNode`, `DEPTO_BORDER_COLORS` |

**Cumplimiento Frontend: 75% (6/8 plenas)** — el gap de design tokens es crítico, no promediable linealmente.

**Cumplimiento combinado estimado: ~69%** (ponderado por severidad, no promedio simple — los 3 hallazgos CRÍTICOS bajan el número más de lo que sugiere el conteo bruto de reglas).

---

## 🎯 Plan de Remediación

### Fase 1 — INMEDIATA (1-2 semanas)
| Acción | Descripción | Complejidad | SP | Depende de |
|---|---|:---:|:---:|---|
| ~~ACCIÓN-001~~ | ✅ **HECHO 2026-08-17** — `.RequireAuthorization("SoloSuperUsuario")` agregado al `MapPatch("reassign")` en `WorkPositionOrgChartEndPoints.cs` | Pequeña | 3 | — |
| ~~ACCIÓN-002~~ | ✅ **HECHO 2026-08-17** — confirmado por el usuario como residuo de una corrección anterior, carpeta `hr-employees/org-chart/` eliminada | Pequeña | 2 | Confirmación humana |
| ~~ACCIÓN-003~~ | ✅ **HECHO 2026-08-17** — `org-chart.html:6` "é"→"y"; `org-chart.html:346` "é"→"·". Verificado con `scan-mojibake.mjs`: 0 hallazgos | Pequeña | 1 | — |

**Total Fase 1: 6 SP — ✅ Fase 1 completa**

### Fase 2 — CORTO PLAZO (3-6 semanas)
| Acción | Descripción | Complejidad | SP |
|---|---|:---:|:---:|
| ~~ACCIÓN-004~~ | ✅ **HECHO 2026-08-17** — 18 tokens `--ds-dept-*` agregados (`_colors.scss` → `_variables.scss`); `DEPTO_ACCENT_COLORS` referencia tokens; 12 hex del SCSS migrados a tokens semánticos. 0 hex en el módulo | Media | 8 |
| ~~ACCIÓN-005~~ | ✅ **HECHO 2026-08-17** — 4 tests nuevos (anti-ciclo, reorden horizontal, mover a raíz + cascada de niveles, vacante en árbol). 5/5 en verde | Media | 8 |
| ~~ACCIÓN-006~~ | ✅ **HECHO 2026-08-17** — `SelectButtonModule`, `IOrgChartTreeNode` y `DEPTO_BORDER_COLORS` eliminados (interfaces + barrel + componente) | Pequeña | 2 |

**Total Fase 2: 18 SP — ✅ Fase 2 completa**

### Fase 3 — MEDIO PLAZO (2 meses)
| Acción | Descripción | Complejidad | SP |
|---|---|:---:|:---:|
| ACCIÓN-007 | Decidir destino de `WorkPositionOrgChartMappingProfile.cs`: adoptarlo en `GetTreeAsync` o eliminarlo | Pequeña | 2 |
| ACCIÓN-008 | Evaluar constraint de unicidad / locking en `NormalizeSiblingOrders` ante escritura concurrente (DUDA-001) | Media | 5 |
| ACCIÓN-009 | Alinear casing de rutas documentadas en el README del módulo | Pequeña | 1 |
| ACCIÓN-010 | Evaluar caché para `GetTreeAsync` si el volumen de puestos crece más allá del rango actual (~46) | Pequeña | 2 |

**Total Fase 3: 10 SP**

**Total Effort: 34 SP**

**Orden recomendado:** ACCIÓN-001 primero siempre (es la única con superficie de explotación real hoy) → ACCIÓN-002 y ACCIÓN-003 son de bajo riesgo y pueden ir en paralelo → Fase 2 depende de que Fase 1 esté cerrada para no tocar archivos en dos frentes a la vez.

---

## 📈 Métricas

| Métrica | Valor | Target | Status |
|---|---|---|:---:|
| Cobertura de tests (escenarios de riesgo cubiertos) | 100% (5 de 5 escenarios identificados) — actualizado 2026-08-17 | 80% | 🟢 |
| Cumplimiento CONVENTIONS.md combinado | ~94% (los 3 críticos y las 2 altas resueltos; quedan ⚠️ AutoMapper sin uso y hallazgos 🔵 BAJA) — actualizado 2026-08-17 | 95% | 🟡 |
| Deuda técnica estimada | 10 SP (Fase 3 restante; Fases 1-2 ejecutadas: 24 SP) | <30 | 🟢 |

---

## 🖥️ Validación en Navegador (playwright-cli, 2026-08-17)

Ejecutada tras cerrar Fase 2, con sesión real (`admin` / SuperUsuario) contra `localhost:4200` + API `localhost:7070`.

| Verificación | Resultado |
|---|:---:|
| Página carga en `/directory/work-position-org-chart` sin errores nuevos de consola (los 9 existentes son 404 de `api.iconify.design` y foto de perfil — ajenos al módulo) | ✓ |
| Subtítulo correcto: "9 puestos y 0 vacantes" (fix PRIM-004 vivo) | ✓ |
| Tokens `--ds-dept-*` resuelven en runtime: `direcciones=#f59e0b`, `sistemas=#6366f1`, `contabilidad=#14b8a6`, `default=#9aacbb` (verificado con `getComputedStyle`) | ✓ |
| Acentos de departamento visibles en las tarjetas del grafo (ACCIÓN-004 sin regresión visual) | ✓ |
| Panel "Detalles del Puesto" abre al clic en nodo (folio, departamento, nivel, email, teléfono) | ✓ |
| Reordenamiento "Bajar"/"Subir" en tabla de edición → `PATCH /reassign` éxito + recarga del árbol (orden restaurado al final, sin datos alterados) | ✓ |
| Eliminación de `SelectButtonModule` (ACCIÓN-006) sin romper tabs ni tabla | ✓ |

**Defecto lateral encontrado (fuera del módulo):** en la pantalla de login, el footer de copyright (`© 2026 Luxury Building Group`, posicionado `absolute bottom-0`) intercepta los clics sobre el botón "INICIAR SESIÓN" — el submit solo funciona con Enter. Reportar al módulo de auth.

---

## 🎨 Análisis UX — "no es entendible cómo funciona el organigrama"

Origen: retroalimentación directa del usuario. Hallazgos ordenados por impacto en comprensibilidad:

| ID | Hallazgo | Impacto | Propuesta |
|---|---|:---:|---|
| UX-001 | **Doble mundo desconectado**: se edita en una tabla plana (pestaña "Editar") pero el resultado solo se ve cambiando a "Visualizar". El usuario no ve el efecto de su cambio donde lo hizo | 🔴 ALTA | Mini-preview del subárbol afectado junto a la tabla, o edición directa sobre el grafo (drag de nodos), o al menos auto-cambiar a "Visualizar" con el nodo movido resaltado tras guardar |
| UX-002 | **La columna "Jefe inmediato" muestra folios crípticos** (`GSA-OPE-DIR-GEN-1`) en vez de nombre del puesto/persona. Nadie memoriza folios | 🔴 ALTA | Mostrar "Dirección — Matias Abramoff" (folio como texto secundario o tooltip) |
| UX-003 | **La "tabla jerárquica" se ve plana**: sin indentación ni agrupación visual por jefe; con 46 puestos reales la estructura es ilegible | 🔴 ALTA | Indentar filas por nivel (padding + guías verticales) o agrupar con encabezados colapsables por jefe |
| UX-004 | **Grafo sin controles de navegación**: no hay zoom, ajustar-a-pantalla, centrar ni colapsar subárboles; el viewport corta tarjetas en los bordes. Con 46 puestos es inusable | 🔴 ALTA | Toolbar de grafo: zoom ±, "ajustar", colapso por nodo; ngx-graph ya soporta zoom/pan (`[enableZoom]`, `[panningEnabled]`) — activarlos y hacerlos visibles con botones |
| UX-005 | **Columna "Orden" críptica** ("3 / 8") sin explicación de que es "posición entre hermanos del mismo jefe" | 🟠 MEDIA | Tooltip en el encabezado + renombrar a "Orden entre hermanos" |
| UX-006 | **Instrucciones en dos párrafos largos** que además dicen "La edicion **ahora** se hace en…" — referencia histórica sin sentido para un usuario nuevo | 🟠 MEDIA | Sustituir por microcopy contextual: hint de una línea + icono ⓘ con detalle; eliminar el "ahora" |
| UX-007 | **Zona "Suelta aqui para mover el puesto al nivel raiz" siempre visible**, aunque no se esté arrastrando nada — ruido permanente | 🟠 MEDIA | Mostrarla solo durante un drag activo (estado `isDragging`) |
| UX-008 | **"Nodo virtual" / "ROOT" expuestos al usuario final** en la tarjeta raíz del grafo — jerga técnica | 🟠 MEDIA | Renombrar a algo de dominio: "Luxury App — Dirección General" sin badge técnico, o estilizarla como cabecera no-nodo |
| UX-009 | **Sin leyenda de colores por departamento**: el acento índigo/teal/ámbar no comunica nada sin clave | 🟡 BAJA | Leyenda colapsable bajo el grafo generada de `DEPTO_ACCENT_COLORS` |
| UX-010 | **Textos sin tildes** en toda la superficie del módulo: "Limpiar seleccion", "edicion", "jerarquica", "Suelta aqui", "Nivel raiz", "A raiz" — inconsistente con el resto de la app | 🟡 BAJA | Corregir ortografía (selección, edición, jerárquica, aquí, raíz); son literales en `org-chart.html` |
| UX-011 | **"A raiz" ejecuta sin confirmación** un cambio estructural grande (el puesto y todo su subárbol se desconectan del jefe) | 🟡 BAJA | Diálogo de confirmación o snackbar con "Deshacer" |
| UX-012 | **Datos demo confusos** (calidad de datos, no de código): "Gerente de Mantenimiento" en depto "Sistemas", "Reclutamiento" en depto "Mantenimiento", "Recursos Humanos" en depto "Reclutamiento" — amplifica la sensación de que "no se entiende" | ℹ️ | Corregir asignaciones de departamento en los datos del cliente demo |

**Diagnóstico central:** el módulo funciona correctamente (validado end-to-end), pero el modelo mental que exige es invertido: obliga a editar en una representación (tabla plana con folios) distinta a la que el usuario razona (árbol visual con nombres). UX-001/002/003/004 atacan esa raíz; el resto es pulido.

---

## 🔗 Referencias

- CONVENTIONS.md: `D:\repos\luxuryapp-api\CONVENTIONS.md` (Regla Crítica 8 — Design Tokens)
- Catálogo de roles: `conventions/operations/application-roles-catalog.md:27`
- Escáner de encoding: `scripts/scan-mojibake.mjs` (ejecutado sobre el módulo, 0 hallazgos — no cubre PRIM-004)
- Metodología de auditoría: `docs/reporte_maestro/AUDIT_AGENT_INSTRUCTIONS.md`
- Reglas de Negocio: no existe `reglas-negocio-*.md` para este módulo (FASE 0 pendiente)

---

## 🧩 Feature: Agrupación en cascada por puesto (2026-08-18)

**Origen:** retroalimentación directa del usuario tras UX-003/UX-004 — con 46+ `WorkPosition` reales el árbol/grafo se vuelve inoperable sin agrupación visual.

**Decisiones de diseño (aprobadas por el usuario):**

| Decisión | Valor | Razón |
|---|---|---|
| Umbral de agrupación | ≥3 hermanos con el mismo `roleDisplayName` bajo el mismo jefe | Evita colapsar pares (2 hermanos son legibles sin ayuda) |
| Estado inicial de un grupo | Colapsado | Prioriza legibilidad al cargar; el usuario expande bajo demanda |
| `WorkPosition` con subordinados propios | **Nunca** se agrupan, aunque compartan rol con otros hermanos-hoja agrupables | Fusionarlos ocultaría a quién reporta cada subárbol — regla de seguridad estructural |

**Implementación (100% frontend, sin cambios de API/DB):**

- `helpers/org-chart-grouping.ts` (nuevo): `groupSiblingsByRole()` recorre el árbol recursivamente en cada nivel; separa hermanos-hoja (`children.length === 0`) de ramas; agrupa hojas por `roleDisplayName` cuando alcanzan el umbral; genera un nodo sintético `{ isGroup: true, groupMemberCount, isGroupExpanded }` que reutiliza la forma de `IWorkPositionOrgChartNode` (mismo patrón que `ORG_CHART_VIRTUAL_ROOT_ID`).
- `org-chart.ts`: nuevo signal `expandedGroupIds`; `displayTree = computed(() => groupSiblingsByRole(tree(), expandedGroupIds()))`; `graphTree` y `editRows` ahora se derivan de `displayTree()` en vez de `tree()` — `totalNodes`/`vacantCount` siguen en `tree()` (cuentas reales sin distorsión). Método `toggleGroup(groupId)` invertido en `Set`.
- Guardas `isGroup` agregadas en: `onGraphNodeClick`/`onEditorRowClick` (clic en grupo = toggle, no selección), `onCardDragStart` (no se puede arrastrar un grupo), `validateReassignment` (guard centralizado — ningún grupo puede ser origen ni destino de una reasignación), `onReorderZoneDragOver/Drop` y `shouldShowReorderAffordances` (sin zonas de reordenamiento junto a un grupo colapsado, ya que la posición exacta es ambigua mientras esté colapsado).
- `org-chart.html`/`.scss`: tarjeta de grafo con borde punteado + avatar con contador + badge "Grupo"; fila de tabla con badge "N puestos" y acción única Expandir/Colapsar en vez de Subir/Bajar/A raíz.

**Validación:**

- 7 tests nuevos en `helpers/org-chart-grouping.spec.ts` (umbral exacto, sub-umbral, ramas nunca agrupadas, expandir/colapsar, recursión en niveles anidados, orden estable, grupos independientes por jefe) — 27/27 tests del módulo en verde (`vitest run`).
- Corregido de paso un import roto preexistente (`../models/org-chart.interfaces` → `../interfaces/org-chart.interfaces`) en los 3 spec files de `helpers/`, que impedía correr la suite completa.
- `npx tsc --noEmit -p tsconfig.app.json`: sin errores.
- Validación en navegador (playwright-cli, sesión real): sin regresión en tabla de edición ni grafo con el dataset demo actual (9 puestos, ningún rol con 3+ hermanos bajo el mismo jefe — el umbral no se dispara con estos datos, por lo que la agrupación visual no pudo demostrarse en vivo; la corrección se apoya en los 7 tests unitarios dedicados).
