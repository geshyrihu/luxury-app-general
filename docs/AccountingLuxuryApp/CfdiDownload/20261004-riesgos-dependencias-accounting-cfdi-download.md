# PASO 3 — Riesgos y Dependencias: "Descarga Masiva de CFDI del SAT"

**Módulo:** `AccountingLuxuryApp / CfdiDownload` (nuevo, tipo A)
**Fecha:** 2026-10-04
**Insumos previos:**
- [20261004-entity-recon-accounting-cfdi-download.md](./20261004-entity-recon-accounting-cfdi-download.md) (PASO 0.5)
- [20261004-discovery-accounting-cfdi-download.md](./20261004-discovery-accounting-cfdi-download.md) (D1–D14)
- [20261004-business-rules-accounting-cfdi-download.md](./20261004-business-rules-accounting-cfdi-download.md) (FASE 0 — incluye Pre-Mortem PM1–PM5, no se repite aquí)

**Nota de alcance:** esta es la **única matriz de riesgos canónica** del plan. El Pre-Mortem de FASE 0 cubrió supuestos de *proceso/negocio*; esta matriz cubre riesgos *técnicos, de infraestructura, cumplimiento y concurrencia* — donde se solapan en tema (ej. Vault), el ángulo es distinto y se referencia en vez de repetirse.

---

## Matriz de riesgos (técnica + seguridad)

| # | Riesgo | Probabilidad | Impacto | Mitigación | Owner |
|---|---|---|---|---|---|
| R1 | Superficie de ataque sobre la e.firma: exfiltración vía logs, volcado de memoria, o alcance de permisos demasiado amplio al leer el secreto descifrado en memoria durante la autenticación SAT | Baja | Crítico — la e.firma permite operar fiscalmente a nombre del customer | No loguear nunca el valor descifrado (`.key`/password); descifrar solo en el momento de llamar a `AuthenticateAsync` y no persistir el resultado en variables de vida larga; revisar que `ISecretProvider.GetSecretAsync` no quede cacheado fuera de su scope de uso | Seguridad / Backend |
| R2 | Dependencia de un paquete NuGet de un tercero (`Fiscalapi.XmlDownloader`) para hablar con el SAT: el proveedor puede dejar de mantenerlo, o el SAT puede cambiar el contrato del WebService sin que el paquete se actualice a tiempo | Baja-Media | Alto — sin este cliente, reescribir el protocolo SOAP completo del SAT es un esfuerzo mayor | Versión fijada en `.csproj` (ya está en `6.0.0`); antes de actualizar, revisar el changelog (el propio README documenta breaking changes v5→v6); no hay alternativa drop-in si el paquete se abandona, por lo que cualquier falla del SAT debe diagnosticarse primero contra la documentación oficial del SAT, no asumir bug del paquete | Backend |
| R3 | Disponibilidad/rate limiting del WebService del SAT: el servicio tiene historial de caídas e impone límites; reintentos agresivos desde un job podrían generar bloqueos temporales de la sesión autenticada con la e.firma | Media | Medio — bloquea descargas de ese customer por un periodo | Backoff exponencial entre reintentos; límite máximo de reintentos por solicitud; no reintentar automáticamente en loop sin backoff | Backend |
| R4 | Volumen: un customer con alto número de proveedores/meses puede generar miles de CFDI y archivos XML/PDF; crecimiento de disco y de tamaño de respaldo sin monitoreo | Media (a validar con volumen real — pregunta abierta en discovery) | Medio | Monitorear tamaño de `sat-downloads`/CFDI por tenant; si el volumen real excede lo esperado, revisar política de retención en el Plan de implementación (sección de almacenamiento) | Backend / Infra |
| R5 | Datos fiscales/personales (RFC, nombres, montos de proveedores) se acumulan por años sin política de retención definida | Media | Medio-Alto (cumplimiento, no solo técnico) | Definir en el Plan si aplica una política de retención/purga, o si se conserva indefinidamente por requisito contable (CFF exige conservar CFDI 5 años) — **decisión pendiente del Tech Lead**, no se asume | Tech Lead / Legal |
| R6 | Concurrencia: dos usuarios del mismo customer disparan descargas con rangos de fechas que se traslapan al mismo tiempo → doble solicitud al SAT (gasta cupo) y/o condición de carrera al insertar los mismos UUID | Media | Bajo-Medio (RN-CFD-001 ya protege contra duplicado final, pero no contra gasto doble de cupo SAT) | Lock lógico por `CustomerId` mientras haya una solicitud `EnProceso`; bloquear o advertir si se intenta disparar una segunda mientras la primera no termina | Backend |
| R7 | Fuga entre tenants: una consulta mal filtrada expone CFDI de un customer a otro | ~~Baja~~ **Se materializó realmente en F7** (ver cierre abajo) | Crítico | ✅ **Cerrado 2026-10-04.** `ITenantEntity` **no** aplica filtro automático en este repo (verificado en F1, no es un supuesto). Auditoría de todas las queries del módulo encontró `SatDownloadAppService.CheckStatusAsync` buscando una solicitud solo por `Id`, sin `CustomerId` — cualquiera de los 8 roles podía consultar/avanzar la solicitud de otro customer con su GUID. Corregido (filtro `Id && CustomerId` + ruta con `{customerId}` obligatorio) y cubierto con 4 tests de regresión (`CfdiDownloadMultiTenantIsolationTests`), incluyendo el caso exacto que falló. | Backend / QA |
| R8 | Migración de BD: tablas nuevas fallan al aplicarse en un ambiente con datos existentes | Baja (son tablas 100% nuevas, sin relación obligatoria a tablas existentes salvo `CustomerId`) | Medio | Migraciones aditivas y reversibles, siguiendo `data-migration-protocol.md`; cero `ALTER` sobre `Customer`, `Invoice`, `OrdenCompraFactura` | Backend |
| R9 | Fuente del padrón EFOS (portal de datos abiertos del SAT) cambia de formato/URL sin aviso | ~~Media~~ **Confirmada como realidad, no hipótesis** (D16): la única URL verificable está rota desde 2018 | Medio | ✅ **Mitigado 2026-10-04 (D16).** Sin job automático: importación manual por `SuperUsuario`, quien ve el resultado (filas leídas/insertadas/omitidas) en el momento. El parser no asume layout fijo (busca columnas por nombre de encabezado, no por posición) y no sobrescribe si el archivo no trae columna RFC reconocible. 2 tests contra el formato real del SAT. | Backend |

