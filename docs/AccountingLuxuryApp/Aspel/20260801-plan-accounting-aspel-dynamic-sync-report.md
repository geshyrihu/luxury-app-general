# Reporte de implementación: sincronización dinámica

## Fase 01: proxy Angular

- Se creó `client/angular/proxy.conf.json` para enrutar `/api/AspelCOI` a `http://localhost:7070`.
- El servidor de desarrollo de Angular ya referencia ese archivo en `angular.json`.

## Fase 02: sincronización en caliente

- Se incorporó `POST /api/AspelCOI/Admin/SyncRealData` con `CustomerId` y `Ejercicio`.
- El mecanismo resuelve la empresa de Contabilidad configurada para el cliente, descarga las cinco fuentes reales de Aspel COI en paralelo y solo después reemplaza el contenido en memoria.
- La carga se realiza en lotes de 5,000 registros y la respuesta incluye los conteos sincronizados.
- Se añadió `GET /api/AspelCOI/Admin/Customers` para poblar la selección con clientes que tienen empresa contable configurada.

## Fase 03: interfaz Angular

- El dashboard incluye el panel `Sincronizar datos reales`, con selección de cliente y año, estado de carga, error legible, confirmación y refresco automático del corte.
- Las rutas que antes asumían la empresa de prueba `1` ahora aprovechan la empresa presente en los datos sincronizados.
