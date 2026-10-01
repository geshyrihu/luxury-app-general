# Prompt Fase 8 — Corrección: `bottom-nav` sin borrar + 136 metadatos huérfanos en `ui-dictionary.ts`

Auditoría del borrado masivo (Prompt 01): salió casi perfecto (94
componentes correctamente verificados y borrados, `tsc`/build limpios,
tooltip migrado a `NgbTooltip` con `hostDirectives` — buen patrón,
preserva el contrato `[lxTooltip]` exacto). Dos cosas quedaron sueltas:

## 1. `web/bottom-nav/` sigue sin borrar

```
src/app/shared/ui/web/bottom-nav/bottom-nav.ts
src/app/shared/ui/web/bottom-nav/bottom-nav.spec.ts
src/app/shared/ui/adaptive/bottom-nav/bottom-nav.ts
```
`grep -rl "@ui/web/bottom-nav/\|@ui/adaptive/bottom-nav/" src/app --include="*.ts" --include="*.html" | grep -v spec` →
solo `adaptive/bottom-nav/bottom-nav.ts`, que a su vez tampoco tiene
consumidores reales). Es un componente **distinto** de
`@ui/mobile/bottom-nav/bottom-nav.ts` (`MobileBottomNav`, selector
`ili-bottom-nav`) — ese SÍ es real, tiene un consumidor genuino
(`core/layout/committee-layout/desktop/mobile-nav.ts`) y **no
completamente distinto pese al nombre parecido.

Borra los 3 archivos de arriba (`web/bottom-nav/` y
`adaptive/bottom-nav/` completos).

También quedó una carpeta vacía `web/dock/` (el `.ts` ya se borró
correctamente, solo sobró el directorio vacío) — bórrala si la
encuentras, y revisa si hay más carpetas vacías similares entre las
94 borradas (`rmdir` no falla si ya no existen, así que no hace daño
intentarlo en todas).

## 2. 136 entradas huérfanas en `ui-dictionary.ts`

```
src/app/modules/admin.luxuryapp/herramientas-dev/catalog-component-ui/shared/ui-dictionary.ts
```
Este archivo es el catálogo de metadatos del design system (usado
para listar componentes en el showroom interno) — tiene entradas con
un campo `"path": "shared/ui/..."` para cada componente documentado.
136 de esas entradas apuntan a archivos que ya no existen tras el
borrado masivo (los 94 componentes muertos + sus capas
adaptive/mobile). Aunque son solo strings (no imports reales — por
eso `tsc`/build no los detectan), dejan el catálogo interno mostrando
enlaces rotos.

Genera la lista exacta con:
```bash
grep -oP '"path":\s*"\K[^"]+' src/app/modules/admin.luxuryapp/herramientas-dev/catalog-component-ui/shared/ui-dictionary.ts | sort -u | while read -r p; do
  [ -f "src/app/$p" ] || echo "$p"
done
```
Para cada `path` huérfano que salga de ese comando, localiza y borra
la entrada completa correspondiente en `ui-dictionary.ts` (el objeto
JSON-like completo que contiene ese `"path"`, no solo la línea del
path).

**Excepción a revisar aparte, no la borres a ciegas**:
`shared/ui/shared/app-icon/app-icon.component.ts` también aparece
con este borrado — probablemente es una ruta que ya estaba desactualizada
antes de esta sesión (el componente real pudo haberse movido/renombrado
en otro momento). Verifica dónde vive `AppIcon` realmente hoy
(`src/app/shared/ui/shared/app-icon/app-icon.ts`, sin el
`.component` en el nombre, es mi sospecha) y corrige la ruta del
`"path"` en vez de borrar la entrada — este componente sigue siendo
real y muy usado.

## Verificación

  debería existir el archivo.
- `grep -oP '"path":\s*"\K[^"]+' .../ui-dictionary.ts | sort -u | while read -r p; do [ -f "src/app/$p" ] || echo "$p"; done`
  → 0 resultados salvo, si decides dejarlo así, ninguno (corrige
  también el de `app-icon`).
- `npx tsc --noEmit`: 0 errores.
- `ng build` **redirigido a archivo completo (`> log 2>&1`), espera a
  que el proceso termine de verdad, revisa el log entero con
  `grep -c ERROR`**.
- Abre el catálogo de componentes en el navegador y confirma que no
  muestra errores ni enlaces rotos visibles para las secciones que
  tocaste.

## Listo cuando

- `bottom-nav` (web+adaptive) borrado, `mobile/bottom-nav` intacto.
- 0 entradas huérfanas en `ui-dictionary.ts` (la de `app-icon`
  corregida, no borrada).
- `tsc`/build limpios.
  debería quedar en exactamente 28 (los archivos de Categoría B/C/D
  que faltan por migrar) — repórtalo.
