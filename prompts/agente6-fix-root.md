# Agente 6 - Cirugía de Compilación (Core, Routing, Shared Root)

**Misión:** En la corrida anterior abortaste la recuperación. El log del compilador reveló daños en el layout base estructural y archivos raíz por regex ajenos (Agente 5 los pisó). Aplica esta cirugía exacta para devolver la vida al layout principal.

**Dominio ESTRICTO:**
- `appsweb/angular/src/app/core/`
- `appsweb/angular/src/app/routing/`
- `appsweb/angular/src/app/shared/` (EXCEPTO `shared/ui`)
- `appsweb/angular/src/app/*.ts` y `*.html` (Archivos raíz)

## Tareas de Reparación (Basadas en Log de Compilación)

Busca estos archivos específicos dentro de tu dominio y revierte exactamente el daño estructural:

1. **`src/app/app.html`**
   - El componente adaptativo fue sobre-renombrado a web.
   - Reemplaza `<lux-scroll-top-web />` por `<lux-scroll-top />`.

2. **`src/app/core/layout/employee-view/desktop/view-employee-desktop/view-employee-desktop.html`**
   - Reemplaza `<lux-sidebar-web />` por `<lux-sidebar />`.

3. **`src/app/core/layout/employee-view/layout-employee.html`**
   - Un componente estructural puro de feature fue renombrado ciegamente.
   - Reemplaza `<app-panic-alert-incoming-dialog-web />` por `<app-panic-alert-incoming-dialog />`.

4. **Verificación General Root:**
   - Asegúrate de que no haya otros componentes estructurales (ej. un header o un navbar) con el subfijo `-web` añadido erróneamente en `core/layout`.
   - Todos los componentes de Layout que sean de tu dominio (no oficiales de `shared/ui`) NUNCA deben llevar la palabra `lux-`. Devuélvelos a `app-`.

## Guardado y Commit Aislado
- Ejecuta exactamente (copia y pega):
  `git add appsweb/angular/src/app/core appsweb/angular/src/app/routing appsweb/angular/src/app/shared/directives appsweb/angular/src/app/shared/integration appsweb/angular/src/app/shared/pipes appsweb/angular/src/app/shared/user-account-access appsweb/angular/src/app/shared/utils appsweb/angular/src/app/*.ts appsweb/angular/src/app/*.html`
- **PROHIBIDO** usar `git add .` o `git commit -a`.
- Crea un commit: `fix(core,root): repara NG8001 estructurales y falsos positivos de layout`