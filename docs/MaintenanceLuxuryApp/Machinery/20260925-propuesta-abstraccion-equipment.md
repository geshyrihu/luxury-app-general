# Propuesta de Abstracción — `Equipment` (MaintenanceLuxuryApp)

> **Tipo:** Análisis + propuesta. **No se aplica ningún cambio.**
> **Fecha:** 2026-09-25
> **Entidad raíz:** `Infrastructure/Data/Entities/MaintenanceLuxuryApp/Machinery/Equipment.cs`
> **Tabla:** `Equipment` · **Tenant:** sí (`ITenantEntity`, `CustomerId`)

---

## 1. Qué es hoy `Equipment`

Entidad central del inventario de un cliente. Es el "activo físico" que **todo** el
módulo de mantenimiento referencia por `MachineryId` o `EquipmentId`.

### 1.1 Propiedades y propósito de negocio

| Propiedad C#                                    | Columna                     | Tipo                | Propósito                                                 |
| :---------------------------------------------- | :-------------------------- | :------------------ | :-------------------------------------------------------- |
| `CustomerId` / `Customer`                       | `CustomerId`                | `Guid`              | Dueño del activo (tenant).                                |
| `ApplicationUserId` / `ApplicationUser`         | `UserId`                    | `string`            | Responsable del equipo.                                   |
| `EquipoClasificacionId` / `EquipoClasificacion` | `EquipmentClassificationId` | `Guid?`             | Clasificación ("sistema": bombas, elevadores…).           |
| `NameMachinery`                                 | `Name`                      | `string`            | Nombre del equipo.                                        |
| `Brand`                                         | `Brand`                     | `string`            | Marca.                                                    |
| `Model`                                         | `Model`                     | `string`            | Modelo.                                                   |
| `Serie`                                         | `SerialNumber`              | `string`            | Número de serie.                                          |
| `DateOfPurchase`                                | `InstallationDate`          | `DateOnly`          | Compra/instalación.                                       |
| `Ubication`                                     | `Location`                  | `string`            | Ubicación física.                                         |
| `State`                                         | `State`                     | `State`             | Estado (Activo/Inactivo…).                                |
| `InventoryCategory`                             | `InventoryCategory`         | `InventoryCategory` | Categoría de inventario (Equipos, Amenidades, Sistemas…). |
| `TechnicalSpecifications`                       | `TechnicalSpecifications`   | `string` (500)      | Ficha técnica.                                            |
| `PhotoPath`                                     | `PhotoPath`                 | `string`            | Foto principal.                                           |
| `Observations`                                  | `Observations`              | `string` (255)      | Observaciones.                                            |

### 1.2 Navegaciones (hijos)

- `MaintenanceCalendars` — programación de mantenimiento (mes, recurrencia, proveedor, precio).
- `EquipmentInspectionDefinitions` — plantillas de inspección.
- `EquipmentInspectionExecutions` — historial de inspecciones.
- `EquipmentQrLabels` — etiquetas QR.

### 1.3 Quién depende de `Equipment` (FK `MachineryId`)

| Entidad                                          | Tabla                     | Relación                            |
| :----------------------------------------------- | :------------------------ | :---------------------------------- |
| `MaintenanceCalendar`                            | `MaintenanceCalendars`    | Programa de mantenimiento.          |
| `MaintenanceLog` (`BitacoraEquipoBase` derivada) | `MaintenanceLogs`         | Bitácora de mantenimiento.          |
| `EquipmentInspectionDefinition`                  | —                         | Plantillas de inspección.           |
| `EquipmentInspectionExecution`                   | —                         | Ejecuciones de inspección.          |
| `EquipmentQrLabel`                               | —                         | QR del equipo.                      |
| `EquipmentDocument`                              | `EquipmentDocuments`      | Documentos (manuales).              |
| `MasterCalendarEquipment`                        | `MasterCalendarEquipment` | Equipo del calendario maestro.      |
| `ElevatorsEmergencyCall`                         | `ElevatorsEmergencyCall`  | Llamadas de emergencia de elevador. |
| `ElevatorSparePartsChange`                       | —                         | Cambios de refacciones.             |
| `ServiceOrder`                                   | `ServiceOrders`           | Órdenes de servicio.                |
| `LightingStock`, `PaintStock`                    | inventario                | Stock ligado a equipo.              |

### 1.4 Configuración EF

- No existe un `EquipmentConfiguration` dedicado. La entidad se configura por **anotaciones**
  (`[Table]`, `[Column]`, `[Display]`) y por relaciones detectadas por convención.
- Fluent API específica solo para las **inspecciones** en
  `Modules/MaintenanceLuxuryApp/Persistence/Persistence/Maintenance/EquipmentInspectionsConfiguration.cs`.

