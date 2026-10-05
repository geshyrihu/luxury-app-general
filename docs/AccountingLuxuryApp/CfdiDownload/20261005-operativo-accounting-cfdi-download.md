# Operativo (Frontend) — Descarga Masiva de CFDI del SAT

**Doc #3 de §4.7.** Ubicación real exigida: `appsweb/angular/src/app/modules/accounting.luxuryapp/cfdi-download/docs/operativo.md`; por instrucción del Tech Lead, vive aquí.

## Propósito del módulo

Página única (`CfdiDownloadHub`) donde un usuario autorizado: ve el estado de la e.firma del customer, dispara/verifica solicitudes de descarga al SAT, y consulta/exporta el repositorio de CFDI recibidos.

## Rutas y URLs

| Ruta | URL local (dev) | Guard |
|---|---|---|
| Hub principal | `http://localhost:4200/accounting/cfdi-download` | `authGuard`, `hasRolesGuard` (8 roles) |

Montada vía `routing/accounting.routing.ts` → `modules/accounting.luxuryapp/cfdi-download/cfdi-download.routes.ts`. **No** usar `modules/accounting.luxuryapp/accounting.routes.ts` — ese archivo existe pero no lo importa nadie (huérfano, verificado durante la construcción).

## Estructura de carpetas

```
cfdi-download/
├── cfdi-download.routes.ts
├── cfdi-download-hub/
│   ├── cfdi-download-hub.ts
│   └── cfdi-download-hub.html
├── credential-form/
│   ├── credential-form.ts
│   └── credential-form.html
├── cfdi-list/
│   ├── cfdi-list.ts / .html          (wrapper desktop/mobile)
│   ├── desktop/cfdi-list-desktop.ts / .html
│   └── mobile/cfdi-list-mobile.ts / .html
└── interfaces/
    └── cfdi-download.interfaces.ts
```

## Componentes principales

| Componente | Responsabilidad |
|---|---|
| `CfdiDownloadHub` | Orquesta las 3 secciones de la página; único punto de estado (signals) |
| `CredentialForm` | Modal: 2 `<input type="file">` (.cer/.key) + contraseña, `FormData` → `onPostFile` |
| `CfdiList` | Decide desktop vs mobile según `PlatformService.isMobile()` |
| `CfdiListDesktop` | `lux-table` con columnas, badges de estado SAT/EFOS, botón Excel |
| `CfdiListMobile` | `app-data-view-mobile` con tarjetas |

## Servicios usados (no propios del módulo, reutilizados)

| Servicio | Métodos usados |
|---|---|
| `ApiResponseService` | `onGetItem`, `onGetList`, `onPost`, `onPostFile`, `onPreviewPdf`, `exportToExcel` |
| `CustomerIdService` | `customerId()` (signal) — todo el módulo reacciona a cambios de customer en contexto |
| `AspRoleService` | `hasAny([SuperUsuario, Direccion])` — gating del botón de e.firma |
| `DialogHandlerService` | `openDialog<CustomerSatCredentialDto>(CredentialForm, ...)` |

## Data flow

```
customerIdS.customerId() (signal)
   │ effect()
   ▼
loadCredential() ──► credential signal ──► tarjeta de estado
loadCfdis()      ──► cfdis signal     ──► <app-cfdi-list>

onRequestDownload() ──► POST requests/{customerId} ──► lastRequest signal
onCheckStatus()     ──► GET .../status (repetible, manual, sin polling automático)
                        └─ si Descargada → loadCfdis() de nuevo
```

**Nota de diseño:** la verificación de estado es manual (botón "Verificar estado"), no hay `setInterval`/polling automático — decisión deliberada para no generar tráfico de fondo sin que el usuario lo pida.

## Formularios

`CredentialForm`: `FormGroup` con un solo `FormControl` (`password`, requerido); los 2 archivos se guardan en `signal<File | null>` separados, no en el FormGroup (los `<input type="file">` no se bindean bien con Reactive Forms). `canSubmit` exige ambos archivos + password válido + no estar ya enviando.

## Estados/enums importantes

| Campo | Valores posibles (string, vienen del backend ya traducidos con `GetDisplayName()`) |
|---|---|
| `estadoSolicitud` | Creada, Autenticando, EnProceso, Lista, Fallida, Descargada |
| `estadoSat` | Vigente, Cancelado, No encontrado |
| `efosEstado` | Presunto, Definitivo, Desvirtuado, Sentencia favorable, `null` (sin coincidencia) |

## Smoke test (happy path completo)

1. Entrar a `/accounting/cfdi-download` con un usuario de alguno de los 8 roles.
2. Si no hay e.firma: botón "Cargar e.firma" visible solo para `SuperUsuario`/`Direccion` → subir `.cer`/`.key`/contraseña → confirmar que la tarjeta pasa a "Vigente".
3. Capturar fecha inicial/final → "Solicitar descarga" → confirmar que aparece el tag de estado (`EnProceso`).
4. Click "Verificar estado" repetidamente hasta `Descargada` → confirmar que aparecen contadores (nuevos/ya existían/con error).
5. Confirmar que la tabla de abajo se refrescó con los nuevos CFDI.
6. Click en el ícono de PDF de una fila → se abre una pestaña nueva con el PDF.
7. Click "Exportar a Excel" → se descarga un `.xlsx`.

**No ejecutado en esta sesión** — requiere una e.firma real o de sandbox del SAT, que no estaba disponible. Ver limitación en la Guía de Usuario.

## Debugging tips

- **"Este customer no tiene e.firma cargada" en rojo al entrar:** no es un bug — es el estado esperado la primera vez; el toast de error es un efecto secundario de que `ApiResponseService.onGetItem` siempre muestra error en una respuesta `success:false` (incluyendo 404 "esperado"). No se modificó el servicio compartido para evitarlo.
- **Botón de e.firma no aparece:** revisar que el usuario tenga `SuperUsuario` o `Direccion` — `AspRoleService` los trata como par, así que si uno falla revisar el claim de rol real en el JWT.
- **"Verificar estado" no avanza nunca:** el SAT puede tardar minutos u horas en procesar una solicitud real — no es un bug del frontend, es el comportamiento documentado del SAT.
