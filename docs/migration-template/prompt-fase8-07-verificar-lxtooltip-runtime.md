# Prompt Fase 8 — Verificar `lxTooltip` (NgbTooltip) en runtime y corregir si falla

## Contexto

La Fase 8 Categoría C migró
`NgbTooltip` de `@ng-bootstrap/ng-bootstrap` usando `hostDirectives` con
alias de inputs (`lxTooltip`→`ngbTooltip`, `tooltipPosition`→`placement`,
`tooltipDisabled`→`disableTooltip`, `tooltipStyleClass`→`tooltipClass`,
`tooltipEvent`→`triggers`). El contrato público `[lxTooltip]` se
conserva y **los 128 templates consumidores no se tocan**.

**Esa migración se validó únicamente con `tsc` + `ng build production`.
Nunca se verificó en runtime.** Es el único criterio de aceptación
transversal que quedó sin cumplirse.

## Síntoma reportado por el usuario

Los tooltips no aparecen al hacer hover.

## Evidencia recogida (no concluyente por sí sola)

- `shared/ui/adaptive/tooltip/tooltip.directive.spec.ts` falla en
  Vitest: `NG0203: The NgbTooltipConfig token injection failed` al
  construir `NgbTooltip`.
- Se reprodujo el mismo error con el uso **estándar** `[ngbTooltip]` +
  `NgbTooltipModule` (spec temporal, ya eliminado), no solo con
  `hostDirectives`.
- En el bundle instalado, `NgbTooltipConfig` se compila sin
  `providedIn` y `NgbTooltipModule` no declara `providers`.
- **Salvedad:** Vitest ya dio problemas en este repo (ver bitácora
  2026-09-17, Paso 3: el test dirigido no terminó en 120s). Desde
  Vitest **no** se puede concluir que falle en producción.

## Tarea 1 — Reproducir en runtime (obligatorio, sin tocar código)

1. Levantar `ng serve` e iniciar sesión.
2. Abrir una pantalla con `lxTooltip` real, por ejemplo
   `/tickets/messages/<ticketGroupId>`: hover sobre el avatar del
   responsable (`[lxTooltip]="item.assignee"`) y sobre el enlace de
   seguimientos (`lxTooltip="Seguimientos"`).
3. Capturar:
   - screenshot con el tooltip visible **o** su ausencia;
   - el error exacto de consola (texto completo + stack), si lo hay.
4. Para separar causas, probar además un `[ngbTooltip]` estándar
   directo en una pantalla de prueba (con `NgbTooltipModule` importado):
   - si el estándar **también** falla → problema de ng-bootstrap/Angular
     en toda la app;
   - si el estándar **funciona** y `lxTooltip` no → problema de
     `hostDirectives`.

## Tarea 2 — Aplicar el fix mínimo según el error exacto

- **Si es `NG0201` / "No provider for NgbTooltipConfig":** añadir el
  provider. Opción mínima y local, sin tocar consumidores:
  `providers: [NgbTooltipConfig]` en el `@Directive` de
  `shared/ui/adaptive/tooltip/tooltip.directive.ts`.
- **Si es `NG0203` (injection context) al instanciar `NgbTooltip`:**
  el `hostDirectives` es el camino roto. Reimplementar
  `tooltip.directive.ts` sin `hostDirectives`, conservando el contrato
  exacto (selector `[lxTooltip]` + los alias de inputs listados arriba).
- **Si el `[ngbTooltip]` estándar también falla en runtime:** revisar
  compatibilidad `@ng-bootstrap/ng-bootstrap@21.0.0` (compilado contra
  Angular 22.0.1) vs `@angular/core@22.1.6`, y evaluar bump del paquete.
  **No tocar `NgbModal`**: los diálogos de toda la app dependen de él.

## Restricciones

- No tocar los **128 consumidores** de `[lxTooltip]`.
- Mantener contrato: selector `[lxTooltip]`, inputs `tooltipPosition`,
  `tooltipDisabled`, `tooltipStyleClass`, `tooltipEvent`, `autoClose`,
  `container`, `animation`, `openDelay`, `closeDelay`.

## Verificación

- `npx tsc --noEmit` → 0 errores.
- `npx ng build --configuration production` con log completo redirigido
  (`> log 2>&1`), sin `tail` → exit 0, 0 `ERROR`.
- Runtime: hover real muestra el tooltip en tema claro y oscuro; 0
  errores `NG0201`/`NG0203` en consola.
- `npm run audit:ui` verde.

## Listo cuando

- Existe evidencia en runtime (screenshot + consola) que confirma
  tooltip visible, **o** el error exacto documentado con su stack.
- Si se aplicó fix: build verde + tooltip visible en runtime.
- Se reporta el error exacto y el fix aplicado (o "no reproducido en
  runtime", si aplica).

## Registro

Al cerrar, añadir entrada en `04-bitacora-cambios.md` con: error exacto
observado, archivos tocados (si hubo), resultado de build y evidencia
visual. Si el resultado cambia el estado de la fila `tooltip` en
`03-inventario-componentes.md`, actualizarla.
