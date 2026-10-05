# Discovery — Descarga Masiva de CFDI del SAT

**Fecha de inicio:** 2026-10-04
**Estado:** Cerrado 2026-10-04 (D1–D14 resueltos; catálogo de campos aceptado "por el momento", puede ampliarse después). Insumo listo para FASE 0.
**Insumo previo:** [20261004-entity-recon-accounting-cfdi-download.md](./20261004-entity-recon-accounting-cfdi-download.md)

## Decisiones tomadas

| # | Pregunta | Respuesta (textual resumida) | Fecha |
|---|---|---|---|
| D1 | `sat-funding` (front sin backend) ¿se usa hoy? | No se usa hoy. | 2026-10-04 |
| D2 | ¿Quién usa el módulo y con qué alcance? | Lo usa cada customer. La administración descarga los CFDI del RFC del customer **en contexto**. Solo un customer a la vez; **nunca** varios customers en una misma descarga. | 2026-10-04 |
| D3 | ¿Un customer tiene uno o varios RFC? | Solo uno, y ya está guardado en la entidad `Customer` (verificado: `Customer.RFC`, requerido, 13 caracteres). | 2026-10-04 |
| D4 | ¿Quién carga la e.firma? | Roles `SuperUsuario`, `Administrador` o `Contador`. (Verificado contra `ApplicationRoleEnum`/matriz de roles de Inspections: los tres existen — `SuperUsuario` tipo System, `Administrador` y `Contador` tipo Staff.) | 2026-10-04 |
| D5 | ¿Quién dispara las descargas? | Adicional a los de D4: `Administrador`, `GerenteOperaciones`, `GerenteAtencion`, `Asistente`, `GerenteMantenimiento`, `SupervisionOperativa`. (Verificado: los 6 existen en `api/LuxuryApp.Application/Shared/Enums/ApplicationRoleEnum.cs`.) | 2026-10-04 |
| D5b | ¿`SuperUsuario` y `Contador` también disparan descargas? | Sí — **"cargan y disparan"**. Los 3 roles de D4 (`SuperUsuario`, `Administrador`, `Contador`) tienen ambos permisos. El set que dispara descargas queda en **8 roles** (D4 ∪ D5). | 2026-10-04 |
| D6 | ¿Quién puede consultar/ver los CFDI ya descargados? | "Todos" = **solo los 8 roles de la tabla de permisos** (`SuperUsuario`, `Administrador`, `Contador`, `GerenteOperaciones`, `GerenteAtencion`, `Asistente`, `GerenteMantenimiento`, `SupervisionOperativa`), **no** el catálogo completo de 42 roles. Confirmado explícitamente: los roles de Cliente/Contractor (`Comite`, `Condomino`, `Jardineria`, `Limpieza`, `Seguridad`, `Proveedor`) quedan **fuera**. | 2026-10-04 |

### Matriz de permisos derivada (a confirmar en FASE 0 / Nivel 3 Seguridad)

| Rol | Carga/reemplaza e.firma | Dispara descarga | Consulta/ve CFDI |
|---|---|---|---|
| SuperUsuario | ✓ | ✓ | ✓ |
| Administrador | ✓ | ✓ | ✓ |
| Contador | ✓ | ✓ | ✓ |
| GerenteOperaciones | — | ✓ | ✓ |
| GerenteAtencion | — | ✓ | ✓ |
| Asistente | — | ✓ | ✓ |
| GerenteMantenimiento | — | ✓ | ✓ |
| SupervisionOperativa | — | ✓ | ✓ |
| *(resto del catálogo: `Direccion`, `Legal`, `RecursosHumanos`, `Comite`, `Condomino`, `Proveedor`, etc. — 34 roles restantes)* | — | — | — (confirmado explícitamente fuera) |

**Cerrado:** los 3 permisos (carga e.firma / dispara descarga / consulta CFDI) usan exactamente el mismo set de **8 roles**. Carga e.firma es el subconjunto más restrictivo (3 de los 8); disparar descarga y consultar son idénticos (los 8). Ningún rol fuera de esta tabla tiene acceso al módulo.

### Implicaciones de D3

- Relación e.firma ↔ customer es 1:1; no hace falta tabla de "RFC del customer".
- El RFC del certificado `.cer` debe coincidir con `Customer.RFC` (validación al cargar la e.firma).

