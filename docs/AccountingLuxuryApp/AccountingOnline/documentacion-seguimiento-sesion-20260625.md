Ruta: 📂 LuxuryApp.Application.Tenant > 📂 Tenant > 📂 Accounting > 📂 ContabilidadOnline

# 📌 Seguimiento de Sesión Contabilidad Online

📅 Última Revisión: 2026-06-25  
🛡️ Estado: En Revisión  
👤 Responsable: Codex

---

## 🚀 Resumen Ejecutivo

En esta sesión se trabajó principalmente en:

- Ajustes del reporte **Estado de Resultados** para ocultar solo la cuenta `401-001-000` sin perder el resto de cuentas `401-*`.
- Ajustes del reporte **Presupuesto vs Resultado / Cédula Presupuestal** en `contabilidad-online`.
- Revisión del origen de datos entre `contabilidad-online` y `contabilidad-cliente`.
- Diagnóstico y corrección del problema de caché de Aspel cuando `CacheTtlMinutes = 0`.

Conclusión importante:

- `contabilidad-online` y `contabilidad-cliente` ya consumen los **mismos endpoints backend** de `ContabilidadOnline`.
- El error reciente de backend no era por falta de datos en Aspel, sino porque `IMemoryCache` no acepta expiraciones relativas en `0`, lo que disparaba excepción y forzaba fallback a base local.

Validación al retomar esta sesión:

- El código vigente en `EstadoResultadosService` sigue ocultando solo `401-001-000` y mantiene la exclusión de `605-*`, `606-*`, `607-*` del bloque clásico de gastos.
- El cliente `AspelCoiApiClient` sí conserva la protección para `CacheTtlMinutes <= 0` y también limpia la llave `aspel-coi-basico:{empresa}:{year}` al invalidar caché.
- La lógica visual de `Cédula Presupuestal` ya quedó alineada tanto en `contabilidad-online` como en `contabilidad-cliente`: `607-*` entra a `GASTOS GENERALES`, `605-*` permanece como bloque extra y `606-*` ya no se pinta en esa vista.
- No se encontró, al revisar el código, un botón ni endpoint expuesto para invalidación manual de caché; hoy esa capacidad existe a nivel de servicio, no de UX/operación.

---

## ✅ Cambios Realizados

### 1. Estado de Resultados: ocultar solo `401-001-000`

Archivo:

- [EstadoResultadosService.cs](D:/repos/luxuryapp-api/api/LuxuryApp.Application.Tenant/Tenant/Accounting/ContabilidadOnline/Services/EstadoResultadosService.cs)

Regla dejada:

- Se oculta únicamente `401-001-000`.
- Si `401-001-000` funciona como cuenta contenedora, sus cuentas hijas `401-001-001`, `401-001-002`, `401-001-003`, etc. **sí siguen saliendo** cuando tienen movimiento.
- Se quitó la exclusión previa de `401-001-002`.

💡 Hallazgo técnico:

- El problema era que `401-001-000` estaba actuando como contenedor y, al eliminarla mal, se eliminaban también las cuentas hijas visibles del reporte.

---

### 2. Presupuesto vs Resultado: ruta correcta del ajuste

Se confirmó que la captura de la pestaña **P vs R** corresponde a:

- [cedula-presupuestal.ts](D:/repos/luxuryapp-api/client/angular/src/app/features/accounting/general-ledger/contabilidad/contabilidad-online/pages/cedula-presupuestal/cedula-presupuestal.ts)

No correspondía a:

- `contabilidad-cliente/pages/cedula-presupuestal-cliente`

---

### 3. Presupuesto vs Resultado: mover `607` y quitar `606`

Archivo:

- [cedula-presupuestal.ts](D:/repos/luxuryapp-api/client/angular/src/app/features/accounting/general-ledger/contabilidad/contabilidad-online/pages/cedula-presupuestal/cedula-presupuestal.ts)

Reglas aplicadas:

- `607-* GASTOS EN EVENTOS` ahora forma parte de `GASTOS GENERALES`.
- `606-* MEJORAS Y PROYECTOS` ya no se muestra en ese reporte.
- `605-* EXTRAORDINARIOS` se mantiene como bloque separado.

Impacto:

- `607-*` ahora también entra al **GRAN TOTAL GASTOS GENERALES**.

---

### 4. Caché Aspel en desarrollo

Archivo:

- [appsettings.Development.json](D:/repos/luxuryapp-api/api/LuxuryApp.Api/appsettings.Development.json)

Cambio aplicado:

- `AspelCoiApi.CacheTtlMinutes = 0`

Objetivo:

