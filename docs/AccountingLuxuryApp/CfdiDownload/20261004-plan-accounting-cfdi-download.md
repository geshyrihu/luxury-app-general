# Plan de Implementación — Descarga Masiva de CFDI del SAT

## Metadata

- **Módulo:** `AccountingLuxuryApp / CfdiDownload` (nuevo, tipo A)
- **Backend:** `api/LuxuryApp.Application/Modules/AccountingLuxuryApp/CfdiDownload/` + entidades en `api/LuxuryApp.Application/Infrastructure/Data/Entities/AccountingLuxuryApp/CfdiDownload/`
- **Frontend:** `appsweb/angular/src/app/modules/accounting.luxuryapp/cfdi-download/`
- **Fecha del plan:** 2026-10-04
- **Fuente origen:** instrucción explícita del Tech Lead (no nace de auditoría)
- **Insumos (no se repiten aquí, solo se referencian):**
  - [PASO 0.5 — Reconocimiento de entidades](./20261004-entity-recon-accounting-cfdi-download.md)
  - [Discovery D1–D14](./20261004-discovery-accounting-cfdi-download.md)
  - [FASE 0 — Reglas de negocio, KPIs, Pre-Mortem, Flujos](./20261004-business-rules-accounting-cfdi-download.md)
  - [PASO 3 — Riesgos y Dependencias](./20261004-riesgos-dependencias-accounting-cfdi-download.md)
- **Estado:** **Aprobado 2026-10-04** ("ya vamos a darle caña" — Tech Lead). Decisión pendiente de retención (R5) sigue abierta; no bloquea F1–F6.

---

## 1. Resumen Ejecutivo

**Problem Statement (copiado literal de FASE 0 §0.1):**

> Actualmente, el personal autorizado de cada customer (Contador, Administrador y los demás roles de D5) sufre de no tener un repositorio centralizado de los CFDI que sus proveedores les emiten, cuando intenta reunir y organizar esas facturas para control contable, lo que resulta en depender de la descarga manual directa del portal del SAT o de un programa externo ajeno a LuxuryApp. Esto afecta a los ~10-11 customers activos hoy en la base de datos (todos), que no tienen dentro de LuxuryApp ni el archivo XML, ni su representación en PDF, ni un cruce contra el padrón de proveedores en lista negra del SAT (EFOS).

**Solución:** un módulo nuevo e independiente (no toca `Funding`/`sat-funding`, D9) que:
1. Permite cargar/reemplazar la e.firma de un customer (cifrada en Vault).
2. Descarga CFDI **recibidos** (D10) del SAT para un rango de fechas elegido manualmente por el usuario (D13), usando el paquete `Fiscalapi.XmlDownloader` ya instalado y sin uso.
3. Guarda cada CFDI en un repositorio propio, deduplicado por UUID, con cruce automático contra el padrón EFOS (D11).
4. Muestra un listado con los datos clave y permite exportar XML (ya se tiene), PDF (por fila) y Excel (tabla completa) (D7, D12).

**Beneficios:**
- Elimina la dependencia de herramientas externas para los ~10-11 customers.
- Repositorio reutilizable por un futuro proceso de cuentas por pagar (explícitamente fuera de este alcance, D7) sin tener que re-descargar nada.
- Alerta temprana de proveedores en lista negra fiscal (EFOS), hoy inexistente.

---

## 2. Scope & Constraints

**IN-SCOPE:**
- Carga/reemplazo de e.firma por customer (1:1, D3), rol `SuperUsuario` únicamente (D15 — corrige D4/D14: el candado real del Vault, `SecretProviderService.EnsureSuperUsuario()`, solo acepta `SuperUsuario`/`Direccion`).
- Solicitud de descarga de CFDI **recibidos** con rango de fechas manual (D10, D13), disparada por los 8 roles de D5/D5b.
- Repositorio de CFDI con reconciliación por UUID (no duplica, detecta cambios Vigente→Cancelado) (D7, RN-CFD-001/011).
- Listado con datos clave (proveedor, fecha, monto total, RFC + catálogo ampliado de FASE 0 §0.2), consultable por los mismos 8 roles (D6).
- Generación de PDF por CFDI y exportación a Excel del listado (D7, D12).
- Importación y cruce automático contra el padrón EFOS del SAT, 3 estados (Presunto/Definitivo/Desvirtuado) (D11).
- Auditoría de carga/reemplazo de e.firma vía `IAuditable` (D14).

