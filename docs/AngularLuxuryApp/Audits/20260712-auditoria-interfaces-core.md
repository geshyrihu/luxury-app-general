# Reporte: Ubicación de tipos en `client/angular/src/app/core/interfaces`

> 📅 Fecha: 2026-07-12 · 🛡️ Estado: Diagnóstico (no ejecutado)
> 📂 Alcance: `D:\repos\luxuryapp-api\client\angular\src\app\core\interfaces`
> 📚 Referencia de convenciones: `CONVENTIONS.md §7` (Nombrado), `§2.7` (sin `any`), `§1` (IDs Guid)

---

## Ruta: 📂 Documentación > 🧩 Auditoría de Tipos

### 0. Resumen ejecutivo

Se revisaron **73 archivos** en `core/interfaces` (más una subcarpeta `recurring-tasks/` con 11 archivos).
El diagnóstico arroja **3 tipos de problemas**:

| # | Problema | Impacto | Gravedad |
|---|----------|---------|----------|
| P1 | Tipos de dominio (medidores, inventario, SAT, tareas, customers…) viviendo en `core/interfaces` en vez de `<feature>/interfaces/` | Viola §7 | 🔴 Alta (convención) |
| P2 | Tipado/naming incorrecto: `any`, typos, enums agrupados, `.model.ts` presente (sufijo ya **eliminado** de §7) | Viola §7/§2.7/§1 | 🟡 Media |
| P3 | Riesgo de ruptura al mover | — | 🟢 Bajo (ver §4) |

**Hallazgo clave de acoplamiento (§4):** solo **1 import** en todo el repositorio referencia `core/interfaces`
(`human-resources.routing.ts` → `ApplicationRole` desde `asp-net-roles.enum`). El resto de features ya importa
sus tipos desde sus propias carpetas `interfaces/`. Por tanto, **el blast radius de mover/eliminar es bajo**,
pero cada archivo debe verificarse individualmente antes de borrar (§5).

---

### 1. Convenciones aplicables

- **§7 — Ubicación:** *"tipos del feature en `<feature>/interfaces/` (la carpeta `models/` está prohibida para tipos nuevos)."*
- **§7 — Sufijos (actualizado):** `.interface.ts` (datos), `.dto.ts` (transporte API), `.enum.ts`, `.pipe.ts`, `.helper.ts`. **`.model.ts` eliminado**: migrar a `.interface.ts` o `.dto.ts` según intención.
- **§7 — Un tipo por archivo:** prohibido agrupar varios enums/DTOs en un `.ts`.
- **§7 — Sin prefijo húngaro:** enums sin `E` (`RoleType`, `Department`).
- **§2.7 — Tipado estricto:** `prohibido any`, `strict: true`.
- **§1 — IDs:** siempre `Guid` (en frontend `string`).

---

### 2. Inventario clasificado

#### 2.A ✅ Permanece en `core/interfaces` (kernel shared)
Tipos transversales reutilizados por múltiples apps.

```
api-response.model.ts            menu.model.ts                 menu-option.interface.ts
notification.interface.ts        toast.interface.ts
dialog-size.enum.ts             button-type.enum.ts          tooltip-placement.enum.ts   sweetalert-icon.enum.ts
chart-data.interface.ts         chart-data-set.interface.ts  chart-type.enum.ts          data-set.interface.ts
select-item.dto.ts              selected-file.interface.ts   upload-event.interface.ts
user-card.interface.ts          user-info.interface.ts
auth-login.dto.ts               auth-user-token.dto.ts      auth-validate-token.dto.ts  auth-refresh-token-request.model.ts
change-password.interface.ts    reset-password.interface.ts
fechas-filtro.interface.ts      filter-ticket.interface.ts
paises.enum.ts                  role-type.enum.ts           recurrence.enum.ts          roles.interface.ts
asp-net-roles.enum.ts  (⚠️ ver §4: único con import externo)
```

#### 2.B 🔴 Debe moverse a `<feature>/interfaces/`

| Archivo(s) | Destino sugerido (app portal) |
|------------|-------------------------------|
| `medidor.interface.ts`, `medidor-categoria.interface.ts` | `mantenimiento.luxuryapp/.../interfaces/` |
| `inventario-extintor`, `inventario-hidrante`, `inventario-estacion-manual`, `inventario-detector-humo`, `inventario-llave-dto.interface.ts` | `mantenimiento.luxuryapp/inventario/interfaces/` |
| `sat-funding.interface.ts`, `sat-funding-detail.interface.ts`, `use-cfdi.interface.ts`, `tipo-gasto.enum.ts`, `cedula-presupuestal-detalle-form.interface.ts`, `presupuesto-add.interface.ts`, `area-minutas-detalles.enum.ts`, `autorizacion-cuadro-comparativo.enum.ts` | `contabilidad.luxuryapp/.../interfaces/` |
| `recurring-tasks/*` (11 archivos) | `operations.luxuryapp/tareas/interfaces/` (o feature `tasks`) |
| `radio-comunicacion.interface.ts`, `radio-comunicacion-form.interface.ts`, `meeting-index.interface.ts` | `operations.luxuryapp/.../interfaces/` |
| `customer.interface.ts`, `customer-form.interface.ts`, `add-customer-permiso-to-user.interface.ts`, `list-condomino.interface.ts` | `admin.luxuryapp` / `resident.luxuryapp` según rol |
| `property.interface.ts`, `property-occupant.interface.ts` | `resident.luxuryapp/.../interfaces/` |
| `busqueda-proveedor.interface.ts`, `busqueda-categoria.interface.ts`, `provider-support-list.interface.ts`, `product-list-form.interface.ts`, `product-select-item.interface.ts`, `category.interface.ts`, `category-form.interface.ts` | `supplier.luxuryapp/.../interfaces/` |
| `ficha-tecnica-activo.interface.ts`, `almacen.model.ts` | `mantenimiento.luxuryapp/activos/interfaces/` |
| `comite-vigilancia.interface.ts` | `direccion.luxuryapp/.../interfaces/` |
| `ai-knowledge-base.dto.ts`, `migration-verification-log.interface.ts` | `system.luxuryapp/.../interfaces/` |
| `permission.dto.ts`, `application-user.dto.ts` | `admin.luxuryapp` / `auth.luxuryapp` |
| `destinatarios-mail-reporte.interface.ts`, `email-data-form.interface.ts` | `shared` o `system.luxuryapp/notificaciones` |
| `update-description.interface.ts` | confirmar feature propietaria |

