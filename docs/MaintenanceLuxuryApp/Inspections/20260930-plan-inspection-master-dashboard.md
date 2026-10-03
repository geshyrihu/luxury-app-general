# 🧭 Plan: `InspectionMasterDashboard` — tablero de acceso rápido a Inspecciones/Recorridos

## Contexto

El módulo de Inspecciones/Recorridos acaba de pasar por una consolidación grande (3 motores de inspección periódica retirados a 1 solo, backend y frontend reescritos). Para poder ir probando manualmente cada pantalla del módulo sin memorizar/escribir URLs a mano, se necesita un tablero de navegación rápida — igual al patrón `master-dashboard` que ya existe en `accounting.luxuryapp/general-ledger` — con una tarjeta por cada pantalla real del módulo. Es una herramienta de apoyo para pruebas durante desarrollo activo, no una feature de producto formal.

Verificado directamente: el árbol de rutas realmente vivo es `src/app/routing/inspection.routing.ts` (montado en `/inspections` desde `pages.routes.ts`). El archivo `modules/maintenance.luxuryapp/maintenance.routes.ts`, que también parece tener rutas de inspección, **no se importa desde ningún lado — está muerto**, se ignora por completo.

Se encontró además código muerto/roto en el módulo (`DetallesInspeccion` con imports a carpetas que ya no existen tras el refactor) — se excluye del dashboard, no se enlaza ni se toca.

## Diseño

**Patrón de referencia:** `accounting.luxuryapp/general-ledger/master-dashboard` (grupos con cards, `LxCard` en desktop + `ili-list-item` en mobile, click vía `Router.navigateByUrl`, sin `routerLink`). Nombrado siguiendo el patrón más reciente (`SupervisionMasterDashboard`): clase `InspectionMasterDashboard`, selector `app-inspection-master-dashboard`.

**Sin filtrado por rol** — a diferencia de `accounting` (que sí filtra), sigue el precedente de `SupervisionMasterDashboard` (que tampoco filtra). Es una herramienta temporal de pruebas; agregar roles introduciría fricción (usuario de prueba sin el rol correcto) que va contra el propósito de la herramienta. Sin `.spec.ts` ni `.scss`, igual que el de accounting.

**5 cards, en 2 grupos**, cubriendo todas las pantallas navegables sin parámetro obligatorio:

| Grupo | Card | Ruta |
|---|---|---|
| Administración de Recorridos | Catálogo de Recorridos | `/inspections/catalog` |
| Administración de Recorridos | Informes de Inspección | `/inspections/inspection-report-list` |
| Administración de Recorridos | Áreas de Inspección (placeholder) | `/logbook/inspections-areas` |
| Mis Recorridos | Mis Recorridos (Lista) | `/inspections/my-inspection-list` |
| Mis Recorridos | Ejecutar Recorrido | `/inspections/my-inspection` |

Excluidas a propósito (documentado con comentario en el archivo de datos): `details/:id`, `result/:id`, `qr/:code` — requieren parámetro, no son destino válido de "ir a"; se llega a ellas navegando desde catálogo/lista/escaneo QR. `InspectionsAreas` se incluye igual (es un stub vacío hoy) porque el propósito es justamente poder confirmar en qué estado está cada pantalla.

## Archivos a crear

Todos bajo `appsweb/angular/src/app/modules/maintenance.luxuryapp/inspection/inspection-master-dashboard/`:

1. **`inspection-module.model.ts`** — interfaces `InspectionModuleCard` (`title`, `description`, `route`, `icon: AppIconName`, `color`, `bgColor`) e `InspectionModuleGroup` (`label`, `icon`, `cards`).
2. **`inspection-modules.ts`** — exporta `INSPECTION_MODULES: InspectionModuleGroup[]` con los 2 grupos y 5 cards de la tabla arriba, con comentario explicando la exclusión de rutas con parámetro.
3. **`inspection-master-dashboard.ts`** — componente standalone, `selector: "app-inspection-master-dashboard"`, `imports: [AppIcon, LxCard, MobileListItem]`, `ChangeDetectionStrategy.Eager`, inyecta solo `Router`; método `getVisibleGroups()` retorna `INSPECTION_MODULES` sin filtrar, método `navigateTo(route)` llama `router.navigateByUrl(route)`.
4. **`inspection-master-dashboard.html`** — clon del layout de `accounting/master-dashboard.html`: bloque desktop (`d-none d-md-block`) con `@for` sobre grupos → `<div class="row g-4">` con `@for` sobre cards → `<lx-card class="card card--interactive card--elevated h-full" (click)="navigateTo(module.route)">` (icono en círculo de color, flecha, título, descripción); bloque mobile (`d-block d-md-none`) con `@for` sobre grupos → `<ili-list-item class="ion-no-padding" (click)="navigateTo(module.route)">` con slot `start` para el icono.

