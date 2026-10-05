# 📋 Reglas de Negocio - Luxury App

**Documento Maestro de Reglas de Negocio**

**Última actualización:** 2026-03-31  
**Alcance:** Todo el sistema (Backend .NET 10 + Frontend Angular 22)  
**Total de Reglas:** 140+ reglas documentadas

---

## 📑 Índice por Módulo

1. [HRIncidencias (Incidencias de Recursos Humanos)](#1-hrincidencias)
2. [Vacaciones (Vacation Management)](#2-vacaciones)
3. [Permisos (Leave Requests)](#3-permisos)
4. [Sanciones (Sanctions)](#4-sanciones)
5. [Seguridad y Autorización](#5-seguridad)
6. [Archivos y Adjuntos](#6-archivos)
7. [Validaciones de Datos (Frontend)](#7-validaciones-frontend)
8. [Paginación y Consultas](#8-paginacion)
9. [Roles de la Aplicación](#9-roles)
10. [Notificaciones](#10-notificaciones)
11. [Proveedores](#11-proveedores)
12. [Evaluaciones de Desempeño](#12-evaluaciones)
13. [Contratos de Trabajo](#13-contratos)
14. [Permisos de Archivos - MIME](#14-mime)
15. [Bajas de Empleados](#15-bajas)
16. [Inspecciones](#16-inspecciones)
17. [Tareas (Tasks)](#17-tareas)
18. [Piscina](#18-piscina)
19. [Productos](#19-productos)
20. [Almacenes](#20-almacenes)
21. [Comités y Juntas](#21-comites)
22. [Presupuesto y Gastos](#22-presupuesto)
23. [Órdenes de Compra](#23-ordenes-compra)
24. [Tareas Recurrentes](#24-tareas-recurrentes)
25. [Progreso de Tareas](#25-progreso)
26. [Anuncios](#26-anuncios)
27. [Directorio de Empleados](#27-directorio)
28. [Balance de Vacaciones - Administración](#28-balance-admin)
29. [Plantillas de Evaluación](#29-plantillas-eval)
30. [Categorías de Grupos de Tareas](#30-categorias)
31. [Registro de Empleados a Vacantes](#31-registro-vacantes)
32. [Historial de Cambios de Balance Manual](#32-historial-balance)
33. [Permisos de Vacaciones Pasadas](#33-vacaciones-pasadas)
34. [Direcciones de Empleados](#34-direcciones)
35. [Contabilidad - Periodos Fiscales](#35-contabilidad)
36. [Contabilidad - Cuentas](#36-cuentas)
37. [Roles de Aplicación](#37-roles-app)
38. [Direcciones de Clientes](#38-direcciones-clientes)
39. [Documentos de Cliente](#39-documentos)
40. [RFC de Cliente](#40-rfc)
41. [Compras - Solicitud de Compra](#41-solicitud-compra)
42. [Tipos de Incidencia](#42-tipos-incidencia)
43. [Tipos de Sanción](#43-tipos-sancion)
44. [Contratos de Trabajo - Campos](#44-contratos-campos)
45. [Plantillas de Contrato](#45-plantillas-contrato)
46. [Adendas de Contrato](#46-adendas)
47. [Tareas Recurrentes - Elementos](#47-elementos)
48. [Tareas Recurrentes - Plantillas](#48-plantillas)
49. [Comentarios de Tareas](#49-comentarios)
50. [Completado de Tarea](#50-completado)
51. [Reapertura de Tarea](#51-reapertura)
52. [Cierre de Tarea](#52-cierre)
53. [Programación de Tarea](#53-programacion)
54. [Presupuesto de Órdenes de Compra](#54-presupuesto-oc)
55. [Órdenes de Compra Progresivas](#55-oc-progresivas)
56. [Ejecución de Presupuesto](#56-ejecucion)
57. [Reportes de Balance AP](#57-balance-ap)
58. [Presupuesto de Catálogo de Gastos](#58-gastos)
59. [Devolución de Productos](#59-devolucion)
60. [Respuestas de Evaluación](#60-respuestas)
61. [Credenciales de Password Manager](#61-credenciales)
62. [Órdenes de Compra - Datos de Pago](#62-datos-pago)
63. [Órdenes de Compra - Autenticación](#63-autenticacion)
64. [Órdenes de Compra Principal](#64-oc-principal)
65. [Tareas - Campos Principales](#65-tareas-campos)
66. [Cambio de Contraseña](#66-cambio-password)
67. [Configuración de Mantenimiento](#67-mantenimiento)
68. [Cargos de Mantenimiento](#68-cargos)
69. [Pagos](#69-pagos)
70. [Ocupantes de Propiedad](#70-ocupantes)
71. [Propiedades](#71-propiedades)
72. [Mapeo de IDs Legacy](#72-legacy)
73. [Sesiones de Chat AI](#73-ai-sesiones)
74. [Mensajes de Chat AI](#74-ai-mensajes)
75. [Base de Conocimiento AI](#75-ai-conocimiento)
76. [Diagramas](#76-diagramas)
77. [Políticas de COI](#77-coi-politicas)
78. [Detalles de Política COI](#78-coi-detalles)
79. [Periodos Fiscales COI](#79-coi-fiscales)
80. [Presupuestos COI](#80-coi-presupuestos)
81. [Balances COI](#81-coi-balances)
82. [Cuentas COI](#82-coi-cuentas)
83. [Jerarquía de Roles de Aprobación](#83-jerarquia)
84. [Tickets Legales](#84-tickets)
85. [Inspecciones Principales](#85-inspecciones)
86. [Validación de Archivos Vacíos](#86-archivos-vacios)
87. [Validación de Múltiples Archivos](#87-multiples-archivos)
88. [Validación de Tipo por Header](#88-validacion-header)
89. [Redimensionamiento de Imágenes](#89-redimensionamiento)
90. [Limpieza de Archivos Temporales](#90-limpieza)
91. [Tipos de Almacenamiento](#91-almacenamiento)
92. [Validación de Stock en Actualización](#92-stock-actualizacion)
93. [Validación de Devolución](#93-devolucion)
94. [Validación de Salida Original](#94-salida-original)
95. [Validación de Eliminación de Tarea Legal](#95-eliminacion-legal)
96. [Validación de Categoría de Tarea Legal](#96-categoria-legal)
97. [Control de Concurrencia en Diagramas](#97-concurrencia)
98. [Validación de Documento Requerido](#98-documento)
99. [Validación de Acceso Multi-Tenant](#99-multi-tenant)
100. [Validación de RFC](#100-rfc)
101. [Validación de Categoría de Proveedor](#101-categoria-proveedor)
102. [Validación de Autorización de Proveedor](#102-autorizacion-proveedor)
103. [Validación de Tipo de Servicio de Proveedor](#103-tipo-servicio)
104. [Validación de Nivel de Acceso de Proveedor](#104-nivel-acceso)
105. [Validación de Búsqueda General de Proveedores](#105-busqueda-general)
106. [Validación de Pago Verificado](#106-pago-verificado)
107. [Validación de Pago Rechazado](#107-pago-rechazado)
108. [Validación de Factura Cancelada](#108-factura-cancelada)
109. [Validación de Estatus de Tarea por Tipo](#109-estatus-tarea)
110. [Validación de Cierre de Tarea Legal](#110-cierre-legal)
111. [Validación de Estatus de Junta](#111-junta)
112. [Validación de Estatus de Reunión](#112-reunion)
113. [Validación de Estatus de Fondeo](#113-fondeo)
114. [Validación de Estatus de Análisis de Factura](#114-analisis)
115. [Validación de Estatus de Registro de Empleado](#115-registro-empleado)
116. [Validación de Estatus de Adenda](#116-adenda)
117. [Validación de Estatus de Orden de Compra](#117-estatus-oc)
118. [Validación de Estatus de Anuncio Publicado](#118-anuncio)
119. [Validación de Estatus de Usuario](#119-usuario)

---

## 1. HRIncidencias {#1-hrincidencias}

### [RN-HRINC-001] Validación de Descripción de Incidencia

**Ubicación:** `api/LuxuryApp.Infrastructure/Data/Entities/HR/Incident.cs:l32-34`

**Descripción:** La descripción de una incidencia disciplinaria debe tener una longitud válida

**Tipo:** Validación

**Condición:**
```csharp
[StringLength(2000, ErrorMessage = "La descripción no puede exceder {1} caracteres")]
[MinLength(10, ErrorMessage = "La descripción debe tener al menos {1} caracteres")]
public string Description { get; set; }
```

**Regla:**
- Mínimo: 10 caracteres
- Máximo: 2000 caracteres

---

### [RN-HRINC-002] Derecho a Audiencia - 1 Día Hábil Mínimo ⚖️

**Ubicación:** `api/LuxuryApp.Application/Features/HRIncidencias/HRIncident/Services/IncidentAppService.cs:l198-205`

**Descripción:** Debe pasar al menos 1 día hábil desde la creación de una incidencia antes de resolverla, para respetar el derecho a audiencia del empleado.

**Tipo:** Workflow

**Condición:**
```csharp
var diasTranscurridos = (DateTime.UtcNow - incident.CreatedAt).TotalDays;
if (diasTranscurridos < 1)
{
    return ErrorResult("El empleado aún tiene derecho a audiencia. Debe pasar al menos 1 día hábil desde la creación del acta antes de resolverla.", 400);
}
```

**Mensaje de Error:** "El empleado aún tiene derecho a audiencia. Debe pasar al menos 1 día hábil desde la creación del acta antes de resolverla."

**Base Legal/Normativa:** Derecho a audiencia - Legislación laboral mexicana

---

### [RN-HRINC-003] Solo Edición en Estatus Reportado

**Ubicación:** `api/LuxuryApp.Application/Features/HRIncidencias/HRIncident/Services/IncidentAppService.cs:l177-180`

**Descripción:** Las incidencias solo pueden editarse cuando están en estatus "Reportado"

**Tipo:** Workflow

**Condición:**
```csharp
if (incident.InvestigationStatus != EInvestigationStatus.Reportado)
    return ErrorResult("Solo se pueden editar incidencias en estatus Reportado.", 400);
```

**Mensaje de Error:** "Solo se pueden editar incidencias en estatus Reportado."

---

### [RN-HRINC-004] Eliminación Física Solo por SuperUsuario

**Ubicación:** `api/LuxuryApp.Application/Features/HRIncidencias/HRIncident/Services/IncidentAppService.cs:l267-271`

**Descripción:** Solo los usuarios con rol SuperUsuario pueden eliminar físicamente incidencias

**Tipo:** Autorización

**Condición:**
```csharp
if (!string.Equals(currentUserService.UserRole, nameof(EApplicationRoleEnum.SuperUsuario), StringComparison.Ordinal))
{
    return ErrorResult("Solo SuperUsuario puede eliminar incidencias físicamente.", 403);
}
```

**Mensaje de Error:** "Solo SuperUsuario puede eliminar incidencias físicamente."

---

### [RN-HRINC-005] Política de Autorización CanCreateIncidents

**Ubicación:** `api/LuxuryApp.Api/ServiceExtensions/DependencyInjection.Authorization.cs:l52-59`

**Descripción:** Define qué roles pueden crear incidencias disciplinarias

**Tipo:** Autorización

**Roles Permitidos:**
- SuperUsuario
- Direccion
- SupervisionOperativa
- Administrador
- GerenteOperaciones
- GerenteAtencion

---

### [RN-HRINC-006] Niveles de Severidad de Incidencia

**Ubicación:** `api/LuxuryApp.Shared/Enums/ESeverityLevel.cs:l1-8`

**Descripción:** Define los 4 niveles de severidad para incidencias disciplinarias

**Tipo:** Negocio

**Valores:**
| Valor | Label (Español) |
|-------|-----------------|
| 0 | Leve |
| 1 | Moderado |
| 2 | Grave |
| 3 | Muy Grave |

---

### [RN-HRINC-007] Estatus de Investigación

**Ubicación:** `api/LuxuryApp.Shared/Enums/EInvestigationStatus.cs:l1-9`

**Descripción:** Define los 5 estatus posibles del flujo de investigación de incidencias

**Tipo:** Workflow

**Valores:**
- Reportado
- EnInvestigacion
- ResueltoSinSancion
- ResueltoConSancion
- Archivado

---

### [RN-HRINC-008] Testigos - Validaciones de Longitud

**Ubicación:** `api/LuxuryApp.Infrastructure/Data/Entities/HR/IncidentWitness.cs:l19-46`

**Descripción:** Validaciones de longitud para campos de testigos de incidencias

**Tipo:** Validación

**Límites:**
| Campo | Máximo |
|-------|--------|
| Name | 200 caracteres |
| Position | 150 caracteres |
| Relationship | 200 caracteres |
| Phone | 20 caracteres |
| Email | 200 caracteres |
| Statement | 2000 caracteres |
| SignaturePath | 500 caracteres |

---

### [RN-HRINC-009] Adjuntos - MIME Type y Tamaño

**Ubicación:** `api/LuxuryApp.Infrastructure/Data/Entities/HR/IncidentAttachment.cs:l37-41`

**Descripción:** Validaciones para archivos adjuntos de evidencias

**Tipo:** Archivo

**Límites:**
| Campo | Máximo |
|-------|--------|
| FilePath | 1000 caracteres |
| FileName | 300 caracteres |
| MimeType | 100 caracteres |
| FileSizeKB | Long (KB) |
| Description | 500 caracteres |

**Formatos Permitidos:** JPG, PNG, PDF  
**Tamaño Máximo:** 2MB por archivo  
**Cantidad Máxima:** 10 archivos por incidencia

---

## 2. Vacaciones {#2-vacaciones}

### [RN-VAC-001] Días de Vacaciones por Antigüedad (LFT México) ⚖️

**Ubicación:** `api/LuxuryApp.Shared/Utils/VacationCalculator.cs:l58-78`

**Descripción:** Calcula los días de vacaciones correspondientes según años de antigüedad, conforme a la Ley Federal del Trabajo de México

**Tipo:** Cálculo

**Tabla de Días:**
| Años de Antigüedad | Días de Vacaciones |
|-------------------|-------------------|
| 1 año | 12 días |
| 2 años | 14 días |
| 3 años | 16 días |
| 4 años | 18 días |
| 5 años | 20 días |
| 6-10 años | 22 días |
| 11-15 años | 24 días |
| 16-20 años | 26 días |
| 21-25 años | 28 días |
| 26-30 años | 30 días |
| Más de 30 años | 32 días |
| Menos de 1 año | 0 días |

**Base Legal/Normativa:** Ley Federal del Trabajo (LFT) México - Artículo 76

---

### [RN-VAC-002] Periodo de Aniversario

**Ubicación:** `api/LuxuryApp.Application/Features/RecursosHumanos/Services/VacationHelperService.cs:l33-52`

**Descripción:** El periodo vacacional se basa en el aniversario de ingreso del empleado, no en año calendario

**Tipo:** Negocio

**Ejemplo:**
```
Empleado ingresado el 17-Feb-2023:
- Periodo 2025: del 17/02/2025 al 16/02/2026
- Periodo 2026: del 17/02/2026 al 16/02/2027
```

---

### [RN-VAC-003] Mínimo 6 Meses para Solicitar Vacaciones

**Ubicación:** `api/LuxuryApp.Application/Features/MyVacationRequests/Services/SolicitudVacacionesService.cs:l43-46`

**Descripción:** Los empleados con menos de 6 meses de antigüedad no pueden solicitar vacaciones

**Tipo:** Validación

**Mensaje de Error:** "No puedes solicitar vacaciones si en la fecha de inicio tendrás menos de 6 meses de antigüedad."

---

### [RN-VAC-004] Cálculo de Días Hábiles (Excluye Domingos y Festivos)

**Ubicación:** `api/LuxuryApp.Shared/Utils/VacationCalculator.cs:l23-52`

**Descripción:** Los días de vacaciones solicitados se calculan excluyendo domingos y festivos oficiales mexicanos

**Tipo:** Cálculo

**Condición:**
```csharp
for (var fecha = startDate; fecha <= endDate; fecha = fecha.AddDays(1))
{
    // Se excluye el día si es domingo o si coincide con un festivo oficial.
    if (fecha.DayOfWeek == DayOfWeek.Sunday || holidays.Contains(fecha))
    {
        continue;
    }
    diasSolicitados++;
}
```

**Días Hábiles:** Lunes a Sábado (no festivos)

---

### [RN-VAC-005] Adelanto de Vacaciones - Primer Año

**Ubicación:** `api/LuxuryApp.Application/Features/RecursosHumanos/Services/VacationHelperService.cs:l196-210`

**Descripción:** Empleados entre 6 y 11 meses de antigüedad pueden solicitar hasta la mitad de los días del primer año como adelanto

**Tipo:** Negocio

**Cálculo:**
```csharp
var totalDaysForFirstYear = VacationCalculator.CalculateVacationDays(1); // 12 días
allowedAdvanceDays = totalDaysForFirstYear / 2;  // 6 días
```

**Días Permitidos:** Hasta 6 días (mitad de los 12 días del primer año)

---

### [RN-VAC-006] Validación de Días Disponibles al Solicitar

**Ubicación:** `api/LuxuryApp.Application/Features/MyVacationRequests/Services/SolicitudVacacionesService.cs:l54-58`

**Descripción:** No se puede solicitar más días de los disponibles en el periodo

**Tipo:** Validación

**Mensaje de Error:** "No tienes suficientes días disponibles. Solicitas {X} y solo tienes {Y} efectivos."

---

### [RN-VAC-007] No Superposición de Solicitudes

**Ubicación:** `api/LuxuryApp.Application/Features/MyVacationRequests/Services/SolicitudVacacionesService.cs:l60-64`

**Descripción:** No puede haber solicitudes de vacaciones superpuestas en el mismo período para un empleado

**Tipo:** Validación

**Mensaje de Error:** "Ya existe una solicitud en el mismo período."

---

### [RN-VAC-008] Solo Edición en Estatus Pendiente

**Ubicación:** `api/LuxuryApp.Application/Features/MyVacationRequests/Services/SolicitudVacacionesService.cs:l104-106`

**Descripción:** Las solicitudes de vacaciones solo pueden editarse cuando están en estado "Pendiente"

**Tipo:** Workflow

**Mensaje de Error:** "Solo se pueden editar solicitudes en estado 'Pendiente'. Las solicitudes aprobadas o rechazadas no se pueden modificar."

---

### [RN-VAC-009] Auto-Aprobación No Permitida

**Ubicación:** `api/LuxuryApp.Application/Features/VacationRequestApproval/Services/AprobacionVacacionesService.cs:l179-181`

**Descripción:** Un aprobador no puede aprobar o rechazar sus propias solicitudes (excepto SuperUsuario)

**Tipo:** Autorización

**Mensaje de Error:** "No puedes aprobar o rechazar tus propias solicitudes."

**Excepciones:** SuperUsuario puede auto-aprobarse

---

### [RN-VAC-010] Motivo de Rechazo Obligatorio

**Ubicación:** `api/LuxuryApp.Application/Features/VacationRequestApproval/Services/AprobacionVacacionesService.cs:l214-215`

**Descripción:** El rechazo de una solicitud de vacaciones requiere un motivo obligatorio

**Tipo:** Validación

**Mensaje de Error:** "El motivo del rechazo es obligatorio."

---

### [RN-VAC-011] Cancelación Solo de Solicitudes Aprobadas

**Ubicación:** `api/LuxuryApp.Application/Features/VacationRequestApproval/Services/AprobacionVacacionesService.cs:l469-471`

**Descripción:** Solo se pueden cancelar solicitudes que ya fueron aprobadas. Las pendientes deben eliminarse, no cancelarse.

**Tipo:** Workflow

**Mensaje de Error:** "Solo se pueden cancelar solicitudes que ya han sido aprobadas."

---

### [RN-VAC-012] Prima Vacacional Mínima 25% ⚖️

**Ubicación:** `api/LuxuryApp.Infrastructure/Data/Entities/RecursosHumanos/Vacaciones/VacationBalance.cs:l49-51`

**Descripción:** La prima vacacional debe ser al menos 25% según LFT

**Tipo:** Validación

**Condición:**
```csharp
[Range(25, 100, ErrorMessage = "La prima vacacional debe ser al menos 25% según LFT")]
public decimal VacationBonusPercentage { get; set; } = 25.0m;
```

**Base Legal/Normativa:** Ley Federal del Trabajo (LFT) México - Artículo 80

---

### [RN-VAC-013] Balance en Tiempo Real (No Acumulable)

**Ubicación:** `api/LuxuryApp.Application/Features/RecursosHumanos/Services/VacationHelperService.cs:l14-20`

**Descripción:** Los días de vacaciones no son acumulables. El balance se calcula en tiempo real consultando las solicitudes aprobadas y pendientes del periodo vigente.

**Tipo:** Negocio

**Regla:**
- Los campos `UsedDays` y `PendingDays` NO se manipulan directamente
- Se calculan dinámicamente contando las solicitudes aprobadas y pendientes en el periodo de aniversario vigente
- Los balances de periodos pasados no se suman al vigente (vacaciones no acumulables)

---

### [RN-VAC-014] Recordatorio de Vencimiento - 2 Meses Antes

**Ubicación:** `api/LuxuryApp.Application/Features/RecursosHumanos/Jobs/NotifyExpiringVacationsJob.cs:l19-22`

**Descripción:** Se envía recordatorio de vencimiento de vacaciones cuando faltan 2 meses o menos para el aniversario

**Tipo:** Notificación

**Configuración:**
```csharp
private const int ReminderMonthsBeforeExpiry = 2;
private const int MinDaysBetweenReminders = 7;  // No más de 1 email por semana
```

**Frecuencia:** Email semanal de recordatorio cuando faltan ≤2 meses para el aniversario

---

## 3. Permisos {#3-permisos}

### [RN-PERM-001] Tipos de Permiso Disponibles

**Ubicación:** `api/LuxuryApp.Shared/Enums/ELeaveType.cs:l1-20`

**Descripción:** Define los 8 tipos de permiso disponibles en el sistema

**Tipo:** Negocio

**Valores:**
- PersonalLeave → "Permiso personal"
- SickLeave → "Enfermedad"
- Maternity → "Maternidad"
- Paternity → "Paternidad"
- Training → "Capacitación"
- RemoteWork → "Trabajo remoto"
- Bereavement → "Luto/Duelo"
- Other → "Otros"

---

### [RN-PERM-002] Goce de Sueldo en Permisos

**Ubicación:** `api/LuxuryApp.Shared/Enums/EPaidStatus.cs:l1-6`

**Descripción:** Los permisos pueden ser con o sin goce de sueldo

**Tipo:** Negocio

**Valores:**
- ConGozedeSueldo
- SinGozedeSueldo

**Validación:**
```csharp
[Required(ErrorMessage = "Debe especificar si el permiso es con o sin goce de sueldo.")]
public EPaidStatus PaidStatus { get; set; } = EPaidStatus.SinGozedeSueldo;
```

---

### [RN-PERM-003] Roles No Permitidos para Solicitar Permisos

**Ubicación:** `api/LuxuryApp.Application/Features/LeaveRequest/Services/LeaveRequestService.cs:l79-83`

**Descripción:** Ciertos roles no tienen permitido solicitar permisos

**Tipo:** Autorización

**Roles Bloqueados:**
- Comite
- Condomino
- Jardineria
- Limpieza
- Proveedor
- Direccion

**Mensaje de Error:** "Tu rol no tiene permitido solicitar permisos."

---

### [RN-PERM-004] Validación de Fechas en Permisos

**Ubicación:** `api/LuxuryApp.Application/Features/LeaveRequest/Services/LeaveRequestService.cs:l86-88`

**Descripción:** La fecha de inicio no puede ser mayor a la fecha fin

**Tipo:** Validación

**Mensaje de Error:** "La fecha de inicio no puede ser mayor a la fecha fin."

---

### [RN-PERM-005] No Superposición de Permisos

**Ubicación:** `api/LuxuryApp.Application/Features/LeaveRequest/Services/LeaveRequestService.cs:l91-97`

**Descripción:** No puede haber solicitudes de permiso superpuestas para un empleado

**Tipo:** Validación

**Mensaje de Error:** "Ya existe una solicitud en el mismo período."

---

## 4. Sanciones {#4-sanciones}

### [RN-SANC-001] Estatus de Sanción

**Ubicación:** `api/LuxuryApp.Shared/Enums/ESanctionStatus.cs:l1-9`

**Descripción:** Define los 5 estatus posibles de una sanción disciplinaria

**Tipo:** Negocio

**Valores:**
- Activa
- Apelada
- Suspendida
- Cumplida
- Revocada

---

### [RN-SANC-002] Registro de Fecha de Cumplimiento

**Ubicación:** `api/LuxuryApp.Application/Features/HRIncidencias/HrSanction/Services/SanctionAppService.cs:l205-208`

**Descripción:** Al cambiar el estatus a "Cumplida", se registra automáticamente la fecha de cumplimiento

**Tipo:** Workflow

**Condición:**
```csharp
if (dto.NewStatus == ESanctionStatus.Cumplida)
    sanction.CompletedDate = DateTime.UtcNow;
```

---

### [RN-SANC-003] Validación de Sanción en Incidencia

**Ubicación:** `api/LuxuryApp.Application/Features/HRIncidencias/HrSanction/Services/SanctionAppService.cs:l139-141`

**Descripción:** Solo se puede aplicar sanción si la incidencia fue marcada para sanción

**Tipo:** Validación

**Mensaje de Error:** "La incidencia no fue marcada para sanción."

---

### [RN-SANC-004] Una Sola Sanción por Incidencia

**Ubicación:** `api/LuxuryApp.Application/Features/HRIncidencias/HrSanction/Services/SanctionAppService.cs:l143-145`

**Descripción:** No puede existir más de una sanción registrada para una misma incidencia

**Tipo:** Integridad

**Mensaje de Error:** "Ya existe una sanción registrada para esta incidencia."

---

## 5. Seguridad {#5-seguridad}

### [RN-AUTH-001] Políticas de Autorización Disponibles

**Ubicación:** `api/LuxuryApp.Api/ServiceExtensions/DependencyInjection.Authorization.cs:l1-80`

**Descripción:** Define todas las políticas de autorización basadas en roles

**Tipo:** Autorización

**Políticas:**
| Política | Roles Permitidos |
|----------|-----------------|
| SoloSuperUsuario | SuperUsuario |
| Directivos | SuperUsuario, Direccion, GerenteOperaciones, GerenteAtencion |
| RRHH | SuperUsuario, Direccion, RecursosHumanos |
| CanCreateIncidents | SuperUsuario, Direccion, SupervisionOperativa, Administrador, GerenteOperaciones, GerenteAtencion |
| Finanzas | SuperUsuario, Direccion, Contador, Cobranza |
| Mantenimiento | SuperUsuario, GerenteMantenimiento, JefeMantenimiento, TecnicoMantenimiento |
| Residentes | Condomino, Comite |
| Proveedores | Proveedor, Jardineria, Limpieza, Seguridad |

---

### [RN-AUTH-002] Jerarquía de Aprobación

**Ubicación:** `api/LuxuryApp.Application/Features/RecursosHumanos/Shared/ApprovalRuleService.cs:l1-150`

**Descripción:** Define qué roles pueden aprobar solicitudes de otros roles mediante una jerarquía configurable

**Tipo:** Autorización

**Reglas:**
- SuperUsuario tiene acceso total
- Para otros roles, consulta la tabla `ApprovalRoleHierarchy`
- Alcance: Global o SameCustomer

---

### [RN-AUTH-003] AuthGuard - Rutas Públicas

**Ubicación:** `client/angular/src/app/core/guard/auth.guard.ts:l17-21`

**Descripción:** Las rutas que comienzan con "/publico" son accesibles sin autenticación

**Tipo:** Autorización

**Condición:**
```typescript
if (typeof state.url === "string" && state.url.startsWith("/publico")) {
    return of(true);
}
```

---

### [RN-AUTH-004] RoleRedirectGuard - Redirección por Rol

**Ubicación:** `client/angular/src/app/core/guard/role-redirect.guard.ts:l1-35`

**Descripción:** Redirige a los usuarios a diferentes layouts según su rol

**Tipo:** Autorización

**Regla:**
- Role "Comite" → Layout `/committee`
- Otros roles → Layout `/dashboard`

---

## 6. Archivos {#6-archivos}

### [RN-FILE-001] Tamaño Máximo de Archivos PDF

**Ubicación:** `api/LuxuryApp.Shared/Services/FileValidatorService.cs:l17-34`

**Descripción:** Los archivos PDF no pueden exceder 5 MB

**Tipo:** Archivo

**Límite:** 5 MB

**Mensaje de Error:** "El tamaño del archivo excede el límite de 5 MB."

---

### [RN-FILE-002] Solo Archivos PDF Permitidos

**Ubicación:** `api/LuxuryApp.Shared/Services/FileValidatorService.cs:l37-39`

**Descripción:** Solo se permiten archivos con MIME type application/pdf

**Tipo:** Archivo

**Mensaje de Error:** "Solo se permiten archivos PDF."

---

### [RN-FILE-003] Tamaño Máximo de Imágenes

**Ubicación:** `api/LuxuryApp.Shared/Services/ImageStorageService.cs:l16-25`

**Descripción:** Las imágenes no pueden exceder 5 MB

**Tipo:** Archivo

**Límite:** 5 MB

---

### [RN-FILE-004] Tipos de Imagen Permitidos

**Ubicación:** `api/LuxuryApp.Shared/Services/ImageStorageService.cs:l13-14`

**Descripción:** Solo se permiten imágenes JPEG, PNG y WEBP

**Tipo:** Archivo

**Formatos Permitidos:** JPEG, PNG, WEBP

---

### [RN-FILE-005] Configuración Global de Tamaño Máximo

**Ubicación:** `api/LuxuryApp.Api/appsettings.FileStorage.json:l13`

**Descripción:** El tamaño máximo de archivo configurable es de 100 MB

**Tipo:** Archivo

**Configuración:**
```json
{
  "FileStorageSettings": {
    "MaxFileSizeMb": 100
  }
}
```

---

### [RN-FILE-006] Extensiones de Archivo Permitidas

**Ubicación:** `api/LuxuryApp.Api/appsettings.FileStorage.json:l7-11`

**Descripción:** Lista de extensiones de archivo permitidas en el sistema

**Tipo:** Archivo

**Extensiones Permitidas:**
```json
[
    ".jpg", ".jpeg", ".png", ".gif", ".bmp", ".svg", ".webp",
    ".pdf", ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx",
    ".xml", ".txt", ".zip", ".rar"
]
```

---

## 7. Validaciones Frontend {#7-validaciones-frontend}

### [RN-VAL-001] Contraseña - Mínimo 6 Caracteres

**Ubicación:** `client/angular/src/app/login/reset-password/reset-password.ts:l212`

**Descripción:** Las contraseñas deben tener al menos 6 caracteres

**Tipo:** Validación

**Mínimo:** 6 caracteres

---

### [RN-VAL-002] Descripción de Incidencia - 10 a 2000 Caracteres

**Ubicación:** `client/angular/src/app/features/employees/incident/pages/incident-form.ts:l85-86`

**Descripción:** La descripción de incidencia debe tener entre 10 y 2000 caracteres

**Tipo:** Validación

**Rango:** 10-2000 caracteres

---

### [RN-VAL-003] Testigo - Nombre Máximo 200 Caracteres

**Ubicación:** `client/angular/src/app/features/employees/incident/components/incident-witnesses/incident-witness-form.ts:l67`

**Descripción:** El nombre del testigo no puede exceder 200 caracteres

**Tipo:** Validación

**Máximo:** 200 caracteres

---

### [RN-VAL-004] Testigo - Declaración Máximo 2000 Caracteres

**Ubicación:** `client/angular/src/app/features/employees/incident/components/incident-witnesses/incident-witness-form.ts:l73`

**Descripción:** La declaración del testigo no puede exceder 2000 caracteres

**Tipo:** Validación

**Máximo:** 2000 caracteres

---

### [RN-VAL-005] Email - Patrón de Validación

**Ubicación:** `client/angular/src/app/features/tasks/send-operation-report/pages/send-operation-report.ts:l81`

**Descripción:** Los campos de email deben cumplir con el patrón de email válido

**Tipo:** Validación

**Patrón:**
```typescript
Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$")
```

---

## 8. Paginación {#8-paginacion}

### [RN-PAG-001] Límite Máximo de Registros por Página

**Ubicación:** `api/LuxuryApp.Shared/DTOs/PaginationCommonDTO.cs:l6-22`

**Descripción:** El número máximo de registros por página es 200 para prevenir consultas abusivas

**Tipo:** Validación

**Límite:** 200 registros por página

**Acción:** Trunca silenciosamente valores mayores a 200

---

## 9. Roles {#9-roles}

### [RN-ROLE-001] Roles Disponibles en el Sistema

**Ubicación:** `api/LuxuryApp.Shared/Enums/EApplicationRole.cs:l1-68`

**Descripción:** Define todos los roles disponibles en el sistema

**Tipo:** Negocio

**Categorías:**

**Dirección Operativa & Sistema:**
- SuperUsuario
- Direccion

**Roles Corporativos:**
- Legal, CoordinacionLegal
- RecursosHumanos, Reclutamiento
- GerenteMantenimiento
- SistemasGeneral, Sistemas
- Mensajeria

**Roles Operativos:**
- SupervisionOperativa, Administrador
- GerenteOperaciones, GerenteAtencion
- Asistente, Almacenista
- Contador, Cobranza
- JefeMantenimiento, TecnicoMantenimiento
- JardineriaInterna, SeguridadInterna
- SupervisorObra, Recepcionista, Ludotecaria

**Clientes:**
- Comite, Condomino

**Proveedores:**
- Jardineria, Limpieza, Seguridad, Proveedor

---

## 10. Notificaciones {#10-notificaciones}

### [RN-NOTIF-001] Notificación de Solicitud Creada

**Ubicación:** `api/LuxuryApp.Application/Features/MyVacationRequests/Services/SolicitudVacacionesService.cs:l78-80`

**Descripción:** Al crear una solicitud de vacaciones, se notifica al empleado y a los aprobadores

**Tipo:** Notificación

**Canales:** Email, Push (OneSignal)

**Destinatarios:**
- Empleado solicitante
- Aprobadores según jerarquía

---

### [RN-NOTIF-002] Notificación de Aprobación/Rechazo

**Ubicación:** `api/LuxuryApp.Application/Features/VacationRequestApproval/Services/AprobacionVacacionesService.cs:l201-203`

**Descripción:** Al aprobar o rechazar una solicitud, se notifica al empleado

**Tipo:** Notificación

**Contenido (Aprobación):**
```
"Tu solicitud de vacaciones del {startDate} al {endDate} ha sido ✅ APROBADA."
```

**Contenido (Rechazo):**
```
"Tu solicitud de vacaciones del {startDate} al {endDate} ha sido ❌ RECHAZADA. Motivo: {rejectionReason}"
```

---

## 11. Proveedores {#11-proveedores}

### [RN-PROV-001] Validación de RFC Único por Cliente

**Ubicación:** `api/LuxuryApp.Application/Features/Provider/Services/ProviderAppService.cs:l155-157`

**Descripción:** No puede haber dos proveedores con el mismo RFC para un mismo cliente

**Tipo:** Integridad

**Mensaje de Error:** "El proveedor ya existe con este RFC."

---

### [RN-PROV-002] Calificación de Proveedor - Rango 1-5

**Ubicación:** `api/LuxuryApp.Application/Features/ProviderQualification/DTOs/QualificationProviderAddOrEditDTO.cs:l11`

**Descripción:** La calificación de proveedores debe estar entre 1 y 5

**Tipo:** Validación

**Rango:** 1-5

---

## 12. Evaluaciones {#12-evaluaciones}

### [RN-EVAL-001] Puntuación de Evaluación - Rango 1-5

**Ubicación:** `api/LuxuryApp.Infrastructure/Data/Entities/EmployeeEvaluation/EvaluationAnswer.cs:l22`

**Descripción:** Las respuestas de evaluación deben tener puntuación entre 1 y 5

**Tipo:** Validación

**Rango:** 1-5

---

## 13. Contratos {#13-contratos}

### [RN-CONT-001] Salario Mínimo Mayor a Cero

**Ubicación:** `api/LuxuryApp.Application/Features/Employees/ContractWork/DTOs/WorkContractAddOrEditDTO.cs:l24`

**Descripción:** El salario base no puede ser cero o negativo

**Tipo:** Validación

**Mínimo:** 0.01

---

## 14. MIME {#14-mime}

### [RN-MIME-001] Tipos MIME para Descarga de Archivos

**Ubicación:** `api/LuxuryApp.Shared/Services/SecureFileStorageService.cs:l326-344`

**Descripción:** Define los tipos MIME soportados para la descarga de archivos

**Tipo:** Archivo

**Mapeo:**
```csharp
{".pdf", "application/pdf"},
{".doc", "application/vnd.ms-word"},
{".docx", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"},
{".xls", "application/vnd.ms-excel"},
{".xlsx", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"},
{".png", "image/png"},
{".jpg", "image/jpeg"},
{".jpeg", "image/jpeg"},
{".gif", "image/gif"},
{".xml", "application/xml"}
```

---

## 15. Bajas {#15-bajas}

### [RN-Baja-001] Folio Automático para Bajas

**Ubicación:** `api/LuxuryApp.Application/Features/Recruitment/RequestDismissal/Services/RequestDismissalAppService.cs:l116-118`

**Descripción:** Las solicitudes de baja reciben un folio automático generado

**Tipo:** Negocio

**Acción:** Genera folio secuencial único

---

### [RN-Baja-002] Validación de Motivo de Baja

**Ubicación:** `client/angular/src/app/features/request-dismissal/components/solicitud-baja-form.ts:l77-78`

**Descripción:** El motivo de baja debe tener entre 10 y 250 caracteres

**Tipo:** Validación

**Rango:** 10-250 caracteres

---

## 16. Inspecciones {#16-inspecciones}

### [RN-INSP-001] Código de Activo - Máximo 5 Caracteres

**Ubicación:** `client/angular/src/app/features/inspection/catalogo/catalogo-activo-form.ts:l49`

**Descripción:** El código de activo no puede exceder 5 caracteres

**Tipo:** Validación

**Máximo:** 5 caracteres

---

## 17. Tareas {#17-tareas}

### [RN-TASK-001] Título de Tarea - Máximo 100 Caracteres

**Ubicación:** `client/angular/src/app/features/tasks/my-tasks/pages/my-task-form.ts:l57`

**Descripción:** El título de una tarea no puede exceder 100 caracteres

**Tipo:** Validación

**Máximo:** 100 caracteres

---

### [RN-TASK-002] Descripción de Tarea - Máximo 150 Caracteres

**Ubicación:** `client/angular/src/app/features/tasks/my-tasks/pages/my-task-form.ts:l58`

**Descripción:** La descripción de una tarea no puede exceder 150 caracteres

**Tipo:** Validación

**Máximo:** 150 caracteres

---

### [RN-TASK-003] Seguimiento de Tarea - 10 a 200 Caracteres

**Ubicación:** `client/angular/src/app/features/tasks/task-follow-up/pages/task-followup.ts:l76-77`

**Descripción:** El seguimiento de tarea debe tener entre 10 y 200 caracteres

**Tipo:** Validación

**Rango:** 10-200 caracteres

---

## 18. Piscina {#18-piscina}

### [RN-PISC-001] Nombre de Piscina - Máximo 50 Caracteres

**Ubicación:** `client/angular/src/app/features/piscina/piscina-form.ts:l62-66`

**Descripción:** Los campos de nombre de piscina no pueden exceder 50 caracteres

**Tipo:** Validación

**Máximo:** 50 caracteres

---

## 19. Productos {#19-productos}

### [RN-PROD-001] Nombre de Producto - 5 a 45 Caracteres

**Ubicación:** `client/angular/src/app/features/product/productos-form.ts:l85-86`

**Descripción:** El nombre del producto debe tener entre 5 y 45 caracteres

**Tipo:** Validación

**Rango:** 5-45 caracteres

---

## 20. Almacenes {#20-almacenes}

### [RN-ALM-001] Validación de Stock Insuficiente

**Ubicación:** `api/LuxuryApp.Application/Features/Warehouse/Services/SalidaProductoAppService.cs:l158-160`

**Descripción:** No se puede realizar una salida de producto si no hay suficiente stock

**Tipo:** Validación

**Mensaje de Error:** "No hay suficiente stock en el almacén seleccionado para este producto."

---

### [RN-ALM-002] No Eliminación de Almacén con Stock

**Ubicación:** `api/LuxuryApp.Application/Features/Warehouse/Services/AlmacenAppService.cs:l139-141`

**Descripción:** No se puede eliminar un almacén que tiene stock asociado

**Tipo:** Integridad

**Mensaje de Error:** "No se puede eliminar el almacén porque tiene stock asociado. Por favor, transfiera o elimine el stock de este almacén primero."

---

## 21. Comités {#21-comites}

### [RN-COM-001] Estatus de Junta

**Ubicación:** `api/LuxuryApp.Application/Features/CommitteeMeeting/Services/MeetingDetailsAppService.cs:l65-69`

**Descripción:** Define los estatus de detalles de junta

**Tipo:** Workflow

**Valores:**
- 0: Pendiente
- 1: En Proceso
- 2: Concluido

---

## 22. Presupuesto {#22-presupuesto}

### [RN-PRES-001] Monto de Presupuesto - Mayor a Cero

**Ubicación:** `api/LuxuryApp.Application/Features/AccountingCoi/DTOs/CoiPolicyDTOs.cs:l97`

**Descripción:** Los montos de presupuesto deben ser mayores a cero

**Tipo:** Validación

**Mínimo:** 0.01

---

### [RN-PRES-002] Periodo Fiscal - Meses 1-14

**Ubicación:** `api/LuxuryApp.Application/Features/AccountingCoi/DTOs/CoiFiscalPeriodDTOs.cs:l31`

**Descripción:** El mes del periodo fiscal debe estar entre 1 y 14 (incluye periodos extraordinarios)

**Tipo:** Validación

**Rango:** 1-14

---

## 23. Órdenes de Compra {#23-ordenes-compra}

### [RN-OC-001] Estatus de Orden de Compra

**Ubicación:** `api/LuxuryApp.Application/Features/Purchases/PurchaseOrder/Services/OrdenCompraAppService.cs:l901`

**Descripción:** Define los estatus válidos para órdenes de compra

**Tipo:** Workflow

**Valores:** Pendiente, Denegado, Autorizado, Pagado, Cancelado

---

## 24. Tareas Recurrentes {#24-tareas-recurrentes}

### [RN-TREC-001] Recurrencia - 1 a 365 Días

**Ubicación:** `api/LuxuryApp.Infrastructure/Data/Entities/Tasks/RecurringTaskTemplate.cs:l22`

**Descripción:** La recurrencia de tareas debe estar entre 1 y 365 días

**Tipo:** Validación

**Rango:** 1-365 días

---

## 25. Progreso de Tareas {#25-progreso}

### [RN-TPROG-001] Porcentaje de Progreso - 0 a 100

**Ubicación:** `api/LuxuryApp.Infrastructure/Data/Entities/Tasks/Tasks.cs:l105`

**Descripción:** El porcentaje de progreso de una tarea debe estar entre 0 y 100

**Tipo:** Validación

**Rango:** 0-100

---

## 26. Anuncios {#26-anuncios}

### [RN-ANUN-001] Estatus de Anuncio

**Ubicación:** `api/LuxuryApp.Application/Features/Announcement/Services/AnnouncementAppService.cs:l529`

**Descripción:** Define los estatus de anuncios publicados

**Tipo:** Workflow

**Valores:** Borrador, Publicado, Archivado

---

## 27. Directorio {#27-directorio}

### [RN-DIR-001] Validación de Email de Empleado

**Ubicación:** `client/angular/src/app/features/directorios/employee-external/employee-external-form.ts:l94`

**Descripción:** Los emails de empleados deben cumplir con el patrón de email válido

**Tipo:** Validación

**Patrón:**
```typescript
Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$")
```

---

## 28. Balance Admin {#28-balance-admin}

### [RN-VACADM-001] Elegibilidad para Adelanto

**Ubicación:** `api/LuxuryApp.Application/Features/VacationBalanceAdmin/Services/VacationBalanceAdminService.cs:l38-46`

**Descripción:** Determina si un empleado es elegible para adelanto de vacaciones

**Tipo:** Negocio

**Criterios:**
- Antigüedad menor a 1 año
- Mínimo 6 meses de servicio

---

## 29. Plantillas Eval {#29-plantillas-eval}

### [RN-PLTEVAL-001] Nombre de Plantilla - Máximo 255 Caracteres

**Ubicación:** `client/angular/src/app/features/evaluation-template/formulario-plantilla-evaluacion.ts:l81`

**Descripción:** El nombre de la plantilla de evaluación no puede exceder 255 caracteres

**Tipo:** Validación

**Máximo:** 255 caracteres

---

## 30. Categorías {#30-categorias}

### [RN-CATG-001] Nombre de Categoría - Máximo 50 Caracteres

**Ubicación:** `client/angular/src/app/features/tasks/work-group-categories/pages/task-group-category-form.ts:l57`

**Descripción:** El nombre de categoría de grupo de tareas no puede exceder 50 caracteres

**Tipo:** Validación

**Máximo:** 50 caracteres

---

### [RN-CATG-002] Descripción de Categoría - Máximo 150 Caracteres

**Ubicación:** `client/angular/src/app/features/tasks/work-group-categories/pages/task-group-category-form.ts:l61`

**Descripción:** La descripción de categoría no puede exceder 150 caracteres

**Tipo:** Validación

**Máximo:** 150 caracteres

---

### [RN-CATG-003] Código de Categoría - Máximo 10 Caracteres

**Ubicación:** `client/angular/src/app/features/tasks/work-group-categories/pages/task-group-category-form.ts:l68`

**Descripción:** El código de categoría no puede exceder 10 caracteres

**Tipo:** Validación

**Máximo:** 10 caracteres

---

### [RN-CATG-004] Color de Categoría - Máximo 20 Caracteres

**Ubicación:** `client/angular/src/app/features/tasks/work-group-categories/pages/task-group-category-form.ts:l72`

**Descripción:** El color de categoría no puede exceder 20 caracteres

**Tipo:** Validación

**Máximo:** 20 caracteres

---

## 31. Registro Vacantes {#31-registro-vacantes}

### [RN-VACREG-001] Nombre - Máximo 100 Caracteres

**Ubicación:** `client/angular/src/app/features/vacancy-requests/components/register-employe-to-vacancy.ts:l30`

**Descripción:** El primer nombre no puede exceder 100 caracteres

**Tipo:** Validación

**Máximo:** 100 caracteres

---

### [RN-VACREG-002] Apellidos - Máximo 15 Caracteres

**Ubicación:** `client/angular/src/app/features/vacancy-requests/components/register-employe-to-vacancy.ts:l31-32`

**Descripción:** Los apellidos no pueden exceder 15 caracteres cada uno

**Tipo:** Validación

**Máximo:** 15 caracteres

---

## 32. Historial Balance {#32-historial-balance}

### [RN-VACHIST-001] Comentario de Cambio Manual - 10 a 500 Caracteres

**Ubicación:** `api/LuxuryApp.Application/Features/VacationBalanceAdmin/DTOs/ManualBalanceUpdateDTO.cs:l13`

**Descripción:** El comentario de cambio manual de balance debe tener entre 10 y 500 caracteres

**Tipo:** Validación

**Rango:** 10-500 caracteres

---

## 33. Vacaciones Pasadas {#33-vacaciones-pasadas}

### [RN-VACPAS-001] Comentario de Vacaciones Pasadas - Máximo 500 Caracteres

**Ubicación:** `client/angular/src/app/features/past-vacations/vacaciones-pasadas-registro.ts:l89`

**Descripción:** El comentario de registro de vacaciones pasadas no puede exceder 500 caracteres

**Tipo:** Validación

**Máximo:** 500 caracteres

---

## 34. Direcciones {#34-direcciones}

### [RN-DIR-EMP-001] Campos de Dirección de Empleado

**Ubicación:** `client/angular/src/app/features/employees/employee-internal/pages/employee-address-form.ts:l45-61`

**Descripción:** Los campos de dirección tienen límites de caracteres específicos

**Tipo:** Validación

**Límites:**
| Campo | Máximo |
|-------|--------|
| Calle | 60 caracteres |
| Colonia | 60 caracteres |
| Ciudad | 20 caracteres |
| Estado | 20 caracteres |
| CP | 10 caracteres |
| País | 20 caracteres |

---

## 35. Contabilidad Fiscal {#35-contabilidad}

### [RN-CONT-FISC-001] Número de Póliza - Máximo 255 Caracteres

**Ubicación:** `api/LuxuryApp.Application/Features/AccountingCoi/DTOs/CoiPolicyDTOs.cs:l65-92`

**Descripción:** Los campos de póliza contable tienen límites de 255 caracteres

**Tipo:** Validación

**Máximo:** 255 caracteres

---

## 36. Cuentas COI {#36-cuentas}

### [RN-CONT-CUE-001] Número de Cuenta - Máximo 50 Caracteres

**Ubicación:** `api/LuxuryApp.Application/Features/AccountingCoi/DTOs/CoiAccountDTOs.cs:l29-43`

**Descripción:** Los campos de cuentas contables tienen límites específicos

**Tipo:** Validación

**Límites:**
| Campo | Máximo |
|-------|--------|
| Número de cuenta | 50 caracteres |
| Nombre de cuenta | 150 caracteres |
| Tipo de cuenta | 1 caracter |

---

## 37. Roles App {#37-roles-app}

### [RN-ROLE-APP-001] Nombre de Rol - Máximo 256 Caracteres

**Ubicación:** `api/LuxuryApp.Application/Features/Configuration/ApplicationRole/DTOs/CreateUpdateApplicationRoleDTO.cs:l11`

**Descripción:** El nombre del rol no puede exceder 256 caracteres

**Tipo:** Validación

**Máximo:** 256 caracteres

---

### [RN-ROLE-APP-002] Orden de Rol - Número Positivo

**Ubicación:** `api/LuxuryApp.Application/Features/Configuration/ApplicationRole/DTOs/CreateUpdateApplicationRoleDTO.cs:l15`

**Descripción:** El orden de clasificación del rol debe ser un número positivo

**Tipo:** Validación

**Mínimo:** 0

---

## 38. Direcciones Clientes {#38-direcciones-clientes}

### [RN-DIR-CLI-001] Campos de Dirección de Cliente

**Ubicación:** `api/LuxuryApp.Application/Features/Configuration/CustomerAddress/DTOs/CustomerAddressAddOrEditDTO.cs:l9-48`

**Descripción:** Los campos de dirección de cliente tienen límites específicos

**Tipo:** Validación

**Límites:**
| Campo | Máximo |
|-------|--------|
| Street | 100 caracteres |
| Neighborhood | 200 caracteres |
| City | 100 caracteres |
| State | 20 caracteres |
| ZipCode | 20 caracteres |
| Country | 10 caracteres |
| Reference | 50 caracteres |
| PhoneNumber | 100 caracteres |
| Comments | 500 caracteres |

---

## 39. Documentos {#39-documentos}

### [RN-DOC-CLI-001] Nombre de Documento - Máximo 200 Caracteres

**Ubicación:** `api/LuxuryApp.Application/Features/Configuration/Customer/DTOs/DocumentoCustomerAddOrEditDTO.cs:l17`

**Descripción:** El nombre del documento no puede exceder 200 caracteres

**Tipo:** Validación

**Máximo:** 200 caracteres

---

## 40. RFC {#40-rfc}

### [RN-RFC-CLI-001] RFC - 12 a 13 Caracteres

**Ubicación:** `api/LuxuryApp.Application/Features/Configuration/Customer/DTOs/CustomerAddOrEditDTO.cs:l17-25`

**Descripción:** El RFC debe tener entre 12 y 13 caracteres (física o moral)

**Tipo:** Validación

**Rango RFC:** 12-13 caracteres  
**Rango CURP:** 10 caracteres

---

## 41. Solicitud Compra {#41-solicitud-compra}

### [RN-COMP-001] Campos de Solicitud de Compra

**Ubicación:** `api/LuxuryApp.Application/Features/Purchases/PurchaseRequest/DTOs/PurchaseRequestAddOrEditDTO.cs:l7-17`

**Descripción:** Los campos de solicitud de compra tienen límites específicos

**Tipo:** Validación

**Límites:**
| Campo | Máximo |
|-------|--------|
| RequesterName | 100 caracteres |
| Department | 100 caracteres |
| Justification | 500 caracteres |

---

## 42. Tipos de Incidencia {#42-tipos-incidencia}

### [RN-TINC-001] Campos de Tipo de Incidencia

**Ubicación:** `api/LuxuryApp.Application/Features/HRIncidencias/IncidentType/DTOs/IncidentTypeDTOs.cs:l36`

**Descripción:** Los campos de tipo de incidencia tienen límites específicos

**Tipo:** Validación

**Límites:**
| Campo | Máximo |
|-------|--------|
| Name | 150 caracteres |
| Description | 500 caracteres |

---

## 43. Tipos de Sanción {#43-tipos-sancion}

### [RN-TSANC-001] Campos de Tipo de Sanción

**Ubicación:** `api/LuxuryApp.Application/Features/HRIncidencias/SanctionType/DTOs/SanctionTypeDTOs.cs:l39-43`

**Descripción:** Los campos de tipo de sanción tienen límites específicos

**Tipo:** Validación

**Límites:**
| Campo | Máximo |
|-------|--------|
| Name | 150 caracteres |
| Description | 500 caracteres |

---

## 44. Contratos Campos {#44-contratos-campos}

### [RN-CONT-002] Número de Contrato - Máximo 40 Caracteres

**Ubicación:** `api/LuxuryApp.Infrastructure/Data/Entities/HR/ContractWork/WorkContract.cs:l14-73`

**Descripción:** Los campos de contrato de trabajo tienen límites específicos

**Tipo:** Validación

**Límites:**
| Campo | Máximo |
|-------|--------|
| ContractNumber | 40 caracteres |
| TerminationReason | 500 caracteres |
| LFTArticle | 100 caracteres |
| Notes | 1000 caracteres |

---

## 45. Plantillas Contrato {#45-plantillas-contrato}

### [RN-PLTCONT-001] Campos de Plantilla de Contrato

**Ubicación:** `api/LuxuryApp.Infrastructure/Data/Entities/HR/ContractWork/ContractTemplate.cs:l14-41`

**Descripción:** Los campos de plantilla de contrato tienen límites específicos

**Tipo:** Validación

**Límites:**
| Campo | Máximo |
|-------|--------|
| Name | 150 caracteres |
| Description | 500 caracteres |
| Version | 20 caracteres |

---

## 46. Adendas {#46-adendas}

### [RN-ADEND-001] Campos de Adenda de Contrato

**Ubicación:** `api/LuxuryApp.Infrastructure/Data/Entities/HR/ContractWork/ContractAddendum.cs:l14-56`

**Descripción:** Los campos de adenda de contrato tienen límites específicos

**Tipo:** Validación

**Límites:**
| Campo | Máximo |
|-------|--------|
| AddendumNumber | 40 caracteres |
| Title | 200 caracteres |
| PreviousValue | 200 caracteres |
| NewValue | 200 caracteres |
| Notes | 1000 caracteres |

---

## 47. Elementos {#47-elementos}

### [RN-TREC-002] Campos de Elemento de Tarea Recurrente

**Ubicación:** `api/LuxuryApp.Application/Features/Recruitment/RecurringTasks/DTOs/CreateTaskTemplateItemDTO.cs:l6-9`

**Descripción:** Los campos de elemento de tarea recurrente tienen límites específicos

**Tipo:** Validación

**Límites:**
| Campo | Máximo |
|-------|--------|
| TaskName | 150 caracteres |
| Description | 1000 caracteres |

---

## 48. Plantillas {#48-plantillas}

### [RN-TREC-003] Campos de Plantilla de Tarea Recurrente

**Ubicación:** `api/LuxuryApp.Application/Features/Recruitment/RecurringTasks/DTOs/CreateTaskTemplateDTO.cs:l6-9`

**Descripción:** Los campos de plantilla de tarea recurrente tienen límites específicos

**Tipo:** Validación

**Límites:**
| Campo | Máximo |
|-------|--------|
| TemplateName | 100 caracteres |
| Description | 500 caracteres |

---

## 49. Comentarios {#49-comentarios}

### [RN-TCOM-001] Comentario de Tarea - Máximo 500 Caracteres

**Ubicación:** `api/LuxuryApp.Application/Features/Recruitment/RecurringTasks/DTOs/CreateTaskCommentDTO.cs:l6`

**Descripción:** El comentario de tarea no puede exceder 500 caracteres

**Tipo:** Validación

**Máximo:** 500 caracteres

---

## 50. Completado {#50-completado}

### [RN-TCOMP-001] Notas de Completado - Máximo 500 Caracteres

**Ubicación:** `api/LuxuryApp.Application/Features/Recruitment/RecurringTasks/DTOs/CompleteTaskInstanceDTO.cs:l5`

**Descripción:** Las notas de completado de tarea no pueden exceder 500 caracteres

**Tipo:** Validación

**Máximo:** 500 caracteres

---

## 51. Reapertura {#51-reapertura}

### [RN-TREOP-001] Motivo de Reapertura - Máximo 150 Caracteres

**Ubicación:** `client/angular/src/app/features/tasks/components/task-reopen.ts:l57`

**Descripción:** El motivo de reapertura no puede exceder 150 caracteres

**Tipo:** Validación

**Máximo:** 150 caracteres

---

## 52. Cierre {#52-cierre}

### [RN-TCIERRE-001] Campos de Cierre de Tarea

**Ubicación:** `client/angular/src/app/features/tasks/components/task-close.ts:l61-65`

**Descripción:** Los campos de cierre de tarea son requeridos

**Tipo:** Validación

**Campos:** Estatus y Fecha (requeridos)

---

## 53. Programación {#53-programacion}

### [RN-TPROG-002] Campos de Programación

**Ubicación:** `client/angular/src/app/features/tasks/components/task-program.ts:l60-69`

**Descripción:** Los campos de programación de tarea son requeridos

**Tipo:** Validación

**Campos:** Requeridos

---

## 54. Presupuesto OC {#54-presupuesto-oc}

### [RN-PRESOC-001] Monto de Presupuesto - Mayor o Igual a Cero

**Ubicación:** `api/LuxuryApp.Application/Features/Purchases/PurchaseOrder/DTOs/PurchaseOrderBudgetAddOrEditDTO.cs:l20`

**Descripción:** El monto de presupuesto de orden de compra debe ser mayor o igual a cero

**Tipo:** Validación

**Mínimo:** 0

---

## 55. OC Progresivas {#55-oc-progresivas}

### [RN-OCPROG-001] Campos de Orden Progresiva

**Ubicación:** `api/LuxuryApp.Application/Features/Purchases/PurchaseOrder/DTOs/ProgressiveOrdenCompraCreateDTO.cs:l12-32`

**Descripción:** Los campos de orden de compra progresiva tienen validaciones específicas

**Tipo:** Validación

**Límites:**
| Campo | Mínimo |
|-------|--------|
| Quantity | 1 |
| UnitPrice | 0.01 |
| TotalAmount | 0.01 |

---

## 56. Ejecución {#56-ejecucion}

### [RN-EJEPRES-001] Monto de Ejecución - Mayor o Igual a Cero

**Ubicación:** `api/LuxuryApp.Application/Features/PresupuestoWebAspel/DTOs/BudgetExecutionItemDTO.cs:l28`

**Descripción:** El monto de ejecución de presupuesto debe ser mayor o igual a cero

**Tipo:** Validación

**Mínimo:** 0

---

## 57. Balance AP {#57-balance-ap}

### [RN-APREP-001] Campos de Reporte AP

**Ubicación:** `api/LuxuryApp.Application/Features/PresupuestoWebAspel/DTOs/ApBalanceReportDTO.cs:l13`

**Descripción:** Los campos de reporte de balance AP deben ser mayores o iguales a cero

**Tipo:** Validación

**Mínimo:** 0

---

## 58. Gastos {#58-gastos}

### [RN-PRESGAS-001] Monto de Presupuesto - Mayor o Igual a Cero

**Ubicación:** `api/LuxuryApp.Application/Features/ExpenseCatalogBudget/DTOs/CatalogPurchaseOrderBudgetDTO.cs:l22`

**Descripción:** El monto de presupuesto de gastos debe ser mayor o igual a cero

**Tipo:** Validación

**Mínimo:** 0

---

## 59. Devolución {#59-devolucion}

### [RN-DEV-001] Cantidad de Devolución - Mayor que Cero

**Ubicación:** `api/LuxuryApp.Application/Features/Warehouse/DTOs/DevolucionProductoDTO.cs:l10`

**Descripción:** La cantidad a devolver debe ser mayor que cero

**Tipo:** Validación

**Mínimo:** 1

---

## 60. Respuestas {#60-respuestas}

### [RN-EVALRESP-001] Puntuación de Respuesta - 1 a 5

**Ubicación:** `api/LuxuryApp.Application/Features/Employees/PerformanceEvaluation/DTOs/EvaluationAnswerDTO.cs:l8`

**Descripción:** La puntuación de respuesta de evaluación debe estar entre 1 y 5

**Tipo:** Validación

**Rango:** 1-5

---

## 61. Credenciales {#61-credenciales}

### [RN-PASS-001] Campos de Credencial

**Ubicación:** `api/LuxuryApp.Infrastructure/Data/Entities/PasswordManager/Credential.cs:l23-28`

**Descripción:** Los campos de credencial tienen límites específicos

**Tipo:** Validación

**Límites:**
| Campo | Máximo |
|-------|--------|
| Username | 100 caracteres |
| PasswordHash | 500 caracteres |

---

## 62. Datos de Pago {#62-datos-pago}

### [RN-OCPAGO-001] Campos de Datos de Pago

**Ubicación:** `api/LuxuryApp.Infrastructure/Data/Entities/Purchase/OrdenCompraDatosPago.cs:l32-37`

**Descripción:** Los campos de datos de pago de orden de compra tienen límites específicos

**Tipo:** Validación

**Límites:**
| Campo | Máximo |
|-------|--------|
| PaymentMethod | 100 caracteres |
| PaymentForm | 100 caracteres |

---

## 63. Autenticación {#63-autenticacion}

### [RN-OCAUTH-001] Campos de Autenticación

**Ubicación:** `api/LuxuryApp.Infrastructure/Data/Entities/Purchase/OrdenCompraAuth.cs:l45`

**Descripción:** Los campos de autenticación de orden de compra tienen límites específicos

**Tipo:** Validación

**Límites:**
| Campo | Máximo |
|-------|--------|
| AuthToken | 100 caracteres |

---

## 64. OC Principal {#64-oc-principal}

### [RN-OC-002] Campos de Orden de Compra

**Ubicación:** `api/LuxuryApp.Infrastructure/Data/Entities/Purchase/OrdenCompra.cs:l63`

**Descripción:** Los campos de orden de compra tienen límites específicos

**Tipo:** Validación

**Límites:**
| Campo | Máximo |
|-------|--------|
| Folio | 200 caracteres |

---

## 65. Tareas Campos {#65-tareas-campos}

### [RN-TASK-003] Campos de Tarea

**Ubicación:** `api/LuxuryApp.Infrastructure/Data/Entities/Tasks/Tasks.cs:l29`

**Descripción:** Los campos de tarea tienen límites específicos

**Tipo:** Validación

**Límites:**
| Campo | Máximo |
|-------|--------|
| Priority | 20 caracteres |

---

## 66. Cambio Password {#66-cambio-password}

### [RN-PASS-002] Campos de Cambio de Contraseña

**Ubicación:** `api/LuxuryApp.Shared/DTOs/UserChangePasswordDTO.cs:l5-12`

**Descripción:** Los campos de cambio de contraseña son requeridos

**Tipo:** Validación

**Campos Requeridos:**
- CurrentPassword
- NewPassword
- ConfirmPassword

---

## 67. Mantenimiento {#67-mantenimiento}

### [RN-MANT-001] Campos de Configuración de Mantenimiento

**Ubicación:** `api/LuxuryApp.Infrastructure/Data/Entities/CondominiumDirectory/MaintenanceFeeConfiguration.cs:l12-42`

**Descripción:** Los campos de configuración de mantenimiento son requeridos

**Tipo:** Validación

**Campos Requeridos:**
- Percentage
- FixedAmount
- StartDate
- EndDate
- PropertyId

---

## 68. Cargos {#68-cargos}

### [RN-MANT-002] Campos de Cargo de Mantenimiento

**Ubicación:** `api/LuxuryApp.Infrastructure/Data/Entities/CondominiumDirectory/MaintenanceFeeCharge.cs:l12-25`

**Descripción:** Los campos de cargo de mantenimiento son requeridos

**Tipo:** Validación

**Campos Requeridos:**
- Amount
- DueDate

---

## 69. Pagos {#69-pagos}

### [RN-PAGO-001] Campos de Pago

**Ubicación:** `api/LuxuryApp.Infrastructure/Data/Entities/CondominiumDirectory/Payment.cs:l12-54`

**Descripción:** Los campos de pago son requeridos

**Tipo:** Validación

**Campos Requeridos:**
- Amount
- PaymentDate
- Reference
- PaymentMethod
- Status
- PropertyId

---

## 70. Ocupantes {#70-ocupantes}

### [RN-OCUP-001] Campos de Ocupante de Propiedad

**Ubicación:** `api/LuxuryApp.Infrastructure/Data/Entities/CondominiumDirectory/PropertyOccupant.cs:l8-53`

**Descripción:** Los campos de ocupante de propiedad son requeridos

**Tipo:** Validación

**Campos Requeridos:**
- FullName
- Email
- Phone
- OccupantType

---

## 71. Propiedades {#71-propiedades}

### [RN-PROP-001] Campos de Propiedad

**Ubicación:** `api/LuxuryApp.Infrastructure/Data/Entities/CondominiumDirectory/Property.cs:l8`

**Descripción:** Los campos de propiedad son requeridos

**Tipo:** Validación

**Campos Requeridos:**
- Identifier

---

## 72. Legacy {#72-legacy}

### [RN-LEGACY-001] Campos de Mapeo Legacy

**Ubicación:** `api/LuxuryApp.Infrastructure/Data/Entities/Configuration/LegacyIdMap.cs:l8-16`

**Descripción:** Los campos de mapeo legacy son requeridos

**Tipo:** Validación

**Campos Requeridos:**
- EntityType
- LegacyId
- NewId

---

## 73. AI Sesiones {#73-ai-sesiones}

### [RN-AI-001] Campos de Sesión de Chat AI

**Ubicación:** `api/LuxuryApp.Infrastructure/Data/Entities/AiChatSession.cs:l8-11`

**Descripción:** Los campos de sesión de chat AI son requeridos

**Tipo:** Validación

**Campos Requeridos:**
- UserId
- Title

---

## 74. AI Mensajes {#74-ai-mensajes}

### [RN-AI-002] Campos de Mensaje de Chat AI

**Ubicación:** `api/LuxuryApp.Infrastructure/Data/Entities/AiChatMessage.cs:l8-18`

**Descripción:** Los campos de mensaje de chat AI son requeridos

**Tipo:** Validación

**Campos Requeridos:**
- SessionId
- Role (user/assistant)
- Content

---

## 75. AI Conocimiento {#75-ai-conocimiento}

### [RN-AI-003] Campos de Base de Conocimiento AI

**Ubicación:** `api/LuxuryApp.Infrastructure/Data/Entities/AiKnowledgeBase.cs:l8-12`

**Descripción:** Los campos de base de conocimiento AI son requeridos

**Tipo:** Validación

**Campos Requeridos:**
- Title
- Content

---

## 76. Diagramas {#76-diagramas}

### [RN-DIAG-001] Campos de Diagrama

**Ubicación:** `api/LuxuryApp.Infrastructure/Data\Entities\Diagrams\DiagramDraw.cs:l20`

**Descripción:** Los campos de diagrama son requeridos

**Tipo:** Validación

**Campos Requeridos:**
- DiagramData

---

## 77. COI Políticas {#77-coi-politicas}

### [RN-COIPOL-001] Campos de Política COI

**Ubicación:** `api/LuxuryApp.Infrastructure\Data\Entities\AspelCOI\CoiPolicy.cs:l11`

**Descripción:** Los campos de política COI son requeridos

**Tipo:** Validación

**Campos Requeridos:**
- PolicyNumber

---

## 78. COI Detalles {#78-coi-detalles}

### [RN-COIPOL-002] Campos de Detalle de Política COI

**Ubicación:** `api/LuxuryApp.Infrastructure\Data\Entities\AspelCOI\CoiPolicyDetail.cs:l11-20`

**Descripción:** Los campos de detalle de política COI son requeridos

**Tipo:** Validación

**Campos Requeridos:**
- PolicyId
- AccountNumber

---

## 79. COI Fiscales {#79-coi-fiscales}

### [RN-COIFISC-001] Campos de Periodo Fiscal COI

**Ubicación:** `api/LuxuryApp.Infrastructure\Data\Entities\AspelCOI\CoiFiscalPeriod.cs:l11`

**Descripción:** Los campos de periodo fiscal COI son requeridos

**Tipo:** Validación

**Campos Requeridos:**
- Year

---

## 80. COI Presupuestos {#80-coi-presupuestos}

### [RN-COIPRES-001] Campos de Presupuesto COI

**Ubicación:** `api/LuxuryApp.Infrastructure\Data\Entities\AspelCOI\CoiBudget.cs:l11-20`

**Descripción:** Los campos de presupuesto COI son requeridos

**Tipo:** Validación

**Campos Requeridos:**
- AccountNumber
- Amount

---

## 81. COI Balances {#81-coi-balances}

### [RN-COIBAL-001] Campos de Balance COI

**Ubicación:** `api/LuxuryApp.Infrastructure\Data\Entities\AspelCOI\CoiBalance.cs:l11-20`

**Descripción:** Los campos de balance COI son requeridos

**Tipo:** Validación

**Campos Requeridos:**
- AccountNumber
- DebitAmount

---

## 82. COI Cuentas {#82-coi-cuentas}

### [RN-COICUE-001] Campos de Cuenta COI

**Ubicación:** `api/LuxuryApp.Infrastructure\Data\Entities\AspelCOI\CoiAccount.cs:l11`

**Descripción:** Los campos de cuenta COI son requeridos

**Tipo:** Validación

**Campos Requeridos:**
- AccountNumber

---

## 83. Jerarquía {#83-jerarquia}

### [RN-JERARQ-001] Campos de Jerarquía de Aprobación

**Ubicación:** `api/LuxuryApp.Infrastructure\Data\Entities\Administration\ApprovalRoleHierarchy.cs:l15-29`

**Descripción:** Los campos de jerarquía de aprobación son requeridos

**Tipo:** Validación

**Campos Requeridos:**
- ApproverRoleId
- TargetRoleId
- ApprovalScope

---

## 84. Tickets {#84-tickets}

### [RN-LEGAL-001] Campos de Ticket Legal

**Ubicación:** `api/LuxuryApp.Infrastructure\Data\Entities\LegalTicket\Ticket.cs:l14`

**Descripción:** Los campos de ticket legal tienen límites específicos

**Tipo:** Validación

**Límites:**
| Campo | Máximo |
|-------|--------|
| Folio | 20 caracteres |

---

## 85. Inspecciones {#85-inspecciones}

### [RN-INSP-003] Campos de Inspección

**Ubicación:** `api/LuxuryApp.Infrastructure\Data\Entities\Inspections\Inspection.cs:l25`

**Descripción:** Los campos de inspección tienen límites específicos

**Tipo:** Validación

**Límites:**
| Campo | Máximo |
|-------|--------|
| Name | 100 caracteres |

---

## 86. Archivos Vacíos {#86-archivos-vacios}

### [RN-FILE-007] Archivo No Puede Ser Nulo

**Ubicación:** `api/LuxuryApp.Shared\Services\FileValidatorService.cs:l24-28`

**Descripción:** Los archivos no pueden ser nulos o vacíos

**Tipo:** Validación

**Mensajes de Error:**
- "El archivo no puede ser nulo."
- "El archivo no puede estar vacío."

---

## 87. Múltiples Archivos {#87-multiples-archivos}

### [RN-FILE-008] Validación de Múltiples Archivos

**Ubicación:** `api/LuxuryApp.Shared\Services\FileValidatorService.cs:l47-53`

**Descripción:** Valida que se hayan proporcionado archivos y valida cada uno

**Tipo:** Validación

**Mensaje de Error:** "No se proporcionaron archivos."

---

## 88. Validación Header {#88-validacion-header}

### [RN-FILE-009] Validación de Tipo de Imagen por Header

**Ubicación:** `api/LuxuryApp.Shared\Services\ImageStorageService.cs:l82-98`

**Descripción:** Valida el tipo de imagen leyendo el header del archivo, no solo la extensión

**Tipo:** Validación

**Acción:** Lee los bytes iniciales del archivo para determinar el tipo real

---

## 89. Redimensionamiento {#89-redimensionamiento}

### [RN-FILE-010] Redimensionamiento Automático de Imágenes

**Ubicación:** `api/LuxuryApp.Shared\Services\ImageStorageService.cs:l33-40`

**Descripción:** Las imágenes se redimensionan automáticamente al guardarse

**Tipo:** Transformación

**Dimensiones por Defecto:** 1296x972 píxeles

---

## 90. Limpieza {#90-limpieza}

### [RN-FILE-011] Limpieza de Archivos Temporales

**Ubicación:** `api/LuxuryApp.Api\appsettings.FileStorage.json:l14-18`

**Descripción:** Los archivos temporales se eliminan automáticamente después de 7 días

**Tipo:** Archivo

**Configuración:**
```json
"Cleanup": {
    "Enabled": true,
    "CronExpression": "0 2 * * *",
    "MaxTempFileAgeDays": 7
}
```

**Frecuencia:** Diaria a las 2:00 AM

---

## 91. Almacenamiento {#91-almacenamiento}

### [RN-FILE-012] Tipos de Almacenamiento Soportados

**Ubicación:** `api/LuxuryApp.Shared\Settings\FileStorageSettingsDTO.cs:l4-8`

**Descripción:** El sistema soporta almacenamiento local y Amazon S3

**Tipo:** Archivo

**Valores:**
- Local (sistema de archivos local)
- S3 (Amazon S3 o compatible)

---

## 92. Stock Actualización {#92-stock-actualizacion}

### [RN-ALM-003] Validación de Stock en Actualización

**Ubicación:** `api/LuxuryApp.Application\Features\Warehouse\Services\SalidaProductoAppService.cs:l186-188`

**Descripción:** Al actualizar una salida, valida que haya suficiente stock para la nueva cantidad

**Tipo:** Validación

**Mensaje de Error:** "No hay suficiente stock para realizar esta actualización."

---

## 93. Devolución {#93-devolucion}

### [RN-DEV-002] No Devolver Más de lo Sacado

**Ubicación:** `api/LuxuryApp.Application\Features\Warehouse\Services\SalidaProductoAppService.cs:l235-237`

**Descripción:** No se puede devolver más cantidad de la que se sacó originalmente

**Tipo:** Validación

**Mensaje de Error:** "No se puede devolver más de lo que se sacó."

---

## 94. Salida Original {#94-salida-original}

### [RN-DEV-003] Salida Original Debe Existir

**Ubicación:** `api/LuxuryApp.Application\Features\Warehouse\Services\SalidaProductoAppService.cs:l230-232`

**Descripción:** La salida original debe existir para poder realizar una devolución

**Tipo:** Integridad

**Mensaje de Error:** "La salida original no existe."

---

## 95. Eliminación Legal {#95-eliminacion-legal}

### [RN-TLEGAL-001] Validación de Eliminación de Tarea Legal

**Ubicación:** `api/LuxuryApp.Application\Features\Tasks\TaskLegal\Services\TaskLegalAppService.cs:l637-639`

**Descripción:** Valida que el asunto legal exista antes de eliminar

**Tipo:** Integridad

**Mensaje de Error:** "Asunto legal no encontrado para eliminar."

---

## 96. Categoría Legal {#96-categoria-legal}

### [RN-TLEGAL-002] Validación de Categoría de Tarea Legal

**Ubicación:** `api/LuxuryApp.Application\Features\Tasks\TaskLegal\Services\TaskLegalAppService.cs:l650-652`

**Descripción:** Valida que la categoría exista antes de eliminar

**Tipo:** Integridad

**Mensaje de Error:** "Categoría no encontrada."

---

## 97. Concurrencia {#97-concurrencia}

### [RN-DIAG-002] Control de Concurrencia en Diagramas

**Ubicación:** `api/LuxuryApp.Application\Features\Diagram\Services\DiagramDrawService.cs:l131-133`

**Descripción:** Detecta conflictos de concurrencia al actualizar diagramas

**Tipo:** Integridad

**Mensaje de Error:** "Error de concurrencia al actualizar el diagrama. Por favor, inténtelo de nuevo."

---

## 98. Documento {#98-documento}

### [RN-DOC-001] Documento Es Requerido

**Ubicación:** `api/LuxuryApp.Application\Features\CustomDocument\Services\CustomDocumentAppService.cs:l76-78`

**Descripción:** Valida que se haya proporcionado un documento

**Tipo:** Validación

**Mensaje de Error:** "El documento es requerido."

---

## 99. Multi-Tenant {#99-multi-tenant}

### [RN-MT-001] Validación de Acceso Multi-Tenant

**Ubicación:** `api/LuxuryApp.Application\Features\Provider\Services\ProviderAppService.cs:l16-21`

**Descripción:** Valida que el usuario solo pueda acceder a datos de su propio cliente (excepto SuperUsuario)

**Tipo:** Autorización

**Mensaje de Error:** "Acceso denegado. No tiene permisos para ver los datos de este cliente."

**Excepciones:** SuperUsuario tiene acceso a todos los clientes

---

## 100. RFC {#100-rfc}

### [RN-RFC-002] Búsqueda de Coincidencias de RFC

**Ubicación:** `api/LuxuryApp.Application\Features\Provider\Services\ProviderAppService.cs:l53-59`

**Descripción:** Busca proveedores con RFC coincidente para un cliente específico

**Tipo:** Integridad

**Acción:** Normaliza el RFC (quita guiones y guiones bajos) antes de buscar

---

## 101. Categoría Proveedor {#101-categoria-proveedor}

### [RN-PROV-003] Búsqueda por Categoría de Proveedor

**Ubicación:** `api/LuxuryApp.Application\Features\Provider\Services\ProviderAppService.cs:l111-125`

**Descripción:** Busca proveedores por categoría para un cliente específico

**Tipo:** Integridad

---

## 102. Autorización Proveedor {#102-autorizacion-proveedor}

### [RN-PROV-004] Autorización de Proveedor

**Ubicación:** `api/LuxuryApp.Application\Features\Provider\Services\ProviderAppService.cs:l557-567`

**Descripción:** Solo usuarios autorizados pueden autorizar proveedores

**Tipo:** Autorización

**Acción:** Alterna el estado de autorización del proveedor

---

## 103. Tipo Servicio {#103-tipo-servicio}

### [RN-PROV-005] Filtro por Tipo de Servicio

**Ubicación:** `api/LuxuryApp.Application\Features\Provider\Services\ProviderAppService.cs:l583-586`

**Descripción:** Filtra proveedores por tipo de servicio

**Tipo:** Negocio

---

## 104. Nivel Acceso {#104-nivel-acceso}

### [RN-PROV-006] Filtro por Nivel de Acceso

**Ubicación:** `api/LuxuryApp.Application\Features\Provider\Services\ProviderAppService.cs:l595-598`

**Descripción:** Filtra proveedores por nivel de acceso (público/privado)

**Tipo:** Autorización

---

## 105. Búsqueda General {#105-busqueda-general}

### [RN-PROV-007] Búsqueda General de Proveedores

**Ubicación:** `api/LuxuryApp.Application\Features\Provider\Services\ProviderAppService.cs:l603-611`

**Descripción:** Búsqueda general de proveedores por múltiples campos

**Tipo:** Negocio

**Campos de Búsqueda:**
- NameProvider
- NameComercial
- RFC
- ContactOne
- Categories

---

## 106. Pago Verificado {#106-pago-verificado}

### [RN-PAGO-002] No Modificar Pago Verificado

**Ubicación:** `api/LuxuryApp.Application\Features\AccountingCoi\Services\WebhookHandlerService.cs:l41-43`

**Descripción:** No se puede modificar un pago que ya está verificado

**Tipo:** Integridad

---

## 107. Pago Rechazado {#107-pago-rechazado}

### [RN-PAGO-003] No Asignar Pago Rechazado

**Ubicación:** `api/LuxuryApp.Application\Features\AccountingCoi\Services\PaymentAllocationService.cs:l192-194`

**Descripción:** No se puede asignar un pago que está rechazado

**Tipo:** Integridad

---

## 108. Factura Cancelada {#108-factura-cancelada}

### [RN-FACT-001] No Procesar Factura Cancelada

**Ubicación:** `api/LuxuryApp.Application\Features\AccountingCoi\Interfaces\InvoiceService.cs:l95-97`

**Descripción:** No se puede procesar una factura que está cancelada

**Tipo:** Integridad

---

## 109. Estatus Tarea {#109-estatus-tarea}

### [RN-TASK-004] Transiciones de Estatus de Tarea

**Ubicación:** `api/LuxuryApp.Application\Features\Tasks\Tasks\Services\TaskAppService.cs:l112-408`

**Descripción:** Define las transiciones válidas de estatus de tarea

**Tipo:** Workflow

**Estatus Válidos:**
- Completed
- NotStarted
- InProgress
- Reopened

---

## 110. Cierre Legal {#110-cierre-legal}

### [RN-TLEGAL-003] Validación de Cierre de Tarea Legal

**Ubicación:** `api/LuxuryApp.Application\Features\Tasks\TaskLegal\Services\TaskLegalAppService.cs:l176-191`

**Descripción:** Valida las transiciones de estatus de tarea legal

**Tipo:** Workflow

---

## 111. Junta {#111-junta}

### [RN-JUNTA-001] Validación de Estatus de Junta

**Ubicación:** `api/LuxuryApp.Application\Features\CommitteeMeeting\Services\MeetingDetailsAppService.cs:l65-69`

**Descripción:** Define los estatus de detalles de junta

**Tipo:** Workflow

**Valores:**
- 0: Pendiente
- 1: En Proceso
- 2: Concluido

---

## 112. Reunión {#112-reunion}

### [RN-REU-001] Validación de Estatus de Reunión

**Ubicación:** `api/LuxuryApp.Application\Features\CommitteeMeeting\Services\MeetingAppService.cs:l540-548`

**Descripción:** Define los estatus de reunión

**Tipo:** Workflow

**Valores:**
- 0: Pendiente
- 1: En Proceso
- 2: Concluido

---

## 113. Fondeo {#113-fondeo}

### [RN-FOND-001] Validación de Estatus de Fondeo

**Ubicación:** `api/LuxuryApp.Application\Features\Funding\Services\FundingAppService.cs:l786-788`

**Descripción:** Valida el estatus de registro de fondeo

**Tipo:** Workflow

---

## 114. Análisis {#114-analisis}

### [RN-FACT-002] Validación de Estatus de Análisis

**Ubicación:** `api/LuxuryApp.Application\Features\FondeosV2\Services\InvoiceAnalysisService.cs:l150-152`

**Descripción:** Valida el estatus de análisis de factura

**Tipo:** Workflow

---

## 115. Registro Empleado {#115-registro-empleado}

### [RN-REG-001] Validación de Estatus de Registro

**Ubicación:** `api/LuxuryApp.Application\Features\Recruitment\RequestEmployeeRegister\Services\RequestEmployeeRegisterAppService.cs:l267-269`

**Descripción:** Valida el estatus de registro de empleado

**Tipo:** Workflow

---

## 116. Adenda {#116-adenda}

### [RN-ADEND-002] Validación de Estatus de Adenda

**Ubicación:** `api/LuxuryApp.Application\Features\Employees\ContractAddendum\Services\ContractAddendumAppService.cs:l144-249`

**Descripción:** Valida las transiciones de estatus de adenda de contrato

**Tipo:** Workflow

**Estatus Bloqueados:**
- Firmado (no permite modificación)
- Cancelado (no permite modificación)

---

## 117. Estatus OC {#117-estatus-oc}

### [RN-OC-003] Validación de Estatus de Orden de Compra

**Ubicación:** `api/LuxuryApp.Application\Features\Purchases\PurchaseOrder\Services\OrdenCompraAppService.cs:l901-903`

**Descripción:** Valida los estatus de orden de compra

**Tipo:** Workflow

**Estatus que Permiten Modificación:**
- Pendiente
- Denegado

---

## 118. Anuncio {#118-anuncio}

### [RN-ANUN-002] Validación de Estatus de Anuncio Publicado

**Ubicación:** `api/LuxuryApp.Application\Features\Announcement\Services\AnnouncementAppService.cs:l529-531`

**Descripción:** Valida el estatus de anuncio publicado

**Tipo:** Workflow

**Regla:** No permitir modificación si está publicado

---

## 119. Usuario {#119-usuario}

### [RN-USR-001] Validación de Estatus de Usuario

**Ubicación:** `api/LuxuryApp.Application\Features\Auth\Services\UserConnectionStatusService.cs:l18-20`

**Descripción:** Define el estatus de conexión de usuario

**Tipo:** Workflow

---

## 📝 Notas Finales

### Reglas con Base Legal ⚖️

Las siguientes reglas tienen fundamento en la **Ley Federal del Trabajo (LFT) de México**:

1. **[RN-HRINC-002]** - Derecho a audiencia (1 día hábil)
2. **[RN-VAC-001]** - Días de vacaciones por antigüedad (Artículo 76)
3. **[RN-VAC-012]** - Prima vacacional mínima 25% (Artículo 80)

### Reglas Críticas para Producción

Las siguientes reglas son **CRÍTICAS** y deben ser probadas exhaustivamente antes de producción:

- [RN-HRINC-002] - Derecho a audiencia
- [RN-HRINC-004] - Eliminación solo por SuperUsuario
- [RN-VAC-001] - Cálculo de días de vacaciones
- [RN-VAC-012] - Prima vacacional 25%
- [RN-AUTH-001] - Políticas de autorización
- [RN-MT-001] - Validación multi-tenant

### Reglas de Integridad Referencial

Las siguientes reglas protegen la integridad de los datos:

- [RN-SANC-004] - Una sola sanción por incidencia
- [RN-VAC-007] - No superposición de solicitudes
- [RN-PERM-005] - No superposición de permisos
- [RN-ALM-002] - No eliminación de almacén con stock
- [RN-DEV-002] - No devolver más de lo sacado

---

**Documento generado automáticamente mediante análisis de código fuente.**  
**Total de reglas documentadas:** 140+  
**Módulos cubiertos:** 119  
**Fecha de generación:** 2026-03-31
