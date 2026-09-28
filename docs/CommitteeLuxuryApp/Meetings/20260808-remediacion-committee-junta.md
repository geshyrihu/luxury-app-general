# Plan de Remediacion - PresentacionJuntaComite (Listado)

- **Fecha:** 2026-08-08
- **Autor:** Agente (Kilo)
- **Modulo afectado:** `client/luxuryapp/.../direccion.luxuryapp/juntas-comite/presentacion-junta-comite`
- **Tipo de tarea:** Remediacion frontend (§4.2 + §4.5 de CONVENTIONS.md)
- **Documentos rectores aplicados:** `CONVENTIONS.md`, `core/workflow-por-tipo-de-tarea.md`, `core/compliance-protocol.md`, `operations/plan-creation-protocol.md`, `frontend/frontend-rules.md`, `frontend/angular-signals-and-state.md`, `frontend/frontend-api-endpoints.md`
- **Estado:** Borrador para aprobacion Tech Lead
- **Cambio ya ejecutado en esta sesion:** Filtro de meses futuros (Fase 1), bug de filtro movil y Fase 2 (tipado `onGetList<...>` + distincion error/vacio con `loadError`/`loaded`).

---

## Fase 0. Pre-Planeacion (obligatoria)

### 0.1 Problem Statement + KPIs

```
Actualmente, el usuario de direccion sufre de "ruido en el listado" cuando
intenta revisar presentaciones de junta, lo que resulta en presentaciones de
meses futuros lejanos (ya creadas por adelantado) mezcladas con el periodo
operativo actual.
```

- **Requisito de negocio:** mostrar solo el mes corriente, el mes siguiente y todos los meses anteriores; excluir meses futuros mas alla del proximo.
- **KPIs:**

| KPI | Baseline | Target | Timeline |
|---|---|---|---|
| Registros fuera de ventana (corriente+1) visibles | todos los del customer | 0 | inmediato |
| Filtro global movil funcional | roto (computed no invocado) | funcional | inmediato |

### 0.2 Matriz de Reglas de Negocio (4 niveles)

- **RN-PJC-001 (Nivel 1 - Invariante):** El listado nunca debe exhibir periodos correspondientes a meses futuros mas alla del mes siguiente al corriente.
- **RN-PJC-002 (Nivel 2 - Flujo):** Toda accion (alta, carga PDF, eliminar, validar, enviar) debe refrescar la lista desde el backend (`onLoadData`) y respetar la ventana de RN-PJC-001.
- **RN-PJC-003 (Nivel 3 - Seguridad/Autorizacion):** La visibilidad de botones (cargar/validar/eliminar) depende de `AspRole` y del estado `archivoFinal`; el endpoint exige `RequireAuthorization`.
- **RN-PJC-004 (Nivel 4 - Validacion de Datos):** `fechaCorrespondienteFiltro` (`DateOnly`) es la fuente de verdad para recortar la ventana; el parseo debe ser inmune a zona horaria.

### 0.3 Pre-Mortem + Flujos

- **Pre-Mortem:** "Salio a produccion y el listado desaparecio". Causa probable: parseo de fecha con `new Date("yyyy-MM-dd")` en horario local negativo desplaza el mes. Mitigacion: parseo por partes (`split('-')`), sin `Date` UTC/local.
- **Happy path:** customerId presente → effect dispara `onLoadData` → `dataSignal` poblado → `filteredData` recorta futuros → template pinta.
- **Sad path:** API falla → `onGetList` retorna `null` → `dataSignal = []` → el `@empty` muestra "No hay presentaciones" (indistinguible de vacio real; ver Riesgos).
- **Edge path:** cambio rapido de customer → dos `onLoadData` en vuelo → posible pintado de customer anterior (Race condition; ver Fase 3).

---

## 1. Resumen Ejecutivo