### Implicaciones de D2 (derivadas, pendientes de validar en FASE 0)

- El alcance de toda consulta, solicitud, paquete y CFDI es un único `CustomerId` (el del contexto activo). No hay vista ni operación multi-customer.
- La e.firma pertenece al customer; el personal de administración opera en su contexto, no con credenciales propias.

## D7 — Alcance funcional del módulo (respuesta textual del usuario, 2026-10-04)

> "Lo que ocupamos es que se descarguen, y tener una entidad donde se enlisten los datos de esas facturas incluyendo el XML, tener un mecanismo para convertir a PDF en la tabla del listado para descargar los datos en PDF, esa tabla debe tener los datos más importantes: proveedor, fecha, monto total, RFC [...]. Yo lo que quiero es que el asistente descargue las facturas y concilie lo que tiene, para poder más adelante, mediante otro proceso que no se toca acá, preparar sus cuentas por pagar."

**Interpretación registrada (3 capacidades para v1, confirmadas por el texto):**

1. **Descarga** — traer los CFDI desde el SAT (vía `Fiscalapi.XmlDownloader`, ya instalado).
2. **Repositorio con listado** — una entidad que guarda cada factura (incluye el XML) y se muestra en tabla con datos clave: proveedor, fecha, monto total, RFC (+ catálogo propuesto abajo).
3. **XML → PDF** — mecanismo de conversión, generado desde el listado (botón/acción por fila), para descarga individual.

**"Concilie lo que tiene" = scope de ESTE módulo, no AP completo:** al descargar, el módulo compara contra lo ya almacenado (por `UUID`) para no duplicar y para detectar cambios de estado (ej. una factura que estaba Vigente y ahora aparece Cancelada). **Explícitamente fuera de alcance:** cruzar estos CFDI contra órdenes de compra / proveedores para armar cuentas por pagar — eso es "otro proceso que no se toca acá", a planear después como módulo o fase separada que **consume** este repositorio.

### Catálogo de campos propuesto para la entidad CFDI (a validar)

Basado en: (a) lo pedido explícitamente, (b) el estándar CFDI 4.0 del SAT, (c) patrones de software profesional (Contpaqi, Aspel, ERPs de facturación) y (d) lo que `CfdiXmlParser.cs` ya extrae hoy en Compras (fuente: búsqueda web 2026-10-04, ver Fuentes).

| Grupo | Campos | Por qué |
|---|---|---|
| Identificación | UUID, Serie, Folio, Tipo de comprobante (I/E/P/N/T), Fecha de emisión, Fecha de timbrado, Lugar de expedición | Único por tenant (UUID); tipo "P" = recibo de pago (REP), relevante para AP futuro |
| Emisor | RFC emisor, Nombre/Razón social emisor | **Pedido explícito: "proveedor"** |
| Receptor | RFC receptor, Nombre receptor, Uso CFDI | Para distinguir emitido/recibido sin ambigüedad |
| Montos | Moneda, Tipo de cambio, SubTotal, Descuento, Total, IVA trasladado, Retenciones (ISR/IVA) | **Pedido explícito: "monto total"**; el resto evita re-descargar/re-parsear el XML después |
| Pago | Forma de pago (catálogo c_FormaPago), Método de pago (PUE/PPD) | PPD es la señal de que falta su REP — insumo directo para la futura conciliación de AP |
| Relaciones | CFDI relacionados (UUID + tipo de relación) | Liga una nota de crédito o un REP a su factura origen — sin esto, la futura AP no puede saber qué factura ya fue pagada |
| Estado SAT | Estado (Vigente/Cancelado/No encontrado), Fecha de cancelación | **"Concilie lo que tiene"**: detectar cambios de estado en descargas repetidas |
| Dirección | Emitido / Recibido (relativo al RFC del customer) | Un solo RFC (D3), pero puede traer ambos tipos |
| Trazabilidad | Referencia a la solicitud/paquete SAT que lo trajo | Auditoría: de qué descarga vino cada CFDI |
| Archivos | Ruta XML, Ruta PDF (generado por este módulo, no lo entrega el SAT) | Pedido explícito |
| Vínculo opcional | `ProviderId` (match por RFC contra `Providers`, nulable) | Puente de bajo costo hacia la futura AP, sin construirla ahora |

