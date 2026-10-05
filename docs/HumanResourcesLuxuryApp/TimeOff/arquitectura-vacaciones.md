# Módulo de Vacaciones: Documentación Técnica (Arquitectura Refactorizada)

Este documento describe la arquitectura técnica y los flujos de trabajo del módulo de gestión de vacaciones, reflejando la refactorización hacia un cálculo de balance en tiempo real, la gestión de adelantos y la validación estricta de saldos.

## 1. Arquitectura General

El sistema utiliza una **Fuente Única de Verdad (SSOT)**. El balance de vacaciones no se almacena como un estado mutable, sino que se calcula dinámicamente en cada consulta.

- **Fuente de Verdad para Días Otorgados:** Fecha de ingreso del empleado (`Employee.DateAdmission`) y tabla legal de la LFT.
- **Fuente de Verdad para Días Usados/Pendientes:** Solicitudes en la tabla `VacationRequest` (excluyendo rechazadas/canceladas).

### Backend (.NET)

- **Servicios Principales**:
  - `VacationCalculator`: Servicio inyectable que encapsula el cálculo de días hábiles (excluyendo domingos y festivos) y la tabla de días por antigüedad.
  - `VacationHelperService`: **Cerebro del módulo.** Calcula el balance en tiempo real (`GetBalanceRealTimeAsync`). Implementa la **Herencia de Adelantos**: si un empleado está en su Año 1, el servicio busca automáticamente las vacaciones tomadas en su Año 0 (periodo de adelanto) y las resta de su nueva bolsa de 12 días.
  - `SolicitudVacacionesService`: Gestiona el ciclo de vida de la solicitud. Implementa validaciones cruzadas:
    - **Validación de Periodo:** Determina el año de aniversario basado en la `StartDate` de la solicitud (no en la fecha actual).
    - **Validación de Saldo:** Impide guardar solicitudes que superen los `AvailableDays` (contando las que ya están en proceso `Pending`).
  - `AprobacionVacacionesService`: Gestiona el flujo de aprobación. Incluye notificaciones automáticas vía `HrNotificationCoordinatorService`.

### Frontend (Angular)

- **Componente de Saldo (`vacaciones-saldo`)**:
  - Muestra un desglose detallado: Días Totales, Usados (Normales vs Adelantados), En Proceso y Disponibles.
  - Permite navegar por años históricos de aniversario.
- **Formulario de Solicitud (`vacaciones-form`)**:
  - **Reactividad Dinámica:** Al cambiar la `Fecha de Inicio`, el formulario recalcula el periodo de aniversario y refresca el panel de saldo lateral. Si la fecha cae en un nuevo periodo (ej. salto de Año 0 a Año 1), el saldo se actualiza automáticamente.
  - **Validación en Tiempo Real:** El `DateRangeValidator` bloquea el botón de "Guardar" y muestra mensajes de error si se exceden los días disponibles o si hay solapamiento de fechas.

---

## 2. Reglas de Negocio Críticas

### a. Cálculo de Días Disponibles
La fórmula universal aplicada tanto en Backend como Frontend es:
**`AvailableDays = TotalDays (LFT) - UsedDays (Approved) - PendingDays (Pending)`**
*Nota: Los días `Pending` bloquean el saldo para evitar que el empleado solicite más días de los que tiene mientras su jefe decide.*

### b. Gestión de Adelantos (6-11 meses)
- El empleado puede pedir hasta **6 días** de adelanto (mitad del primer año).
- **Herencia Lógica:** Al cumplir el primer año, el sistema no otorga 12 días "limpios", sino que resta los días que el empleado ya gozó por adelantado en su Año 0.

### c. Referencia Temporal (Escenario 9)
La validación de días disponibles se hace contra el periodo de aniversario al que pertenece la **Fecha de Inicio** de las vacaciones. 
*Ejemplo:* Si ingreso en Agosto 2025 y en Enero 2026 pido vacaciones para Septiembre 2026, el sistema validará mi saldo contra el periodo 2026 (mi segundo año), no contra el actual.

---

## 3. Endpoints Principales

| Endpoint | Parámetros | Descripción |
| :--- | :--- | :--- |
| `GET /my-balance` | `?year=YYYY` | Balance real-time del periodo iniciado en YYYY. |
| `GET /available-years` | - | Lista de años de aniversario válidos para el empleado. |
| `POST /my-vacation-requests` | DTO (Start, End, Reason) | Crea solicitud vinculándola al periodo de su StartDate. |
| `PUT /approve` / `/reject` | ID, Reason | Procesa la solicitud y dispara notificaciones al empleado. |

---

## 4. Mantenimiento y Deuda Técnica
- El método `DecrementUsedVacationDays` en el helper está obsoleto y debe ignorarse.
- Las notificaciones de cancelación están pendientes de implementación (`AprobacionVacacionesService.CancelAsync`).
- La tabla física `VacationBalance` ya no debe usarse para lecturas de saldo; es meramente informativa/histórica.
