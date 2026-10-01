# TICKET T-14b — Frontend: pantalla del tablero de cumplimiento

Trabajas en el repositorio LuxuryApp (Angular 22). Antes de escribir código, lee `CONVENTIONS.md`
y `AGENTS.md`. Este ticket consume el endpoint de T-14a (ya aprobado), construyendo una pantalla
de sólo lectura. No toca backend.

## Endpoint a consumir

`GET api/recurring-task-compliance/dashboard/{customerId:guid}` → `ComplianceDashboardDTO`:
`groups: ComplianceGroupDTO[]`, `totalGroupsWithoutTemplates: number` (camelCase, serialización
estándar de ASP.NET Core). Cada `ComplianceGroupDTO`: `workGroupId`, `workGroupName`,
`categoryName`, `hasActiveTemplates`, `onTimeCount`, `overdueCount`, `breachedCount`,
`carriedOverCount`, `criticalClosedTotal`, `criticalClosedWithAttachmentCount`. **Nota real del
modelo de datos** (confirmada en la auditoría de T-14a): `workGroupName` y `categoryName` van a
llegar con el mismo valor — `WorkGroup` no tiene nombre propio en el backend. Muestra una sola
columna "Grupo" con `workGroupName`, no dupliques la columna.

## Estructura nueva

Carpeta: `client/angular/src/app/apps/operations.luxuryapp/task-engine/recurring-tasks/compliance/recurring-task-compliance-dashboard/`
con `.ts`, `.html`, `.spec.ts`. Componente de **sólo lectura**, sin diálogo de alta/edición — no
hay CRUD aquí.

Usa `task-template-list.ts` (`.../templates/task-template-list/`, ya usado como referencia exacta
vista dual web/mobile (`DataViewMobile`), `signal<T[]>([])` + `onLoadData()`. Diferencia clave: no
hay acción de agregar/editar/eliminar — es un tablero, no un catálogo.

- El cliente sale de `customer-id.service.ts` (`this.customerIdS.customerId()`), igual que T-06 —
  no se pide ni se recibe por parámetro.
- Señales: `groups = signal<ComplianceGroupDTO[]>([])`,
  `totalGroupsWithoutTemplates = signal(0)`, `loading = signal(true)`.

## Endpoint centralizado nuevo

Archivo: `client/angular/src/app/core/constants/endpoints/operations.endpoints.ts`. Agrega, junto
a `TaskGroups` (no lo toques), un bloque nuevo:

```typescript
RecurringTaskCompliance: {
  dashboard: (customerId: string) => `recurring-task-compliance/dashboard/${customerId}`,
},
```

## Interfaz TypeScript

Archivo nuevo: `client/angular/src/app/core/interfaces/recurring-tasks/recurring-task-compliance.interface.ts`
reflejando `ComplianceDashboardDTO`/`ComplianceGroupDTO` en camelCase (ver campos arriba).

## Contenido de la pantalla

1. **Resumen superior**: si `totalGroupsWithoutTemplates() > 0`, muestra una alerta/banner
   (revisa qué componente de alerta ya usa el catálogo de `shared/ui` del proyecto — no
   hardcodees colores, usa tokens de diseño) con el texto "{{ totalGroupsWithoutTemplates() }}
   grupo(s) sin ninguna obligación recurrente capturada".
2. **Tabla** (patrón dual web/mobile de `task-template-list`), una fila por grupo, columnas:
   - Grupo (`workGroupName`)
   - Plantillas activas (badge Sí/No de `hasActiveTemplates`)
   - Al corriente (`onTimeCount`)
   - Vencidas (`overdueCount`)
   - Incumplimiento (`breachedCount`)
   - Arrastre (`carriedOverCount`)
   - Comprobante en críticas — **calcula el porcentaje en el cliente**, no lo pidas al backend
     (el DTO entrega los enteros crudos a propósito): si `criticalClosedTotal === 0`, muestra
     "N/A" (no hay tareas críticas cerradas que evaluar, no es 0% ni 100%); si no, muestra
     `Math.round(criticalClosedWithAttachmentCount / criticalClosedTotal * 100) + '%'`.
3. Sin acciones de fila (ver/editar/eliminar) — es de sólo lectura.

## Ruta

Registra una ruta nueva `compliance` bajo el mismo padre que ya usa `recurring-tasks` en
`client/angular/src/app/routing/pages.routes.ts` (revisa cómo está registrado hoy el padre
`"recurring-tasks"`, línea ~524-533, y sigue el mismo criterio de `canActivate: [authGuard]` que
usan las rutas vecinas de `recurring-tasks.routing.ts`). No es necesario agregarla a ningún menú
de navegación en este ticket — si encuentras un archivo de configuración de menú donde sea trivial
agregarla siguiendo un patrón ya existente, hazlo y repórtalo; si no es evidente cuál es el
archivo correcto, no inventes uno, repórtalo como pendiente.

## Lo que NO debes hacer

- No agregues alta/edición/borrado — es un tablero de sólo lectura.
- No calcules el porcentaje de K5 en el backend ni le pidas ese cambio a T-14a (ya aprobado) — se
  calcula en el cliente con los enteros crudos que ya vienen.
- No toques `Endpoints.TaskGroups`, ni ningún endpoint ni componente de T-13/T-06/T-04.
- No agregues filtros de fecha ni de grupo individual — el tablero completo del cliente en una
  pantalla, igual que el backend.

## Verificación obligatoria

Desde `client/angular/`, usa la config de vitest aislada ya establecida
(`vitest.cobranza-nativa.config.ts`) apuntando a los archivos de spec exactos del componente
nuevo.

```bash
node ../../scripts/scan-mojibake.mjs [rutas de los archivos que tocaste, con el prefijo client/angular/ desde la raíz del repo]
```

Pega la salida literal de ambos comandos, con el conteo real de tests.

## Criterio de PASO

- La pantalla carga el tablero del cliente en contexto sin pedirlo al usuario.
- Los conteos y el porcentaje de K5 se muestran correctamente, incluyendo el caso "N/A" cuando
  `criticalClosedTotal === 0`.
- El banner de "grupos sin plantilla" aparece sólo cuando `totalGroupsWithoutTemplates > 0`.
- Es de sólo lectura — ninguna acción de escritura contra el backend.

## Reporte de finalización

1. Archivos creados/modificados, con una línea de qué hace cada uno
2. Salida literal de los comandos de verificación, con el conteo de tests
3. Decisiones que tomaste por tu cuenta y por qué (en particular: qué hiciste con el menú de
   navegación, si algo)
4. Lo que NO hiciste del ticket y el motivo
5. Riesgos detectados que no estaban en este prompt

No avances al siguiente ticket. Espera la auditoría.
