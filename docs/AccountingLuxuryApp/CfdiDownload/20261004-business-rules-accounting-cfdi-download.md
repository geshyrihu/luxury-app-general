# FASE 0 — Business Rules Discovery: "Descarga Masiva de CFDI del SAT"

**Módulo:** `AccountingLuxuryApp / CfdiDownload` (nuevo, tipo A)
**Fecha:** 2026-10-04
**Insumos previos:**
- [20261004-entity-recon-accounting-cfdi-download.md](./20261004-entity-recon-accounting-cfdi-download.md) (PASO 0.5 — reconocimiento de entidades y acoplamientos)
- [20261004-discovery-accounting-cfdi-download.md](./20261004-discovery-accounting-cfdi-download.md) (D1–D14, cerrado)

Sigue la estructura obligatoria de [`business-rules-discovery-phase-0.md`](../../../conventions/operations/business-rules-discovery-phase-0.md).

---

## 0.1 Problem Statement + KPIs

### Problem Statement

```
Actualmente, el personal autorizado de cada customer (Contador, Administrador y
los demás roles de D5) sufre de no tener un repositorio centralizado de los CFDI
que sus proveedores les emiten, cuando intenta reunir y organizar esas facturas
para control contable, lo que resulta en depender de la descarga manual directa
del portal del SAT o de un programa externo ajeno a LuxuryApp (confirmado:
"hoy ellos descargan directo del SAT o con otro programa externo", 2026-10-04).

Esto afecta a los ~10-11 customers activos hoy en la base de datos (todos,
sin subconjunto piloto — D7/respuesta del usuario), que no tienen dentro de
LuxuryApp ni el archivo XML, ni su representación en PDF, ni un cruce contra
el padrón de proveedores en lista negra del SAT (EFOS).
```

**Nota de alcance (ya cerrada, D9):** el módulo es independiente; no depende de ni modifica `Funding`/`sat-funding` (activo en producción, fuera de alcance).

### KPIs

| # | Métrica | Baseline | Target | Timeline | Verificación |
|---|---|---|---|---|---|
| K1 | % de customers activos con repositorio de CFDI recibidos dentro de LuxuryApp | 0% (0 de ~10-11; hoy 100% depende de SAT directo o herramienta externa) | 100% (10-11 de 10-11) | Según capacidad del equipo — a fijar en el Plan (Sección 5, no se inventa fecha aquí) | Conteo de customers con ≥1 registro en la tabla de CFDI recibidos |
| K2 | % de CFDI recibidos descargados con cruce automático contra EFOS | 0% (no existe el cruce hoy) | 100% de los CFDI nuevos descargados | Mismo hito que K1 | Query: CFDI sin evaluación EFOS pendiente = 0 |
| K3 | Duplicados por re-descarga del mismo rango de fechas | No aplica hoy (no hay repositorio) | 0 duplicados por `(CustomerId, UUID)` | Desde el primer release | Constraint único en BD + prueba de regresión: descargar dos veces el mismo rango, verificar conteo de filas sin cambio |
| K4 | Errores silenciosos en solicitudes de descarga (vs. mensaje claro al usuario) | No aplica (proceso manual externo, sin esta falla) | 0% de fallos sin mensaje específico del SAT visible al usuario | Desde el primer release | Revisión de `SatDownloadRequest.Status = Fallida` con `MensajeSat` no nulo en el 100% de los casos |

---

## 0.2 Matriz de Reglas de Negocio

**Nota de mapeo (módulo nuevo, tipo A):** no existe código previo del módulo; "ubicación" apunta a la entidad/servicio **propuesto** (nombres provisionales, sujetos a confirmación en el Plan de implementación), no a código ya escrito. Entidades propuestas: `CustomerSatCredential`, `SatDownloadRequest`, `SatDownloadPackage`, `SatCfdiRecibido`, `CfdiRelacionado`, `EfosRecord`.

### Nivel 1 — Invariantes de Dominio

