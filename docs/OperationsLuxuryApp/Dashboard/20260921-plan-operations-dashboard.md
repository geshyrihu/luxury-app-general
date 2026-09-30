# Plan de Implementación — Dashboard de Métricas (OperationsLuxuryApp)

**Metadata**

- Módulo: `OperationsLuxuryApp` / Submódulo: `Dashboard`
- Tipo: Ampliación de módulo existente (no reemplaza nada)
- Origen: `D:\repos\luxuryapp-api\prompt.md` (especificación "Dashboard LuxuryApp") + reconocimiento previo en `docs/OperationsLuxuryApp/Dashboard/20260921-analisis-operations-dashboard.md`
- Fecha: 2026-09-21
- Autor del plan: Claude (orquestador) — aprobado por Tech Lead (usuario) en conversación previa
- Protocolo: `conventions/operations/plan-creation-protocol.md` + `conventions/operations/plan-agent-instructions.md`
- Dinámica de ejecución: el orquestador entrega, fase por fase, la sección "Prompt de ejecución" correspondiente a un agente ejecutor externo. El agente ejecuta EXACTAMENTE esa fase, y al terminar escribe su reporte en `D:\repos\luxuryapp-api\response.md`. El orquestador revisa el reporte + el código real antes de autorizar la siguiente fase.

---

## FASE 0 — Pre-Planeación

### 0.1 Problem Statement + KPIs

Actualmente, los roles gerenciales y corporativos (Corporate/Staff) sufren de un Dashboard que solo muestra **listados tabulares de pendientes** cuando intentan **entender tendencias operativas** (volumen, tiempo de resolución, distribución por tipo), lo que resulta en **decisiones basadas en conteo manual de filas en vez de métricas agregadas**.

Esto afecta a los 17 roles candidatos identificados (8 Corporate + 9 Staff... ver realmente 7 Staff listados por negocio) que hoy consumen `GET api/dashboard/global-pending-items/{customerId}` sin ninguna vista de KPIs.

Este plan resuelve: agregar una vista nueva de KPIs y gráficos (`/dashboard/metrics`), sin tocar el dashboard tabular actual, empezando por los KPIs Operativos.

| Métrica (KPI de producto)                                                   | Baseline                                                     | Target                                           | Timeline                                                                |
| --------------------------------------------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------ | ----------------------------------------------------------------------- |
| Visibilidad de tendencia operativa (sí/no)                                  | No existe (0%)                                               | Disponible para 15 roles (8 Corporate + 7 Staff) | Fin de Fase 1                                                           |
| Tiempo para identificar cuántas operaciones están pendientes vs completadas | Manual, cuenta de filas en tabla (minutos)                   | Instantáneo (KPI card)                           | Fin de Fase 1                                                           |
| Cobertura de fases del prompt.md original                                   | 0/4 grupos de KPIs (Operativos/Financiero/Soporte/Ejecutivo) | 1/4 (Operativos)                                 | Fin de Fase 1 — resto en Fases 2-4 (fuera de alcance de este documento) |

> Nota: KPIs de producto, no de negocio del dominio (esos van en la matriz RN). No hay baseline de "tiempo de resolución real" porque hoy no se mide — se establecerá con los primeros datos que arroje el KPI una vez implementado.

### 0.2 Matriz de Reglas de Negocio (4 Niveles)

**Nivel 1 — Invariantes de Dominio**

- `RN-DASH-001`: Los componentes y endpoint actuales del Dashboard (`ContainerDashboard`, `DashboardPendingItems`, `UnifiedPendingDashboard`, `UnifiedPendingDashboardMobile`, `GET api/dashboard/global-pending-items/{customerId}`) no se modifican ni se eliminan en este plan.
- `RN-DASH-002`: Toda métrica nueva se expone bajo rutas/endpoints distintos a los actuales — frontend en `/dashboard/metrics`, backend bajo `api/dashboard/metrics/*` — nunca reemplazando lo existente.
- `RN-DASH-003`: El cálculo de "tiempo de resolución" usa días naturales (calendario). `IBusinessTimeService` permanece sin activar en esta fase (decisión explícita del Tech Lead).

