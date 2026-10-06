# Matriz inicial de API, consumidores y acoplamiento de `shared/ui`

**Fecha:** 2026-10-06
**Baseline:** Angular `main` en `4b66d24e3`, limpio y sincronizado con `origin/main`.
**Tipo:** mapa inicial verificable; inventario exhaustivo componente por componente sigue siendo Gate 0.

## 1. API de botones — familia candidata a primer contrato

| Implementación actual | Selector | Clase | Consumidores por import en módulos/core/shared no-UI | Observación |
|---|---|---|---:|---|
| Web | `lux-button-web` | `ButtonWeb` | 627 líneas/archivos con import | API `kind`, `displayMode`, `label`, `icon`, `severity`, `variant`, `size`, `disabled`, `loading`, `type`, `ariaLabel`, `tooltip`; `badgeCount` solo web. |
| Ionic | `lux-button-mobile` | `ButtonMobile` | 157 líneas/archivos con import | Comparte `kind`, `displayMode`, label/icon/status; además `color`, `fill`, `expand`, size Ionic. No expone `badgeCount`. |
| Adaptativa | **No existe** `adaptive/button/` ni `lux-button` | — | 0 | El consumidor elige ButtonWeb o ButtonMobile directamente. API adaptativa es brecha respecto al catálogo objetivo documentado. |

Import breakdown reproducido por Agente 1: producción tiene `@ui/buttons/web` en 627 archivos, `/mobile` en 157 y `/shared` en 161. El reporte total de `ConfirmService` (206) incluye otro scope de búsqueda; mantenerlo separado del import-count productivo.

El nombre `lux-*-web/mobile` ya existe y tiene adopción; no asumir que esos selectores son invisibles/internos hoy. Toda transición a API única debe conservar ambos contratos hasta migrar consumidores por lotes.

### Decisiones de contrato pendientes antes de implementación

1. Normalizar apariencia visual a vocabulario semántico común, con mapeo explícito a Bootstrap/native e Ionic. Evitar prometer propiedades idénticas si una plataforma no puede implementarlas.
2. Definir props realmente comunes: `kind`, `displayMode`, `label`, `icon`, `disabled`, `loading`, `type`, `ariaLabel` y evento. Tooltip y badge/tracking deben marcarse como capacidad opcional/plataforma específica o adapter separado.
3. Revisar defaults: ButtonWeb usa defaults españoles (`Agregar`, `Editar`, etc.); ButtonMobile duplica esos defaults. Decidir si defaults se traducen vía host o si catálogo recibe labels obligatorios.
4. Establecer tests contractuales que prueben botón accesible, submit/reset, loading/disabled, modo label/icon/both, eventos e interacciones equivalentes por plataforma.
5. Revisar inconsistencias confirmadas: bases declaran `displayMode="label"` pero clases concretas lo sobrescriben a `"both"`; vocabulario `size` y `variant` difiere; `emoji` está declarado pero no se consume; resolver iconos difiere; fallback accesible de custom icon-only puede ser “Continuar”.
6. `IlButtonGroup` sin consumers runtime verificados tiene `imports: []`, pero el template utiliza ButtonWeb; decidir owner/estado antes de incluirlo en API estable o quitarlo.

## 2. API de overlays — segunda familia crítica

| API adaptativa | Selector/clase | Consumo por import en módulos/core/shared no-UI | Estado observado en código |
|---|---|---:|---|
| Modal | `lux-modal` / `LxModal` | 7 | Base: `visible`, `header`, `closable`, `dismiss`. Adaptive selecciona MobileModal o Dialog con PlatformService. |
| Confirm dialog | `lux-confirm-dialog` / `LxConfirmDialog` | 3 | Base: visible/title/message/type/labels + outputs confirm/cancel; adapta web/Ionic. |
| Popover | `lux-popover` / `LxPopover` | Baseline: 3 imports adaptativos; Agente 2: 7 usos `<lux-popover>` + 4 usos web directos | Adapta web/mobile; delega `toggle/show/hide` al control interno vía `viewChild<any>`. |
| Processing overlay | `lux-processing-overlay` / `LxProcessingOverlay` | 1 | Base: processing/progress/message/submessage; adapta web/mobile. |
| Tooltip | directiva `[lxTooltip]` / `LxTooltipDirective` | Baseline: 85 imports productivos; Agente 2: 86 imports y 23 usos `[lxTooltip]` | Consumer count alto; no es elemento de overlay equivalente al resto. Delta 85/86 requiere normalizar scope de conteo. |
| Action sheet | `lux-action-sheet` / `LxActionSheet` | 0 por import alias medido | Existe en `adaptive/`; revisar usos por template/directiva y rutas antes de considerarlo sin consumidores. |

