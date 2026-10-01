# Plan de Implementación: Ticket 2 - Refinamiento de Formularios y Edición desde Reclutamiento

## Objetivo
Mejorar la usabilidad del formulario de registro de empleado / solicitud de alta, validando campos críticos (como el Código Postal), protegiendo la información autocompletada proveniente de la vacante, y añadiendo un resumen claro en el tab de confirmación.

## 1. Ajuste al Botón "Limpiar borrador" (Frontend)
**Archivo principal afectado:** `candidate-process-hiring-modal.ts` (y cualquier formulario análogo de alta de empleado).
- **Problema actual:** `this.form.reset()` o `clearDraft()` limpia todos los campos, incluyendo los que vienen por contexto (`candidateFirstName`, `lastName`, y ahora `turnoTrabajo` y `customerAddress`).
- **Solución:** 
  - Modificar el método `clearDraft()` para que, después de hacer `this.form.reset()`, vuelva a ejecutar la inyección de datos de la vacante / contexto.
  - Ejemplo:
    ```typescript
    clearDraft() {
      localStorage.removeItem(this.draftKey());
      this.form.reset();
      this.applyInitialData();
      if (this.requestPositionId) this.loadVacancyContext(); // Si de aquí vienen Turno y Address
    }
    ```

## 2. Propiedades Auto-llenadas y No Editables
- Al cargar el contexto de la vacante (`loadVacancyContext`), extraer de la respuesta el **Turno de Trabajo** y la **Dirección del Cliente** (Customer.Address).
- Setear estos valores en los form controls correspondientes.
- Marcar los `<custom-input-text>` o `<custom-input-textarea>` en el HTML con el atributo `readonly` (o inhabilitar el control con `.disable()` en el FormGroup).
- Asegurarse de que el DTO del backend exponga `Turno` y `Address` a través de la vacante (`RequestPosition -> WorkPosition`).

## 3. Input de Código Postal
**Archivo principal afectado:** `candidate-process-hiring-modal.html` / `.ts` (sección de domicilio).
- **Cambios en UI:**
  - Cambiar el `<custom-input-text>` de `zipCode` a `<custom-input-mask>` o `<custom-input-number>` si el catálogo lo soporta.
- **Validaciones en FormGroup:**
  - Agregar `Validators.required` (si aplica).
  - Agregar `Validators.pattern('^[0-9]{5}$')` para forzar 5 dígitos numéricos.
  - Agregar `Validators.minLength(5)` y `Validators.maxLength(5)`.

## 4. Tab de Confirmación
**Archivo principal afectado:** `candidate-process-hiring-modal.html` (o la pestaña/step final).
- Agregar más datos relevantes al resumen visual antes de que el usuario envíe el formulario.
- En la tabla o listado final de resumen (`<ul>` o `<div class="grid">`), incluir:
  - Nombre completo del empleado
  - Cliente / Empresa destino
  - Puesto
  - Turno
  - Sueldo (si está disponible a la vista del reclutador)
  - Dirección (Customer Address)

## 5. Edición desde Reclutamiento (Backend/Permisos)
- **Requerimiento:** "Permitir edición de documentos y datos de empleados desde módulo de reclutamiento."
- **Solución:**
  - Revisar los Endpoints en `EmployeeAppService`, `EmployeeDocumentAppService`, etc.
  - Asegurarse de que el rol de `Reclutamiento` (o las Policies asociadas al módulo de reclutamiento) estén incluidas en los atributos `[Authorize]` de los endpoints de edición de empleados. Si actualmente están restringidos solo a `RecursosHumanos`, agregar el permiso de Reclutamiento.
  - Registrar los roles permitidos explícitamente si se manejan constantes en `AppPermissions`.
