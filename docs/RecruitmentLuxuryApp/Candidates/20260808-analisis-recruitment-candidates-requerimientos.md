📌 Nuevos Requerimientos – Módulo Recursos Humanos

1. Check List Post-Contratación
   Nueva entidad: EmployeeOnboardingChecklist

Funcionalidad: marcar acciones post contratación (ej. uniforme, capacitación, registro en checador, firma de contrato).

Fuente de opciones: catálogo administrable (ChecklistOptions) en lugar de hardcode.

Regla de negocio: cada empleado debe tener un checklist asociado, editable por administración.

2. Refactorización EmployeeDocument
   Situación actual: documentos definidos por enum DocumentTypeId.

Requerimiento: migrar a catálogo administrable (DocumentCatalog) con atributos:

IsMandatory → indica si el documento es obligatorio.

Description → nombre del documento.

Ventaja: flexibilidad para agregar/quitar documentos sin recompilar.

Regla de negocio: validación en alta de empleado → no se puede cerrar proceso si faltan documentos obligatorios.

3. Reclutamiento – Modificación de Datos
   Habilidad requerida: permitir edición de documentos y datos de empleados desde módulo de reclutamiento.

Impacto: permisos y auditoría para trazabilidad.

4. Fase Dos – Contratos
   Ubicación actual del avance:
   D:\repos\luxuryapp-api\api\LuxuryApp.Infrastructure.Data\Data\Entities\Tenant\Hr\ContratacinyLegal\

Requerimientos:

Generación automática de contratos.

Envío al administrador para firma.

Alarma de vencimiento: notificar antes de finalizar contrato.

Validar ubicación de propiedad TypeContractRegister en RequestEmployeeRegister → confirmar si está en la entidad correcta.

5. Formularios
   a) Registro de Candidato
   Refactorización: permitir carga de foto desde registro inicial.

Validación: al crear candidato verificar:

Si ya existe como empleado.

Si ya existe como candidato.

Fuente de reclutamiento: nueva entidad RecruitmentSourceCatalog editable (ej. recomendación, Facebook, gestión interna).

b) Registro de Empleado
Reglas de negocio:

Botón “Limpiar borrador” no debe borrar propiedades de llenado automático.

Propiedades auto llenadas y no editables:

TurnoTrabajo → de WorkPosition.

Customer.Address → de WorkPosition.

Tab de confirmación → agregar más datos relevantes.

Input CodigoPostal → tipo numérico, validar longitud (en México 5 dígitos, aplicar máscara).

6. Validaciones de Integridad
   Candidate vs Employee vs ApplicationUser:

Antes de guardar candidato, verificar coincidencia en ApplicationUser.

Si existe, ofrecer importar datos a Candidate.

✅ Resumen de Impacto Técnico
Nuevas entidades: EmployeeOnboardingChecklist, ChecklistOptions, DocumentCatalog, RecruitmentSourceCatalog.

Refactorizaciones: EmployeeDocument, formularios de candidato y empleado.

Reglas de negocio críticas: documentos obligatorios, validación de duplicados, alarmas de vencimiento de contrato.

Fase dos: automatización de contratos y notificaciones.
