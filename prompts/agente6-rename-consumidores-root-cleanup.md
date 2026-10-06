# Agente 6 - Actualización Root, Shared No-UI y Cleanup Fase 5

**Misión:** Eres responsable de actualizar los componentes raíz y otros compartidos, además de liquidar finalmente los botones legacy huérfanos de la fase anterior (Fase 5 de Refactor de Botones).

**Carpetas asignadas:**
- `appsweb/angular/src/app/core/`
- `appsweb/angular/src/app/routing/`
- `appsweb/angular/src/app/shared/` (TODAS las carpetas *excepto* `ui`)
- `appsweb/angular/src/app/` (Archivos raíz como `app.component.ts`, `app.ts`, `app.html`, etc.)

## Tarea A: Reemplazos (Fases 1 y 2)
Igual que el resto de los módulos, aplica estos cambios en tus carpetas asignadas:
1. Reemplazar imports `@ui/base/` por `@ui/core/` y `@ui/shared/` por `@ui/primitives/`.
2. Cambiar tags `<lx-...>` a `<lux-...>`.
3. Cambiar tags `<app-...>` de las 24 primitivas conocidas a `<lux-...>` (incluyendo `app-icon` -> `lux-icon`).
4. Cambiar cualquier otro tag `<app-...>` a `<lux-...-web>`.

## Tarea B: Cleanup Fase 5 de Botones
Ya no quedan consumidores de los viejos botones legacy en la aplicación. Tu tarea es eliminarlos:
1. Eliminar completamente las carpetas físicas (si existen y están vacías de usos):
   - `appsweb/angular/src/app/shared/ui/buttons/web-label`
   - `appsweb/angular/src/app/shared/ui/buttons/web-icon`
   - `appsweb/angular/src/app/shared/ui/buttons/mobile-label`
   - `appsweb/angular/src/app/shared/ui/buttons/mobile-icon`
2. Remover sus exportaciones de `index.ts` o cualquier `*.module.ts` en `shared/ui/buttons`.

**Restricciones:** Crea commits atómicos separados para la Tarea A (Renombres) y Tarea B (Cleanup Botones). Verifica que el build no se rompa por la eliminación de los botones.