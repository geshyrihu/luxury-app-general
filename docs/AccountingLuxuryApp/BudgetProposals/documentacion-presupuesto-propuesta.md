# Documentación del Módulo: Presupuesto Propuesta

## 1. Resumen General

El módulo **Presupuesto Propuesta** es una herramienta de colaboración en tiempo real diseñada para la elaboración de presupuestos anuales. Permite a los usuarios (principalmente del área de contabilidad) visualizar, editar y gestionar las partidas presupuestarias para un año fiscal futuro, comparándolas con los datos del año actual.

La característica principal es su capacidad de **actualización en tiempo real**. Cuando un usuario modifica una partida, el cambio se refleja instantáneamente en las pantallas de todos los demás usuarios que estén viendo la misma propuesta, gracias al uso de **SignalR**.

El frontend está construido con **Angular** y utiliza **Signals** para una gestión de estado moderna y reactiva, mientras que el backend está desarrollado en **.NET** siguiendo una arquitectura de servicios.

**Nota Importante sobre la Creación:** El proceso de **creación inicial** de una propuesta de presupuesto para un nuevo año fiscal no se gestiona a través de esta interfaz. Se presume que es una tarea administrativa realizada desde otro módulo o un proceso automatizado en el backend. Esta interfaz se enfoca exclusivamente en la **gestión y edición de una propuesta ya existente**.

---

## 2. Arquitectura Backend (.NET)

El backend sigue un patrón de **Controlador-Servicio**, separando las responsabilidades de la API de la lógica de negocio.

### Controladores Principales

Existen dos controladores que exponen los endpoints de la API:

1.  `BudgetProposalController`: Maneja las operaciones principales sobre la propuesta y sus partidas.
2.  `BudgetProposalItemSupportController`: Gestiona la información de soporte y los archivos adjuntos para partidas individuales.

### Endpoints de la API

#### BudgetProposalController (`/api/BudgetProposal`)

| Verbo  | Ruta                                                 | Acción                      | Descripción                                                                 |
| :----- | :--------------------------------------------------- | :-------------------------- | :-------------------------------------------------------------------------- |
| `GET`  | `?customerId={id}&fiscalYear={año}`                  | `GetProposals`              | Obtiene la propuesta de presupuesto completa para un cliente y año fiscal.  |
| `PUT`  | `/{itemId}`                                          | `UpdateProposalItem`        | Actualiza el monto propuesto de una partida presupuestaria específica.      |
| `POST` | `/{proposalId}/add-accounts`                         | `AddAccountsToProposal`     | Añade nuevas cuentas contables a una propuesta existente.                   |
| `DELETE` | `/item/{itemId}`                                     | `DeleteProposalItem`        | Elimina una partida de la propuesta.                                        |
| `GET`  | `/history/{itemId}`                                  | `GetItemHistory`            | Consulta el historial de cambios de una partida.                            |
| `GET`  | `/available-accounts/{...}`                          | `GetAvailableAspelAccounts` | Obtiene las cuentas contables que se pueden añadir a la propuesta.         |
| `GET`  | `/{proposalId}/fee-comparison`                       | `GetFeeComparison`          | Calcula y devuelve una comparación de cuotas de mantenimiento uniformes.    |
| `GET`  | `/{proposalId}/fee-comparison-by-indiviso`           | `GetFeeComparisonByIndiviso`| Calcula y devuelve una comparación de cuotas por indiviso.                  |

#### BudgetProposalItemSupportController (`/api/BudgetProposalItemSupport`)

| Verbo    | Ruta                     | Acción                                | Descripción                                                              |
| :------- | :----------------------- | :------------------------------------ | :----------------------------------------------------------------------- |
| `GET`    | `/{itemId}`              | `GetBudgetProposalItemWithSupport`    | Obtiene los detalles de una partida, incluyendo sus archivos de soporte. |
| `PUT`    | `/{itemId}/support-info` | `UpdateBudgetProposalItemSupportInfo` | Actualiza la descripción o información de soporte de una partida.        |
| `POST`   | `/support-files`         | `AddBudgetProposalItemSupportFiles`   | Sube archivos de soporte (adjuntos) para una partida.                    |
| `DELETE` | `/support-file/{fileId}` | `DeleteBudgetProposalItemSupportFile` | Elimina un archivo de soporte específico.                                |

