# Prompt 4b — Fase 6: quitar `virtualScrollItemSize` muerto y reverificar el lote de 8

## 1. Fix puntual (bloqueante para terminar el Prompt 4)

En `src/app/modules/system.luxuryapp/configuracion-sistema/knowledge-base/ai-knowledge-base-list.html`,
quita la línea `[virtualScrollItemSize]="tablePrimeNgRows"` (línea 16
aprox., dentro de las propiedades de `<app-table>`). Es markup muerto
de origen: nunca vino acompañado de `[virtualScroll]="true"` (que es
lo que realmente activa el modo virtual en PrimeNG), así que nunca tuvo
efecto — confirmado, es el mismo patrón exacto en los otros 3 archivos
del repo que también lo tienen (ver punto 2). `AppTable` no declara ese
input, por eso ahora es un error duro de compilación (`NG8002`) en vez
de una propiedad ignorada en silencio como antes.

No agregues el input a `AppTable` ni intentes soportar virtual scroll
— no hace falta, es borrar una línea que nunca funcionó.

## 2. Anotado para más adelante, no lo toques ahora

Los otros 3 archivos con el mismo `[virtualScrollItemSize]="tablePrimeNgRows"`
muerto (mismo fix cuando les toque su lote — no forman parte del lote
actual de 8):

```
src/app/modules/accounting.luxuryapp/ar/aspel-customer-empresa/aspel-customer-empresa-list.html
src/app/modules/accounting.luxuryapp/general-ledger/aspel-customer-empresa/aspel-customer-empresa-list.html
src/app/modules/legal.luxuryapp/comite-vigilancia/comites-list.html
```

## 3. Resolver el bloqueo de `.angular/cache` (`Access denied`)

El error de acceso denegado significa que algún proceso Node sigue
vivo con un handle abierto sobre esos archivos — borrar la carpeta no
va a funcionar mientras ese proceso siga corriendo, sin importar
cuántas veces se reintente. Antes de reintentar:

1. Identifica y cierra **todos** los procesos `node`/`ng serve`
   relacionados con este proyecto (no solo el que lanzaste tú — puede
   haber uno colgado de una sesión anterior). En Windows:
   `Get-Process node | Select-Object Id,Path` (PowerShell) para ver
   cuáles hay, y cierra los que correspondan a este repo antes de
   borrar la caché a la fuerza.
2. Recién con eso confirmado, borra `.angular/cache` completo.
3. Levanta `ng serve` limpio, espera a que termine de compilar antes de
   navegar.

## 4. Reverificación completa del lote de 8

Con el fix del punto 1 aplicado y el bloqueo resuelto:

1. `npx tsc --noEmit` (referencia, ya sabíamos que esto no detecta
   `NG8002` — no es suficiente por sí solo).
2. **`ng build` o el propio `ng serve` compilando sin errores** —
   esta vez confirmando explícitamente que no hay ningún `NG8002`/
   `NG8001`/similar en consola, no solo que "sirve".
3. Navega las 3 pantallas ya elegidas (una lazy, una sin paginador, una
   simple) y confirma visualmente que se ven y funcionan igual que
   antes.
4. Capturas reales de las 3.

## Listo cuando

- `ai-knowledge-base-list.html` sin la línea muerta, compilando limpio.
- `ng build`/`ng serve` sin errores de plantilla en ninguno de los 8
  archivos del lote (no solo `tsc`).
- 3 capturas reales confirmando paridad visual/funcional.
- Con esto, el lote de 8 queda cerrado de verdad y pasamos a decidir
  el orden de los módulos grandes.
