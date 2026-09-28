# Diseño de Centralización de Activos — MaintenanceLuxuryApp + OperationsLuxuryApp

> **Tipo:** Análisis profundo + diseño objetivo + propuesta de migración controlada.
> **Estado:** propuesta. **No se aplica ningún cambio.**
> **Fecha:** 2026-09-25
> **Alcance:** `Equipment`, `Pool`, `Meter`, `InventarioExtintor`, `InventarioHidrante`,
> `InventarioDetectorHumo`, `InventarioEstacionManual` (+ bitácoras e inspecciones derivadas).

---

## 1. Inventario real de entidades "activo" hoy

### 1.1 Familias

| Familia             | Entidad                    | Tabla               | Base                       |    ¿`ITenantEntity`?    | ¿QR? | ¿Inspección? | ¿OS? |
| :------------------ | :------------------------- | :------------------ | :------------------------- | :---------------------: | :--: | :----------: | :--: |
| Equipos generales   | `Equipment`                | `Equipment`         | —                          |           ✅            |  ✅  |      ✅      |  ✅  |
| Albercas            | `Pool`                     | `Pools`             | —                          | ❌ (tiene `CustomerId`) |  ❌  |      ❌      |  ❌  |
| Medidores           | `Meter`                    | `Meters`            | —                          | ❌ (tiene `CustomerId`) |  ❌  |      ❌      |  ❌  |
| Catálogo de activos | `CatalogAsset`             | `CatalogAssets`     | —                          |           ❌            |  ❌  |      ❌      |  ❌  |
| Contra incendio     | `InventarioExtintor`       | `FireExtinguishers` | `EquipoContraIncendioBase` |           ✅            |  ❌  |      ✅      |  ❌  |
| Contra incendio     | `InventarioHidrante`       | `Hydrants`          | `EquipoContraIncendioBase` |           ✅            |  ❌  |      ✅      |  ❌  |
| Contra incendio     | `InventarioDetectorHumo`   | `SmokeDetectors`    | `EquipoContraIncendioBase` |           ✅            |  ❌  |      ✅      |  ❌  |
| Contra incendio     | `InventarioEstacionManual` | `ManualCallPoints`  | `EquipoContraIncendioBase` |           ✅            |  ❌  |      ✅      |  ❌  |

### 1.2 La base existente `EquipoContraIncendioBase` (`OperationsLuxuryApp/Inventory`)

```csharp
public abstract class EquipoContraIncendioBase : GuidIdEntity, ITenantEntity
{
    public Guid CustomerId { get; set; }
    public Customer Customer { get; set; }
    public string Location { get; set; }        // col "Location"
    public string LocalCode { get; set; }       // col "LocalCode"
    public string Photo { get; set; }           // col "Photo"
    public string ApplicationUserId { get; set; }
    public ApplicationUser ApplicationUser { get; set; }
}
```

Ya es un **precedente de abstracción correcto**: 4 tipos de activo contra incendio
comparten base (herencia TPC por convención, cada uno su tabla).

### 1.3 Bitácoras: dos bases distintas

| Base                 | Namespace                              | Campos comunes                                                                     |   `CustomerId` propio   |
| :------------------- | :------------------------------------- | :--------------------------------------------------------------------------------- | :---------------------: |
| `BitacoraEquipoBase` | `MaintenanceLuxuryApp/MaintenanceLogs` | `Date`, `Hour`, `PropertyId`, `Observations`, `InspectorName`, `ApplicationUserId` |          ✅ sí          |
| `MaintenanceLog`     | `MaintenanceLuxuryApp/MaintenanceLogs` | `MachineryId`, `Descripcion`, `Emergencia`, `ApplicationUserId`                    | ❌ (lo toma del equipo) |

**Inconsistencia:** las bitácoras contra incendio usan `BitacoraEquipoBase` (con `CustomerId`)
pero viven en `MaintenanceLuxuryApp`, mientras su padre de activo (`EquipoContraIncendioBase`)
vive en `OperationsLuxuryApp`. Hay **acoplamiento cruzado entre módulos ya existente**.

### 1.4 Capa de inspecciones contra incendio (tercer eje)