---

## Matriz de dependencias con otros módulos

### Qué consume este módulo (dependencias hacia adentro)

| Dependencia | Qué necesita el módulo nuevo | Qué pasa si falla/cambia | Plan de contingencia |
|---|---|---|---|
| `Fiscalapi.XmlDownloader` (NuGet) | Cliente SOAP del SAT (auth, solicitud, verificación, descarga) | Sin él no hay comunicación con el SAT | Ya instalado y registrado (`AddXmlDownloader()`); ver R2 |
| `ISecretProvider` / Vault | Guardar y leer la e.firma cifrada | Si Vault no está disponible, no se pueden cargar nuevas e.firmas ni autenticar descargas | Vault ya es infraestructura crítica existente (la usa `JwtService` para login) — su disponibilidad no es un SLA nuevo que este módulo introduzca, hereda el existente |
| `IFileStructureResolver` / `IFileWritePathService` / `IFileReadPathService` | Directorios ya reservados `sat-downloads`, `sat-config` | Cambiar estas interfaces rompería decenas de módulos — no se tocan, solo se consumen | N/A (regla de no-ruptura ya establecida en PASO 0.5 §7) |
| `Customer.RFC` | Origen del RFC de cada solicitud | Campo ya `[Required]`; prácticamente no puede faltar | Validación defensiva igual: bloquear carga de e.firma si `Customer.RFC` viene vacío |
| `HangfireJobCatalog` | Un job nuevo de importación EFOS (y posible verificación periódica de solicitudes `EnProceso`) | Si Hangfire no corre, el padrón EFOS se desactualiza (PM4) y las solicitudes no avanzan solas | Alerta de antigüedad del padrón; opción de "verificar ahora" manual desde la UI como respaldo al job |
| `ApplicationDbContext` + migraciones | Tablas nuevas (`CustomerSatCredential`, `SatDownloadRequest`, `SatDownloadPackage`, `SatCfdiRecibido`, `CfdiRelacionado`, `EfosRecord`) | Ver R8 | Migraciones aditivas/reversibles |
| Fuente pública EFOS (portal de datos abiertos del SAT) | CSV/XLS fuera del control de LuxuryApp | Ver R9 | Fallo explícito, no silencioso |
| `IAuditable` | Trazabilidad de carga/reemplazo de e.firma | Interfaz estable, bajo riesgo | N/A |

