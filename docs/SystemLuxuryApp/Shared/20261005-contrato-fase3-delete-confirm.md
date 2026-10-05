# Contrato Fase 3 — `delete` / `confirm` / `send-email` / `active-desactive`

> **Origen:** prompt `prompts/agente1-build-y-contratos.md`.
> **Consumidor directo:** `prompts/agente4-fase3-masiva.md` (migración masiva de los 221 usos de alto riesgo).
> **PoC de referencia:** commit `d75a31630` (Angular `main`) — `operations.luxuryapp/properties`.
> **Fix de build:** commit `05fbc3fac` (Angular `main`).

---

## 1. Decisión de contrato

**El botón moderno NO confirma. La confirmación vive en el consumidor (`.ts`).**

- `<lux-button-web kind="delete">` y `<lux-button-mobile kind="delete">` son componentes
  de presentación: **solo emiten `(clicked)`**. No inyectan confirmación.
- Los legacy `iw/il/ii/ili-button-delete`, `-confirm`, `-send-email` **sí** confirmaban
  por dentro (inyectaban `ConfirmService` o `SwalService`) y exponían `(confirmed)`.
- Al migrar, ese `(confirmed)` desaparece: **la confirmación se traslada al consumidor**
  que ya maneja el evento.

### ¿Extender `ButtonWeb`? — **NO**

| Criterio | Consumidor + `ConfirmService` (elegido) | Extender `ButtonWeb` (rechazado) |
|---|---|---|
| Frontera `shared/ui` (`audit:ui`) | El botón sigue "tonto", sin efectos ocultos | Reintroduce acoplamiento del botón con UI de confirmación |
| Duplicación | Un solo punto de confirmación en el consumidor | Habría que replicar lógica en web y mobile |
| Testabilidad | El spec del consumidor mockea `ConfirmService` | El spec del botón tendría que simular Swal/Ionic |
| Patrón ya vigente | ~15 consumidores ya lo usan (collections, legal, operations, recruitment, HR) | Ninguno |

**Regla de oro:** el consumidor decide *si* confirma y *qué* mensaje muestra; el botón solo
dispara. Esto preserva la semántica exacta del legacy: **si el botón legacy no confirmaba,
el moderno tampoco debe confirmar.**

---

## 2. Mapeo legacy → moderno

| Legacy | Moderno | Evento legacy | Evento moderno | ¿Confirma? |
|---|---|---|---|---|
| `iw-button-delete` | `<lux-button-web kind="delete" displayMode="icon">` | `(confirmed)` | `(clicked)` | **Sí** → `ConfirmService` |
| `il-button-delete` | `<lux-button-web kind="delete">` | `(confirmed)` | `(clicked)` | **Sí** → `ConfirmService` |
| `ii-button-delete` | `<lux-button-mobile kind="delete" displayMode="icon">` | `(confirmed)` | `(clicked)` | **Sí** → `ConfirmService` |
| `ili-button-delete` | `<lux-button-mobile kind="delete">` | `(confirmed)` | `(clicked)` | **Sí** → `ConfirmService` |
| `iw-button-confirm` | `<lux-button-web kind="confirm" displayMode="icon">` | `(confirmed)` | `(clicked)` | **Sí** → `SwalService` |
| `il-button-confirm` | `<lux-button-web kind="confirm">` | `(confirmed)` | `(clicked)` | **Sí** → `SwalService` |
| `iw-button-send-email` | `<lux-button-web kind="send-email" displayMode="icon">` | `(confirmed)` | `(clicked)` | **Sí** → `SwalService` |
| `il-button-send-email` | `<lux-button-web kind="send-email">` | `(confirmed)` | `(clicked)` | **Sí** → `SwalService` |
| `ii/ili-button-active-desactive` | `<lux-button-* kind="active-desactive">` | `(stateChange)` | `(clicked)` | **NO** — ⚠️ ver §6 |

### Defaults a preservar (el legacy los aplicaba aunque el template no los pusiera)

| Kind | Atributos por defecto que hay que escribir explícitos |
|---|---|
| `delete` (web icon) | `displayMode="icon" severity="danger" variant="soft" size="sm" tooltip="Eliminar" ariaLabel="Eliminar"` |
| `delete` (web label) | `severity="danger" variant="soft"` |
| `delete` (mobile) | `color="danger"` |
| `confirm` | `severity="success" variant="soft"` |
| `send-email` | `severity="info" variant="soft"` |

