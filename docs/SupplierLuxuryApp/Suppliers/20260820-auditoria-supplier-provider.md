# Auditoria Completa - SupplierLuxuryApp / Provider

**Fecha:** 2026-08-20
**Estado:** Requiere plan de remediacion
**Modulo:** `SupplierLuxuryApp / Provider`
**Backend:** `api/LuxuryApp.Application/Moduls/SupplierLuxuryApp/Provider`
**Frontend:** `client/angular/src/app/apps/supplier.luxuryapp/provider`
**Documento rector:** `CONVENTIONS.md` + `conventions/*`

---

## Resumen ejecutivo

El modulo `Provider` (proveedores del dominio Supplier) es funcionalmente amplio
y su frontend usa correctamente los `SelectItem` centralizados y `app-icon` con
`material-symbols-light` (0 mojibake, 0 iconos fuera de catalogo). Sin embargo
presenta **un hallazgo critico de seguridad** y varias desviaciones estructurales
respecto al sistema rector:

- **CRITICO:** la validacion multi-tenant de `ChangeStateAsync` esta comentada,
  y el endpoint `change-state` solo exige autenticacion (no rol ni tenant) →
  cualquier usuario autenticado puede cambiar el estado de cualquier proveedor.
- El `README.md` del modulo describe un modulo distinto (`LuxuryApp.Providers`,
  SendEmailService, etc.), documentacion enganada.
- El modulo acopla DTOs de otros dominios (Reclutamiento, Auth) en lugar de
  poseerlos localmente.
- Codigo muerto (`ICategoryProviderAppService`/`CategoryProviderAppService`),
  logica de borrado incompleta (TODO `ProviderId = 109`), rutas de archivo
  construidas a mano y tipado `any`/`Eager` extendido en frontend.

Resultado formal de este corte: **requiere plan de remediacion**.

---

## Alcance auditado

- Backend `Provider/`: `EndPoints/ProvidersEndPoints.cs`, `Interfaces/*`,
  `Services/ProviderAppService.cs`, `Services/CategoryProviderAppService.cs`,
  `Mapping/ProviderMapper.cs`, `DTOs/*`, `README.md`, `Docs/Email/*`.
- Frontend `provider/`: `provider-list.*`, `proveedor-form.*`,
  `provider-card.*`, `provider-use.*`, `employee-provider-form.*`.
- Referencias cruzadas a DTOs de `ReclutamientoLuxuryApp/CustomerProvider` y
  `AuthLuxuryApp/Auth`.

No se modifico codigo durante esta auditoria.

---

## Reglas criticas detectadas (CONVENTIONS.md)

- §6.1 / Nivel 3 Seguridad: toda operacion sensible debe validar tenant y rol;
  no se comenta ni se omite la autorizacion.
- §6.1: SELECTs de entidades/datos dinamicos se centralizan en
  `SelectItemEndPoints` (hub unico), no en servicios de dominio.
- §4.7: el README del modulo debe describir EL modulo, no otro.
- Reglas universales 3/4: no duplicar logica ni acoplar DTOs de otros modulos.
- §5.9.1: las URLs de archivo se resuelven con `IFileReadPathService`, no a mano.

---

## Hallazgos

### 1. CRITICO - Autorizacion multi-tenant comentada en ChangeStateAsync

- Evidencia:
  `api/LuxuryApp.Application/Moduls/SupplierLuxuryApp/Provider/Services/ProviderAppService.cs:276-298`
  (el bloque de validacion esta en comentario en `:282-285`)
- Endpoint afectado:
  `EndPoints/ProvidersEndPoints.cs:19-21` → `change-state/{providerId:guid}/{state:bool}`
  solo lleva `.RequireAuthorization()` (autenticado, sin rol ni tenant).
- Hallazgo:
  `ChangeStateAsync` no valida `CustomerId` ni rol; el metodo recibe
  `providerId`/`state` sin `customerId`. El frontend restringe la accion a
  `SuperUsuario` por UI, pero el API no tiene defensa en profundidad.
- Impacto: cualquier usuario autenticado puede activar/inactivar proveedores de
  cualquier cliente (fuga multi-tenant + escalada de privilegios por omision).
