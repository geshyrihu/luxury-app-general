# TICKET T-17 — Conectar a routing el catálogo de plantillas (T-06)

Trabajas en el repositorio LuxuryApp (`client/angular`). Antes de escribir código, lee
`CONVENTIONS.md` y `AGENTS.md`.

Este ticket **no crea ningún componente nuevo**. `RecurringTaskCatalogList` y
`RecurringTaskCatalogForm` (T-06, ya aprobados) existen completos y funcionan — sólo nunca se
conectaron a ninguna ruta, así que hoy son inalcanzables desde el menú. Es exclusivamente cablear
routing + menú, tres archivos.

## Contexto

El usuario pidió un "administrador de alertas" en las opciones del proyecto (`/admin`, donde ya
viven `Jobs`, `Respaldo de BD`, `Vault de Secretos`, `Checklist Asamblea`, etc.). Investigado el
alcance: lo único que falta y aplica aquí es conectar el catálogo de `RecurringTaskTemplate`
(criticidad, aviso previo, respaldo obligatorio) que T-06 dejó construido a propósito sin
routing. La bitácora de alertas (`TaskAlertLog`) y el monitoreo de jobs quedaron fuera de este
ticket — el usuario los descartó explícitamente al acotar el alcance.

## Archivos a tocar (los 3, ningún otro)

### 1. `client/angular/src/app/apps/admin.luxuryapp/admin.routes.ts`

Agrega una entrada nueva a `adminRoutes`, mismo patrón que `assembly-checklist-catalog`
(línea 351-361) — **no** el de `vault-secrets`/`database-backup`, que usan
`superUsuarioGuard` de más: el catálogo de plantillas recurrentes ya tiene su propia
autorización en el backend (`RecurringTaskCatalogAppService.ValidateTemplateAsync`, T-04) que
permite `SuperUsuario`, `Direccion` y `Administrador` (`RN-ALT-021`) — un guard de ruta más
estricto que eso los bloquearía sin motivo.

```ts
{
  path: "recurring-task-catalog",
  loadComponent: () =>
    import("src/app/apps/operations.luxuryapp/task-engine/recurring-tasks/catalog/recurring-task-catalog-list/recurring-task-catalog-list").then(
      (m) => m.RecurringTaskCatalogList,
    ),
  canActivate: [authGuard],
  data: {
    title: "Catálogo de Tareas Recurrentes",
    breadcrumb: "Catálogo de Tareas Recurrentes",
  },
},
```

Colócala junto a las demás entradas de `Configuración de Sistema` (cerca de
`assembly-checklist-catalog`/`jobs`), no en otra sección del archivo.

### 2. `client/angular/src/app/apps/admin.luxuryapp/admin-wrapper/admin-modules.ts`

Agrega un tile más al arreglo `cards` de la sección `"Configuración de Sistema"` (la que ya tiene
`roles: [ApplicationRole.SuperUsuario]`, líneas 239-307), mismo estilo visual que sus vecinos
(mismo `color`/`bgColor` que el resto de esa sección — no inventes una paleta nueva):

```ts
{
  title: "Catálogo de Tareas Recurrentes",
  description: "Plantillas de tareas recurrentes: criticidad, aviso previo y respaldo.",
  route: "/admin/recurring-task-catalog",
  icon: "material-symbols-light:event-repeat",
  color: "#4338ca",
  bgColor: "#e0e7ff",
},
```

**Nota, no es un error tuyo si lo notas:** esta sección del menú sólo es visible para
`SuperUsuario` (`roles: [ApplicationRole.SuperUsuario]` a nivel de sección), mientras que la ruta
en sí (paso 1) permite también `Direccion`/`Administrador` porque el backend ya lo autoriza así.
Es la misma inconsistencia que ya existe hoy con `assembly-checklist-catalog` en esta misma
sección — un `Direccion`/`Administrador` puede entrar a la URL directamente aunque el tile no le
aparezca en este menú. No es parte de este ticket corregir esa inconsistencia preexistente de
visibilidad de menú; sólo replica el patrón ya establecido, no lo empeores ni lo arregles por tu
cuenta.

### 3. `client/angular/src/app/routing/route-whitelist.ts`

Agrega `"/admin/recurring-task-catalog",` junto a las demás entradas `/admin/...` (cerca de
`/admin/jobs`, `/admin/vault-secrets`, `/admin/database-backup`).

## Lo que NO debes hacer

- No toques `RecurringTaskCatalogList`, `RecurringTaskCatalogForm`, sus `.html` ni sus `.spec.ts`
  — ya están aprobados (T-06/T-06b), no son parte de este ticket.
- No toques ningún archivo de backend.
- No implementes la bitácora de alertas (`TaskAlertLog`) ni ninguna pantalla de monitoreo de
  jobs — el usuario los descartó explícitamente de este alcance.
- No agregues `superUsuarioGuard` a la ruta del paso 1 — ver la justificación arriba.
- No "corrijas" la inconsistencia de visibilidad de menú del paso 2 — no es de este ticket.

## Convenciones aplicables

- `CONVENTIONS.md` §4.2 (Angular 22, routing)
- Archivos en UTF-8 sin mojibake

## Verificación obligatoria

```bash
cd client/angular
npx vitest run src/app/apps/operations.luxuryapp/task-engine/recurring-tasks/catalog/recurring-task-catalog-list/recurring-task-catalog-list.spec.ts src/app/apps/operations.luxuryapp/task-engine/recurring-tasks/catalog/recurring-task-catalog-form/recurring-task-catalog-form.spec.ts --config vitest.cobranza-nativa.config.ts
cd ../..
node scripts/scan-mojibake.mjs client/angular/src/app/apps/admin.luxuryapp/admin.routes.ts client/angular/src/app/apps/admin.luxuryapp/admin-wrapper/admin-modules.ts client/angular/src/app/routing/route-whitelist.ts
```

Los tests de T-06 deben seguir pasando (5/5, no debiste tocarlos). Criterio: mojibake en cero
sobre los 3 archivos tocados.

**Verificación manual adicional, descríbela en el reporte:** abre `/admin` en el navegador y
confirma que el tile "Catálogo de Tareas Recurrentes" aparece y navega a
`/admin/recurring-task-catalog` mostrando la lista (o el estado vacío si no hay plantillas para
el cliente en sesión).

## Reporte de finalización

1. Archivos tocados, con una línea de qué cambió en cada uno
2. Salida literal de los comandos de verificación
3. Confirmación de la verificación manual en navegador (o el motivo si no pudiste hacerla)
4. Decisiones que tomaste por tu cuenta y por qué
5. Riesgos detectados que no estaban en este prompt

No avances a ningún ticket adicional. Espera la auditoría.
