# Prompt 3 — Fase 6: construir el codemod y probarlo en seco sobre un lote chico

El lote piloto manual (4 pantallas) ya cerró y validó el diseño de
`app-table`. El usuario decidió abordar las 337 plantillas restantes
con **script asistido + lotes chicos auditados**, no archivo por
archivo a mano ni todo de golpe. Este prompt es solo la primera mitad:
construir el script y probarlo **en seco** (sin escribir ningún
archivo) sobre un lote pequeño. La ejecución real, y el resto de los
lotes, son prompts aparte una vez que audite el resultado de este.

**Regla dura de esta sesión, no negociable:** ya hubo un incidente
grave con un script de reemplazo automático que corrompió ~350
archivos. Este script se prueba en seco primero, se revisa el reporte
completo, y **recién con aprobación explícita se corre de verdad** —
nunca se asume que "compiló limpio" es suficiente.

## 1. Alcance exacto (verificado por Claude antes de este prompt, no asumido)

Sobre `appsweb/angular/src/app/modules/**` (`.html` y `.ts`):

- **328 archivos** usan el patrón estándar (`<p-table>` +
  `<ng-template #caption/#header/#body/#emptymessage/#paginatorleft>` +
  `pSortableColumn`/`[pSortableColumn]` + `<p-sorticon field=".../>`
  o `[field]="..."`) — **estos son los que el script transforma**.
- **9 archivos** usan la sintaxis alternativa `pTemplate="nombre"` en
  vez de `#nombre` (`ng-template pTemplate="header"`, etc.) — **el
  script NO debe tocarlos**. `app-table` no sabe leer `pTemplate=`
  todavía (lee `#header`/`#body`/etc. vía `contentChild`), y uno de
  los 9 usa además `pTemplate="footer"`, un nombre de slot que
  `AppTable` ni siquiera tiene implementado hoy. Migrarlos requiere
  diseño adicional — se aborda en un prompt separado, después del
  rollout del grupo estándar. Lista completa de los 9:
  ```
  admin.luxuryapp/herramientas-dev/catalog-component-ui/foundations/catalog-guia-item/button-catalog/button-catalog.ts
  collections.luxuryapp/aspel-cobranza-haus/aspel-cobranza-reglas-negocio/aspel-cobranza-reglas-negocio.html
  maintenance.luxuryapp/reports-mantenance/report-consumos/report-consumos.html
  management.luxuryapp/juntas-comite/junta-comite-minutas/resumen-minuta.html
  management.luxuryapp/juntas-comite/juntas-mensuales-session/juntas-mensuales-session.html
  operations.luxuryapp/reports/report-meeting/report-meeting.html
  purchases.luxuryapp/solicitudes-compras/comparativo/cuadro-comparativo-list.html
  recruitment.luxuryapp/expediente-del-empleado/employees/contract-renewal-list.ts
  system.luxuryapp/configuracion-sistema/juntas-mensuales-backfill/juntas-mensuales-backfill.html
  ```
- **1 archivo** (`purchases.luxuryapp/solicitudes-compras/detalle/product-modal-add.html`)
  tiene un `<p-sorticon />` suelto, sin `field` y sin `pSortableColumn`
  en el `<th>` que lo contiene (columna "Cantidad", línea ~48) — es
  `AppSorticon.field` es un input obligatorio, así que copiarlo tal
  cual rompería la compilación. **El script debe excluir este archivo
  del lote automático** — se migra aparte, a mano, borrando ese
  `<p-sorticon />` suelto (no inventarle un `field`).

## 2. El script

Créalo en `scripts/migrate-p-table-standard.mjs` (Node, sin
dependencias nuevas). Debe:

1. Recibir una lista de archivos por argumento (no operar sobre todo
   el repo de una sola corrida — los lotes los decide cada prompt).
2. Para cada archivo, **antes de tocar nada**, verificar que NO
   contenga `pTemplate=` — si lo contiene, saltarlo y reportarlo como
   "excluido: usa pTemplate".