- `kind` ya aporta **label** ("Eliminar"/"Confirmar"/"Enviar correo") e **icono**.
  No repetir `label="Eliminar"` salvo que el legacy usara un label distinto (ej. `label="Ver"`).
- Renombrar `lxTooltip` → `tooltip` y `[attr.aria-label]` → `[ariaLabel]`.
- Orden canónico de atributos: `kind` primero, `(clicked)` al final, uno por línea.
- **Migrar solo elementos con evento.** Saltar `(click)`, `[routerLink]` y botones sin evento.

---

## 3. Receta paso a paso (caso `delete` — el PoC)

Archivos del PoC (`operations.luxuryapp/properties`):

### 3.1 Template web (`desktop/*.html`)

```html
<!-- Antes -->
<iw-button-delete (confirmed)="delete.emit(item.id)" />

<!-- Después -->
<lux-button-web
  kind="delete"
  displayMode="icon"
  severity="danger"
  variant="soft"
  size="sm"
  tooltip="Eliminar"
  ariaLabel="Eliminar"
  (clicked)="delete.emit(item.id)"
/>
```

### 3.2 Template móvil (`mobile/*.html`)

```html
<!-- Antes -->
<ili-button-delete (confirmed)="delete.emit(item.id)" label="Eliminar" />

<!-- Después -->
<lux-button-mobile
  kind="delete"
  color="danger"
  (clicked)="delete.emit(item.id)"
/>
```

### 3.3 Import del componente (`desktop/*.ts` y `mobile/*.ts`)

- Quitar el import legacy (`WebButtonIconDelete` / `MobileButtonLabelDelete` / …).
- Quitar la clase del arreglo `imports: [...]`.
- `ButtonWeb` / `ButtonMobile` ya suelen estar importados por la migración de `edit`.

### 3.4 Confirmación en el consumidor (`.ts` del contenedor)

```ts
import { ConfirmService } from "@ui/buttons/shared/confirm.service";

export class PropiedadesList {
  confirmS = inject(ConfirmService);

  async onDelete(id: any) {
    const confirmed = await this.confirmS.confirm(
      "¿Está seguro de eliminar esta propiedad?",
    );
    if (!confirmed) return;               // cancelar ⇒ NO se ejecuta la acción
    await this.apiResponseS
      .onDelete(Endpoints.Properties.delete(id))
      .then((result: boolean) => {
        if (result)
          this.dataSignal.update((current) =>
            current.filter((item) => item.id !== id),
          );
      });
  }
}
```

`ConfirmService` (`@ui/buttons/shared/confirm.service`, `providedIn: "root"`) ya resuelve
plataforma: **Swal** en web, **AlertController** en móvil. **No** usar el
`ConfirmationService` de PrimeNG (retirado).

---

## 4. `confirm` y `send-email` (mismo shape, distinto mensaje)

El legacy `*-button-confirm` y `*-button-send-email` confirmaban con **`SwalService`**
(no `ConfirmService`), con textos "Aceptar"/"Cancelar". Para preservar el texto exacto,
el consumidor replica esa llamada:

```ts
import { SwalService } from "@core/services/swal.service";

export class MiComponente {
  confirmS = inject(SwalService);

  async onConfirm(item: X) {
    const ok = await this.confirmS.confirm({
      title: "Confirmación",
      text: "<swalText/confirmMessage del legacy>",
      icon: "warning",
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar",
      focusCancel: true,
    });
    if (!ok) return;
    // …acción original
  }
}
```

`SwalService.confirm(options): Promise<boolean>` es el mismo método que usaba el botón
legacy (`appsweb/angular/src/app/core/services/swal.service.ts`).

> `ConfirmService.confirm` usa el texto fijo "Si, eliminar", por eso **no** se reutiliza
> para `confirm`/`send-email` (sería un cambio de UX). Reservado para `delete`.

---

## 5. Prueba obligatoria (puerta de Fase 3)

Toda migración de `delete`/`confirm`/`send-email` **debe** incluir un spec que pruebe que
**cancelar no ejecuta la acción destructiva**. Patrón del PoC
(`propiedades-list.spec.ts`):