| RN | Regla | Justificación |
|---|---|---|
| RN-CFD-001 | Todo CFDI recibido es único por `(CustomerId, UUID)` | Evita duplicados al re-descargar el mismo periodo (D7: "concilie lo que tiene"). Ubicación: índice único en `SatCfdiRecibido`. |
| RN-CFD-002 | Toda operación del módulo (solicitud, paquete, CFDI, consulta) está acotada a un único `CustomerId` en contexto; no existe operación multi-customer | D2, confirmado explícitamente ("nunca varios customers en una misma descarga"). Ubicación: todo servicio recibe `CustomerId` único, nunca una lista. |
| RN-CFD-003 | El RFC del certificado de e.firma cargado debe coincidir con `Customer.RFC` | D3 (relación 1:1 verificada: `Customer.RFC`, `Customer.cs:32-34`). Ubicación: validación al cargar la e.firma, antes de guardar en Vault. |
| RN-CFD-004 | El archivo `.key` y la contraseña de la e.firma nunca se almacenan en `ApplicationDbContext`; solo en Vault cifrado (AES-256-GCM) | Hallazgo PASO 0.5 (G2) + acoplamiento crítico con `ISecretProvider` (§7 del reporte de entidades). Ubicación: `ISecretProvider.StoreSecretAsync`, nunca una columna nueva en BD principal. |

### Nivel 2 — Flujo y Estados

| RN | Regla | Justificación |
|---|---|---|
| RN-CFD-010 | Una solicitud de descarga transiciona: `Creada → EnProceso → Lista` / `Fallida → Descargada` | Refleja el flujo real de `Fiscalapi.XmlDownloader` (Authenticate → CreateRequest → Verify → Download), ya instalado. Ubicación: `SatDownloadRequest.Status`. |
| RN-CFD-011 | Un CFDI recibido puede pasar de `Vigente` a `Cancelado` en descargas posteriores del mismo rango; el cambio inverso no ocurre automáticamente | D7 ("concilie lo que tiene" = detectar cambios de estado). Ubicación: `SatCfdiRecibido.EstadoSat` + lógica de reconciliación al insertar. |
| RN-CFD-012 | Un customer tiene como máximo una e.firma vigente a la vez; cargar una nueva reemplaza la anterior (no coexisten dos activas) | D3 (relación 1:1). Ubicación: `CustomerSatCredential` con `CustomerId` único. |

### Nivel 3 — Seguridad / Autorización

| RN | Regla | Justificación |
|---|---|---|
| RN-CFD-020 | Solo `SuperUsuario` puede cargar o reemplazar la e.firma de un customer | **Corregida en D15** (reemplaza D4/D14-R1 original): `SecretProviderService.EnsureSuperUsuario()` ya exige `SuperUsuario`/`Direccion` para escribir en Vault — no se amplía ese candado compartido. `Direccion` no se habilita porque no se pidió. Ubicación: autorización en el endpoint de carga de e.firma, alineada con el candado real del Vault. |
| RN-CFD-021 | `SuperUsuario`, `Administrador`, `Contador`, `GerenteOperaciones`, `GerenteAtencion`, `Asistente`, `GerenteMantenimiento` y `SupervisionOperativa` pueden disparar descargas y consultar CFDI; ningún otro rol del catálogo (42 roles totales) tiene acceso al módulo | D5, D5b, D6 — cerrado explícitamente ("solo los roles de la tabla"). Ubicación: autorización uniforme en todos los endpoints del módulo. |
| RN-CFD-022 | Toda carga o reemplazo de e.firma queda auditado con `CreatedBy`/`UpdatedBy`/`CreatedAt`/`UpdatedAt` | D14(R2), reutiliza `IAuditable` existente (`Infrastructure/Data/Interfaces/IAuditable.cs`) — no se construye mecanismo nuevo. Ubicación: `CustomerSatCredential : IAuditable`. |

### Nivel 4 — Validación de Datos

