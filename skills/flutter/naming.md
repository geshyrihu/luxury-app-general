# Flutter — Nombrado y Tipos (paridad Angular §7 / .NET §9)

## Un tipo por archivo
- Una interfaz, un enum, un DTO, un helper por `.dart`. Prohibido agrupar varios DTOs en un archivo.
- Ubicación: tipos del feature en `<feature>/interfaces/` (la carpeta `models/` está prohibida para tipos nuevos).

## Sufijos de archivo
- `.interface.dart`, `.dto.dart`, `.enum.dart`, `.helper.dart`, `.extension.dart`.
- **No se usa `.model.dart`**: los tipos de datos van en `.interface.dart` (forma de dominio/vista/estado) y los de transporte API en `.dto.dart` (espejo del `XxxDto` del backend).
- Base kebab = nombre del feature (ej. `banks.dto.dart`); variantes con `-<variante>`.

## Tipos PascalCase sin prefijos húngaros
- Clases/interfaces sin `I` (`Bank`, `BankDto`).
- DTOs con sufijo `Dto`; enums nativos sin `E` (`RoleType`, `Department`).
- Uniones discrimanadas con `sealed class` (equivalente a enums con datos).
- Form groups `<Feature>Form` en `<feature>_form.interface.dart`.
- Prohibido: `IBankDTO`, `EDepartment`, tipos inline, varios tipos por archivo.

## JSON sin reflexión (AOT, paridad Source Generators .NET §9)
- Usar `json_serializable` + `freezed` (codegen). **PROHIBIDO `dart:mirrors`/reflexión.**
  ```dart
  @freezed
  class BankDto with _$BankDto {
    const factory BankDto({required String id, required String name}) = _BankDto;
    factory BankDto.fromJson(Map<String, dynamic> json) => _$BankDtoFromJson(json);
  }
  ```
- IDs: `Uuid` (v7 time-sortable) vía `package:uuid` (paridad Guid .NET §1).

## Calidad (paridad .NET §9 / §11)
- `analysis_options.yaml`: `strict: true`, warnings-as-errors, `implicit-dynamic: false`.
- **AutoMapper PROHIBIDO**: mapeo explícito `.toDto()` / `.toEntity()`.
- Encoding UTF-8 sin BOM; fechas `DateFormat('dd-MMM-yy','es_MX')` (paridad §11).
