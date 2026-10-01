# Plan de Remediación - Módulo: Inspecciones (OperationsLuxuryApp)

**Propósito:** Guía paso a paso para agente externo.
**Objetivo:** Eliminar fallas críticas de arquitectura identificadas en la auditoría 20261001.

---

## FASE 1: Integridad de Datos (Backend) - CRÍTICO
**Bloquear destrucción de historial de auditoría.**

*   **Archivo:** `api/LuxuryApp.Application/Modules/OperationsLuxuryApp/Inspections/Services/InspectionCondominiumAssetAppService.cs`
*   **Método:** `DeleteInspectionCondominiumAssetAndRelatedDataAsync(Guid id)`
*   **Acciones del Agente:**
    1. Antes de iniciar borrado (`allImagesToDelete`), evaluar si existen `ExecutionItems` históricas:
       ```csharp
       var hasHistory = entity.InspectionReviews.SelectMany(r => r.ExecutionItems).Any();
       if (hasHistory) {
           throw new BusinessException("No se puede eliminar la configuración porque existen inspecciones ejecutadas históricamente. Contacte a soporte para inactivar el registro.", "HAS_HISTORY", 409);
       }
       ```
    2. *Alternativa:* Si el Tech Lead aprueba, implementar bandera `IsDeleted = true` (Soft Delete) en lugar del `RemoveRange` físico.

## FASE 2: Concurrencia de Estado (Backend) - ALTO
**Prevenir "Race Conditions" al cambiar estados de inspección.**

*   **Entidad:** `api/LuxuryApp.Domain/Modules/OperationsLuxuryApp/Inspections/Entities/InspectionExecution.cs`
*   **Servicios:** `CustomerInspectionAppService.cs` y `EquipmentQrLabelAppService.cs`
*   **Acciones del Agente:**
    1. Añadir control de concurrencia optimista a la entidad `InspectionExecution`:
       ```csharp
       [ConcurrencyCheck]
       public InspectionExecutionStatus Status { get; set; }
       // Opcional si se usa SQL Server:
       // [Timestamp] public byte[] RowVersion { get; set; }
       ```
    2. En los AppServices, envolver los cambios de estado en bloques `try/catch` capturando `DbUpdateConcurrencyException`, lanzando un `BusinessException("El estado fue modificado por otro usuario", "CONCURRENCY_ERROR", 409)`.

## FASE 3: Corrección Angular / Change Detection (Frontend) - MEDIO/ALTO
**Eliminar anti-patrón de ChangeDetectionStrategy.**

*   **Alcance:** Todos los archivos `*.ts` dentro de `appsweb/angular/src/app/modules/maintenance.luxuryapp/inspection/`
*   **Acciones del Agente:**
    1. Buscar y reemplazar `ChangeDetectionStrategy.Eager` por `ChangeDetectionStrategy.OnPush`.
    2. Asegurarse de inyectar/usar `ChangeDetectorRef` (marcar `markForCheck()`) O migrar a `Signals` (`signal()`, `computed()`) en componentes mutables, ya que OnPush desactiva la reactividad mágica.

## FASE 4: Fugas y "Race Conditions" de UI (Frontend) - MEDIO
**Limpiar asincronía y tipados.**

*   **Archivo:** `.../inspection-result/resultado-inspeccion.ts` (y similares que usen `effect` sin cleanup)
*   **Acciones del Agente:**
    1. Reemplazar variable tipada con `any` (`data: any`) por la Interfaz correspondiente (`InspectionResultDTO`).
    2. Modificar el `effect()` para cancelar peticiones pendientes si el `paramsSignal` cambia rápido, usando `onCleanup`:
       ```typescript
       effect((onCleanup) => {
         const abortController = new AbortController();
         onCleanup(() => abortController.abort());
         // Pasar abortController.signal a la llamada HTTP
       });
       ```
    3. *Ideal:* Migrar el fetch a RxJS (`switchMap`) o usar la API experimental `rxResource` si Angular 19+ está disponible.

## FASE 5: Riesgo OOM (Backend) - MEDIO
**Evitar carga masiva en memoria.**

*   **Archivo:** `InspectionAppService.cs`
*   **Método:** `GetAllAsync(Guid customerId)`
*   **Acciones del Agente:**
    1. Modificar método para recibir párametros de paginación (`int page, int pageSize`).
    2. Aplicar paginación a la consulta EF Core: `.Skip((page - 1) * pageSize).Take(pageSize)`.
    3. Añadir `.AsSplitQuery()` al final de la cadena IQueryable antes de `.ToListAsync()` para evitar que los múltiples `.Include()` generen un producto cartesiano gigante.
    4. Cambiar tipo de retorno a `PagedResultDTO<InspectionListItemDTO>`.

---

**Instrucción Final para Agente Externo:**
No asumas; lee `CONVENTIONS.md`. Tras cada fase terminada, ejecuta linting (backend/frontend) y pruebas correspondientes antes de avanzar a la siguiente.