### Riesgos que requieren audit conductual

- `adaptive/modal`, `confirm-dialog`, `popover` y `processing-overlay` importan `PlatformService` desde `@core`; las abstracciones de plataforma dependen del host app.
- Agente 2 reporta que Web `Dialog`/`ConfirmDialog` carecen en source de `aria-modal`, vínculo a título, Escape, trap/restoration de foco y backdrop dismiss. Mobile `ili-confirm-dialog` no declara rol/gestión de foco. Riesgo alto; confirmar comportamiento real con teclado/axe.
- Mobile `MobileModal` delega a `ion-modal`; source/API de Ionic no sustituye prueba de integración real.
- Web Popover declara `focusOnShow` pero auditor reporta que no se aplica; panel sin rol y sin Escape. `LxPopover` mantiene handle/eventos `any`.
- Processing overlay web/mobile carece según source de `role=status`, `aria-live`, `aria-busy` y semántica `progressbar`/valor.
- Tooltip: Agente 2 detecta posible duplicado `[lxTooltip]` entre clase stub `LxTooltip` y `LxTooltipDirective`, y 0 consumers de `ili-tooltip`; reconciliar con exports/consumer map antes de deprecar.
- Action sheet `LxActionSheet` carece de API pública; Agente 2 encontró solo presencia en `ui-dictionary.ts`, no consumer runtime.

## 3. Acoplamientos de biblioteca encontrados

Censo estático de TypeScript productivo dentro de `shared/ui`:

| Dependencia de host | Líneas | Archivos | Ejemplos/categoría |
|---|---:|---:|---|
| `@core/services/platform.service` | 78 | 78 | Adaptadores platform-aware; reemplazable a futuro por token/adapter de UI si se decide extraer. |
| Otros imports `@core/*` | 55 | 34 | Servicios de auth/API/toast/dialog/date, DTOs, MenuItem y data de negocio. |
| `@shared/*` | 5 | 5 | Utilidad icon mapping; potencial candidato a mover a core UI. |
| `src/app/*` | 2 | 2 | Imports directos a paths de aplicación dentro de librería UI. |

Clasificación inicial:

- **Generalizables mediante contrato:** plataforma, toast/message, loader, dialog/confirm, procesamiento de imágenes, icon mapping.
- **Modelos compartidos a revisar:** `MenuItem`, `SelectItemDto`, `FechasFiltro`, `PhonePrefix`. Decidir entre tipos UI propios, genéricos o adapters; no mover DTOs de dominio sin dueño.
- **App-specific/posible extracción del catálogo reusable:** `AuthService`, `CustomerIdService`, `Endpoints`, `ApiResponseService`, `GlobalTableFilterService`, `FiltroCalendarService`, `PeriodMonthService`, `DebugConsoleService`, `AiChatService`. Revisar cada componente antes de incluirlo en API estable.

No borrar ni reemplazar estas dependencias automáticamente: algunas son capacidades válidas para esta app aunque no pertenezcan al núcleo portable del catálogo.

## 4. Propuesta de matriz completa para Gate 0

Para cada componente/directiva/pipe registrar:

`ruta | selector | clase | capa | plataforma | exports | consumers-import | consumers-template | inputs/outputs | dependencia-host | specs/story | a11y/i18n | maturity | decisión`.

Estados permitidos: `stable`, `experimental`, `deprecated`, `app-specific`, `internal`. Ningún estado se asigna solo por nombre o carpeta: requiere contrato y evidencia de consumers.

## 5. Recomendación para primer lote externo

### Lote 0, lectura y contrato — sin editar source

Un agente externo audita ButtonWeb/ButtonMobile, consumers representativos web/mobile, requisitos de UX, exports y pruebas. Entrega propuesta `lux-button` con props comunes/específicas, tabla de mapeo y riesgos; no implementa hasta aprobación.

### Lote 1, PoC acotado después de aprobar contrato

Implementar wrapper adaptativo en archivos dedicados, sin editar implementaciones actuales ni consumers masivos. Tests web/Ionic para modos de presentación y estados. Integrarlo en un consumer de prueba seleccionado.

### Lote 2, overlays accesibles en paralelo solo con paths independientes

Auditoría de teclado/foco sobre `lux-modal` y `lux-confirm-dialog`. Un implementador único por componente; no compartir base overlay mientras API/ownership no estén acordados.

Se eligen botones por máxima extensión actual (784 imports directos web/mobile combinados, con posible solapamiento) y overlays por criticidad a11y. No ejecutar ambos lotes de código en el mismo checkout ni compartir archivos; worktree separado por agente tras freeze del baseline.
