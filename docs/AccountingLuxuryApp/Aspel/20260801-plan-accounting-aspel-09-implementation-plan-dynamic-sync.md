# 🧠 Plan de Implementación: Sincronización Dinámica y Corrección de Proxy

> **Instrucciones para el Agente CLI:**
> Ejecuta estas tres fases para reparar la comunicación entre el Frontend y el Backend, y luego construir el mecanismo de "Hot Swap" (Sincronización Dinámica) para importar datos reales de Aspel hacia nuestro Simulador en Memoria.
> Documenta tu progreso en `docs/plans/dynamic-sync-report.md`.

---

## 🚀 FASE 01: Corrección de Enrutamiento (Proxy de Angular)
**Objetivo:** Permitir que Angular envíe las peticiones `/api/AspelCOI` al servidor de C# evitando el error de CORS o de fallback HTML.

### Prompt de Ejecución (Copiar y pegar al Agente CLI)
```text
Corrige el proxy de desarrollo de Angular:
1. Abre el archivo de configuración del proxy de Angular (generalmente `proxy.conf.json` o `proxy.conf.js` en la raíz de `client/angular/`).
2. Agrega una nueva regla para la ruta `"/api/AspelCOI"`.
3. Configura el `target` apuntando a la URL del backend local de C# (revisa hacia dónde apuntan las otras reglas del proxy, ej. `https://localhost:7143` o `http://localhost:5000`).
4. Si estás usando Angular 22 con `application` builder, verifica que el proxy esté referenciado en el `angular.json`.
5. Reinicia el servidor de Angular (si aplica).
6. Reporta el éxito en `docs/plans/dynamic-sync-report.md`.
```

---

## 🚀 FASE 02: Endpoint de Sincronización (Backend C#)
**Objetivo:** Crear un endpoint administrativo en el Mock que borre la RAM y traiga datos reales del servidor Aspel.

### Prompt de Ejecución (Copiar y pegar al Agente CLI)
```text
Crea el mecanismo de sincronización en caliente:
1. En `MockAspelEndpoints.cs`, agrega un nuevo endpoint `POST /api/AspelCOI/Admin/SyncRealData`.
2. El endpoint debe recibir un payload con `CustomerId` (Guid) y `Ejercicio` (int).
3. Dentro del endpoint, inyecta el servicio que LuxuryApp utiliza actualmente para comunicarse con el servidor real de Aspel (el mismo que usan para alimentar el `EspejoAspelFull`).
4. Descarga los Catálogos (Cuentas, Polizas, Auxiliares, Saldos, Presupuestos) de ese CustomerId y Ejercicio específicos desde Aspel real.
5. Inyecta el `MockAspelDbContext` y realiza un borrado total (Truncate/RemoveRange) de los registros actuales en memoria para limpiar el simulador.
6. Mapea los datos reales descargados hacia nuestras entidades `MockCuenta`, `MockPoliza`, etc., y guárdalos con `db.AddRangeAsync()` asignándoles el `CustomerId` solicitado.
7. Retorna un `200 OK` con un mensaje indicando cuántos registros fueron sincronizados.
8. Reporta en `docs/plans/dynamic-sync-report.md`.
```

---

## 🚀 FASE 03: Botón de Sincronización (Frontend UI)
**Objetivo:** Dotar a la Cara Bonita de un panel para cambiar de empresa en tiempo real.

### Prompt de Ejecución (Copiar y pegar al Agente CLI)
```text
Modifica el Dashboard de Mock Aspel para accionar la sincronización:
1. En `mock-aspel.service.ts`, agrega el método `syncRealData(customerId, ejercicio)` apuntando al nuevo endpoint POST.
2. En la UI del `MockAspelDashboardComponent` (barra superior), agrega un botón que diga "Sincronizar Datos Reales".
3. Al hacer clic, debe abrir un pequeño diálogo o panel (Modal) pidiendo seleccionar el "Cliente / Condominio" (listando los customers reales de LuxuryApp) y el "Año".
4. Muestra un *Spinner* o pantalla de carga (Loading) mientras se hace la petición, ya que podría tomar un par de segundos ir hasta el servidor de Aspel y llenar la memoria RAM.
5. Al recibir la respuesta exitosa (200 OK), cierra el modal, muestra una alerta de éxito y manda llamar a `refresh()` para recargar la tabla con la información de la nueva empresa.
6. Reporta la finalización en `docs/plans/dynamic-sync-report.md`.
```

