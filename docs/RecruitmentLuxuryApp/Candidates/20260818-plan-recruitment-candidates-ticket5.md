# Plan de Implementación: Ticket 5 - Fase 2 (Contratos Automáticos y Notificaciones)

## Objetivo
Implementar la segunda fase del reclutamiento (Req 4): generación automática de contratos para los empleados basándose en su tipo de contrato, notificación a los administradores para la recolección de firmas, y la habilitación de alarmas tempranas para contratos por vencer.

## 1. Validación Arquitectónica de `TypeContractRegister`
- **Análisis:** Actualmente `TypeContractRegister` (o su ID al catálogo) vive en `RequestEmployeeRegister` (Solicitud de Alta).
- **Validación:** Esto es parcialmente correcto porque es el contrato *solicitado* al momento del alta. Sin embargo, el **Contrato Activo** (y sus fechas de vigencia) deben pertenecer al Empleado (`Employee` o una tabla `EmployeeContract` hija de `Employee`).
- **Acción:** Asegurarse de que al crear al Empleado (cuando se "Concluye" la solicitud), el tipo de contrato, fecha de inicio y fecha fin (calculada) se transfieran al expediente del Empleado.

## 2. Generación Automática de Contratos
- **Backend (`EmployeeContractGeneratorService`)**:
  - Crear un servicio en la capa de Aplicación que utilice **QuestPDF** (o PdfSharp/HtmlRenderer si se prefieren plantillas de Word/HTML).
  - El servicio debe recibir un `EmployeeId`, recuperar sus datos personales, sueldo, cliente/vacante, y fusionarlos en una plantilla legal de contrato de trabajo.
  - La plantilla variará dependiendo del `TypeContract` (Ej. Determinado vs Indeterminado vs Obra).

## 3. Flujo de Firmas y Notificaciones
- **Backend / DB (`EmployeeContractStatus`)**:
  - Rastrear el estado del contrato (ej. `Borrador`, `PendienteFirma`, `Firmado`).
- **Eventos (`RequestEmployeeRegisterConfirmedEvent`)**:
  - Al darse de alta el empleado, despachar un evento de dominio (mediante `domainEventDispatcher`) que dispare el Job de generación de contrato.
  - Generar notificación interna (mediante `INotificationService` o la piscina de notificaciones de LuxuryApp) dirigida a los roles de `Administrator` / `Legal`: *"Nuevo contrato pendiente de firma para el empleado [Nombre]"*.

## 4. Alarmas de Vencimiento de Contrato
- **Hangfire Job (o Worker Service)**:
  - Crear un proceso en segundo plano (background job) que corra diariamente a medianoche.
  - Buscar contratos activos con fecha de finalización (`EndDate`) próxima (ej. a 15 y a 5 días de vencer).
  - Enviar notificaciones al sistema y un correo electrónico a Recursos Humanos / Gerencia advirtiendo del vencimiento próximo.
  
## 5. UI de Contratos (Frontend)
- **Expediente del Empleado (Tab de Contratos)**:
  - Crear un nuevo componente (o extender la sección legal) para mostrar el contrato actual, su fecha de vencimiento, y un botón para "Descargar Contrato PDF".
  - Si el contrato está en estado `PendienteFirma`, mostrar una alerta roja/amarilla (ej. `<lx-tag severity="danger">Pendiente Firma</lx-tag>`) y un botón exclusivo para Administradores que permita marcarlo como "Firmado" (y opcionalmente subir el contrato escaneado).