`FireInspectionPeriod` → `FireInspectionCycle` → `FireCycleInspection{Extinguisher,Hydrant,Station,Detector}`
apuntan a las entidades de inventario. Es **programación de inspecciones**, no el activo.
Diseño correcto; **no debe tocar `Equipment`**.

---

## 2. Propiedades comunes reales (tu lista, validada y ampliada)

Tu lista base: `CustomerId`, `PhotoPath`, `QR`, `Location`, `LocalCode`, `Observations`,
`EquipoClasificacion`, `Name`, `DateOfPurchase`.

### 2.1 Propiedades comunes confirmadas (núcleo)

| Propiedad               | Tipo       | ¿Existe dónde?                                                                                           | Notas                                    |
| :---------------------- | :--------- | :------------------------------------------------------------------------------------------------------- | :--------------------------------------- |
| `CustomerId`            | `Guid`     | Equipment, Pool, Meter, EquipoContraIncendioBase                                                         | **Tenant** — universal.                  |
| `Name`                  | `string`   | Equipment (`Name`), Pool (`Name`), `CatalogAsset` (`Name`)                                               | Universo claro.                          |
| `Location`              | `string`   | Equipment (`Location`→`Ubication`), EquipoContraIncendioBase (`Location`), Pool (`Location`→`Ubication`) | Mismo concepto, distinto nombre C#.      |
| `PhotoPath`             | `string`   | Equipment (`PhotoPath`), ContraIncendio (`Photo`), Pool (`ImagePath`)                                    | Mismo concepto, 3 nombres.               |
| `LocalCode`             | `string`   | Solo `EquipoContraIncendioBase`                                                                          | **Falta** en Equipment/Pool.             |
| `Observations`          | `string`   | Equipment (`Observations`), `BitacoraEquipoBase`                                                         | **Falta** en el base contra incendio.    |
| `DateOfPurchase`        | `DateOnly` | Equipment (`InstallationDate`), Extintor (`ExpirationDate` es distinto)                                  | **Falta** en el resto.                   |
| `EquipoClasificacionId` | `Guid?`    | Solo Equipment                                                                                           | **Falta** en el resto (extensión clave). |
| `ApplicationUserId`     | `string`   | Equipment, Pool, EquipoContraIncendioBase                                                                | Universo claro.                          |
| `State`                 | `State`    | Solo Equipment                                                                                           | **Falta** en el resto.                   |

### 2.2 Propiedades nuevas / transversales a considerar

| Propiedad                          | Propósito                    | Estado hoy                                                     |
| :--------------------------------- | :--------------------------- | :------------------------------------------------------------- |
| `QR` (código)                      | Etiquetado único del activo. | Solo `EquipmentQrLabel` (relación 1:N, no campo).              |
| `InventoryCategory`                | Categoría de inventario.     | Solo Equipment.                                                |
| `SerialNumber` / `Brand` / `Model` | Ficha técnica.               | Solo Equipment.                                                |
| `TechnicalSpecifications`          | Ficha técnica.               | Solo Equipment.                                                |
| `IsActive`                         | Baja lógica.                 | `State` en Equipment; `FireInspectionPeriod.IsActive`; faltan. |

### 2.3 Gaps detectados (lo que rompe coherencia)

1. **3 nombres para lo mismo**: `Ubication`/`Location`, `PhotoPath`/`Photo`/`ImagePath`, `Serie`/`SerialNumber`.
2. **Clasificación solo en `Equipment`** → extintores/piscinas no pueden agruparse por sistema.
3. **QR solo en `Equipment`** → no se puede etiquetar extintores/hidrantes/piscinas.
4. **`Observations` ausente** en el base contra incendio.
5. **`DateOfPurchase` / `State` / `InventoryCategory`** ausentes fuera de `Equipment`.
6. **Bitácoras divergentes** (`MaintenanceLog` sin `CustomerId`).
7. **Acoplamiento cruzado** Operations↔Maintenance en entidades.

---

## 3. Arquitectura objetivo (centralizada y coherente)

### 3.1 Núcleo propuesto: `AssetBase` (abstract, compartido)

