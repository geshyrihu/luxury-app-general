# Adenda — Revisión arquitectónica de la centralización de activos

> **Tipo:** Revisión de arquitectura (pros/contras + recomendaciones). **No se aplica ningún cambio.**
> **Fecha:** 2026-09-26
> **Documento revisado:** [20260925-diseno-centralizacion-activos.md](20260925-diseno-centralizacion-activos.md)
> **Contexto:** [20260925-propuesta-abstraccion-equipment.md](20260925-propuesta-abstraccion-equipment.md)
> **Estado:** abierta. Pendiente de respuesta del agente autor del diseño (ver §6).

---

## 1. Veredicto

Se **aprueba la dirección** (núcleo común de activos, servicios transversales, OS/calendario por lote) y se **recorta el alcance**: ejecutar en tres etapas independientes, decidir cada una por separado, y **diferir la unificación del motor de inspecciones**.

---

## 2. Verificación contra el código

| Afirmación del diseño                         | Resultado  | Evidencia                                                                                                                                                                                                 |
| :-------------------------------------------- | :--------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| "Herencia TPC por convención"                 | ❌ Falsa   | Es **explícita**: `ApplicationDbContext.cs` (≈L3237-3243) llama `UseTpcMappingStrategy()` en `EquipoContraIncendioBase`, `BitacoraEquipoBase`, `FireInspectionPeriodItemBase`, `FireCycleInspectionBase`. |
| Calendario/OS son 1:1 con equipo              | ✅ Cierta  | `MaintenanceCalendar.MachineryId` es `[Required]`; `ServiceOrder.MachineryId` es `Guid` no nulo.                                                                                                          |
| Inspección de fuego ya agrupa por paquete     | ✅ Cierta  | `FireInspectionPeriod` → `FireInspectionCycle` → `FireCycleInspection{X}`; membresía en `FireInspectionPeriodItemBase`.                                                                                   |
| "OS con N detalles" es agregar una tabla hija | ⚠️ Parcial | `ServiceOrder` porta semántica de un solo equipo: `Price`, `EquiposOperando`, `CalidadTrabajos`, `OcacionoDanos`, suspensión, `FollowUps`, `Folio`, origen desde inspección.                              |

---

## 3. Pros

- Mismo problema que la propuesta previa (Opciones A–D) dejó abierto; aquí se elige dirección y se separa en fases.
- Migración aditiva con rollback; no borra origen antes de validar copia.
- Diagnóstico de cardinalidad correcto (400 extintores ⇒ 400 calendarios / 400 OS no escala).
- Alcance contenido: Pool/Meter por `IAsset`, sin mega-módulo.
- Tabla de riesgos y preguntas de decisión útiles.

## 4. Contras / riesgos

| #   | Hallazgo                                                                                                                                                                                                                                                                                                                                                                                                                                 | Severidad |
| :-- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-------: |
| C1  | **Mezcla tres problemas de riesgo distinto** en un solo plan: normalización de activos (bajo), cardinalidad OS/calendario (medio-alto, toca finanzas) y unificación de inspecciones (alto, sin beneficio inmediato).                                                                                                                                                                                                                     |   Alta    |
| C2  | **TPT vs TPC mal planteado.** La razón real es la **integridad referencial**: hoy `FireInspectionPeriodItemBase` tiene 4 tablas de membresía (una por tipo) porque TPC no permite FK real a "cualquier activo". `AssetGroupMember`, `AssetQrLabel` y `ServiceOrderItem` necesitan esa FK. Sin identidad común, `(AssetType, AssetId)` no tiene integridad y abre **fuga multi-tenant** (activo de otro `CustomerId` dentro de un grupo). |   Alta    |
| C3  | **Contradicción interna en §6bis:** "el equipo individual no se toca / `MachineryId` nullable solo en lotes" vs "el backfill crea 1 grupo por equipo existente". Son modelos distintos (dual vs uniforme). `MachineryId` nullable además obliga a null-checks en reportes, contabilidad (`AccountingCatalogId`) y seguimientos.                                                                                                          |   Alta    |
| C4  | **`AssetGroup` puede ser un tercer motor de agrupación.** `FireInspectionPeriod` + `FireInspectionPeriodItem` ya son grupo + miembros. Además se mezclan dos usos: grupo estable (sistema) y alcance de un evento (fase 2026, pisos 1–5).                                                                                                                                                                                                |   Alta    |
| C5  | **Grupos dinámicos por regla:** si los miembros se reevalúan tras generar la OS, la OS histórica cambia de contenido. `ServiceOrderItem` debe ser **snapshot**.                                                                                                                                                                                                                                                                          |   Media   |
| C6  | **Unificar `InspectionTemplate/Run/Execution`:** `EquipmentInspectionDefinition` tiene criterios, asignados, días, QR y autogenera OS; el motor de fuego es checklist por ciclo. "Mapear" es ambiguo (¿adaptador, vista, capa de código?). Se logra bandeja/reportes unificados sin fusionar tablas.                                                                                                                                     |   Alta    |
| C7  | **Mezcla inspección con mantenimiento.** Inspección = frecuente, interna, checklist (fuego ya resuelto por paquete). OS con proveedor/costo = recarga o prueba hidrostática anual por lote. "Por lote" aplica sobre todo a OS/calendario.                                                                                                                                                                                                |   Media   |
| C8  | **Inconsistencias menores:** QR como campo (§3.5) vs relación 1:N (§3.1); columnas nuevas `DateOnly?`/`Guid?` chocan con la decisión abierta sobre la regla `?` (Nullable<T> vs referencia); renombrar `NameMachinery`→`Name` (F5) toca DTOs y front, no es "higiene" pura.                                                                                                                                                              |   Media   |

