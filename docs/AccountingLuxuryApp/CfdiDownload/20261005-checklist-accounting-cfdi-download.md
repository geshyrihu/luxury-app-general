# Checklist de Cierre — Descarga Masiva de CFDI del SAT

**Módulo:** `AccountingLuxuryApp / CfdiDownload`
**Fecha:** 2026-10-05
**Estado general:** Construcción completa (F1-F7 del plan). Documentación §4.7 en curso (este mismo lote).

## Backend

- [x] 6 entidades + migraciones aditivas aplicadas (`AddCfdiDownloadModule`, `AddSatCfdiDuplicadosCounter`, `AddEfosRecordUniqueRfc`)
- [x] 3 enums (`SatDownloadRequestStatus`, `CfdiSatStatus`, `EfosSituacion`)
- [x] 8 servicios (credencial, orquestación de descarga, parser, reconciliación, consulta, PDF, Excel, import EFOS)
- [x] 9 endpoints, autorizados por rol
- [x] `GlobalUsings.cs` (Application, Api, Tests) actualizado con los namespaces nuevos
- [x] `.key`/contraseña nunca en `ApplicationDbContext` (verificado por grep, F7)
- [x] Compila sin errores (`dotnet build` limpio en las 3 fases en que se verificó)

## Frontend

- [x] `CfdiDownloadHub`, `CredentialForm`, `CfdiList` (desktop/mobile)
- [x] Rutas registradas en el árbol realmente montado (`routing/accounting.routing.ts`)
- [x] Tarjeta de descubrimiento en el hub real de Contabilidad
- [x] Build de producción completo sin errores (`ng build`)

## Pruebas

- [x] 9 tests automatizados, todos en verde:
  - `EfosImportAppServiceTests` (2) — decodificación Latin1, limpieza de prefijo `&`, no-duplicación por RFC
  - `SatCfdiExportServicesTests` (3) — PDF válido, Excel válido, campos opcionales nulos no truenan
  - `CfdiDownloadMultiTenantIsolationTests` (4) — aislamiento entre customers, incluyendo el caso que expuso el bug de R7

## Seguridad (F7)

- [x] Auditoría de **todas** las queries del módulo contra `CustomerId`
- [x] Bug real encontrado y corregido: `CheckStatusAsync` sin filtro de tenant (R7)
- [x] Revisión completa de PM1-PM5 / R1-R9 — ver cierre en el documento de riesgos

## Decisiones correctivas tomadas durante la construcción (no estaban en el plan original)

| # | Qué cambió | Por qué | Dónde está documentado |
|---|---|---|---|
| 1 | `CustomerSatCredentials.CustomerId` único + sin campo `Activa` | El primer intento no dejaba el índice único y contradecía D14 | Plan, fila F1 |
| 2 | Carga de e.firma restringida a `SuperUsuario` (luego ampliado a `SuperUsuario,Direccion`) | El Vault ya exige esos roles exactos; D15 y D17 | Discovery D15/D17 |
| 3 | EFOS: importación manual, no job automático | No existe URL oficial estable del SAT | Discovery D16, Riesgos R9 |
| 4 | `Encoding.GetEncoding(1252)` → `Encoding.Latin1` | La primera no funciona en .NET moderno sin paquete adicional; lo atrapó un test | Plan, fila F4 |
| 5 | `CheckStatusAsync` exige `customerId` | Fuga entre tenants real (R7) | Plan y Riesgos, fila/sección F7 |
| 6 | Ruta movida de `accounting.routes.ts` (huérfano) a `routing/accounting.routing.ts` | El primero no lo importa nadie | Plan, fila F6 |

## Documentación (§4.6 / §4.7 de CONVENTIONS.md)

Por instrucción del Tech Lead, todo vive en `docs/AccountingLuxuryApp/CfdiDownload/` (no en las rutas por-módulo que indica §4.7):

- [x] Discovery, Business Rules, Plan, Riesgos (ya existían de la construcción)
- [x] Arquitectura (`20261005-architecture-*.md`)
- [x] Este checklist
- [ ] README (Nivel 1) — en curso
- [ ] Documentación técnica (Nivel 2) — en curso
- [ ] Operativo (frontend) — en curso
- [ ] Setup (frontend) — en curso
- [ ] Decisiones (frontend) — en curso
- [ ] Auditoría ejecutada — en curso
- [ ] Guía de Usuario (Nivel 3, vía skill `guia-usuario-modulo`, requiere exploración real con Playwright) — **pendiente, se hace aparte**

## Pendientes genuinos (no bloquean, requieren decisión o uso real)

- [ ] R5 — Política de retención de CFDI: decisión del Tech Lead, no tomada
- [ ] R4 — Monitoreo de volumen de disco: sin implementar, se evalúa con uso real
- [ ] PM2 — Troceo automático de rangos de fecha >200,000 CFDI: no implementado, responsabilidad del usuario por ahora
- [ ] Happy path end-to-end con e.firma real/sandbox y usuarios de los 8 roles: no se ejecutó en esta sesión (requiere credenciales reales del SAT)