El componente `PresentacionJuntaComite` carga todo el historial de presentaciones del customer sin ventana temporal, exponiendo periodos futuros lejanos. Se remedia con un `computed` de recorte en frontend (ventana corriente+siguiente+antecesores) y se corrigen defectos de visualizacion (filtro global movil, `@if` inutil). El plan tambien documenta deuda tecnica (tipado `any`, drift de contrato, recargas duplicadas, race condition, paginacion backend) para aprobacion en fases posteriores.

## 2. Objetivo

- Restringir el listado a la ventana temporal de negocio (RN-PJC-001).
- Corregir la visualizacion movil y el estado vacio.
- Dejar trazabilidad de los hallazgos restantes como remediacion por fases.

## 3. Alcance

- **En alcance:** `presentacion-junta-comite.ts` y `.html` (feature, no shared).
- **Fuera de alcance (requiere aprobacion/impacto):** endpoint `presentaciones-junta-comite/list/{customerId}` y su proyeccion en backend; la vista hermana `presentacion-junta-comite-contador` que consume el mismo endpoint. Por "No tocar shared sin control" y "No romper contratos sensibles", mover el filtro al backend es cambio de contrato y se propone como Fase 4 condicionada.

## 4. Restricciones

- No modificar `shared/ui`, `ApiResponseService`, `DataConnectorService`, `CustomerIdService` ni el contrato del endpoint sin plan de impacto aprobado.
- No introducir `any` productivo en estado principal (frontend-rules: prohibido cuando existe DTO/interface).
- No hardcodear estilos; el feature ya usa tokens via clases utilitarias del design system.
- No agregar comentarios en codigo (salvo que se pidan).

## 5. Fases y Checklist

### Fase 1 - Ventana temporal y bug movil (EJECUTADA en esta sesion)
- [x] Agregar `filteredData = computed<PresentacionJuntaComiteDTO[]>` que recorta meses > (corriente+1) usando `fechaCorrespondienteFiltro` parseado por partes.
- [x] Usar `filteredData()` en `@for`, `app-data-view-mobile [data]` y `@if (filteredData().length)`.
- [x] Corregir `[globalFilterFields]="globalFilterFields"` -> `globalFilterFields()` (bug movil: se pasaba el `computed` sin invocar, dejando el filtro global inoperante).
- [x] Quitar comentarios introducidos (cumplir "no comments").

### Fase 2 - Estado vacio y tipado (P1) - EJECUTADA
- [x] Reemplazar `onGetList(...).then((result: any) => ...)` por `onGetList<PresentacionJuntaComiteDTO[]>`.
- [x] Distinguir "sin registros" de "error de API": `onGetList` retorna `null` solo en fallo (exito vacio retorna `[]`); se senala con `loadError` y se muestra tarjeta de error en desktop y movil, sin pintar `@empty` en fallo.
- [x] Eliminar el `@if` redundante original: ahora el bloque se renderiza con `loaded()` (senal de carga), y el `@empty` "No hay presentaciones" solo aparece en vacio real.

### Fase 3 - Rendimiento y consistencia (P1) - EJECUTADA (frontend)
- [x] Eliminar doble `onLoadData` en `onValidarPresentacion`: `enviarMailPresentacionComite` ya recarga en su `.then`, se removio el `onLoadData()` redundante.
- [x] Race condition al cambiar customer: `onLoadData` captura el `customerId` al disparar y descarta la respuesta si ya no coincide con el `customerId` actual al resolver (ignora respuestas obsoletas de un customer anterior).
- [ ] Backend: `GetAllAsync` hace `ToListAsync()` sin paginacion ni proyeccion temprana; proponer `take`/paginacion -> **FUERA DE ALCANCE** (requiere aprobacion de impacto sobre contrato compartido, ver Fase 4 condicionada).

