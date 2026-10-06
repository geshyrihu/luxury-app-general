# Agente B - Fase 4: Limpieza, Residuales y Documentación

**Módulos asignados:** `recruitment.luxuryapp` y `maintenance.luxuryapp`

Has completado exitosamente la Fase 3 en tus módulos. Ahora entramos a la Fase 4 (Limpieza Final y Residuales) para liquidar por completo la deuda técnica de los botones legacy.

## Misión
Debes ejecutar las siguientes tareas estrictamente dentro de `appsweb/angular/src/app/modules/recruitment` y `appsweb/angular/src/app/modules/maintenance`:

1. **Botones `active-desactive`**:
   - Analiza cómo funcionaba el legacy `il-button-active-desactive` o `iw-button-active-desactive` (usualmente recibe un `[state]` y emite `(clicked)`).
   - Reemplázalo por `<lux-button-web>` (o mobile según corresponda), mapeando dinámicamente el `icon`, `label` y `severity` en base al estado del ítem (ej. `[icon]="item.activo ? 'pi-eye-slash' : 'pi-eye'"`).
   - Mantén el evento `(clicked)` intacto.

2. **Residuales con `[routerLink]` y sin evento**:
   - Convierte los botones legacy que solo tenían `[routerLink]` (sin `(clicked)`) a `<lux-button-web [routerLink]="..." variant="soft">` (o el variant correspondiente). Identificaste al menos 5 en recruitment y 2 en maintenance en tu reporte anterior.

3. **Código Muerto**:
   - Busca en los HTML de tus módulos cualquier código legacy de botones comentado (ej. `<!-- <il-button-delete> -->` o `// CODIGO MUERTO`) y **elimínalo**.

4. **Completar Specs de Cancelación**:
   - En la Fase 3 movimos la confirmación al `.ts` con `ConfirmService` o `SwalService`. Asegúrate de que las pruebas unitarias (`.spec.ts`) cubran la rama de cancelación (`if (!await confirmS.confirm()) return;`). Agrega el mock y la aserción correspondiente.
   - Soluciona cualquier setup faltante en specs si es estrictamente necesario para esta rama.

5. **Actualizar Bitácora (CONVENTIONS §4.9)**:
   - Registra esta migración estructural en el archivo `BITACORA.md` o documentación local del módulo (si existe).

## Restricciones
- NO toques código fuera de `recruitment` y `maintenance`.
- Realiza commits atómicos separados por módulo al terminar:
  - `refactor(recruitment): fase 4 limpieza de botones legacy, active-desactive y specs`
  - `refactor(maintenance): fase 4 limpieza de botones legacy, active-desactive y specs`
- Verifica con `npm run audit:ui` y `npm run build`.
- Genera un reporte corto de los archivos modificados.