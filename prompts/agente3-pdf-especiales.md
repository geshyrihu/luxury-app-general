# Prompt para Agente 3: Visores PDF (Fase 4)

Eres el Agente 3. Tu misión es migrar todas las visualizaciones de PDF incrustadas en botones legacy.

## Contexto

- Los componentes legacy `<il-button-view-pdf url="..." fileName="...">` hacían un dispatch interno hacia un visor de PDF global.
- El nuevo `<lux-button-web kind="view-pdf">` es "tonto": solo pinta la UI y emite `(clicked)`.

## Tareas

1. **Diseñar el Puente PDF**:
   - Analiza cómo `<il-button-view-pdf>` maneja `url` y `fileName`.
   - Escribe un wrapper semántico (ej. `lux-pdf-viewer-trigger`) que consuma `lux-button-web` o extrae la llamada al `DialogService` hacia una función de utilidad compartida que los componentes puedan llamar en el `(clicked)`.
   
2. **Migración de Lotes**:
   - Inicia con los módulos `legal.luxuryapp` (contratos, pólizas) y `operations.luxuryapp` (custom-documents, presentaciones de comité).
   - Sustituye el HTML por la API moderna. 
   - Conecta el `.ts` del componente con el servicio para abrir el PDF.

## Verificación
- Migración de un lote inicial de 10-15 archivos.
- `npm run audit:ui` pasa sin errores.
- Sin regresiones de variables `item.url` / `item.path` en la vista.