- Deshabilitar caché en desarrollo para que los reportes consulten AspelLive sin esperar expiración.

---

### 5. Corrección del cliente Aspel para `ttl=0`

Archivo:

- [AspelCoiApiClient.cs](D:/repos/luxuryapp-api/api/LuxuryApp.Application.Tenant/Tenant/Accounting/Shared/Services/AspelCoiApiClient.cs)

Problema detectado:

- `IMemoryCache` lanza `ArgumentOutOfRangeException` si se hace `cache.Set(..., TimeSpan.FromMinutes(0))`.

Solución aplicada:

- Si `CacheTtlMinutes <= 0`, el cliente **no guarda en caché**.
- Ya no lanza excepción.
- Sigue consumiendo AspelLive normalmente.
- `InvalidarCache(...)` ahora también limpia la llave `aspel-coi-basico:{empresa}:{year}` además de `aspel-coi:{empresa}:{year}`.

---

## 🔎 Diagnóstico del Origen de Datos

### `contabilidad-online`

- Cada página consume directo `Endpoints.ContabilidadOnline.FinancialStatements.*`
- Usa `ApiResponseService` en cada componente.
- Maneja `reportFilterState`, impresión y contexto de auditoría/documentación.

Ejemplo:

- [financial-reports-wrapper.ts](D:/repos/luxuryapp-api/client/angular/src/app/features/accounting/general-ledger/contabilidad/contabilidad-online/pages/financial-reports-wrapper.ts)

### `contabilidad-cliente`

- Consume los **mismos endpoints backend** pero a través de un servicio wrapper.
- Toma `customerId`, `anio`, `mes` desde la URL.
- No documenta origen ni metadatos de auditoría como el módulo online.
- La `cedula-presupuestal-cliente` ya replica la misma regla visual principal de `contabilidad-online` para `605/606/607`.

Archivo clave:

- [contabilidad-cliente.service.ts](D:/repos/luxuryapp-api/client/angular/src/app/features/accounting/general-ledger/contabilidad/contabilidad-cliente/services/contabilidad-cliente.service.ts)

✅ Conclusión:

- La diferencia hoy no es la fuente de datos, sino la forma de orquestar la UI.

---

## ⚠️ Errores Relevantes Encontrados

### Error 1: pérdida de cuentas `401-*`

Qué salió mal:

- Al intentar ocultar `401-001-000`, se eliminaba también parte de la rama de cuentas hijas.

Qué se corrigió:

- Se reescribió la lógica para ocultar solo el contenedor y conservar los detalles visibles.

### Error 2: caché con `ttl=0`

Qué salió mal:

- Se configuró `CacheTtlMinutes = 0`.
- `IMemoryCache` falló con:
  `System.ArgumentOutOfRangeException: The relative expiration value must be positive.`

Consecuencia:

- Fallaba `AspelLive`.
- El sistema intentaba usar snapshot local SQL.
- Para algunos ejercicios como `2025`, no había sincronización, por eso apareció:
  `No existe información sincronizada en base de datos...`

Qué se corrigió:

- El cliente ahora interpreta `0` como “no cachear”, sin excepción.

---

## 📊 Antes vs Después

| Antes (Limitación) | Después (Solución) |
|---|---|
| Ocultar `401-001-000` provocaba pérdida de otras cuentas `401-*` | Solo se oculta `401-001-000` y permanecen visibles las hijas con movimiento |
| `P vs R` se ajustó en la ruta equivocada (`contabilidad-cliente`) | Se confirmó y corrigió en `contabilidad-online/pages/cedula-presupuestal` |
| `607-*` estaba separado en bloque propio | `607-*` ahora se integra a `GASTOS GENERALES` |
| `606-*` seguía apareciendo en `P vs R` | `606-*` ya no se muestra |
| `ttl=0` rompía AspelLive | `ttl=0` ahora deshabilita caché sin excepción |

---

## 🧩 Pendientes Claros

- [ ] Decidir si en **Estado de Resultados** deben volver `605-000-000`, `606-000-000` y `607-000-000` al bloque de gastos generales o si seguirán excluidas.
- [ ] Homologar formalmente `contabilidad-cliente` y `contabilidad-online` en la **capa de presentación**, porque el consumo backend ya está compartido y la `Cédula Presupuestal` ya quedó funcionalmente alineada en ambos lados.
- [ ] Validar visualmente el reporte `P vs R` después del ajuste de `607` y retiro de `606`.
- [ ] Confirmar si se quiere exponer invalidación manual de caché vía endpoint o UI, porque hoy `InvalidarCache(...)` existe en servicio pero no hay flujo operativo visible para usarlo.
- [ ] Revisar si el ejercicio `2025` realmente debe seguir cayendo a snapshot SQL o si también debe resolverse desde AspelLive.
- [ ] Reactivar o reescribir pruebas automáticas de `AspelCoiApiClient`; el archivo de tests localizado sigue comentado y no está protegiendo el caso `ttl=0`.