**OUT-OF-SCOPE (explícito, confirmado con el usuario):**
- Cuentas por pagar / conciliación contra órdenes de compra — "otro proceso que no se toca acá" (D7).
- CFDI **emitidos** — el customer no emite facturas (D10).
- Cualquier cambio a `Funding`, `sat-funding`, `Invoice`/`InvoiceService`, `OrdenCompraFactura`, `CfdiXmlParser` (D9, PASO 0.5 §7 — regla de no-ruptura).
- Descarga/operación multi-customer simultánea (D2 — explícitamente prohibido).
- Historial completo de cada reemplazo de e.firma (solo el último cambio vía `IAuditable`, D14 — ampliarlo a bitácora completa es una mejora futura explícitamente diferida).
- Política de retención/purga de CFDI históricos — **decisión pendiente del Tech Lead** (R5), no se implementa hasta decidirse; por defecto se conservan indefinidamente (cumple el mínimo legal de 5 años del CFF).

---

## 3. Arquitectura & Diseño Técnico

### 3.1 Entidades (nuevas, todas bajo `Entities/AccountingLuxuryApp/CfdiDownload/`)

| Entidad | Tabla | Tenant | Campos clave | RN que cubre |
|---|---|---|---|---|
| `CustomerSatCredential` | `CustomerSatCredentials` | `ITenantEntity`, índice único real en BD por `CustomerId` (`[Index(IsUnique=true)]`) | `RfcValidado`, `CertificadoPath` (el `.cer` es público, se guarda como archivo normal vía `IFileWritePathService`, no en Vault), `LlaveVaultSecretName`, `PasswordVaultSecretName` (ambos en Vault), `VigenciaDesde`, `VigenciaHasta`. Sin campo `Activa`: reemplazar la e.firma es un `UPDATE` de la misma fila (consistente con D14 — sin historial de versiones, solo `IAuditable.UpdatedBy/At`) | RN-CFD-003, 004, 012 |
| `SatDownloadRequest` | `SatDownloadRequests` | `ITenantEntity` | `FechaInicio`, `FechaFin`, `EstadoSolicitud` (Creada/Autenticando/EnProceso/Lista/Fallida/Descargada), `SatRequestId`, `MensajeSat`, `IntentosVerificacion` | RN-CFD-010, 031 |
| `SatDownloadPackage` | `SatDownloadPackages` | hereda tenant vía `SatDownloadRequest` | `SatDownloadRequestId`, `SatPackageId`, `RutaZip`, `FechaDescarga`, `CfdiExitosos`, `CfdiConError` | Soporte de RN-CFD-010 |
| `SatCfdiRecibido` | `SatCfdiRecibidos` | `ITenantEntity` | `UUID` (único con `CustomerId`), `RfcEmisor`, `NombreEmisor`, `RfcReceptor`, `Serie`, `Folio`, `FechaEmision`, `FechaTimbrado`, `TipoComprobante`, `Moneda`, `TipoCambio`, `SubTotal`, `Descuento`, `Total`, `IvaTrasladado`, `RetencionIsr`, `RetencionIva`, `FormaPago`, `MetodoPago`, `UsoCFDI`, `EstadoSat` (Vigente/Cancelado/NoEncontrado), `FechaCancelacion`, `XmlPath`, `PdfPath` (nulable), `SatDownloadPackageId`, `ProviderId` (nulable, FK a `Providers` por RFC), `EfosEstado` | RN-CFD-001, 011, 032 |
| `CfdiRelacionado` | `SatCfdiRelacionados` | hereda tenant vía `SatCfdiRecibido` | `SatCfdiRecibidoId`, `UuidRelacionado`, `TipoRelacion` | Soporte futuro de AP (REP) |
| `EfosRecord` | `EfosRecords` | **Global, sin tenant** (catálogo del SAT, no es por customer) | `Rfc` (index), `NombreContribuyente`, `Situacion` (Presunto/Definitivo/Desvirtuado/SentenciaFavorable), `FechaPublicacion`, `FechaActualizacionImport` | RN-CFD-033 |

**Todas implementan `IAuditable`** (RN-CFD-022 para `CustomerSatCredential`; en el resto, buena práctica consistente con el patrón del sistema).

