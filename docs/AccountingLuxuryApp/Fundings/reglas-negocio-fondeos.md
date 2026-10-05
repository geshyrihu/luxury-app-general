# Análisis del Flujo de Fondeo (Funding Flow Analysis)

Este documento detalla el flujo de trabajo completo del módulo de **Fondeo** en LuxuryApp, desde la creación de una solicitud de fondeo hasta su finalización. Describe los roles de usuario involucrados, los estados por los que pasa un fondeo y las acciones disponibles en cada etapa.

## 1. Visión General del Proceso

El módulo de Fondeo está diseñado para agrupar, revisar, autorizar y gestionar el pago de múltiples órdenes de compra (OC). El proceso sigue un flujo de aprobación de varios pasos que involucra a diferentes roles dentro de la organización, garantizando un control financiero adecuado.

El flujo principal se puede resumir en los siguientes estados:

1.  **En Progreso (In Progress)**: El estado inicial. El fondeo se ha creado y está abierto para agregar o modificar órdenes de compra.
2.  **Validado (Verified)**: Un usuario con el rol de `Asistente` o `SuperUsuario` ha revisado el fondeo y ha confirmado que las órdenes de compra incluidas son correctas.
3.  **Autorizado (Authorized)**: Un usuario con el rol de `Administrador` o `SuperUsuario` ha dado la aprobación final para el pago del fondeo.
4.  **Confirmado (Confirmed)**: Un usuario del departamento de `Contabilidad` ha recibido el fondeo y ha iniciado el proceso de pago.
5.  **Completado (Completed)**: El fondeo ha sido pagado en su totalidad y el proceso ha finalizado.

## 2. Roles de Usuario Involucrados

- **Asistente (Assistant)**: Generalmente responsable de crear y preparar el fondeo, agregar las órdenes de compra y validarlo.
- **Administrador (Administrator)**: Responsable de revisar los fondeos validados y autorizarlos para el pago.
- **Contador (Accountant)**: Recibe los fondeos autorizados y los procesa para el pago, marcándolos como "confirmados".
- **SuperUsuario (SuperUser)**: Tiene permisos para realizar la mayoría de las acciones en el módulo, incluyendo la validación y autorización.
- **Gerente de Mantenimiento (Maintenance Manager)**: Es notificado en varias etapas del proceso.

## 3. Flujo Detallado del Proceso

### 3.1. Creación Automática y Listado de Fondeos

- **Acción**: El sistema crea automáticamente los períodos de fondeo necesarios (quincenales) para el mes actual y los meses adyacentes. Esto asegura que siempre haya un período de fondeo disponible para trabajar.
- **Vista**: `funding-list` (`/funding`)
- **Componente Angular**: `FundingList` (`funding-list.ts`)
- **Endpoint Backend**: `GET /api/funding/list/{customerId}`
- **Lógica**: El método `GetAllAsync` en `FundingAppService` no solo recupera los fondeos existentes, sino que también crea los que faltan para los períodos actuales, pasados y futuros definidos en `FundingHelper`.

### 3.2. Preparación del Fondeo (Estado: En Progreso)

- **Acción**: Un `Asistente` navega a un período de fondeo específico para comenzar a prepararlo.
- **Vista**: `funding-detail` (`/funding/details/{id}`)
- **Componente Angular**: `FundingDetail` (`funding-detail.ts`)
- **Endpoint Backend**: `GET /api/funding/details/{id}/{customerId}`
- **Lógica**:
  - En este estado, la vista de detalles (`DetailsAsync` en `FundingAppService`) muestra una **previsualización** de todas las órdenes de compra `Autorizadas` que coinciden con el período y el año del fondeo.
  - El `Asistente` puede:
    - **Crear nuevas Órdenes de Compra**: A través de un asistente (`CreateOrdenCompraWizard`), se pueden agregar nuevas OC al sistema, las cuales, una vez autorizadas, aparecerán en la previsualización del fondeo.
    - **Editar Datos de Pago**: Modificar la información bancaria de una OC.
    - **Eliminar Órdenes de Compra**: Quitar una OC del fondeo (y del sistema).
    - **Reordenar**: Cambiar el orden en que aparecen las OC.
    - **Validar Facturas (XML)**: El sistema valida automáticamente el total de las facturas XML contra el total de la OC, mostrando un indicador de estado.

### 3.3. Validación del Fondeo

- **Acción**: Una vez que el `Asistente` está satisfecho con las OC incluidas, hace clic en el botón **"VALIDAR FONDEO"**.
- **Botón**: Visible si `!isVerified() && !isConfirmed()`.
- **Endpoint Backend**: `GET /api/funding/validate/{id}`
- **Lógica**:
  - El método `ValidateFundingAsync` en `FundingAppService` cambia el estado del fondeo a `Validado`.
  - **Crucial**: En este punto, el sistema toma una "foto" de las OC elegibles y crea registros permanentes en la tabla `FundingDetail`, asociando formalmente esas OC con este fondeo.
  - Se envía una **notificación** a los `Administradores` y al `Gerente de Mantenimiento` para informarles que un fondeo está listo para su autorización.