Reutiliza: `LxCard` (`@ui/adaptive/card/card`), `MobileListItem` (`@ui/mobile/list-item/list-item`), `AppIcon` (`@ui/shared/app-icon/app-icon`) — todos ya existentes, ninguno se crea.

## Archivo a editar

**`src/app/routing/inspection.routing.ts`** (confirmado: array plano `Routes`, `authGuard` ya importado en línea 2) — insertar como **primer elemento** del array `inspectionRoutes`, antes de `catalog`:

```ts
{
  path: "",
  loadComponent: () =>
    import("@maintenance.luxuryapp/inspection/inspection-master-dashboard/inspection-master-dashboard").then(
      (m) => m.InspectionMasterDashboard,
    ),
  canActivate: [authGuard],
  data: { title: "Inspecciones", breadcrumb: "Inspecciones" },
},
```

No se toca `pages.routes.ts` — el `loadChildren` que monta `/inspections` ya existe y sigue igual; el `path: ""` nuevo solo hace que `/inspections` (sin segmentos) resuelva al dashboard.

## Verificación

1. `npm run build` sin errores (valida imports y resolución de `loadComponent`).
2. `ng serve`, navegar a `/inspections`: debe cargar el dashboard con 2 grupos y 5 cards visibles (desktop: grid; mobile: lista).
3. Click en cada una de las 5 cards y confirmar que navega a la pantalla correcta (la de "Áreas de Inspección" cargará pero sin contenido — es el comportamiento esperado del stub).
4. Confirmar que las rutas hermanas ya existentes (`/inspections/catalog`, `/inspections/details/123`, etc.) siguen funcionando sin cambios.

---

## 📒 Registro de Ejecución

| Fase | Estado | Validación |
|---|---|---|
| Fase 1 — crear dashboard + ruta | ✅ Completa | ✅ Build propio + navegación real con Playwright (sesión admin) confirmaron las 5 cards y la navegación funcional |
| Fase 2 — Guía de uso + fix stub Áreas + label botón ➕ | ✅ Completa | ✅ Verificado con Playwright (sesión admin): guía visible desktop+mobile, empty state real en Áreas, tooltip "Nuevo Recorrido" confirmado por hover |

### 🧭 Fase 2 — Guía de uso en el dashboard + 2 fixes menores

Contexto completo y diagramas: `docs/MaintenanceLuxuryApp/Inspections/20260930-analisis-flujo-modulo-inspecciones.md` (léelo primero, ahí está el porqué).

**Alcance de esta fase (3 cambios, todos en `appsweb/angular`):**

1. **Bloque "Guía rápida" en `inspection-master-dashboard.html`**, entre el header ("Inspecciones / Panel central...") y el primer grupo de cards. Contenido (texto exacto a usar, ajustar solo si el copy no cabe bien visualmente):
   - Título: "¿Qué es un Recorrido?"
   - Cuerpo: "Un Recorrido es una inspección periódica de un grupo de equipos o áreas. El Administrador lo crea en el Catálogo definiendo frecuencia y equipos; el sistema genera automáticamente las inspecciones pendientes cada día. El responsable asignado las ve en 'Mis Recorridos' y las ejecuta ahí mismo. Si encuentra un hallazgo crítico, se notifica automáticamente al Jefe de Mantenimiento."
   - Estilo: un `<div class="card p-3">` simple (o reutilizar `lx-card` sin `card--interactive`, ya que no es clickeable) con ícono `material-symbols-light:info` — NO crear componente nuevo, es contenido estático embebido en el mismo `inspection-master-dashboard.html`.
   - No tocar `inspection-master-dashboard.ts` salvo si hace falta una propiedad trivial; no se requiere lógica nueva, es contenido estático.

2. **Fix en `InspectionsAreas` (`appsweb/angular/src/app/modules/maintenance.luxuryapp/inspection/inspection-areas/inspections-areas.ts`)**: hoy es `export class InspectionsAreas {}` sin template (renderiza vacío). Agregar un template mínimo inline con un mensaje claro tipo "Próximamente — catálogo de áreas de inspección en desarrollo." (usar el mismo patrón visual de "empty state" que ya usan otras pantallas del módulo, ej. el ícono + texto que se ve en `my-inspection-list` cuando dice "Sin registros"). No implementar funcionalidad real, solo dejar de mostrar una página en blanco.

3. **Label/tooltip en el botón ➕ del catálogo** (`appsweb/angular/src/app/modules/maintenance.luxuryapp/inspection/inspection-list/lista-inspecciones.html` o `.ts` — localizar el botón exacto): agregar `label`/`title`/`aria-label` "Nuevo Recorrido" según el patrón que ya usan botones similares en el mismo archivo o en pantallas hermanas (`il-button` con `iconClass` suele llevar `label`).

**Verificación pedida:**
- `npm run build` sin errores.
- Con Playwright o navegación manual (credenciales de prueba si las tienes, o descríbelo si no puedes loguear): confirmar que `/inspections` muestra el bloque de guía arriba de las cards, que `/logbook/inspections-areas` ya no está en blanco, y que el botón ➕ del catálogo tiene el label/tooltip visible.
- `git diff --check`.

