# Prompt para Agente externo 1 (Fase 2c) — crear bridge mobile del visor de PDF y cerrar los 2 residuales de Operations

Eres implementador Angular/Ionic. Falta el equivalente **mobile** de `lux-pdf-viewer-trigger` (ese componente es `web/` únicamente, usa `ButtonWeb`). Investigación previa confirmó que **no hace falta inventar lógica de visor nueva**: `DialogHandlerService.openDialog()` (`src/app/core/services/dialog-handler.service.ts`) ya es adaptativo por plataforma — en mobile abre `PdfViewerModal` dentro de un `ion-modal` nativo vía `ModalController` (método `openMobileModal`), exactamente el mismo mecanismo que ya usan los formularios mobile del resto de la app. Lo único que falta es un botón trigger con estilo `ButtonMobile`/Ionic que llame esa misma apertura.

## Scope exclusivo (archivo nuevo + 2 consumidores)

- **Crear:** `src/app/shared/ui/mobile/pdf-viewer-trigger-mobile/pdf-viewer-trigger-mobile.ts` (archivo transversal de `shared/ui`, un solo owner: tú, en este lote).
- `src/app/modules/operations.luxuryapp/custom-documents/custom-document/policy-contract/mobile/policy-contract-list-mobile.html` (línea ~39, un botón)
- `src/app/modules/operations.luxuryapp/reports/contracts-policies/mobile/contracts-policies-mobile.html` (línea ~15, un botón)
- Los `.ts` hermanos de esos 2 templates, únicamente para el import/registro del nuevo componente.

No toques ningún otro archivo de `shared/ui` ni ningún otro botón de esos 2 templates.

## Diseño del componente nuevo

Mirror casi 1:1 de `src/app/shared/ui/web/pdf-viewer-trigger/pdf-viewer-trigger.ts`, pero usando `ButtonMobile` (`@ui/buttons/mobile`) en vez de `ButtonWeb`, con los inputs reales de `ButtonMobile`/`MobileButtonBase`/`BaseIonicButton` (`variant`, `color`, `fill`, `expand`, `size`, `styleClass`, `label`, `title`, `disabled`, `loading`, `ariaLabel`, `displayMode`, `iconClass`). No copies inputs del botón web que no existan en el mobile (ej. `severity` no existe en `ButtonMobile`, usa `color`/`variant`).

```ts
import { ChangeDetectionStrategy, Component, computed, inject, input, output } from "@angular/core";
import { DialogHandlerService } from "@core/services/dialog-handler.service";
import { ButtonMobile } from "@ui/buttons/mobile";
import type { ButtonDisplayMode } from "@ui/buttons/base/base-button";

@Component({
  selector: "lux-pdf-viewer-trigger-mobile",
  imports: [ButtonMobile],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <lux-button-mobile
      kind="view-pdf"
      [displayMode]="displayMode()"
      [label]="resolvedLabel()"
      [iconClass]="iconClass()"
      [variant]="variant()"
      [color]="color()"
      [fill]="fill()"
      [size]="size()"
      [styleClass]="styleClass()"
      [ariaLabel]="ariaLabel()"
      [disabled]="disabled()"
      [loading]="loading()"
      (clicked)="open($event)"
    />
  `,
})
export class PdfViewerTriggerMobile {
  url = input<string>("");
  fileName = input<string>("");
  label = input<string>("");
  iconClass = input<string>("");
  displayMode = input<ButtonDisplayMode>("both");
  variant = input<string>("");
  color = input<string>("primary");
  fill = input<"clear" | "outline" | "solid" | "default">("solid");
  size = input<"small" | "default" | "large">("default");
  styleClass = input<string>("");
  ariaLabel = input<string>("");
  disabled = input<boolean>(false);
  loading = input<boolean>(false);
  clicked = output<Event>();

  protected readonly resolvedLabel = computed(
    () => this.label() || (this.displayMode() === "icon" ? "" : "Ver archivo"),
  );

  private readonly dialogHandlerS = inject(DialogHandlerService);

  protected open(event: Event): void {
    const url = this.url();
    if (!url) {
      this.clicked.emit(event);
      return;
    }
    void this.openViewer(url);
  }