> ⚠️ El destino exacto de cada archivo debe confirmarse contra la estructura real de `apps/<dominio>.luxuryapp/`
> (ver `CONVENTIONS.md §14.7`) antes de mover.

---

### 3. Problemas de tipado / naming (P2)

| Archivo | Problema | Corrección |
|---------|----------|------------|
| `inventario-llave-dto.interface.ts` | `id: any` (§2.7) + nombre mezcla "dto" con `.interface.ts` | `id: string` (Guid); renombrar a `inventario-llave.interface.ts` |
| `departament.enum.ts` | Typo `Departament` y valor `RecusrosHumanos` | `Department`; `RecursosHumanos` |
| `recurring-tasks/enums.model.ts` | Agrupa varios enums en un archivo (§7 "un tipo por archivo") | Separar en `*.enum.ts` individuales |
| `*.model.ts` dentro de `interfaces/` | Sufijo **eliminado** de §7; inconsistente con la regla datos/transporte | Migrar a `.interface.ts` (forma de datos) o `.dto.ts` (transporte), p.ej. `api-response.model.ts` → `api-response.dto.ts` |

---

### 4. Análisis de riesgo de ruptura (P3)

**Métrica medida (grep sobre `src/app/**/*.ts`):**
- Imports literales con la cadena `core/interfaces`: **1** → `human-resources.routing.ts:5` importa `ApplicationRole` desde `asp-net-roles.enum`.
- Imports con `interfaces/` en cualquier ruta: **3** (los otros 2 son de features que YA usan su propia carpeta `interfaces/`, ej. `legal.luxuryapp/.../interfaces/document-type.enum`).
- No existe barril `index.ts` en `core/interfaces` → no hay re-export central que amplifique el daño.

**Conclusión:** mover/eliminar `core/interfaces` tiene **blast radius pequeño**. El riesgo real no es la cantidad de imports,
sino **tipos referenciados por nombre** (ej. `Medidor` aparece 17 veces, `InventarioExtintor` 4). Esos usos pueden
importar el tipo vía ruta relativa o `import type`, por lo que **cada archivo se valida con grep del nombre del tipo antes de borrar**.

**Riesgos al mover:**
1. Imports relativos rotos (`../../../core/interfaces/x`) en los pocos consumidores.
2. Duplicados: si el tipo ya existe en la feature destino, generar conflicto de nombre.
3. Alias `@ui/*`/`@core/*`: verificar que no haya un path alias apuntando a `core/interfaces`.

---

### 5. Plan de migración (cuidadoso, por fases)

> No ejecutar en un solo paso. Cada fase termina con `ng build` en verde.

#### Fase 0 — Baseline (no destructivo)
- [ ] `node scripts/scan-mojibake.mjs client/angular/src` → "CERO mojibake".
- [ ] `ng build` en verde como punto de comparación.
- [ ] Generar lista de tipos con su conteo de referencias (grep por nombre de tipo) → tabla de "usado / no usado".

#### Fase 1 — Correcciones de tipado/namin (sin mover rutas)
- [ ] `inventario-llave-dto.interface.ts`: `id: any` → `string`; renombrar.
- [ ] `departament.enum.ts`: corregir `Department` / `RecursosHumanos`.
- [ ] `recurring-tasks/enums.model.ts`: split en `*.enum.ts`.
- [ ] Migrar `.model.ts` restantes a `.interface.ts` (datos) o `.dto.ts` (transporte), según la intención del tipo (§7 actualizado).

#### Fase 2 — Mover tipos de dominio a su feature (batch por dominio)
Para cada grupo de §2.B:
- [ ] Crear/confirmar `<feature>/interfaces/`.
- [ ] Mover archivo; actualizar imports relativos en consumidores (grep del tipo).
- [ ] Resolver duplicados si el tipo ya existe en destino.
- [ ] `ng build` tras cada grupo.

#### Fase 3 — Verificación final
- [ ] `ng build` en verde.
- [ ] `npm run audit:ui` (frontera PrimeNG/Ionic, §5).
- [ ] Re-scan mojibake.
- [ ] Grep de sanity:confirmar 0 imports a `core/interfaces` que no sean los del kernel (§2.A).

#### Fase 4 — Documentar
- [ ] Añadir a `CONVENTIONS.md §7` una nota: *"`core/interfaces` solo para tipos del kernel compartido; los tipos de dominio van en `<feature>/interfaces/`"*.

---

### 6. Criterios de éxito
- [ ] 0 archivos de dominio residuales en `core/interfaces`.
- [ ] 0 usos de `any` en la carpeta.
- [ ] 0 enums agrupados.
- [ ] `ng build` en verde tras la migración.
- [ ] Mojibake = CERO.

---

_Ruta de auditoría: 📂 `client/angular/src/app/core/interfaces` · 📚 `CONVENTIONS.md §7 / §2.7 / §1`_