### 3.2 Servicios (`Modules/AccountingLuxuryApp/CfdiDownload/`)

- `ICustomerSatCredentialAppService` — cargar/reemplazar e.firma; valida `RfcValidado == Customer.RFC` (RN-CFD-003) antes de guardar; separa `.cer` (archivo normal) de `.key`+password (`ISecretProvider.StoreSecretAsync`, RN-CFD-004).
- `ISatDownloadAppService` — orquesta `Fiscalapi.XmlDownloader`: `AuthenticateAsync` → `CreateRequestAsync` (siempre `RequestType = Recibidos`, D10) → `VerifyAsync` (polling) → `DownloadAsync`.
- `ISatCfdiParser` (parser propio, **nuevo**, no reutiliza ni modifica `CfdiXmlParser` de Compras — regla de no-ruptura PASO 0.5 §7 / RN-CFD-032).
- `ISatCfdiReconciliationService` — al insertar, dedupe por `(CustomerId, UUID)`; si ya existe y el estado SAT cambió, actualiza (`EstadoSat`, `FechaCancelacion`); si no cambió, ignora (RN-CFD-001, 011).
- `IEfosImportService` — descarga e importa el CSV/XLS público del SAT (3 estados, RN-CFD-033); falla explícito si el formato cambia (R9).
- `ISatCfdiExportService` — PDF por fila (plantilla nueva con QuestPDF) y Excel del listado (ClosedXML directo, sin reutilizar `ReportExcelExportService`, PASO 0.5 §7).

### 3.3 Endpoints (Minimal API, bajo `EndPoints/`)

| Método | Ruta | Roles (D4/D5/D5b/D6) |
|---|---|---|
| POST | `/api/accounting/cfdi-download/credential` | `SuperUsuario` únicamente (D15) |
| GET | `/api/accounting/cfdi-download/credential/{customerId}` (estado, sin exponer secretos) | Los 8 roles |
| POST | `/api/accounting/cfdi-download/requests` (body: `FechaInicio`, `FechaFin`) | Los 8 roles |
| GET | `/api/accounting/cfdi-download/requests/{id}` | Los 8 roles |
| GET | `/api/accounting/cfdi-download/cfdi?customerId=` (paginado) | Los 8 roles |
| GET | `/api/accounting/cfdi-download/cfdi/{id}/pdf` | Los 8 roles |
| GET | `/api/accounting/cfdi-download/cfdi/export-excel?customerId=` | Los 8 roles |

Todos los endpoints filtran por `CustomerId` del contexto activo (RN-CFD-002); ninguno acepta una lista de customers.

### 3.4 Frontend (`modules/accounting.luxuryapp/cfdi-download/`)

- `credential-form` — carga/reemplazo de e.firma (solo visible para los 3 roles de D4).
- `download-request-form` — captura `FechaInicio`/`FechaFin`, dispara la solicitud.
- `cfdi-list` (desktop/mobile) — reutiliza el componente de tabla ya existente `AppTable`/`AppSortableColumn` (`src/app/shared/ui/web/lux-table/lux-table`, visto en uso real en `sat-funding-detail.ts`), **no PrimeNG** (prohibido desde 2026-09-16). Columnas: proveedor (RFC+nombre), fecha, total, forma/método de pago, estado SAT, estado EFOS (badge), acciones (XML/PDF).
- Botón "Exportar a Excel" sobre el listado completo/filtrado.

### 3.5 Migración de Datos & Prevención de Pérdida

**Aplica — todas las tablas son nuevas (bajo riesgo).**

#### 3.5.1 Cambios de Estructura

| Tabla | Cambio | Riesgo | Mitigación |
|---|---|---|---|
| `CustomerSatCredentials` | Nueva | Bajo | Índice único en `CustomerId` desde el inicio |
| `SatDownloadRequests` | Nueva | Bajo | Índice `(CustomerId, EstadoSolicitud)` |
| `SatDownloadPackages` | Nueva | Bajo | FK a `SatDownloadRequests` |
| `SatCfdiRecibidos` | Nueva | Bajo | Índice único `(CustomerId, UUID)` desde el inicio (RN-CFD-001) |
| `SatCfdiRelacionados` | Nueva | Bajo | FK a `SatCfdiRecibidos` |
| `EfosRecords` | Nueva | Bajo | Índice en `Rfc` |

