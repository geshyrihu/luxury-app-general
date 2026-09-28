# Reconocimiento de Entidades: HumanResourcesLuxuryApp / Evaluation

Fecha: 2026-09-23
Tipo: Fase 0.5 de planeacion
Alcance: entidades, `DbSet`, snapshot EF, relaciones, indices y reutilizacion.

## Conteo Verificado

- Archivos de entidad encontrados en `Infrastructure/Data/Entities/HumanResourcesLuxuryApp/Evaluation/`: 5.
- Archivos documentados: 5.
- Configuraciones externas `*Evaluation*.cs`: 0 encontradas en `EntityConfigurations/` y `Configurations/`.
- Mapeo adicional: anotaciones en entidades, `ApplicationDbContext` y migraciones EF.

## Entidades Existentes

### 1. `TemplateEvaluation`

- Ruta: `Infrastructure/Data/Entities/HumanResourcesLuxuryApp/Evaluation/TemplateEvaluation.cs`.
- Tabla: `EvaluationTemplates`.
- Representa plantilla reutilizable de evaluacion.
- `CustomerId`: customer propietario actual; requerido. No permite plantilla global.
- `Customer`: relacion al customer.
- `Name`: nombre, maximo 255.
- `Description`: descripcion funcional.
- `IsActive`: disponibilidad para nuevas evaluaciones.
- `Categories`: categorias de la plantilla.
- `PerformanceEvaluations`: evaluaciones generadas desde la plantilla.
- `CreatedAt`, `CreatedById`, `CreatedBy`: auditoria de creacion.
- `UpdatedAt`, `UpdatedById`, `UpdatedBy`: auditoria de modificacion.
- Implementa `ITenantEntity`.
- No contiene folio, version, alcance global/customer, rol propietario ni roles aplicables.

### 2. `TemplateCategory`

- Ruta: `Infrastructure/Data/Entities/HumanResourcesLuxuryApp/Evaluation/TemplateCategory.cs`.
- Tabla: `EvaluationCategories`.
- Representa agrupador de preguntas.
- `EvaluationTemplateId`: plantilla padre.
- `EvaluationTemplate`: relacion a plantilla.
- `Name`: nombre, maximo 255.
- `Order`: posicion en plantilla.
- `Questions`: preguntas de categoria.
- `IsDeleted`: borrado logico local.
- No tiene restriccion unica de nombre u orden por plantilla.

### 3. `TemplateQuestion`

- Ruta: `Infrastructure/Data/Entities/HumanResourcesLuxuryApp/Evaluation/TemplateQuestion.cs`.
- Tabla: `EvaluationQuestions`.
- Representa pregunta evaluable.
- `TemplateCategoryId`: categoria padre.
- `TemplateCategory`: relacion a categoria.
- `QuestionText`: texto requerido.
- `Order`: posicion dentro de categoria.
- `IsDeleted`: borrado logico local.
- No tiene version propia ni snapshot historico.

### 4. `PerformanceEvaluation`

- Ruta: `Infrastructure/Data/Entities/HumanResourcesLuxuryApp/Evaluation/PerformanceEvaluation.cs`.
- Tabla: `EvaluationStaffs`.
- Representa aplicacion concreta de evaluacion a empleado.
- `EmployeeId`: empleado evaluado.
- `Employee`: relacion al empleado.
- `EvaluatorId`: usuario evaluador.
- `Evaluator`: relacion al usuario.
- `EvaluationTemplateId`: plantilla usada.
- `EvaluationTemplate`: relacion a plantilla.
- `EvaluationDate`: fecha de aplicacion.
- `Status`: estado actual.
- `FinalScore`: decimal `5,2` nullable.
- `FinalComments`: comentarios finales.
- `Answers`: respuestas.
- No tiene version/foglio snapshot, fecha de cierre, cancelacion, motivo, alcance copiado ni control de frecuencia.
- No implementa `ITenantEntity`; el tenant se deriva por relaciones.

### 5. `EvaluationAnswer`

