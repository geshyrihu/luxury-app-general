# Frontend Rules

**Ultima revision:** 2026-07-30

## Alcance

Aplica a Angular, feature structure, API access, state management, UI, mobile,
testing, performance y design system.

## Reglas obligatorias

- Ningun shared frontend se modifica sin analisis de impacto y aprobacion.
- Aunque exista una via rapida, se prohibe si rompe el estandar.
- Toda feature consume primero desde `appsweb/angular/src/app/shared/ui`.
- En features Angular, `p-table` y su ecosistema directo necesario para armar
  la tabla son la unica excepcion vigente de uso directo de PrimeNG.
- Fuera de esa excepcion, la feature debe consumir wrappers, catalogo UI o
  componentes oficiales de `shared/ui`.
- UI y styles forman parte obligatoria de la auditoria.
- Si una alineacion grande afecta legacy, primero va plan de migracion.
- Todo formulario editable debe soportar correctamente el flujo real de
  `onLoadData -> patchValue -> render en controles UI`.
- No se permite asumir que el response de edicion siempre viene en un shape
  ideal; el formulario debe tolerar `null`, valores envueltos y shape real del
  contrato aprobado.
- Si el formulario usa autocomplete, select o wrappers `@ui/*`, la carga de
  edicion debe resolver el valor visible del control y no solo el ID interno.
- En `custom-input-select-signal` y wrappers equivalentes se debe respetar el
  shape real del control segun `optionValue`:
  si el wrapper trabaja con valor primitivo, el `FormControl` no debe guardar
  el objeto `SelectItemDto` completo.
- En `custom-input-autocomplete-signal` y wrappers equivalentes no se permite
  mezclar `ngModel` manual con `FormControl` externo para flujos de edicion;
  el binding debe ser reactivo y consistente para que `patchValue` renderice el
  seleccionado visible.
- Si el control visual necesita `label` para mostrar el valor editado, el
  modulo debe garantizar una fuente valida de display name:
  catalogo vigente, response de edicion o fallback controlado desde el flujo
  que abre el formulario.
- En modulos con wizard o multi-step, el estado obligatorio no puede quedar
  implicito o repartido sin contrato claro entre `FormGroup`, `signals`,
  servicios y controles auxiliares.
- Si un campo critico para submit vive fuera del `FormGroup`, su validacion y
  sincronizacion deben ser explicitas y auditables.
- Si una feature puede abrirse tanto por ruta como por modal y comparte estado
  mediante servicio, se debe definir y respetar una precedencia clara de fuente
  de verdad.
- Drift de contrato frontend como `posicionComite` vs `ePosicionComite` se
  considera incumplimiento auditable.
- No se permite `any` productivo en estado principal, responses, signals,
  listados, mapeos, payloads o helpers de una feature cuando el modulo requiere
  contrato tipado o ya tiene DTO/interface disponible.
- La auditoria frontend debe revisar tambien estilos locales del feature en
  componentes standalone o de clase, incluyendo `styles: []`, `styleUrl` y
  overrides con `::ng-deep`, no solo la capa global `src/styles`.
- Cuando se use `p-table` directo en desktop/web, debe respetarse el patron
  oficial vigente del proyecto para caption, empty state, footer, acciones y
  estilos de tabla.
- En `MenuItem[]` consumidos por PrimeNG desde standalone components o shells de
  feature, no se permite usar `routerLink` dentro del objeto.
- En esos casos, la navegacion debe vivir en `command` +
  `Router.navigate()`/`navigateByUrl()` desde el componente owner.
- Motivo: PrimeNG puede instanciar `RouterLink` en un contexto interno sin
  `ActivatedRoute` y disparar `NG0201` solo en runtime.

## Referencias

- [Frontend Feature Structure](../frontend//frontend-feature-structure.md)
- [Frontend API Endpoints](../frontend//frontend-api-endpoints.md)
- [Frontend Prohibitions](../frontend//frontend-prohibitions.md)
- [Frontend Generic Services Catalog](../frontend//frontend-generic-services-catalog.md)
- [UI Desktop Rules](../ui//ui-desktop-rules.md)
- [UI Mobile Rules](../ui//ui-mobile-rules.md)
- [Styles Rules](../styles//styles-rules.md)