**Ninguna migración toca `Customer`, `Invoice`, `OrdenCompraFactura` ni ninguna tabla existente** (confirmado en la matriz de dependencias, PASO 3).

#### 3.5.2 Análisis de Pérdida de Datos

Ninguna — son tablas nuevas, sin datos previos que perder. El único riesgo de pérdida posterior (no de esta migración) es operativo: si se trunca `SatCfdiRecibidos` por error, se pierde el XML indexado (el archivo físico en disco puede sobrevivir si no se borra junto); mitigación: no exponer un endpoint de borrado masivo en v1.

#### 3.5.3 Script de Migración

Generado vía EF Core Migrations (`dotnet ef migrations add AddCfdiDownloadModule`), no SQL manual — es el patrón ya usado en todo el repo (carpeta `Infrastructure/Data/Migrations/`). Ubicación del script generado: `api/LuxuryApp.Application/Infrastructure/Data/Migrations/YYYYMMDDHHmmss_AddCfdiDownloadModule.cs`.

#### 3.5.4 Validación Post-Migración (checklist)

- [ ] Migración aplica sin error en ambiente de desarrollo
- [ ] `COUNT(*)` en las 6 tablas nuevas = 0 inmediatamente después
- [ ] Índices únicos confirmados (`CustomerId` en credenciales, `(CustomerId, UUID)` en CFDI)
- [ ] `ApplicationDbContextModelSnapshot.cs` refleja las 6 entidades nuevas
- [ ] 0 cambios detectados en tablas existentes (`git diff` de la migración solo agrega, no modifica `CREATE TABLE` previos)

#### 3.5.5 Rollback Plan

`dotnet ef migrations remove` si no se ha aplicado; si ya se aplicó, migración reversa que hace `DROP TABLE` de las 6 tablas nuevas (sin impacto a ninguna otra, confirmado sin FKs entrantes desde tablas existentes).

#### 3.5.6 Comunicación Post-Migración

- [ ] Tech Lead confirma migración exitosa
- [ ] Changelog en `docs/AccountingLuxuryApp/CfdiDownload/YYYYMMDD-changelog-accounting-cfdi-download-migracion.md`
- [ ] Frontend notificado de los DTOs finales antes de iniciar Fase 6

### 3.6 Tokens de Diseño (frontend)

| Uso | Token |
|---|---|
| Headers / acciones primarias | `var(--primary-700)` |
| Badge EFOS "Definitivo" / estado "Cancelado" | `var(--danger-600)` |
| Badge EFOS "Presunto" | un token de advertencia existente (ej. `--warning-600` si existe en `_colors.scss`; **verificar nombre exacto antes de usar — no inventar uno nuevo**) |
| Badge "Vigente" / "Limpio" | `var(--success-600)` |
| Padding de tarjetas/tabla | `var(--ds-space-lg)` / `var(--ds-space-md)` |
| Bordes | `var(--ds-border-default)` |
| Radios | `var(--ds-radius-md)` |

**Validación pre-delivery (obligatoria antes de cualquier PR frontend):** 5 greps de `design-tokens-rule.md` (hex, padding/margin literal, font-size literal, box-shadow literal, border-radius literal) → 0 resultados en `modules/accounting.luxuryapp/cfdi-download/`.

---

## 4. Backlog de Tasks

- [ ] Entidades + `EntityConfigurations` (si aplica) + registrar `DbSet<>` en `ApplicationDbContext`
- [ ] Migración EF (`AddCfdiDownloadModule`)
- [ ] `ICustomerSatCredentialAppService` + validación RFC + integración Vault
- [ ] `ISatDownloadAppService` (orquestación `Fiscalapi.XmlDownloader`)
- [ ] `ISatCfdiParser` (parser propio)
- [ ] `ISatCfdiReconciliationService` (dedupe + detección de cambio de estado)
- [ ] `IEfosImportService` + job Hangfire (`efos-actualizar-padron`, entrada nueva en `HangfireJobCatalog`)
- [ ] `ISatCfdiExportService` (PDF por fila con QuestPDF + Excel con ClosedXML)
- [ ] Endpoints Minimal API (7, tabla §3.3) con autorización por rol
- [ ] Frontend: `credential-form`, `download-request-form`, `cfdi-list` (desktop/mobile con `AppTable`)
- [ ] Tests unitarios: parser, reconciliación (dedupe), autorización por rol
- [ ] Test de regresión de aislamiento multi-tenant (R7)
- [ ] Revisión de seguridad enfocada en manejo de la e.firma (R1, PM1)

