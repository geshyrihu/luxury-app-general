# Flutter — Forms y Validación (paridad Angular Reactive Forms §2.6)

## Regla obligatoria
- Usar **`reactive_forms`** estrictamente tipados. Paridad con Reactive Forms de Angular.
- Prohibido `TextEditingController` suelto por campo; el form group es la fuente de verdad.
- Equivalente a `FormHelper.submitCrud()`: `FormHelper.submitCrud({ form, api: apiResponseS, endpoint, ... })`
  centraliza validación, loader, submit y manejo de errores.

## Estructura
- Definir el form group tipado en `<feature>_form.interface.dart` como `<Feature>Form`:
  ```dart
  final form = fb.group<BankDto>(BankDto.new, {
    'name': fb.control(String, [Validators.required, Validators.minLength(3)]),
  });
  ```
- Validaciones cross-field con `Validators.compose` / `Validators.mustMatch`.
- En UI: `ReactiveTextField(formControlName: 'name')` bindeado al control, NO controller manual.

## Tipado estricto
- `analysis_options.yaml`: `strict: true`, `implicit-dynamic: false`. Prohibido `dynamic` en forms.
