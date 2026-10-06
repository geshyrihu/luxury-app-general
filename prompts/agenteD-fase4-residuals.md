# Agente D - Fase 4: Limpieza, Residuales y Documentación

**Módulos asignados:** `legal.luxuryapp`, `human-resources.luxuryapp`, `purchases.luxuryapp` y `collections.luxuryapp`

Has completado exitosamente la Fase 3 en tus módulos. Ahora entramos a la Fase 4 (Limpieza Final y Residuales) para liquidar por completo la deuda técnica de los botones legacy.

## Misión
Debes ejecutar las siguientes tareas estrictamente dentro de tus 4 módulos (`legal`, `human-resources`, `purchases`, `collections`):

1. **Botones `active-desactive`**:
   - Analiza cómo funcionaba el legacy `il-button-active-desactive` o `iw-button-active-desactive` (usualmente recibe un `[state]` y emite `(clicked)`).
   - Reemplázalo por `<lux-button-web>` (o mobile según corresponda), mapeando dinámicamente el `icon`, `label` y `severity` en base al estado del ítem.

2. **Residuales con `[routerLink]` y sin evento**:
   - Identificaste casos como `orden-compra.html` (un `il-button-item` con `[routerLink]`). Asegúrate de que todos hayan sido migrados a `<lux-button-web [routerLink]="...">`.

3. **Código Muerto**:
   - Busca en los HTML de tus módulos cualquier código legacy de botones comentado (ej. `<!-- <il-button-delete> -->` o `// CODIGO MUERTO`) y **elimínalo**.

4. **Completar Specs de Cancelación**:
   - Asegúrate de que las pruebas unitarias (`.spec.ts`) cubran la rama de cancelación (`if (!await confirmS.confirm()) return;`) para todos los destructivos movidos en la Fase 3.

5. **Actualizar Bitácora (CONVENTIONS §4.9)**:
   - Registra esta migración en el archivo `BITACORA.md` de cada módulo respectivo.

## Restricciones
- NO toques código fuera de tus 4 módulos.
- Realiza commits atómicos separados por módulo al terminar.
- Verifica con `npm run audit:ui` y `npm run build`.
- Genera un reporte corto.