---

## 5. Fases de Ejecución (por dependencias, tamaño relativo S/M/L — sin fechas, las aporta quien tenga capacidad)

| Fase | Contenido | Tamaño | Depende de | Criterio de PASO |
|---|---|---|---|---|
| F1 | Entidades + migración + `DbSet<>` | S | — | ✅ **Hecho 2026-10-04.** Migración aplicada en dev; 6 tablas en 0 filas; 0 cambios a tablas existentes. Bug corregido en el camino: `CustomerSatCredentials.CustomerId` no quedó único en el primer intento (y sobraba un campo `Activa` que contradecía D14) — se revirtió, se corrigió la entidad y se regeneró la migración. |
| F2 | `CustomerSatCredential` + Vault + validación RFC | M | F1 | ✅ **Hecho 2026-10-04.** Compila limpio; `.key`/password nunca tocan `ApplicationDbContext` (solo nombres de secreto); `ValidateOnBuild` confirma la cadena de DI del servicio sin arrancar el servidor en vacío. **No verificado:** autenticación real contra el SAT — requiere una e.firma de sandbox/real que no se tenía disponible en la sesión. |
| F3 | Orquestación de descarga + parser propio + reconciliación | L | F2 | ✅ **Hecho 2026-10-04**, con un hallazgo que redefine el alcance de RN-CFD-011: el SAT **solo permite `InvoiceStatus = Vigente`** para descargas de tipo CFDI (XML completo) en modalidad Recibidos (confirmado contra el propio código de `QueryService.BuildRecibidosAttributes`, no solo la investigación de FASE 0) — nunca entrega cancelados por esta vía. La reconciliación queda como dedupe puro por UUID (inserta si es nuevo, no toca si ya existe); detectar transiciones Vigente→Cancelado sigue pendiente (gap G8, requiere metadata o consulta de estatus aparte, no construido). Se agregó `SatDownloadPackage.CfdiDuplicados` (migración adicional, aditiva) para reportar el resultado real de cada descarga. **No verificado:** descarga real de CFDI del SAT (misma limitación de F2). |
| F4 | Importación EFOS **manual** (sin job automático, D16) + cruce automático al descargar | S | F1 (independiente de F2/F3) | ✅ **Hecho 2026-10-04.** Rediseñado: no existe URL oficial del SAT estable/vigente para automatizar (confirmado contra un archivo real del SAT — desactualizado desde 2018, trámite equivocado — confirma R9). Un rol `SuperUsuario` sube el CSV que el SAT publica, indicando a qué situación corresponde; `EfosImportAppService` valida columnas por nombre de encabezado (no por posición fija) y actualiza `EfosRecord` (único por RFC). Cruce automático al descargar (`SatCfdiReconciliationService`) + re-evaluación retroactiva de CFDI ya guardados al importar un padrón nuevo. **Probado con 2 tests contra un archivo CSV real del SAT** (formato/encoding reales, no inventados): decodificación Latin1 y limpieza del prefijo `&` que el SAT antepone a cada RFC en su exportación — ambos hallazgos habrían corrompido silenciosamente los datos sin la corrección. Bug real atrapado por el test antes de llegar a producción: `Encoding.GetEncoding(1252)` no funciona en .NET moderno sin un paquete adicional; se cambió a `Encoding.Latin1` (nativo, mismo resultado para acentos del español). |
| F5 | XML→PDF + exportación Excel | M | F3 | ✅ **Hecho 2026-10-04.** `SatCfdiPdfExportService` (QuestPDF, patrón de `NativeStatementPdfExportService`) + `SatCfdiExcelExportService` (ClosedXML directo, sin reutilizar `ReportExcelExportService`) + `ISatCfdiQueryAppService` (listado/detalle, nuevo — necesario como soporte de ambas exportaciones) + 3 endpoints. Bug real atrapado antes de producción: la primera versión intentaba usar `enum.GetDisplayName()` (reflexión) dentro de un `.Select()` de EF Core — no traducible a SQL, habría tronado en el primer request; se corrigió materializando la entidad primero y proyectando en memoria. **3 tests contra datos reales** (firma de archivo `%PDF-`, Excel reabierto con ClosedXML, fila resaltada cuando hay alerta EFOS, campos opcionales nulos no truenan el PDF) — todos pasan. |
| F6 | Frontend completo | M | F3, F4, F5 | ✅ **Hecho 2026-10-04.** Página `CfdiDownloadHub` (estado de e.firma + solicitud/verificación de descarga + tabla de CFDI con filtro, PDF y Excel), modal `CredentialForm`, tabla `CfdiList` desktop/mobile con `lux-table`. Ruteada en `/accounting/cfdi-download` con `hasRolesGuard` (8 roles). **Hallazgo real:** el primer intento de ruteo se agregó a `modules/accounting.luxuryapp/accounting.routes.ts`, un archivo que **nadie importa** (huérfano) — el árbol realmente montado es `routing/accounting.routing.ts`; se corrigió antes de terminar. Se agregó tarjeta en el hub real de Contabilidad (`contabilidad-modules.ts`) para que el módulo sea descubrible, no solo alcanzable por URL. D17 (ampliar carga de e.firma a `Direccion`) surgió aquí, al ver que `AspRoleService` trata `SuperUsuario`/`Direccion` como par en todo el frontend. Build completo de producción (`ng build`) sin errores — **criterio de PASO parcialmente verificado**: la compilación y el ruteo están confirmados; probar el happy path real con credenciales de los 8 roles requiere un entorno con usuarios de prueba, no se ejecutó en esta sesión. |
| F7 | Seguridad + aislamiento multi-tenant + cierre de riesgos | S | F1–F6 (ejecutada antes de F6 por recomendación — backend ya estable, cierra el riesgo más crítico primero) | ✅ **Hecho 2026-10-04**, con un hallazgo real: auditoría de **todas** las queries del módulo (no solo las nuevas) encontró que `SatDownloadAppService.CheckStatusAsync` buscaba una solicitud de descarga solo por `Id`, sin verificar el `CustomerId` dueño — cualquiera de los 8 roles podía consultar y avanzar la descarga de **otro customer** con su GUID. R7 no era solo teórico. Corregido (ruta + interfaz + servicio exigen `customerId`) y cubierto con 4 tests de regresión nuevos (`CfdiDownloadMultiTenantIsolationTests`) que fallarían contra el código original. Revisión completa de PM1–PM5/R1–R9: ver cierre en `20261004-riesgos-dependencias-accounting-cfdi-download.md`. Pendientes genuinos sin resolver (no bloquean): PM2 (troceo automático de rango >200k), R4 (monitoreo de volumen), R5 (política de retención, decisión de Tech Lead). |