Nueva base única en un namespace compartido honesto (`SharedLuxuryApp` o
`Infrastructure.Data.Entities.Shared`) que represente **todo activo físico inventariable**:

```text
┌───────────────────────────────────────────────────────────────┐
│  abstract AssetBase : GuidIdEntity, ITenantEntity             │
│───────────────────────────────────────────────────────────────│
│  CustomerId / Customer                                        │
│  ApplicationUserId / ApplicationUser           (responsable)  │
│  EquipoClasificacionId / EquipoClasificacion   (Guid?)        │
│  Name                                          (nombre)       │
│  Location                                      (ubicación)    │
│  LocalCode                                     (código física)│
│  PhotoPath                                     (foto)         │
│  Observations                                                 │
│  DateOfPurchase                                (DateOnly)     │
│  State                                         (operativo)    │
│  InventoryCategory                                            │
│  (QR se modela aparte — relación 1:N)                         │
└───────────────────────┬───────────────────────────────────────┘
                        │ heredan
   ┌──────────┬─────────┼──────────┬───────────┬───────────┐
   ▼          ▼         ▼          ▼           ▼           ▼
Equipment  Extintor   Hidrante  Detector   Estación    Pool / Meter*
(equipos)  (delta)    (delta)   (delta)    (delta)     (delta)

* Pool/Meter pueden heredar si se aprueba; si no, quedan vía IAsset (ver 3.3).
```

**Estrategia EF propuesta: TPT** (Table-Per-Type) — la base en `Assets` con columnas comunes,
cada tipo en su tabla hija. Ventaja: extintores existentes **migran a tablas hijas** conservando
su infra; los campos comunes dejan de duplicarse. TPC sería alternativa si se quiere una sola
tabla por tipo sin tabla base (más simple de consultar, más difícil de evolucionar).

### 3.2 Bitácora unificada

Unificar `BitacoraEquipoBase` y `MaintenanceLog` bajo **una** base:

```text
abstract AssetLogBase : GuidIdEntity, ITenantEntity
   CustomerId, AssetId, Date, Hour, Observations,
   InspectorName/ApplicationUserId, PropertyId
```

Cada tipo conserva su tabla y sus checks específicos.

### 3.3 Contrato `IAsset` (puente, sin migración)

Para entidades que **no** conviene migrar aún (Pool, Meter, CatalogAsset):

```csharp
public interface IAsset
{
    Guid Id { get; }
    Guid CustomerId { get; }
    string Name { get; }
    string Location { get; }
}
```

Servicios transversales (QR, búsqueda, adjuntos, reportes) consumen `IAsset`.

### 3.4 QR transversal

Extraer `EquipmentQrLabel` → `AssetQrLabel` ligado a **cualquier** activo
(`AssetId` + `AssetType` o vía `IAsset`), no solo a `Equipment`.

### 3.5 Diagrama de destino

```text
                 ┌───────────────────────────────┐
                 │        AssetBase (TPT)        │
                 │  CustomerId·Name·Location·    │
                 │  LocalCode·PhotoPath·QR·      │
                 │  Observations·DateOfPurchase· │
                 │  State·Classification·        │
                 │  InventoryCategory            │
                 └───────────────┬───────────────┘
     ┌────────────┬─────────────┼─────────────┬────────────┐
     ▼            ▼             ▼             ▼            ▼
 Equipment     Extintor     Hidrante      Detector     Estación
 (OS/QR/insp)  (insp)       (insp)        (insp)       (insp)
     │            │             │             │            │
     └────────────┴─────────────┴─────────────┴────────────┘
                              │
                    AssetLogBase (bitácora unificada)
                    AssetQrLabel  (QR transversal)

     Pool / Meter / CatalogAsset ── implementan ──▶  IAsset
```

---

## 4. Migración controlada (seguridad de datos)

> Regla: **ninguna fase borra origen antes de validar copia**. Toda fase tiene rollback.

