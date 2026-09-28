# 🧠 Plan de Implementación: Frontend UI - Simulador Aspel (Cara Bonita)

Este documento contiene los **Prompts Estructurados de Ejecución** para que tu Agente CLI construya la interfaz visual (Angular) del Mock Aspel, de manera totalmente independiente y aislada del resto de LuxuryApp.

> **Instrucciones para el Agente CLI:**
> 1. Ubícate en el directorio Frontend de Angular (`client/angular/`).
> 2. Todo el código debe generarse dentro de `src/app/apps/contabilidad.luxuryapp/mock-aspel/`.
> 3. Utiliza componentes Standalone (si la versión de Angular del proyecto lo soporta) y sigue los lineamientos de inyección de dependencias (`inject()`).
> 4. Reporta el éxito de cada fase en `docs/plans/angular-mock-aspel-report.md`.

---

## 🚀 FASE 01: Generación de Servicios e Interfaces
**Objetivo:** Crear el cliente HTTP que se comunique con nuestras Minimal APIs.

### Prompt de Ejecución (Copiar y pegar al Agente CLI)
```text
Crea la capa de servicios HTTP para interactuar con la API del Mock Aspel.
1. En `client/angular/src/app/apps/contabilidad.luxuryapp/mock-aspel/services/`, crea `mock-aspel.service.ts`.
2. Define las interfaces TypeScript que hagan match con los DTOs del backend:
   - `MovimientosQueryRequest` (Ejercicio, FechaInicio, FechaFin, NumCtaIniciaCon, Page, PageSize)
   - `MovimientoResponse`
   - `PagedResponse<T>`
   - `PolizaCreateRequest` (TipoPoli, NumPoliz, Ejercicio, Periodo, FechaPol, Partidas[])
3. En el servicio (usando `providedIn: 'root'` y el nuevo `HttpClient` inyectable), implementa los siguientes métodos que apunten a `/api/AspelCOI/`:
   - `getMovimientos(query: MovimientosQueryRequest): Observable<PagedResponse<MovimientoResponse>>` (usando POST o GET según lo definimos).
   - `getSaldos(...)`
   - `createPoliza(poliza: PolizaCreateRequest): Observable<any>`
4. Verifica que el código compile sin errores de tipado de TypeScript.
5. Al terminar, escribe tu reporte en `docs/plans/angular-mock-aspel-report.md` bajo el título "Reporte Angular Fase 01".
```

---

## 🚀 FASE 02: Creación de Pantallas (Componentes UI)
**Objetivo:** Crear el Dashboard de consulta y el Formulario de Pólizas.

### Prompt de Ejecución (Copiar y pegar al Agente CLI)
```text
Genera los componentes visuales para administrar el Mock de Aspel.
1. En la misma carpeta `mock-aspel/`, genera los siguientes componentes (usa Standalone si el proyecto es Angular 14+):
   - `MockAspelDashboardComponent`: Una pantalla con una tabla para mostrar los Saldos y Movimientos. Debe incluir controles de paginación simples y un selector de "Ejercicio" y "Periodo".
   - `MockAspelPolizaFormComponent`: Un formulario (Reactivo o basado en Señales) para registrar una Póliza Manual. Debe tener campos para el encabezado y una tabla dinámica (FormArray o array en señal) para agregar Partidas (Debe/Haber). 
2. Inyecta el `MockAspelService` en ambos componentes para consumir los datos.
3. En el `MockAspelPolizaFormComponent`, incluye validación visual en el HTML: si la suma de los montos 'D' no es igual a la suma de los montos 'H', el botón de guardar debe deshabilitarse y mostrar un mensaje de "Póliza Descuadrada".
4. Enlaza los errores HTTP (ej. 403, 400, 422, 409) a alertas visuales simples (Toasts o divs rojos) en el template.
5. Al terminar, actualiza el reporte en `docs/plans/angular-mock-aspel-report.md` bajo "Reporte Angular Fase 02".
```

---

## 🚀 FASE 03: Enrutamiento (Routing) e Integración
**Objetivo:** Crear la ruta navegable independiente para acceder a esta nueva cara bonita.

### Prompt de Ejecución (Copiar y pegar al Agente CLI)
```text
Configura las rutas para aislar el módulo y hacerlo accesible.
1. Crea un archivo de rutas `mock-aspel.routes.ts` en la carpeta `mock-aspel/`.
2. Define dos rutas hijas:
   - `''` (vacío) que apunte al `MockAspelDashboardComponent`.
   - `'nueva-poliza'` que apunte al `MockAspelPolizaFormComponent`.
3. Inyecta este archivo de rutas en el sistema de ruteo principal de `contabilidad.luxuryapp` (busca el `app.routes.ts` o `app-routing.module.ts` de esa app específica), anidándolo bajo el path `'/mock-aspel'`.
4. Añade un botón temporal o enlace rápido en el `app.component.html` (o el layout base) de la app de contabilidad para que el usuario pueda hacer clic y navegar hacia `/mock-aspel`.
5. Ejecuta el linter o `ng build` para confirmar que el módulo de rutas no rompe la aplicación actual.
6. Al terminar, actualiza el reporte final bajo "Reporte Angular Fase 03".
```
