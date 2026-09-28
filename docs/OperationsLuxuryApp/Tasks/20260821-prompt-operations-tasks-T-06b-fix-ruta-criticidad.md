# TICKET T-06b — Corrección: ruta equivocada del selector de criticidad

Corrección puntual sobre T-06, ya reportado como completo. **No es un hallazgo del ejecutor —
es un error mío**: en el prompt original de T-06 cité la ruta del select-item de `priority-level`
como `api/select-items/priority-level`, apoyándome en un registro de T-02/T-03. Esa ruta no
existe. La ruta real, registrada por `SelectItemEnumEndPoints.cs` (`MapGroup("api/select-item-enum")`
+ `Map<PriorityLevel>("priority-level", ...)`), es `api/select-item-enum/priority-level`. El grupo
`api/select-items` (`SelectItemEndPoints.cs`) es un catálogo hecho a mano, sin relación, y no
tiene ninguna entrada `priority-level`.

El ejecutor implementó exactamente lo que el prompt decía — el error se propagó desde ahí, no es
un descuido suyo.

## Impacto real

`recurring-task-catalog-form.ts` → `loadCriticalities()` llama
`apiResponseS.onGetSelectItem<SelectItemDto[]>(Endpoints.SelectItems.priorityLevel)`, que resuelve
a `select-items/priority-level` — 404 en runtime. El signal `criticalities` queda vacío, el
selector de criticidad no muestra opciones, y como `criticality` tiene `Validators.required`, el
formulario completo queda permanentemente imposible de enviar.

Los tests reportados (5 passed) no lo detectan porque `recurring-task-catalog-form.spec.ts` mockea
`apiResponseS.onGetSelectItem` directamente (línea 18/26) sin verificar qué método real de
`ApiResponseService` debía usarse — el mock responde sin importar si el código llama al helper
correcto.

## Corrección

Archivo: `client/angular/src/app/apps/operations.luxuryapp/task-engine/recurring-tasks/catalog/recurring-task-catalog-form/recurring-task-catalog-form.ts`

En `loadCriticalities()`, cambia:

```typescript
const response = await this.apiResponseS.onGetSelectItem<SelectItemDto[]>(
  Endpoints.SelectItems.priorityLevel,
);
```

por:

```typescript
const response = await this.apiResponseS.onGetEnumSelectItem<SelectItemDto[]>(
  Endpoints.SelectItems.priorityLevel,
);
```

`Endpoints.SelectItems.priorityLevel = "priority-level"` (en
`select-item.endpoints.ts`) **no cambia** — el helper `onGetEnumSelectItem` ya antepone
`select-item-enum/` internamente (ver `api-response.service.ts:358-363`), igual que
`onGetSelectItem` antepone `select-items/`. Sólo se cambia el nombre del método invocado.

No toques nada más de este archivo, ni el spec, ni ningún otro archivo de T-06.

## Verificación obligatoria

Actualiza el mock del spec para que deje de estar ciego a este tipo de error: en
`recurring-task-catalog-form.spec.ts`, el objeto `apiResponseS` mockea `onGetSelectItem` pero no
`onGetEnumSelectItem` — cámbialo para mockear `onGetEnumSelectItem` (mismo valor de retorno que
hoy tiene `onGetSelectItem`), y añade una aserción en algún test existente (o uno nuevo, mínimo)
de que `apiResponseS.onGetEnumSelectItem` fue llamado con `Endpoints.SelectItems.priorityLevel`.

Corre el proyecto de tests aislado (`vitest.cobranza-nativa.config.ts`, ya usado en T-05/T-06) y
pega la salida literal con conteo de tests. Corre `node scripts/scan-mojibake.mjs` sobre el
archivo `.ts` y el `.spec.ts` tocados (ruta completa desde la raíz del repo).

## Criterio de PASO

- `loadCriticalities()` llama `onGetEnumSelectItem`, no `onGetSelectItem`.
- El spec falla si alguien revierte el cambio a `onGetSelectItem` (es decir, la aserción nueva
  realmente ejerce el método correcto, no sólo el valor de retorno).
- Nada más del componente ni del resto de T-06 se modifica.

No avances a otro ticket. Espera la auditoría.