---

## 5. Recomendación por etapas

### Etapa 1 — Activos comunes (F0–F3) · riesgo bajo

- `IAsset` + `AssetBase` para Equipment y los 4 tipos de fuego; columnas faltantes **nullable** (`LocalCode`, `Observations`, `State`, `EquipoClasificacionId`).
- Mover la base a `SharedLuxuryApp` (elimina acoplamiento Operations↔Maintenance).
- `AssetQrLabel` transversal.
- `CustomerId` en `MaintenanceLog` con backfill.
- **No** renombrar propiedades C# todavía (F5 fuera).

### Etapa 2 — Identidad común · decisión explícita

- Evaluar tabla `Assets` delgada (`Id`, `CustomerId`, `AssetType`, `Name`, `LocalCode`) con **PK compartida** (TPT ligero).
- Es el habilitador de la Etapa 3 con integridad. Si el negocio no necesita FK real, se mantiene TPC + servicio de validación de tenant.

### Etapa 3 — OS/calendario por lote · piloto en fuego

- Tabla `ServiceOrderAsset` (OS 1 : N activos) con estado/observaciones por activo, **snapshot** de miembros.
- Mantener el modelo actual para Equipment; validar el patrón en fuego primero.
- Modelo final: **uniforme con shim** (toda OS tiene ≥1 item; backfill trivial; `MachineryId` deprecado, no nullable). Alternativa: dual con CHECK XOR.
- Antes de crear `AssetGroup`: decidir si `FireInspectionPeriod` se generaliza o es reemplazado. **No** coexisten tres agrupadores.

### Diferido

- Unificación de motores de inspección (solo adaptador/vista si se necesita bandeja unificada).
- Bitácora unificada `AssetLogBase`.
- Pool/Meter como `AssetBase` (solo `IAsset`).

---

## 6. Preguntas para el agente autor del diseño

> Responder debajo de cada pregunta. Cada respuesta debe citar archivo/línea cuando afirme algo del código.

| #   | Pregunta                                                                                                                                                                                                  | Respuesta  |
| :-- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------- |
| P1  | ¿Se reconoce que el TPC ya es explícito (`UseTpcMappingStrategy`) y que la razón de TPT es la FK real a "cualquier activo"? ¿Se necesita esa FK, o alcanza TPC + validación de tenant por servicio?       | Ver §8 R1. |
| P2  | Modelo de OS/calendario por lote: ¿**dual** (`MachineryId` nullable + `AssetGroupId` + CHECK XOR) o **uniforme con shim** (`ServiceOrderAsset` para todas las OS, `MachineryId` deprecado)?               | Ver §8 R2. |
| P3  | ¿`AssetGroup` reemplaza a `FireInspectionPeriod`/`FireInspectionPeriodItem`, los generaliza, o convive? Si convive, ¿cómo se evita el tercer agrupador?                                                   | Ver §8 R3. |
| P4  | ¿Qué campos de `ServiceOrder` pasan a `ServiceOrderAsset` (estado, `EquiposOperando`, precio prorrateado) y cuáles quedan en cabecera? ¿Cómo afecta a contabilidad (`AccountingCatalogId`) y `FollowUps`? | Ver §8 R4. |
| P5  | ¿"Mapear motores de inspección" es adaptador, vista o capa de código? ¿Se acepta diferir la unificación real?                                                                                             | Ver §8 R5. |
| P6  | ¿Cuántos activos por cliente hay hoy en producción (extintores, hidrantes, detectores, estaciones)? ¿Cuántas OS existentes por equipo?                                                                    | Ver §8 R6. |
| P7  | ¿Cómo se resuelve la regla `?` para columnas nuevas nullable (`DateOnly?`, `Guid?`) dado que la decisión Nullable<T> vs referencia sigue abierta?                                                         | Ver §8 R7. |
| P8  | Renombrado F5 (`NameMachinery`→`Name`, `Ubication`→`Location`): ¿impacto medido en DTOs/endpoints/front? ¿Se difiere?                                                                                     | Ver §8 R8. |

---

## 8. Respuestas del agente autor del diseño

> Las respuestas citan archivo/línea cuando afirman algo del código. Verificadas con
> `rg`/lectura directa sobre el árbol `api/LuxuryApp.Application` (excluyendo `.kilo/worktrees`).

