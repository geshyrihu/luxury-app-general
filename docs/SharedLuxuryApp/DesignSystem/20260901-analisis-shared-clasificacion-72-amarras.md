📍 **Ruta:** 📂 `docs/plans/execution` > 📄 `CLASIFICACION-72-AMARRAS.md`

📅 **Fecha:** 08-Ago-2026
🧠 **Autor:** Claude (supervisor) — análisis, no ejecución
🎯 **Para:** desbloquear el runbook de la Fase 2

---

# 🔗 Clasificación de las 72 amarras entre portales

Insumo obligatorio de la Fase 2. Sin esta clasificación no se puede escribir un runbook ejecutable:
no se le puede decir a un agente *"resuelve la amarra #47"* sin saber qué es.

---

## 1. Resultado

| Caso | Qué es | Amarras | Riesgo |
| :--- | :--- | ---: | :--- |
| 🗑️ **MUERTO** | Viven en código que nadie usa | **2** | 🟢 Ninguno |
| **A** | Tipos, enums, interfaces, DTOs → `core/interfaces/` | **12** | 🟢 Mecánico |
| **A-serv** | Servicios de infraestructura → `core/services/` | **4** | 🟢 Mecánico |
| **B** | UI genérica → `shared/ui/` | **2** | 🟡 Bajo |
| **D** | La pieza está en el portal equivocado | **3** | 🟡 Medio |
| **C** | Componentes de negocio compartidos | **49** | 🔴 Requiere decisión |
| | **TOTAL** | **72** | |

> ✅ **23 de 72 (32%) son mecánicas y sin riesgo.** Se pueden cerrar sin decisiones de negocio.
> Las 49 restantes son el trabajo de fondo, y ahí sí hay que decidir portal por portal.

---

## 2. 🗑️ MUERTO — 2 amarras, y algo más grande detrás

**Hallazgo:** el portal de RRHH tiene **dos** módulos de empleados:

| Carpeta | Estado | Evidencia |
| :--- | :--- | :--- |
| `expediente-del-empleado/employees/` | ✅ **Vivo** | Referenciado por `routing/directory.routing.ts:55` |
| `expediente-del-empleado/hr-employees/` | 🗑️ **Muerto — 62 archivos** | **Cero** referencias externas (verificado archivo por archivo) |

`hr-employees/` es un duplicado abandonado de `employees/`. Contiene **2 de las 72 amarras**, que
desaparecen gratis al borrarlo.

> ⚠️ **Verificar antes de borrar.** El chequeo fue: para cada `.ts` de `hr-employees/`, buscar
> referencias fuera de esa carpeta → 0 resultados. Aun así, un borrado de 62 archivos merece una
> segunda confirmación (build + navegación de RRHH) antes de commitear.

---

## 3. 🔍 Hallazgo colateral: 4 imports rotos

Durante el análisis aparecieron **4 imports que apuntan a archivos inexistentes**:

| Import roto | En |
| :--- | :--- |
| `…/task-engine/tasks/services/date-range-storage.service` | operations |
| `…/vacancy-requests/components/solicitud-vacante-form` | reclutamiento |
| `…/employee-internal/services/employee-internal.service` | recursos-humanos |
| `…/providers/provider/pages/employee-provider-form` | supplier |

**Todos apuntan a subcarpetas `services/`, `components/`, `pages/`** — las carpetas envoltorio que
se eliminaron en la migración Feature Flat anterior. Los archivos subieron de nivel y estos imports
nunca se actualizaron.

**Por qué el build no falla:** viven en archivos que nadie importa (código muerto). Es la misma
raíz que el punto 2.

> 💡 Esto sugiere que puede haber **más código muerto** del detectado. Vale la pena un barrido
> de archivos no referenciados antes de la Fase 3.

---

## 4. Caso A — Tipos (12 amarras) → `core/interfaces/`

El más barato y el de mayor rendimiento.

| Símbolo | Veces | Vive hoy en | Consumido por |
| :--- | ---: | :--- | :--- |
| `EDocumentType` | **7** | `legal/…/interfaces/document-type.enum` | operations (5), committee (2) |
| `PresupuestoContabilidadResponse` + modelo | 3 | `cobranza/…/interfaces/presupuesto-contabilidad.model` | contabilidad |
| `documentTypeRoutesConfig` | 1 | `legal/…/interfaces/` | operations |
| `IWorkPosition` | 1 | `reclutamiento/…/work-position/interfaces/` | recursos-humanos |

**Acción:** mover el archivo a `core/interfaces/` y actualizar los imports. Sin lógica que romper.

> 🔑 `EDocumentType` solo ya son **7 amarras** — casi el 10% del total en un archivo.

---

## 5. Caso A-serv — Servicios de infraestructura (4 amarras) → `core/services/`