| Fase   | Acción                                                                                                                                                                                                                                                             | Tipo de migración              |        Pérdida        | Rollback                      |
| :----- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------------------------- | :-------------------: | :---------------------------- |
| **F0** | Interfaces `IAsset` + servicios transversales                                                                                                                                                                                                                      | Sin migración                  |          ❌           | N/A                           |
| **F1** | `AssetBase` abstract + re-mapear herencia existente **sin mover datos** (TPC existente ya lo permite para contra incendio). Agregar columnas faltantes nullable (`LocalCode`, `Observations`, `DateOfPurchase`, `ClassificationId`, `State`) a las tablas actuales | Aditiva (columnas nullable)    |          ❌           | `DROP COLUMN`                 |
| **F2** | Unificar bitácoras: agregar `CustomerId` a `MaintenanceLog` + backfill desde equipo                                                                                                                                                                                | Aditiva + backfill             |          ❌           | Revertir columnas/valores     |
| **F3** | QR transversal: nueva tabla `AssetQrLabels` + copiar desde `EquipmentQrLabels`                                                                                                                                                                                     | Nueva tabla + copia            |          ❌           | `DROP TABLE` nueva            |
| **F4** | (Opcional, FASE 0 formal) TPT real: crear tablas por tipo, **copiar** filas, doble escritura, verificar, y solo entonces dejar de usar la tabla vieja                                                                                                              | Reubicación                    | ❌ si se valida copia | Mantener origen hasta validar |
| **F5** | Higiene: unificar nombres C# (`Ubication`→`Location`, `Serie`→`SerialNumber`, `PhotoPath`↔`Photo`)                                                                                                                                                                 | Refactor sin cambio de columna |          ❌           | Revertir código               |

**Backfill seguro (patrón):** migración que (1) agrega columna nullable, (2) script idempotente
llena desde la fuente, (3) conteo de verificación `origen == destino`, (4) solo si cuadra se
comienza a leer del nuevo campo.

**Compatibilidad:** mantener columnas antiguas como _deprecated_ al menos una release; doble
lectura/escritura durante transición.

---

## 5. Riesgos

| Riesgo                                      | Prob. | Impacto | Mitigación                            |
| :------------------------------------------ | :---: | :-----: | :------------------------------------ |
| Migración TPT mueve filas mal               | Media |  Alto   | Copiar→verificar→no borrar origen     |
| Acoplamiento cruzado Operations↔Maintenance | Alta  |  Medio  | Mover base a `SharedLuxuryApp`        |
| Doble servicio del mismo concepto           | Alta  |  Medio  | Contrato `IAsset` + servicio único    |
| Regresión en reportes/PDF/QR                | Media |  Alto   | Doble lectura en transición + pruebas |
| Nombres C# inconsistentes                   | Alta  |  Bajo   | Refactor F5 sin tocar columnas        |

---

## 6bis. Inspecciones + Calendario/OS por lotes (requerimiento nuevo)

> Requerimiento clave: **todo activo tiene inspecciones**. Y extintores/estaciones/detectores
> son **decenas a cientos** → calendario y OS **no** pueden ser 1:1 por equipo; deben operar
> **por paquete / grupo / bloque / fase**.

### 6bis.1 Lo que existe hoy en inspecciones (dos motores)

| Motor                        | Entidades                                                                                              | Modelo                                                                    | Estado                                             |
| :--------------------------- | :----------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------ | :------------------------------------------------- |
| Inspecciones de equipo       | `EquipmentInspectionDefinition` (plantilla) → `...Execution` → `...Item` / `...Image`                  | 1 definición ↔ N ejecuciones, ligadas a **UN** `MachineryId`              | Vigente, rico (criterios, assignees, weekdays, QR) |
| Inspecciones contra incendio | `FireInspectionPeriod` (paquete) → `FireInspectionCycle` (ciclo) → `FireCycleInspection{X}` (por ítem) | Periodo agrupa **N ítems de 4 tipos**; ciclo genera inspecciones por ítem | Vigente, pero **paralelo** y desacoplado           |

**Esto ya confirma tu punto:** las inspecciones contra incendio **ya se agrupan por paquete**
(`FireInspectionPeriod` + `FireInspectionCycle`), porque son cientos. El motor de
`EquipmentInspectionDefinition` es 1:1 por equipo y **no escala** para inventarios masivos.

### 6bis.2 El problema de cardinalidad (tu diagnóstico, confirmado)