---

## 2. Inventario de "cosas inventariables" en el módulo (mapa de solapamiento)

El módulo tiene **varios inventarios paralelos** que comparten la idea de "activo con
ubicación, estado y bitácora" pero **no** comparten la entidad `Equipment`:

| Inventario                   | Entidad(es)                                             | ¿Usa `Equipment`? | Campos repetidos frente a `Equipment`                               |
| :--------------------------- | :------------------------------------------------------ | :---------------- | :------------------------------------------------------------------ |
| Equipos generales            | `Equipment`                                             | — (raíz)          | —                                                                   |
| Extintores                   | `FireInspectionPeriodExtinguisher`, `BitacoraExtintor`  | No                | Ubicación, estado, fecha, observaciones                             |
| Hidrantes                    | `FireInspectionPeriodHydrant`, `BitacoraHidrante`       | No                | idem                                                                |
| Detectores de humo           | `FireInspectionPeriodDetector`, `BitacoraDetectorHumo`  | No                | idem                                                                |
| Estaciones manuales          | `FireInspectionPeriodStation`, `BitacoraEstacionManual` | No                | idem                                                                |
| Piscinas                     | `Pool`                                                  | No                | `CustomerId`, `ApplicationUserId`, `Name`, `Ubication`, `PathImage` |
| Medidores                    | `Meter`                                                 | No                | `CustomerId`, `NumeroMedidor`, `Descripcion`                        |
| Activos de catálogo          | `CatalogAsset`                                          | No                | `Folio`, `Name`, `AssetCategory`                                    |
| Equipo de calendario maestro | `MasterCalendarEquipment`                               | Parcial           | `EquipoClasificacionId`, `NombreEquipo`                             |

**Observación clave:** las **bitácoras** ya comparten una base abstracta
(`BitacoraEquipoBase`) y las **inspecciones de fuego** comparten
`FireCycleInspectionBase` / `FireInspectionPeriodItemBase`. Es decir, ya hay precedente de
abstracción por herencia en el módulo — pero **solo dentro de su propio subdominio**.

---

## 3. Problemas / oportunidades detectados

1. **Inventarios desconectados.** Extintores, hidrantes, detectores, estaciones y piscinas
   no son `Equipment`, así que no tienen QR, inspecciones ni órdenes de servicio sin trabajo extra.
2. **Atributos duplicados.** `Pool`, `Meter`, `CatalogAsset` repiten `CustomerId`,
   `Name`, `Ubication`, `ImagePath`, `ApplicationUserId`.
3. **Sin configuración EF central.** `Equipment` depende de convenciones; agregar reglas
   (índices, longitudes, precisión) exige tocar el `DbContext` o crear configuración.
4. **Naming mixto.** Columnas en inglés con propiedades en español (`Ubication`,
   `NameMachinery`, `Serie`) y namespaces alternos (`MaintenanceLuxuryApp` vs `Mantenimiento`).
5. **`MaintenanceLog` sin `CustomerId`** propio (depende del equipo), mientras
   `BitacoraEquipoBase` sí lo tiene → inconsistencia entre bitácoras.

---

## 4. Opciones de abstracción (solo propuesta, con seguridad de datos)

> Criterio de seguridad: **ninguna opción requiere migración destructiva**. Todas son
> aditivas (nuevas interfaces/columnas nullable o tablas nuevas). Ninguna renombra ni
> elimina columnas existentes.

### Opción A — Contratos de interfaz (mínima, cero migración) ⭐ recomendada para empezar

Extraer **interfaces** que describan lo que ya existe, sin tocar tablas:

- `IAsset` (o `IEquipmentLike`): `Id`, `CustomerId`, `Name`, `Location`, `IsActive`, `PhotoPath`.
- `ITenantOwned`: `CustomerId` (ya existe `ITenantEntity`).

**Impacto en datos:** cero. Solo se implementa la interfaz en las entidades existentes
(`Equipment`, `Pool`, `Meter`, `CatalogAsset`) y se usan servicios genéricos que aceptan `IAsset`.

**Ventajas:** inmediato, sin migración, habilita servicios compartidos (listados, búsqueda,
QR, adjuntos) por contrato.
**Límites:** no unifica tablas; las consultas EF siguen por tabla concreta.

### Opción B — Tabla de activos unificada (TPT/TPC) con `Equipment` como base

Convertir `Equipment` en **raíz de herencia** y que extintores/hidrantes/etc. hereden de ella
con estrategia **TPT** (tabla por tipo) o **TPC** (tabla por clase concreta).