3. Aplicar, en este orden, solo sobre archivos que sí califican:
   - `<p-table` → `<app-table`, `</p-table>` → `</app-table>`
     (case-sensitive, con límite de palabra para no tocar
     `<p-table-xyz` si existiera algo así — no debería, pero verifícalo).
   - `pSortableColumn="` → `appSortableColumn="` y
     `[pSortableColumn]="` → `[appSortableColumn]="`.
   - `<p-sorticon field="` → `<app-sorticon field="` y
     `<p-sorticon [field]="` → `<app-sorticon [field]="`
     (ambas formas autocerradas, `/>` al final — no hay ninguna forma
     con cierre separado `</p-sorticon>` en todo el repo, ya
     verificado, no hace falta cubrirla).
   - `<p-sorticon />` (sin `field`) → **no tocar, y si aparece en un
     archivo que no sea el excluido del punto 1.3 de arriba, ABORTAR
     ese archivo completo y reportarlo** — significa que el barrido
     previo de Claude no lo detectó, mejor pararse ahí que adivinar.
   - `<ng-template caption>`/`header>`/`body`/`emptymessage>`/`paginatorleft>`
     (exactamente esos 5 nombres, **sin** `#` delante) → agregar el
     `#` (`<ng-template #caption>`, etc.) — mismo bug ya corregido en
     `generic-approval-panel.ts`. Ojo: `<ng-template #body let-item>`
     ya tiene `#`, no tocar esos.
   - En el `.ts` correspondiente (mismo nombre base, o el mismo
     archivo si el template es inline): reemplazar la línea
     por
     `import { AppTable, AppSortableColumn, AppSorticon } from "@ui/web/table/table";`,
     y dentro del array `imports: [...]` del `@Component`, reemplazar
     el token `TableModule` por `AppTable,\n    AppSortableColumn,\n    AppSorticon,`
     (mantén el estilo de indentación que ya tenga el archivo, no
     inventes uno nuevo).
4. **Modo `--dry-run` (default, obligatorio la primera vez):** no
   escribe ningún archivo. Para cada archivo procesado, imprime un
   diff unificado (formato `diff -u` o equivalente) de los cambios que
   HARÍA. Junta todo en un reporte
   `docs/migration-template/dry-run-lote-piloto-script.md` con:
   - Lista de archivos transformados (con su diff).
   - Lista de archivos excluidos y por qué (pTemplate, sorticon suelto,
     o cualquier otra razón que el script detecte).
   - Cualquier archivo donde el patrón no calzó como se esperaba
     (p. ej. no encontró `</p-table>` después de encontrar `<p-table`,
     o encontró más de una ocurrencia y no está seguro de cómo
     tratarlas — como el caso ya resuelto a mano de `audit-entries.html`
     con tabla anidada, que **no** forma parte de este lote automático
     porque ya se migró en el piloto manual).
5. Solo con `--write` explícito el script escribe de verdad — y en
   esta ronda **no lo uses todavía**, solo `--dry-run`.

## 3. Corrida de prueba (solo estos 9 archivos, solo `--dry-run`)

```
src/app/modules/auth.luxuryapp/password-manager/password-list.html
src/app/modules/committee.luxuryapp/cobranza/committee-cobranza-web.html
src/app/modules/resident.luxuryapp/owner/owner-list.html
src/app/modules/resident.luxuryapp/property/property-occupant-manager.html
src/app/modules/resident.luxuryapp/property/propiedades-list.html
src/app/modules/system.luxuryapp/configuracion-sistema/database-backup/database-backup-list.html
src/app/modules/system.luxuryapp/configuracion-sistema/juntas-mensuales-backfill/juntas-mensuales-backfill.html
src/app/modules/system.luxuryapp/configuracion-sistema/knowledge-base/ai-knowledge-base-list.html
src/app/modules/system.luxuryapp/configuracion-sistema/vault-secrets/vault-secrets-list.html
```

De estos, **1 debe salir excluido** (`juntas-mensuales-backfill.html`,
usa `pTemplate=`) — si el script lo transforma igual, hay un bug en la
detección del punto 2.2, corrígelo antes de entregar. Los otros 8
deberían transformarse limpio.

## 4. Listo cuando

- `scripts/migrate-p-table-standard.mjs` existe, con `--dry-run` como
  comportamiento por defecto.
- `dry-run-lote-piloto-script.md` generado, mostrando el diff completo
  de los 8 archivos que sí califican y la exclusión correcta del
  noveno.
- **Ningún archivo de `src/app/modules/` fue escrito de verdad** —
  confírmalo con `git status --short` (no debe aparecer ninguno de los
  9 archivos de prueba como modificado).
- Reporta el contenido completo de `dry-run-lote-piloto-script.md`, no
  solo un resumen — lo audito diff por diff antes de autorizar la
  primera corrida real con `--write`.
