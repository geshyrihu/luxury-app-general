# Prompt 1b — Fase 6: corregir paginador de `app-table` + diagnosticar el cambio de header/padding

Continúa el trabajo de `prompt-fase6-piloto-1-app-table.md`, ya
ejecutado (`shared/ui/web/table/table.ts` y las 2 hojas SCSS ya
existen). Auditando el diff contra las capturas reales
(`fase6-piloto-1-bank-before.png`/`-after.png`) se encontraron 2 cosas
antes de aprobar este paso: una es un hueco real que hay que corregir
(§1), la otra es un diagnóstico que hay que hacer antes de decidir nada
(§2) — no toques el color del header todavía, solo mide.

## 1. Corregir: falta el selector de registros por página y los botones de primera/última página

El paginador actual de PrimeNG (ver captura "before") tiene, en este
orden: `«` (primera página) `‹` (anterior) `1 2 3 4` `›` (siguiente)
`»` (última página) `[30 ▾]` (dropdown de registros por página). El
paginador que construiste en `AppTable` solo tiene `‹ 1 2 3 4 ›` — el
input `rowsPerPageOptions` se recibe pero nunca se usa en la plantilla.
Esto rompe la paridad funcional que pedía el criterio de aceptación
original.

**Cambio en `table.ts`:**

1. `rows` es un `input()`, de solo lectura — no se puede reasignar
   directo cuando el usuario cambia el dropdown. Agrega un signal
   privado de override:
   ```ts
   private rowsOverride = signal<number | null>(null);
   protected effectiveRows = computed(() => this.rowsOverride() ?? this.rows());
   ```
2. Reemplaza **todos** los usos internos de `this.rows()` (en
   `pagedValue`, `pageCount`, `pageReport`, `goToPage`) por
   `this.effectiveRows()`. `goToPage` sigue igual salvo ese cambio.
3. Nuevo método público:
   ```ts
   public changeRows(newRows: number): void {
     this.rowsOverride.set(newRows);
     this.currentPageIndex.set(0);
     this.onPage.emit({ first: 0, rows: newRows });
   }
   ```
   (Esto reproduce el comportamiento real de PrimeNG: cuando cambia el
   tamaño de página, `(onPage)` se dispara con el `rows` nuevo — así
   los consumidores lazy como `log-api-report.ts` (`onPageChange` hace
   `this.rows.set(event.rows)`) siguen funcionando sin tocarlos.)
4. En la plantilla, agrega antes del botón `‹` uno para primera página
   y después del botón `›` uno para última página, misma clase
   `.app-table-paginator-element`:
   ```html
   <button type="button" class="app-table-paginator-element"
           [disabled]="currentPageIndex() === 0"
           (click)="goToPage(0)">«</button>
   <!-- ...botón ‹ ya existe... -->
   <!-- ...números ya existen... -->
   <!-- ...botón › ya existe... -->
   <button type="button" class="app-table-paginator-element"
           [disabled]="currentPageIndex() >= pageCount() - 1"
           (click)="goToPage(pageCount() - 1)">»</button>
   ```
5. Después de los botones, agrega el `<select>` de registros por
   página (nueva clase `app-table-rows-select`, sin estilo especial
   todavía — usa `.form-select` de Bootstrap si quieres algo presentable,
   no es un punto crítico):
   ```html
   <select
     class="app-table-rows-select form-select form-select-sm"
     style="width: auto;"
     [value]="effectiveRows()"
     (change)="changeRows(+$any($event.target).value)"
   >
     @for (opt of rowsPerPageOptions(); track opt) {
       <option [value]="opt">{{ opt }}</option>
     }
   </select>
   ```

No hace falta replicar el estilo visual exacto del dropdown de PrimeNG,
solo que la función exista y sea usable — el afinado visual se hace
cuando se apruebe el aspecto general (§2).

## 2. Diagnosticar (NO corregir todavía) el cambio de header/padding

Comparando las capturas: el header pasó de blanco/plano a azul marino
en mayúsculas, y las filas se ven visiblemente más altas (más padding).
Hipótesis a confirmar, no a asumir: `_custom-table.scss`/
`_prime-table.scss` siempre pidieron `background-color: var(--ds-primary)`
y un padding de celda mayor, pero el preset activo de PrimeNG
(`src/app/mypreset.ts:211-216`, bloque `datatable.header.background:
"{primary.500}"`) compite por las mismas propiedades — puede que su CSS
se inyecte en runtime después del bundle compilado y gane por orden de
aparición a igual especificidad, o puede haber `@layer` de por medio.
No lo canitidamos — se mide, igual que se midió el hallazgo de Fase 1
(regresión de `font-size` de `.btn`, 14px→16px, con `getComputedStyle`
real, no con una captura).

**Qué hacer:**

1. Con la app en su estado ANTES de este prompt (revertir
   temporalmente `bank-list-desktop.html` a `<p-table>`, o usar
   cualquier otra pantalla real que siga en PrimeNG sin tocar), abrir
   DevTools → pestaña Elements → seleccionar un `<th>` del encabezado
   → panel "Computed" con la casilla "Show all" activada. Anota:
   - `background-color` computado.
   - `padding` computado.
   - `text-transform` computado.
   - Para cada una, **qué regla CSS específica ganó** (DevTools lista
     las reglas que compiten y tacha las que perdieron — copia el
     selector y el archivo/línea de la que "ganó", no solo el valor
     final).
2. Repetir exactamente lo mismo sobre `bank-list-desktop.html` ya
   apuntando a `<app-table>` (el mismo cambio temporal que hiciste para
   las capturas del Prompt 1).
3. Reportar las 2 tablas de "qué regla ganó, antes vs. después" tal
   cual las muestra DevTools — no resumas ni interpretes, copia lo que
   dice la herramienta.

**No cambies ningún SCSS en este paso.** Solo mide y reporta. La
decisión de qué aspecto final se queda (¿el azul marino es correcto y
estaba dormido por este choque de CSS, o hay que neutralizarlo?) se
toma con esa evidencia, no antes.

## 3. Verificación y entrega

- `npx tsc --noEmit` limpio.
- Capturas nuevas (reales, de `ng serve`) del paginador de
  `bank-list-desktop` con `app-table`, mostrando `«`/`»` y el dropdown
  de registros funcionando (cambiar de página y de tamaño de página al
  menos una vez cada uno, confirmar que la tabla responde).
- Las 2 tablas de "regla ganadora" del §2, con selector + archivo/línea
  exactos como los muestra DevTools, antes y después.
- Recuerda restaurar `bank-list-desktop.html`/`.ts` a su estado
  original si los tocaste para probar — no debe quedar en el diff
  final, igual que en el Prompt 1.
- `git diff --stat` del estado final.