### R1 — TPC explícito y la razón real de TPT (responde P1)

**Acepto la corrección C2.** Mi documento decía "herencia TPC por convención"
(`20260925-diseno-centralizacion-activos.md` §1.2); es **falso**. El TPC es **explícito**:

- `ApplicationDbContext.cs:3237` `modelBuilder.Entity<EquipoContraIncendioBase>().UseTpcMappingStrategy();`
- `:3239` `BitacoraEquipoBase`, `:3241` `FireInspectionPeriodItemBase`, `:3243` `FireCycleInspectionBase`.

**Sí, la razón de TPT es la integridad referencial**, y es válida. Con TPC no existe una
tabla/pk que represente "cualquier activo", por lo que `AssetGroupMember`, `AssetQrLabel` y
`ServiceOrderAsset` no pueden tener FK real; caerían en `(AssetType, AssetId)` sin FK, lo que
—como señala C2— **no tiene integridad y abre fuga multi-tenant** (un activo de otro
`CustomerId` dentro de un grupo). Ese riesgo es real porque el filtro de soft-delete es global
(`ApplicationDbContext.cs:3249-3264`) pero **el aislamiento de tenant no se aplica automáticamente**:
`ITenantEntity` es una marca, no un query filter (verificado: 8 entidades del inventario la
implementan sin filtro automático; el aislamiento se hace por servicio).

**Decisión que propongo a decisión del arquitecto:** si en la Etapa 3 se necesita FK real a
"cualquier activo", **TPT ligero** (tabla `Assets` delgada con PK compartida) es el habilitador
correcto; si no se necesita FK real, **TPC + validador de tenant en servicio** es suficiente
y más barato. **Mi postura: con el volumen previsto (cientos de activos agrupados) y la
exigencia multi-tenant, recomiendo TPT ligero en Etapa 2.** Es lo que habilita la Etapa 3 sin
deuda.

### R2 — Modelo OS/calendario por lote (responde P2)

**Acepto C3 y C5.** Mi §6bis.3 era internamente contradictorio: decía "no se toca el 1:1" y a
la vez "backfill crea 1 grupo por equipo existente" — son modelos distintos. Y hacer
`MachineryId` nullable obliga a null-checks en reportes, contabilidad y seguimientos
(confirmado en `ServiceOrder.cs`: `Price`, `EquiposOperando`, `CalidadTrabajos`,
`OcacionoDanos`, `SuspensionReasonId`, `FollowUps` cuelgan de la cabecera, y
`MaintenanceCalendar` tiene `AccountingCatalogId` por equipo).

**Decisión propuesta: uniforme con shim.** Toda OS tiene **≥1** `ServiceOrderAsset`
(snapshot de miembros, no reevaluación — corrige C5). `MachineryId` se **deprecia, no se
anula**: durante la transición se mantiene como "primer activo" para no romper reportes ni
contabilidad; el backfill es trivial (una fila por OS existente con su `MachineryId`).
**Rechazo el dual con CHECK XOR**: XOR no es expresable de forma portable en SQL Server y
multiplica los casos borde. El uniforme con shim gana porque la migración es aditiva y el
backfill es 1:1.

### R3 — Los agrupadores (responde P3)

**Acepto C4: no deben coexistir tres agrupadores.** `FireInspectionPeriod` +
`FireInspectionPeriodItem` ya son "grupo + miembros" (`FireInspectionPeriods/FireInspectionPeriod.cs:31-35`,
`FireInspectionPeriodItemBase.cs:2-5`), y mezclan dos semánticas: grupo estable (sistema) y
alcance de un evento (ciclo/fase).

**Propuesta:** `AssetGroup` **generaliza** a `FireInspectionPeriod`, no convive. Es decir,
`FireInspectionPeriod` pasa a ser un caso de `AssetGroup` con `GroupType = ClaseFuego` (o se
deprecia). **No se debe crear `AssetGroup` hasta resolver esto** — coincide con la
recomendación difirida de la adenda. Alternativa conservadora: no introducir `AssetGroup` en
Etapa 1–2; reutilizar el patrón de `FireInspectionPeriod` como plantilla mental y decidir en
Etapa 3.

### R4 — Qué queda en cabecera vs detalle (responde P4)

**Pasan a `ServiceOrderAsset`:** estado por activo, `EquiposOperando` por activo, observaciones
individuales, y **precio prorrateado** (opcional; el precio de cabecera sigue siendo el total
del servicio).

**Quedan en cabecera:** `Folio`, `Price` (total), `ProviderId`, `EmployeeResponsableId`,
`MaintenanceCalendarId`, `SuspensionReasonId/Notes/At`, `Status`, fechas, `FollowUps` (la
bitácora es de la OS, no del activo).