**Nota de arquitectura:** el "Monto total" que pediste es el campo `Total` del CFDI. Conviene guardar también `SubTotal`/`IVA`/`Retenciones` aunque no se muestren en la tabla principal — si no se capturan ahora, la futura conciliación de cuentas por pagar tendría que volver a abrir cada XML.

### Qué hacen las plataformas profesionales con esto (hallazgos de investigación)

- **Dos tipos de descarga del SAT:** *Metadata* (ligera: folio, RFC emisor/receptor, nombres, fecha — ideal para listar rápido miles de CFDI) y *CFDI* (XML completo). Muchas herramientas descargan metadata primero para poblar la tabla, y el XML completo solo cuando se necesita (o en background). Lo dejo como posible optimización futura, no bloqueante para v1 con el volumen que manejes.
- **Comprobante de pago (REP, tipo "P")** es la pieza central para cuentas por pagar: una factura con `MetodoPago = PPD` no está pagada hasta que llega su REP relacionado por UUID. Por eso el campo "CFDI relacionados" en la tabla de arriba — sin él, el proceso futuro de AP no tiene cómo saber qué ya se pagó.
- **Riesgo documentado:** no vincular los REP contra las facturas PPD correspondientes genera registros contables incorrectos en cuentas por pagar/cobrar (fuente: ContadorMx, FacturadorElectronico.com).