Al terminar, agrega tu reporte al final de "📤 Reportes de agentes externos" con el mismo formato de la Fase 1.

### 📤 Reportes de agentes externos

#### 📤 Reporte — Fase 1 (2026-09-30)
- **Qué se hizo:** Se creó `InspectionMasterDashboard` siguiendo el patrón de `accounting.luxuryapp/general-ledger/master-dashboard`: dos grupos sin filtrado por rol y cinco cards para catálogo, informes, áreas placeholder, lista de recorridos y ejecución de recorridos. Se agregó la ruta `path: ""` como primer elemento de `inspectionRoutes`, protegida por `authGuard`.
- **Archivos tocados:** `appsweb/angular/src/app/modules/maintenance.luxuryapp/inspection/inspection-master-dashboard/inspection-module.model.ts`; `inspection-modules.ts`; `inspection-master-dashboard.ts`; `inspection-master-dashboard.html`; `appsweb/angular/src/app/routing/inspection.routing.ts`; este documento.
- **Resultado de las verificaciones/checklist de la fase:** `npm run build`: aplicación generada correctamente, 0 errores. Se observaron únicamente warnings NG8113 preexistentes sobre imports no usados en otros módulos. `git diff --check`: correcto. `ng serve` inició correctamente en `http://127.0.0.1:4200`; navegar a `/inspections` activó `authGuard` y redirigió a `/auth/login`.
- **Bloqueos o dudas:** No se pudo confirmar visualmente las cinco cards ni ejecutar los clicks de navegación porque no existe sesión autenticada/credenciales disponibles en esta ejecución. El bloqueo es de acceso de prueba, no de compilación ni resolución de rutas.

> **Nota de verificación (Claude, 2026-09-30):** verifiqué la Fase 1 yo mismo con Playwright usando sesión real (`admin`), no solo confié en el reporte. Confirmado: build limpio, 5 cards renderizan y navegan, rutas hermanas intactas. Además detecté 2 hallazgos que motivaron la Fase 2: (a) ya existía un submenú lateral "Inspecciones" con 2 destinos que se solapan con el dashboard nuevo sin ninguna señal de que son la misma cosa, (b) `/logbook/inspections-areas` está completamente vacío sin mensaje. Detalle completo con diagramas en `20260930-analisis-flujo-modulo-inspecciones.md`.

#### 📤 Reporte — Fase 2 (2026-09-30)
- **Qué se hizo:** Se agregó bloque estático "¿Qué es un Recorrido?" al dashboard en variantes desktop y mobile, con explicación del flujo Administrador → generación automática → responsable → hallazgo crítico. Se reemplazó el stub vacío de `InspectionsAreas` por un empty state inline con ícono y mensaje "Próximamente — catálogo de áreas de inspección en desarrollo.". Se actualizó el botón ➕ del catálogo con label y tooltip "Nuevo Recorrido".
- **Archivos tocados:** `appsweb/angular/src/app/modules/maintenance.luxuryapp/inspection/inspection-master-dashboard/inspection-master-dashboard.html`; `appsweb/angular/src/app/modules/maintenance.luxuryapp/inspection/inspection-areas/inspections-areas.ts`; `appsweb/angular/src/app/modules/maintenance.luxuryapp/inspection/inspection-list/lista-inspecciones.html`; este documento.
- **Resultado de las verificaciones/checklist de la fase:** `npm run build`: aplicación generada correctamente, 0 errores. Se observaron únicamente warnings NG8113 preexistentes en módulos ajenos. `git diff --check`: correcto. Navegación a `/inspections` con `ng serve` confirmó que `authGuard` redirige a `/auth/login` sin sesión.
- **Bloqueos o dudas:** No se pudo confirmar visualmente el bloque, el mensaje de áreas ni el tooltip porque no hay sesión autenticada/credenciales disponibles en esta ejecución. El bloqueo es de acceso de prueba; compilación y cambios de código quedan verificados.

> **Nota de verificación (Claude, 2026-09-30):** verifiqué la Fase 2 con Playwright y sesión real (`admin`). Confirmado en pantalla: (1) el bloque "¿Qué es un Recorrido?" se ve en `/inspections` tanto en desktop (1440px) como en mobile (390px), con el texto largo en desktop y el abreviado en mobile, tal como se pidió; (2) `/logbook/inspections-areas` ya no está en blanco — muestra ícono + "Próximamente — catálogo de áreas de inspección en desarrollo."; (3) el botón ➕ del catálogo tiene `aria-label="Nuevo Recorrido"` y al hacer hover muestra el tooltip visual "Nuevo Recorrido" (screenshot confirmado). `npm run build` propio: 0 errores, mismos warnings NG8113 preexistentes. **Fase 2 cerrada.**