**Impacto contabilidad:** `MaintenanceCalendar.AccountingCatalogId` es por calendario
(`MaintenanceCalendar.cs:89-94`); como el calendario de lote sería uno, **no se rompe**. Si en
el futuro se requiere costo por activo, `ServiceOrderAsset.Price` lo cubre sin tocar el
catálogo contable. **`FollowUps` no se toca** (es de la orden, `ServiceOrder.cs:207`).

### R5 — "Mapear" motores de inspección (responde P5)

**Acepto C6; "mapear" era ambiguo.** Lo concreto y suficiente: **una capa de código
(adaptador de lectura) o una vista de BD** que exponga ambos motores en una bandeja/reporte
unificado; **no** fusionar tablas ni renombrar clases. Los motores reales difieren:
`EquipmentInspectionDefinition` tiene criterios/asignados/días/QR/autogenera OS
(`EquipmentInspectionDefinition.cs:45-48`), el de fuego es checklist por ciclo
(`FireInspectionCycle.cs`). **Sí, acepto diferir la unificación real.** Solo mantengo el
principio "todo activo es inspeccionable" como criterio de diseño, sin fusionar motores ahora.

### R6 — Volumen en producción (responde P6)

**No tengo acceso a la BD de producción desde el repo.** No puedo responder con dato real y
no lo voy a inventar. **Se requiere medición del dueño/DBRE.** Consultas sugeridas (SQL):

```sql
SELECT 'FireExtinguishers' AS T, COUNT(*) FROM FireExtinguishers
UNION ALL SELECT 'Hydrants', COUNT(*) FROM Hydrants
UNION ALL SELECT 'SmokeDetectors', COUNT(*) FROM SmokeDetectors
UNION ALL SELECT 'ManualCallPoints', COUNT(*) FROM ManualCallPoints
UNION ALL SELECT 'Equipment', COUNT(*) FROM Equipment;
-- OS por equipo (histórico)
SELECT MachineryId, COUNT(*) FROM ServiceOrders GROUP BY MachineryId ORDER BY COUNT(*) DESC;
```

**Sin este dato, el umbral "decenas vs cientos" es supuesto, no hecho.** Lo marco como
dependencia bloqueante para dimensionar la Etapa 3.

### R7 — Regla `?` para nullable (responde P7)

No encontré un documento canónico vigente de "Nullable<T> vs referencia" en
`conventions/` (la búsqueda no devolvió norma activa). **No lo invento.** Propuesta
conservadora y coherente con el repo: usar **tipos referencia nullable solo donde el repo ya
lo hace** (`string` sin `?`, `Guid?`/`DateOnly?` con `?`), porque el proyecto tiene
`<Nullable>disable</Nullable>` (verificado en `LuxuryApp.Api.csproj`). Es decir: **seguir la
convención existente**, y si existe una decisión de gobernanza, alinearse a ella — pido el
enlace para citarla.

### R8 — Renombrado F5 (responde P8)

**Acepto C8: no es "higiene pura".** `NameMachinery`→`Name` y `Ubication`→`Location` tocan
DTOs, endpoints y front (ej. `MachineryDTO`, `MachineryMapper`, reportes PDF de
`ServiceOrderAppService`). **Decisión: se difiere fuera del alcance** de las Etapas 1–3. No se
renombra nada en este plan; queda registrado como deuda opcional posterior.

---

## 9. Réplica a la recomendación por etapas

**Acepto las tres etapas y el recorte de alcance.** Mis precisiones:

- **Etapa 1:** conforme. Añado que `AssetQrLabel` debe nacer **tenant-aware** (validar
  `CustomerId` en servicio) porque no hay filtro automático de tenant.
- **Etapa 2:** conforme con **TPT ligero** (mi recomendación R1), asumiendo que se confirma la
  necesidad de FK real. Si el negocio renuncia a FK real, TPC + validador.
- **Etapa 3:** conforme **piloto en fuego**. Añado: `ServiceOrderAsset` es **snapshot**
  (corrige C5) y `MachineryId` se **deprecia, no se anula** (corrige C3).
- **Diferido:** conforme con todo (inspección, bitácora `AssetLogBase`, Pool/Meter vía `IAsset`).

**Contra C7 (mezcla inspección con mantenimiento):** de acuerdo en el fondo. La agrupación por
lote aplica **primordialmente a OS/calendario** (recarga/prueba hidrostática), no a la
inspección frecuente interna (que en fuego ya está resuelta por paquete). Mi §6bis mezcló
ambos ejes; lo corrijo.

**Contra C1 (mezcla tres riesgos):** de acuerdo; de ahí la separación por etapas.

---

## 10. Validación del arquitecto (ronda 2)

**Veredicto: aceptado con 3 condiciones.** Etapa 1 puede iniciar sin esperar P6; Etapas 2–3 quedan condicionadas.

### 10.1 Verificado contra el código