| Símbolo | Veces | Vive hoy en | Por qué debe moverse |
| :--- | ---: | :--- | :--- |
| `ExcelExportService` | 2 | `contabilidad/general-ledger/presupuesto-propuesta/` | Exportar a Excel no es contabilidad. Está enterrado dentro de una funcionalidad de presupuestos |
| `PdfGenerationService` | 1 | `supplier/po/generator-pdf/` | Generar PDF no es de proveedores |
| `EmployeeInternalService` | 1 | `recursos-humanos/…/employee-internal/` | Consumido desde fuera de RRHH |

---

## 6. Caso B — UI genérica (2 amarras) → `shared/ui/`

| Símbolo | Veces | Vive hoy en |
| :--- | ---: | :--- |
| `TaskDateRangeSelector` | 2 | `operations/task-engine/tasks/task-date-range-selector/` |

Un selector de rango de fechas no tiene nada de "tareas". Es un control genérico.

**Candidatos a revisar (no clasificados aquí a propósito):** `CardEmployee` (**8 amarras**, la pieza
más importada de todo el sistema), `TarjetaProducto` (2), `TarjetaProveedor` (1). Son presentacionales
pero con forma de dominio — la decisión de si van a `shared/ui/` o a un lugar compartido de negocio
se toma en la Fase 2, no aquí.

---

## 7. Caso D — La pieza está en el portal equivocado (3 amarras)

**El clúster `work-position`.** Vive en **reclutamiento**, lo consume **recursos-humanos**:

| Símbolo | Vive en | Lo usa |
| :--- | :--- | :--- |
| `WorkPositionForm` | reclutamiento | recursos-humanos |
| `WorkPositionHours` | reclutamiento | recursos-humanos |
| `JobDescriptionForm` | reclutamiento | recursos-humanos |
| *(`IWorkPosition`, contado en el caso A)* | reclutamiento | recursos-humanos |

> 💡 **Un puesto de trabajo es un concepto de RRHH que Reclutamiento consume**, no al revés.
> La solución no es compartirlo ni duplicarlo: es **moverlo a RRHH e invertir la dependencia**.
> Cada caso D revela dónde debería estar la frontera real.

---

## 8. Caso C — Negocio compartido (49 amarras)

El trabajo de fondo. Distribución por portal **dueño** de la pieza compartida:

| Portal dueño | Amarras | Clúster principal |
| :--- | ---: | :--- |
| `supplier` | 11 | Órdenes de compra (`OrdenCompra`, `CreateOrdenCompraWizard`, `PaymentVoucherModal`…) consumidas por contabilidad |
| `recursos-humanos` | 8 | `CardEmployee` (8x) — la pieza más importada del sistema |
| `direccion` | 8 | Minutas de junta (`MinutaDetalleForm` 4x, `MeetingSeguimientoEdit` 3x) consumidas por contabilidad y legal |
| `mantenimiento` | 6 | Equipos y maquinaria (`FichaTecnicaActivo`, `EquiposList`, `ActivosForm`…) |
| `reclutamiento` | 6 | Solicitudes (vacante, alta, baja, modificación salarial) |
| `operations` | 4 | — |
| `legal` | 3 | `TicketLegalForm`, `DocumentoPersonalizadoForm` |
| `contabilidad` | 2 | `ContMinutaSeguimientos` |
| `cobranza` | 1 | `CobranzaOnlineResumen` |

**Tres clústeres concentran 27 de las 49.** No son 49 problemas sueltos: son ~6 decisiones de
frontera que arrastran muchas amarras cada una.

---

## 9. Orden recomendado para la Fase 2

| Paso | Qué | Amarras | Por qué en este orden |
| :--- | :--- | ---: | :--- |
| 1 | Borrar `hr-employees/` (código muerto) | 2 | Gratis, y reduce ruido para todo lo demás |
| 2 | Arreglar/eliminar los 4 imports rotos | 0 | Higiene; evita confundir a quien venga después |
| 3 | Caso A — tipos a `core/interfaces/` | 12 | Mecánico, sin decisiones |
| 4 | Caso A-serv — servicios a `core/services/` | 4 | Mecánico |
| 5 | Caso B — `TaskDateRangeSelector` a `shared/ui/` | 2 | Bajo riesgo |
| 6 | Caso D — clúster `work-position` a RRHH | 3 | Primera inversión de dependencia; sirve de patrón |
| 7 | Caso C — clúster por clúster | 49 | Requiere decisión de negocio en cada uno |

> Tras el paso 6 quedarían **49 de 72** — el 32% cerrado sin ninguna decisión de negocio.

---

## 10. ⚠️ Advertencia sobre el caso C

> El riesgo **R-03** del plan es exactamente aquí: "resolver" un caso C moviendo lógica de negocio
> a `core/` para que el lint pase. Eso no desacopla nada — infla `core/` y crea **un monolito
> oculto dentro del monolito**.
>
> **Antes de mover una pieza de negocio a un lugar compartido, agotar el caso D:**
> ¿está en el portal correcto? Si dos portales se pelean por una pieza, casi siempre la frontera
> está mal trazada, no la pieza mal ubicada.
>
> Los casos C sin solución limpia se documentan como **deuda de frontera** y alimentan la Fase 3.
