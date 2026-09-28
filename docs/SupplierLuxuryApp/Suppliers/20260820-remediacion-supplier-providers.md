# Plan de Remediación — SupplierLuxuryApp / Provider

**Fecha:** 2026-08-20
**Autor:** Auditoría `docs/reporte_maestro/modulos/20260820-auditoria-supplier-provider.md`
**Estado:** Borrador para aprobación de Tech Lead
**Alcance:** Ítems del plan de remediación que requieren decisión de negocio /
migración formal (Reglas Universales 7 y 8 de CONVENTIONS.md).

---

## 1. Acoplamiento de DTOs de otros módulos (P1 - ALTO)

### Contexto
`ProviderAppService` consume DTOs que viven en otros dominios:

| DTO | Dueño actual | Usado en Provider para |
|---|---|---|
| `ProviderIndexDTO` | `ReclutamientoLuxuryApp/Reclutamiento/CustomerProvider` | `ListProviderIndexDTOAsync`, `BuscarPorCategoriaAsync` |
| `BusquedaProveedorDTO` | `ReclutamientoLuxuryApp/Reclutamiento/CustomerProvider` | listados paginados |
| `ProviderIndexDTOCategoriaDTO` | `ReclutamientoLuxuryApp/Reclutamiento/CustomerProvider` | mapper (`ProviderMapper`) |
| `ValidarRfcDTO` | `AuthLuxuryApp/Auth` | `ValidarRfcAsync` |

Esto rompe la frontera de módulo y la regla "no duplicar / no acoplar"
(CONVENTIONS §4 / Reglas Universales 3-4). Un cambio en esos DTOs rompe
Supplier sin aviso.

### Opciones (elegir una)
- **A. Promover a hub compartido:** mover los DTOs a
  `api/LuxuryApp.Application/DTOs/` (o `Shared`) y actualizar las referencias en
  Reclutamiento y Auth. Centraliza la fuente única.
  - Impacto: afecta Reclutamiento y Auth (requiere re-test de esos módulos).
- **B. Copiar locales (1 archivo = 1 DTO):** duplicar los DTOs en
  `Provider/DTOs/` con nombres locales.
  - Impacto: viola "no duplicar" si Reclutamiento sigue usando los suyos; genera
    dos fuentes de verdad. **No recomendado** salvo que sean DTOs de salida
    distintos.

### Recomendación
Opción A (hub compartido) con `GuidIdEntityDTO` donde aplique (§6.1). Requiere:
1. Decisión de Tech Lead sobre ubicación del hub.
2. Plan de migración con re-test de Reclutamiento y Auth.
3. Actualizar `CONVENTIONS.md` / docs si se crea nuevo namespace de DTOs.

### Criterios de aceptación
- [ ] `Provider/DTOs/` contiene los DTOs que usa el módulo (o apuntan al hub).
- [ ] Cero referencias a `ReclutamientoLuxuryApp`/`AuthLuxuryApp` desde `Provider/`.
- [ ] Build de `LuxuryApp.Application` y tests de Reclutamiento/Auth en verde.

---

## 2. Regla de Negocio de borrado y magic number 109 (P2 - MEDIO)

### Contexto
`DeleteAsync` (`ProviderAppService.cs`) contiene bucles comentados con
`// item.ProviderId = 109; // TODO: USAR EL GUID CORRESPONDIENTE` para
`CatalogoGastosFijos`, `EntradaProducto` y `ContratoPoliza`. Hoy el borrado solo
elimina `CategoryProvider` y `QualificationProvider`, dejando referencias
colgando en otros módulos.

Además, en el frontend `provider-list.html:183` existe `item.id != 109`, que
**siempre es verdadero** porque `item.id` es un `Guid` (string) y `109` es un
`number` → comparación sin sentido (bug). El `109` parece un id de proveedor
"sistema" hardcodeado y obsoleto.

### Decisión requerida (Tech Lead / Dueño de negocio)
¿Qué debe pasar al eliminar un proveedor con referencias?
- **Opción 1 (bloquear):** si existe `CatalogoGastosFijos`/`EntradaProducto`/
  `ContratoPoliza` asociado, rechazar con `BusinessException` claro.
- **Opción 2 (reasignar):** migrar las referencias a un proveedor "sistema"
  real (GUID, no `109`). Definir ese GUID en un catálogo/constante.

### Recomendación
Opción 1 (bloquear) por ser la menos destructiva y no requerir entidad
"sistema" inventada. Eliminar el TODO `109` y el `item.id != 109` del frontend
(reescribir esa guarda con la regla de negocio real, p.ej. ocultar edición para
proveedores marcados `Sistema = true` vía flag de entidad, no por id mágico).

### Criterios de aceptación
- [ ] RN de borrado documentada y aplicada (bloquear o reasignar).
- [ ] Cero `109` / números mágicos en backend y frontend.
- [ ] Prueba de borrado con referencias (positiva/negativa).

---

## 3. Pendientes menores (P3 - BAJO, ejecutables sin aprobación)

- Tipado `any` masivo en `provider-list`, `employee-provider-form`,
  `provider-card` → tipar con `BusquedaProveedor`/`ProviderDTO`.
- `employee-provider-form.ts` sigue en `Eager` (sus datos vienen de promesas con
  asignaciones planas; requiere conversión a señales para `OnPush` seguro).
- Typos: `NameCotegory` (propiedad de entidad), `EvalueNull` (método).
- Revisar `DisableAntiforgery()` en create/update (¿mitigación CSRF alterna?).
