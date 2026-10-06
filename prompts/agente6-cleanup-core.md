# Agente 6 - Limpieza de Imports Muertos (Core, Routing, Shared No-UI)

**Misión:** Eliminar referencias huérfanas en los arreglos `imports: [...]` de `@Component`. 

**Dominio ESTRICTO:**
- `appsweb/angular/src/app/core/`
- `appsweb/angular/src/app/routing/`
- `appsweb/angular/src/app/shared/` (EXCEPTO `shared/ui`)
- Archivos raíz

## Tareas

1. **Limpiar `imports: []` muertos:**
   - En tu dominio (especialmente en los catálogos en `shared.luxuryapp`), existen arreglos `imports: [...]` que todavía mencionan `WebButtonIconEdit`, `MobileButtonLabelEdit`, etc.
   - Busca en los `.ts` de tu dominio cualquier mención en el array de imports a clases legacy de botones.
   - **Elimínalos** del array.

2. **Guardado y Commit:**
   - Usa `git add` explícito para tus rutas.
   - Commit: `fix(core,shared): remueve imports huerfanos de botones legacy en array de componentes`