- Riesgo: ALTO (critico de seguridad, Nivel 3).
- Recomendacion: restaurar la validacion multi-tenant (igual patron que
  `DeleteAsync`/`AutorizarAsync`) y, si aplica, exigir rol en el endpoint.
- Estatus: abierto

### 2. ALTO - README.md describe un modulo distinto

- Evidencia:
  `api/LuxuryApp.Application/Moduls/SupplierLuxuryApp/Provider/README.md:1-77`
- Hallazgo: el README documenta "LuxuryApp.Providers" (SendEmailService,
  ImageStorageService, GeolocationService, etc.), infraestructura que NO vive en
  esta carpeta; no menciona proveedores (RFC, categorias, autorizacion).
- Impacto: documentacion enganada; rompe el contrato de `docs/modulos` (§4.7).
- Riesgo: medio-alto (desinformacion para onboarding y auditoria).
- Recomendacion: reescribir el README con la estructura Nivel 1 obligatoria
  (proposito, endpoints, actores, RN, validaciones, permisos).
- Estatus: abierto

### 3. ALTO - Acoplamiento de DTOs de otros modulos

- Evidencia:
  `ProviderAppService.cs` referencia `ProviderIndexDTO`, `BusquedaProveedorDTO`,
  `ProviderIndexDTOCategoriaDTO` (definidos en
  `ReclutamientoLuxuryApp/Reclutamiento/CustomerProvider/DTOs/*`) y
  `ValidarRfcDTO` (definido en `AuthLuxuryApp/Auth/DTOs/ValidarRfcDTO.cs`).
- Hallazgo: el modulo Supplier consumo DTOs propiedad de Reclutamiento y Auth,
  rompiendo la frontera de modulo y la regla "no duplicar / no acoplar".
- Impacto: un cambio en esos DTOs rompe Supplier sin aviso; mezcla de dominios.
- Riesgo: alto (deriva de contratos).
- Recomendacion: traer los DTOs necesarios al `DTOs/` local de Provider (1
  archivo = 1 DTO) o promoverlos a un hub compartido explicito.
- Estatus: abierto

### 4. MEDIO - Codigo muerto: ICategoryProviderAppService / CategoryProviderAppService

- Evidencia:
  `Interfaces/ICategoryProviderAppService.cs` (solo comentario, 0 metodos)
  `Services/CategoryProviderAppService.cs` (clase vacia, 0 metodos)
- Hallazgo: interfaz y servicio sin implementacion ni usos.
- Recomendacion: eliminar o implementar si se requiere.
- Estatus: abierto

### 5. MEDIO - Endpoint/SelectItem de dominio (GetCategoryAsync)

- Evidencia:
  `ProviderAppService.cs:90-108` devuelve `CategoriasproviderSelectDTO`
  construido manualmente; `ProvidersEndPoints.cs:31-33` expone `get-category`.
- Hallazgo: el frontend ya consume el catalogo centralizado
  (`Endpoints.SelectItems.categories`, ver `proveedor-form.ts:185-197`), por lo
  que `get-category` probablemente es muerto y, ademas, construye un "select" en
  el dominio en lugar del hub central (`SelectItemEndPoints`). Nombre
  `CategoriasproviderSelectDTO` tambien viola PascalCase.
- Recomendacion: confirmar uso; si es muerto, eliminar; en otro caso migrar al
  hub central de SelectItems.
- Estatus: abierto / revisar

### 6. MEDIO - Rutas de archivo construidas a mano

- Evidencia:
  `ProviderAppService.cs:488` `ConstanciaFiscalPath = $"providers/constancia-fiscal/{...}"`
  `ProviderAppService.cs:597` `"providers/constancia-fiscal/" + x.ConstanciaFiscal`
- Hallazgo: la ruta se concatena en texto en lugar de usar
  `IFileReadPathService.GetSecureFileUrl()` (§5.9.1).
- Recomendacion: usar el servicio de rutas seguras.
- Estatus: abierto

### 7. MEDIO - Logica de borrado incompleta (TODO ProviderId = 109)

- Evidencia:
  `ProviderAppService.cs:318-346` (bucles con `// item.ProviderId = 109; // TODO`)