### Qué NO depende de este módulo (confirmado — no se rompe nada existente)

Reitera la tabla de no-ruptura del reporte de entidades (§7), ya verificada contra el código real:

- `Invoice` / `InvoiceService` / `InvoicesEndpoints` (cobranza) — no se tocan, no se referencian más que por posible vínculo futuro opcional por UUID.
- `OrdenCompraFactura` (Compras) — no se toca.
- `CfdiXmlParser` (Compras) — no se toca ni se mueve; el módulo nuevo construye su propio parser (RN-CFD-032).
- `Funding` / `sat-funding` — confirmado explícitamente fuera de alcance (D9); módulo nuevo 100% independiente.
- `ReportExcelExportService` — no se reutiliza la clase; se usa `ClosedXML` directamente en un servicio propio.

**Conclusión de riesgo de ruptura:** todas las dependencias de este módulo son de **consumo de infraestructura compartida ya estable** (Vault, resolvedores de rutas, Hangfire, EF Core) sin modificar sus contratos, y ningún módulo activo en producción pasa a depender de este módulo nuevo. El riesgo de romper funcionalidad existente es **bajo**, condicionado a respetar R6 (concurrencia) y R7 (aislamiento multi-tenant) durante la implementación.

---

## Checklist de PASO 3

- [x] Matriz de riesgos técnica + seguridad (9 riesgos, con probabilidad/impacto/mitigación/owner)
- [x] Matriz de dependencias (qué necesita el módulo + qué pasa si falla + contingencia)
- [x] Tabla explícita de "qué NO depende de este módulo" (responde directamente la pregunta de no-ruptura ya planteada por el usuario)
- [x] Sin duplicar el Pre-Mortem de FASE 0 — se referencia donde el tema se solapa

**Siguiente paso:** PASO 4 — Plan de Implementación (11 secciones obligatorias, `plan-creation-protocol.md`).

---

## Cierre de F7 — Revisión final de riesgos (2026-10-04)

| # | Estado al cierre de F7 |
|---|---|
| PM1 (exposición e.firma) | Mitigado: nunca se loguea el valor descifrado; solo se lee del Vault de forma transitoria dentro de `LoadCredentialAsync`. |
| PM2 (rango > 200,000 CFDI) | **Sigue abierto.** No se implementó troceo automático de rango; el usuario captura el rango manualmente (D13) y es su responsabilidad no exceder el límite del SAT. Mejora futura, no bloqueante para v1. |
| PM3 (reutilizar `CfdiXmlParser` de Compras) | Mitigado: `SatCfdiParser` es un parser propio; `CfdiXmlParser` no se tocó en ningún momento de la construcción (verificable por `git diff` de ese archivo). |
| PM4 (job EFOS nunca agendado) | Ya no aplica: no hay job (D16). |
| PM5 (desincronización BD principal / Vault) | Mitigado: el código escribe a Vault primero; si falla, nunca se toca la BD principal (`CustomerSatCredentialAppService.UploadAsync`). |
| R1–R6, R8 | Sin cambios respecto al PASO 3 original; mitigaciones ya descritas se mantienen vigentes tal como se construyó. |
| R7 | **Cerrado** — ver fila arriba. Era un riesgo real, no solo teórico. |
| R9 | **Mitigado** — ver fila arriba (D16). |
| R4 (volumen) y R5 (retención) | **Siguen abiertos, sin cambio.** No se resuelven con código; dependen de uso real y de una decisión del Tech Lead respectivamente. No bloquean el cierre de F7 (ya estaban marcados como no-bloqueantes en el plan). |

**Conclusión:** de los 9 riesgos + 5 supuestos de pre-mortem originales, **2 se confirmaron como reales durante la construcción** (R7, R9) y ambos quedaron cerrados con código + pruebas. Los únicos pendientes genuinos (R4, R5, PM2) son operativos o de decisión de negocio, no defectos de código.
