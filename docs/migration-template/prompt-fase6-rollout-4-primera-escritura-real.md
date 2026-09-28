# Prompt 4 — Fase 6: primera escritura real del codemod (8 archivos) + fix manual de `#empty`

El dry-run de `scripts/migrate-p-table-standard.mjs` sobre el lote de
10 archivos quedó auditado y correcto (8 transformados, 1 excluido por
`pTemplate`, 0 advertencias — ver `dry-run-lote-piloto-script.md`).
Autorizado: primera corrida real con `--write` sobre esos mismos 8.

## 1. Hallazgo aparte, corrígelo a mano (no es parte del codemod)

En `committee-cobranza-web.html`, el `<ng-template #empty>` (línea
~337) usa un nombre que **ni PrimeNG real ni `app-table`** reconocen
(el nombre correcto es `#emptymessage`) — el mensaje "Sin morosos" /
"No se encontraron propiedades con deuda" probablemente nunca se
mostró, ni antes de esta migración. Se buscó en todo el repo: **solo 2
archivos** tienen este typo, no amerita una regla nueva en el script.

- **En este lote:** corrige `<ng-template #empty>` → `<ng-template #emptymessage>`
  en `committee-cobranza-web.html`, como parte del mismo cambio (ya se
  está tocando este archivo).
- **Anótalo, no lo toques todavía:** `funding-upload-invoices-modal.html`
  (`accounting.luxuryapp`) tiene el mismo typo — se corrige cuando le
  toque su lote (accounting es un módulo grande, viene después).

## 2. Ejecutar la escritura real

```
node scripts/migrate-p-table-standard.mjs --write \
  src/app/modules/auth.luxuryapp/password-manager/password-list.html \
  src/app/modules/committee.luxuryapp/cobranza/committee-cobranza-web.html \
  src/app/modules/resident.luxuryapp/owner/owner-list.html \
  src/app/modules/resident.luxuryapp/property/property-occupant-manager.html \
  src/app/modules/resident.luxuryapp/property/propiedades-list.html \
  src/app/modules/system.luxuryapp/configuracion-sistema/database-backup/database-backup-list.html \
  src/app/modules/system.luxuryapp/configuracion-sistema/knowledge-base/ai-knowledge-base-list.html \
  src/app/modules/system.luxuryapp/configuracion-sistema/vault-secrets/vault-secrets-list.html
```

(ajusta la ruta/lista exacta si el script espera otra forma de
invocarse — es el mismo que ya corriste en dry-run, solo agregando
`--write`.) Después, aplica el fix manual del punto 1.

## 3. Verificación

1. `git diff --stat` de los 8 pares de archivos (16 archivos:
   8 `.html` + 8 `.ts`) — debe coincidir exactamente con lo que ya
   mostró el dry-run (mismas líneas, nada más).
2. `npx tsc --noEmit` — limpio salvo los 4 archivos ya conocidos y
   ajenos (`recepcion-pipas-agua-list.ts`, `sanction-list.ts`,
   `employee-list.ts`, `recruitment-staff-board.ts`).
3. `grep -rn "TableModule\|primeng-table\|pSortableColumn\|<p-sorticon\|<p-table" ` sobre
   los 8 pares → 0 resultados.
4. En el navegador (`ng serve`), abre al menos 3 de las 8 pantallas
   (elige variedad: una con `[lazy]` como `password-list`, una sin
   paginador como `property-occupant-manager`, una simple como
   `ai-knowledge-base-list` o `vault-secrets-list`) y confirma que
   cargan, ordenan y paginan igual que antes. Para
   `committee-cobranza-web.html`, confirma además que el mensaje de
   "Sin morosos" ahora sí se muestra si fuerzas una lista vacía (si no
   es fácil de forzar, no bloquea — repórtalo como pendiente de
   verificar).
5. Captura de al menos 2 pantallas.

## Listo cuando

- Los 8 archivos escritos, diff idéntico al dry-run ya auditado.
- Fix manual de `#empty` aplicado en `committee-cobranza-web.html`.
- `tsc` limpio (salvo los 4 ajenos ya conocidos).
- 0 referencias residuales a PrimeNG en los 16 archivos.
- Capturas reales de al menos 2 pantallas verificando visualmente.

Con esto cerrado, el siguiente paso es escalar el mismo script a los
módulos grandes (`operations.luxuryapp`: 73, `accounting.luxuryapp`:
57, etc.), en lotes por módulo — se decide el orden y tamaño de esos
lotes en un prompt aparte, después de auditar este.