- Hallazgo: al eliminar un proveedor no se reasignan las relaciones en
  `CatalogoGastosFijos`, `EntradaProducto`, `ContratoPoliza`; queda codigo
  comentado y magic number `109`.
- Recomendacion: definir la RN de borrado (reasignar a proveedor sistema o
  bloquear si tiene referencias) y eliminar el TODO.
- Estatus: abierto

### 8. MEDIO (Frontend) - Uso de ionicons en componente web

- Evidencia:
  `provider-list.ts:14-15,168` `addIcons({ storefrontOutline })` desde `ionicons`
- Hallazgo: `ion-icon`/ionicons solo se permite en `shared/ui/mobile/**`
  (CONVENTIONS §5.5). El componente usa `<app-icon>` en plantilla, asi que el
  `addIcons` queda sin uso real en una feature web.
- Recomendacion: remover la importacion/registro de ionicons; usar `app-icon`
  con el catalogo.
- Estatus: abierto

### 9. MEDIO (Frontend) - Tipado `any` y doble carga de datos

- Evidencia:
  `provider-list.ts` usa `result: any`, `event: any`, `data: any` en ~10 metodos;
  `provider-list.ts:167-172` `constructor` ejecuta `effect(() => this.onLoadData())`
  SIN dependencia de senal, y `ngOnInit` tambien llama `onLoadData` → carga doble.
  `provider-card.ts:29-31 providerId: any; model: any`.
- Hallazgo: perdida de tipado y efecto mal usado (deberia depender de una
  senal o simplemente llamarse en `ngOnInit`).
- Recomendacion: tipar con `BusquedaProveedor`/`ProviderDTO`, y mover la carga a
  `ngOnInit` (sin `effect` sin senal).
- Estatus: abierto

### 10. BAJO/MEDIO (Frontend) - ChangeDetectionStrategy.Eager en todos los componentes

- Evidencia: `provider-list.ts:59`, `proveedor-form.ts:73`, `provider-card.ts:21`,
  `provider-use.ts:19`, `employee-provider-form.ts:43` usan `Eager`.
- Hallazgo: el sistema rector promueve `OnPush` (senales). `Eager` es una
  desviacion de rendimiento.
- Recomendacion: migrar a `OnPush` donde sea viable.
- Estatus: abierto

### 11. BAJO - Typos / magic numbers / duplicados

- Evidencia:
  `ProviderAppService.cs:617 y :619` `CountCalendarioMaestroProvider` se cuenta
  dos veces (619 duplica 617).
  `ProviderAppService.cs:632` metodo `EvalueNull` (typo de Evaluate) y manejo de
  string `"null"` venido del frontend (oler a serializacion).
  Propiedad de entidad `NameCotegory` (typo) repetida en mapeos/filtros.
  `provider-list.html:183` `item.id != 109` (magic number, mismo `109` de los
  TODO del backend).
  Comentarios con mojibake de ortografia: "Categoróas", "Túcnica", "bósqueda",
  "pógina" (no detectado por scanner porque no es mojibake real, pero es
  corrupcion de ortografia en comentarios/UI).
- Recomendacion: limpiar duplicados, renombrar con plan de migracion, quitar
  magic numbers.
- Estatus: abierto

---

## Matriz de Reglas de Negocio (4 niveles)

| Nivel | RN | Estado | Evidencia |
|---|---|---|---|
| 1 Invariante | Un proveedor pertenece a un solo CustomerId (multi-tenant) | CUMPLIDO en la mayoria; ROTO en ChangeState | `ProviderAppService.cs:276-298` |
| 2 Flujo | Cambio de estado (Activo/Inactivo) y Autorizar son transiciones explicitas | CUMPLIDO (ChangeState, Autorizar) | `:276`, `:500` |
| 2 Flujo | RFC unico por CustomerId al crear | CUMPLIDO | `:152` |
| 3 Seguridad | ChangeState requiere tenant+rol validados | ROTO (comentado) | `:282-285` |
| 3 Seguridad | Delete requiere tenant validado | CUMPLIDO | `:306-309` |
| 3 Seguridad | Migrate requiere SuperUsuario | CUMPLIDO | `ProvidersEndPoints.cs:67` |
| 4 Validacion | RFC, banco, datos de contacto requeridos en alta | CUMPLIDO (front) | `proveedor-form.ts:114-135` |
| 4 Validacion | Constancia fiscal requerida en alta (no edicion) | CUMPLIDO | `proveedor-form.ts:159` |

