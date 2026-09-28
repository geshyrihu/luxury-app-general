# Prompt — Fix: reordenar filas no funciona en `solicitud-compra-list.ts`

Bug real reportado por el usuario. Diagnosticado: **no es un bug de
`AppTable`**, el mecanismo de reordenar filas (`AppTable.dropRow()`)
funciona bien — hace un splice optimista de `pagedValue()`, lo guarda
en `reorderedValue` para mostrarlo de inmediato, y emite
`onRowReorder({dragIndex, dropIndex})` para que el consumidor
persista el nuevo orden.

El bug está en el consumidor:
```
src/app/modules/purchases.luxuryapp/solicitudes-compras/solicitudes/solicitud-compra-list.ts
```

## Causa exacta

```ts
async onRowReorder(event: any) {
  const reordered = [...this.data()];
  const orderedIds = reordered.map((item: any) => item.id);
  ...
}
```
El parámetro `event` (que trae `dragIndex`/`dropIndex`) **nunca se
usa** — el método clona `data()` tal cual, en su orden viejo, y manda
ese orden sin cambios al backend. Luego, cuando el método hace
`this.data.update(...)`, cambia la *referencia* del signal `data` —
y `AppTable` tiene un `effect()` interno que resetea su
`reorderedValue` (el reordenamiento visual optimista) cada vez que
`[value]` cambia de referencia. Como `data` sigue teniendo el orden
viejo, la tabla "regresa" al orden original justo después de soltar —
por eso se ve como que el drag no hace nada.

## Fix

```diff
   async onRowReorder(event: any) {
     const reordered = [...this.data()];
+    const [moved] = reordered.splice(event.dragIndex, 1);
+    reordered.splice(event.dropIndex, 0, moved);
     const orderedIds = reordered.map((item: any) => item.id);

     if (orderedIds.length === 0) {
       return;
     }

     const result = await this.apiResponseS.onPut(
       Endpoints.PurchaseRequests.presentationOrder,
       { solicitudCompraIds: orderedIds },
       true,
       true,
     );

     if (!result) {
       this.onLoadData();
       return;
     }

-    this.data.update((prev) =>
-      prev.map((item, index) => ({ ...item, sortOrder: index })),
-    );
+    this.data.set(
+      reordered.map((item, index) => ({ ...item, sortOrder: index })),
+    );
     this.selectedSolicitudIds.set(
       this.data()
         .filter((item) => item.selectedForPresentation)
         .sort((a, b) => a.sortOrder - b.sortOrder)
         .map((item) => item.id),
     );
   }
```

Tipa `event` correctamente si quieres de paso (`{ dragIndex: number;
dropIndex: number }` en vez de `any`), no es obligatorio para el fix
pero mejora la señal de qué trae el evento.

**Clave del fix**: ahora `reordered` sí queda en el orden correcto
(splice con `dragIndex`/`dropIndex`), se manda ese orden correcto al
backend, y `data.set(...)` deja el signal `data` YA en el orden
nuevo — así cuando el `effect()` de `AppTable` resetea
`reorderedValue`, no importa, porque `data()` (la fuente de verdad)
ya tiene el orden correcto y la tabla se ve igual.

## Verificación

- `npx tsc --noEmit`: 0 errores.
- `ng build` **redirigido a archivo completo (`> log 2>&1`), espera a
  que el proceso termine, revisa el log con `grep -c ERROR`**.
- **Prueba real en navegador** (es un bug de comportamiento, no de
  compilación): entra a la lista de solicitudes de compra
  pendientes, arrastra una fila usando el icono de "menu" (el handle),
  suéltala en otra posición, y confirma que **se queda** en la nueva
  posición (no regresa a su lugar original). Recarga la página y
  confirma que el orden persistió (se guardó en el backend).

## Listo cuando

- Arrastrar y soltar una fila la deja en su nueva posición de forma
  permanente (no regresa).
- El orden persiste tras recargar.
- `tsc`/build limpios.
