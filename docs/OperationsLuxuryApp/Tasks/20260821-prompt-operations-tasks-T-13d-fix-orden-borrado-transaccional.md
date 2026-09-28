# TICKET T-13d (corrección) — Orden de borrado transaccional en `TaskAttachmentAppService.DeleteAsync`

Corrección puntual sobre T-13d, ya reportado como completo y con build/tests en verde. **No es un
descuido del ejecutor por ir contra el prompt** — el prompt (T-13d) pedía explícitamente "seguí el
patrón transaccional de `CustomDocumentAppService.DeleteAsync`", y el código que resultó no replicó
el orden exacto de esa referencia. Es una corrección de precisión, no una reprimenda.

## El problema

Archivo: `api/LuxuryApp.Application/Moduls/OperationsLuxuryApp/Tasks/TaskAttachment/Services/TaskAttachmentAppService.cs`,
método `DeleteAsync` (línea ~67):

```csharp
dbContext.TaskAttachment.Remove(item);
await dbContext.SaveChangesAsync();

var path = fileWritePathService.TicketDirectory(item.Tasks.CustomerId!.Value);
fileStorageService.DeleteFile(path, item.FilePath);   // <-- borra el archivo físico ANTES de comprometer la transacción

await transaction.CommitAsync();
```

El archivo físico se borra **antes** de que `transaction.CommitAsync()` confirme el borrado en
base de datos. Si `CommitAsync()` falla después de que `SaveChangesAsync()` ya puso el `DELETE` en
la conexión (poco frecuente pero real: caída de conexión, timeout, deadlock en el commit), la
transacción se revierte — el registro de `TaskAttachment` **sigue existiendo en la base de
datos**, pero el archivo físico al que apunta **ya no existe**. Resultado: un comprobante
"fantasma" que aparece en la lista, pero cuya URL 404 al abrirse, y que además sigue contando
como comprobante válido para la validación de cierre de T-13c (`AnyAsync(x => x.TasksId ==
id)` en `CloseTaskAsync` no verifica que el archivo exista físicamente, sólo que el registro
exista) — es decir, socava la garantía que T-13c existe para dar.

La referencia que el prompt pidió seguir, `CustomDocumentAppService.DeleteAsync`
(líneas 135-171), hace lo contrario en el orden correcto: `SaveChangesAsync()` →
`transaction.CommitAsync()` → **después** `fileStorageService.DeleteFile(...)`. Si el borrado
físico falla ahí, el peor caso es un archivo huérfano sin referencia en BD (inofensivo, se puede
limpiar con un job de barrido). Si el borrado físico falla en el orden actual de T-13d, el peor
caso es una referencia en BD a un archivo que no existe (visible al usuario, rompe la promesa de
T-13c).

## Corrección

Invierte el orden: comprometer la transacción primero, borrar el archivo físico después.

```csharp
dbContext.TaskAttachment.Remove(item);
await dbContext.SaveChangesAsync();
await transaction.CommitAsync();

var path = fileWritePathService.TicketDirectory(item.Tasks.CustomerId!.Value);
fileStorageService.DeleteFile(path, item.FilePath);
```

Si `DeleteFile(...)` lanza una excepción después del commit, no la envuelvas para revertir nada
(ya no hay nada que revertir, la transacción ya se comprometió) — deja que se propague o
regístrala, pero el `return ApiResponseDTO<bool>.SuccessResult(...)` sólo debe alcanzarse si todo
el bloque, incluido el borrado físico, terminó bien. Usa el mismo criterio que
`CustomDocumentAppService.DeleteAsync` para decidir esto (revísalo antes de decidir el manejo de
la excepción posterior al commit).

No toques `UploadAsync`, `GetByTaskIdAsync`, ni ningún otro archivo de T-13a/T-13b/T-13c/T-13d.

## Verificación obligatoria

```bash
dotnet build api/LuxuryApp.sln
```

Extiende (no reescribas) `TaskAttachmentAppServiceTests.cs` — el test
`DeleteAsync_WhenAttachmentBelongsToCurrentCustomer_RemovesRecordAndPhysicalFile` ya existe y
debe seguir pasando. Si es razonable simular el fallo de `CommitAsync()` para probar que el
archivo físico *no* se borra en ese caso (evitando así el escenario huérfano-en-BD), agrégalo; si
no es practicable con la infraestructura de test actual, explica por qué en el reporte en vez de
omitirlo silenciosamente.

Corre `dotnet test --filter FullyQualifiedName~TaskAttachmentAppServiceTests` y pega la salida
literal.

## Criterio de PASO

- `transaction.CommitAsync()` ocurre antes de `fileStorageService.DeleteFile(...)` en
  `DeleteAsync`.
- Los 6 tests existentes de T-13d siguen pasando.
- `dotnet build` pasa sin errores nuevos.

## Reporte de finalización

1. Cambio exacto hecho, con número de línea
2. Salida literal de `dotnet build` y `dotnet test`
3. Si agregaste o no un test para el escenario de fallo de commit, y por qué
4. Riesgos detectados que no estaban en este prompt

No avances al siguiente ticket. Espera la auditoría.