**Nivel 2 — Flujo y Estados**

- `RN-DASH-010`: Una `ServiceOrder` cuenta como "pendiente" mientras `Status ∈ {Pendiente, Proceso}`; cuenta como "completada" cuando `Status` indica finalización y `ExecutionDate` está poblado. Tiempo de resolución = `ExecutionDate - RequestDate` (días naturales).
- `RN-DASH-011`: Un `TaskRecord` ("ticket") cuenta como "pendiente" mientras `Status != Completed` (`GanttStatus`); "completado" cuando `Status == Completed`. Tiempo de resolución = `ClosedDate - CreatedAt` (días naturales) cuando `ClosedDate` existe.
- `RN-DASH-012`: Los filtros (rango de fecha, tipo de operación, rol/módulo) se aplican en el backend (query), nunca post-agregación en el cliente.

**Nivel 3 — Seguridad/Autorización**

- `RN-DASH-020`: Roles `RoleType.Corporate` (`Legal`, `CoordinacionLegal`, `RecursosHumanos`, `Reclutamiento`, `GerenteMantenimiento`, `SistemasGeneral`, `Mensajeria`, `SupervisionOperativa`) reciben KPIs agregados de **todos los customers**, sin filtro de `customerId` por defecto.
- `RN-DASH-021`: Roles `RoleType.Staff` (`Administrador`, `GerenteOperaciones`, `GerenteAtencion`, `Asistente`, `Contador`, `Cobranza`, `JefeMantenimiento`) reciben KPIs filtrados por el `customerId` seleccionado en el contexto de sesión — mismo criterio que usa hoy `GetGlobalPendingItemsAsync`. `Administrador`, `GerenteOperaciones` y `GerenteAtencion` reciben exactamente el mismo payload (sin diferenciación entre ellos).
- `RN-DASH-022` (ENMENDADA 2026-09-21 por el Tech Lead): Roles `RoleType.System`/`RoleType.Executive` (`SuperUsuario`, `Direccion`) tienen acceso **PROVISIONAL de revisión** en Fase 1: se comportan como Corporate (todos los customers, drill-down opcional por `customerId`) para que el negocio pueda revisar las vistas. Su alcance definitivo se decide en Fase 4. Original: rechazo 403 hasta Fase 4.
- `RN-DASH-023`: Cualquier rol no listado en `RN-DASH-020`/`RN-DASH-021` (Client, Contractor, y el resto de roles Staff no mencionados por el negocio: `TecnicoMantenimiento`, `Sistemas`, `Recepcionista`, etc.) recibe 403 al llamar el endpoint de métricas.

**Nivel 4 — Validación de Datos**

- `RN-DASH-030`: El filtro de rango de fechas es obligatorio; el backend limita el rango máximo a 366 días por request para evitar escaneos sin límite (ajustable por Tech Lead si se requiere histórico mayor).
- `RN-DASH-031`: `customerId` es obligatorio en el request para roles Staff; para roles Corporate es opcional (si se envía, se interpreta como _drill-down_ a un solo cliente — ver Sad Path 0.3).
- `RN-DASH-032`: El filtro "tipo de operación" solo acepta los valores de `Module` ya usados en `PendingItemDTO` que apliquen a Fase 1: `Mantenimiento`, `Tickets`. Otros módulos (`Minutas`, `Legal`, `Polizas`, etc.) quedan fuera de alcance de Fase 1 (KPIs Operativos), se incorporan en fases futuras si el negocio lo pide.

### 0.3 Riesgos + Pre-Mortem + Flujos

**Pre-Mortem: "Salió a producción y fue un desastre. ¿Qué lo causó?"**