| RN | Regla | Justificación |
|---|---|---|
| RN-CFD-030 | `Customer.RFC` (dependencia, no se modifica): requerido, máximo 13 caracteres | Ya existe y se reutiliza tal cual (`Customer.cs:32-34`). Se documenta como restricción heredada, no como regla nueva. |
| RN-CFD-031 | Toda solicitud de descarga requiere `FechaInicio < FechaFin`, ambas obligatorias; el usuario las captura manualmente (sin backfill automático) | D13. Ubicación: validación en el DTO de solicitud. |
| RN-CFD-032 | El UUID de un CFDI debe tener exactamente 36 caracteres (estándar SAT) | Estándar CFDI + validación de integridad del parser propio del módulo. Ubicación: parser nuevo (no se reutiliza ni modifica `CfdiXmlParser` de Compras — regla de no-ruptura, §7 del reporte de entidades). |
| RN-CFD-033 | El padrón EFOS distingue 3 situaciones: `Presunto`, `Definitivo`, `Desvirtuado` (incluye sentencia favorable) | D11, verificado por investigación (fuente SAT, art. 69-B). Ubicación: `EfosRecord.Situacion` (enum), no un booleano simple. |

---

## 0.3 Riesgos + Pre-Mortem + Flujos Críticos

### Pre-Mortem

| # | Supuesto Fallido | Impacto | Probabilidad | Mitigación | Owner |
|---|---|---|---|---|---|
| PM1 | La e.firma se guarda en Vault sin ningún control adicional, igual que cualquier otro secreto del sistema | Alto — comprometer una e.firma compromete la capacidad fiscal del customer durante su vigencia (hasta 4 años) | Baja (Vault ya cifra AES-256-GCM) pero impacto alto | Nombres de secreto con prefijo dedicado por módulo; no reutilizar `KeyVersion` de otros secretos; revisar si aplica rotación más agresiva que el resto del sistema | Backend Lead / Seguridad |
| PM2 | El rango de fechas que pide el usuario excede el límite de 200,000 CFDI (o 1,000,000 en metadata) por solicitud del SAT, y la solicitud falla sin aviso claro | Medio-Alto — el usuario cree que descargó todo el periodo y faltan comprobantes | Media (con 6+ meses de histórico en el primer uso, por los 10-11 customers, es plausible) | Validar el rango antes de enviar; si excede, trocear automáticamente por sub-rangos o advertir explícitamente al usuario | Backend |
| PM3 | `CfdiXmlParser` (ya usado y testeado en Compras) se reutiliza o modifica "por conveniencia" para este módulo | Alto — rompe `OrdenCompraStatusAppService`/`OrdenCompraAppService` en producción, cubiertos hoy por 3 tests | Media si no se documenta explícitamente | Construir un parser propio del módulo nuevo; prohibición explícita de tocar el existente (ya registrada en el reporte de entidades, §7) | Backend |
| PM4 | El job de actualización del padrón EFOS nunca se agenda, o falla silenciosamente, y el cruce muestra "sin coincidencia" con datos desactualizados por meses | Alto — un proveedor en lista negra **definitiva** pasa desapercibido; riesgo fiscal real para el customer | Media | Job en `HangfireJobCatalog` con alerta si la última actualización exitosa supera un umbral (ej. 15 días) | Backend / Admin |
| PM5 | `CustomerSatCredential` (BD principal) y el secreto en Vault (BD separada, sin transacción compartida — acoplamiento ya documentado) quedan desincronizados: se crea la referencia pero falla `StoreSecretAsync`, o viceversa | Medio — referencia sin secreto real detrás, o secreto huérfano | Media (no hay transacción distribuida entre los 2 `DbContext`) | Orden de operaciones con compensación: guardar primero en Vault, crear la referencia después; si falla la referencia, revocar el secreto recién creado | Backend |

### Happy Path