| Afirmación del autor                                        | Resultado | Evidencia                                                                                                                                                                                                                                                                                                                 |
| :---------------------------------------------------------- | :-------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| TPC explícito                                               | ✅        | `ApplicationDbContext.cs:3237-3243`.                                                                                                                                                                                                                                                                                      |
| `ITenantEntity` es marca, sin filtro automático de tenant   | ✅        | Todos los `HasQueryFilter` del contexto (`:3249-3269`, `:3321-3451`) son de `ISoftDeletable`/`DeletedAt`. Ninguno filtra por `CustomerId`. (El conteo "8 entidades" no lo verifiqué; es irrelevante para la conclusión.)                                                                                                  |
| `<Nullable>disable</Nullable>`                              | ✅        | `LuxuryApp.Api.csproj:11` y `LuxuryApp.Application.csproj:5` (el autor solo citó el primero).                                                                                                                                                                                                                             |
| Cabecera vs detalle de `ServiceOrder` (R4)                  | ✅        | Coherente con `ServiceOrder.cs`. Falta definir los campos de cabecera derivados (ver condición 3).                                                                                                                                                                                                                        |
| "XOR no es expresable de forma portable en SQL Server" (R2) | ❌        | Sí lo es: `CHECK ((A IS NULL AND B IS NOT NULL) OR (A IS NOT NULL AND B IS NULL))`, válido en SQL Server y PostgreSQL (migración en curso). **Rechazar el dual sigue siendo correcto, pero por otras razones:** null-checks en todos los consumidores y dos caminos de código. Corregir la justificación en el documento. |

### 10.2 Respuesta a P7 (regla `?`)

Sí existe registro de gobernanza: `conventions/backend/backend-rules.md:423-434` y `conventions/changelog.md:7`.
La regla "PROHIBIDO `?`" **no distingue** tipos de referencia de `Nullable<T>`; la decisión está **pendiente**. Estado de facto:
`Guid?`/`DateOnly?`/enum? son legítimos en EF (~1232 usos, el gate los reporta como informativos), y `string` nunca lleva `?`.
**Para este plan:** las columnas nuevas nullable usan `Guid?`/`DateOnly?` (definen NULL en BD); las de texto, `string` sin `?`. No bloquea Etapa 1.

### 10.3 Condiciones de aceptación

1. **El shim de `MachineryId` tiene un hueco.** `ServiceOrder.MachineryId` y `MaintenanceCalendar.MachineryId` son FK a `Equipment` y no nulas. Un lote de extintores **no puede** poblarlas ("primer activo" no sirve: un extintor no es `Equipment`).
   - Por tanto la columna **sí debe ser nullable en BD** para OS/calendarios de lote.
   - "Deprecar, no anular" queda como: nullable en BD, marcada legacy, **no leída por código nuevo** (el código nuevo lee `ServiceOrderAsset`). Los null-checks quedan confinados a lectores legacy.
   - El autor debe reformular R2 con esto, no como "sin nullable".
2. **TPT ligero: definir fuente única de verdad.** Si `Assets` duplica `Name`/`LocalCode` de las tablas concretas, hay riesgo de deriva (doble escritura).
   - **Recomendación:** `Assets` mínima = `Id`, `CustomerId`, `AssetType`. Relación **1:1 con PK compartida** desde cada tabla concreta (registro de identidad), **sin** herencia EF adicional; las columnas comunes viven en las tablas concretas vía clase base C# sin tabla.
   - Requiere que el alta de todo activo cree su fila en `Assets` en la misma transacción (invariante a probar) y backfill de `Assets` para los activos existentes conservando el mismo `Id`.
   - Ajusta lo propuesto en §5 Etapa 2 (donde figuraban `Name` y `LocalCode`).
3. **Agregados de cabecera derivados.** Al mover `EquiposOperando`, estado y observaciones al detalle, la cabecera conserva `CumplimientoActividades`, `EquiposOperando`, `OcacionoDanos` y `CalidadTrabajos` (los consumen reportes y PDF). Definir su regla de derivación (p. ej. `EquiposOperando = todos los items operando`) y **no** duplicar el dato sin regla.

### 10.4 Dependencias abiertas

| Dependencia                                                   | Bloquea             | Responsable      |
| :------------------------------------------------------------ | :------------------ | :--------------- |
| Volumen en producción (SQL de R6)                             | Dimensionar Etapa 3 | Dueño / DBRE     |
| Confirmar si el negocio necesita FK real a "cualquier activo" | Decisión de Etapa 2 | Dueño del módulo |
| Corregir R2 (condición 1) y justificación XOR (10.1)          | Cierre de la adenda | Agente autor     |

---

## 6bis. Ronda 2 — Datos reales de producción (respuesta a P6)

Fuente: `Resultados1.csv`, `Resultados2.csv` (misma carpeta).

### 6bis.1 Volumen por tabla (hecho, no supuesto)

| Activo | Registros | Comentario |
|:---|---:|:---|
| `FireExtinguishers` | **733** | Confirma "cientos". |
| `Hydrants` | **0** | Inventario hidrantes **vacío**: no hay datos legacy que migrar. |
| `SmokeDetectors` | **1946** | El mayor; "cientos" se queda corto. |
| `ManualCallPoints` | **188** | |
| `Equipment` | **5086** | El inventario general ya es grande. |
| **Total activo** | **7 953** | Cardinalidad real del universo. |

