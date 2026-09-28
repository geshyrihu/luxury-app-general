# Prompt 6 — Fase 6: rollout completo de `supplier.luxuryapp` (16 archivos + 1 huérfano descartado)

**Actualización tras el dry-run:** `pr/cedula-presupuestal/cedula-cliente-list.html`
no tiene ningún `.ts` que lo use (`grep` de `cedula-cliente-list.html`
en todo `src/app` no encuentra ningún `templateUrl` que lo referencie)
— es un archivo huérfano, muerto, nunca se compila. **Sácalo del
lote**, no lo toques ni lo borres (eso es limpieza aparte, fuera de
alcance de Fase 6) — solo no lo incluyas en el `--write`. El lote real
queda en **16 archivos**.

Tercer lote real del codemod. Ya se verificó que los 17 archivos de
este módulo están completamente limpios contra los 4 patrones
especiales conocidos (`pTemplate=`, `virtualScrollItemSize` muerto,
`p-sorticon` con cierre separado o sin `field`, inputs no soportados
como `[(selection)]`/`[rowGroupMode]`/`[reorderableColumns]`) — **no
hace falta ningún fix puntual esta vez**, a diferencia de los lotes
anteriores.

## Lote completo (17 archivos)

```
src/app/modules/supplier.luxuryapp/customer-provider/mis-proveedores-list.html
src/app/modules/supplier.luxuryapp/lighting-inventory/inventario-iluminacion.html
src/app/modules/supplier.luxuryapp/paint-inventory/inventario-pintura.html
src/app/modules/supplier.luxuryapp/po/purchase-order/create-orden-compra-wizard/create-orden-compra-wizard.html
src/app/modules/supplier.luxuryapp/po/purchase-order/forms/orden-compra-detalle-add-producto.html
src/app/modules/supplier.luxuryapp/po/purchase-order/forms/orden-compra-factura-form.html
src/app/modules/supplier.luxuryapp/po/purchase-order/orden-compra-list.html
src/app/modules/supplier.luxuryapp/po/purchase-order/orden-compra-presupuesto/orden-compra-presupuesto.html
src/app/modules/supplier.luxuryapp/po/purchase-order/orden-compra.html
src/app/modules/supplier.luxuryapp/po/purchase-order/parcials/orden-compra-facturas-parcial.html
src/app/modules/supplier.luxuryapp/po/purchase-order/payment-voucher-modal/payment-voucher-modal.html
src/app/modules/supplier.luxuryapp/pr/cedula-presupuestal/ordenes-compra-cedula-list.html
src/app/modules/supplier.luxuryapp/product/productos-list.html
src/app/modules/supplier.luxuryapp/provider/provider-list.html
src/app/modules/supplier.luxuryapp/provider-support/provider-support.html
src/app/modules/supplier.luxuryapp/providers/provider-support/provider-support.html
```

Nota: hay dos archivos `provider-support.html` en rutas distintas
(`provider-support/` y `providers/provider-support/`) — son archivos
diferentes, procesa los dos, no asumas que es un duplicado del mismo.

## Procedimiento (idéntico al de los 2 lotes anteriores, ya probado)

1. `node scripts/migrate-p-table-standard.mjs --dry-run <los 16 archivos, sin cedula-cliente-list.html>`.
2. El reporte debería dar **16 transformados, 0 excluidos, 0
   advertencias**. Si sale distinto, detente y repórtalo sin escribir.
3. Si calza, corre el mismo comando con `--write`.
4. `npx tsc --noEmit` → limpio.
5. `ng build` o `ng serve` compilando sin `NG8002`/similares.
6. `grep -rn "TableModule\|primeng-table\|<p-table\b"` sobre los 17 →
   0 resultados.

## Verificación visual

Elige **4-5 pantallas** representativas (por ejemplo:
`provider-list.html`, `orden-compra-list.html`, `productos-list.html`,
uno de los dos `provider-support.html`). Confirma que cargan, ordenan,
paginan, y el caption funciona. Capturas reales guardadas como archivo
(`docs/migration-template/fase6-rollout-6-<nombre>.png`).

## Listo cuando

- 17 archivos migrados, diff coherente con el dry-run.
- `tsc` y `ng build`/`ng serve` limpios.
- 0 residuales de PrimeNG.
- 4-5 capturas reales guardadas y reportadas con su ruta.
- `git diff --stat` completo del lote.
- Cualquier hallazgo ajeno al codemod (backend 404, errores
  preexistentes de otras pantallas) repórtalo igual que en rondas
  anteriores — no hace falta que lo arregles, solo que lo documentes
  con precisión (archivo:línea si es de código, o el endpoint si es de
  backend).

Con esto cerrado, `supplier.luxuryapp` queda migrado en su totalidad
de lo que realmente se usa (16/16 archivos activos; el huérfano
`cedula-cliente-list.html` se anota aparte, fuera del conteo) y el
total sube a 43/334.
