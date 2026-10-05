# Reporte de Rutas y Cumplimiento - EvaluationTemplate

Este documento detalla la infraestructura de enrutamiento y el nivel de cumplimiento con los mandatos de **GEMINI.md** para el módulo de Plantillas de Evaluación.

## 1. Infraestructura de Enrutamiento

### Frontend (Angular 22)
- **Archivo de Rutas:** `client\angular\src\app\routing\employee-evaluation.routing.ts`
- **Ruta Base:** `employee-evaluation` (definida en `pages.routing.ts`)
- **Endpoints de Navegación:**

| Ruta | Componente | Descripción |
| :--- | :--- | :--- |
| `employee-evaluation/templates/list` | `ListaPlantillaEvaluacion` | Listado general de plantillas. |
| `employee-evaluation/templates/create` | `FormularioPlantillaEvaluacion` | Formulario para nueva plantilla. |
| `employee-evaluation/templates/edit/:id` | `FormularioPlantillaEvaluacion` | Edición de plantilla existente. |

### Backend (.NET 10)
- **Controlador:** `api\LuxuryApp.Application\Modules\RecursosHumanos\RecursosHumanos\EvaluationTemplate\Controller\TemplateEvaluationController.cs`
- **Ruta Base:** `api/TemplateEvaluation`
- **Endpoints API:**

| Método | Ruta | Acción |
| :--- | :--- | :--- |
| `GET` | `api/TemplateEvaluation/list/{customerId}` | Obtiene todas las plantillas por cliente. |
| `GET` | `api/TemplateEvaluation/{id}` | Obtiene una plantilla para edición. |
| `POST` | `api/TemplateEvaluation` | Crea una nueva plantilla. |
| `PUT` | `api/TemplateEvaluation/{id}` | Actualiza una plantilla existente. |
| `DELETE` | `api/TemplateEvaluation/{id}` | Elimina una plantilla. |

---

## 2. Validación de Mandatos GEMINI.md

### Backend (C# / .NET 10)
- [x] **Primary Constructors:** Implementados en `TemplateEvaluationController` y `TemplateEvaluationAppService`.
- [x] **ApiResponseDTO<T>:** Todos los endpoints del controlador retornan este tipo de respuesta.
- [x] **Proyección de DTOs:** Se utiliza `ProjectTo` de AutoMapper, que es compatible con la optimización de consultas SQL (a diferencia de `.Select(x => mapper.Map...)`).

### Frontend (Angular 22)
- [x] **Signals:** Uso exclusivo de `signal`, `computed` y `effect`. No se detectaron `@Input()` o `@Output()`.
- [x] **Versión Móvil:** El componente `ListaPlantillaEvaluacion` implementa correctamente `app-data-view-mobile` en su HTML.
- [!] **FormHelper:** El componente `FormularioPlantillaEvaluacion` **NO** utiliza `FormHelper.submitCrud()`. 
    - *Observación:* `FormHelper.submitCrud` está diseñado actualmente para trabajar con `DynamicDialogRef` (diálogos), mientras que este formulario es una página independiente. Se recomienda evaluar la generalización de `FormHelper` para soportar navegación directa.

---

## 3. Conclusión
El módulo se encuentra altamente alineado con los estándares del proyecto. La única desviación técnica es el uso de `apiResponseS` directamente en lugar de `FormHelper`, justificada por la arquitectura de página vs diálogo del componente actual.

**Última revisión:** Junio 2026