| Supuesto fallido                                                                                                  | Impacto                                                                                                            | Probabilidad | Mitigación                                                                                                                                                                                                |
| ----------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ | ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Query agregado sobre `Tasks`+`ServiceOrders` sin índices adecuados en columnas de fecha                           | KPIs tardan >3s, mala UX                                                                                           | Media        | Verificar índices existentes en `RequestDate`/`CreatedAt` antes de implementar el query; agregar índice si falta (documentar en el reporte, no aplicar migración sin aviso)                               |
| Confundir "Corporate ve todos los customers" con "Corporate ve todos los roles/datos sin restricción"             | KPIs Corporate exponen datos que no deberían verse agregados (ej. datos legales sensibles)                         | Media        | Test explícito: un usuario Corporate sin filtro debe ver SOLO KPIs operativos (ServiceOrders+Tasks), nunca campos de otros dominios                                                                       |
| La ruta nueva `/dashboard/metrics` no queda protegida por el mismo guard de autenticación/tenant que `/dashboard` | Fuga de datos entre tenants                                                                                        | Baja         | Reusar el mismo guard funcional (`CanActivateFn`) y el mismo patrón de obtención de `customerId` de sesión que usa el dashboard actual                                                                    |
| Duplicar la definición de "qué es un pendiente" entre el endpoint viejo y el nuevo, y que diverjan con el tiempo  | Los dos dashboards muestran números distintos para el mismo concepto, se pierde confianza del usuario en los datos | Alta         | Donde sea posible sin tocar `DashboardAppService.cs` existente, extraer los predicados de filtro (`Status ∈ {Pendiente, Proceso}`, etc.) a un método/constante compartido reutilizado por ambos servicios |

**Happy Path:** Usuario Staff entra a `/dashboard/metrics` → filtros por defecto (últimos 30 días, todos los tipos) → backend agrega `ServiceOrders`+`Tasks` filtrados por `customerId` de sesión → responde `OperationalMetricsDTO` → frontend renderiza KPI cards (pendientes/completadas/tiempo promedio) + gráfico de barras (distribución por tipo) + gráfico de línea (tendencia).

**Sad Path:** Usuario Corporate, sin `customerId` en sesión, envía un `customerId` específico en el filtro → el backend lo interpreta como _drill-down_ explícito a ese cliente (no como error) → responde igual que un Staff filtrado. Si el `customerId` enviado no existe o no tiene datos, responde 200 con métricas en cero (no 404, no excepción).

**Edge Path:** No hay `ServiceOrders` ni `Tasks` en el rango de fecha seleccionado → el endpoint responde 200 con todos los KPIs en 0, el frontend muestra el estado vacío de las KPI cards/gráficos (no un error).

---

## 1. Resumen Ejecutivo

Se agrega al módulo Dashboard existente una vista nueva de KPIs Operativos (pendientes vs. completadas, tiempo de resolución, distribución por tipo de operación) accesible en la ruta `/dashboard/metrics`, con datos filtrados según el `RoleType` del usuario (Corporate = todos los customers, Staff = customer seleccionado). No se modifica ni se elimina el Dashboard tabular actual. Es la Fase 1 de 4 fases totales del prompt.md original (Financiero, Soporte/SLA y Ejecutivo/System quedan para fases posteriores, fuera de este documento).

## 2. Alcance y Restricciones

**IN-SCOPE (Fase 1):**

- Backend: nuevo `IDashboardMetricsAppService` + `DashboardMetricsAppService` + DTOs + endpoint(s) nuevos, dentro de `Modules/OperationsLuxuryApp/Dashboard/`.
- KPIs: pendientes vs. completadas, tiempo promedio de resolución (días naturales), distribución por tipo de operación — usando `ServiceOrders` y `Tasks` (reinterpretado como "ticket").
- Filtros: rango de fecha (obligatorio), tipo de operación (`Mantenimiento`/`Tickets`), rol/módulo.
- Scoping por `RoleType`: Corporate (global) vs Staff (por customerId de sesión, con drill-down opcional para Corporate).
- Frontend: nueva ruta `/dashboard/metrics`, componentes nuevos reutilizando `<app-chart-wrapper>` (Chart.js/ng2-charts ya instalado).
- Roles habilitados: los 15 roles candidatos listados en `RN-DASH-020`/`RN-DASH-021`.

**OUT-OF-SCOPE (fases futuras, no se ejecutan en este documento):**

