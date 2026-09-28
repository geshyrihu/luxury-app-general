# 🎨 Reactive Forms & Custom Inputs

> **Deep-dive:** las reglas generales están en CONVENTIONS.md §2 (Forms, §2.13). Este archivo contiene ejemplos detallados.

## 3.4. Patrón Estándar de Formularios
- **Regla de Oro**: Usar siempre los 27 custom inputs del catálogo (`custom-input-*-signal`).
- **Prohibido**: `p-datepicker` / `p-calendar`. Usar **Flatpickr** vía custom input.
- **FormGroup**: Siempre tipado con `interface IXxxForm` y `nonNullable: true`.

## Carga de Datos por ID (OBLIGATORIO)
Los formularios de edición deben implementar este patrón:
1.  Obtener ID desde `this.config.data.id`.
2.  Llamar a `onLoadData()` para obtener el item por ID.
3.  Cargar con `form.patchValue(result)`.

## FormHelper.submitCrud()
Centraliza el patrón POST/PUT. **Obligatorio** usarlo en lugar de lógica manual.
```typescript
onSubmit() {
  FormHelper.submitCrud({
    form: this.form,
    api: this.apiS,
    endpoint: 'Banks',
    id: this.id(),
    ref: this.ref,
    submitting: this.submitting,
  });
}
```

## Validaciones Cross-Field
- Usar `FormGroup.addValidators()` después de construir el grupo.
- El error se adjunta al **FormGroup**, no al control.
- Mostrar error solo si `form.touched`.
