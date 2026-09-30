# Prompt 9d — Fase 6: reverificar `aspel-customer-empresa` con la ruta correcta

Al auditar las 9 capturas del lote de `accounting.luxuryapp` encontré
2 cosas que no bloquean el cierre, pero una sí necesita repetirse:

## 1. Repetir la captura — la anterior no navegó a la pantalla real

`fase6-rollout-9-aspel-customer-empresa.png` muestra un **404 de ruta
de Angular** ("¡Oops! Página no encontrada"), no la pantalla — no
verifica el fix de `virtualScrollItemSize` que se aplicó ahí. La ruta
real registrada es:

```
/accounting/aspel-customer-empresa
```

(confirmado en `src/app/routing/accounting.routing.ts:177-180`, carga
`ar/aspel-customer-empresa/aspel-customer-empresa-list.ts`). Navega
ahí de nuevo, confirma que carga la tabla real, ordena, pagina, y toma
una captura nueva.

## 2. Sin acción — 2 hallazgos ya investigados y descartados como bloqueo

- **`financial-summary.html` se ve en blanco**: no es un problema de
  esta migración. El archivo tiene los `<ng-template #caption>`/
  `#header`/`#footer`/`#emptymessage` **vacíos**, con comentarios tipo
  "Copia y pega aquí la sección de tu componente anterior. No necesita
  cambios." — nunca se terminó de escribir. Confirmado con `git log`:
  el último commit sobre ese archivo es de antes de esta sesión, la
  plantilla ya estaba incompleta. No lo toques, no es tu
  responsabilidad completarlo.
  tiene equivalente en `AppTable` todavía** — se encontró en 7
  archivos de todo el repo (2 ya migrados: `presupuesto-propuesta.html`
  de este mismo lote, `cobranza-online-movimientos.html` de
  `collections.luxuryapp`). Como es un atributo plano sin corchetes,
  no rompe la compilación — solo deja de congelar esa columna
  visualmente al hacer scroll horizontal, el resto de la tabla sigue
  funcionando. **No lo arregles ahora** — queda catalogado junto con
  selección de filas/reordenar columnas/agrupación como funcionalidad
  pendiente de diseño para una fase aparte, decisión del usuario si
  vale la pena construirla.

## Listo cuando

- Captura nueva de `aspel-customer-empresa` con la ruta correcta,
  mostrando la tabla real.
- Nada más que tocar — los otros 2 puntos son solo para que quede
  registrado, no piden acción.