- Fase 2 — Soporte/SLA (reinterpretar `TaskRecord.BreachedAt`, sin nueva entidad).
- Fase 3 — Financiero (agregados de `FinancialAccounting`, sin desglose por operación).
- Fase 4 — Ejecutivo/System (`SuperUsuario`/`Direccion`), alcance de datos a definir.
- Activación de `IBusinessTimeService` (días hábiles).
- Cualquier cambio de esquema/entidad nueva (Fase 1 es de solo lectura sobre entidades existentes).
- Modificación del endpoint `global-pending-items` o de cualquier componente del dashboard tabular actual.

**Restricciones:**

- No instalar librerías de gráficos nuevas (usar Chart.js/ng2-charts + `shared/ui/web/charts` ya existentes).
- No crear entidades ni migraciones de base de datos en esta fase (100% queries de lectura sobre `ServiceOrders`/`Tasks`).
- Seguir `CONVENTIONS.md §3bis` puntos 2️⃣ (endpoints/services), 3️⃣ (componentes Angular), 7️⃣ (tokens/iconos).

## 3. Arquitectura y Diseño Técnico

### 3.1 Backend

Ubicación (sin tocar los archivos existentes del módulo):

```
api/LuxuryApp.Application/Modules/OperationsLuxuryApp/Dashboard/
├── DTOs/
│   ├── OperationalMetricsDTO.cs          (nuevo) → cumple RN-DASH-010/011
│   ├── OperationalMetricsFilterDTO.cs    (nuevo) → cumple RN-DASH-012/030/031/032
├── Interfaces/
│   └── IDashboardMetricsAppService.cs    (nuevo, interfaz separada de IDashboardAppService)
├── Services/
│   └── DashboardMetricsAppService.cs     (nuevo) → cumple RN-DASH-020/021/022/023
└── EndPoints/
    └── DashboardMetricsEndpoints.cs      (nuevo) → GET api/dashboard/metrics/operational
```