---

## 3. Arquitectura Frontend (Angular)

El frontend está implementado como un único componente principal (`PresupuestoPropuesta`) que orquesta varias modales y diálogos.

### Componentes y Servicios Clave

-   **`presupuesto-propuesta.ts`**: Componente principal que contiene toda la lógica de la interfaz, manejo de estado y orquestación de eventos.
-   **`ApiResponseService`**: Un servicio **genérico y centralizado** utilizado en toda la aplicación para realizar las llamadas HTTP (GET, POST, PUT, DELETE) al backend. No hay un servicio específico para este módulo.
-   **`SignalRService`**: Gestiona la conexión con el hub de SignalR en el backend, permitiendo la recepción de eventos en tiempo real.
-   **`DialogHandlerService`**: Servicio para abrir diálogos y modales de forma estandarizada (ej. para ver historial, adjuntar soportes, etc.).

### Gestión de Estado y Reactividad

-   **Angular Signals**: El estado del componente (la lista de partidas, el estado de carga, la propuesta actual) se gestiona con `signal()`. Esto permite una reactividad muy eficiente.
-   **`effect()`**: Se utiliza un `effect` para reaccionar automáticamente a los cambios en el `customerId`, volviendo a cargar los datos de la propuesta cuando el usuario cambia de cliente.
-   **Inyección de Dependencias con `inject()`**: El componente utiliza la nueva función `inject()` para declarar sus dependencias de servicios, en lugar del `constructor` tradicional.

---

## 4. Flujo de Interacción (End-to-End)

A continuación, se describe el flujo de trabajo típico de un usuario editando una propuesta.

1.  **Navegación y Carga**:
    -   El usuario navega a la página de la propuesta de presupuesto.
    -   El componente `PresupuestoPropuesta` se inicializa.
    -   El `effect` detecta el `customerId` y llama al método `onLoadData()`.
    -   `onLoadData()` utiliza `ApiResponseService` para enviar una petición `GET` a `/api/BudgetProposal`.

2.  **Renderizado de Datos**:
    -   El backend devuelve el DTO `BudgetProposalDTO`, que contiene la propuesta y una lista de todas sus partidas (`items`).
    -   El frontend recibe los datos y actualiza los `signals` `currentProposal` y `allProposalItems`.
    -   La vista (HTML) reacciona a los cambios en los `signals` y renderiza la tabla con las partidas presupuestarias.

3.  **Edición de una Partida**:
    -   El usuario hace clic en un campo de "Monto Propuesto" de una fila y modifica su valor.
    -   El evento `(blur)` o `(change)` en el input dispara el método `updateProposalItem(item)`.
    -   El método `updateProposalItem` comprueba si el valor realmente ha cambiado para evitar llamadas innecesarias.
    -   Si hay un cambio, utiliza `ApiResponseService` para enviar una petición `PUT` a `/api/BudgetProposal/{itemId}` con el nuevo monto.

4.  **Actualización en Tiempo Real (SignalR)**:
    -   El backend (en `BudgetProposalService`) procesa la actualización, guarda el cambio en la base de datos y luego invoca un método en un Hub de SignalR (ej. `SendBudgetProposalItemUpdate`).
    -   El `SignalRService` en el frontend, que está escuchando eventos, recibe la partida actualizada.
    -   El servicio emite el evento a través de un `Subject` de RxJS (`budgetProposalItemUpdate$`).
    -   El componente `PresupuestoPropuesta`, suscrito a este `Subject`, recibe la partida actualizada en su método `handleBudgetProposalItemUpdate`.
    -   Este método actualiza el `signal` `allProposalItems` con la nueva información.
    -   La vista, al ser reactiva a los cambios del `signal`, actualiza la fila correspondiente en la tabla para **todos los usuarios conectados**, reflejando el cambio de forma instantánea.