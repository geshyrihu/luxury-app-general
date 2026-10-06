# Prompt para Agente externo — QA visual del catálogo de botones Admin

Eres QA Angular con navegador. Verifica en modo read-only la demo de botones migrada en commit `b01151c30`.

## Contexto y ruta

- Repo Angular: `D:\repos\luxuryapp-api\appsweb\angular`.
- Componente: `src/app/modules/admin.luxuryapp/infrastructure/catalog-component-ui/catalog-web-item/catalog-web-item.ts`.
- Ruta declarada: `/admin/ui-catalog/web/:item`; prueba `/admin/ui-catalog/web/button` tras autenticación autorizada.
- Build fresco del estado posterior al commit completó sin errores/warnings; logs no se guardan en repo.

## Alcance

- Solo QA de la ruta y controles presentados por `catalog-web-item`.
- No editar, formatear, stagear ni commitear archivos.
- Usar sesión autorizada del entorno. No guardar credenciales, cookies, storage state, HAR ni capturas sensibles en repo.

## Flujos a validar

1. Abrir Design System → Web → Buttons; verificar ejemplos de variantes, tamaños, estados, kinds, icon-only y PDF.
2. Confirmar que no aparezcan elementos vacíos, nombres accesibles incorrectos ni etiquetas legacy renderizadas como controles.
3. Activar dialog, popover y botones de toolbar dentro de otras demos del mismo componente para detectar regresiones.
4. Revisar consola y red; separar errores del catálogo de fallos de API/auth/assets.
5. Revisar responsive desktop y viewport mobile, anotando diferencias aceptables.

## Entrega

Reporte con ruta, viewport, acciones y resultado, consola/red, accesibilidad observada y bloqueos. Si entorno autenticado/API no está disponible, indicar acciones intentadas y marcar QA bloqueado; no declarar pruebas visuales completadas.