```text
HOY (MaintenanceCalendar / ServiceOrder):
   Equipment 1 ──── 1 MaintenanceCalendar ──── N ServiceOrder
   Equipment 1 ──── N ServiceOrder (MachineryId)

   ✅ Bien para equipos "uno a uno" (bomba, elevador, alberca).
   ❌ Mal para 400 extintores: 400 calendarios, 400 OS. Inmanejable.
```

```text
REQUERIDO:
   Un "paquete/lote/bloque" agrupa N activos.
   El calendario programa el PAQUETE.
   La OS se genera por PAQUETE, con detalle por activo.
```

### 6bis.3 Modelo objetivo propuesto: capa de agrupación

Introducir una entidad **`AssetGroup`** (nombre tentativo: Lote/Bloque/Paquete) como unidad
programable, **sin** romper el 1:1 actual para equipos individuales.

```text
┌───────────────────────────────────────────────────────────────────┐
│                          AssetGroup                               │
│  Id · CustomerId · Name · Code · Description · IsActive           │
│  GroupType (PorUbicacion | PorTipo | PorFase | Manual)            │
│  EquipoClasificacionId? (opcional, agrupa por sistema)            │
└───────────────────────────┬───────────────────────────────────────┘
                            │  N:N
              ┌─────────────┴─────────────┐
              ▼                           ▼
        AssetGroupMember            (opcional jerarquía)
        GroupId · AssetId · Order    AssetGroup → AssetGroup (fases/bloques)
              │
              │ el grupo es programable
              ▼
     MaintenanceCalendar ── (MachineryId pasa a nullable / o grupo)
     ServiceOrder        ── (MachineryId pasa a nullable / o grupo)

     ServiceOrderItem / ServiceOrderDetail  (nuevo)
        OrderId · AssetId · Status · Observations · Price
        → la OS del paquete desglosa el resultado por activo
```

**Regla de cardinalidad dual (compatibilidad):**

- Equipo individual → `MaintenanceCalendar.MachineryId` (como hoy). **No se toca.**
- Lote → `MaintenanceCalendar.AssetGroupId` (nuevo, nullable) + `ServiceOrder.AssetGroupId` (nuevo).
- `MachineryId` se vuelve **nullable** solo cuando el calendario/OS es de lote.
- El **detalle por activo** vive en `ServiceOrderItem` (nuevo), no en la cabecera.

### 6bis.4 La inspección como ciudadano de primera

Toda entidad `AssetBase` debe poder inspeccionarse. Unificar el motor:

```text
          ┌──────────────────────────────────────────────┐
          │   InspectionTemplate (plantilla)             │
          │   CustomerId · Name · Recurrence · Criteria  │
          │   TargetType (Equipo | Grupo | ClaseFuego)   │
          └───────────────────────┬──────────────────────┘
                                  │ genera
                    ┌─────────────▼─────────────┐
                    │   InspectionRun (ciclo)   │
                    │   TemplateId · Periodo    │
                    └─────────────┬─────────────┘
                                  │ N
                    ┌─────────────▼─────────────┐
                    │  InspectionExecution      │
                    │  RunId · AssetId (genérico)│
                    │  Status · Observations     │
                    │  InspectionDetail[] (ítems)│
                    └───────────────────────────┘

  Mapea a lo existente:
    EquipmentInspectionDefinition  ≈ InspectionTemplate (TargetType=Equipo)
    EquipmentInspectionExecution   ≈ InspectionExecution (AssetId=EquipmentId)
    FireInspectionPeriod           ≈ InspectionTemplate de lote fuego
    FireInspectionCycle            ≈ InspectionRun
    FireCycleInspection{X}         ≈ InspectionExecution por activo
```

**Estrategia de convivencia:** no renombrar de golpe. En F1–F2 se agrega el núcleo nuevo y se
**mapean** los motores actuales; el retiro de los nombres viejos es F5 (opcional).

### 6bis.5 Estrategia de agrupación de lotes (cómo se arman)

| Estrategia      | Ejemplo                    | Uso                      |
| :-------------- | :------------------------- | :----------------------- |
| Por ubicación   | "Extintores Piso 1–5"      | Operativo logístico.     |
| Por tipo        | "Todos los extintores PQS" | Proveedor especializado. |
| Por fase/bloque | "Bloque A, B, C"           | Servicio escalonado.     |
| Manual          | Selección libre            | Casos mixtos.            |