### 3.4. Autorización del Fondeo

- **Acción**: Un `Administrador` o `SuperUsuario` revisa el fondeo validado y, si todo es correcto, hace clic en **"AUTORIZAR FONDEO"**.
- **Botón**: Visible si `isVerified() && !isAuthorized() && (isRolAdministrador || isRolSuperUsuario)`.
- **Endpoint Backend**: `GET /api/funding/authorize/{id}`
- **Lógica**:
  - El método `AuthorizeFundingAsync` cambia el estado a `Autorizado`.
  - Se envía una **notificación** a los `Contadores` y al `Gerente de Mantenimiento`, indicando que el fondeo está listo para ser procesado para pago.

### 3.5. Proceso Contable (Confirmación)

- **Acción**: Un `Contador` recibe la notificación, revisa el fondeo autorizado y comitenza el proceso de pago. Para registrar esto, hace clic en **"RECEPCIÓN CONTABLE"** (o una acción similar).
- **Botón**: (Lógica de UI específica para el rol de contador).
- **Endpoint Backend**: `GET /api/funding/confirm/{id}`
- **Lógica**:
  - El método `ConfirmFundingAsync` cambia el estado a `Confirmado`.
  - Esto actúa como un bloqueo: un fondeo confirmado ya no puede ser desautorizado o invalidado.
  - Se notifica a los `Administradores`, `Asistentes` y al `Gerente de Mantenimiento`.

### 3.6. Finalización del Fondeo (Completado)

- **Acción**: Una vez que todos los pagos han sido efectuados, el `Contador` marca el fondeo como completado.
- **Endpoint Backend**: `GET /api/funding/completed/{id}`
- **Lógica**:
  - El método `CompleteFundingAsync` establece la propiedad `InProgress` a `false`.
  - El fondeo se considera cerrado.

## 4. Acciones de Reversión

El sistema permite revertir los pasos de validación y autorización, siempre y cuando el proceso no haya avanzado a la siguiente etapa de bloqueo.

- **Revertir Validación**:
  - **Acción**: Un `Administrador` o `SuperUsuario` hace clic en **"REVERTIR VALIDACIÓN"**.
  - **Botón**: Visible si `isVerified() && !isAuthorized() && !isConfirmed()`.
  - **Endpoint Backend**: `GET /api/funding/unvalidate/{id}`
  - **Lógica**: El método `InvalidateAsync` elimina los registros de la tabla `FundingDetail` y revierte el estado a `En Progreso`. El fondeo vuelve a su modo de "previsualización".

- **Revertir Autorización**:
  - **Acción**: Un `Administrador` o `SuperUsuario` hace clic en **"REVERTIR AUTORIZACIÓN"**.
  - **Botón**: Visible si `isAuthorized() && !isConfirmed()`.
  - **Endpoint Backend**: `GET /api/funding/unauthorize/{id}`
  - **Lógica**: El método `RevokeAuthorizationAsync` revierte el estado a `Validado`, permitiendo que se realicen cambios antes de volver a autorizar. Se notifica a las partes interesadas.

## 5. Funcionalidades Adicionales

- **Generación de Archivos**:
  - **PDF del Fondeo**: Se puede generar un resumen en PDF del fondeo en cualquier momento (`GenerateFundingPdfAsync`).
  - **ZIP de Facturas**: Se pueden descargar todas las facturas PDF de un fondeo en un archivo ZIP (`GenerateFundingInvoicesZipAsync`).
  - **Solicitudes de Pago**: Se pueden generar y descargar masivamente las "Solicitudes de Pago" en formato PDF, que son documentos formateados para el proceso de pago interno (`GenerateBulkSolicitudesPagoZipAsync`).
  - **Exportación a Excel**: La vista de detalles se puede exportar a un archivo Excel.

- **Gestión de Pagos**:
  - En la tabla de detalles, se puede marcar una OC como **"Pagada"**.
  - Se pueden adjuntar y visualizar múltiples **comprobantes de pago** para cada OC.

- **Conciliación SAT**:
  - El sistema incluye una funcionalidad para **conciliar** las órdenes de compra con la información del SAT y **descargar masivamente los archivos XML**.

## 6. Diagrama de Flujo de Estados

```mermaid
graph TD
    A[En Progreso] -->|Validar| B(Validado);
    B -->|Autorizar| C(Autorizado);
    C -->|Confirmar (Contabilidad)| D(Confirmado);
    D -->|Completar (Pagado)| E(Completado);

    B -->|Revertir Validación| A;
    C -->|Revertir Autorización| B;
```