- Constructor primario (C# 12) obligatorio en el AppService.
- Reutilizar `currentUserService.UserRole`/`RoleType` (mismo patrón que `DashboardAppService.cs`) para aplicar `RN-DASH-020/021/022/023`.
- Reutilizar, si es posible sin tocar el archivo existente, los predicados de estado (`Pendiente`/`Proceso`/`Completed`) ya usados en `DashboardAppService.cs` para evitar la divergencia señalada en el Pre-Mortem.

### 3.2 Frontend

Ubicación (nuevo submódulo hermano, sin tocar los archivos existentes):

```
appsweb/angular/src/app/modules/operations.luxuryapp/dashboard/metrics/
├── dashboard-metrics.ts               (contenedor, ruta /dashboard/metrics)
├── dashboard-metrics-desktop.ts       (KPI cards + <app-chart-wrapper>)
├── dashboard-metrics-mobile.ts
├── dashboard-metrics-filters.ts       (fecha + tipo operación + rol/módulo)
├── interfaces/operational-metrics.dto.ts
└── services/dashboard-metrics.service.ts
```

- Standalone + `OnPush` + `signal()`/`computed()` (Angular 22).
- Nueva entrada de ruta `/dashboard/metrics` con el mismo guard funcional que protege `/dashboard` hoy.
- Gráficos: reutilizar `<app-chart-wrapper>` + `chart-adapters.ts` de `shared/ui/web/charts/` — tipo `bar` (distribución por tipo) y `line` (tendencia pendientes vs completadas).
- Tokens de diseño: solo `var(--ds-*)`/`var(--primary-*)`/`var(--surface-*)`, cero hex/px hardcodeados (`CONVENTIONS.md §3bis 7️⃣`).

### 3.3 Migración de Datos

**No aplica.** Fase 1 es de solo lectura sobre `ServiceOrders` y `Tasks` (entidades ya existentes), sin cambios de esquema. Si el reporte de ejecución detecta que faltan índices en columnas de fecha (`RequestDate`, `CreatedAt`), debe documentarlo en `response.md` como hallazgo — no debe crear la migración sin aprobación explícita del Tech Lead.

### 3.4 Tokens de Diseño

- Colores de estado: `--success-600` (completadas), `--warning-600`/`--danger-600` (pendientes/vencidas), `--surface-card` (fondo de KPI cards).
- Spacing: `--ds-space-lg` (padding de cards), `--ds-space-md` (gaps de filtros).
- Tipografía: `--font-size-title-lg` (valor numérico del KPI), `--font-size-label-md` (etiqueta del KPI).
- Sombra/radio: `--ds-shadow-2`, `--ds-radius-md` (KPI cards).
- Validación pre-delivery: `grep -r "#[0-9A-F]\{6\}" appsweb/angular/src/app/modules/operations.luxuryapp/dashboard/metrics` → debe dar 0 resultados.

## 4. Backlog de Tasks (Fase 1)

**Backend**

- [ ] `OperationalMetricsFilterDTO` (rango fecha, tipo operación, customerId opcional)
- [ ] `OperationalMetricsDTO` (pendientes, completadas, tiempo promedio resolución, distribución por tipo)
- [ ] `IDashboardMetricsAppService` + `DashboardMetricsAppService` con lógica de scoping por `RoleType`
- [ ] `GET api/dashboard/metrics/operational` en `DashboardMetricsEndpoints.cs`
- [ ] Verificar índices en `ServiceOrders.RequestDate` / `Tasks.CreatedAt` (documentar hallazgo, no migrar sin aprobación)
- [ ] Pruebas unitarias: scoping Corporate (todos los customers) vs Staff (customerId de sesión) vs rol no autorizado (403)

**Frontend**

- [ ] Ruta `/dashboard/metrics` con guard equivalente al de `/dashboard`
- [ ] `dashboard-metrics-filters.ts` (fecha, tipo operación, rol/módulo)
- [ ] `dashboard-metrics-desktop.ts` / `dashboard-metrics-mobile.ts` con `<app-chart-wrapper>`
- [ ] `dashboard-metrics.service.ts` consumiendo el endpoint nuevo
- [ ] Validación de tokens de diseño (grep, sección 3.4)

## 5. Fases de Ejecución

> **Dinámica:** cada fase de esta sección tiene un bloque **"Prompt de ejecución"** listo para copiar/pegar a un agente ejecutor externo. El agente debe leer este documento completo primero, ejecutar únicamente la fase indicada, y escribir su reporte en `D:\repos\luxuryapp-api\response.md` al terminar.

### Fase 1.1 — Backend (KPIs Operativos)

**Criterio de PASO:** `GET api/dashboard/metrics/operational` compila, retorna 200 con datos correctos para un usuario Staff (filtrado por customerId) y para un usuario Corporate (agregado, sin customerId), y retorna 403 para un rol no listado en `RN-DASH-020`/`RN-DASH-021`.

**Prompt de ejecución (Fase 1.1):**

```
Ejecuta la Fase 1.1 (Backend) del documento
D:\repos\luxuryapp-api\docs\OperationsLuxuryApp\Dashboard\20260921-plan-operations-dashboard.md

Lee el documento completo primero (FASE 0 + secciones 1-5), y también:
- D:\repos\luxuryapp-api\conventions\CONVENTIONS.md (§3bis puntos 2️⃣, §4.1)
- D:\repos\luxuryapp-api\conventions\backend\* referenciados en §4.1
- D:\repos\luxuryapp-api\docs\OperationsLuxuryApp\Dashboard\20260921-analisis-operations-dashboard.md (contexto de entidades reales)
- api\LuxuryApp.Application\Modules\OperationsLuxuryApp\Dashboard\Services\DashboardAppService.cs (patrón de scoping por rol a replicar, NO modificar este archivo)

Implementa solo el backlog de Backend de la sección 4 y el diseño de la sección 3.1.
No toques ningún archivo existente del módulo Dashboard (RN-DASH-001/002).
No crees migraciones ni cambies el esquema (sección 3.3, "No aplica").
Si detectas que faltan índices en ServiceOrders.RequestDate o Tasks.CreatedAt, documéntalo como hallazgo en tu reporte, no lo apliques.

Al terminar, escribe tu reporte en D:\repos\luxuryapp-api\response.md con: archivos creados/modificados (ruta completa), decisiones tomadas, cómo verificaste cada RN de Nivel 2/3/4 relevante (RN-DASH-010, 011, 012, 020, 021, 022, 023, 030, 031, 032), resultado de compilación, y cualquier bloqueo o desviación del plan.
```

### Fase 1.2 — Frontend (KPIs Operativos)

**Precondición:** Fase 1.1 aprobada por el orquestador (endpoint disponible y verificado).

**Criterio de PASO:** La ruta `/dashboard/metrics` renderiza KPI cards + 2 gráficos (barras y línea) con datos reales del endpoint de la Fase 1.1, respeta el guard de autenticación, y el dashboard actual (`/dashboard`) sigue funcionando sin cambios.

**Prompt de ejecución (Fase 1.2):**

```
Ejecuta la Fase 1.2 (Frontend) del documento
D:\repos\luxuryapp-api\docs\OperationsLuxuryApp\Dashboard\20260921-plan-operations-dashboard.md

Lee el documento completo primero (FASE 0 + secciones 1-5), y también:
- D:\repos\luxuryapp-api\conventions\CONVENTIONS.md (§3bis puntos 3️⃣ y 7️⃣, §4.2 completo)
- appsweb\angular\src\app\shared\ui\web\charts\chart-wrapper.ts y chart-adapters.ts (componente a reutilizar, NO dupliques esta lógica)
- appsweb\angular\src\app\modules\operations.luxuryapp\dashboard\* (componentes actuales, NO los modifiques — RN-DASH-001/002)
- El endpoint implementado en la Fase 1.1 (revisa su contrato real en el código, no lo asumas del DTO planeado)

Implementa solo el backlog de Frontend de la sección 4 y el diseño de la sección 3.2.
Usa <app-chart-wrapper> para los gráficos, no instales ninguna librería nueva.
Cero valores hardcodeados de color/spacing — solo var(--ds-*) (sección 3.4). Corre el grep de validación de la sección 3.4 y reporta el resultado.

Al terminar, escribe tu reporte en D:\repos\luxuryapp-api\response.md con: archivos creados/modificados (ruta completa), decisiones tomadas, resultado del grep de tokens de diseño, captura o descripción de cómo se ve la vista para un rol Staff vs Corporate, y cualquier bloqueo o desviación del plan.
```

### Fases 2-4 (fuera de alcance de este documento)

Se planearán en documentos separados una vez cerrada y validada la Fase 1 completa (1.1 + 1.2):

- Fase 2: `docs/OperationsLuxuryApp/Dashboard/[fecha]-plan-operations-dashboard-soporte-sla.md`
- Fase 3: `docs/OperationsLuxuryApp/Dashboard/[fecha]-plan-operations-dashboard-financiero.md`
- Fase 4: `docs/OperationsLuxuryApp/Dashboard/[fecha]-plan-operations-dashboard-ejecutivo.md`

## 6. Criterios de Completitud

- [ ] Endpoint `GET api/dashboard/metrics/operational` retorna 200/403 según `RoleType` (sin excepciones no controladas)
- [ ] 0 modificaciones a archivos existentes del Dashboard actual (verificable con `git diff` o comparación de timestamps)
- [ ] `grep` de tokens hardcodeados en `dashboard/metrics/` → 0 resultados
- [ ] Ruta `/dashboard/metrics` accesible solo para los 15 roles de `RN-DASH-020`/`RN-DASH-021`
- [ ] Dashboard actual (`/dashboard`) sigue funcionando idéntico (regresión manual)

## 7. Riesgos y Mitigaciones

Ver tabla de Pre-Mortem en sección 0.3 — se traslada tal cual, cada fila es un riesgo activo de esta Fase 1.

## 8. Dependencias Externas

- Ninguna librería nueva (Chart.js/ng2-charts ya instalados).
- Depende del guard de autenticación/tenant ya existente en el módulo Dashboard (reutilizar, no reimplementar).
- Depende de que `ApplicationRoleAppService.CreateRoles()` no cambie el `RoleType` de los 15 roles listados durante la ejecución de este plan (si cambia, la matriz de la sección 0.2 debe revisarse).

## 9. Métricas y KPIs de Éxito

Ver tabla de KPIs de producto en sección 0.1.

## 10. Rollback Plan

Como no hay cambios de esquema ni modificación de código existente (solo archivos nuevos y una ruta nueva), el rollback es: eliminar los archivos nuevos listados en el backlog (sección 4) y remover la entrada de ruta `/dashboard/metrics`. El dashboard actual no requiere ninguna acción de rollback porque nunca se tocó.

## 11. Post-Implementation Review

Pendiente de completar por el orquestador después de que ambas fases (1.1 y 1.2) sean revisadas y aprobadas: ¿se cumplieron los KPIs de la sección 0.1?, ¿qué riesgos de la sección 0.3 se materializaron?, ¿qué se ajusta antes de planear la Fase 2?
ENTREGABLE ADICIONAL: componente único "Catálogo de KPIs" para revisión de negocio

Además de la vista real /dashboard/metrics, crea UN solo componente que muestre TODOS los KPIs juntos,
para que el Tech Lead pueda revisar si falta alguno, si hay que modificar alguno, y qué rol ve cada uno.

- Ruta: /dashboard/metrics/catalog. Accesible para SuperUsuario y Direccion (que no tienen acceso a la
  vista real en esta fase) además de los 15 roles de la Fase 1. Verifica en el código cómo se declaran
  los guards por rol y reutiliza el patrón existente.
- Usa DATOS DE MUESTRA estáticos (sin llamar al backend), con una etiqueta visible "Datos de muestra".
  Así no toca RN-DASH-020/022 y funciona para cualquier rol autorizado.
- Define los KPIs en un único archivo de configuración tipado (por ejemplo kpi-catalog.config.ts),
  una entrada por KPI, con: id, nombre, descripción, grupo (Operativo / Financiero / Soporte-SLA /
  Ejecutivo), estado (Implementado en Fase 1 / Planeado Fase 2, 3 o 4), fuente de datos (entidad o
  endpoint real), tipo de visualización (card, barras, línea, donut), alcance por RoleType
  (Corporate = todos los customers, Staff = customer seleccionado) y lista de roles que lo ven.
- Incluye TODOS los KPIs del prompt.md original (D:\repos\luxuryapp-api\prompt.md, sección 3), no solo
  los de la Fase 1:
  Operativos: pendientes vs completadas, tiempo promedio de resolución, distribución por tipo de operación.
  Financieros: ingresos diarios/mensuales, costos operativos, margen por operación.
  Soporte/Seguridad: tickets abiertos/cerrados, SLA cumplidos vs incumplidos, roles activos y accesos recientes.
  Los de Fases 2-4 se muestran marcados como "Planeado", con la fuente de datos que ya identificó el
  análisis (docs/OperationsLuxuryApp/Dashboard/20260921-analisis-operations-dashboard.md). No inventes
  fuentes que no existan; si un KPI no tiene fuente hoy (ej. margen por operación), márcalo "Sin fuente de datos".
- Layout: agrupado por grupo de KPI, cada KPI renderizado con su visualización de muestra (reutilizando
  <app-chart-wrapper> y las mismas KPI cards de la vista real) y, junto a cada uno, un bloque con estado,
  fuente, alcance y roles que lo ven.
- Al inicio de la página, agrega una matriz de visibilidad: filas = KPIs, columnas = los 17 roles
  candidatos (SuperUsuario, Direccion, Legal, CoordinacionLegal, RecursosHumanos, Reclutamiento,
  GerenteMantenimiento, SistemasGeneral, Mensajeria, SupervisionOperativa, Administrador,
  GerenteOperaciones, GerenteAtencion, Asistente, Contador, Cobranza, JefeMantenimiento), marcando con
  un indicador accesible (icono AppIcon + texto para lectores de pantalla, no solo color) dónde es visible.
  Para SuperUsuario y Direccion muestra "Por definir (Fase 4)".
- Tokens de diseño y reglas de fechas/iconos igual que el resto de la fase. Incluye este componente en
  los greps de tokens y en el build.
- Si la vista real de /dashboard/metrics puede leer la misma configuración para decidir qué KPI mostrar
  por rol, hazlo; si eso obliga a modificar el diseño ya aprobado, no lo hagas y repórtalo como propuesta.

En el reporte (response.md) agrega una sección "Catálogo de KPIs" con: la ruta, el archivo de
configuración, y una tabla resumen de KPI, estado y roles, generada desde lo realmente implementado.