El grupo **puede** materializarse estático (`AssetGroupMember`) o dinámico por regla
(`GroupType + filtro`). Recomendado: **mixto** — regla guardada que materializa miembros al
programar, con posibilidad de override manual.

### 6bis.6 Impacto en lo que YA TIENES con datos

| Entidad con datos       | Cambio                                                | Migración                                                            |
| :---------------------- | :---------------------------------------------------- | :------------------------------------------------------------------- |
| `MaintenanceCalendar`   | + `AssetGroupId?` (aditivo). `MachineryId` → nullable | Aditiva; backfill crea 1 grupo por equipo existente (compatibilidad) |
| `ServiceOrder`          | + `AssetGroupId?` (aditivo). `MachineryId` → nullable | Aditiva; OS existentes conservan `MachineryId`                       |
| `ServiceOrder`          | + `ServiceOrderItem[]` (nueva tabla)                  | Nueva tabla vacía para OS viejas; se llena en las nuevas             |
| `EquipmentInspections*` | Sin cambio en F1                                      | Se mapean, no se borran                                              |
| `FireInspection*`       | Sin cambio en F1                                      | Se mapean, no se borran                                              |

**Clave:** los equipos individuales que hoy funcionan 1:1 **siguen igual**. Solo los lotes usan
la capa nueva. Nada existente se rompe ni pierde.

### 6bis.7 Diagrama de destino completo (activos + inspección + calendario/OS)

```text
                    ┌────────────────────────────┐
                    │        AssetBase (TPT)     │
                    │  núcleo común de activos   │
                    └──────────────┬─────────────┘
        ┌──────────┬───────────────┼───────────────┬──────────────┐
        ▼          ▼               ▼               ▼              ▼
    Equipment   Extintor        Hidrante       Detector       Estación
        │          └──────────────┬───────────────┴──────────────┘
        │                         │
        │              ┌──────────▼──────────┐
        │              │    AssetGroup       │◀── paquete/lote/fase
        │              │  AssetGroupMember[] │
        │              └──────────┬──────────┘
        │                         │
        │      ┌──────────────────┼──────────────────┐
        ▼      ▼                  ▼                  ▼
   MaintenanceCalendar      ServiceOrder      InspectionTemplate
   (individual o grupo)     (cabecera)        (Target = activo|grupo)
        │                         │                  │
        │                         ▼                  ▼
        │                  ServiceOrderItem    InspectionRun
        │                  (detalle por activo)      │
        │                                            ▼
        │                                   InspectionExecution
        │                                   (por activo) + Detail[]
        └──────────────────────────────▶  alimenta OS / seguimiento
```

### 6bis.8 Preguntas de decisión adicionales

6. ¿El nombre del agrupador: **`AssetGroup` / Lote / Bloque / Paquete**?
7. ¿El calendario de lote genera **una OS con N detalles** (`ServiceOrderItem`) o **N OS**
   ligadas al grupo? (Recomendado: 1 OS + N detalles).
8. ¿La inspección de lote se ejecuta **por activo** (un execution por cada uno) o **una sola**
   con checklist agregado? (Recomendado: por activo, agregable en el run).
9. ¿Los motores de inspección actuales se **mapean** (mantener nombres) o se **unifican** en F1?

---

## 7. Preguntas de decisión

1. ¿Estrategia EF: **TPT** (tabla base + hijas) o **TPC** (una tabla por tipo, sin base física)?
2. ¿`Pool` y `Meter` entran al universo `AssetBase` o quedan vía `IAsset`?
3. ¿`CatalogAsset` (folio+nombres) es catálogo maestro (no activo) o también activo?
4. ¿La bitácora se unifica en `AssetLogBase` o se mantienen dos (equipos vs contra incendio)?
5. ¿Se acepta ventana de mantenimiento para F4 (reubicación), o tope estricto a F0–F3 aditivo?

---

> **Estado:** diseño entregado. Sin cambios ni migraciones. Requiere decisión para FASE 0 formal.