```
1. Contador/Administrador/SuperUsuario carga la e.firma (.cer/.key/password)
   → Sistema valida que el RFC del certificado = Customer.RFC
   → Se cifra y guarda en Vault; se crea CustomerSatCredential (IAuditable: CreatedBy)
2. Un rol de D5 ingresa FechaInicio/FechaFin (hasta 6+ meses atrás) y dispara la descarga
   → Se crea SatDownloadRequest; se autentica con la e.firma; se solicita al SAT
3. El sistema verifica el estado hasta que el SAT marca la solicitud como lista
   → Se descargan los SatDownloadPackage; se parsean los CFDI (parser propio)
   → Cada CFDI se inserta en SatCfdiRecibido (dedupe por UUID); se cruza contra EfosRecord
4. El listado se muestra en tabla (proveedor, fecha, monto total, RFC, estado SAT/EFOS)
   → El usuario descarga el PDF de una fila o exporta la tabla completa a Excel
```

**Criterio de PASO:** `SatDownloadRequest.Status = Descargada`; N CFDI nuevos insertados, 0 duplicados; 0 errores de parseo sin registrar; exportación PDF y Excel completadas sin error.

### Sad Path

```
1. Un rol autorizado dispara la descarga con e.firma vencida o contraseña incorrecta
2. El SAT rechaza la autenticación
3. SatDownloadRequest se marca como Fallida, con el mensaje específico del SAT
   (no un genérico "error de conexión" como el actual InvoiceService simulado)
4. El usuario ve el motivo exacto; no se crean CFDI parciales ni registros huérfanos
```

**Criterio de PASO:** mensaje de error específico y accionable; `SatDownloadRequest.Status = Fallida` queda auditado; cero registros parciales en `SatCfdiRecibido`.

### Edge Path 1 — Re-descarga del mismo periodo

```
1. El mismo customer ya tenía una descarga previa del mismo rango de fechas
2. Se vuelve a disparar (el SAT siempre reenvía el rango completo, no hay forma de evitarlo)
3. Al insertar, el sistema detecta que el UUID ya existe:
   - Si el estado SAT cambió (Vigente → Cancelado), actualiza el registro existente
   - Si no cambió, lo ignora sin duplicar
```

**Criterio de PASO:** cero duplicados por `(CustomerId, UUID)`; los registros con cambio de estado quedan actualizados con `FechaCancelacion`; el listado no muestra filas repetidas.

### Edge Path 2 — Paquete con un CFDI ilegible

```
1. Un paquete descargado trae un XML corrupto o con un complemento no soportado
2. Fiscalapi.XmlDownloader v6 procesa por-documento: el CFDI ilegible no tumba el paquete completo
3. El CFDI con error se registra como fallido (con su mensaje), el resto del paquete se procesa normal
```

**Criterio de PASO:** el paquete no bloquea a los demás CFDI; el error queda visible para que el usuario sepa que un comprobante no se pudo leer y pueda reportarlo.

---

## Mapeo a Plan Formal (referencia, no se repite aquí)

Según `business-rules-discovery-phase-0.md`: 0.1 → Resumen Ejecutivo del Plan; 0.2 (Matriz RN) → Arquitectura & Diseño; 0.3 (Pre-Mortem) → Riesgos & Mitigaciones; 0.3 (Flujos) → Fases de Ejecución con criterios de PASO.

## Checklist de FASE 0 (autoevaluación)

- [x] Problem Statement en formato Actor → Problema → Acción → Consecuencia → Escala
- [x] KPIs: 4 (≥3 requeridos), cada uno con baseline/target/timeline/verificación
- [x] Reglas de Negocio: 13 (≥6 requeridas), distribuidas en los 4 niveles (4/3/3/3)
- [x] Cada RN numerada `RN-CFD-NNN`
- [x] Cada RN mapeada a ubicación de código real (dependencias existentes) o propuesta (módulo nuevo)
- [x] Pre-Mortem: 5 supuestos (≥3 requeridos), cada uno con mitigación y owner
- [x] 4 flujos documentados (Happy/Sad/2×Edge) con criterio de PASO explícito
- [x] Sin placeholders ni fechas inventadas (Timeline queda explícitamente "a definir por capacidad", no un sprint ficticio)

**Siguiente paso:** PASO 3 — Riesgos técnicos/seguridad adicionales (más allá del pre-mortem) + matriz de dependencias con otros módulos, antes del Plan de Implementación de 11 secciones.