### 6bis.2 OS por equipo (`MachineryId`) — corregido en ronda 3 (§11.2)

Datos reales verificados de `Resultados2.csv`:

| Métrica | Valor |
|:---|---:|
| Equipos con OS | **1 764** |
| OS en total | **16 002** |
| Equipos con 1 OS | **425** |
| Equipos con ≥10 OS | **417** |
| Equipos con ≥20 OS | **170** |
| Equipos con ≥50 OS | **87** |
| Máximo por equipo | **80** |

La distribución es de **cola larga**: no es "casi todas 2–10" (eso fue una mala lectura mía de
la ronda anterior). Muchos equipos tienen 1 OS y una minoría concentra decenas.

**Alcance del hallazgo (corregido, §11.2):** **16 002 OS no son presión de volumen para la
base de datos**; es un tema de **listados/UX**. Se mantiene **fuera del alcance** de las
Etapas 1–3 y **no** es driver de diseño. Solo se anota como **requisito de no regresión** de
los listados actuales de OS.

### 6bis.3 Implicaciones sobre las preguntas

- **P6 → respondida.** Volumen confirmado: 7 953 activos; el enfoque "por lote" es
  **imprescindible** para fuego (733 + 1946 + 188 = **2 867** solo en fuego).
- **Hidrantes = 0** sirve para validar **esquema y flujo**, pero **no** backfill con datos
  reales (ver §11.3, dos pilotos en secuencia).
- **`ServiceOrderAsset` — índices (corregido, §11.2):** el período (`RequestDate`) vive en la
  **cabecera** `ServiceOrder`. Por tanto `ServiceOrderAsset` indexa por **`ServiceOrderId`** y
  por **`AssetId`**; el filtro por período se resuelve en la cabecera. "Índice por período" en
  la tabla de detalle era impreciso.

---

## 6ter. Ronda 2 — Correcciones aceptadas del arquitecto

El arquitecto corrigió puntos de mi §8 y los **acepto**:

| Corrección | Mi respuesta |
|:---|:---|
| XOR **sí** es portable (`CHECK ((A IS NULL AND B IS NOT NULL) OR (...))`, válido SQL Server y PostgreSQL). | Aceptado. Rechazo el dual igual, pero **por los null-checks en todos los consumidores y dos caminos de código**, no por portabilidad. |
| **Hueco del shim**: `MachineryId` es FK no nula a `Equipment`, y **un extintor no es `Equipment`**. Un lote no puede poblar `MachineryId` ni con "primer activo". | Aceptado. **Corrijo:** en OS/calendario de lote, `MachineryId` **debe ser nullable en BD**. "Deprecar, no anular" solo aplica a OS de equipo; los lectores legacy asumen el null-check. |
| **TPT ligero sin fuente única**: mi `Assets` con `Name`/`LocalCode` duplicaría datos. | Aceptado. Nueva propuesta: `Assets` **mínima** (`Id`, `CustomerId`, `AssetType`) con **PK compartida 1:1**, sin herencia EF adicional. Todo alta de activo crea su fila en `Assets` **en la misma transacción**. |
| **Campos derivados**: `EquiposOperando`, `CumplimientoActividades`, `OcacionoDanos`, `CalidadTrabajos` los consumen reportes/PDF. | Aceptado. **Falta una regla de derivación** desde los items (ej. `EquiposOperando = todos los items operando`). La dejo explícita como requisito. |
| **P7**: la regla existe en `backend-rules.md:423-434` y `changelog.md:7`. | Aceptado. De facto: `Guid?`/`DateOnly?` válidos; `string` nunca con `?`. **No bloquea Etapa 1.** |

---

## 10bis. Regla de derivación de campos de cabecera de `ServiceOrder` (cierra condición 3)

Campos que permanecen en la **cabecera** (`ServiceOrder`) y se **derivan** del detalle
(`ServiceOrderAsset`) cuando la OS es de lote. Para OS de equipo individual, el valor se sigue
capturando directo (comportamiento actual, sin cambio).

| Campo cabecera | Regla de derivación desde `ServiceOrderAsset` | Reemplazo si no hay items |
|:---|:---|:---|
| `CumplimientoActividades` | `true` si **todos** los items con `Status = Concluido` y `ActivitiesCompleted = true` | valor actual (OS individual) |
| `EquiposOperando` | `true` si **todos** los items tienen `Operating = true` | idem |
| `OcacionoDanos` | `true` si **algún** item tiene `CausedDamage = true` | idem |
| `CalidadTrabajos` | `true` si **todos** los items tienen `QualityOk = true` | idem |

**Reglas adicionales:**
- La cabecera **no** se edita manualmente cuando la OS es de lote: es **derivada**. En OS de
  equipo sigue siendo editable (compatibilidad).
- `Status` de cabecera: `Concluido` solo si **todos** los items están cerrados; si hay mixtos,
  permanece `Proceso`.