---

## Matriz de permisos (endpoint x rol)

| Endpoint | Auth | Rol minimo (UI) | Backend enforce |
|---|---|---|---|
| GET id | Auth | - | tenant check OK |
| PUT change-state | Auth (solo auth) | SuperUsuario (UI) | ❌ SIN check |
| GET validar-rfc | Auth | - | tenant check OK |
| GET get-all | Auth | - | tenant check OK |
| GET get-category | Auth | - | sin tenant (catalogo global) |
| POST "" (create) | Auth + DisableAntiforgery | rolAuth | tenant check OK |
| PUT "{id}" (update) | Auth + DisableAntiforgery | rolAuth | tenant check OK |
| DELETE "{id}" | Auth | SuperUsuario (UI) | tenant check OK |
| GET coincidencias | Auth | - | sin tenant en query |
| GET list / buscar | Auth | - | tenant check OK |
| PUT autorizar | Auth | SuperUsuario (UI) | tenant check OK |
| POST migrate | Auth + Roles=SuperUsuario | - | ✅ enforce rol |

Nota: `DisableAntiforgery()` en create/update (`:37`,`:42`) desactiva CSRF;
confirmar si es intencional para `multipart/form-data` y si hay otra mitigacion.

---

## Validaciones Front vs Back

| Concepto | Front | Back | Coherencia |
|---|---|---|---|
| Catalogo categorias | `SelectItems.categories` (centralizado) ✅ | `get-category` (dominio) ⚠️ | Divergente (back redundante) |
| Catalogo bancos | `SelectItems.bank` ✅ | hub central ✅ | OK |
| Tipo servicio | `EnumSelectItems.serviceType` ✅ | `GetDisplayName()` ✅ | OK |
| Cambio estado | UI Solo SuperUsuario | API sin check ❌ | ROTA |
| Iconos | `app-icon` + `material-symbols-light` ✅ (0 fuera catalogo) | n/a | OK |
| Mojibake | 0 (scan) | 0 | OK |
| Autorizacion | `validateRole([...])` por accion | depende solo de UI | RIESGO (back no enforce) |

---

## Plan de remediacion (priorizado)

1. **P0 - Seguridad:** restaurar validacion multi-tenant en `ChangeStateAsync` y
   exigir rol en `change-state` (backenforce, no solo UI). (`ProviderAppService.cs:282-285`, `ProvidersEndPoints.cs:19`)
2. **P1 - Documentacion:** reescribir `README.md` del modulo (Nivel 1 §4.7).
3. **P1 - Frontera:** localizar/mover DTOs `ProviderIndexDTO`,
   `BusquedaProveedorDTO`, `ProviderIndexDTOCategoriaDTO`, `ValidarRfcDTO` al
   `DTOs/` de Provider o hub compartido.
4. **P2 - Limpieza:** eliminar `ICategoryProviderAppService`/
   `CategoryProviderAppService` y `get-category` si es muerto.
5. **P2 - Archivos:** usar `IFileReadPathService.GetSecureFileUrl()` en
   `ConstanciaFiscalPath`.
6. **P2 - Borrado:** definir RN de eliminacion y quitar TODO `109`.
7. **P3 - Frontend:** quitar `ionicons`, tipar `any`, corregir `effect` doble,
   migrar a `OnPush`.
8. **P3 - Calidad:** limpiar typos/duplicados/magic numbers; revisar
   `DisableAntiforgery`.

---

## Checklist de validacion

- [ ] `ChangeStateAsync` valida tenant+rol y endpoint lo exige.
- [ ] `README.md` describe el modulo Provider real.
- [ ] DTOs de Supplier definidos localmente (1 archivo = 1 DTO).
- [ ] Sin codigo muerto (interfaz/servicio/categoria).
- [ ] Rutas de archivo via `IFileReadPathService`.
- [ ] `ionicons` removido de feature web; `app-icon` en uso.
- [ ] `npm run audit:icon-names` y `node scripts/scan-mojibake.mjs` en 0.
- [ ] Componentes en `OnPush` con tipado fuerte.
