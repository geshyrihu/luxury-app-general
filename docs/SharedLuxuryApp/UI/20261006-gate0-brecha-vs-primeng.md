# ¿Qué tan completo está `lux-*` frente a PrimeNG?

**Fecha:** 2026-10-06
**Objetivo original del proyecto (recordatorio):** catálogo propio `lux-*`, completo, reutilizable en LuxuryApp y en otros proyectos, calidad de clase mundial, comparable a PrimeNG — no la gobernanza de ownership que se estaba armando antes de este documento.

## Resultado corto

**No falta cobertura. Falta consolidación y catálogo visible.** Comparando los 319 componentes/directivas inventariados contra el catálogo de PrimeNG, casi todo lo que PrimeNG ofrece ya existe en `lux-*` — y en varias áreas (charts, widgets de dashboard tipo CRM/ERP) `lux-*` ya tiene más que PrimeNG, porque son componentes de negocio hechos a medida que PrimeNG nunca tendría.

## Lo que sí está cubierto (equivalentes confirmados en el inventario)

Accordion, AutoComplete, Avatar, Badge, Breadcrumb, Button (web+mobile), Calendar/DatePicker, Card, Carousel, CascadeSelect, Checkbox, Chip, ColorPicker, ConfirmDialog, ConfirmPopup, ContextMenu, DataView, Dialog, Divider, Dock, Dropdown/Select, Editor, FileUpload, Fieldset, Gallery, Image, InputMask, InputNumber, InputSwitch, Listbox, Menu, Menubar, Message, MultiSelect, Paginator, Panel, ProgressBar, ProgressSpinner, Rating, ScrollTop, Skeleton, SplitButton, Stepper/Steps, TabView, Table/DataTable, Tag, Timeline, Toast, Toolbar, Tooltip, Tree, TriStateCheckbox (`AppTristateSwitch`).

**Además, fuera del catálogo de PrimeNG:** suite de charts (`AdvancedPieChart`, `FunnelChart`, `Gauge`, `MultiAxisChart`, `RadarChart`, `CustomBarChart`...) y widgets de negocio (`ApprovalWorkflow`, `LeadScoring`, `KpiCard`, `Customer360`, `Gantt`, `Heatmap`, `TerritoryMap`, `ActivityLog`, `PivotTable`, `ComparisonTable`) que PrimeNG no ofrece de fábrica.

## Lo que falta de verdad (brecha real, ~13 widgets)

Slider, Knob, OrderList, PickList, Splitter, ScrollPanel, VirtualScroller, TreeSelect, TreeTable, PanelMenu, MegaMenu, SpeedDial, Terminal.

Por regla del roadmap (Fase 7, §3): **no se construye ninguno de estos sin un caso de uso real**. Ninguno es bloqueante hoy — si un módulo de negocio los necesita, ahí se decide y se construye con dueño y contrato, no antes.

## El problema real no es cobertura, es fragmentación

El mismo concepto existe repetido 4-6 veces sin una sola API adaptativa que lo unifique. Ejemplos del propio inventario:

- **Checkbox:** `AppCheckbox`, `LxCheckbox`, `IliCheckbox`, `InputCheck`, `WebInputCheck`, `IonInputCheckbox` — 6 variantes.
- **Date input:** `InputDate`, `WebInputDate`, `IonInputDate`, `CustomInputDatepicker`, `WebInputDatepicker`/`IonInputDatepicker`, `InputDateTime`/`CustomInputDateTimeSignal`/`CustomInputDateTimeNative` — fácil 7-8 variantes.
- **Botón:** ya diagnosticado en el roadmap (§7.5): `ButtonWeb`/`ButtonMobile` sin wrapper `lux-button` adaptativo, 784 imports directos combinados.

Solo 55 de 319 (17%) viven en la capa `adaptive/` (la API unificada real). El resto son implementaciones `web`/`mobile`/`inputs` sueltas que un consumidor tiene que elegir a mano — razón por la cual sigue siendo fácil crear un duplicado nuevo en vez de encontrar el que ya existe.

## El otro problema real: nadie puede ver el catálogo

Storybook tiene **1 story para 319 componentes**. El showcase vivo (`/admin/ui-catalog`) demuestra una parte, pero no es el catálogo navegable tipo primeng.org que un developer (o un agente) consultaría antes de construir algo nuevo. Si no se puede *ver* qué ya existe, se sigue duplicando — es probablemente la causa raíz de la fragmentación de arriba, no solo una consecuencia.

## Recomendación concreta (no gobernanza, trabajo real)

1. **No construir los 13 faltantes todavía** — no hay caso de uso real pendiente, sería trabajo especulativo prohibido por el roadmap.
2. **Elegir 1-2 familias de máxima duplicación (checkbox, date input, o el botón ya diagnosticado) y decidir la API adaptativa única**, migrar consumidores por lote. Esto reduce 319 hacia un número mucho menor de componentes *reales*.
3. **Completar el catálogo navegable (Storybook o el showcase Admin existente) para los componentes `adaptive/` ya estables**, para que "qué ya existe" se pueda ver sin leer código — esto es lo que de verdad te acerca a sentirse "nivel PrimeNG".

Esto reemplaza la pista de "ownership por componente" que se estaba siguiendo antes: no es necesaria para avanzar hacia el objetivo real.