- Ruta: `Infrastructure/Data/Entities/HumanResourcesLuxuryApp/Evaluation/EvaluationAnswer.cs`.
- Tabla: `EvaluationAnswers`.
- Representa respuesta individual.
- `PerformanceEvaluationId`: evaluacion padre.
- `PerformanceEvaluation`: relacion a evaluacion.
- `TemplateQuestionId`: pregunta respondida.
- `TemplateQuestion`: relacion a pregunta.
- `Score`: entero con rango de entidad 1-5.
- `Comments`: comentario.
- No tiene indice unico por evaluacion/pregunta; pueden existir respuestas duplicadas si servicio no lo impide.

## Persistencia Y EF

`ApplicationDbContext` registra cinco `DbSet` en `ApplicationDbContext.cs:1266-1306`:

- `EvaluationStaffs`.
- `EvaluationCategories`.
- `EvaluationTemplates`.
- `EvaluationQuestions`.
- `EvaluationAnswers`.

El snapshot actual confirma:

- `EvaluationStaffs`: indices por `EmployeeId`, `EvaluationTemplateId`, `EvaluatorId`.
- `EvaluationTemplates`: indices por `CustomerId`, `CreatedById`, `UpdatedById`.
- `EvaluationCategories`: indice por `EvaluationTemplateId`.
- `EvaluationQuestions`: indice por `TemplateCategoryId`.
- `EvaluationAnswers`: indices por `PerformanceEvaluationId` y `TemplateQuestionId`.
- `PerformanceEvaluation.FinalScore`: `decimal(5,2)`.
- `EvaluationDate`: SQL `date`.

Relaciones externas confirmadas:

- `ContractRenewalEvaluation -> PerformanceEvaluation` usa `DeleteBehavior.Restrict`.
- `RequestDismissalEvaluation -> PerformanceEvaluation` usa `DeleteBehavior.Restrict`.
- Por tanto, eliminar evaluaciones referenciadas debe bloquearse o resolverse con cancelacion/desactivacion.


- El filtro global revisado aplica `ISoftDeletable` (`ApplicationDbContext.cs:3223-3247`).
- `TemplateCategory` y `TemplateQuestion` usan `IsDeleted`, no `ISoftDeletable`; el filtro global no los protege automaticamente.
- `TemplateEvaluation` tiene `ITenantEntity`, pero `CustomerId` es obligatorio; el modelo actual no soporta globales.
- `PerformanceEvaluation` no tiene `CustomerId`; el aislamiento depende de `Employee` y `EvaluationTemplate`.

## Reutilizacion: `InterviewerMatrix`

Entidad revisada:

`Infrastructure/Data/Entities/RecruitmentLuxuryApp/InterviewerMatrices/InterviewerMatrix.cs`.

Modelo actual:

- `CustomerId` requerido.
- `WorkPositionRole`.
- `InterviewerRole`.
- Tabla `RecruitmentInterviewerMatrices`.
- Indice compuesto actual: `CustomerId`, `WorkPositionRole`, `InterviewerRole`; el snapshot no evidencia `IsUnique`.
- Servicio obtiene roles activos `Corporate` y `Staff` desde catalogo DB.
- Administracion actual restringida a politica `SoloSuperUsuario`.

Decision:

- Reutilizar patron de matriz, validacion de combinaciones, catalogo oficial de roles e indices.
- No reutilizar entidad ni tabla: semantica es entrevistador por puesto/customer, no autorizacion de plantillas.
- No modificar `InterviewerMatrix` para evitar impacto en Recruitment.

## Gaps Para Nuevo Diseño

Faltan hogares persistentes para:

1. alcance `Global` o `Customer`;
2. `CustomerId` nullable para global;
3. rol propietario funcional;
4. folio y version;
5. roles aplicables por plantilla;
6. matriz administrable de permisos de plantilla;
7. snapshot historico de plantilla y preguntas;
8. fecha/hora de cierre y motivo de cancelacion;
9. restriccion de frecuencia minima de 7 dias;
10. indice unico de respuestas por evaluacion/pregunta;
11. proteccion de borrado de plantillas usadas;
12. auditoria de cambios de matriz y acceso a resultados.

## Resultado De Fase 0.5

El modelo actual cubre plantilla, categorias, preguntas, evaluacion y respuestas, pero no cubre autorizacion administrable, plantillas globales, aplicabilidad por rol, versionado ni snapshot historico. Es necesario ampliar el modelo mediante plan aprobado y migracion controlada.
