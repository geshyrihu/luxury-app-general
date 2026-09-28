# TICKET D11-03 — Frontend: organigrama sobre roles

Trabajas en el repositorio LuxuryApp (Angular 22). Antes de escribir código, lee `CONVENTIONS.md`
y `AGENTS.md`. El backend ya está aprobado (D11-02): el árbol ahora es Rol→Rol, cada nodo trae
una lista `Members` (los `WorkPosition` que hoy ocupan ese rol para el cliente), en vez de ser un
único puesto con 0 o 1 empleado. Este ticket adapta el editor visual del organigrama a ese cambio
de modelo. No toca backend.

## Contrato nuevo del backend (ya aprobado, no lo cambies)

`GET api/work-position-org-chart/tree/{customerId}` → `List<RoleOrgChartNodeDto>` (camelCase en
JSON): `roleId` (string), `roleDisplayName`, `departmentName`, `hierarchyLevel`, `sortOrder`,
`members: RoleOrgChartMemberDto[]`, `children: RoleOrgChartNodeDto[]`.

`RoleOrgChartMemberDto`: `workPositionId` (string/Guid), `folio`, `hasEmployee` (bool),
`employeeName`, `employeeEmail`, `employeePhone`, `employeePhoto`, `state`.

**Cambio de ruta:** `PATCH api/work-position-org-chart/reassign/{customerId}` (antes no llevaba
`customerId` en la URL). Body: `RoleOrgChartReassignRequest { roleId, newReportsToRoleId,
sortOrder }`.

## Qué existe hoy (para no rediseñar a ciegas)

Componente: `client/angular/src/app/apps/recursos-humanos.luxuryapp/expediente-del-empleado/employees/org-chart/org-chart.ts`
(796 líneas) + `.html` (476 líneas). Dos vistas en tabs: "ver" (`ngx-graph`, tarjetas SVG
custom) y "editar" (tabla plana indentada). Drag-and-drop nativo HTML5 + selección por clic, ambos
llaman `validateReassignment()` y luego `executeReassign()`.

Helpers en `helpers/`:
- `org-chart-graph-adapter.ts` — arma nodos/links de `ngx-graph`. Hoy asume **un solo empleado por
  nodo** (`secondaryLabel = employeeName ?? "Vacante"`, `isVacant = !hasEmployee`).
- `org-chart-grouping.ts` — agrupa sintéticamente hermanos-hoja que comparten rol cuando son ≥3,
  con IDs sintéticos `GROUP__<parentId>__<roleDisplayName>` y expandir/colapsar. **Con el modelo
  nuevo esto ya no hace falta: un nodo de rol ES el grupo, sus miembros ya vienen agregados por el
  backend.** Retíralo (ver Tarea 3).
- `org-chart-tree-ops.ts` — navegación de árbol genérica (buscar, hermanos, reordenar). Sin
  supuestos de empleado — reutilizable cambiando sólo el nombre del campo id.
- `org-chart-validation.ts` — detección de ciclos (genérica) + regla de "no reasignar un nodo de
  grupo sin expandirlo" (artefacto de la agrupación sintética — ya no aplica, ver Tarea 4).

Interfaces: `client/angular/.../org-chart/interfaces/org-chart.interfaces.ts` —
`IWorkPositionOrgChartNode`, `IWorkPositionReassignRequest`, `IWorkPositionReassignResponse`, etc.

Endpoints: `EndpointsReclutamiento.OrgChart` en `client/angular/src/app/core/constants/endpoints/reclutamiento.endpoints.ts:14-17`.

## Tarea 1 — Endpoints e interfaces

Actualiza `EndpointsReclutamiento.OrgChart`:

```typescript
OrgChart: {
  getTree: (customerId: Id) => `work-position-org-chart/tree/${customerId}`,
  reassign: (customerId: Id) => `work-position-org-chart/reassign/${customerId}`,
},
```

Reemplaza las interfaces en `org-chart.interfaces.ts` por el nuevo contrato:

```typescript
export interface IRoleOrgChartMember {
  workPositionId: string;
  folio: string;
  hasEmployee: boolean;
  employeeName?: string;
  employeeEmail?: string;
  employeePhone?: string;
  employeePhoto?: string;
  state: string;
}

export interface IRoleOrgChartNode {
  roleId: string;
  roleDisplayName: string;
  departmentName: string;
  hierarchyLevel: number;
  sortOrder: number;
  members: IRoleOrgChartMember[];
  children: IRoleOrgChartNode[];
}

export interface IRoleOrgChartReassignRequest {
  roleId: string;
  newReportsToRoleId: string | null;
  sortOrder: number;
}
```

`IWorkPositionReassignResponse` no cambia de forma, sólo renómbrala si quieres consistencia de
nombre (no es obligatorio). Actualiza todos los imports/usos en `org-chart.ts` y los 4 helpers.

## Tarea 2 — `org-chart.ts` / `.html`: `workPositionId` → `roleId`, un solo empleado → lista de miembros

- Todo lo que hoy identifica un nodo por `workPositionId` pasa a `roleId` (selección, drag-and-drop,
  búsqueda de nodo, payload de `executeReassign`).
- `executeReassign()` ahora manda el `PATCH` a `Endpoints.OrgChart.reassign(customerId)` (antes
  era una ruta fija) con body `{ roleId, newReportsToRoleId, sortOrder }`.
