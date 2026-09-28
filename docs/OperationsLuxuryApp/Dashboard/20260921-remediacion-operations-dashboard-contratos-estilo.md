# Remediación 9 (menor) — Igualar el estilo de `contract-type-card` al de mantenimiento/tickets

Plan padre: `20260921-plan-operations-dashboard-contratos-polizas.md`. Decisión del Tech Lead (2026-09-21): la Fase 1.5 funciona correctamente con datos reales; solo se corrige el estilo visual.

Regla de trabajo: solo lo que dice este documento. Si crees que hay una mejor manera, PARA y repórtalo. No afirmes lo que no hayas verificado.

Archivo: `appsweb/angular/src/app/modules/operations.luxuryapp/dashboard/metrics/components/contract-type-card.ts`.

## Hallazgos verificados

1. La tarjeta usa un estilo distinto al de `maintenance-category-card.ts` y `tickets-by-group-card.ts`: icono dentro de un círculo de color (`icon-shape`, `bg-danger`/`bg-secondary`), animación al pasar el mouse (`hover { transform: translateY(-2px) }`), y clases `bg-white`/`bg-light` para el fondo de la tarjeta. Las otras dos usan una tarjeta plana: `<div class="card h-100" style="background-color: var(--ds-bg-surface); border: 1px solid var(--ds-border); border-radius: var(--ds-radius-lg); box-shadow: var(--ds-shadow-sm);">`, sin animación ni icono en círculo.
2. Usa `style="color: white;"` (hardcoded) y `var(--ds-gray-800)`/`var(--ds-gray-500)` — estos dos últimos tokens **no existen** en `appsweb/angular/src/styles` (verificado). El texto cae al color heredado en vez del gris buscado, y no reacciona al modo oscuro.

## Cambio requerido

Reescribe `contract-type-card.ts` para que visualmente sea igual a `maintenance-category-card.ts` (misma tarjeta plana, mismo tamaño de fuente por rol de texto, mismo patrón de icono simple sin círculo de color), pero con un solo indicador (no 4 como mantenimiento):

1. Contenedor: `<div class="card h-100" style="background-color: var(--ds-bg-surface); border: 1px solid var(--ds-border); border-radius: var(--ds-radius-lg); box-shadow: var(--ds-shadow-sm);">`, sin clases `bg-white`/`bg-light`, sin `border-0 shadow-sm` de Bootstrap, sin el bloque `styles: [...]` de hover/transición.
2. Título: icono simple + texto, mismo patrón que `maintenance-category-card.ts` (`<h5 class="card-title d-flex align-items-center mb-3" style="color: var(--ds-text-primary);"><app-icon [icon]="..." class="me-2"></app-icon>{{ item().typeName }}</h5>`). Sin el círculo de color de fondo (`icon-shape`) alrededor del icono.
3. Valor: usa `var(--ds-font-size-metric)` para el número (como en las otras tarjetas) y `var(--ds-font-size-help)`/`var(--ds-text-secondary)` para la etiqueta "vencen en ≤45 días", en vez de las clases `display-5`/`text-muted` de Bootstrap.
4. Color del valor: cuando `total > 0`, usa `var(--ds-danger)` (mismo token que ya usan mantenimiento/tickets para resaltar cifras en rojo); cuando `total === 0`, usa `var(--ds-text-muted)` (token que si existe, verifícalo) en vez de `var(--ds-gray-500)`.
5. Elimina `getCardClasses()`, `getIconClasses()`, y el `style="color: white;"` del icono; el icono puede tomar el mismo color que el valor (rojo si `total > 0`, color por defecto si no), igual que hace `tickets-by-group-card.ts` con `pastPending`.
6. No cambies `getIconName()` (los iconos por tipo de contrato ya son correctos), ni ningún otro archivo.

## No toques

Backend, `maintenance-category-card.ts`, `tickets-by-group-card.ts`, `dashboard-metrics.ts`, `dashboard-metrics.html`, ni ningún otro archivo.

## Verificación obligatoria (pega salidas reales)

1. `npx ng build --configuration development` en `appsweb/angular`.
2. Grep sobre `contract-type-card.ts` que debe dar 0: `color: white|bg-white|bg-light|bg-danger|bg-secondary|--ds-gray-|display-5|text-muted\b|hover`.
3. Confirma con grep que cada token `var(--ds-*)` que uses existe en `appsweb/angular/src/styles`.

## Reporte

Reemplaza `D:\repos\luxuryapp-api\response.md` con un reporte nuevo y breve. No copies el reporte anterior.