---

## 🔍 Verificaciones de Código al Retomar

Archivos revisados en esta continuación:

- [EstadoResultadosService.cs](D:/repos/luxuryapp-api/api/LuxuryApp.Application.Tenant/Tenant/Accounting/ContabilidadOnline/Services/EstadoResultadosService.cs)
- [AspelCoiApiClient.cs](D:/repos/luxuryapp-api/api/LuxuryApp.Application.Tenant/Tenant/Accounting/Shared/Services/AspelCoiApiClient.cs)
- [cedula-presupuestal.ts](D:/repos/luxuryapp-api/client/angular/src/app/features/accounting/general-ledger/contabilidad/contabilidad-online/pages/cedula-presupuestal/cedula-presupuestal.ts)
- [cedula-presupuestal-cliente.ts](D:/repos/luxuryapp-api/client/angular/src/app/features/accounting/general-ledger/contabilidad/contabilidad-cliente/pages/cedula-presupuestal-cliente/cedula-presupuestal-cliente.ts)
- [contabilidad-cliente.service.ts](D:/repos/luxuryapp-api/client/angular/src/app/features/accounting/general-ledger/contabilidad/contabilidad-cliente/services/contabilidad-cliente.service.ts)
- [AspelCoiApiClientTests.cs](D:/repos/luxuryapp-api/api/LuxuryApp.Tests/Application/Services/Contabilidad/AspelCoiApiClientTests.cs)

Hallazgos puntuales:

- `EstadoResultadosService` no está excluyendo `401-001-002`; la lógica vigente solo oculta `401-001-000` cuando aplana ingresos `401`.
- `contabilidad-cliente.service.ts` sigue confirmando que cliente y online comparten `Endpoints.ContabilidadOnline.FinancialStatements.*`.
- `cedula-presupuestal-cliente.ts` ya refleja el mismo criterio de agrupación que online para `607` y `605`.
- `AspelCoiApiClientTests.cs` permanece comentado, así que el fix de caché quedó validado por código revisado, no por suite automatizada activa.

---

## 🛠️ Archivos Tocadas en esta Sesión

- [EstadoResultadosService.cs](D:/repos/luxuryapp-api/api/LuxuryApp.Application.Tenant/Tenant/Accounting/ContabilidadOnline/Services/EstadoResultadosService.cs)
- [cedula-presupuestal.ts](D:/repos/luxuryapp-api/client/angular/src/app/features/accounting/general-ledger/contabilidad/contabilidad-online/pages/cedula-presupuestal/cedula-presupuestal.ts)
- [AspelCoiApiClient.cs](D:/repos/luxuryapp-api/api/LuxuryApp.Application.Tenant/Tenant/Accounting/Shared/Services/AspelCoiApiClient.cs)
- [appsettings.Development.json](D:/repos/luxuryapp-api/api/LuxuryApp.Api/appsettings.Development.json)

---

## 🧠 Glosario Non-Tech

- **AspelLive**: consulta en vivo a Aspel COI.
- **Snapshot local**: datos ya sincronizados y guardados en SQL.
- **TTL**: tiempo de vida de la caché.
- **Cuenta contenedora**: cuenta padre que agrupa otras cuentas hijas.
- **Fallback**: ruta alterna que usa el sistema cuando falla la principal.

---

## ✅ Criterios para Retomar

Al retomar la sesión, primero validar:

- [ ] El API está reiniciado después de los cambios de caché.
- [ ] `P vs R` ya refleja `607` dentro de `GASTOS GENERALES`.
- [ ] `606` ya no aparece en `P vs R`.
- [ ] `Estado de Resultados` ya no muestra `401-001-000` pero sí las demás `401-*`.
- [ ] No reaparece la excepción de `AbsoluteExpirationRelativeToNow`.

---

## 📍 Siguiente Punto Recomendado

Retomar por este orden:

1. Validar visualmente `P vs R` en `contabilidad-online`.
2. Revisar la decisión funcional sobre `605/606/607` en `Estado de Resultados`.
3. Si sigue habiendo diferencias entre `cliente` y `online`, homologar la capa de presentación compartida.

---

Cierre de sesión preparado para continuación sin pérdida de contexto. ✅