- Las tarjetas del grafo (`ngx-graph`, plantilla `#nodeTemplate`) y las filas de la tabla de
  edición ya no muestran "un nombre de empleado" — muestran el rol (`roleDisplayName`,
  `departmentName`) más un indicador de cuántos miembros tiene (`members.length`) y cuántos están
  vacantes (`members.filter(m => !m.hasEmployee).length`). Al hacer clic/expandir un nodo, muestra
  la lista de miembros (folio, nombre, email, teléfono, foto, estado) — puedes reutilizar el mismo
  patrón visual que antes usaba `EmployeeName/Email/Phone/Photo` por nodo, ahora repetido por cada
  elemento de `members`.
- `totalNodes`/`vacantCount` (org-chart.ts:106-119, usa `flattenOrgChartNodes`): redefine como dos
  métricas explícitas — **total de roles** en el árbol (`flattenOrgChartNodes(nodes).length`) y
  **total de vacantes** (suma de miembros sin empleado en todos los nodos, no cuenta de nodos).
  No mezcles ambas cifras en una sola.
- Ya no hace falta arrastrar/seleccionar miembros individuales — sólo nodos de rol son
  arrastrables/seleccionables, igual que antes sólo los puestos lo eran.

## Tarea 3 — Retirar `org-chart-grouping.ts`

Bórralo junto con su `.spec.ts`. Quita su uso de `org-chart.ts` (`groupSiblingsByRole`,
`toggleGroup()`, `expandedGroupIds`, y cualquier campo `isGroup`/`groupMemberCount`/
`isGroupExpanded` que hoy se le agregaba a los nodos). Si al quitarlo el árbol crudo del backend
ya es exactamente lo que hay que renderizar (sin transformación adicional de agrupamiento), no
necesitas ningún reemplazo — el "expandir para ver miembros" de la Tarea 2 es la única interacción
de expansión que queda, y es distinta (por nodo, no por grupo sintético de hermanos).

## Tarea 4 — Adaptar `org-chart-validation.ts`

Quita el bloque de rechazo por `isGroup` (líneas ~22-27 del archivo original) — ya no existen
nodos sintéticos de grupo. El resto (self-assignment, detección de ciclos vía `.children`) se
mantiene igual, sólo cambia el nombre del campo id (`workPositionId` → `roleId`).
Actualiza `org-chart-validation.spec.ts` quitando el caso de `isGroup` (si existía) y ajustando los
demás al nuevo nombre de campo.

## Tarea 5 — Adaptar `org-chart-tree-ops.ts` y `org-chart-graph-adapter.ts`

- `org-chart-tree-ops.ts`: cambia `workPositionId` por `roleId` en las firmas y en los specs. La
  lógica no cambia.
- `org-chart-graph-adapter.ts`: `createVirtualRootNode` usa `roleId: ORG_CHART_VIRTUAL_ROOT_ID`,
  `members: []`. `secondaryLabel`/`isVacant` en `buildOrgChartGraph` se recalculan sobre
  `node.members` (ver Tarea 2). `getDepartmentAccentColor` no cambia.

## Lo que NO debes hacer

- No toques backend, endpoints de .NET, ni las entidades — ya aprobados.
- No agregues arrastre/selección de miembros individuales — sólo nodos de rol se reasignan.
- No inventes un mecanismo de "elegir un jefe específico" — ya se decidió que eso no es parte de
  este rediseño (ver `ManagerName` retirado en D11-02).
- No toques `work-position-list.ts`, `employee-file-detail.ts`, ni ninguna otra pantalla que use
  `WorkPosition` fuera del organigrama — confirmado que no dependen de esto.

## Verificación obligatoria

Desde `client/angular/`, usa la config de vitest aislada ya establecida
(`vitest.cobranza-nativa.config.ts`) apuntando a los specs de `org-chart/` y sus helpers.

```bash
node ../../scripts/scan-mojibake.mjs [rutas de los archivos que tocaste, con el prefijo client/angular/ desde la raíz del repo]
```

Pega la salida literal de ambos comandos, con el conteo real de tests. Espera que algunos tests
existentes de `org-chart-grouping.spec.ts` desaparezcan por completo (se borró el archivo que
prueban) — repórtalo explícitamente, no lo escondas en el conteo total.

## Criterio de PASO

- El árbol se renderiza correctamente con nodos de rol, cada uno mostrando su roster de miembros.
- Reasignar un rol llama al endpoint nuevo (`reassign/{customerId}`) con el body correcto.
- `org-chart-grouping.ts` ya no existe; nada en `org-chart.ts` lo referencia.
- La detección de ciclos y el reordenamiento de hermanos siguen funcionando (verificado por los
  tests adaptados de `org-chart-validation`/`org-chart-tree-ops`).
- `scan-mojibake.mjs` en cero.

## Reporte de finalización

1. Archivos creados/modificados/eliminados, con una línea de qué hace cada uno
2. Salida literal de los comandos de verificación, con el conteo de tests (y qué tests
   desaparecieron por el borrado de `org-chart-grouping`)
3. Decisiones que tomaste por tu cuenta y por qué (en particular: cómo decidiste mostrar
   visualmente el roster de miembros dentro de un nodo)
4. Lo que NO hiciste del ticket y el motivo
5. Riesgos detectados que no estaban en este prompt

No avances a ningún otro ticket. Espera la auditoría — con esto se cierra la orquestación D-11 y
queda libre D11-04 (retomar T-12 de la otra orquestación).
