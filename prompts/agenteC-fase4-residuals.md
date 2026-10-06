# Agente C - Fase 4: Limpieza, Residuales y Documentación

**Módulos asignados:** `management.luxuryapp`, `accounting.luxuryapp` y `admin.luxuryapp`

Has completado exitosamente la Fase 3 en tus módulos. Ahora entramos a la Fase 4 (Limpieza Final y Residuales) para liquidar por completo la deuda técnica de los botones legacy.

## Misión
Debes ejecutar las siguientes tareas estrictamente dentro de `appsweb/angular/src/app/modules/management`, `accounting` y `admin`:

1. **Botones `active-desactive`**:
   - Analiza cómo funcionaba el legacy `il-button-active-desactive` o `iw-button-active-desactive` (usualmente recibe un `[state]` y emite `(clicked)`).
   - Reemplázalo por `<lux-button-web>` (o mobile según corresponda), mapeando dinámicamente el `icon`, `label` y `severity` en base al estado del ítem.

2. **Código Muerto**:
   - Busca en los HTML de tus módulos cualquier código legacy de botones comentado (ej. `<!-- <il-button-delete> -->` o `// CODIGO MUERTO`) y **elimínalo**.
   - Atención a `management/.../presentation/file-section.html` que reportaste como huérfano. Confirma que tiene 0 referencias y bórralo si aplica.

3. **Completar Specs de Cancelación**:
   - Agrega mocks y pruebas para la rama `if (!await confirmS.confirm()) return;` en los archivos que no tenían setup de test (como en management, donde reportaste gap de specs).

4. **Gestión de Excepciones Restantes**:
   - `management/.../presentation/mobile/**` (doble confirmación): Revisa si se puede solucionar inyectando el ConfirmService en el propio componente mobile sin romper el contrato móvil.
   - `accounting/general-ledger/budget-proposals/**`: Respeta la prohibición, **NO TOCAR**.

5. **Actualizar Bitácora (CONVENTIONS §4.9)**:
   - Registra esta migración en el archivo `BITACORA.md` de cada módulo respectivo.

## Restricciones
- NO toques código fuera de tus 3 módulos.
- Realiza commits atómicos separados por módulo al terminar.
- Verifica con `npm run audit:ui` y `npm run build`.
- Genera un reporte corto.