- `Price` de cabecera = **total** del servicio (suma de `ServiceOrderAsset.Price` si está
  prorrateado; si no, capturado directo).
- **No duplicar sin regla:** ningún campo de cabecera se llena a mano y a la vez por items.

**Consumidores verificados que obligan a mantener el campo en cabecera:** reportes PDF
(`ServiceOrderAppService.GenerateEquipmentPdf`) y listados/reportes de mantenimiento leen estos
agregados desde la OS.

---

## 11. Validación del arquitecto (ronda 3)

**Veredicto: ronda 2 cerrada; §6bis y §6ter aceptados con 4 correcciones al texto.** Las 3 condiciones de §10.3 quedan cumplidas en §6ter.

### 11.1 Verificado contra los CSV

| Afirmación del autor (§6bis)                               | Resultado | Dato real                                                                                                                                                        |
| :--------------------------------------------------------- | :-------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Volúmenes de `Resultados1.csv` (733 / 0 / 1946 / 188 / 5086) | ✅        | Coinciden. Total 7 953; fuego 2 867.                                                                                                                             |
| Top de OS por equipo (80, 79, 78, 77, 76…)                 | ✅        | Coincide.                                                                                                                                                        |
| "La lista llega a **1 302 filas**, casi todas con 2–10 OS" | ❌        | `Resultados2.csv` tiene **1 764 equipos con OS** y **16 002 OS** en total. **425 tienen 1 OS, 417 tienen ≥10, 170 ≥20 y 87 ≥50.** No es "casi todas 2–10": la distribución es de cola larga. |

### 11.2 Correcciones al texto de §6bis / §6ter

1. **§6bis.2:** reemplazar "1 302 filas, casi todas 2–10" por los datos de 11.1 (1 764 equipos, 16 002 OS, cola larga).
2. **§6bis.2 sobredimensiona el hallazgo.** 16 002 OS en total y un máximo de 80 por equipo **no son presión de volumen para la BD**; es un tema de listados/UX. Se mantiene fuera del alcance de las Etapas 1–3 (no es driver de diseño); solo se anota como requisito de no regresión de los listados actuales.
3. **§6bis.3, "índice por período" en `ServiceOrderAsset`:** imprecisa. El período (`RequestDate`) vive en la cabecera `ServiceOrder`. `ServiceOrderAsset` necesita índices por `ServiceOrderId` y por `AssetId`; el filtro por período se resuelve en la cabecera.
4. **Estado final del autor:** dice que solo falta "la decisión de negocio sobre FK real para **arrancar Etapa 1**". Incorrecto: **Etapa 1 no depende de esa decisión** (solo Etapa 2). Etapa 1 puede arrancar ya.

### 11.3 Sobre el "piloto limpio" con `Hydrants = 0`

Es válido para **validar esquema y flujo** (cero datos que preservar, cero riesgo). **No valida** backfill ni comportamiento con datos reales, que es lo que más puede fallar. Recomendación:

- **Piloto A:** `Hydrants` (vacío) para esquema, alta transaccional en `Assets` y flujo de `ServiceOrderAsset`.
- **Piloto B:** `ManualCallPoints` (188, el menor con datos) para backfill real y verificación de conteo `origen == destino`.
- Solo tras B se toca `FireExtinguishers` (733) y `SmokeDetectors` (1 946).

Con 7 953 activos el backfill de `Assets` es trivial en tamaño; el riesgo es de corrección, no de rendimiento.

### 11.4 Dependencias abiertas (actualizadas)

| Dependencia                                                     | Bloquea               | Estado    |
| :-------------------------------------------------------------- | :-------------------- | :-------- |
| Volumen en producción (P6)                                      | Dimensionar Etapa 3   | ✅ Cerrada |
| Corregir R2 y justificación XOR                                 | Cierre de adenda      | ✅ Cerrada (§6ter) |
| Corregir §6bis.2 / §6bis.3 (11.2) y estado final                | Cierre de adenda      | Pendiente (autor) |
| Confirmar si el negocio necesita FK real a "cualquier activo"   | **Solo Etapa 2**      | Pendiente (dueño del módulo) |
| Definir regla de derivación de campos de cabecera de `ServiceOrder` | Diseño de Etapa 3 | Pendiente (autor) |

---

## 12. Validación del arquitecto (ronda 4)

**Veredicto: las 4 correcciones de §11.2 están bien aplicadas. La regla de derivación (§10bis) se acepta como borrador de Etapa 3, con 4 huecos que deben cerrarse antes de implementarla.** No bloquea Etapa 1.

### 12.1 Huecos en §10bis

1. **Dos fuentes de verdad en OS de equipo (viola su propia regla "no duplicar sin regla").** Con el modelo uniforme, toda OS tiene ≥1 `ServiceOrderAsset` (incluidas las de equipo, por backfill). §10bis dice que en OS de equipo la cabecera "sigue editable" y en OS de lote es derivada, pero no define el **discriminador**. Si una OS de equipo tiene cabecera editable **y** un item con `Operating`/`QualityOk`, ¿cuál manda?
   - Definir un discriminador explícito en `ServiceOrder` (p. ej. `IsBatch` o `Scope`), y que en OS de equipo los campos del item backfilleado queden **sin uso** (shim), no en paralelo.
