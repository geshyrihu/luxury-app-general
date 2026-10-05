# Setup / Onboarding (Frontend) — Descarga Masiva de CFDI del SAT

**Doc #4 de §4.7.** Ubicación real exigida: `appsweb/angular/.../cfdi-download/docs/setup.md`; por instrucción del Tech Lead, vive aquí.

**Para:** developer nuevo en este módulo. **Tiempo:** 30 minutos.

## Pre-requisitos

- Backend corriendo (`dotnet run` en `LuxuryApp.Api`) con migraciones aplicadas (`AddCfdiDownloadModule`, `AddSatCfdiDuplicadosCounter`, `AddEfosRecordUniqueRfc`).
- Un usuario de prueba con alguno de los 8 roles del módulo.
- Para probar el flujo real de descarga: una e.firma de sandbox/pruebas del SAT (no incluida, no se consiguió durante la construcción).

## Leer en orden

1. Este documento (setup)
2. [README](./20261005-readme-accounting-cfdi-download.md)
3. [Decisiones](./20261005-decisiones-accounting-cfdi-download.md)
4. [Arquitectura](./20261005-architecture-accounting-cfdi-download.md) (si vas a tocar el backend)

## Estructura a memorizar

```
Backend:  api/LuxuryApp.Application/Modules/AccountingLuxuryApp/CfdiDownload/
Frontend: appsweb/angular/.../modules/accounting.luxuryapp/cfdi-download/
Entidades: api/LuxuryApp.Application/Infrastructure/Data/Entities/AccountingLuxuryApp/CfdiDownload/
Tests:    api/LuxuryApp.Tests/Application/Modules/AccountingLuxuryApp/CfdiDownload/
```

## Mi primer cambio (walkthrough de 5 pasos)

Ejemplo: agregar una columna nueva al listado de CFDI (ej. "Lugar de expedición").

1. **Backend DTO:** agrega la propiedad a `SatCfdiRecibidoDTO.cs` y a `SatCfdiQueryAppService.ToDTO(...)` (el campo ya existe en la entidad `SatCfdiRecibido.LugarExpedicion`, solo falta exponerlo).
2. **Frontend interface:** agrega el campo a `SatCfdiRecibidoDto` en `interfaces/cfdi-download.interfaces.ts`.
3. **Tabla desktop:** agrega la columna en `cfdi-list-desktop.html` (nueva `<col>`, `<th>`, `<td>`).
4. **Tabla mobile:** decide si cabe en la tarjeta de `cfdi-list-mobile.html` (espacio limitado — normalmente no todo lo de desktop va en mobile).
5. **Test:** actualiza `SatCfdiExportServicesTests` si el campo también debe aparecer en el PDF/Excel.

## Backend reference paths

| Qué necesitas | Archivo |
|---|---|
| Agregar un campo a un CFDI | `Entities/.../SatCfdiRecibido.cs` + migración |
| Cambiar lógica de descarga | `Services/SatDownloadAppService.cs` |
| Cambiar el parseo de XML | `Services/SatCfdiParser.cs` (**nunca** `Modules/PurchasesLuxuryApp/.../CfdiXmlParser.cs` — es de otro módulo) |
| Agregar un endpoint | `EndPoints/*.cs` + registrar en `LuxuryApp.Api/ServiceExtensions/DependencyInjection.Controllers.cs` |

## Debugging flowchart

```
¿El request da 401?
  → Falta token / expiró → revisar login

¿El request da 403?
  → Rol no está en la lista de 8 (o no es SuperUsuario/Direccion para e.firma/EFOS)
  → Revisar ModuleRoles en el *Endpoints.cs correspondiente

¿El request da 404 en "credential"?
  → Normal si el customer no ha cargado e.firma todavía — no es un bug

¿El request da 500?
  → Revisar logs del backend (Serilog) — casi siempre es:
      a) e.firma vencida/incorrecta (LoadCredentialAsync)
      b) Vault no resuelve el secreto (nombre de secreto desincronizado)
      c) SAT no responde (verificar conectividad real al WebService)

¿La tabla no se actualiza tras "Verificar estado"?
  → Confirmar que estadoSolicitud llegó a "Descargada" (si sigue "EnProceso", el SAT no ha terminado)
```

## 4 errores comunes

1. **Importar `CfdiXmlParser` de Compras "porque ya existe uno parecido".** Prohibido — regla de no-ruptura. Usa `SatCfdiParser`.
2. **Agregar una query sin `.Where(c => c.CustomerId == customerId)`.** Este repositorio no filtra tenant automáticamente (`ITenantEntity` es solo un marcador). Ver `CfdiDownloadMultiTenantIsolationTests` para el patrón de prueba esperado.
3. **Usar `Endpoints` (el agregador deprecado) en componentes nuevos.** Importa `EndpointsContabilidad` directo de `@core/constants/endpoints/contabilidad.endpoints.ts`.
4. **Editar `modules/accounting.luxuryapp/accounting.routes.ts` pensando que es el árbol de rutas activo.** No lo es — es huérfano. El árbol real es `routing/accounting.routing.ts`.

## Git workflow

Sin particularidades propias del módulo — sigue el flujo estándar del repo (rama, PR, revisión). No hay gate de CI específico de este módulo más allá de la build y los tests ya verificados.