- `Equipment` (base): campos comunes.
- `FireExtinguisher : Equipment`, `Hydrant : Equipment`, `Pool : Equipment` (nuevas tablas hijas con solo su delta).

**Impacto en datos:** requiere migración **no destructiva** pero **compleja**: crear tablas
hijas y **reubicar** filas existentes (extintores actuales → nuevas tablas hijas) con script
de copia verificada + rollback. No borra origen hasta validar.
**Ventajas:** un solo inventario, QR/inspección/OS para todo.
**Riesgos:** alto acoplamiento; cambio transversal; requiere FASE 0 y plan de migración.

### Opción C — Entidad puente `AssetLink` (media, aditiva)

Nueva tabla `AssetLinks` que **relaciona** cualquier "cosa" con servicios transversales
(QR, inspección, OS, documentos) sin unificar herencia:

```
AssetLink(Id, CustomerId, AssetType, AssetId, ...)
```

**Impacto en datos:** cero destructivo (tabla nueva + backfill opcional).
**Ventajas:** permite dar QR/inspección a extintores/hidrantes sin migrar sus tablas.
**Límites:** hay que resolver el polimorfismo (`AssetType` + `AssetId`) en consultas.

### Opción D — Configuración EF centralizada (higiene, sin cambiar modelo)

Crear `EquipmentConfiguration : IEntityTypeConfiguration<Equipment>` con índices
(`CustomerId + State + InventoryCategory`), longitudes y precisión explícitas; mover
`Equipment` y vecinos a un namespace/ carpeta consistente.

**Impacto en datos:** **cero** si solo se declaran longitudes/índices ya implícitos.
Requiere migración **aditiva** si se agregan índices (mejora performance, sin pérdida).
**Ventajas:** base limpia antes de crecer; cumple convenciones; no rompe contratos.

---

## 5. Recomendación por fases (sin romper ni perder datos)

1. **Fase 0 (ahora):** Opción **D** — configuración EF central + índices. Cero pérdida.
2. **Fase 1:** Opción **A** — interfaces `IAsset`/`ITenantEntity` para servicios compartidos. Cero migración.
3. **Fase 2:** Evaluar **C** si el negocio quiere QR/inspecciones en extintores/hidrantes sin migrar.
4. **Fase 3 (solo si se aprueba con FASE 0 formal):** **B** — unificación real con plan de migración.

---

## 6. Diagramas del refactor

### 6.1 Estado actual (inventarios desconectados)

```text
                         ┌──────────────────────────────┐
                         │        Customer (tenant)     │
                         └──────────────┬───────────────┘
                                        │
        ┌───────────────┬───────────────┼───────────────┬────────────────┐
        │               │               │               │                │
   ┌────▼─────┐    ┌────▼─────┐    ┌────▼─────┐    ┌────▼─────┐    ┌─────▼─────┐
   │ Equipment│    │   Pool   │    │  Meter   │    │ Catalog  │    │ Extintor/ │
   │ (raíz)   │    │          │    │          │    │  Asset   │    │ Hidrante/ │
   └────┬─────┘    └──────────┘    └──────────┘    └──────────┘    │ Detector/ │
        │                                                          │ Estación  │
        │  (MachineryId)                                           └───────────┘
        │                                                            (tablas
   ┌────┼─────────────┬──────────────┬───────────────┐               separadas)
   │    │             │              │               │
   ▼    ▼             ▼              ▼               ▼
Calendario Bitácora  Inspecciones   QR         Órdenes de Servicio
           (Maint.Log)             (labels)

   ⚠ Cada inventario reinventa: CustomerId, Nombre, Ubicación, Foto, Estado.
   ⚠ Extintores/Hidrantes/Piscinas/Medidores NO tienen QR, inspección ni OS.
```

### 6.2 Opción A — Contratos de interfaz (cero migración)

Los servicios transversales dependen de contratos, no de tablas concretas.

```text
      ┌─────────────────────────┐
      │  <<interface>> IAsset   │   ┌──────────────────────┐
      │  Id, CustomerId,        │   │ <<interface>>        │
      │  Name, Location,        │   │ ITenantEntity        │
      │  IsActive, PhotoPath    │   │ CustomerId           │
      └───────────┬─────────────┘   └──────────┬───────────┘
                  │  implementan               │
   ┌──────────────┼──────────────┬─────────────┼──────────────┐
   ▼              ▼              ▼             ▼              ▼
Equipment      Pool          Meter      CatalogAsset   (futuros)

                  │  consumen (genéricos, sin saber la tabla)
                  ▼
      ┌───────────────────────────────────────────────┐
      │ Servicios compartidos: listado, búsqueda,     │
      │ adjuntos, fotos, (QR/inspección vía Opción C) │
      └───────────────────────────────────────────────┘

   ✅ Sin tocar tablas. ✅ Sin migración. ⚠ Requiere resolver EF por tabla concreta.
```