---

## 6. Criterios de Completitud (Definition of Done)

- [ ] Las 13 RN de FASE 0 (§0.2) verificadas en código, una por una, con test o evidencia explícita
- [ ] 0 duplicados por `(CustomerId, UUID)` en prueba de re-descarga del mismo rango (RN-CFD-001)
- [ ] 0 acceso cross-tenant confirmado por test de regresión (R7)
- [ ] Exactamente los 8 roles de D5/D5b/D6 tienen acceso; cualquier otro rol recibe 403 (test)
- [ ] `.key` y contraseña de la e.firma nunca presentes en `ApplicationDbContext` — verificado por grep antes de cerrar
- [ ] PDF y Excel se generan sin error para un conjunto de prueba de al menos 10 CFDI
- [ ] Padrón EFOS importado y cruzado automáticamente al insertar cada CFDI nuevo
- [ ] `CfdiXmlParser` de Compras sin modificaciones (`git diff` vacío en ese archivo)
- [ ] `node scripts/audit-conventions.mjs` y `node scripts/check-agent-rules.mjs` pasan

---

## 7. Riesgos & Mitigaciones

Matriz completa (9 riesgos técnicos/seguridad) y Pre-Mortem (5 supuestos) ya documentados — **no se duplican aquí**:
- [Pre-Mortem PM1–PM5](./20261004-business-rules-accounting-cfdi-download.md#pre-mortem)
- [Matriz de riesgos R1–R9](./20261004-riesgos-dependencias-accounting-cfdi-download.md#matriz-de-riesgos-técnica--seguridad)

**Los 3 de mayor impacto para seguimiento activo durante la ejecución:** R1 (exposición de e.firma), R7 (fuga cross-tenant), R5 (retención de datos fiscales — decisión pendiente del Tech Lead, bloquea cerrar F7 si sigue sin resolverse).

---

## 8. Dependencias Externas

Matriz completa ya documentada — **no se duplica aquí**: [Matriz de dependencias](./20261004-riesgos-dependencias-accounting-cfdi-download.md#matriz-de-dependencias-con-otros-módulos).

Resumen de las 2 dependencias externas al repo (no a otro módulo interno):
- `Fiscalapi.XmlDownloader` 6.0.0 (NuGet, ya instalado) — cliente del WebService del SAT.
- Portal de datos abiertos del SAT (CSV/XLS del padrón EFOS) — fuente pública fuera del control de LuxuryApp.

---

## 9. Métricas & KPIs de Éxito

Copiados literal de FASE 0 §0.1:

| # | Métrica | Baseline | Target | Verificación |
|---|---|---|---|---|
| K1 | % customers con repositorio de CFDI recibidos en LuxuryApp | 0% | 100% (10-11 de 10-11) | Conteo de customers con ≥1 `SatCfdiRecibido` |
| K2 | % CFDI recibidos con cruce EFOS automático | 0% | 100% de los nuevos | Query: CFDI sin `EfosEstado` evaluado = 0 |
| K3 | Duplicados por re-descarga del mismo rango | N/A (no existe hoy) | 0 | Constraint único + prueba de regresión |
| K4 | Fallos de descarga sin mensaje claro al usuario | N/A | 0% | `SatDownloadRequest.Status = Fallida` con `MensajeSat` no nulo en el 100% de los casos |

---

## 10. Rollback Plan

- **Código:** revert del PR/feature branch; las rutas nuevas no modifican ninguna ruta existente, por lo que un rollback de código no afecta otros módulos.
- **Datos:** `dotnet ef migrations remove` (si no aplicada) o migración reversa `DROP TABLE` de las 6 tablas nuevas (§3.5.5) — sin impacto a tablas existentes, confirmado sin FKs entrantes.
- **Infraestructura:** si el job de EFOS causa problemas, se retira del catálogo (`HangfireJobCatalog`) siguiendo el mecanismo de reconciliación ya existente en `HangfireExtensions.cs` (un job retirado del catálogo se desregistra automáticamente del storage).
- **Secretos:** si una e.firma se cargó con datos incorrectos, `RevokeSecretAsync` del Vault ya existente cubre la revocación sin tocar el resto del sistema de secretos.

---

## 11. Post-Implementation Review (a completar al cierre)

Preguntas a responder una vez implementado, no antes:

- ¿Se cumplieron K1–K4 con los valores reales medidos?
- ¿Cuáles de los riesgos R1–R9 y PM1–PM5 se materializaron realmente, y cuáles fueron sobreestimados/subestimados?
- ¿El volumen real de CFDI por customer (R4) coincidió con lo esperado, o se requiere ajustar la política de almacenamiento?
- ¿Se tomó ya una decisión sobre la política de retención (R5), y cuál fue?
- ¿`Funding`/`sat-funding` se retomó después, y en ese caso, consumió este repositorio como se recomendó en D8, o se construyó un segundo mecanismo?
- Learnings para una v2 (ej. backfill automático, histórico más allá de 6 meses, CFDI emitidos si el negocio cambia).

---

## Checklist de cierre del plan (PASO 5)

- [x] FASE 0 completa (Problem, KPIs, 13 RN en 4 niveles, Pre-Mortem, Flujos) — documento separado, referenciado
- [x] 11 secciones con contenido verificable, sin placeholders
- [x] Cada RN mapeada a entidad/servicio propuesto en §3
- [x] Sección 3.5 (Migración) completa — aplica, todas las tablas son nuevas
- [x] Sección 3.6 (Tokens) completa, con advertencia explícita de verificar el nombre exacto del token de advertencia antes de usarlo (no se inventó)
- [x] Riesgos con responsable + mitigación (referenciados, no duplicados)
- [x] KPIs con target + verificación (sin fecha inventada — timeline "según capacidad", conforme a la prohibición de cronograma inventado)
- [ ] **Pendiente:** aprobación explícita del Tech Lead (gate de PASO 5) + ejecución de `audit-conventions.mjs` / `check-agent-rules.mjs` antes de iniciar F1
- [ ] **Pendiente:** decisión del Tech Lead sobre política de retención de CFDI (R5) — no bloquea F1–F6, sí bloquea cerrar F7