**Fuentes consultadas (2026-10-04):**
- [CFDI Descarga Masiva — campos y tipos de descarga](https://www.edifact.com.mx/masinfo/cfdi-descarga-masiva)
- [phpcfdi/sat-ws-descarga-masiva](https://packagist.org/packages/phpcfdi/sat-ws-descarga-masiva)
- [Control CFDI / Complemento de pago SAT](https://contadormx.com/control-cfdi-complemento-de-pago-sat/)
- [10 puntos para conocer el complemento para pagos del SAT](https://contadormx.com/10-puntos-para-conocer-el-complemento-para-pagos-del-sat/)
- [Complemento de pagos, todo lo que debes saber](https://facturadorelectronico.com/blog/?p=5206)

## D8 — ¿Retomar `sat-funding` como base de este módulo? (investigado a fondo, 2026-10-04)

**Pregunta del usuario:** "¿No teníamos un módulo a medias inconcluso para esto? El objetivo sería retomarlo y darle la forma que le estamos dando, ¿correcto, sí o no, y por qué?"

**Respuesta: NO.** Verificado leyendo las 4 pantallas de `sat-funding` + la entidad `Funding` real. Son dos cosas distintas:

| | `Funding` (real, existe en backend) | `sat-funding` (front huérfano, sin backend) |
|---|---|---|
| Qué es | Entidad ya construida: `AccountingLuxuryApp/Fundings/Funding.cs`. Flujo de autorización de desembolso: Creado → Verificado → Autorizado (`AuthorizedById`) → Confirmado por contador (`ConfirmedById`) para **pagar órdenes de compra** en un período (`FundingPeriod`, `FundingYear`). | Pantalla que, **dentro de un Funding ya creado**, iba a traer los CFDI emitidos en el rango de fechas de ese fondeo, clasificarlos por `TipoGasto` (catálogo que **ya existe** y se usa hoy en folios de Compras) y conciliarlos contra una cuenta bancaria (`bankId`, CLABE, convenio, referencia) de la cual se paga. |
| Alcance | Todo el ciclo de aprobación de un desembolso. | Una sub-pantalla: "¿qué facturas respaldan este desembolso específico y con qué cuenta se paga?" |
| Relación con lo que pediste (D7) | — | Asume que **ya existe un Funding** y busca CFDI dentro de su ventana de fechas. **No es** un repositorio general de todos los CFDI del RFC del customer — es scoped a un fondeo puntual. |

**Por qué no retomarlo:**

1. **No hay nada "a medias" en el backend.** Cero entidad, cero servicio, cero endpoint, cero migración. Solo existen 4 componentes Angular que llaman a endpoints que no existen (`sat-funding/request-download`, etc.) y un job comentado (`Program.cs:376`). No se "retoma" código a medio construir porque del lado servidor no se construyó nada.
2. **Es un problema distinto al que describiste.** Tú pediste (D7) un repositorio **general** de CFDI del RFC del customer, con listado y PDF — sin atarlo a ningún "Funding". `sat-funding` da por hecho que el Funding ya existe y solo busca CFDI en su rango de fechas para justificar ese pago puntual. Construirlo así forzaría a crear primero un `Funding` para poder descargar cualquier CFDI, lo cual no es lo que pediste.
3. **Mezcla una clasificación que no mencionaste.** `TipoGasto` (Fijo/Variable/Caja Chica/Extraordinario/etc.) y conciliación bancaria (CLABE/banco/convenio) son conceptos de **cómo se paga un fondeo**, no de "listar y descargar facturas". Eso encaja más con la futura fase de cuentas por pagar que dijiste que **no se toca acá**.

**D9 — Confirmado por el usuario (2026-10-04):** "Sí, vamos por el mismo camino, no mezclemos con `Funding`; ese módulo está activo en producción y no conviene tocarlo. Me refería al mecanismo de descargar CFDI [no a retomar la pantalla `sat-funding` ligada a Funding]." Cierra D8: módulo **independiente**, sin ninguna referencia a `Funding`/`FundingPeriod`/`TipoGasto` en esta construcción. **`Funding` queda fuera de alcance y no se toca.**

**Recomendación aplicada:** construir el repositorio genérico de CFDI (lo que ya veníamos diseñando en D7) como módulo independiente. Más adelante, si se retoma `Funding`, esa pantalla puede **consumir** el repositorio genérico (filtrar sus CFDI por fecha + `TipoGasto` + cuenta bancaria) en lugar de tener su propio mecanismo de descarga SAT aislado — evita construir dos veces la integración con el SAT.

## D10 — Dirección de los CFDI (2026-10-04)

**Pregunta:** ¿emitidos, recibidos o ambos en v1?
**Respuesta:** "No, nosotros no emitimos facturas." → **Solo Recibidos.**

**Implicación de diseño:** se simplifica el modelo — no hace falta un campo "Emitido/Recibido" variable por registro; toda consulta al SAT usa `RequestType = Recibidos` y el RFC del customer siempre va como **receptor**. Se elimina de la tabla de campos (§ arriba) la columna "Dirección" como dato variable; queda implícita y fija.

(Nota aparte, fuera de este módulo: `CollectionsLuxuryApp/.../Invoice` + `InvoiceService` sí modelan al condominio **emitiendo** CFDI de cobranza a sus residentes vía PAC directo — eso es un mecanismo distinto, no descarga masiva del SAT, y no se toca ni se relaciona con este módulo.)

## D11 — EFOS en v1 (2026-10-04)

**Confirmado: sí, se necesita.** Hallazgo de investigación relevante para el diseño:

- El listado EFOS (art. 69-B) **no viene del mismo mecanismo de descarga de CFDI** (`Fiscalapi.XmlDownloader` no lo incluye). El SAT lo publica aparte, en su portal de datos abiertos, en CSV/XLS, con 3 estados: **Presuntos**, **Definitivos**, **Desvirtuados** (más sentencia favorable). Esto implica una **segunda fuente de datos** e importación periódica (candidato a job de Hangfire), independiente del flujo solicitud→paquete.
- Diferencia legal relevante para la UI: un RFC en **Presuntos** aún puede defenderse (no es definitivo); uno en **Definitivos** hace que, con efectos generales, sus comprobantes se consideren sin efecto fiscal — y activa un plazo de 30 días. Conviene que el cruce muestre el estado exacto, no solo "está/no está en la lista".
- Frecuencia de actualización: no se encontró el número oficial exacto de publicaciones al año; herramientas de terceros revisan el portal semanalmente como aproximación práctica. **Pendiente de definir la frecuencia del job** en el plan técnico (semanal es razonable como punto de partida).

**Fuentes consultadas (2026-10-04):**
- [Lista de EFOS del SAT 2026 — artículo 69-B](https://siemprealdia.co/mexico/fiscal/lista-de-efos-del-sat-articulo-69-b/)
- [Plazo de 30 días EFOS del SAT](https://siemprealdia.co/mexico/fiscal/plazo-de-30-dias-efos-del-sat/)
- [Tu proveedor cayó en lista negra EFOS: qué hacer](https://www.satfacil.com.mx/blog/proveedor-lista-negra-efos-que-hacer)

## D12 — Exportar a Excel (2026-10-04)

**Confirmado: sí se necesita.** Se cubre con `ClosedXML` (ya instalado y usado en `ReportExcelExportService` de Reportes Dinámicos — reutilizable como patrón, no como clase). v1 queda con 3 salidas desde la tabla: **XML** (ya se tiene al descargar), **PDF** (por fila, a construir) y **Excel** (del listado completo o filtrado, a construir).

## D13 — Rango de descarga (2026-10-04)

**Confirmado:** no hay backfill automático. El usuario (uno de los 8 roles) **ingresa manualmente fecha inicial y fecha final** cada vez que solicita una descarga. Como mínimo debe poder cubrir **6 meses hacia atrás** desde hoy (recomendación del negocio, no límite técnico — el SAT permite más). No hay disparo automático al activar el módulo; toda descarga es una acción explícita con rango elegido por el usuario.

**Implicación de diseño:** la UI de "nueva solicitud" pide `FechaInicio`/`FechaFin` (como ya anticipaba el prototipo huérfano `SatDownloadRequestDto`, aunque ese formulario pertenecía a `Funding` y no se reutiliza — D9). Falta decidir el límite máximo de rango por solicitud (el SAT tope es 200,000 CFDI o 1,000,000 metadata; un rango de varios años podría excederlo y requerir que el usuario lo trocee, o que el sistema lo trocee automáticamente — pendiente).

## D14 — Reemplazo de e.firma y auditoría (2026-10-04)

**R1 — Quién reemplaza:** los mismos 3 roles de D4 (`SuperUsuario`, `Administrador`, `Contador`). No hay rol adicional ni más restrictivo para el reemplazo.

**R2 — Auditoría:** usar `IAuditable` (verificado: `api/LuxuryApp.Application/Infrastructure/Data/Interfaces/IAuditable.cs` — `CreatedAt`, `CreatedBy`, `UpdatedAt`, `UpdatedBy`) en la entidad que referencia la e.firma. No se construye un mecanismo de auditoría nuevo.

**Advertencia de diseño (a validar en el plan, no bloquea el discovery):** `IAuditable` solo guarda el **último** cambio (un `UpdatedBy`/`UpdatedAt`, se sobrescribe). Si en el futuro se reemplaza una e.firma 3 veces, `IAuditable` por sí solo responde "quién la cargó por última vez", no "el historial completo de los 3 reemplazos". Para lo que se pidió ("de una vez registra en auditoría quién cambió") `IAuditable` alcanza. Si más adelante se requiere historial completo, sería una tabla de bitácora aparte (patrón ya usado en otros módulos, ej. `TaskChangeLog`) — no se construye ahora salvo que se pida explícitamente.

## D15 — Corrección de D4/D14: carga de e.firma restringida a `SuperUsuario` (2026-10-04, durante Fase 2 de implementación)

**Hallazgo al leer el código real de `SecretProviderService.cs` (único punto de escritura del Vault):** las 4 operaciones de escritura (`StoreSecretAsync`, `UpdateSecretValueAsync`, `RotateSecretAsync`, `RevokeSecretAsync`) llaman `EnsureSuperUsuario()`, que exige rol `SuperUsuario` **o** `Direccion` en el JWT del usuario autenticado — no hay forma de ampliarlo a `Administrador`/`Contador` sin modificar ese archivo, que es código compartido de seguridad usado por login (`JwtService`), Twilio, Brevo, ElevenLabs y Aspel.

Esto contradecía D4/D14 (que autorizaban a `Administrador` y `Contador` a cargar/reemplazar la e.firma): con el candado real del Vault, esos dos roles habrían recibido `UnauthorizedAccessException` en producción.

**Decisión del usuario (SuperUsuario del sistema):** "Dejemos solo al SuperUsuario que haga esto." Se descartaron las otras 2 opciones (ampliar el candado del Vault a más roles; usar una identidad de servicio) — **no se toca `SecretProviderService.cs`**.

**D4/D14 quedan reemplazadas por:**
- **Carga/reemplazo de e.firma:** únicamente `SuperUsuario`. `Administrador` y `Contador` ya **no** tienen este permiso (sí conservan disparar descargas y consultar, D5/D5b/D6, que solo requieren `GetSecretAsync`, sin restricción de rol en el Vault).
- RN-CFD-003 (validación RFC) y RN-CFD-020 (roles) de FASE 0 se actualizan en consecuencia — ver documento de FASE 0.

### Matriz de permisos final (reemplaza la de D4–D6)

| Rol | Carga/reemplaza e.firma | Dispara descarga | Consulta/ve CFDI |
|---|---|---|---|
| SuperUsuario | ✓ | ✓ | ✓ |
| Administrador | — | ✓ | ✓ |
| Contador | — | ✓ | ✓ |
| GerenteOperaciones | — | ✓ | ✓ |
| GerenteAtencion | — | ✓ | ✓ |
| Asistente | — | ✓ | ✓ |
| GerenteMantenimiento | — | ✓ | ✓ |
| SupervisionOperativa | — | ✓ | ✓ |
| *(resto del catálogo — 34 roles restantes)* | — | — | — |

## D16 — Corrección de D11: importación EFOS manual, no automática (2026-10-04, durante Fase 4)

**Hallazgo al intentar construir el job de importación:** no existe una URL oficial del SAT estable y vigente para el padrón EFOS. La única URL verificable encontrada (`omawww.sat.gob.mx/.../Listado_Completo_69_articulo69.csv`) está desactualizada desde agosto de 2018 y, al descargarla, trae las columnas del trámite equivocado (deudores del artículo 69, no EFOS del artículo 69-B). Ninguna fuente (incluyendo herramientas comerciales de terceros que existen específicamente por esta dificultad) ofrece una URL directa confiable — todas indican navegación manual dentro del sitio del SAT.

**Decisión del usuario:** "De acuerdo con tu recomendación" — se acepta reemplazar el job automático por **importación manual con validación**: un rol autorizado descarga el archivo él mismo desde el SAT (como ya hacen hoy con herramientas externas, D1) y lo sube al sistema. El cruce automático contra los CFDI descargados (D11 original) se mantiene sin cambio — solo cambia cómo entra el padrón al sistema, no qué se hace con él.

**Implicación de diseño:** `EfosRecord` se corrige a único por RFC (representa la situación *vigente* de ese RFC, no un histórico) — si una importación posterior trae el mismo RFC en otra situación, se actualiza la fila existente.

## D17 — Ampliación de D15: `Direccion` también carga e.firma / importa EFOS (2026-10-04, durante F6)

**Hallazgo al construir el frontend:** `AspRoleService` (frontend) trata `SuperUsuario` y `Direccion` como par equivalente en todo el sistema — si un usuario tiene cualquiera de los dos, el otro se agrega automáticamente a su set "efectivo" de roles para toda verificación de UI. Además, `SecretProviderService.EnsureSuperUsuario()` (Vault, backend) **ya** acepta `SuperUsuario` **o** `Direccion` — nunca fue solo `SuperUsuario` (D15 lo documentó así, pero mis endpoints lo restringían de más).

**Problema que esto causaba:** con los endpoints en solo `SuperUsuario` (D15 original), un usuario `Direccion` habría visto el botón de "cargar e.firma"/"importar EFOS" en la UI (por la convención de pares del frontend) y recibido 403 al usarlo — inconsistente, y más restrictivo de lo que el propio Vault permite.

**Corrección:** los endpoints de carga de e.firma e importación EFOS ahora aceptan `SuperUsuario,Direccion` — alineado con el Vault real, no con una restricción adicional que nadie pidió. El resto de D15 no cambia: `Administrador`/`Contador` siguen sin poder cargar la e.firma.

## Preguntas abiertas

- ¿El catálogo de campos de arriba cubre lo que necesitas, agregarías/quitarías algo?
- "Todos pueden consultar" (D6) ya cerrado — confirmado solo los 8 roles de la tabla.
- ¿Algún rol puede **revocar** (sin reemplazar) una e.firma ya cargada? Por D15, solo `SuperUsuario` podría, vía `RevokeSecretAsync` — ¿se expone esa acción en v1 o solo "cargar/reemplazar"?
- EFOS: ¿entra en v1 o se pospone? (No se mencionó en la respuesta de alcance — asumo pospuesto salvo que digas lo contrario.)
- Excel: ¿se pide exportar la tabla a Excel en v1, o solo XML/PDF como se describió?
- Volumen esperado y periodo histórico a descargar (el SAT permite hasta 200,000 CFDI o 1,000,000 de metadata por solicitud; si el histórico es grande, puede requerir varias solicitudes encadenadas).