```ts
import { ConfirmService } from "@ui/buttons/shared/confirm.service";

let mockConfirmS: any;
// beforeEach:
mockConfirmS = { confirm: vi.fn().mockResolvedValue(true) };
providers: [{ provide: ConfirmService, useValue: mockConfirmS }, /* … */]

it("onDelete should not delete when confirmation is cancelled", async () => {
  mockConfirmS.confirm.mockResolvedValueOnce(false);
  component.dataSignal.set([{ id: "1", fullName: "Prop A" }]);

  await component.onDelete("1");

  expect(mockApiResponseS.onDelete).not.toHaveBeenCalled();
  expect(component.dataSignal().length).toBe(1);
});
```

Comando focalizado:

```powershell
npx vitest run --project unit <ruta-del-spec>.spec.ts
```

---

## 6. `active-desactive` — NO migrar mecánicamente (Fase 4)

El legacy expone estado y etiquetas dinámicas:

```ts
state = input<boolean>(true);
activasLabel = input<string>("Activos");
inactivasLabel = input<string>("Inactivos");
stateChange = output<boolean>();
```

`ButtonWeb/ButtonMobile kind="active-desactive"` **no modela** `state` ni `stateChange`
(solo un label fijo "Activar / desactivar"). Migrarlo cambiaría el binding y el texto.
**Mantener el legacy** hasta que exista un contrato state-aware (Fase 4). Mismo criterio
para `view-pdf` y acciones con `state`/payload propio.

---

## 7. Reglas estrictas para los agentes de migración

1. **Un agente por archivo.** Nunca editar un archivo que aparezca `M`/`??` en
   `git status` (trabajo concurrente). Verificar antes de cada lote.
2. **Solo archivos limpios.** Excluir código muerto/comentado (`@Component`/imports
   comentados) y helpers `*-moduls.ts` sin uso.
3. **Preservar semántica.** Si el legacy no confirmaba, el moderno tampoco.
4. **No tocar `shared/ui`** ni borrar las implementaciones legacy (aún tienen consumidores).
5. **Commit por módulo**, solo los archivos del lote (`git add <rutas explícitas>`);
   nunca incluir cambios ajenos ni gitlinks.
6. **Verificación por módulo:**
   ```powershell
   npm run audit:ui
   npx vitest run --project unit <specs afectados>
   npm run build            # Fase 6, global
   git diff --check -- <mis archivos>
   ```
   Si `audit:ui` o el build falla, revertir el lote y registrar la causa.
7. **No tocar `.html` con Prettier** (reformatea líneas ajenas). Formatear a mano/script.
8. `strictTemplates` está en `false` (ver `tsconfig.json`): el compilador **no** valida
   plantillas, así que un binding roto no rompe el build. **La verificación real es
   `audit:ui` + specs + QA de flujo.**

---

## 8. Inventario y verificación

```powershell
# Conteo de selectores legacy de Fase 3
git grep -c -E "<(iw|il|ii|ili)-button-(delete|confirm|send-email|active-desactive)" -- "src/app"

# Detalle por archivo
git grep -n -E "<(iw|il|ii|ili)-button-(delete|confirm|send-email|active-desactive)" -- "src/app"

# Usos ya migrados
git grep -n 'kind="delete"' -- "src/app"
```

---

## 9. Referencias

- PoC: `appsweb/angular/src/app/modules/operations.luxuryapp/properties/`
  - `propiedades-list.ts`, `propiedades-list.spec.ts`
  - `desktop/propiedades-list-desktop.{html,ts}`, `mobile/propiedades-list-mobile.{html,ts}`
- Contrato compartido: `appsweb/angular/src/app/shared/ui/buttons/shared/confirm.service.ts`
- Componentes modernos: `@ui/buttons/web` (`ButtonWeb`), `@ui/buttons/mobile` (`ButtonMobile`).
- Reglas de plataforma (web/mobile, icono/label): `docs/AngularLuxuryApp/SharedUi/BUTTON-USAGE-RULES.md`.
- Estado de fases: `docs/SystemLuxuryApp/Shared/20261005-catalogo-shared-ui-refactor.md` (§Fase 3).
