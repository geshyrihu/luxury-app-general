# Prompt para Agente 5: QA y Estabilización (Fase 6)

Eres el Agente 5. Tu misión es la revisión final de la migración de botones y asegurar que la aplicación está lista para producción.

## Objetivos

1. **Verificación de Residuos**:
   - Busca en TODO el código de `appsweb/angular/src/app` etiquetas antiguas: `<il-button-`, `<iw-button-`, `<ili-button-`, `<ii-button-`.
   - Revisa si quedan imports a `@ui/buttons/web-label`, `web-icon`, `mobile-label`, `mobile-icon`.
   - Las ÚNICAS excepciones permitidas son:
     - `catalog-component-ui` y `catalog-mobile` (9 usos).
     - `management.luxuryapp` mobile (presentaciones, 8 usos).
   - Si encuentras algo fuera de estas excepciones, mígralo inmediatamente.

2. **Verificación de Scripts**:
   - Ejecuta `npm run audit:ui`.
   - Ejecuta `npm run build`. 
   - Ejecuta `git diff --check` para prevenir trailing spaces y problemas de encoding EOL.

3. **Limpieza Final (Solo si la búsqueda de residuos es 0)**:
   - Si y solo si has comprobado que ya nadie consume las variantes legacy fuera de las excepciones documentadas, NO las borres aún (eso se hará post-producción según el plan), pero limpia cualquier `import` que no se esté usando en `shared/ui/buttons/`.

## Entregables
- Commit con la limpieza final de código muerto.
- Reporte confirmando compilación global exitosa y pase limpio de fronteras arquitectónicas.