  private async openViewer(url: string): Promise<void> {
    const { PdfViewerModal } = await import("@ui/web/pdf-viewer-modal/pdf-viewer-modal");
    void this.dialogHandlerS.openDialog(
      PdfViewerModal,
      { pdfSrc: url, fileName: this.fileName() },
      this.fileName() || "Documento",
      this.dialogHandlerS.sizeFull,
      true,
    );
  }
}
```

**No copies este bloque a ciegas.** Antes de aplicarlo:
- Verifica que `@ui/buttons/mobile` exporte `ButtonMobile` con ese path real (revisa el barrel `src/app/shared/ui/buttons/mobile/index.ts` o equivalente).
- Verifica que `this.dialogHandlerS.sizeFull` y la firma de `openDialog(component, data, title, size, autoMaximize)` sigan siendo exactamente así en `dialog-handler.service.ts` (por si cambió desde esta investigación).
- Verifica que `PdfViewerModal` siga aceptando `{ pdfSrc, fileName }` como `data` (revisa `pdf-viewer-modal.ts`, método `ngOnInit`).
- Confirma que `resolveIconifyIcon`/`AppIcon` no necesiten nada adicional para el icono de `kind="view-pdf"` en mobile (ya existe en `DEFAULTS` de `ButtonMobile`, no deberías necesitar `icon`/`iconClass` explícito salvo que quieras otro).

## Trabajo en los 2 consumidores

- `policy-contract-list-mobile.html:39`: reemplaza `<lux-button-mobile-view-pdf [url]="item.pathDocument" fileName="Poliza | Contrato" label="Ver PDF" />` por `<lux-pdf-viewer-trigger-mobile [url]="item.pathDocument" fileName="Poliza | Contrato" label="Ver PDF" />`.
- `contracts-policies-mobile.html:15`: reemplaza `<lux-button-mobile-view-pdf [url]="item.path" fileName="Poliza | Contrato" />` por `<lux-pdf-viewer-trigger-mobile [url]="item.path" fileName="Poliza | Contrato" />`.
- Agrega el import de `PdfViewerTriggerMobile` a los `imports` de cada `.ts`. Si `ButtonMobile` quedaba importado solo por ese botón y ya no se usa en el archivo, quítalo (evita NG8113).

## Verificación

- `ng build`: cero NG8001/NG8002/NG1010 en estos archivos.
- `npm run audit:ui`: verde (confirma que el nuevo componente respeta la frontera `mobile/` → no debe importar nada de `web/` salvo el lazy `import()` a `PdfViewerModal`, que es el mismo patrón ya aprobado en la versión web).
- Prueba manual si tienes cómo: abrir el visor desde un botón mobile y confirmar que el modal se presenta como `ion-modal` nativo, no como diálogo Bootstrap.
- `git diff --check` limpio.

Worktree aislado desde el `main` local actual (post Fase 2 + 2b), solo los paths listados arriba, sin staging global.

## Reporte de ejecución

Cuando termines, **escribe tu reporte aquí mismo, al final de este archivo**, debajo de este encabezado (no lo borres, agrégalo). Incluye: commit/branch/worktree usado, el archivo nuevo completo o su diff, antes/después de los 2 consumidores, qué verificaste de los puntos "no copies a ciegas" antes de aplicar, resultado de `ng build` y `npm run audit:ui`, y cualquier ajuste que tuviste que hacer al diseño propuesto (por ejemplo si `ButtonMobile` no se importa como se asumió aquí).

## Reporte de ejecución

- **Commit:** `dc32b24eb feat(operations): agrega bridge mobile para PDF`
- **Branch:** `fix/operations-pdf-viewer-mobile`
- **Base:** `main` local `44196fd83`
- **Worktree:** `C:\Users\GESHYR~1\AppData\Local\Temp\opencode\wt-pdf-viewer-mobile`
- **Archivos:** bridge nuevo + 2 templates + 2 `.ts` consumidores.

### Verificaciones previas

- `@ui/buttons/mobile` exporta `ButtonMobile` desde `mobile/index.ts`.
- `ButtonMobile`/`MobileButtonBase` soportan `variant`, `color`, `fill`, `expand`, `size`, `styleClass`, `label`, `disabled`, `loading`, `ariaLabel`, `displayMode` e `iconClass`.
- `DialogHandlerService.openDialog(component, data, title, size, autoMaximize)` conserva firma; en mobile delega a `openMobileModal()` con `ion-modal` nativo.
- `sizeFull` existe y se usó sin cambios.
- `PdfViewerModal` consume `{ pdfSrc, fileName }` en `ngOnInit()`.
- `ButtonMobile` mantiene `kind="view-pdf"` con icono PDF por defecto.

### Diff funcional

- Nuevo `shared/ui/mobile/pdf-viewer-trigger-mobile/pdf-viewer-trigger-mobile.ts`: mirror mobile del bridge web; renderiza `ButtonMobile kind="view-pdf"`, conserva `url`, `fileName`, label/display mode, API visual mobile y abre `PdfViewerModal` mediante `DialogHandlerService`. URL vacía emite `clicked`.
- `policy-contract-list-mobile.html:39`: `<lux-button-mobile-view-pdf ...>` → `<lux-pdf-viewer-trigger-mobile [url]="item.pathDocument" fileName="Poliza | Contrato" label="Ver PDF" />`.
- `policy-contract-list-mobile.ts`: registra `PdfViewerTriggerMobile`; conserva `ButtonMobile` porque sigue usado por editar/eliminar.
- `contracts-policies-mobile.html:15`: `<lux-button-mobile-view-pdf ...>` → `<lux-pdf-viewer-trigger-mobile [url]="item.path" fileName="Poliza | Contrato" />`.
- `contracts-policies-mobile.ts`: registra `PdfViewerTriggerMobile`; no necesitó `ButtonMobile`.

### Verificación

- `ng build` (ejecutado mediante `npm run build`): **exit 0**, `Application bundle generation complete`.
- `npm run audit:ui`: **verde**.
- `git diff --check`: **limpio**.
- Residuales globales `lux-button-mobile-view-pdf` bajo `src`: **0**.
- Ajustes al diseño propuesto: ninguno funcional; se usó import dinámico permitido hacia `@ui/web/pdf-viewer-modal` para reutilizar modal existente. No se editó otro archivo de `shared/ui`.
