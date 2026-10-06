# Agente 1 - Cirugía de Compilación (Operations & Auth)

**Misión:** El log del compilador reveló etiquetas exactas que no se renombraron correctamente en tu dominio. Aplica estos cambios quirúrgicos.

**Dominio ESTRICTO:**
- `appsweb/angular/src/app/modules/operations.luxuryapp`
- `appsweb/angular/src/app/modules/auth.luxuryapp`

## Tareas de Reparación (Basadas en Log de Compilación)

Busca estos archivos específicos dentro de tu dominio y reemplaza exactamente las etiquetas indicadas:

1. **`reglamentos-list.html`** (`custom-documents/custom-document/`)
   - Reemplaza `<app-message>` por `<lux-message-web>` (Asegúrate de cerrar con `</lux-message-web>`).

2. **`unified-pending-dashboard.html`** (`dashboard/`)
   - Reemplaza `<app-image-analysis-dialog>` por `<lux-image-analysis-dialog>`.

3. **`entrega-recepcion-*.html`** (`delivery-receptions/delivery-reception/`)
   - Afecta a hidrantes, instalaciones, insumos, llaves, mantenimientos, mantenimientos-pendientes.
   - Reemplaza `<app-report-header>` por `<lux-report-header-web>`.

4. **`google-calendar-form.html`** (`google-calendar/google-calendar/`)
   - Reemplaza `<app-segmented-control>` por `<lux-segmented-control>`.

5. **`provider-list-desktop.html`** (`providers/desktop/`)
   - Reemplaza `<app-segmented-control>` por `<lux-segmented-control>`.
   - Reemplaza `<app-paginator>` por `<lux-paginator-web>`.

**Regla de Oro:** Revisa todo tu dominio corriendo `npm run build` o tu validador local. Si encuentras más errores `NG8001`, repáralos usando lógica: los primitivos y adaptativos son `lux-X`, los puramente web son `lux-X-web`.

## Guardado y Commit Aislado
- `git add appsweb/angular/src/app/modules/operations.luxuryapp appsweb/angular/src/app/modules/auth.luxuryapp`
- **PROHIBIDO** usar `git add .` o `git commit -a`.
- Crea un commit: `fix(operations,auth): repara NG8001 con reemplazos quirurgicos`