### 6.3 Opción B — Herencia unificada (TPT/TPC)

`Equipment` se vuelve la **base**; los tipos concretos solo aportan su delta.

```text
                        ┌─────────────────────────────┐
                        │   Equipment (base, TPT)     │
                        │   CustomerId, Name, Brand,  │
                        │   Model, Serie, Location,   │
                        │   State, PhotoPath, ...     │
                        └──────────────┬──────────────┘
                                       │  herencia
        ┌───────────────┬──────────────┼───────────────┬───────────────┐
        ▼               ▼              ▼               ▼               ▼
 ┌────────────┐ ┌────────────┐ ┌───────────┐ ┌───────────┐ ┌───────────────┐
 │ Elevator   │ │ Pump       │ │Extinguisher│ │ Hydrant   │ │   Pool        │
 │ (delta)    │ │ (delta)    │ │  (delta)   │ │ (delta)   │ │  (delta)      │
 └─────┬──────┘ └─────┬──────┘ └─────┬─────┘ └─────┬─────┘ └───────┬───────┘
       └──────────────┴──────────────┴─────────────┴───────────────┘
                                       │
              Todos heredan: QR · Inspecciones · Órdenes de Servicio · Bitácora

   ⚠ Migración de REUBICACIÓN de filas (extintores actuales → tabla hija).
   ⚠ Reversible con copia verificada + rollback. Requiere ventana de mantenimiento.
```

### 6.4 Opción C — Tabla puente polimórfica (aditiva)

Da servicios transversales a inventarios existentes **sin migrarlos**.

```text
   Equipment ─┐
   Pool ──────┤        ┌───────────────────────────────┐
   Meter ─────┼───────▶│         AssetLink             │
   Extintor ──┤        │ Id, CustomerId,               │
   Hidrante ──┘        │ AssetType (enum),             │
                       │ AssetId (Guid)                │
                       └───────────────┬───────────────┘
                                       │ 1:N
              ┌────────────────────────┼────────────────────────┐
              ▼                        ▼                        ▼
          QR Labels               Inspecciones           Órdenes de Servicio

   ✅ Tabla nueva (cero destructivo). ⚠ Polimorfismo (AssetType+AssetId) en consultas.
```

### 6.5 Opción D — Higiene EF (sin cambiar el modelo)

```text
   Antes                              Después
   ─────                              ───────
   Equipment.cs (anotaciones)         Equipment.cs (anotaciones)
   + convención EF             ──▶    + EquipmentConfiguration : IEntityTypeConfiguration
   sin índices explícitos             + Índices:
                                        (CustomerId, State, InventoryCategory)
                                        (CustomerId, Name)
                                      + longitudes y precisión explícitas

   ✅ Cero pérdida. Migración aditiva solo si se agregan índices (performance).
```

### 6.6 Plan por fases (flujo seguro)

```text
   FASE 0        FASE 1         FASE 2          FASE 3
  ┌────────┐   ┌────────┐    ┌──────────┐    ┌──────────────┐
  │   D    │──▶│   A    │───▶│ C (opt.) │───▶│ B (FASE 0    │
  │ Higiene│   │Interfaz│    │  Puente  │    │ formal)      │
  │  EF    │   │ IAsset │    │ AssetLink│    │ Unificación  │
  └────────┘   └────────┘    └──────────┘    └──────────────┘
  0 pérdida    0 migración   +tabla nueva    migración de
  (índices:    (solo código) (backfill opt.) reubicación
   aditivo)                                   con rollback

  Regla: cada fase es reversible o aditiva. Ninguna borra datos de origen
  antes de validar la copia.
```

---

## 7. Preguntas abiertas para el dueño del módulo

1. ¿El objetivo próximo es **unificar inventarios** (un solo tipo de activo) o solo
   **compartir funcionalidad** (QR, inspecciones, OS) entre inventarios existentes?
2. ¿Las nuevas entidades a futuro son **tipos de equipo** (elevadores, bombas) o
   **dominios distintos** (extintores, piscinas, medidores)?
3. ¿Se puede aceptar una migración de **reubicación de filas** (Opción B) con ventana de
   mantenimiento, o se prefiere estrictamente aditivo?
4. ¿La bitácora debe unificarse (`MaintenanceLog` sin `CustomerId` vs `BitacoraEquipoBase` con `CustomerId`)?

---

> **Estado:** propuesta entregada. Sin cambios de código ni migraciones. Se requiere
> decisión del dueño del módulo antes de FASE 0 formal.