2. **`Price` con dos modos.** "Suma de items si está prorrateado; si no, capturado directo" son dos fuentes para el mismo campo. Un proveedor factura el lote completo, así que el total es dato **primario de cabecera**. Regla propuesta: `Price` de cabecera se captura; `ServiceOrderAsset.Price` es prorrateo opcional con validación `suma de items == cabecera` cuando existan. No derivar `Price` de los items.
3. **Estados mixtos sin definir.** "Todos cerrados" no dice qué cuenta como cerrado: `Status` incluye `Pendiente`, `Concluido`, `Denegado`, `Proceso` (`Shared/Enums/Status.cs`) y otros. ¿Un item `Denegado` o cancelado bloquea `Concluido` en cabecera? Definir el conjunto de estados terminales.
4. **Semántica de "todos" con items pendientes.** `EquiposOperando = todos Operating = true` es engañoso mientras haya items sin reportar (bool no nullable). Derivar los agregados **solo cuando todos los items estén en estado terminal**; antes de eso, la cabecera conserva el valor por defecto y no debe leerse como resultado.

### 12.2 Precisiones menores

- Los campos `ActivitiesCompleted`, `Operating`, `CausedDamage`, `QualityOk` aparecen en §10bis pero **no** estaban en R4 ni en el esquema propuesto de `ServiceOrderAsset`. Deben quedar en el esquema de Etapa 3 con nombres en inglés (regla anti-Spanglish); los de cabecera conservan su nombre actual.
- Los consumidores de estos campos son 5 archivos (`ServiceOrder.cs`, `ServiceOrderDTO.cs`, `UpdateServiceOrderDTO.cs`, `ServiceOrderAppService.cs`, `EquipmentInspectionExecutionAppService.cs`; 28 ocurrencias). Es un alcance acotado y verificable; anotarlo como lista de auditoría de Etapa 3.

### 12.3 Dependencias abiertas

| Dependencia                                                        | Bloquea             | Estado                       |
| :----------------------------------------------------------------- | :------------------ | :--------------------------- |
| Cerrar los 4 huecos de §12.1                                       | Diseño de Etapa 3   | Pendiente (autor)            |
| Confirmar si el negocio necesita FK real a "cualquier activo"      | **Solo Etapa 2**    | Pendiente (dueño del módulo) |
| Todo lo demás de §11.4                                             | —                   | ✅ Cerrado                   |

---

## 7. Registro de revisión

| Fecha      | Actor            | Acción                                                                                                                                                               | Resultado                           |
| :--------- | :--------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :---------------------------------- |
| 2026-09-26 | Arquitecto (rev) | Adenda creada con hallazgos C1–C8 y P1–P8                                                                                                                            | Abierta                             |
| 2026-09-26 | Agente (autor)   | Respondidas P1–P8 (§8) + réplica a etapas (§9). Aceptados C1–C8.                                                                                                     | Pendiente validación del arquitecto |
| 2026-09-26 | Arquitecto (rev) | Validación ronda 2 (§10): afirmaciones verificadas; 1 justificación falsa (XOR), 1 hueco (shim `MachineryId`), 2 precisiones (Assets mínima, agregados de cabecera). | Aceptado con 3 condiciones          |
| 2026-09-26 | Agente (autor)   | Ronda 2: P6 respondida con CSV (§6bis) y correcciones aceptadas (§6ter).                                                                                             | Pendiente validación del arquitecto |
| 2026-09-26 | Arquitecto (rev) | Validación ronda 3 (§11): CSV verificados; distribución de OS mal descrita, "índice por período" imprecisa, dependencia de Etapa 1 errónea, piloto Hydrants insuficiente solo. | Aceptado con 4 correcciones de texto |
| 2026-09-26 | Agente (autor)   | Ronda 3 aplicada: §6bis.2/§6bis.3 corregidos (cola larga, fuera de alcance, índices por `ServiceOrderId`/`AssetId`); regla de derivación de cabecera añadida (§10bis). | Cerrada |
| 2026-09-26 | Arquitecto (rev) | Validación ronda 4 (§12): correcciones de §11.2 OK; §10bis aceptado como borrador con 4 huecos (discriminador, `Price`, estados terminales, agregados con items pendientes). | Aceptado con 4 huecos (solo Etapa 3) |
|            |                  |                                                                                                                                                                      |                                     |

---

> **Estado:** ronda 4 validada (§12). Sin cambios de código ni migraciones. **Etapa 1 lista para planificar (no depende de la decisión de FK real ni de §10bis).** Pendiente: 4 huecos de §10bis (solo Etapa 3) y decisión de negocio sobre FK real (solo Etapa 2).
