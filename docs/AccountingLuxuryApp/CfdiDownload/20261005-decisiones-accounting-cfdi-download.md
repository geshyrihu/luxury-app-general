# Decisiones (Matriz) — Descarga Masiva de CFDI del SAT

**Doc #5 de §4.7.** Ubicación real exigida: `appsweb/angular/.../cfdi-download/docs/decisiones.md`; por instrucción del Tech Lead, vive aquí.

**Para:** developer que ya hizo el setup y va a agregar una feature.

## Matriz "¿Dónde pongo la feature X?"

```
¿Es sobre la e.firma (cargar, vigencia, validación)?
  → credential-form/ (frontend) + CustomerSatCredentialAppService (backend)

¿Es sobre solicitar/verificar una descarga al SAT?
  → cfdi-download-hub/ (sección "Nueva solicitud") + SatDownloadAppService

¿Es sobre leer/mostrar/exportar CFDI ya descargados?
  → cfdi-list/ (frontend) + SatCfdiQueryAppService / SatCfdiPdfExportService / SatCfdiExcelExportService

¿Es sobre el padrón EFOS?
  → EfosImportAppService (backend) — no hay UI propia todavía, solo el endpoint de import

¿Es sobre parsear un XML de CFDI?
  → SatCfdiParser — NUNCA CfdiXmlParser de Compras (módulo distinto, prohibido tocarlo)

¿Es sobre cuentas por pagar / conciliar con órdenes de compra?
  → NO va aquí. Es explícitamente otro módulo futuro (D7). Si te piden esto,
    es una señal de que el alcance se está mezclando — consulta con el Tech Lead.
```

## Ejemplos concretos

1. **"Quiero mostrar el RFC del receptor en la tabla"** → el campo ya existe (`RfcReceptor`) en entidad/DTO/interface — solo falta agregarlo a `cfdi-list-desktop.html`.
2. **"Quiero que el usuario pueda cancelar una solicitud en EnProceso"** → no existe hoy. Requeriría: nuevo endpoint, nuevo método en `ISatDownloadAppService`, y entender que el SAT puede no soportar cancelar una solicitud ya enviada — **consultar con el Tech Lead antes de construir**.
3. **"Quiero filtrar el listado por RFC del emisor"** → agregar parámetro a `ISatCfdiQueryAppService.ListAsync` + el endpoint + el `EndpointsContabilidad.CfdiDownload.list(...)` del frontend. Patrón idéntico al filtro de fecha que ya existe.
4. **"Quiero que la carga de e.firma la haga también `Contador`"** → **NO**, sin aprobación explícita: el Vault mismo (`SecretProviderService.EnsureSuperUsuario`) solo acepta `SuperUsuario`/`Direccion` — ampliarlo requeriría tocar código compartido de seguridad usado por login y otros 5 módulos.
5. **"Quiero agregar un job que descargue automáticamente cada noche"** → fuera del alcance actual (D13: siempre manual, rango capturado por el usuario). Es una mejora de v2, no un cambio menor.

## Reglas irrompibles

| Regla | Por qué |
|---|---|
| Nunca modificar/mover `CfdiXmlParser` (Compras) | 2 servicios productivos + 3 tests dependen de él |
| Nunca tocar `Invoice`/`OrdenCompraFactura`/`Funding` desde este módulo | Fuera de alcance confirmado (D9); módulo 100% independiente |
| Toda query nueva debe filtrar `CustomerId` explícitamente | `ITenantEntity` no filtra solo — ver R7 |
| `.key`/contraseña de la e.firma nunca en una columna de BD | Solo nombres de secreto, el valor va al Vault |
| El SAT solo permite `InvoiceStatus=Vigente` en CFDI-tipo Recibidos | No es una limitación del código, es una regla del propio SAT |

## Checklist antes de crear un archivo nuevo

- [ ] ¿Ya existe un servicio que resuelva esto? (ver matriz arriba)
- [ ] ¿La entidad que necesito ya tiene el campo? (revisar antes de migrar)
- [ ] ¿Mi query nueva filtra por `CustomerId`?
- [ ] ¿Estoy importando `EndpointsContabilidad` directo (no el `Endpoints` deprecado)?
- [ ] ¿Mi ruta nueva va en `routing/accounting.routing.ts` (el árbol real), no en el huérfano?

## Comandos rápidos

```bash
# Buscar todas las queries del módulo (para auditar filtro de tenant)
grep -rn "dbContext\.\(CustomerSatCredentials\|SatDownloadRequests\|SatCfdiRecibidos\)" api/LuxuryApp.Application/Modules/AccountingLuxuryApp/CfdiDownload/Services/

# Correr solo los tests del módulo
dotnet test LuxuryApp.Tests/LuxuryApp.Tests.csproj --filter "FullyQualifiedName~CfdiDownload"

# Ver las migraciones del módulo
ls api/LuxuryApp.Application/Infrastructure/Data/Migrations/ | grep -i "CfdiDownload\|SatCfdi\|Efos"
```

## Ejemplo de flujo completo (paso a paso real)

Agregar el filtro por RFC emisor al listado (ejemplo 3 de arriba):

1. `ISatCfdiQueryAppService.ListAsync(Guid customerId, DateTime?, DateTime?, string? rfcEmisor = null)`
2. `SatCfdiQueryAppService.ListAsync`: agregar `if (!string.IsNullOrWhiteSpace(rfcEmisor)) query = query.Where(c => c.RfcEmisor == rfcEmisor);`
3. `SatCfdiEndpoints.cs`: agregar el parámetro `string? rfcEmisor` al `MapGet`
4. `contabilidad.endpoints.ts`: agregar el parámetro opcional a `CfdiDownload.list(...)`
5. `cfdi-download-hub.ts`: agregar un `FormControl` al `filterForm` y pasarlo en `loadCfdis()`
6. `cfdi-download-hub.html`: agregar el `<input>` correspondiente
7. `dotnet build` + `ng build` para confirmar que compila
8. (Opcional pero recomendado) agregar un caso al test de `SatCfdiQueryAppService` si existe, o crear uno

## ¿Cuándo preguntar al Tech Lead?

- Cualquier cambio a los roles autorizados (D4/D5/D6/D15/D17 ya son decisiones explícitas).
- Cualquier cosa que toque `Funding`/`sat-funding`/`Invoice`/`OrdenCompraFactura` desde este módulo.
- Automatizar la importación EFOS (requiere encontrar y validar una URL oficial estable, no existe hoy — D16).
- Política de retención de CFDI (R5, pendiente, sin decisión tomada).
- Cualquier cosa relacionada con "cuentas por pagar" — explícitamente fuera de alcance (D7).