### Fase 4 - Contrato y deuda (P2) - EJECUTADA (frontend, salvo item condicionado)
- [x] Drift de contrato: eliminado `!item.applicationUserSupervisorContable` del `.html` (no existe en interfaz TS ni DTO backend).
- [x] `idAnterior` quitado de la interfaz `PresentacionJuntaComiteDTO` del feature (segun instruccion; en backend sigue comentado).
- [x] Alineacion de tipos: `enviarMailPresentacionComite(idJunta: string)`; parametros `id` de `onDeleteFile`, `onDeleteItem`, `onValidarPresentacion`, `onOnlyValidate` tipados como `string`.
- [x] Codigo muerto eliminado: `hasRole()`, `onValidarId()`, `onValidarCargasCompletasPorArea()`, `supervisorContable`, `applicationUserId`, inyecciones `confirmationService`/`dateS`, `ref`/`DynamicDialogRef`; imports duplicados `WebButtonLabelConfirm`/`WebButtonLabelViewPdf` y los imports `ConfirmationService`, `DateService`, `DynamicDialogRef`.
- [x] `aspRoleS.anyOf([...])()` por cada CD reemplazado por campos estables de la clase: `canAdmin`, `canContador`, `canSupervisionOperativa`, `canSuperUsuario` (computed expuestos una sola vez).
- [ ] (Opcional, condicionada, PENDIENTE) Promover el filtro de ventana al backend `GetAllAsync` para cubrir tambien la vista contador y reducir payload; requiere analisis de impacto por ser contrato compartido.

## 6. Criterios de Paso

- `filteredData` excluye todo registro con `fechaCorrespondienteFiltro` en mes > corriente+1, en desktop y movil.
- Filtro global movil efectivo sobre `filteredData`.
- `ng build` / `lint` (modo baseline) de `client/luxuryapp` sin violaciones NUEVAS.
- `node scripts/scan-mojibake.mjs client/angular/src` (y la ruta de luxuryapp si aplica) = 0 mojibake antes de commit.
- Sin `any` en el estado principal de la feature.

## 7. Riesgos y Mitigaciones

| Riesgo | Impacto | Mitigacion |
|---|---|---|
| Desplazamiento de mes por timezone en parseo de fecha | alto | parseo por partes `split('-')`, sin `Date` local |
| El `@empty` confunde error 500 con "sin registros" | medio | Fase 2: diferenciar fallo de vacio |
| Race condition al cambiar customer | medio | Fase 3: cancelacion/verificacion de customerId |
| Mover filtro a backend afecta vista contador (contrato) | alto | Fase 4 condicionada + aprobacion impacto |
| `anyOf([...])()` genera basura por CD | bajo | Fase 4: campos estables |

## 8. Dependencias / Impactos

- Backend: `PresentacionJuntaComiteAppService.GetAllAsync`, `PresentacionesJuntaComiteEndpoints.list` (solo si se ejecuta Fase 4 condicionada).
- Frontend hermano: `presentacion-junta-comite-contador` (mismo endpoint).
- Shared: ninguno en Fases 1-4 (solo feature frontend). El item condicionado de backend (Fase 4 opcional) queda pendiente de aprobacion.

## 9. Cierre Esperado

Listado acotado a la ventana de negocio, filtro movil funcional, deuda tipada y de contrato documentada y aprobada para cierre en Fases 2-4. El plan se da por cerrado cuando Fases 1-4 esten en el baseline de audit sin violaciones nuevas y el filtro de ventana sea unico y trazable a RN-PJC-001.

---

## Anexo - Trazabilidad de los hallazgos (origen en el analisis de codigo)

- Ventana temporal: `presentacion-junta-comite.ts:97` `onLoadData` -> `Endpoints.PresentacionJuntaComite.list` -> `PresentacionesJuntaComiteEndpoints.cs:17` (`GetAllAsync` sin recorte).
- Bug movil filtro: `presentacion-junta-comite.html` pasaba `globalFilterFields` (computed sin invocar) a `DataViewMobile.globalFilterFields` (`data-view-mobile.ts:80`, `filteredData` usa `.length` sobre funcion -> 0).
- Doble recarga: `presentacion-junta-comite.ts:170-175`.
- Drift `applicationUserSupervisorContable`: `presentacion-junta-comite.html:468` vs interfaz TS `PresentacionJuntaComiteDTO` y `PresentacionJuntaComiteDTO.cs`.
- `idAnterior`: `PresentacionJuntaComiteDTO.cs:70` comentado vs interfaz TS.
