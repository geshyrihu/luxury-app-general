# Modulo: FinancialAccounting (Contabilidad Financiera)

> **Area funcional:** Contabilidad / Estados Financieros y Seguimiento
> **Tag de version:** `v1.0`
> **Owner tecnico:** `@equipo-contabilidad`
> **Ultima actualizacion:** `2026-06-25`

---

## Vision General

Modulo central de contabilidad financiera. Cubre (1) la gestion del ciclo de vida de Estados Financieros mensuales (carga de PDF, autorizacion, envio masivo a condominos), (2) seguimiento de acuerdos de minutas de comite (contables y legales), y (3) listado de fondeos contables.

---

## Submodulos

### FinancialReport
Gestiona el ciclo de vida completo de los estados financieros mensuales en PDF.

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| `GET` | `api/FinancialReport/{id}` | Obtener reporte por ID |
| `GET` | `api/FinancialReport/ToCustomer/{customerId}` | Reportes por cliente |
| `POST` | `.../UploadFile/{id}/{userId}` | Subir PDF de estado financiero |
| `POST` | `.../CreatePeriod` | Inicializar periodo automaticamente |
| `GET` | `.../Authorize/{id}/{userId}` | Autorizar reporte |
| `GET` | `.../Deseuthorize/{id}` | Desautorizar reporte |
| `POST` | `.../Send/{id}/{userId}` | Enviar por correo a condominos |
| `GET` | `.../reporteenviomensual/{periodo}` | Reporte de envio mensual |
| `GET` | `.../reporte-envio-anual/{year}` | Reporte de envio anual |
| `GET` | `.../propietarios/{customerId}` | Lista de propietarios |
| `GET` | `.../List/{customerId}` | Listar reportes por cliente |

### ContabilidadMinuta
Seguimiento de acuerdos de minutas de comite contables y legales.

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| `GET` | `api/ContabilidadMinuta/ListaSeguimientos/{id}` | Seguimientos de una minuta |
| `GET` | `.../ListaMinuta/{idAccount}/{status}` | Minutas contables filtradas |
| `GET` | `.../ListaMinutaLegal/{idAccount}/{status}` | Minutas legales filtradas |
| `GET` | `.../Pendientes/{areaResponsable}` | Pendientes por area (Contable/Legal) |

### FundingAccounting
| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| `GET` | `api/FundingAccounting/list/{customerId}` | Listar fondeos contables |

---

## Reglas de Negocio

1. **Inicializacion automatica de periodos:** Al crear un periodo, se inicializan todos los meses desde Septiembre 2024 hasta la fecha actual.
2. **Autorizacion multi-nivel:** Los estados financieros requieren autorizacion antes de ser enviados a los condominos.
3. **Envio masivo con BCC:** Los correos se envian a todos los propietarios del customer con copia oculta a staff/admins. Se adjunta el PDF del estado financiero.
4. **Folios de minutas:** Las minutas contables usan prefijo `CON-` y las legales `LEG-` en sus folios.
